class Monster1 extends Monster {
    constructor(scene, x, y,player) {
        super(scene, x, y, 'monster1',player);
        
        this.setScale(2); // 몬스터 크기 조정
        this.setCollideWorldBounds(true); // 화면 경계와 충돌
        this.setBounce(1); // 튕기기 설정
        this.speed = Phaser.Math.Between(50, 100); // 몬스터의 이동 속도를 랜덤하게 설정합니다.

        this.setupAnimations();

    }

    setupAnimations() {
        const animation = this.scene.anims.get('walk_monster1');

        if(!animation){
            this.scene.anims.create({
                key: 'walk_monster1',
                frames: [
                    { key: 'monster1', frame: 0 },
                    { key: 'monster1', frame: 1 },
                ],
                frameRate: 3,
                repeat: -1
            });

        }
        this.play('walk_monster1');
    }


}