class WeaponMissile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, weapon){
        super(scene, x, y, 'missile');
        this.scene = scene;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setScale(weapon.missileScale); //미사일 크기

        this.speed = weapon.missileSpeed; //미사일 속도
    }

    fire(x, y, angle, weaponDamage){
        this.setPosition(x, y);
        this.setRotation(angle);
        this.setVelocityX(Math.cos(angle) * this.speed);
        this.setVelocityY(Math.sin(angle) * this.speed);

        const monsters = this.scene.masterController.monsterController.getMonsters();


        this.scene.physics.add.overlap(
            this, monsters,
            (missile, monster) => this.checkCollision(missile, monster, weaponDamage),
            null, // 처리할 추가적인 조건이 없으므로 null을 전달합니다.
            this // 콜백 함수 내에서 this가 미사일 객체를 참조하도록 합니다.
        );

        return this;
    }

    // 무기가 몬스터 때리기
    checkCollision(missile, monster, damage) {
        monster.hit(damage);
        missile.destroy();
    }
}