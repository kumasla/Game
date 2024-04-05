// EndingScene.js

class EndingScene extends Phaser.Scene {
    constructor() {
        super('EndingScene');
        this.gameDataManager = new GameDataManager();
        this.playerManager = new PlayerManager();
    }

    create() {
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Ground');

        const defeatText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height * 1/8,
            'DEFEAT',
            {
                fontFamily: 'Arial',
                fontSize: 130,
                color: '#ff0000',
                align: 'center',
                backgroundColor: '#000000',
                padding: {
                    top: 10,
                    bottom: 10,
                },
            }
        );

        this.add.text(400, 200, `Player level: ${this.playerManager.playerData.level}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 220, `Player experience: ${this.playerManager.playerData.experience}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 240, `Player health: ${this.playerManager.playerData.health}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 260, `Player speed: ${this.playerManager.playerData.speed}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 280, `Player attackPower: ${this.playerManager.playerData.attackPower}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 300, `Player attackSpeed: ${this.playerManager.playerData.attackSpeed}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 320, `Player range: ${this.playerManager.playerData.range}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 340, `Player critical: ${this.playerManager.playerData.critical}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 360, `Player avoidance: ${this.playerManager.playerData.avoidance}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 380, `Player defense: ${this.playerManager.playerData.defense}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 400, `Player maxEquipment: ${this.playerManager.playerData.maxEquipment}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 420, `Player luck: ${this.playerManager.playerData.luck}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 440, `Player absorption: ${this.playerManager.playerData.absorption}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        


        this.add.text(400, 460, `Monsters Killed: ${this.gameDataManager.gameData.monstersKilled}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 480, `Play Time: ${this.gameDataManager.gameData.playTime} seconds`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 500, `Stage Count: ${this.gameDataManager.gameData.stageCount}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        defeatText.setOrigin(0.5);

        this.time.delayedCall(5000, () => {
            this.scene.start('MainMenu');
        });
    }
}
