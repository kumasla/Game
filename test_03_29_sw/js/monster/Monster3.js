class Monster3 extends Monster {
    constructor(scene, x, y,player) {
        super(scene, x, y, 'monster3',player);
        this.scene =scene;
        this.setScale(2); // 몬스터 크기 조정
        this.setCollideWorldBounds(true); // 화면 경계와 충돌
        this.setBounce(1); // 튕기기 설정
        this.speed = Phaser.Math.Between(50, 100); // 몬스터의 이동 속도를 랜덤하게 설정합니다.

        this.fireRate = 1500; // 1초마다 발사
        this.nextFire = 0;

        this.setupAnimations();
    }

    setupAnimations() {
        const animation = this.scene.anims.get('walk_monster3');

        if(!animation){
            this.scene.anims.create({
                key: 'walk_monster3',
                frames: [
                    { key: 'monster3', frame: 0 },
                    { key: 'monster3', frame: 2 },
                ],
                frameRate: 3,
                repeat: -1
            });
        }
        this.play('walk_monster3');
    }


    update(){
        super.update();
        if (this.scene.time.now > this.nextFire) {
            const missile = new Missile(this.scene, this.x, this.y);

            this.scene.masterController.monsterController.missilesGroup.add(missile);

            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
            missile.fire(this.x, this.y, angle);
            this.nextFire = this.scene.time.now + this.fireRate;
        }
    }
}