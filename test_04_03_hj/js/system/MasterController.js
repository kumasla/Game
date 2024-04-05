class MasterController {
    constructor(scene) {
        this.playerManager;
        this.monsterController;
        this.characterController; //캐릭터 컨트롤러 - 김용우
        this.sceneData = scene;
        this.currentStage = 1;
        this.weaponController;
    }


    // Create의 데이터 상속
    init(characterName) {

        console.log(characterName);
        // 일단 메가맨 특성이 이런 느낌인지 아니면 플러스 알파로 기본무기도! 지급인지 궁금
        let firstWeapon;
        if(characterName == 'megaman') {
            firstWeapon = 'kar98';
        } else {
            firstWeapon = 'crossbowGun';
        }

        //무기 이미지 로드
        this.loadWeaponsData();

         // 로드가 완료되면 실행할 작업 설정
         this.sceneData.load.once('complete', () => {
            // 모든 이미지 로드 완료 후 실행할 코드(첫 무기 웨펀컨트롤러에 추가)
            this.setupAfterLoad(firstWeapon);
        });

        this.sceneData.load.start();

        //변수화 필요
        this.characterName = characterName || 'megaman';     
        //캐릭터 컨트롤러 생성 - 김용우
        this.characterController = new CharacterController(this.sceneData, this.characterName);
        //캐릭터 부여 - 김용우
        this.player = this.characterController.player;

        //캐릭터 위치 선정 - 김용우
        this.player.setPosition(game.config.width / 4, game.config.height / 2);

        this.monsterController = new MonsterController(this.sceneData, this.player);    

        //무기 컨트롤러 생성
        this.weaponController = new WeaponController(this.sceneData, this.player);

        return this.player;
    }

    // 업데이트의 데이터 상속
    update() {
        this.characterController.update();
        this.monsterController.update();
        this.weaponController.update();
    }

    updateStage() {
        this.currentStage += 1;

        this.monsterController.updateStage(this.currentStage);
        // 그 다른 컨트롤러에서 업데이트에 필요한 부분 호출해서 업데이트 하기\
        
        if(this.currentStage % 5 == 0) {
            // 보스 스테이지 시작
            this.monsterController.createBoss();
        }
    }

    //무기 이미지 로드
    loadWeaponsData() {
        const weaponsData = this.sceneData.cache.json.get('weaponData');
        for (const weaponKey in weaponsData) {
            const weapon = weaponsData[weaponKey];
            this.sceneData.load.image(weapon.name, weapon.path);
        }
    }

    //첫무기를 웨펀컨트롤러에 추가해줌
    setupAfterLoad(weaponName) {
        this.weaponController.addWeapon(weaponName);
    }

    getCharacterStatus() {
        return this.characterController.characterStatus.getCharacterStatus();
    }

    getWeapons() {
        return this.weaponController.getWeapons();
    }



}