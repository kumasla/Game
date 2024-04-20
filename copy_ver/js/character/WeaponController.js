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

        this.ownTag = {};       //무기로 인해 보유한 태그

        this.weaponMissilesGroup = scene.physics.add.group(); // 미사일 그룹생성
    }

    update(){
        this.updateWeaponPosition();

        //몬스터 컨트롤러에서 모든 몬스터들을 받아옴
        const monsters = this.scene.masterController.monsterController.getMonsters();

        //다시한번 weapons의 배열을 순환
        for (let i = 0; i < this.weapons.length; i++) {
            const weapon = this.weapons[i];

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
                const angle = Phaser.Math.Angle.Between(weapon.currentX, weapon.currentY, closestMonster.x, closestMonster.y);

                if(weapon.type == 'sniper' || weapon.type == "rifle" || weapon.type.includes("artillery")){
                    /* if(closestMonster != null){
                        weapon.image.setRotation(angle);
                    }else{
                        weapon.image.setRotation(weapon.initialAngle);
                    } */
                    
                    weapon.image.setRotation(angle);
                    if(closestMonster.x < weapon.currentX){
                        weapon.image.setScale(weapon.weaponScale, -weapon.weaponScale);
                    }else{
                        weapon.image.setScale(weapon.weaponScale, weapon.weaponScale);
                    }
                }
                

                switch(true){
                    case weapon.type == "sniper": case weapon.type == "rifle" : case weapon.type == "artillery" : case weapon.type == "artillery-bomb" :
                        this.fireWeapon(weapon, angle);
                        break;
                        
                    case weapon.type == "shotgun" :
                        this.fireWeapon(weapon, angle);
                        break;

                    case weapon.type == "sword": case weapon.type == "mace": case weapon.type == "polearm":
                        this.rotatingAttack(weapon, angle, closestMonster.x, closestMonster.y);
                        break;

                    case weapon.type == "shield": case weapon.type == "lancer":
                        this.rotatingAttack(weapon, angle, closestMonster.x, closestMonster.y);
                        break;
                }
                
            }
        }
    }

    //무기 탄환 발사 메소드
    fireWeapon(weapon, angle) {
        if (this.scene.time.now - weapon.lastFired > (weapon.nowFireRate)) {
            //무기의 마지막 발사시간을 게임상의 지금으로 설정 (발사 쿨타임을 위한 것)
            weapon.lastFired = this.scene.time.now;
            
            //탄환 객체 생성
            const weaponMissile = new WeaponMissile(this.scene, weapon.image.x, weapon.image.y, weapon);

            //생성 후 미사일 그룹에 추가
            this.weaponMissilesGroup.add(weaponMissile);

            //발사
            weaponMissile.fire(weapon.image.x, weapon.image.y, angle, weapon.damage);
        }
    }

    //마스터컨트롤러에서 받아온 무기이름으로 제이슨에서 데이터 추출해서 객체로 만든 후 무기 배열안에 추가
    //무기 이름만 보내면 무기가 추가가 됨
    addWeapon(weaponName){
        const selectedWeapon = this.scene.cache.json.get('weaponData')[weaponName];
        const weaponObject = Object.assign({}, selectedWeapon);
        this.weapons.push(weaponObject);

        for (let i = 0; i < this.weapons.length; i++) {
            let weaponImage;
            // 이미 생성된 이미지가 있으면 새로 생성 x
            if (!this.weapons[i].image) {
                weaponImage= this.scene.add.image(this.player.x + this.weaponPlace[i].offSetX, this.player.y + this.weaponPlace[i].offSetY, this.weapons[i].name);
                weaponImage.setDepth(1);
                weaponImage.setScale(selectedWeapon.weaponScale);
                this.weapons[i].image = weaponImage;
            }
        }
        
        //태그를 추가하면서 현재 캐릭터의 정보를 return받아옴
        const characterData = this.updateOwnTag("add", selectedWeapon.tag);

        //return 받아온 캐릭터의 정보로 무기의 정보를 업데이트
        this.updateWeaponData(characterData);
    }




    //태그를 객체내에 추가(보유한 태그 숫자만 추가)
    updateOwnTag(control, tag){
        if(control == 'add'){
            if(this.ownTag[tag]){
                this.ownTag[tag] += 1;
            }else{
                this.ownTag[tag] = 1;
            }
        }else{
            // remove에서 불림
        }
        //태그로인한 추가 스테이터스를 태그스테이터스 업데이트(addWeapon으로 return)
        return this.updateTagStatus();
    }


    //태그 값에 따라 추가될 스테이터스 업데이트
    //태그 갯수에 따른 값만 스테이터스 업데이트를 해주면됨
    updateTagStatus() {
         //무기태그로 인해서 올라간 스탯을 저장할 객체
        let tagStatus = {};

        //태그 제이슨 데이터
        const tagData = this.scene.cache.json.get('tagData');
    
        //현재 보유한 태그객체에서 태그명과 태그의 숫자를 들고 옵니다
        for (const [tag, tagCount] of Object.entries(this.ownTag)) {

            //제이슨 데이터에서 효과와 필요한 갯수를 들고옵니다
            for (const [requiredCount, effects] of Object.entries(tagData[tag])) {

                //만약 현재 보유한 태그의 숫자가 제이슨데이터에서 들고온 필요 숫자보다 크다면
                if (tagCount >= parseInt(requiredCount)) {
                    //해당 데이터까지의 값을 스탯을 저장할 객체에 전부 저장해줍니다
                    for (const [status, effect] of Object.entries(effects)) {
                        //% 유무 확인
                        if (effect.includes('%')) {
                            //이미 키값이 존재한다면 %를 제거해 더하고
                            if (tagStatus[status]) {
                                tagStatus[status] += parseFloat(effect.split("%")[0]);
                            }else {
                                //키값이 존재하지 않는다면 추가합니다
                                tagStatus[status] = parseFloat(effect.split("%")[0]);
                            }
                        } else {
                            //단순 숫자만 있는 경우
                            if (tagStatus[status]) {
                                tagStatus[status] += parseInt(effect);
                            } else {
                                tagStatus[status] = parseInt(effect);
                            }
                        }
                    }
                }
            }
        }
        //캐릭터의 데이터를 리턴(updateOwnTag로 return)
        return this.scene.masterController.characterController.characterStatus.tagStatusUpdate(tagStatus);
    }


    //무기 제거용 함수
    removeWeapon(index){
        updateOwnTag("remove", selectedWeapon.tag);
        this.weapons.splice(index, 1);
    }

    //캐릭터의 데이터로 무기 객체의 정보 업데이트
    updateWeaponData(characterData){
        for(let i = 0; i < this.weapons.length; i++){
            this.weapons[i].damage = Math.round(characterData.power * this.weapons[i].damageScale);
            this.weapons[i].range = characterData.range * this.weapons[i].rangeScale;
            this.weapons[i].nowFireRate = (this.weapons[i].fireRate/(characterData.attackSpeed/100));
            this.weapons[i].critical = characterData.critical;
        }
    }


    //미사일 전체 파괴
    allWeaponMissileDestroy() {
        this.weaponMissilesGroup.clear(true, true);
        }


    getWeapons() {
        return this.weapons;
    }

    //weapons배열 안에 있는 무기 객체의 값을 업데이트하면 객체라서 업데이트된게 유지가됨
        //this.weapons[0].damage = this.weapons[0].damage + 1;

    //근접공격
    rotatingAttack(weapon, angle, monsterX, monsterY) {
        //공격 쿨타임
        if (this.scene.time.now - weapon.lastFired > (weapon.nowFireRate)) {
            weapon.lastFired = this.scene.time.now;
            weapon.canActive = false;
    
             // 무기의 이동 거리 (임의로 설정)

            //공격시에만 무기의 이미지에 물리법칙을 넣기위해서 이때만 잠시 활성화
            this.scene.physics.world.enable(weapon.image);

            //충돌체크하며 데미지 입력
            this.addCollision(weapon);

            // 애니메이션 추가 + 공격이 끝나면 무기 자체의 객체에 공격 끝났다는 표시를 해줌과 동시에 다시 캐릭터 옆으로 붙을 수 있게 해줌
            // 추가로 공격을 안할때는 데미지를 넣으면 안되므로 공격이 다 완료되면 물리법칙을 비활성화

            let distance;

            if(this.player.x > monsterX && weapon.image.x > this.player){
                distance = 150;
            }else{
                distance = 450;
            }

            

            if(weapon.image.x > monsterX){
                weapon.image.flipX = true;
                this.scene.tweens.add({
                    targets: weapon.image,
                    x: weapon.image.x + Math.cos(angle) * (distance/2), // 무기가 앞으로 이동하는 x 좌표
                    y: weapon.image.y + Math.sin(angle) * distance, // 무기가 앞으로 이동하는 y 좌표
                    angle: { from: 0, to: -120 },
                    duration: 250, // 애니메이션 지속 시간 (밀리초)
                    onComplete: () => {
                        // 애니메이션 완료 후 처리할 내용
                        weapon.canActive = true; // 공격 플래그를 false로 설정하여 다시 공격 가능 상태로 변경
                        this.scene.physics.world.disable(weapon.image);
                        //setRotaion안에 따로 각도를 넣지 않으면 회전하기 전으로 돌려준다
                        weapon.image.setRotation();
                    }
                });
            }else{
                weapon.image.flipX = true;
                this.scene.tweens.add({
                    targets: weapon.image,
                    x: weapon.image.x + Math.cos(angle) * (distance/2), // 무기가 앞으로 이동하는 x 좌표
                    y: weapon.image.y + Math.sin(angle) * distance,
                     // 무기가 앞으로 이동하는 y 좌표
                    angle: { from: 0, to: 120 },
                    duration: 250, // 애니메이션 지속 시간 (밀리초)
                    onComplete: () => {
                        // 애니메이션 완료 후 처리할 내용
                        weapon.canActive = true; // 공격 플래그를 false로 설정하여 다시 공격 가능 상태로 변경
                        this.scene.physics.world.disable(weapon.image);
                        //setRotaion안에 따로 각도를 넣지 않으면 회전하기 전으로 돌려준다
                        weapon.image.setRotation();
                    }
                });
            }
        }
        weapon.image.flipX = false;
    }

    //충돌 체크
    addCollision(weaponObject) {
        let monsterGroup = this.scene.masterController.monsterController.getMonsters();

        // 무기 객체와 몬스터 그룹 간의 충돌 설정
        this.scene.physics.add.overlap(
            weaponObject.image,
            monsterGroup,
            (weapon, monster) => {
                this.weaponsCollision(weaponObject, monster);
            },
            null,
            this
        );

        this.scene.physics.world.remove(weaponObject.image);
    }

    // 무기가 몬스터 때리기
    weaponsCollision(weapon, monster) {
        monster.hit(weapon.damage);
    }

    updateWeaponPosition(){
        for(let i = 0; i < this.weapons.length; i++){
            //weapons배열을 순환하며 현재 무기를 설정
            const currentWeapon = this.weapons[i];
            if((currentWeapon.canActive || currentWeapon.canActive === undefined)){
                //무기의 이미지가 있다면 == 무기가 장착되어 있다면 이미지의 위치를 설정함
                if(currentWeapon.image){
                    currentWeapon.image.x = this.player.x + this.weaponPlace[i].offSetX;
                    currentWeapon.image.y = this.player.y + this.weaponPlace[i].offSetY;
                    currentWeapon.currentX = currentWeapon.image.x;
                    currentWeapon.currentY = currentWeapon.image.y;
                }
            }
        }
    }
}