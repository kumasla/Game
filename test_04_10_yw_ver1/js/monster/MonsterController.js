class MonsterController {
    constructor(scene, player) {
        this.scene = scene;
        this.monstersGroup = scene.physics.add.group(); // 몬스터 그룹 생성
        this.missilesGroup = scene.physics.add.group(); // 미사일 그룹생성
        this.expBeadsGroup = scene.physics.add.group(); // 경험치 그룹생성
        this.bonusBoxGroup = scene.physics.add.group(); // 상자 그룹생성
        this.monsterTimer = 0;
        this.circlePatternTimer = 0; //몬스터 원형 패턴
        this.player = player;
        this.stageNum = 1;
        this.monsterNumbers = [[1, 1, 1], [1, 1, 1], [1, 1, 1],[1,1,1],[1,1,1],[1,1,5]]; // 첫 레벨을 제외하고 각 스테이지별로 생성될 몬스터의 수
        this.nowMonsterNum = 0;
        this.stateMonsterLevel = 0;
        //this.createBoss();

        this.divisions = 4; // 맵을 4x4로 분할한다고 가정

        this.setupCollisions();

        this.lastPlayerPosition = { x: null, y: null };
    }
    
    getRandomSpawnPosition() {
        this.mapWidth = this.scene.game.imageWidth;
        this.mapHeight = this.scene.game.imageHeight;
        
        // 사분할된 영역 중 하나를 랜덤하게 선택
        const divisionWidth = this.mapWidth / this.divisions;
        const divisionHeight = this.mapHeight / this.divisions;
        const randomDivisionX = Phaser.Math.Between(0, this.divisions - 1);
        const randomDivisionY = Phaser.Math.Between(0, this.divisions - 1);

        // 선택된 분할 영역 내에서 랜덤 위치 생성
        const posX = Phaser.Math.Between(
            randomDivisionX * divisionWidth,
            (randomDivisionX + 1) * divisionWidth
        );
        const posY = Phaser.Math.Between(
            randomDivisionY * divisionHeight,
            (randomDivisionY + 1) * divisionHeight
        );

        return { x: posX, y: posY };
    }


    isInMapBounds(x, y) {
        return x >= 0 && x <= this.mapWidth && y >= 0 && y <= this.mapHeight;
    }

    createCirclePatternMonster() {
        const centerX = this.player.x;
        const centerY = this.player.y;
        const spawnKey= "Lv1_0001";
        let radius = 400; // 기본 원의 반지름
        let monstersCount = 10; // 생성할 몬스터의 수
    
        if (this.lastPlayerPosition.x === centerX && this.lastPlayerPosition.y === centerY) {
            monstersCount = Phaser.Math.Between(10,30);
            radius = Phaser.Math.Between(200, 500); // 반지름을 100에서 400 사이로 랜덤 조정
        }

        // 플레이어 위치가 맵 가장자리에 가까울 경우 원의 반지름 조정
        const edgeThreshold = 50; // 가장자리로부터의 거리 임계값
        const minRadius = 100; // 최소 반지름
    
        // 가장자리 확인 및 반지름 조정
        if (centerX < edgeThreshold || centerX > this.mapWidth - edgeThreshold ||
            centerY < edgeThreshold || centerY > this.mapHeight - edgeThreshold) {
            radius = minRadius; // 원의 반지름을 최소로 조정
        }
    
    
        for (let i = 0; i < monstersCount; i++) {
            const angle = (i / monstersCount) * 2 * Math.PI;
            let x = centerX + radius * Math.cos(angle);
            let y = centerY + radius * Math.sin(angle);
    
            // 몬스터가 맵 밖으로 나가지 않도록 조정
            x = Phaser.Math.Clamp(x, 50, this.mapWidth-50);
            y = Phaser.Math.Clamp(y, 50, this.mapHeight-50);
    
            this.spawnMonster(x, y,spawnKey,3);
        }

        this.lastPlayerPosition.x = centerX;
        this.lastPlayerPosition.y = centerY;
    }
    
    


    //박쥐 패턴으로 수정예정
    /*
    createCirclePatternMonster() {
        const centers = this.getMapDivisionsCenters();
        const centerIndex = Math.floor(Math.random() * centers.length);
        const center = centers[centerIndex];

        const radius = 100; // 원의 반지름을 작게 조정하여 플레이어 주변에서만 생성
        const monstersCount = 10; // 생성할 몬스터의 수

        for (let i = 0; i < monstersCount; i++) {
            const angle = (i / monstersCount) * 2 * Math.PI;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);

            this.spawnMonster(x, y);
        }
    }
    */

    setupCollisions() {
        // 몬스터 그룹 내에서의 충돌 처리를 설정합니다.
        this.scene.physics.add.collider(this.monstersGroup, this.monstersGroup, (monsterA, monsterB) => {
            // 충돌 처리 로직
            // 예시로, 각 몬스터에 대해 handleCollision 메서드를 호출합니다.
            if (monsterA.handleCollision) monsterA.handleCollision();
            if (monsterB.handleCollision) monsterB.handleCollision();
        });
    }

    spawnMonster(x, y,spawnKey,speed) {
        const monsterInfo = this.getMonsterInfoBySpriteKey(spawnKey);
        monsterInfo.speed = speed;
        const monster = new Monster(this.scene, x, y, monsterInfo, this.player); // 항상 0001 유형의 몬스터 생성
        this.monstersGroup.add(monster);
        this.scene.physics.add.collider(this.monstersGroup, monster);
    }

    // 몬스터 생성 메서드
    createMonster() {
        // 스테이지의 맞는 배열 가져오기
        let numMonstersOfType = this.monsterNumbers[this.stageNum];
        console.log(numMonstersOfType);
        // 현재 몬스터 생성된 수가 나와야할 몬스터 수보다 큰지 비교
        if (this.nowMonsterNum >= numMonstersOfType[this.stateMonsterLevel]) {
            // 크다면 다음 레벨 몬스터로 넘기고
            this.stateMonsterLevel++;
            // 초기화
            this.nowMonsterNum = 0;
            return 0;
        }

          // 3단계 몬스터 까지 생성이 완료 됬다면 생성 종료
          if (this.stateMonsterLevel > 2) {
            return 0;
        }
    
        console.log(this.stateMonsterLevel);
        const { x: posX, y: posY } = this.getRandomSpawnPosition();
        const monsterInfo = this.getMonsterInfoByLevel(this.stateMonsterLevel);
    
        setTimeout(() => {
            const monster = new Monster(this.scene, posX, posY, monsterInfo, this.player);
            this.monstersGroup.add(monster);
            this.scene.physics.add.collider(this.monstersGroup, monster);
            this.nowMonsterNum++;
        }, 1000);
    }

    getMonsterInfoByLevel(level) {
        const allMonstersData = this.scene.cache.json.get('monsterData');
        const levelMonsters = Object.values(allMonstersData).filter(monster => monster.level === level+1);
        
        const pickedMonster = Phaser.Math.RND.pick(levelMonsters);
        return pickedMonster;
    }

    getMonsterInfoBySpriteKey(spriteKey) {
        const allMonstersData = this.scene.cache.json.get('monsterData');
        const monsterInfo = allMonstersData[spriteKey];
        return monsterInfo;
    }
    
    
    
    
    

    update() {
        this.circlePatternTimer++;

        if (this.monsterTimer > 60) {
            this.monsterTimer = 0;
            this.createMonster(); // 몬스터 추가
        }
        //4초마다 원형 패턴 몬스터 생성
        if (this.circlePatternTimer > 240) {
            this.circlePatternTimer = 0;
            this.createCirclePatternMonster(); // 원형 패턴 몬스터 생성
        }

        // 몬스터 그룹의 몬스터들을 갱신합니다.
        this.monstersGroup.children.each(monster => {
            monster.update();
        });


        this.expBeadsGroup.children.each(expBead => {
            expBead.update();
        });
        this.bonusBoxGroup.children.each(bonusBox => {
            bonusBox.update();
        });


        this.monsterTimer++;
    }

    updateStage(stageNum) {
        this.stageNum = stageNum;

        this.allMonsterDestroy();
        this.allMissileDestroy();
        this.allExpBeadDestroy();

        // 업데이트 되면 다음 스테이지로 넘어간거니 초기화
        this.stateMonsterLevel = 0;
    }

    createBoss(){
        let boss;
        
        boss = new Boss(this.scene,200,200,this.player);

        this.scene.physics.add.collider(this.monstersGroup, boss); // 몬스터 그룹과 새로운 몬스터 간의 충돌 감지
            
        this.monstersGroup.add(boss); // 생성된 몬스터를 그룹에 추가합니다.
        
        return boss;
    }

    allMonsterDestroy() {
        this.monstersGroup.clear(true, true);
        
    }

    allMissileDestroy() {
        // 미사일 그룹 만들어주세용
        this.missilesGroup.clear(true, true);
    }

    allExpBeadDestroy(){

        // 이게 개수인데 아직은 경험치가 1짜리인것만 있으므로 1* exp 개수
        let exp = this.expBeadsGroup.getChildren().length;

        this.expBeadsGroup.clear(true, true);

        let box = this.bonusBoxGroup.getChildren().length;

        this.bonusBoxGroup.clear(true, true);

        // 받아온 경험치 구슬 그룹 수를 반환한거 가지고 계산 전체 exp 전달
        this.scene.masterController.characterController.characterStatus.getExp(exp);
  
    }

    //위치 받기용 추가 함수
    getMonsters() {
        return this.monstersGroup;
    }

}