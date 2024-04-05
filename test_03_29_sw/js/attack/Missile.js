class Missile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'missile');
        // 생성자에서 this.scene 설정
        this.scene = scene;
    
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(1);
        
        // 미사일 속도
        this.speed = 500;

    }

    fire(x, y, angle) {
        this.setPosition(x, y);
        this.setRotation(angle);
        this.setVelocityX(Math.cos(angle) * this.speed);
        this.setVelocityY(Math.sin(angle) * this.speed);

        // 미사일과 대상의 충돌 설정
        this.scene.physics.add.overlap(
            this, this.scene.player, // 충돌 대상
            this.checkCollision, // 충돌 처리 함수
            null, // 콜백 컨텍스트
            this // 호출 컨텍스트
        );
    }

    checkCollision(missile, player) {
        // // 파티클 이펙트 매니저 생성
        // const particleManager = this.scene.add.particles('explosion');

        // // 파티클 이펙트 생성
        // const explosionEmitter = particleManager.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD',
        //     lifespan: 200,
        // });

        // // 이펙트 위치 설정
        // explosionEmitter.setPosition(missile.x, missile.y);

        // // 파티클 이펙트 터뜨리기
        // explosionEmitter.explode(20);
        missile.scene.masterController.characterController.character.takeDamage(10);

        // 미사일 제거
        missile.destroy();
        
        //player.takeDamage(10);
        //console.log(player);
        //player.hit(10);

        // 이후에 충돌 후 처리를 수행할 내용을 여기에 추가하세요.
    }
}