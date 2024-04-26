class SoundController {
    constructor(scene) {
        this.scene = scene;
        this.init();
    }

    init() {
        // 효과음 파일 로드
        this.scene.load.audio('swordeffect', 'assets/sounds/SwordSound.mp3');

        this.scene.load.audio('sniperSound', 'assets/sounds/sniperSound.mp3');
        this.scene.load.audio('machineGunSound', 'assets/sounds/machineGunSound.mp3');
        this.scene.load.audio('assualtRifleSound', 'assets/sounds/assualtRifleSound.mp3');
        this.scene.load.audio('rocketLauncherFireSound', 'assets/sounds/rocketLauncherFireSound.mp3');
    }

    playEffectSound(soundName) {
        // 효과음 플레이어 생성 및 사운드 추가
        const effectSound = this.scene.sound.add(soundName);

        //사운드 크기 조절
        effectSound.setVolume(0.25);
        effectSound.setRate(2);

        // 효과음 재생
        effectSound.play();
    }
}