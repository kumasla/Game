class Lv1_0001 extends Monster {
    constructor(scene, x, y, player) {
        super(scene, x, y, 'Lv1_0001', player);

        // 몬스터 설정
        this.setCollideWorldBounds(true);
        this.setBounce(1.4);

        // 몬스터 상태 설정
        this.speed= 3;
        this.health = 20;
        this.attack = 10;
        this.attackRange = 200; // 공격 사거리
        this.isAttacking = false;
        this.attackCooldown = 3000; // 공격 쿨타임 (ms)
        this.lastAttackTime = -this.attackCooldown; // 즉시 공격 가능하도록 초기 설정

        // 애니메이션 설정은 별도의 메서드로 분리하여 호출
        this.setupAnimations();

        // 미사일 발사 관련 설정
        this.fireRate = 1500; 
        this.nextFire = 0; 

        this.isColliding = false; // 충돌 상태
        this.collisionTime = 0; // 충돌이 발생한 시간
    }


    setupAnimations() {
        // 전역 애니메이션 설정으로 이동
        if (!this.scene.anims.exists('walk_Lv1_0001')) {
            this.scene.anims.create({
                key: 'walk_Lv1_0001',
                frames: this.scene.anims.generateFrameNumbers('Lv1_0001', { frames: [0, 1] }),
                frameRate: 3,
                repeat: -1
            });
        }
        if (!this.scene.anims.exists('attack_Lv1_0001')) {
            this.scene.anims.create({
                key: 'attack_Lv1_0001',
                frames: this.scene.anims.generateFrameNumbers('Lv1_0001', { frames: [2, 3, 4] }),
                frameRate: 5,
                repeat: 0
            });
        }
    }

    update() {
        super.update();
        if (!this.isColliding) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.x, this.y);

            if (distance <= this.attackRange && !this.isAttacking && this.scene.time.now > this.lastAttackTime + this.attackCooldown) {
                this.isAttacking = true; // 공격 상태로 설정
                this.lastAttackTime = this.scene.time.now; // 마지막 공격 시간을 현재 시간으로 업데이트
                this.play('attack_Lv1_0001', true); // 공격 애니메이션 재생
    
                this.on('animationupdate', (animation, frame) => {
                    if (frame.index === 3) {
                        this.attackAction(); // 공격 실행
                    }
                });
    
                this.on('animationcomplete', () => {
                    this.isAttacking = false;
                    this.play('walk_Lv1_0001', true);
                });
            }
        } else {
            // 충돌 상태에서는 움직임을 멈춥니다.
            this.body.setVelocity(0, 0);
        }

        const playerX = this.player.x;
    
        if (playerX > this.x) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false); 
        }

        
    }
    
    attackAction() {
        const missile = new Missile(this.scene, this.x, this.y);

        this.scene.masterController.monsterController.missilesGroup.add(missile);

        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
        missile.fire(this.x, this.y, angle);
    }

    handleCollision() {
        // 충돌 처리 로직: 여기서 충돌 상태를 활성화
        this.isColliding = true;
        // 움직임을 즉시 멈추도록 속도 설정
        this.body.setVelocity(0, 0);
        
        // 충돌 상태를 일정 시간 후에 해제하려면, Phaser의 delayedCall을 사용
        this.scene.time.delayedCall(100, () => {
            this.isColliding = false;
        }, [], this);
    }
    
}
