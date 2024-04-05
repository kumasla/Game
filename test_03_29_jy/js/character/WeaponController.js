class WeaponController{
    constructor(scene, player){
        this.scene = scene;
        this.player = player;
        this.graphics = scene.add.graphics();

        this.weapons = [];

        this.weaponPlace = {
            0 : { offSetX: 100, offSetY: -100},
            1 : { offSetX: 150, offSetY: 0},
            2 : { offSetX: 100, offSetY: 100},
            3 : { offSetX: -100, offSetY: 100},
            4 : { offSetX: -150, offSetY: 0},
            5 : { offSetX: -100, offSetY: -100}
        }
    }

    update(){
        this.graphics.clear();
        let currentWeaponPlace = [];

        for(let i = 0; i < this.weapons.length; i++){
            
            const currentWeapon = this.weapons[i];

            if(currentWeapon.length > 1){
                if(currentWeapon.image){
                    currentWeaponPlace.splice(0,2);
                    currentWeapon.image.x = this.player.x + this.weaponPlace[i].offSetX;
                    currentWeapon.image.y = this.player.y + this.weaponPlace[i].offSetY;
                    currentWeaponPlace.push(currentWeapon.image.x, currentWeapon.image.y);

                    
                }
            }else{
                if(currentWeapon.image){
                    currentWeapon.image.x = this.player.x + this.weaponPlace[i].offSetX;
                    currentWeapon.image.y = this.player.y + this.weaponPlace[i].offSetY;
                    currentWeaponPlace.push(currentWeapon.image.x, currentWeapon.image.y);
                }
            }

            /* if (currentWeapon.name) {
                // 해당 무기의 색상으로 원을 그립니다.
                this.graphics.lineStyle(5, currentWeapon.color); // 원의 색상을 무기의 'color' 속성 값으로 설정
                this.graphics.setDepth(2);
                this.graphics.strokeCircle(this.player.x, this.player.y, currentWeapon.range + this.scene.masterController.characterController.range);
            } */
        }

        const monsters = this.scene.masterController.monsterController.getMonsters();
        for (let i = 0; i < this.weapons.length; i++) {
            let weapon = this.weapons[i];

            let closestMonster = null;
            let closestDistance = Infinity; // 가장 가까운 몬스터와의 거리는 초기에 무한대로 설정 (전체 순환을 위한것)

            monsters.children.each(monster => {
                let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, monster.x, monster.y);

                if(distance < closestDistance){
                    closestDistance = distance; // 더 짧은 거리를 찾으면 업데이트
                    closestMonster = monster; // 가장 가까운 몬스터 업데이트
                }
            });
    
            if (closestMonster && closestDistance <= weapon.range) {
                if (weapon.lastAttackedMonster != closestMonster) {
                    weapon.lastAttackedMonster = closestMonster;  // 가장 가까운 몬스터 정보 업데이트
                    weapon.inRange = true;
                }
    
                // 가장 가까운 몬스터가 여전히 범위 안에 있다면, 계속해서 공격
                if (weapon.inRange && weapon.type == "sniper") {
                    const angle = Phaser.Math.Angle.Between(currentWeaponPlace[0], currentWeaponPlace[1], closestMonster.x, closestMonster.y);
                    this.fireWeapon(weapon, closestMonster.x, closestMonster.y, angle);
                }
            } else {
                if (weapon.inRange) {
                    weapon.inRange = false;
                    //console.log(`범위 밖: 무기 ${weapon.name}`);
                }
                weapon.lastAttackedMonster = null;  // 가장 가까운 몬스터 정보 초기화
            }
        }
    }

    fireWeapon(weapon, x, y, angle) {
        if (!weapon.lastFired || this.scene.time.now - weapon.lastFired > weapon.fireRate) {
            weapon.lastFired = this.scene.time.now;
            const missile = new WeaponMissile(this.scene, weapon.image.x, weapon.image.y);
            missile.fire(weapon.image.x, weapon.image.y, angle);
        }
    }

    // 아이템 씬에서 리스트 뽑아서 호출
    getWeapons(weapon){
        const weaponData = this.scene.cache.json.get('weaponData'); // preload에 있는 json 데이터를 가지고 옴
        this.addWeapon(weapon, weaponData[weapon]);
        return;
    }

    addWeapon(weapon, weaponData){
        const weaponCopy = Object.assign({}, weaponData);
        this.weapons.push(weaponCopy);

        for (let i = 0; i < this.weapons.length; i++) {
            // 이미 생성된 이미지가 있으면 새로 생성 x
            if (!this.weapons[i].image) {
                const weaponImage = this.scene.add.image(this.player.x + this.weaponPlace[i].offSetX, this.player.y + this.weaponPlace[i].offSetY, this.weapons[i].name);
                weaponImage.setDepth(1);
                this.weapons[i].image = weaponImage;
            } else {
                // 이미지가 이미 있으면 위치만 업데이트
                this.weapons[i].image.setPosition(this.player.x + this.weaponPlace[i].offSetX, this.player.y + this.weaponPlace[i].offSetY);
            }
        }
    }

    //무기 제거용 함수
    removeWeapon(index){
        this.weapons.splice(index, 1);
    }

    getItems(){
        //
    }

    getPassive(){
        //
    }
}

