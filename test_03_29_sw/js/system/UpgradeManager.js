class UpgradeManager {
    constructor(playerData) {
        this.playerData = playerData;
    }

    static handleRewardSelection(selectedReward) {
        // 보상 처리 로직을 여기에 추가
        console.log(`Selected reward: ${selectedReward}`);

        // 예: 선택된 보상에 따라 플레이어 능력치를 업데이트하거나 게임 상태를 변경하는 등의 동작을 수행
    }

    upgradeHealth() {
        this.playerData.health += 10;
    }

    upgradeAttackPower() {
        this.playerData.attackPower += 5;
    }

    // 다른 업그레이드 메서드 추가 가능
}