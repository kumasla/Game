
    class StageSuperMario extends Phaser.Scene {
        constructor(data) {
            super('StageSuperMario');
            this.masterController;
            this.player;        
            this.stageTimer;
            this.stageDuration = 30; // 스테이지 지속 시간 (초)
            this.currentStage = 1;
            this.timerText;
            this.timer;

            this.healthBar;
            this.expBar;

            this.bgm;
            this.paused =false; //일시정지 유무
        }

        init(data) {
            this.characterName = data.characterName;
        }
        

        preload() {
            // 맵.. 일단 단일로 했음.
            this.load.image('space', 'assets/background/map/map13.png');

            // 미사일 몬스터 관련 이미지
            this.load.image('missile','assets/attack/attack.png');
            this.load.image('explosion', 'assets/effects/explosion.png');
            this.load.image('expBead', 'assets/attack/expBead.png');
            this.load.spritesheet('bonusBox', 'assets/item/itemBox.png',{ frameWidth: 34, frameHeight: 46 });

            this.load.spritesheet('monster1', 'assets/monster/굼바(마리오).png', {
                frameWidth: 16,
                frameHeight: 16,
            });
            this.load.spritesheet('monster2', 'assets/monster/찐위들.png', {
                frameWidth: 30,
                frameHeight: 25
            });
            this.load.spritesheet('monster3', 'assets/monster/쿵쿵.png', {
                frameWidth: 33,
                frameHeight: 32
            });


            // 보스
            this.load.spritesheet('bossSprite', 'assets/boss/가논(젤다).png', {
                frameWidth: 33,
                frameHeight: 32
            });


            //캐릭터 이미지 - 김용우
            this.load.spritesheet('megaman', 'assets/player/megaman.png', {frameWidth: 1056, frameHeight: 1056});
            this.load.json('characterData', 'js/character/character.json');

            this.load.json('weaponData', 'js/character/weapon.json');
            
            //아이템 에셋 추가
            const assetList = [
                {name : 'justSword', path : 'assets/weapon/검/그냥검.png'},
                {name : 'thief\'sSword', path : 'assets/weapon/검/도적단의나무검.png'},
                {name : 'flameBlade', path : 'assets/weapon/검/염화도.png'},
                {name : 'meltedBlade', path : 'assets/weapon/검/지구온난화로녹는검.png'},
                {name : 'chickenLeg', path : 'assets/weapon/둔기/닭다리.png'},
                {name : 'stoneSword', path : 'assets/weapon/둔기/돌검.png'},
                {name : 'fireExtinguisher', path : 'assets/weapon/둔기/소화기.png'},
                {name : 'suckerPunch', path : 'assets/weapon/둔기/일단맞자.png'},
                {name : 'dumbble', path : 'assets/weapon/둔기/헬린이의덤벨.png'},
                {name : 'golem\'sShield', path : 'assets/weapon/방패/골렘의방패.png'},
                {name : 'someone\'sShield', path : 'assets/weapon/방패/누군가의방패.png'},
                {name : 'inferno', path : 'assets/weapon/방패/인페르노방패.png'},
                {name : 'beamShotgun', path : 'assets/weapon/샷건/광선집중샷건.png'},
                {name : 'rayGun', path : 'assets/weapon/소총/광난사소총.png'},
                {name : 'rifle', path : 'assets/weapon/소총/소총.png'},
                {name : 'eggGun', path : 'assets/weapon/소총/알발사기.png'},
                {name : 'flareGun', path : 'assets/weapon/소총/플레어건.png'},
                {name : 'sniperRifle', path : 'assets/weapon/저격총/공허대물저격총.png'},
                {name : 'crossbowGun', path : 'assets/weapon/저격총/작살총.png'},
                {name : 'kar98', path : 'assets/weapon/저격총/카구팔.png'},
                {name : 'drizzle', path : 'assets/weapon/중화기/가랑비.png'},
                {name : 'automaticRocketLauncher', path : 'assets/weapon/중화기/자동발사로켓런처.png'},
                {name : 'hellfireLauncher', path : 'assets/weapon/중화기/지옥불 발사기.png'},
                {name : 'rocketLancer', path : 'assets/weapon/창/로켓창.png'},
                {name : 'cursedUnwol-Do', path : 'assets/weapon/창/저주받은언월도.png'},
                {name : 'azureHalberd', path : 'assets/weapon/창/푸른할버드.png'}
            ]

            assetList.forEach(asset => {
                this.load.image(asset.name, asset.path);
            });
            

            // 사운드
            this.load.audio('standardBGM', 'assets/sounds/SonicStageBGM.mp3');

            
        }

        create() {
            this.masterController = new MasterController(this);

            // 캐릭터 네임 보내기 // 이 씬 init에서 받아진 데이터임
            const selectedCharacterName = this.characterName;
            this.player = this.masterController.init(selectedCharacterName);

            this.load.image('space', 'assets/background/map/seeJustSpace.png');

            let image;

            this.load.once('complete', () => {
                image = this.add.image(50, 50, 'space').setOrigin(0);

                const desiredWidth = 1500;
                const desiredHeight = 1500;
                image.setScale(desiredWidth / image.width, desiredHeight / image.height);
                image.setDepth(-1);

                this.physics.world.setBounds(50, 50, image.displayWidth, image.displayHeight);

                // 캐릭터의 물리세계 여백의 2배만큼 띄어주면 오른쪽이랑 아래도 여백이 생김 ㅇㅇ
                this.cameras.main.setBounds(0, 0, image.displayWidth + 100, image.displayHeight + 100);

                this.cameras.main.on('cameraresize', () => {
                    pauseButton.setPosition(this.cameras.main.width - 10, 10);
                });
            });
            
            this.load.start();

            this.player.setCollideWorldBounds(true); 
            this.cameras.main.startFollow(this.player);

            // 사운드
            this.bgm = this.sound.add('standardBGM', { loop: true, volume: 0.3});
            this.bgm.play();

            // 일시정지 기능 / 버튼
            const pauseButton = this.add.text(game.config.width - game.config.width / 10, 10, 'Pause', { fill: '#ffffff' });
            pauseButton.setOrigin(1, 0).setInteractive().setScrollFactor(0);
            pauseButton.on('pointerdown', () => {
                const characterStatus = this.masterController.getCharacterStatus();
                const weapons = this.masterController.getWeapons();
                this.scene.launch('PauseMenu', { player:this.player, bgm:this.bgm, characterStatus: characterStatus, weapons:weapons});
                this.scene.pause();
                this.bgm.pause();
            });

            // ESC 키 이벤트 수정
            this.input.keyboard.on('keydown-ESC', () => {
                if (!this.scene.isPaused()) {
                    const characterStatus = this.masterController.getCharacterStatus();
                    const weapons = this.masterController.getWeapons();
                    this.scene.launch('PauseMenu', { player:this.player, bgm:this.bgm, characterStatus: characterStatus, weapons:weapons});
                    this.scene.pause();
                    this.bgm.pause();
                }
            });

            this.timerText = this.add.text(game.config.width / 2, 16, '300초', { fontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5, 0) // 텍스트의 중앙을 x축 기준으로 설정
            .setScrollFactor(0);
            this.startItemSelectionScene();

            // 체력 바 배경 설정
            this.healthBarBackground = this.add.graphics();
            this.healthBarBackground.fillStyle(0x000000, 0.2); // 투명한 검은색 배경
            this.healthBarBackground.fillRoundedRect(10, 10, 300, 20, 5); // 위치 조정 (Y축을 경험치 바보다 위로)
            this.healthBarBackground.lineStyle(2, 0xffffff, 1); // 하얀색 테두리 설정
            this.healthBarBackground.strokeRoundedRect(10, 10, 300, 20, 5); // 하얀색 테두리 추가

            // 실제 체력 바 300이 max라고 보고 이쪽을 업데이트 해주면 됨
            this.healthBarFill = this.add.graphics();
            this.healthBarFill.fillStyle(0xff0000, 1); // 불투명한 빨간색
            this.healthBarFill.fillRoundedRect(10, 10, 300, 20, 5); // 체력 100% 상태

            // 경험치 바 배경 설정 (체력 바 코드 아래에 배치)
            this.expBarBackground = this.add.graphics();
            this.expBarBackground.fillStyle(0x000000, 0.2); // 투명한 검은색 배경
            this.expBarBackground.fillRoundedRect(10, 40, 300, 20, 5); // 위치, 크기, 둥근 모서리
            this.expBarBackground.lineStyle(2, 0xffffff, 1); // 하얀색 테두리 설정
            this.expBarBackground.strokeRoundedRect(10, 40, 300, 20, 5); // 하얀색 테두리 추가

            // 실제 경험치 바 300이 max라고 보고 이쪽을 업데이트 해주면 됨
            this.expBarFill = this.add.graphics();
            this.expBarFill.fillStyle(0x00ff00, 1); // 불투명한 초록색
            this.expBarFill.fillRoundedRect(10, 40, 0, 20, 5); // 초기 경험치 0%

            // 체력 바와 경험치 바를 화면 상단에 고정
            this.healthBarBackground.setScrollFactor(0);
            this.healthBarFill.setScrollFactor(0);
            this.expBarBackground.setScrollFactor(0);
            this.expBarFill.setScrollFactor(0);
        }

        //cre 끝        // update 시작

        update() {
            if(!this.paused) {
                this.masterController.update();
            }

            this.updateTimerText(this.stageTimer.getRemainingSeconds());  
        }
        
        
        showItemSelectionScene() {
            this.scene.pause();
            const characterStatus = this.masterController.getCharacterStatus();
            const weapons = this.masterController.getWeapons();

            this.startItemSelectionScene();

            this.scene.launch('ItemSelectionScene', { player: this.player, characterStatus : characterStatus, weapons:weapons});
            
            this.masterController.updateStage();

            // 플레이어 가운데로 이동시키기 나중에.. 아마 맵의 크기를 기준으로 옮기게 해야하지 않을까나
            this.player.setPosition(game.config.width / 2, game.config.height / 2);
        }

        startItemSelectionScene() {
            this.stageTimer = this.time.delayedCall(this.stageDuration * 1000, this.showItemSelectionScene, [], this);
        }

        updateTimerText(seconds) {
            const totalSeconds = Math.floor(seconds); // 소수점 이하를 버림하여 정수로 만듦
            this.timerText.setText(`남은 시간 : ${totalSeconds}`).setOrigin(0.5, 0); // 화면 상단 중앙에 위치
        }

        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
        
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        
            return `${formattedMinutes}:${formattedSeconds}`;
        }


        // 게임 일시정지 함수
        pauseGame() {
            this.scene.pause();
            this.paused = true;
            //standardBGM
            if(this.bgm) {
                this.bgm.pause();
            }

            // 일시정지 시 메뉴scene 여기 추가
        }

        // 게임 재개 함수
        resumeGame() {
            this.scene.resume();
            this.paused = false;

            if(this.bgm) {
                this.bgm.resume();
            }
        }

        gameOver() {
            this.scene.transition({
                target: 'EndingScene',
                duration: 2000,
                moveAbove: true,
                onUpdate: this.fadeOutCallback,
                data: {
                    characterStatus: this.masterController.getCharacterStatus(),
                    weapons: this.masterController.getWeapons()
                }
            });
        }

    }
