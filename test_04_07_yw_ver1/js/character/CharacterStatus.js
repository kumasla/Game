class CharacterStatus{
    constructor(scene, status){
        this.scene = scene;
        this.maxHealth = status.maxHealth;      //최대 체력
        this.nowHealth = status.maxHealth;      //현재 체력 (스테이지 클리어시 자동으로 최대체력이 되도록 updateStatus에서 설정)
        this.speed = status.speed;              //캐릭터 속도
        this.attackSpeed = status.attackSpeed;  //공격속도
        this.power = status.power;              //캐릭터의 공격력
        this.range = status.range;              //캐릭터의 공격범위
        this.critical = status.critical;        //치명타확률
        this.avoidance = status.avoidance;      //회피율
        this.defence = status.defence;          //방어력
        this.luck = status.luck;                //운
        this.absorption = status.absorption;    //흡혈
        this.level = 1;
        this.maxExperience = 100;
        this.nowExperience = 0;
        this.maxEquipment = 6;

        this.ownPassive = {}; //소유한 패시브 이름 객체

        this.tagStatus = {}; //무기로 인해 추가된 스테이터스를 저장
    
        //스테이터스를 만들어 놓긴했지만 아직 이걸로 사용하는것은 구현을 못했습니다
        //크리티컬이나 흡혈 등 미구현
        //태그에 따른 것도 아직 미구현

    }



    takeDamage(damage){
        const beforeAvoidance = this.avoidance;
        const characterHit = Math.floor(Math.random() * 101);

        if(this.avoidance >= characterHit){
            console.log('캐릭터 회피')
        }else{
            this.nowHealth -= damage;

            //맞은 직후 회피율 100
            this.avoidance = 100;

            this.scene.masterController.characterController.blink();// 깜빡임 효과 시작

            //0.2초후 회피율 복원 및 깜빡임 정지
            setTimeout(() =>{
                this.avoidance = beforeAvoidance;
                this.scene.masterController.characterController.stopBlink();
            }, 200)

            if(this.nowHealth <= 0){
                return 'gameOver';
            }else{
                console.log('캐릭터 체력 : ', this.nowHealth);
            }
        }
    }

    //스테이터스 업데이트 + 스테이지 클리어시 현재체력 = 최대체력으로 변경
    updateStatus(data){
        if(data){
            //ownPassive에 아이템의 name이 있는지 확인 후 없으면 추가 있으면 갯수만 증가
            //다만 객체의 내부로 동적으로 유지 됩니다
            if(this.ownPassive.hasOwnProperty(data.name)){
                this.ownPassive[data.name]++;
                console.log(this.ownPassive);
            }else{
                this.ownPassive[data.name] = 1;
                console.log(this.ownPassive);
            }

            for(const status in data){
                //데이터가 %를 포함한다면 곱하는건 곱해지게 더해져야되는건 더해지도록 구성
                //패시브 json에 health를 maxHealth로 변경(json값만)

                if(status != 'name' && status != 'imagePath' && status != 'type'){
                    if(status == 'critical' || status == 'avoidance' || status == 'luck'){
                        this[status] += parseFloat(data[status]);
                    }else{
                        switch(true){
                            case data[status].includes('%') :
                                this[status] *= parseFloat(data[status] / 100);
                                this[status] = Math.floor(this[status]);
                                break;
                            default : this[status] += parseInt(data[status]);
                        }
                    }
                }
            };
        }
        this.scene.masterController.weaponController.updateWeaponData(this);
        this.nowHealth = this.maxHealth;
        console.log(this)
        
    }

    //슬라이딩할때 속도 조정을 위한 함수
    sliding(avoidance, speed){
        this.avoidance = avoidance;
        this.speed = speed;
    }

    getCharacterStatus() {
        return {
            maxHealth : this.maxHealth,
            nowHealth : this.nowHealth,
            speed : this.speed,
            attackSpeed : (this.attackSpeed/100),
            power : this.power,
            range : this.range,
            critical : this.critical,
            avoidance : this.avoidance,
            defence : this.defence,
            luck : this.luck,
            absorption : this.absorption,
            level : this.level,
            maxExperience : this.maxExperience,
            nowExperience : this.nowExperience,
            maxEquipment : this.maxEquipment
        };
    }

    //exp획득시 레벨업 로직
    getExp(exp){
        this.nowExperience += exp;
        while(this.nowExperience >= Math.floor(this.maxExperience)){
            this.nowExperience -= Math.floor(this.maxExperience);
            this.level++;
            this.maxHealth += 10;
            this.nowHealth += 10;
            this.scene.updateSettlement();
            this.maxExperience = Math.floor(this.maxExperience * 1.2);
        }
        return this.nowExperience;
    }

    //무기 태그로 업데이트된 스테이터스 변경
    tagStatusUpdate(status){
        //감소
        for(const beforeStatus in this.tagStatus){
            if(beforeStatus == "critical" || beforeStatus == "avoidance" || beforeStatus == "luck" || beforeStatus == "defence" || beforeStatus == "absorption"){
                this[beforeStatus] -= this.tagStatus[beforeStatus];
            }else{
                this[beforeStatus] = this[beforeStatus]/ (1 + this.tagStatus[beforeStatus]/100);
                this[beforeStatus] = Math.floor(this[beforeStatus]);
            }
        }

        //증가
        for(const nowStatus in status){
            if(nowStatus == "critical" || nowStatus == "avoidance" || nowStatus == "luck" || nowStatus == "defence" || nowStatus == "absorption"){
                this[nowStatus] += status[nowStatus];
            }else{
                this[nowStatus] = (1 + status[nowStatus]/100) * this[nowStatus];
                this[nowStatus] = Math.floor(this[nowStatus]);
            }
        }

        //감소를 위한 현재 정보 저장
        this.tagStatus = {};
        this.tagStatus = Object.assign(this.tagStatus, status);
        return this;
    }
}
