class Monster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, player) {
    super(scene, x, y, spriteKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.player = player;
    this.scene = scene;
    // 미사일과 대상의 충돌 설정
    this.scene.physics.add.overlap(
      this,
      player, // 충돌 대상
      this.checkCollision, // 충돌 처리 함수
      null, // 콜백 컨텍스트
      this // 호출 컨텍스트
    );

    this.expBeadGroup = scene.physics.add.group();
    this.bonusBoxGroup = scene.physics.add.group();

    this.health = 10; // 몬스터의 체력
    this.attack = 10; // 기본 공격력
    this.setDepth(1);
    
  }

  setupAnimations() {}

  update() {
    // 플레이어와 몬스터 사이의 거리를 계산합니다.
    const dx = this.player.x - this.x;
    const dy = this.player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 몬스터의 이동 속도를 결정합니다.

    const speed = 100; // 적절한 값을 설정하세요.
    // 플레이어를 향해 천천히 이동합니다.
    this.setVelocity((dx / distance) * speed, (dy / distance) * speed);
  }

  // 이 부분 지금 플레이어와 몬스터가 부딪히면 몬스터가 데미지를 받네요..
  checkCollision(monster, player) {
    monster.scene.masterController.characterTakeDamage(10);
  }

  // 몬스터 깜빡이기
  blink() {
    this.isBlinking = true;
    this.setVisible(!this.visible); // 스프라이트 가시성을 토글

    // 일정 시간 후에 깜빡임 멈추도록 타이머 설정
    this.scene.time.delayedCall(2000, () => {
      this.stopBlink(); // 깜빡임 중지
    });

    // 일정 시간마다 깜빡이도록 타이머 설정
    this.blinkTimer = this.scene.time.addEvent({
      delay: 200, // 깜빡임 간격
      callback: () => {
        this.setVisible(!this.visible); // 스프라이트 가시성을 토글
      },
      callbackScope: this,
      loop: true, // 무한 반복
    });
  }

  // 깜빡임 멈추기
  stopBlink() {
    this.isBlinking = false;
    this.setVisible(true); // 몬스터 가시성을 다시 활성화
    if (this.blinkTimer) {
      this.blinkTimer.remove(); // 깜빡임 타이머 제거
    }
  }

  hit(damage) {
    this.health -= damage;

    this.monsterback();
    if (!this.isBlinking) {
      this.blink(); // 깜빡임 효과 시작
    }

    if (this.health <= 0) {
      
      this.destroyMonster();
    }
  }

  monsterback() {
    const knockbackDistance = 50; // 넉백 거리를 설정하세요.

    // 플레이어와 몬스터 사이의 방향 벡터 계산
    const directionX = this.x - this.player.x;
    const directionY = this.y - this.player.y;

    // 방향 벡터를 정규화하여 거리가 1인 벡터로 변환
    const distance = Math.sqrt(
      directionX * directionX + directionY * directionY
    );
    const normalizedDirectionX = directionX / distance;
    const normalizedDirectionY = directionY / distance;

    // 넉백할 위치 계산
    const knockbackX = this.x + normalizedDirectionX * knockbackDistance;
    const knockbackY = this.y + normalizedDirectionY * knockbackDistance;

    // 넉백 적용
    this.setPosition(knockbackX, knockbackY);
  }

  destroyMonster() {
    //몬스터 죽은 횟수 올리기
    this.scene.masterController.gameDataManager.updateMonstersKilled();

    // 경험치 구슬 생성
    for (let i = 0; i < 2; i++) {
      const expBead = new ExpBead(this.scene, this.x, this.y);
      this.scene.masterController.monsterController.expBeadsGroup.add(expBead);
    }

    // 확률적으로 보너스 상자 생성
    if (Math.random() <= 0.05) {
      const bonusBox = this.bonusBoxGroup.create(this.x, this.y, "bonusBox");
      bonusBox.setScale(0.8);
      bonusBox.setVelocity(
        Math.random() * 200 - 100,
        Math.random() * 200 - 100
      );
      this.scene.time.delayedCall(1000, () => {
        bonusBox.setVelocity(0, 0);
      });
    }

    this.destroy();
  }
}
