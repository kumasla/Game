class Monster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,spriteKey,player) {
        super(scene, x, y, spriteKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.player = player;
        this.scene=scene;
        // 미사일과 대상의 충돌 설정
        this.scene.physics.add.overlap(
            this, player, // 충돌 대상
            this.checkCollision, // 충돌 처리 함수
            null, // 콜백 컨텍스트
            this // 호출 컨텍스트
        );

        this.expBeadGroup = scene.physics.add.group();
        this.bonusBoxGroup = scene.physics.add.group();

        this.health = 10; // 몬스터의 체력
        this.attack = 10;// 기본 공격력
        
    }

    setupAnimations() {
    }

    update() {
        // 플레이어와 몬스터 사이의 거리를 계산합니다.
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 몬스터의 이동 속도를 결정합니다.

        const speed = 100; // 적절한 값을 설정하세요.
        // 플레이어를 향해 천천히 이동합니다.
        this.setVelocity(dx / distance * speed, dy / distance * speed);

    }

    // 이 부분 지금 플레이어와 몬스터가 부딪히면 몬스터가 데미지를 받네요..
    checkCollision(monster, player) {
        monster.scene.masterController.characterController.characterStatus.takeDamage(10);
    }

    hit(damage) {
        this.health -= damage;
        console.log(this.health);

        if (this.health <= 0) {
            this.destroyMonster();
        }
    }

    destroyMonster() {
        // 경험치 구슬 생성
        for (let i = 0; i < 2; i++) {
            const expBead = new ExpBead(this.scene, this.x, this.y);
            this.scene.masterController.monsterController.expBeadsGroup.add(expBead);
        }

        // 확률적으로 보너스 상자 생성
        if (Math.random() <= 0.05) {
            const bonusBox = this.bonusBoxGroup.create(this.x, this.y, 'bonusBox');
            bonusBox.setScale(0.8);
            bonusBox.setVelocity(Math.random() * 200 - 100, Math.random() * 200 - 100);
            this.scene.time.delayedCall(1000, () => {
                bonusBox.setVelocity(0, 0);
            });
        }

        this.destroy();
    }

}