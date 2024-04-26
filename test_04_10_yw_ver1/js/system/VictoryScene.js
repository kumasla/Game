class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
        this.bgm;
    }

    preload(){
        this.load.audio('victoryBGM', 'assets/sounds/victoryBGM.mp3');
    }

    create() {
        this.bgm = this.sound.add('victoryBGM', { loop: true, volume: 0.3});
        this.bgm.play();

        // Not decided yet => 나중에 추가 예정

        const texts = [
            { text: '[Pixel Heroes]', fontSize: '40px', fill: '#ffffff' },
            { text: '[사람들]', fontSize: '20px', fill: '#ffffff' },
            { text: '개발팀 : JDI(Just Do It)', fontSize: '20px', fill: '#ffffff' },
            { text: '크리에이티브 디렉터 : All in', fontSize: '20px', fill: '#ffffff' },
            { text: '프로듀서 : No corresponding occupation', fontSize: '20px', fill: '#ffffff' },
            { text: '프로그래머 : [임화진, 최재영, 김용우, 박성운]', fontSize: '20px', fill: '#ffffff' },
            { text: '자료 총괄 : [박성운]', fontSize: '20px', fill: '#ffffff' },
            { text: '캐릭터 개발자 : [김용우]', fontSize: '20px', fill: '#ffffff' },
            { text: '보스 개발자 : [최재영]', fontSize: '20px', fill: '#ffffff' },
            { text: '몬스터 개발자 : [박성운]', fontSize: '20px', fill: '#ffffff' },
            { text: '시스템 개발자 : [임화진]', fontSize: '20px', fill: '#ffffff' },

            { text: '밸런싱 디자이너 : Not decided yet', fontSize: '20px', fill: '#ffffff' },
            { text: '메커니즘 디자이너 : Not decided yet', fontSize: '20px', fill: '#ffffff' },
            { text: '게임플레이 디자이너 : Not decided yet', fontSize: '20px', fill: '#ffffff' },
            { text: '유저 스트레스 설계 : Not decided yet', fontSize: '20px', fill: '#ffffff' },
            { text: '몬스터 디자이너 : Not decided yet', fontSize: '20px', fill: '#ffffff' },
            { text: '내러티브 디자이너 : Not decided yet', fontSize: '20px', fill: '#ffffff' },

            { text: '사운드 : All in', fontSize: '20px', fill: '#ffffff' },
            { text: '작가 : Not decided yet', fontSize: '20px', fill: '#ffffff' },
            { text: '테스터(QA) : Not decided yet', fontSize: '20px', fill: '#ffffff' },
            { text: '컨셉 아티스트 : All in', fontSize: '20px', fill: '#ffffff' },

            { text: '[Developer]', fontSize: '20px', fill: '#ffffff' },
            { text: '게임 엔진 : Phaser3 라이브러리', fontSize: '20px', fill: '#ffffff' },
            { text: 'Tools : VSCode, Notion, Github', fontSize: '20px', fill: '#ffffff' },
            { text: '클라이언트 : Not decided yet', fontSize: '20px', fill: '#ffffff' },
            { text: '네트워크 : Not decided yet', fontSize: '20px', fill: '#ffffff' },
            { text: '서버 : Not decided yet', fontSize: '20px', fill: '#ffffff' },

            
            { text: '감사의 말: 여기에 개발자가 특별히 감사를 전하고 싶은 사람들에 대한 감사의 말을 작성합니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '특별 감사: 게임 제작에 협력하거나 지원한 단체나 개인에 대한 특별한 감사의 글을 적습니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '음악:', fontSize: '20px', fill: '#ffffff' },
            { text: '[음악 작곡가1]: [음악 제목1]', fontSize: '20px', fill: '#ffffff' },
            { text: '[음악 작곡가2]: [음악 제목2]', fontSize: '20px', fill: '#ffffff' },
            { text: '로컬라이제이션 (지역화): [로컬라이제이션 담당자명]', fontSize: '20px', fill: '#ffffff' },
            { text: '특별 감사: 게임 제작에 협력하거나 지원한 단체나 개인에 대한 특별한 감사의 글을 적습니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
            { text: '제작에 참여한 모든 분들께 감사의 말씀을 올립니다.', fontSize: '20px', fill: '#ffffff' },
        ];

        
        const startY = 100;
        const spacing = 50;

        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height * 6 + texts.length * spacing, 0x000000);
        overlay.setOrigin(0);

        for (let i = 0; i < texts.length; i++) {
            this.add.text(400, startY + i * spacing, texts[i].text, {fontSize : texts[i].fontSize, fill: texts[i].fill}).setOrigin(0.5);
        }

        this.scrollSpeed = 1;

        this.tweens.add({
            targets: this.cameras.main,
            scrollY: { value: this.cameras.main.scrollY, duration: 1000 },
            duration: 2000,
            onComplete: () => {
                // 2초 후에 MainMenu 씬으로 전환
                this.time.delayedCall(20000, () => {
                    console.log('123123');

                    const thankYouText = this.add.text(
                        280,
                        this.cameras.main.scrollY + this.cameras.main.height - startY * 2,
                        '지금까지 플레이해주셔서 감사합니다',
                        { fontSize: '40px', fill: '#ffffff' }
                    );

                    this.time.delayedCall(6000, () => {
                        this.scene.stop('StageSuperMario');
                        this.scene.stop('VictoryScene');
                        this.bgm.stop();
                        this.scene.start('MainMenu');

                    })
                    
                });
            }
        });
    }

    update(){
        this.cameras.main.scrollY += this.scrollSpeed;
    }
}