class WeaponMissile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, 'missile');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(0.1);

        this.speed = 3000;
        
        this.scene = scene;
    }

    fire(x, y, angle){
        this.setPosition(x, y);
        this.setRotation(angle);
        this.setVelocityX(Math.cos(angle) * this.speed);
        this.setVelocityY(Math.sin(angle) * this.speed);

        const monsters = this.scene.masterController.monsterController.getMonsters();

        this.scene.physics.add.overlap(
            this, monsters,
            this.checkCollision,
            null, // 처리할 추가적인 조건이 없으므로 null을 전달합니다.
            this // 콜백 함수 내에서 this가 미사일 객체를 참조하도록 합니다.
        );
    }


    // 무기가 몬스터 때리기
    checkCollision(missile, monster) {
        missile.destroy();
        monster.hit(10);
    }


}