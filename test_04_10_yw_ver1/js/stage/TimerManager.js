class TimerManager {
    constructor(scene) {
        this.scene = scene;
        this.timer = null;
    }

    // 타이머 시작
    startTimer(durationInSeconds, callback) {
        this.timer = this.scene.time.delayedCall(durationInSeconds * 1000, callback, [], this.scene);
    }

    // 남은 시간 얻기
    getRemainingSeconds() {
        if (!this.timer) return 0;
        return this.timer.getRemainingSeconds();
    }

    // 타이머 멈추기
    stopTimer() {
        if (this.timer) {
            this.timer.remove();
            this.timer = null;
        }
    }

    // 타이머 재설정
    resetTimer(durationInSeconds, callback) {
        this.stopTimer();
        this.startTimer(durationInSeconds, callback);
    }
}
