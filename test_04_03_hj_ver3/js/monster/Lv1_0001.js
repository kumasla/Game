class Lv1_0001 extends Monster {
    constructor(scene, x, y, player) {
        super(scene, x, y, 'Lv1_0001', player);

        // 몬스터 설정
        this.setCollideWorldBounds(true);
        this.setBounce(1);

        // 몬스터 상태 설정
        this.health = 20;
        this.attack = 10;
        this.attackRange = 200; // 공격 사거리
        this.isAttacking = false;
        this.attackCooldown = 3000; // 공격 쿨타임 (ms)
        this.lastAttackTime = -this.attackCooldown; // 즉시 공격 가능하도록 초기 설정

        // 애니메이션 설정은 별도의 메서드로 분리하여 호출
        this.setupAnimations();
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
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.x, this.y);
    
        if (distance <= this.attackRange && !this.isAttacking) {
            // 조건에 따라 attack 메서드를 호출합니다.
            this.attack(this.scene.time.now);
        }
    }
    

    attack(currentTime) {
        if (!this.isAttacking || currentTime >= this.lastAttackTime + this.attackCooldown) {
            this.isAttacking = true;
            this.lastAttackTime = currentTime;

            // 공격 애니메이션 재생
            this.play('attack_Lv1_0001', true);

            // 'animationupdate' 리스너 추가
            this.once('animationupdate', (animation, frame) => {
                if (frame.index === 3) {
                    this.attackAction();
                }
            });

            // 'animationcomplete' 이벤트 리스너
            this.once('animationcomplete', () => {
                this.isAttacking = false;
                this.play('walk_Lv1_0001', true);
            });
        }
    }

    attackAction() {
        console.log('빵야'); // 미사일 발사 로그
    }
}
