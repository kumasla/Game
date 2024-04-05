/**
 * 게임 라운드 클래스
 */
class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    // init(data) {
        
    //     this.num = data.test;
    //     console.log(data);
    //     console.log(this.num);
    // }

    preload(){ // 사전설정
        this.load.image('background', 'assets/background/mountine.png');
        this.load.image('button', 'assets/buttons/blue_button.png');
        
    }
    create(){ // 생성
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
                        this.scene.start('CharacterSelect'); // 캐릭터 선택창
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