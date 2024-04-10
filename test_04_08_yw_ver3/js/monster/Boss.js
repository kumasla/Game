class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, player) {
        super(scene, x, y, 'bossSprite');
        this.scene = scene;
        this.player = player;
        scene.add.existing(this);
        this.setupAnimations();
        this.maxHealth = 1000;
        this.nowHealth = this.maxHealth;
        this.speed = 100;
        this.pattern = 0;
        this.setScale(4);
        
    }

    createTrail() {

        // 보스가 이미 파괴되었다면 작업을 수행하지 않습니다.
        if (this.destroyed) {
            return;
        }


        const trail = this.scene.add.sprite(this.x, this.y, 'bossSprite');
        trail.setAlpha(0.1); // 잔상의 투명도 설정
        this.scene.tweens.add({
            targets: trail,
            alpha: { from: 0.5, to: 0 },
            duration: 1000, // 잔상이 사라지는 데 걸리는 시간 (밀리초)
            onComplete: () => trail.destroy(),
        });
    }

    startTrail() {
        // 잔상 생성을 시작하고, 100ms마다 createTrail 메서드를 호출하여 잔상을 생성합니다.
        this.trailTimer = this.scene.time.addEvent({
            delay: 100, // 잔상이 생성되는 시간 간격 (밀리초)
            callback: this.createTrail,
            callbackScope: this,
            loop: true,
        });

        // 일정 시간 후에 잔상 생성 중지
        this.scene.time.delayedCall(5000, this.stopTrail, [], this);
    }

    stopTrail() {
        // 잔상 생성 중지
        this.speed = 100;
        this.trailTimer.destroy();
    }

    setupAnimations() {
        const animation = this.scene.anims.get('walk_boss');

        if (!animation) {
            this.scene.anims.create({
                key: 'walk_boss',
                frames: [
                    { key: 'bossSprite', frame: 0 },
                    { key: 'bossSprite', frame: 1 },
                ],
                frameRate: 3,
                repeat: -1
            });

        }
        this.play('walk_boss');
    }

    fireMissile() {
        // 미사일을 발사할 각도를 랜덤하게 설정합니다.
        const numMissiles = 25; // 발사할 미사일의 수
        const angleIncrement = Phaser.Math.PI2 / numMissiles;
        const fireNum =4;

        const mapWidth = this.scene.game.config.width;
        const mapHeight = this.scene.game.config.height;

        

        for(let i =0; i< fireNum;i++){
            let centerX = Phaser.Math.Between(0, mapWidth);
            let centerY = Phaser.Math.Between(0, mapHeight);

            for (let i = 0; i < numMissiles; i++) {
                const angle = i * angleIncrement;
                const missile = new Missile(this.scene, centerX, centerY);
                missile.fire(centerX, centerY, angle);
            }
        }
    }

    update() {
        // 플레이어와 몬스터 사이의 거리를 계산합니다.
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 몬스터의 이동 속도를 결정합니다.
        
        // 플레이어를 향해 천천히 이동합니다.
        this.setVelocity(dx / distance * this.speed, dy / distance * this.speed);

        // 일정 시간마다 미사일 발사
        if (this.scene.time.now > (this.nextFireTime || 0)) {

            this.nextFireTime = this.scene.time.now + Phaser.Math.Between(5000, 10000); // 미사일을 발사하는 간격 (3초 ~ 5초 사이)


            if(this.pattern >= 1){


                let  attack = Phaser.Math.Between(0, this.pattern);

                switch(attack){
                    case 0:
                        break;
                    case 1:
                        this.speed = 200;
                        this.startTrail();
                        break;
                    case 2:
                        this.fireMissile();
                        break;
                }
                
            }

        }
    }

    hit(damage) {
        let update = this.nowHealth - damage;
        if(update <= 0) {
           this.destroy();
        } else {
            this.nowHealth = update;
        }

        //패턴 배수
        const patternThreshold = 30;
        if (this.nowHealth > 0 && this.nowHealth % patternThreshold === 0) {
            this.pattern++; 
        }
    }
}