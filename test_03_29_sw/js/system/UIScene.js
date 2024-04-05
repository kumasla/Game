class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
        this.playerManager = new PlayerManager();
        this.playerData = this.playerManager.getPlayerData();
        this.upgradeManager = this.playerManager.getUpgradeManager();
    }

    create() {
        // UI 엘리먼트 초기화 및 플레이어 정보 업데이트 로직 추가
    }

    update() {
        // 플레이어 정보가 업데이트될 때마다 UI 엘리먼트를 갱신
    }
}