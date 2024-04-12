/**
 * 게임 라운드 클래스
 */
class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
        this.bgm;
    }

    // init(data) {
        
    //     this.num = data.test;
    //     console.log(data);
    //     console.log(this.num);
    // }

    preload(){ // 사전설정
        this.load.image('background', 'assets/background/mountine.png');
        this.load.image('button', 'assets/buttons/blue_button.png');
        this.load.audio('joinSceneVoice', 'assets/sounds/pixelHeroseVoiceMechanick.mp3');
        this.load.audio('lobyBGM', 'assets/sounds/lobyBGM.mp3');
        
    }
    create(){ // 생성

        
        // 사운드
        this.bgm = this.sound.add('lobyBGM', { loop: true, volume: 0.3, rate: 1.25});
        this.bgm.play();
        
        // 일단 여기는 되어있긴한데.. 냅둠
        const webWidth =  config.width;
        const webHeight = config.height;

        this.joinSceneVoice = this.sound.add('joinSceneVoice', { loop: false, volume: 0.3});
        // 나중에 Loading.js 씬 완성하고 넘어온 후에 자연스러운 타이밍에 소리나도록
        // 예를들면 딜레이 0.5 정도 걸어서 화면이 눈에 보이고 소리 ㄱㄱ
        this.joinSceneVoice.play();
        
        const{x,y,width,height} = this.cameras.main;
        this.background = this.add.tileSprite(x, y, width, height, 'background')
                            .setOrigin(0).setScrollFactor(0,1);

        const center = {
            x : x + width/2,
            y : y + height/2
        }

        this.title = this.add.text(
            center.x,
            height * 1/10,
            'Pixel Heroes'
        )
        .setFill('#f55a42')
        .setFontSize(100)
        .setOrigin(0.5)
        .setDepth(999)
        .setAlign('center');

        this.buttons = [];

        const buttonCount = 4;
        const verticalSpacing = 100;

        for(let i = 0; i < buttonCount; i++){
            const button = this.add.image(
                center.x,
                center.y + (i - (buttonCount - 1) / 2) * verticalSpacing,
                'button'
            ).setInteractive().setDepth(50);

            button.setScale(0.3, 0.2);

            button.on('pointerdown', () => {
                switch (i) {
                    case 0 :
                        this.scene.start('CharacterSelect',{ lobyBGM : this.bgm}); // 캐릭터 선택창
                        break;
                    case 1 :
                        this.scene.start(); // 옵션 선택창
                        break;
                    case 2 :
                        this.scene.start(); // 랭킹순위표 
                        break;
                    case 3 :
                        this.scene.start(); // 개발자 소개로
                        break;
                    default:
                        break;
                }
            });

            this.buttons.push(button);
        }

        this.clickToSelect = this.add.text(
            center.x,
            center.y - 155,
            'Click to select' 
        )
        .setFill('#f55a42')
        .setDepth(999)
        .setOrigin(0.5)
        .setAlign('center')
        .setFontSize(30);

        this.options = this.add.text(
            center.x,
            center.y - 55,
            'Options' 
        )
        .setFill('#f55a42')
        .setDepth(999)
        .setOrigin(0.5)
        .setAlign('center')
        .setFontSize(30);

        this.ranking = this.add.text(
            center.x,
            center.y + 50,
            'Ranking' 
        )
        .setFill('#f55a42')
        .setDepth(999)
        .setOrigin(0.5)
        .setAlign('center')
        .setFontSize(30);

        this.developers = this.add.text(
            center.x,
            center.y + 150,
            'Developers' 
        )
        .setFill('#f55a42')
        .setDepth(999)
        .setOrigin(0.5)
        .setAlign('center')
        .setFontSize(30);



    }
    update(){ // 변경(갱신)

    }
}