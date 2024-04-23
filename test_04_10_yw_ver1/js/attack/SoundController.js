class SoundController {
    constructor(scene) {
        this.scene = scene;
        this.init();
    }

    init() {
        // 효과음 파일 로드
        this.scene.load.audio('swordeffect', 'assets/sounds/SwordSound.mp3');
    }

    playEffectSound(soundName) {
        // 효과음 플레이어 생성 및 사운드 추가
        const effectSound = this.scene.sound.add(soundName);

        // 효과음 재생
        effectSound.play();
    }
}