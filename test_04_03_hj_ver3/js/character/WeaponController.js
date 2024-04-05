class WeaponController{
    constructor(scene, player){
        this.scene = scene;
        this.player = player;

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
        for(let i = 0; i < this.weapons.length; i++){
            //weapons배열을 순환하며 현재 무기를 설정
            const currentWeapon = this.weapons[i];

                //무기의 이미지가 있다면 == 무기가 장착되어 있다면 이미지의 위치를 설정함
                if(currentWeapon.image){
                    currentWeapon.image.x = this.player.x + this.weaponPlace[i].offSetX;
                    currentWeapon.image.y = this.player.y + this.weaponPlace[i].offSetY;
                    currentWeapon.currentX = currentWeapon.image.x;
                    currentWeapon.currentY = currentWeapon.image.y;
                }
        }

        //몬스터 컨트롤러에서 모든 몬스터들을 받아옴
        const monsters = this.scene.masterController.monsterController.getMonsters();

        //다시한번 weapons의 배열을 순환
        for (let i = 0; i < this.weapons.length; i++) {
            let weapon = this.weapons[i];

            //공격을 위한 가장 가까운 몬스터 설정
            let closestMonster = null;

            // 가장 가까운 몬스터와의 거리는 초기에 무한대로 설정 (전체 순환을 위한것)
            let closestDistance = Infinity;

            //몬스터 컨트롤러에서 받아온 몬스터들을 다시 한번 순환하면서 거리를 계산
            monsters.children.each(monster => {
                let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, monster.x, monster.y);

                //가장 가까운 몬스터를 갱신
                if(distance < closestDistance){
                    // 더 짧은 거리를 찾으면 업데이트
                    closestDistance = distance;
                    // 가장 가까운 몬스터 업데이트
                    closestMonster = monster;
                }
            });
    
            //가장 가까운 몬스터가 존재하면서(죽지않았으면서) 가장 가까운 몬스터가 현재 무기의 범위보다 작다라고한다면
            if (closestMonster && closestDistance <= weapon.range) {
                if (weapon.lastAttackedMonster != closestMonster) {
                    //// 가장 가까운 몬스터 정보를 새로 업데이트
                    weapon.lastAttackedMonster = closestMonster;
                }
    
                //몬스터 위치에 따라 몬스터를 바라보도록 만듬과 동시에 무기발사 메소드 실행
                if (weapon.type == "sniper") {
                    const angle = Phaser.Math.Angle.Between(weapon.currentX, weapon.currentY, closestMonster.x, closestMonster.y);
                    weapon.image.setRotation(angle);
                
                    if(closestMonster.x < this.player.x){
                        weapon.image.setScale(1, -1);
                    }else{
                        weapon.image.setScale(1, 1);
                    }
                    
                    this.fireWeapon(weapon, angle);


                }
            }
        }
    }

    //무기 탄환 발사 메소드
    fireWeapon(weapon, angle) {
        if (this.scene.time.now - weapon.lastFired > weapon.fireRate) {
            //무기의 마지막 발사시간을 게임상의 지금으로 설정 (발사 쿨타임을 위한 것)
            weapon.lastFired = this.scene.time.now;
            //탄환 객체를 만들면서 바로 발사
            new WeaponMissile(this.scene, weapon.image.x, weapon.image.y, weapon) //
            .fire(weapon.image.x, weapon.image.y, angle, (weapon.damage * weapon.damageScale), this.scene.masterController.characterController.characterStatus.power);
        }
    }

    //마스터컨트롤러에서 받아온 무기이름으로 제이슨에서 데이터 추출해서 객체로 만든 후 무기 배열안에 추가
    //무기 이름만 보내면 무기가 추가가 됨
    addWeapon(weaponName){
        const selectedWeapon = this.scene.cache.json.get('weaponData')[weaponName];
        const weaponObject = Object.assign({}, selectedWeapon);
        this.weapons.push(weaponObject);

        for (let i = 0; i < this.weapons.length; i++) {
            // 이미 생성된 이미지가 있으면 새로 생성 x
            if (!this.weapons[i].image) {
                const weaponImage = this.scene.add.image(this.player.x + this.weaponPlace[i].offSetX, this.player.y + this.weaponPlace[i].offSetY, this.weapons[i].name);
                weaponImage.setDepth(1);
                this.weapons[i].image = weaponImage;
            } else {
                // 이미지가 이미 있으면 위치만 업데이트
                //this.weapons[i].image.setPosition(this.player.x + this.weaponPlace[i].offSetX, this.player.y + this.weaponPlace[i].offSetY);
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

    getWeapons() {
        return this.weapons;
    }

    //weapons배열 안에 있는 무기 객체의 값을 업데이트하면 객체라서 업데이트된게 유지가됨
        //this.weapons[0].damage = this.weapons[0].damage + 1;
        //console.log(this.weapons[0].damage)
        //console.log(this.weapons)
}

