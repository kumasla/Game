class CharacterSelect extends Phaser.Scene {
    constructor() {
        super('CharacterSelect');
        this.thumbnails = [];
        this.selectedIndex = -1;
        this.cursorKeys = null;
        this.moveDelay = 200;
        this.lastMoveTime = 0;
    }

    preload() {
        this.load.image('selectBackground', "assets/background/characterSelect.png");
        this.load.image('megamanThumb', "assets/characterThumbnail/megaman2.png");
        this.load.image('linkThumb', "assets/characterThumbnail/link2.png");
    }

    create() {
        const { width, height } = this.scale;
        const x = width / 2;
        const y = height / 2;

        this.background = this.add.image(x ,y, 'selectBackground')
            .setOrigin(0.5)
            .setDepth(0);

        this.createThumbnails();
        
        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    createThumbnails() {
        const width = game.config.width;
        const height = game.config.height;
    
        console.log(config.width);
        console.log(config.height);

        const thumbnailWidth = 150;
        const thumbnailHeight = 150;
        const spacing = 35;
    
        const containerWidth = this.thumbnails.length * (thumbnailWidth + spacing);
        const containerX = (width - containerWidth) / 2;
        const containerY = height / 7;

        const startText = this.add.text(width / 2, height * 0.85, '시작', { fill: '#ffffff', fontSize:'32px' })
            .setOrigin(0.5)
            .setInteractive()
            .setDepth(50);

        startText.on('pointerdown', () => {
            this.startSelectedCharacterStage();
        });


        // const thumbnailWidth = config.width * 0.15; 
        // const thumbnailHeight = config.height * 0.168; 
        // const spacing = config.width * 0.05; 
    
        // const containerWidth = this.thumbnails.length * (thumbnailWidth + spacing);
        // const containerX = (width - containerWidth) / 2;
        // const containerY = height / 7;
    

        this.thumbnails = ['megamanThumb', 'linkThumb', 'megamanThumb', 'megamanThumb', 'megamanThumb'].map((thumbnailKey, index) => {
            const characterContainer = this.add.container(containerX * 0.23 + index * (thumbnailWidth + spacing), containerY);
    
            const characterThumbnail = this.add.image(0, 0, thumbnailKey)
                .setInteractive()

    
            characterThumbnail.setScale(thumbnailWidth / characterThumbnail.width, thumbnailHeight / characterThumbnail.height);
            characterThumbnail.setData('index', index);
    
            const characterGraphics = this.add.graphics();
            characterGraphics.lineStyle(2, 0xffffff);
            characterGraphics.strokeRect(
                -thumbnailWidth / 2,
                -thumbnailHeight / 2,
                thumbnailWidth,
                thumbnailHeight
            );
    
            // 썸네일 클릭 이벤트 처리
            characterThumbnail.on('pointerdown', () => {
                this.handleThumbnailClick(characterThumbnail);
            });
    
            characterContainer.add([characterThumbnail, characterGraphics]);
            this.add.existing(characterContainer);

            return characterThumbnail;
        });
    }
    
    
    

    handleThumbnailClick(characterThumbnail) {
        this.selectedIndex = characterThumbnail.getData('index');
        this.highlightSelectedThumbnail();
    }

    highlightSelectedThumbnail() {
        const thumbnailWidth = 150;
        const thumbnailHeight = 150;
        const spacing = 35;
        this.thumbnails.forEach((thumbnail, index) => {
            const container = thumbnail.parentContainer;
            if (container && container.list.length >= 2) {
                const graphics = container.list[1];
    
                if (index === this.selectedIndex) {
                    graphics.clear();
                    graphics.lineStyle(4, 0xff0000); // 빨간색 테두리 두께 4px
                    graphics.strokeRect(
                        -thumbnailWidth/ 2,
                        -thumbnailHeight / 2,
                        thumbnailWidth,
                        thumbnailHeight
                    );
                } else {
                    graphics.clear();
                    graphics.lineStyle(2, 0xffffff); // 흰색 테두리 두께 2px
                    graphics.strokeRect(
                        -thumbnailWidth/ 2,
                        -thumbnailHeight / 2,
                        thumbnailWidth,
                        thumbnailHeight
                    );
                }
            }
        });
    }
    
    startSelectedCharacterStage() {
        let selectedCharacterName = null;
        if(this.selectedIndex != -1) {
            selectedCharacterName = this.getCharacterNameByIndex(this.selectedIndex);
        } else {  
            const messageText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, '캐릭터를 선택해주세요!!', {
                fontSize: '36px',
                fill: '#fff',
                alpha: 0
            }).setOrigin(0.5);

            this.tweens.add({
                targets: messageText,
                alpha: 1, 
                duration: 500,
                ease: 'Power2',
                yoyo: true,
                delay: 500, 
                onComplete: () => {
                    this.tweens.add({
                        targets: messageText,
                        alpha: 0,
                        duration: 1000,
                        delay: 1200,  
                        onComplete: () => {  
                            messageText.destroy();
                        }
                    });
                }
            });
        }
    
        if (selectedCharacterName != null) {
            this.scene.start('StageSuperMario', { characterName: selectedCharacterName });
        }
    }

    // 추후 수정될수도있음ㅇ ㅇ
    getCharacterNameByIndex(index) {
        switch (index) {
            case 0:
                return 'megaman';
            case 1:
                return 'link';
            case 2:
                return 'link';
            case 3:
                return 'link';
            case 4:
                return 'link';
            default:
                return 'link';
        }
    }

    handleLeftKey() {
        this.moveThumbnails(-1);
    }

    handleRightKey() {
        this.moveThumbnails(1);
    }

    update() {
        if (this.cursorKeys.left.isDown && this.time.now > this.lastMoveTime + this.moveDelay) {
            this.moveThumbnails(-1);
            this.lastMoveTime = this.time.now;
        } else if (this.cursorKeys.right.isDown && this.time.now > this.lastMoveTime + this.moveDelay) {
            this.moveThumbnails(1);
            this.lastMoveTime = this.time.now;
        }
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
