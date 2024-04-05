class PauseMenu extends Phaser.Scene {
    constructor() {
        super('PauseMenu');
    }

    create(data) {

        // 캐릭터 받아오기
        const player = data.player;
        const bgm = data.bgm;


        // 장비창 디자인
        const equipmentPanel = this.add.container(150, 200); // 왼쪽 영역
        const weaponSlots = []; // 무기 슬롯 배열
        const passiveSlots = []; // 패시브 슬롯 배열

        // 매니저 객체 만들어서 인스턴스 접근 ㅇㅇ
        const playerManager = new PlayerManager(player);

        // 플레이어 스탯~
        const playerData = playerManager.getPlayerData();

        // 무기 슬롯 생성
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 5; j++) {
                const x = j * 90;
                const y = i * 90;
                const rect = this.add.rectangle(x, y, 80, 80, 0xFFE4E1);
                equipmentPanel.add(rect);
                weaponSlots.push(rect);
            }
        }

         // 패시브 슬롯 생성 (실제 게임에서는 동적으로 생성)
         console.log(playerManager.getPassives());
         // playerManager.getPassives().length = 나중에 이걸로 변경해주세요.. 현재는 걍 10으로 구조 보는중
         const numPassiveSlots = Math.min(10, 20); // 뒤는 맥스치임
         for (let i = 0; i < numPassiveSlots; i++) {
             const x = (i % 5) * 90;
             const y = (Math.floor(i / 5) + 2) * 90; // 무기 슬롯 아래에 표시
             const rect = this.add.rectangle(x, y, 80, 80, 0x00FF00);
             equipmentPanel.add(rect);
             passiveSlots.push(rect);
         }

         // 캐릭터 스탯 디자인
         const statsPanel = this.add.container(650, 175); // 오른쪽 영역
         const playerStats = [
            `Level: ${playerData.level}`,
            `Experience: ${playerData.experience}`,
            `Health: ${playerData.health}`,
            `Speed: ${playerData.speed}`,
            `Attack Power: ${playerData.attackPower}`,
            `Attack Speed: ${playerData.attackSpeed}`,
            `Range: ${playerData.range}`,
            `Critical: ${playerData.critical}`,
            `Avoidance: ${playerData.avoidance}`,
            `Defense: ${playerData.defense}`,
            `Max Equipment: ${playerData.maxEquipment}`,
            `Luck: ${playerData.luck}`,
            `Absorption: ${playerData.absorption}`
        ];
 
         playerStats.forEach((stat, index) => {
             const text = this.add.text(0, index * 30, stat, { fill: '#ffffff', fontSize:24 });
             statsPanel.add(text);
         });

        // 재개 버튼 추가
        const resumeButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 30, 'Resume', { fill: '#ffffff', fontSize: 30});
        resumeButton.setOrigin(0.5).setInteractive();
        resumeButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('StageSuperMario');
            bgm.resume();
        });

        // ESC 키 이벤트 수정
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.resume('StageSuperMario');
            bgm.resume();
        });

// 게임 종료 버튼 추가
const exitButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height-60, 'Exit Game', { fill: '#ffffff', fontSize: 30 });
exitButton.setOrigin(0.5).setInteractive();

exitButton.on('pointerdown', () => {
    // 게임 종료 확인 다이얼로그 표시
    this.scene.pause('PauseMenu');
    this.scene.launch('ExitConfirmation');
});




    }

}