class ExpBead extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'expBead');
        
        this.scene = scene;
    
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(0.8);
        this.speed = 500;

        // 생성될 때 바로 움직이는 Tween 설정
        this.moveTween = this.scene.tweens.add({
            targets: this,
            x: this.x + Phaser.Math.Between(-10, 10), // 랜덤한 범위로 x 좌표 변경
            y: this.y + Phaser.Math.Between(-10, 10), // 랜덤한 범위로 y 좌표 변경
            duration: 100, // 움직이는 시간 (밀리초)
            yoyo: false, // 다시 처음 위치로 돌아오도록 설정
            repeat: 0, // 반복 횟수 (0은 한 번만 반복)
            onComplete: () => {
                // Tween이 완료되면 충돌 감지를 활성화
                this.setVelocity(0, 0); // 움직임을 정지
                // 미사일과 대상의 충돌 설정
                this.scene.physics.add.overlap(
                    this, this.scene.player, // 충돌 대상
                    this.checkCollision, // 충돌 처리 함수
                    null, // 콜백 컨텍스트
                    this // 호출 컨텍스트
                );
            }
        });
    }

    checkCollision(ExpBead, player) {
        this.destroy();
        console.log('경험치 구슬 겟또 다제');
    }

    update() {
        // 플레이어와 ExpBead 사이의 거리를 계산
        const dx = this.scene.player.x - this.x;
        const dy = this.scene.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 플레이어 쪽으로 일정한 속도로 이동
        const speed = 50; // 이동 속도 (조절 가능)

        //거리가 100이하  일때만 추적 시작
        if(distance <=50){
            this.setVelocity(dx / distance * speed, dy / distance * speed);
        }
    }
}