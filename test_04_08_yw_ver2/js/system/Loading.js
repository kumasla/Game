/**
 * 로딩화면 클래스
 */


class Loading extends Phaser.Scene {

    constructor(){
        super({ key: 'Loading'}); // 이 클래스 사용 시 식별자
    }

    preload(){ 
        this.load.image('background', 'assets/background/mountine.png');
    }
    create(){ 
        console.log(config);
        console.log(game.config);
        console.log(config.width);
        console.log(config.height);

        //
        const{x,y,width,height} = this.cameras.main;
        this.background = this.add.tileSprite(x, y, width, height, 'background')
                            .setOrigin(0).setScrollFactor(0,1);

        const center = {
            x : x + width/2,
            y : y + height/2
        }

        this.title = this.add.text(
            center.x,
            height * 1/4,
            'Pixel Heroes'
        )
        .setFill('#f55a42')
        .setFontSize(100)
        .setOrigin(0.5)
        .setDepth(999)
        .setAlign('center')
        this.clickToStart = this.add.text(
            center.x,
            height * 3/4,
            'Click to start'
        )
        .setFill('#f55a42')
        .setFontSize(50)
        .setOrigin(0.5)
        .setDepth(999)
        .setAlign('center');

        this.tweens.add({
            targets: this.clickToStart,
            alpha: 0,
            duration: 500,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        })

        this.input.once('pointerdown', () =>{
            // this.test="인자넘기기";
            //, data:{test:this.test}
            this.scene.transition({target:'MainMenu', duration:500});
        });

    }

    update(){ // 변경(갱신)

    }
}


