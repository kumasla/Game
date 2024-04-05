class PlayerData {
    constructor() {
        this.level = 1;         // 레벨
        this.experience = 0;    // 경험치
        this.health = 100;      // 체력
        this.speed = 1;         // 이동속도
        this.attackPower = 5;   // 공격력
        this.attackSpeed = 1;   // 연사
        this.range = 5;         // 사거리
        this.critical = 1/100;  // 치명타율
        this.avoidance = 0;     // 회피율
        this.defense = 0;       // 방어력
        this.maxEquipment = 6; // 장비 장착 개수
        this.luck = 0;          // 행운
        this.absorption = 0;    // 흡혈량     
    }
}