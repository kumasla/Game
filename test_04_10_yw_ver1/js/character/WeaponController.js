class WeaponController{
    constructor(scene, player){
        this.scene = scene;
        this.player = player;

        this.weapons = [];

        this.weaponPlace = {
            0 : { offSetX: 100, offSetY: -100},

            1 : { offSetX: -100, offSetY: -100},

            2 : { offSetX: 150, offSetY: 0},

            3 : { offSetX: -150, offSetY: 0},

            4 : { offSetX: 100, offSetY: 100},

            5 : { offSetX: -100, offSetY: 100}
        }

        this.ownTag = {};       //무기로 인해 보유한 태그

        this.weaponMissilesGroup = scene.physics.add.group(); // 미사일 그룹생성
    }

    update(){
        this.updateWeaponPosition();

        //몬스터 컨트롤러에서 모든 몬스터들을 받아옴
        const monsters = this.scene.masterController.monsterController.getMonsters();

        //weapons의 배열을 순환
        for (let i = 0; i < this.weapons.length; i++) {
            const weapon = this.weapons[i];

            if(weapon.canActive || weapon.canActive === undefined){
                //공격을 위한 가장 가까운 몬스터 설정
                let closestMonster = null;

                // 가장 가까운 몬스터와의 거리는 초기에 무한대로 설정 (전체 순환을 위한것)
                let closestDistance = Infinity;

                //몬스터 컨트롤러에서 받아온 몬스터들을 다시 한번 순환하면서 거리를 계산
                monsters.children.each(monster => {
                    //각각의 무기 위치로부터 가장 가까운 거리를 계산하도록 설정
                    let distance = Phaser.Math.Distance.Between(this.player.x + this.weaponPlace[i].offSetX, this.player.y + this.weaponPlace[i].offSetY, monster.x, monster.y);

                    //가장 가까운 몬스터를 갱신
                    if(distance < closestDistance){
                        // 더 짧은 거리를 찾으면 업데이트
                        closestDistance = distance;
                        // 가장 가까운 몬스터 업데이트 (무기 객체 자체에 집어넣음으로 각자 다른 몬스터를 바라 볼 수 있도록 설정)
                        weapon.closestMonster = monster;
                    }
                });

                //가장 가까운 몬스터가 존재하면서(죽지않았으면서) 가장 가까운 몬스터가 현재 무기의 범위보다 작다라고한다면
                if (weapon.closestMonster && closestDistance <= weapon.range) {
                    if (weapon.lastAttackedMonster != weapon.closestMonster) {
                        //// 가장 가까운 몬스터 정보를 새로 업데이트
                        weapon.lastAttackedMonster = weapon.closestMonster;
                    }
        
                    //몬스터 위치에 따라 몬스터를 바라보도록 만듬과 동시에 무기발사 메소드 실행
                    const angle = Phaser.Math.Angle.Between(weapon.currentX, weapon.currentY, weapon.closestMonster.x, weapon.closestMonster.y);

                    //총은 뒤집히지 않게 하며 근접무기는 몬스터를 바라봅니다
                    if(weapon.type == "sniper" || weapon.type == "rifle" || weapon.type.includes("artillery")){
                        weapon.image.setRotation(angle);
                        switch(true){
                            case weapon.closestMonster.x < weapon.currentX :
                                if(i % 2 == 0){
                                    weapon.image.setScale(weapon.weaponScale, -weapon.weaponScale);
                                }else{
                                    weapon.image.setScale(-weapon.weaponScale, -weapon.weaponScale);
                                }
                                break;
                            case weapon.closestMonster.x > weapon.currentX :
                                if(i % 2 == 0){
                                    weapon.image.setScale(weapon.weaponScale, weapon.weaponScale);
                                }else{
                                    weapon.image.setScale(-weapon.weaponScale, weapon.weaponScale);
                                }
                                break;
                        }
                    }else{
                        if(i % 2 == 0){
                            weapon.image.setRotation(angle + Math.PI / 4);
                        }else{
                            weapon.image.setRotation(angle + 3 * Math.PI / 4);
                        }
                    }

                    switch(true){
                        case weapon.type == "sniper": case weapon.type == "rifle" : case weapon.type == "artillery" : case weapon.type == "artillery-bomb" :
                            this.fireWeapon(weapon, angle);
                            break;
                            
                        case weapon.type == "shotgun" : //샷건은 시간을 조금만 더 주세요... 생각을 해봐야할거 같습니다..
                            this.fireWeapon(weapon, angle);
                            break;

                        case weapon.type == "sword": case weapon.type == "mace": case weapon.type == "polearm": case weapon.type == "shield": case weapon.type == "lancer":
                            this.meleeAttack(weapon, i);
                            break;
                    }
                }else{
                    //무기의 scaleY가 음의 값이라면 이미지가 180도 바뀌어서 보기 때문에 Y값을 절대값으로 다시 넣어준다
                    weapon.image.scaleY = Math.abs(weapon.image.scaleY);
                    weapon.image.setRotation(0)
                    //setRotation이 0의 값이라면 처음 들고올때의 그 각도로 들고옴

                    //왼쪽 무기 절대 값으로 만듬 = 어딜 보다가도 끝나면 제자리로 오게 만들어줌
                    if(i % 2 == 1){
                        weapon.image.scaleX = Math.abs(weapon.image.scaleX);
                    }

                    /* switch(true){
                        case weapon.type == "sniper": case weapon.type == "rifle" : case weapon.type == "artillery" : case weapon.type == "artillery-bomb" :
                        if(i % 2 == 1){
                            weapon.image.scaleX = Math.abs(weapon.image.scaleX);
                        }
                        break;
                        default : 
                            if(i % 2 == 1){
                                weapon.image.scaleX = Math.abs(weapon.image.scaleX);
                            }
                            break;
                    } */
                    weapon.closestMonster = null;
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
            this.scene.masterController.soundController.playEffectSound(weapon.soundName)
        }
    }

    //마스터컨트롤러에서 받아온 무기이름으로 제이슨에서 데이터 추출해서 객체로 만든 후 무기 배열안에 추가
    //무기 이름만 보내면 무기가 추가가 됨
    //무기 이름 + 추가할 무기의 등급을 같이 보내주셔야됩니다
    addWeapon(weaponName, updateGrade){

        let characterData;

        //현재 보유한 무기의 갯수가 6개 이상이라면 최고등급이 아니라면 해당무기를 합체시킵니다
        if(this.weapons.length >= 6){
            let progress = "구매 불가";
            let index;
            for(let i = 0; i < 6; i++){
                if(this.weapons[i].name == weaponName && this.weapons[i].grade == updateGrade && updateGrade != 3){
                    index = i;
                    progress = this.combineWeapon("full", i);
                    break;
                }
            }
            characterData = this.scene.masterController.characterController.characterStatus;

            this.updateWeaponData(characterData, index);

            //만약 합쳐진다면 combine 아니라면 구매 불가를 return 하게 해놨습니다.
            return progress;
        }else{
            const selectedWeapon = this.scene.cache.json.get('weaponData')[weaponName];
            const weaponObject = Object.assign({}, selectedWeapon);
            weaponObject.grade = updateGrade;
            this.weapons.push(weaponObject);

            for (let i = 0; i < this.weapons.length; i++) {
                let weaponImage;
                // 이미 생성된 이미지가 있으면 새로 생성 x
                if (!this.weapons[i].image) {
                    weaponImage= this.scene.add.image(this.player.x + this.weaponPlace[i].offSetX, this.player.y + this.weaponPlace[i].offSetY, this.weapons[i].name);
                    if(i % 2 == 1){
                        weaponImage.flipX = true;
                    }
                    weaponImage.setDepth(1);
                    weaponImage.setScale(selectedWeapon.weaponScale);
                    this.weapons[i].image = weaponImage;
                }

                //태그를 추가하면서 현재 캐릭터의 정보를 return받아옴
                characterData = this.updateOwnTag("add", selectedWeapon.tag);
            }
        }

        //return 받아온 캐릭터의 정보로 무기의 정보를 업데이트
        this.updateWeaponData(characterData);
    }

    //무기 합체 메소드
    // 비동기 처리 실패 시 응답?
    combineWeapon(status, change){
        //꽉 찬 상태일때 자동 합체 메소드
        if(status == "full"){
            this.weapons[change].grade++;

        }else{ // 장비창에서 합성을 눌렀을때 (이때는 status 아무거나 보내주시고 무기 이름 보내주시면 됩니다) 제일 마지막 인덱스에 있는 무기를 제거하고 그 앞의 무기의 등급을 상승시킵니다
            let combineIndex = this.weapons.map((weapon, index) => weapon.name === change ? index : -1).filter(index => index !== -1);
            combineIndex.reverse();
            this.weapons[combineIndex[1]].grade++;
            this.deleteWeapon(combineIndex[0]);
        }

        return this.weapons;
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
            this.ownTag[tag] -= 1;
            if(this.ownTag[tag] == 0 ){
                delete this.ownTag[tag];
            }
        }
        //태그로인한 추가 스테이터스를 태그스테이터스 업데이트(addWeapon으로 return / deleteWeapon으로 return)
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
    deleteWeapon(index){
        const removerWeaponTag = this.weapons[index].tag;
 
        this.updateWeaponData(this.updateOwnTag("remove", removerWeaponTag));
        this.weapons[index].image.destroy();
        this.weapons.splice(index, 1);
    }

    //캐릭터의 데이터로 무기 객체의 정보 업데이트
    updateWeaponData(characterData){
        //등급에 따라 데미지 배율을 설정함
        let gradeMultiplier;
        for(let i = 0; i < this.weapons.length; i++){
            switch(true){
                case this.weapons[i].grade == 2 :
                    gradeMultiplier = 1.2;
                    break;
                case this.weapons[i].grade == 3 :
                    gradeMultiplier = 1.4;
                    break;
                default : gradeMultiplier = 1;
                    break;
            }
            this.weapons[i].damage = Math.round(characterData.power * this.weapons[i].damageScale * gradeMultiplier);
            this.weapons[i].range = characterData.range * this.weapons[i].rangeScale;
            this.weapons[i].nowFireRate = (this.weapons[i].fireRate/(characterData.attackSpeed/100));
            this.weapons[i].critical = characterData.critical;
            this.weapons[i].absorption = characterData.absorption;
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

    //근접 공격
    meleeAttack(weapon, index) {
        //공격 쿨타임
        if (this.scene.time.now - weapon.lastFired > (weapon.nowFireRate)) {
            weapon.lastFired = this.scene.time.now;
            weapon.canActive = false;
    
            //공격시에만 무기의 이미지에 물리법칙을 넣기위해서 이때만 잠시 활성화
            this.scene.physics.world.enable(weapon.image);

            //충돌체크하며 데미지 입력
            this.addCollision(weapon);

            //무기 종류에 따라 휘두르는 공격 / 찌르는 공격 / 랜덤
            switch(true){
                case weapon.type == "mace" :
                    this.rotaionAttack(weapon, index);
                    break;

                case weapon.type == "lancer" :
                    this.directAttack(weapon, index);
                break;

                default :
                    if(Math.random() < 0.5){
                        this.rotaionAttack(weapon, index);
                    }else{
                        this.directAttack(weapon, index);
                    }
                    break;
            }
        }
    }

    //회전 공격
    rotaionAttack(weapon, index){
        // 몬스터와의 각도 계산
        const angleToMonster = Phaser.Math.Angle.Between(this.player.x, this.player.y, weapon.closestMonster.x, weapon.closestMonster.y);
        const radius = Phaser.Math.Distance.Between(this.player.x, this.player.y, weapon.closestMonster.x, weapon.closestMonster.y);


        // 회전 각도 설정
        // 원호 궤적에 따른 이동 애니메이션
        let points = this.calculateArcPath(this.player.x, this.player.y, radius, angleToMonster - Math.PI / 3, angleToMonster + Math.PI / 3);

        if (this.player.x > weapon.image.x) {
            points.reverse();
        }

        //회전을 뒤집는건 가능 - 의견 필요할듯 물어봐야함
        /* if(index % 2 == 0){
            if(weapon.closestMonster.x < weapon.image.x){
                points = points.map(p => {
                    return {
                        x: 2 * weapon.image.x - p.x - 20,  // x 좌표를 weapon.image.x에 대해 반전
                        y: p.y  // y는 변하지 않음
                    };
                });
            }
        }else{
            if(weapon.closestMonster.x > weapon.image.x){
                points = points.map(p => {
                    return {
                        x: 2 * weapon.image.x - p.x + 20,  // x 좌표를 weapon.image.x에 대해 반전
                        y: p.y  // y는 변하지 않음
                    };
                });
            }
        } */

        let lastAngle;

        if(index % 2 == 0){
            lastAngle = 2.09;
        }else{
            lastAngle = -2.09;
        }

        this.scene.tweens.add({
            targets: weapon.image,
            x: points.map(p => p.x),
            y: points.map(p => p.y),
            duration: 300,
            onUpdate: tween => {
                const tweenProgress = tween.progress;
                const pointIndex = Math.floor(tweenProgress * (points.length - 1));
                const coords = points[pointIndex];
                weapon.image.setPosition(coords.x, coords.y);

                // 각도 업데이트 - 0도 ~ 120도
                const angleAdjustment = Phaser.Math.Linear(0, lastAngle, tweenProgress); // 각도 변경
                weapon.image.setRotation(angleAdjustment);
            },
            onComplete: () => {
                weapon.canActive = true; // 공격 가능 상태로 복귀
                this.scene.physics.world.disable(weapon.image); // 물리법칙 비활성화
                weapon.image.setRotation(); // 회전 초기화
            }
        });
    }

    //찌르기 공격
    directAttack(weapon, index){
        const angleToMonster = Phaser.Math.Angle.Between(weapon.currentX, weapon.currentY, weapon.closestMonster.x, weapon.closestMonster.y);

        this.scene.tweens.add({
            targets: weapon.image,
            x: weapon.image.x + Math.cos(angleToMonster) * weapon.range, // 무기가 앞으로 이동하는 x 좌표
            y: weapon.image.y + Math.sin(angleToMonster) * weapon.range, // 무기가 앞으로 이동하는 y 좌표
            duration: 300,
            /* onStart: () => {
                // 애니메이션 시작할 때 무기의 방향을 다시 설정
                if(index % 2 == 0){
                    weapon.image.setRotation(angleToMonster + Math.PI / 4);
                }else{
                    weapon.image.setRotation(angleToMonster + 3 * Math.PI / 4);
                }
            }, */
            onComplete: () => {
                weapon.canActive = true; // 공격 가능 상태로 복귀
                this.scene.physics.world.disable(weapon.image); // 물리 엔진 비활성화
            }
        });
    }

    //회전 공격 경로
    calculateArcPath(centerX, centerY, radius, startAngle, endAngle, steps = 60) {
        const points = [];
        for (let i = 0; i <= steps; i++) {
            const theta = startAngle + (i / steps) * (endAngle - startAngle);
            const x = centerX + radius * Math.cos(theta);
            const y = centerY + radius * Math.sin(theta);
            points.push({ x: x, y: y });
        }
        return points;
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

    //무기 위치 업데이트
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