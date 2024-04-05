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

        //스테이터스를 만들어 놓긴했지만 아직 이걸로 사용하는것은 구현을 못했습니다
        //크리티컬이나 흡혈 등 미구현
        //태그에 따른 것도 아직 미구현
    }

    takeDamage(damage){
        const characterHit = Math.floor(Math.random() * 101);

        if(this.avoidance >= characterHit){
            console.log('캐릭터 회피')
        }else{
            this.nowHealth -= damage;
            if(this.nowHealth <= 0){
                return('gameOver');
            }else{
                console.log('캐릭터 체력 : ', this.nowHealth);
            }
        }
    }

    //스테이터스 업데이트 + 스테이지 클리어시 현재체력 = 최대체력으로 변경
    // eval()은 사용하지 말라는 오피셜이 있습니다. - 보안 문제
    updateStatus(data){
        if(data){
            for(const status in data){
                switch(true){
                    case status === 'health' :
                        this.maxHealth += parseInt(eval(data[status]));
                        break;
                    case status === 'speed' :
                        this.speed += parseInt(eval(data[status]));
                        break;
                    case status === 'attackSpeed' :
                        this.attackSpeed += parseInt(eval(data[status]));
                        break;
                    case status === 'power' :
                        this.power += parseInt(eval(data[status]));
                        break;
                    case status === 'range' :
                        this.range += parseInt(eval(data[status]));
                        break;
                    case status === 'critical' :
                        this.critical += parseInt(eval(data[status].split("%")[0]));
                        break;
                    case status === 'avoidance' :
                        this.avoidance += parseInt(eval(data[status]));
                        break;
                    case status === 'defence' :
                        this.defence += parseInt(eval(data[status]));
                        break;
                    case status === 'luck' :
                        this.luck += parseInt(eval(data[status]));
                        break;
                    case status === 'absorption' :
                        this.absorption += parseInt(eval(data[status]));
                        break;
                }
            };
        }

        this.nowHealth = this.maxHealth;
    }

    sliding(avoidance, speed){
        this.avoidance = avoidance;
        this.speed = speed;
    }

    getCharacterStatus() {
        return {
            maxHealth : this.maxHealth,
            nowHealth : this.nowHealth,      
            speed : this.speed,
            attackSpeed : this.attackSpeed,
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

    gameOver() {
        this.scene.transition({
            target: 'EndingScene',
            duration: 2000,
            moveAbove: true,
            onUpdate: this.fadeOutCallback,
            data: {
                characterStatus: this.getCharacterStatus(),
                weapons: this.masterController.getWeapons()
            }
        });
    }
}