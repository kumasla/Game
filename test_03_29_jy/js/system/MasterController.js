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

        //변수화 필요
        this.characterName = characterName || 'megaman';     
        //캐릭터 컨트롤러 생성 - 김용우
        this.characterController = new CharacterController(this.sceneData, this.characterName);
        //캐릭터 부여 - 김용우
        this.player = this.characterController.playerAnimation;
        //캐릭터 위치 선정 - 김용우
        this.player.setPosition(game.config.width / 4, game.config.height / 2);

        this.monsterController = new MonsterController(this.sceneData, this.player);    

        //무기 컨트롤러 생성
        this.weaponController = new WeaponController(this.sceneData, this.player);

        let weapon1 = "sniperRifle";
        this.weaponController.getWeapons(weapon1)

        let weapon2 = "flameBlade";
        this.weaponController.getWeapons(weapon2)

        let weapon3 = "cursedUnwol-Do";
        this.weaponController.getWeapons(weapon3)

        this.playerManager = new PlayerManager(this.player);
        

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


}