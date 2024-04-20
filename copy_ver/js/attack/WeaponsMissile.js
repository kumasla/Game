class WeaponMissile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, weapon){
        super(scene, x, y, 'missile');
        this.scene = scene;

        this.weapon = weapon;

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

        let byTypeCheckCollision;

        if(this.weapon.type == 'rifle' || this.weapon.type == 'sniper'){
            byTypeCheckCollision = (missile, monster) => this.checkCollisionJustMissile(missile, monster, weaponDamage);
        }else if(this.weapon.type == 'shotgun'){
            //byTypeCheckCollision = (missile, monster) => this.checkCollisionShotGunMissile(missile, monster, weaponDamage);
        }else if(this.weapon.type == 'artillery'){
            byTypeCheckCollision = (missile, monster) => this.checkCollisionArtillery(missile, monster, weaponDamage);
        }else if(this.weapon.type == 'artillery-bomb'){
            const targetX = x + Math.cos(angle) * this.weapon.range; // 최종 목표 x 위치
            const targetY = y + Math.sin(angle) * this.weapon.range; // 최종 목표 y 위치


            //충돌하지 않아도 해당지점에 도착하면 터질 수 있게 만듬
            this.scene.tweens.add({
                targets: this,
                x: targetX,
                y: targetY,
                duration: this.weapon.range / this.speed * 1000, // 이동 시간 계산
                onComplete: () => {
                    this.explodeMisiile(targetX, targetY, weaponDamage); // 이동 완료 후 폭발
                }
            });
            byTypeCheckCollision = (missile, monster) => this.checkCollisionBomb(missile, monster, weaponDamage);
        }


        this.scene.physics.add.overlap(
            this, monsters,
            (missile, monster) => byTypeCheckCollision(missile, monster, weaponDamage),
            null, // 처리할 추가적인 조건이 없으므로 null을 전달합니다.
            this // 콜백 함수 내에서 this가 미사일 객체를 참조하도록 합니다.
        );

        return this;
    }

    //폭발 중화기
    checkCollisionBomb(missile, monster, damage){
        this.explodeMisiile(monster.x, monster.y, damage);
        missile.destroy();
    }

    // x = 충돌한 몬스터의 x값, y = 충돌한 몬스터의 y 값
    explodeMisiile(x, y, weaponDamage){
        if(this.active){
            //모든 몬스터들을 가지고옴
            const monsters = this.scene.masterController.monsterController.getMonsters();

            //모든 몬스터를 순회하면서 폭발범위안에 있는 몬스터들을 filter함수를 이용해서 바로 집어넣음
            const inRangeMonster = monsters.getChildren().filter(monster => {
                const distance = Phaser.Math.Distance.Between(monster.x, monster.y, x, y);
                return distance <= this.weapon.bombScale;
            });

            //위에서 만들어진 범위 안 몬스터들을 순회하면서 데미지 부여
            inRangeMonster.forEach(monster => {
                monster.hit(weaponDamage);
            });

            this.destroy();
        }
    }

    // 무기가 몬스터 때리기
    checkCollisionJustMissile(missile, monster, damage) {
        monster.hit(damage);
        missile.destroy();
    }

    //일반 중화기
    checkCollisionArtillery(missile, monster, damage){

    }

    
}