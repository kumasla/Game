class CharacterSelect extends Phaser.Scene {
    constructor() {
        super('CharacterSelect');
        this.thumbnails = [];
        this.selectedIndex = 0;
    }

    preload() {
        this.load.image('selectBackground', "assets/background/characterSelect.png");
        this.load.image('megamanThumb', "assets/characterThumbnail/megaman2.png");
    }

    create() {
        const { x, y, width } = this.cameras.main;

        this.background = this.add.image(x + width / 2, y + this.cameras.main.height / 2, 'selectBackground')
            .setOrigin(0.5)
            .setDepth(0);

        this.createThumbnails();
        
        // 이벤트 핸들러를 등록
        this.input.keyboard.on('keydown_LEFT', this.handleLeftKey, this);
        this.input.keyboard.on('keydown_RIGHT', this.handleRightKey, this);
    }

    createThumbnails() {
        const { x, y } = this.cameras.main;
    
        this.thumbnails = ['megamanThumb', 'megamanThumb', 'megamanThumb', 'megamanThumb', 'megamanThumb'];
    
        this.thumbnails.forEach((thumbnailKey, index) => {
            const characterContainer = this.add.container();
    
            console.log('characterContainer:', characterContainer);
    
            if (!characterContainer.list) {
                characterContainer.list = [];
            }
    
            const characterGraphics = this.add.graphics();
    
            const characterThumbnail = this.add.image(
                (index - (this.thumbnails.length - 1) / 2) * 200 + x + this.cameras.main.width / 2,
                y + 100,
                thumbnailKey
            ).setInteractive().setDepth(50);
    
            characterThumbnail.setData('index', index);
            characterThumbnail.setScale(0.4);
    
            characterGraphics.strokeRect(
                characterThumbnail.x - characterThumbnail.displayWidth / 2,
                characterThumbnail.y - characterThumbnail.displayHeight / 2,
                characterThumbnail.displayWidth,
                characterThumbnail.displayHeight
            );
    
            characterGraphics.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(
                    characterThumbnail.x - characterThumbnail.displayWidth / 2,
                    characterThumbnail.y - characterThumbnail.displayHeight / 2,
                    characterThumbnail.displayWidth,
                    characterThumbnail.displayHeight
                ),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true
            });
    
            characterGraphics.on('pointerdown', () => {
                this.handleThumbnailClick(characterThumbnail);
            });
    
            characterContainer.add(characterThumbnail);
            characterContainer.add(characterGraphics);
    
            this.add.existing(characterContainer);
        });
    }
    

    handleThumbnailClick(characterThumbnail) {
        const selectedCharacterName = this.getCharacterNameByIndex(characterThumbnail.getData('index'));

        if (selectedCharacterName) {
            this.scene.start('StageSuperMario', { characterName: selectedCharacterName });
        }
    }

    getCharacterNameByIndex(index) {
        switch (index) {
            case 0:
                return 'rockman';
            case 1:
                return 'rockman';
            case 2:
                return 'rockman';
            case 3:
                return 'rockman';
            case 4:
                return 'rockman';
            default:
                return 'rockman';
        }
    }

    handleLeftKey() {
        this.moveThumbnails(-1);
    }

    handleRightKey() {
        this.moveThumbnails(1);
    }

    moveThumbnails(direction) {
        const newIndex = Phaser.Math.Clamp(this.selectedIndex + direction, 0, this.thumbnails.length - 1);

        if (newIndex !== this.selectedIndex) {
            this.selectedIndex = newIndex;
            this.highlightSelectedThumbnail();
            console.log(`New Index: ${this.selectedIndex}`);
        }
    }
}
