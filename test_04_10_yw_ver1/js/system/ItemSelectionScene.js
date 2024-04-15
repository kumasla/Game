class ItemSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ItemSelectionScene' });
        this.rewardObjects = [];
        this.selectedRewardIndex = -1;
        this.selectedItems = [];
        this.itemsData = [];    // json배열 저장
        this.characterStatus;
        this.weapons;
        this.masterController;
        this.selectionCount;
    }

    preload() {
        this.load.json('passives', 'js/character/passives.json');
        
    }

    create(data) {
        // 씬 배경
        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x808080, 1);
        overlay.setOrigin(0);

        this.characterStatus = data.characterStatus;
        this.weapons = data.weapons;
        this.masterController = data.masterController;

        // 리스타트 하려고 어쩔 수 없이 게임 자체에 넣었음 ㅇㅇ
        this.selectionCount = this.game.selectionCount;

        // 셀렉트 버튼
        this.createSelectionButton();

        this.itemsData = this.cache.json.get('passives');

        this.loadItemImage();

        this.load.on('complete', () =>{

            this.rewardObjects.forEach(group => group.destroy());
            this.rewardObjects = [];

            this.displayRewardObjects();
            this.createPassiveSlots();
            this.createWeaponSlots();
            this.displayPlayerStats();

        });

        this.load.start();

    }

    loadItemImage(){
        const itemsData = this.itemsData;

        // 각 아이템의 이미지 preload
        for (const itemKey in itemsData) {
            const item = itemsData[itemKey];
            if (item.imagePath) {
                this.load.image(item.name, item.imagePath);
            }
        }
    }

    createSelectionButton() {
        this.selectionButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 50, 'Select', {
            fontSize: '20px',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive();

        this.selectionButton.on('pointerdown', () => this.completeSelection());
    }

    displayRewardObjects() {
        const itemsData = this.itemsData;
        const itemKeys = Object.keys(itemsData);
        
        Phaser.Utils.Array.Shuffle(itemKeys);
        
        const selectedItems = itemKeys.slice(0, Math.min(3, itemKeys.length));
        this.selectedItems = selectedItems;
        
        selectedItems.forEach((itemName, index) => {
            const item = itemsData[itemName];
            const x = 100 + (index * 200);
            const y = 100;
            const itemImage = this.add.image(x, y, item.name);
            itemImage.setScale(0.5);
    
            const itemText = this.createItemText(x, y, item, itemImage);
    
            const group = this.add.container();
            group.add([itemImage, itemText]);
            group.setSize(itemImage.width, itemImage.height + itemText.height + 250);
            const rect = this.add.rectangle(x, y + 100, group.width - 70, group.height, 0xffffff, 0.3);
            rect.setStrokeStyle(2, 0xffffff); 
            group.addAt(rect, 0); 
    
            // 이미지에 클릭 이벤트를 걸어줍니다.
            itemImage.setInteractive().on('pointerdown', () => {
                this.imageClick(group, index);
            });
    
            this.rewardObjects.push(group);
        });
    }

    imageClick(group, clickedIndex) {
        if (this.selectedRewardIndex !== clickedIndex) {
            this.selectedRewardIndex = clickedIndex;
            
            this.rewardObjects.forEach((grp, i) => {
                if (i === clickedIndex) {
                    grp.getAt(0).setFillStyle(0x808080, 0.3);
                } else {
                    grp.getAt(0).setFillStyle(0xffffff, 0.3); // 원래 색상으로 변경
                }
            });
        } else {
            //console.log(clickedIndex);
        }
    }

    createItemText(x, y, item, itemImage) {
        const group = this.add.container();
        
        const nameText = this.add.text(x, y + itemImage.height / 2, `Name: ${item.name}`, { fontSize: '28px', fill: '#FFFFFF' }).setOrigin(0.5, 0.5);
        group.add(nameText);

        let offsetY = nameText.height + 5;

        for (const prop in item) {
            if (prop !== 'name' && prop !== 'imagePath') {
                const value = item[prop];
                const color = this.setColorForValue(value);
                const propText = this.add.text(x, y + offsetY + itemImage.height / 2 + 10, `${prop}: ${value}`, { fontSize: '20px', fill: color }).setOrigin(0.5, 0.5);
                offsetY += propText.height + 5;
                group.add(propText);
            }
        }
    
        return group;
    }

    
    setColorForValue(value) {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            return numericValue >= 0 ? '#00FF00' : '#FF0000';
        } else {
            return '#FFFFFF';
        }
    } 

    completeSelection() {
        if(this.selectedRewardIndex !== -1) {
            const selectedItemIndex = this.selectedRewardIndex;
            const selectedItemKey = this.selectedItems[selectedItemIndex];

            const selectedItem = this.itemsData[selectedItemKey];

            this.masterController.updateItem(selectedItem);

            // 걍 이 씬에서 쓰는거 -- 해버리기
            this.selectionCount--;
            
            // 전역변수 -- 해버리기
            this.game.selectionCount--;

            // 인덱스 초기화.. 필요한거 같음 이거 떔에 버그있는듯?
            this.selectedRewardIndex = -1;

            if(this.selectionCount > 0) {
                this.scene.restart();
            } else {
                this.scene.stop('ItemSelectionScene');
                this.scene.resume('StageSuperMario');
            }
        } else {
            const messageText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, '아이템을 선택하세요!', {
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
    }

    createPassiveSlots() {
        // 패시브 슬롯 생성
        const passiveSlots = [];
        //const passives = this.playerManager.getPassives(); //패시브 데이터 받아야함
        const numPassiveSlots = Math.min(10, 20); // 최대 20개까지 표시 
        for (let i = 0; i < numPassiveSlots; i++) {
            const x = (i % 5) * 90;
            const y = (Math.floor(i / 5) + 2) * 90;
            const rect = this.add.rectangle(x + 80, y + 350, 80, 80, 0x00FF00).setInteractive();
            const text = this.add.text(x + 80 , y + 350, `Passive ${i}`, { fill: '#ffffff', fontSize: 16 }).setOrigin(0.5);

            const group = this.add.group([rect, text]);

            passiveSlots.push(group);
        }
    }
    
    createWeaponSlots() {
        // 무기 슬롯 생성
        const weaponSlots = [];
        const weapons = this.weapons; // 무기 데이터 받아서 밑에 넣어야함.
        const numWeaponsSlots = Math.min(6, 8);

        for (let i = 0; i < numWeaponsSlots; i++) {
            const x = (i % 3) * 100;
            const y = (Math.floor(i / 3) * 90);
            const rect = this.add.rectangle(x + 640, y + 535, 80, 80, 0x00FF00).setInteractive();
            const text = this.add.text(x + 640, y + 535, `Weapon ${i}`, { fill: '#ffffff', fontSize: 16 }).setOrigin(0.5); 

            const group = this.add.group([rect, text]); 
            weaponSlots.push(group); 
        }
    }

    displayPlayerStats() {
        // 캐릭터 스탯 표시
        const statsPanel = this.add.container(650, 75); 
        const playerData = this.characterStatus;
        const playerStats = [
            `Level: ${playerData.level}`,
            `MaxExperience: ${playerData.maxExperience}`,
            `MaxHealth: ${playerData.maxHealth}`,
            `Speed: ${playerData.speed}`,
            `Attack Power: ${playerData.power}`,
            `Attack Speed: ${playerData.attackSpeed}`,
            `Range: ${playerData.range}`,
            `Critical: ${playerData.critical}`,
            `Avoidance: ${playerData.avoidance}`,
            `Defence: ${playerData.defence}`,
            `Max Equipment: ${playerData.maxEquipment}`,
            `Luck: ${playerData.luck}`,
            `Absorption: ${playerData.absorption}`
        ];

        playerStats.forEach((stat, index) => {
            const text = this.add.text(0, index * 30, stat, { fill: '#ffffff', fontSize:24 });
            statsPanel.add(text);
        });
    }

}
