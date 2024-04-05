class PlayerManager {
    constructor(player) {
        this.playerData = new PlayerData();
        this.upgradeManager = new UpgradeManager(this.playerData);
        this.weapons = []; // 무기 배열
        this.passives = []; // 패시브 배열
        this.player = player;
    }

    updateStats(selectedCard) {
        // 선택된 보상 카드의 아이템 정보를 기반으로 플레이어 스탯 업데이트
        // 여기에 필요한 스탯 업데이트 로직을 추가
        console.log(`Updating player stats with the selected card: ${selectedCard.message}`);
    }

    getPlayerData() {
        return this.playerData;
    }

    getUpgradeManager() {
        return this.upgradeManager;
    }


    // 무기와 패시브 호출 및 add, remove 관련
    getWeapons() {
        return this.weapons;
    }

    getPassives() {
        return this.passives;
    }

    addWeapon(weapon) {
        this.weapons.push(weapon);
    }

    addPassive(passive) {
        this.passives.push(passive);
    }

    removeWeapon(weapon) {
        const index = this.weapons.indexOf(weapon);
        if (index !== -1) {
            this.weapons.splice(index, 1);
        }
    }

    removePassive(passive) {
        const index = this.passives.indexOf(passive);
        if (index !== -1) {
            this.passives.splice(index, 1);
        }
    }

 


}