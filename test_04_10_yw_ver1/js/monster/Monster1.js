class Monster1 extends Monster {
    constructor(scene, x, y,player,textureKey) {
        super(scene, x, y, textureKey ,player);
        
        this.setScale(2); // 몬스터 크기 조정
        this.setCollideWorldBounds(true); // 화면 경계와 충돌
        this.setBounce(1); // 튕기기 설정
        this.speed = Phaser.Math.Between(50, 100); // 몬스터의 이동 속도를 랜덤하게 설정합니다.

        this.health = 20; 
        this.attack = 20; 

        this.setupAnimations(textureKey);

    }

    setupAnimations() {
        // JSON 데이터가 로드된 후 사용 가능하다고 가정
        let animationsData = this.scene.cache.json.get('monsterAnimations'); // JSON 데이터 불러오기

        // 'lv1_0002' 몬스터에 대한 'walk' 애니메이션 데이터만 추출
        let walkAnimations = animationsData.lv1_0002.animations.filter(anim => anim.key === "walk");

        // 필터링된 애니메이션 데이터를 사용하여 애니메이션 생성
        walkAnimations.forEach(anim => {
            if (!this.scene.anims.exists(anim.key)) {
                this.scene.anims.create({
                    key: anim.key,
                    frames: this.scene.anims.generateFrameNumbers(anim.texture, { frames: anim.frames.map(frame => frame.frame) }),
                    frameRate: anim.frameRate,
                    repeat: anim.repeat
                });
            }
        });

        // 애니메이션 재생
        if (walkAnimations.length > 0) {
            this.play(walkAnimations[0].key);
        }

    }


}