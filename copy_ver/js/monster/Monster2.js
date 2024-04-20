class Monster2 extends Monster {
    constructor(scene, x, y, player) {
        super(scene, x, y, 'monster2', player);

        // 몬스터 이미지 생성 시 상하 반전 방지
        this.setFlipY(false);
        
        this.setScale(1.5); // 몬스터 크기 조정
        this.setCollideWorldBounds(true); // 화면 경계와 충돌
        this.setBounce(1); // 튕기기 설정
        this.speed = Phaser.Math.Between(50, 100); // 몬스터의 이동 속도를 랜덤하게 설정합니다.
        this.setupAnimations();

        scene.add.existing(this);
    }

    setupAnimations() {
        const animation = this.scene.anims.get('walk_monster2');

        if(!animation){
            this.scene.anims.create({
                key: 'walk_monster2',
                frames: this.scene.anims.generateFrameNumbers('monster2', {
                    start: 0,
                    end: 2
                }),
                frameRate: 10,
                repeat: -1
            });
        }
        this.play('walk_monster2');
    }

    update() {
        super.update();
    
        const playerX = this.player.x;
    
        if (playerX < this.x) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false); 
        }
    }
    
}
