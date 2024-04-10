class MonsterController {
    constructor(scene, player, mapSize) {
        this.scene = scene;
        this.mapSize = mapSize; //맵 크기 정보 저장
        this.monstersGroup = scene.physics.add.group(); // 몬스터 그룹 생성
        this.missilesGroup = scene.physics.add.group(); // 미사일 그룹생성
        this.expBeadsGroup = scene.physics.add.group(); // 경험치 그룹생성
        this.monsterTimer = 0;
        this.circlePatternTimer = 0; //몬스터 원형 패턴
        this.player = player;
        this.stageNum = 1;
        this.monsterNumbers = [[0,0,0],[1, 1, 1], [0, 0, 0], [0, 0, 0],[1,1,1],[0,0,0],[1,1,5]]; // 각 스테이지별로 생성될 몬스터의 수
        this.nowMonsterNum = 0;
        this.stateMonsterLevel = 0;
        //this.createBoss();


        // 애니메이션 생성
        this.scene.anims.create({
            key: 'effect',
            frames: this.scene.anims.generateFrameNumbers('effect', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.setupCollisions();
    }
    // 몬스터 생성 위치 결정
    spawnPosition(){
        // mapSize가 정의되지 않은 경우, 기본값 사용
        const mapWidth = this.mapSize?.width || 800; // 예시 기본값
        const mapHeight = this.mapSize?.height || 600; // 예시 기본값

        const buffer = 50;
        const maxDistance = 400;
        let posX = this.player.x + Phaser.Math.Between(-maxDistance, maxDistance);
        let posY = this.player.y + Phaser.Math.Between(-maxDistance, maxDistance);

        // 맵 경계 내로 위치 조정
        posX = Phaser.Math.Clamp(posX, buffer, mapWidth - buffer);
        posY = Phaser.Math.Clamp(posY, buffer, mapHeight - buffer);

        return { posX, posY };
    }

    Random() {
        return Math.random() < 0.5 ? -1 : 1;
    }

    RandomNumber(number) {
        return (150 + Math.floor(Math.random() * number)) * this.Random();
    }

    createCirclePatternMonster() {
        const buffer = 50; // 맵 경계로부터의 버퍼
        const monstersCount = 20; // 한 번에 생성할 몬스터의 수
        const playerX = this.player.x;
        const playerY = this.player.y;
        const mapRightBoundary = this.mapSize.width - buffer;
        const mapBottomBoundary = this.mapSize.height - buffer;
        
        // 맵의 경계와 플레이어 사이의 최소 거리를 계산하여 반지름을 결정합니다.
        const distanceToRightBoundary = mapRightBoundary - playerX;
        const distanceToBottomBoundary = mapBottomBoundary - playerY;
        const distanceToLeftBoundary = playerX - buffer;
        const distanceToTopBoundary = playerY - buffer;
    
        // 가능한 최대 반지름은 플레이어 위치에서 가장 가까운 경계까지의 거리입니다.
        const maxRadius = Math.min(distanceToRightBoundary, distanceToBottomBoundary, distanceToLeftBoundary, distanceToTopBoundary);
    
        for (let i = 0; i < monstersCount; i++) {
            const angle = (i / monstersCount) * 2 * Math.PI; // 각 몬스터의 각도
            let radius = maxRadius; // 가능한 최대 반지름을 사용합니다.
            let x = playerX + radius * Math.cos(angle);
            let y = playerY + radius * Math.sin(angle);
            
            // 맵 경계를 넘어가지 않도록 x, y 위치를 조정합니다.
            x = Phaser.Math.Clamp(x, buffer, mapRightBoundary);
            y = Phaser.Math.Clamp(y, buffer, mapBottomBoundary);
            
            this.spawnMonster(x, y);
        }
    }
    
    
    

    setupCollisions() {
        // 몬스터 그룹 내에서의 충돌 처리를 설정합니다.
        this.scene.physics.add.collider(this.monstersGroup, this.monstersGroup, (monsterA, monsterB) => {
            // 충돌 처리 로직
            // 예시로, 각 몬스터에 대해 handleCollision 메서드를 호출합니다.
            if (monsterA.handleCollision) monsterA.handleCollision();
            if (monsterB.handleCollision) monsterB.handleCollision();
        });
    }

    spawnMonster(x, y) {
        let monster = new Lv1_0001(this.scene, x, y, this.player); // 항상 0001 유형의 몬스터 생성
        this.monstersGroup.add(monster);
        this.scene.physics.add.collider(this.monstersGroup, monster);
    }

    // 몬스터 생성 메서드
    createMonster() {
        let monster;

        // 스테이지의 맞는 배열 가져오기
        let numMonstersOfType = this.monsterNumbers[this.stageNum];
        
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

            // 위치 표시를 위한 그래픽 요소를 생성합니다.

        // 새로운 위치 결정 메서드 사용
        const { posX, posY } = this.spawnPosition();

        //let marker = this.scene.add.graphics();
        // marker.fillStyle(0xFF0000, 0.5);
        //marker.fillCircle(posX, posY, 50); 
        

        let monsterSprite = this.scene.add.sprite(posX, posY, 'effect');
        monsterSprite.anims.play('effect'); // 애니메이션 재생

        // 몬스터 생성 딜레이 시간 설정 (예: 3초 후)
        const delay = 1000;

        // 일정 시간이 지난 후에 몬스터 생성 함수를 호출합니다.
        setTimeout(() => {
            // 실제 몬스터를 생성합니다.
            switch (this.stateMonsterLevel) {
                case 0:
                    monster = new Monster1(this.scene, posX, posY, this.player);
                    break;
                case 1:
                    monster = new Monster2(this.scene, posX, posY, this.player);
                    break;
                case 2:
                    monster = new Monster3(this.scene, posX, posY, this.player);
                    break;
                default:
                    
                    break;
            }

            // 생성이 완료 됬으면 현재 몬스터 수 증가
            this.nowMonsterNum++;
            this.scene.physics.add.collider(this.monstersGroup, monster); // 몬스터 그룹과 새로운 몬스터 간의 충돌 감지
            this.monstersGroup.add(monster); // 생성된 몬스터를 그룹에 추가합니다.
            this.monstersCreated++;

            // 위치 표시를 제거합니다.
            // marker.clear();
            monsterSprite.destroy();
        }, delay);
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

        // 받아온 경험치 구슬 그룹 수를 반환한거 가지고 계산 전체 exp 전달
        this.scene.masterController.characterController.characterStatus.getExp(exp);
  
    }

    //위치 받기용 추가 함수
    getMonsters() {
        return this.monstersGroup;
    }

}