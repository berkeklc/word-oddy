class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playClick() {
        this.playTone(800, 'sine', 0.1, 0.05);
    }

    playSelect() {
        this.playTone(400, 'triangle', 0.1, 0.05);
    }

    playSuccess() {
        if (!this.enabled) return;
        const now = this.ctx.currentTime;
        // Arpeggio
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.1), i * 100);
        });
    }

    playError() {
        this.playTone(150, 'sawtooth', 0.3, 0.1);
    }

    playLevelComplete() {
        if (!this.enabled) return;
        // Victory fanfare
        [523.25, 523.25, 523.25, 659.25, 783.99, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'square', 0.4, 0.1), i * 150);
        });
    }
}

export const soundManager = new SoundManager();
