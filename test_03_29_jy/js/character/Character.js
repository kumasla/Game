class Character{
    constructor(scene, status){
        this.health = status.health - 150;
        this.speed = status.speed;
        this.attackSpeed = status.attackSpeed;
        this.power = status.power;
        this.range = status.range;
        this.critical = status.critical;
        this.avoidance = status.avoidance;
        this.defence = status.defence;
        this.luck = status.luck;
        this.absorption = status.absorption;
    }

    takeDamage(damage){
        this.health = this.health - damage;
        
        if(this.health <= 0){
            console.log('캐릭터 죽음');
        }else{
            console.log(this.health);
        }
    }
}