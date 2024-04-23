class EffectController{
    constructor(scene) {
        this.scene = scene;
        this.init();
    }

    init(){
        this.scene.anims.create({
            key: 'effect',
            frames: this.scene.anims.generateFrameNumbers('effect', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0
        });
    }

    playEffectAnimation(x, y,effectName) {
        // 애니메이션을 재생할 스프라이트 생성
        const effectSprite = this.scene.add.sprite(x, y, effectName);
        
        // 애니메이션 설정
        effectSprite.anims.play(effectName);

        // 애니메이션 종료 후 제거
        effectSprite.once('animationcomplete', () => {
            effectSprite.destroy();
        });
    }
}