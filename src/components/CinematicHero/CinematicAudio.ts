/**
 * Synthesizes realistic culinary ambient sounds using the browser Web Audio API.
 * Zero external audio file dependencies.
 */

class CinematicSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private sizzleGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
  }

  public toggle(progress: number): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(progress);
      return true;
    }
  }

  public start(progress: number) {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;

    // 1. Ambient low kitchen hum (Brown noise)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Low-pass filter for deep stove warmth
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 160;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    whiteNoise.connect(lowpass);
    lowpass.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);
    whiteNoise.start();

    // 2. High-frequency crackle/sizzle (High-pass filtered noise)
    const sizzleSource = this.ctx.createBufferSource();
    const sizzleBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const sizzleData = sizzleBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      sizzleData[i] = (Math.random() * 2 - 1) * 0.15;
    }
    sizzleSource.buffer = sizzleBuffer;
    sizzleSource.loop = true;

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'bandpass';
    highpass.frequency.value = 2400;
    highpass.Q.value = 3.0;

    this.sizzleGain = this.ctx.createGain();
    const targetGain = Math.min(0.08, Math.max(0.005, (progress - 0.2) * 0.12));
    this.sizzleGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);

    sizzleSource.connect(highpass);
    highpass.connect(this.sizzleGain);
    this.sizzleGain.connect(this.ctx.destination);
    sizzleSource.start();
  }

  public updateSizzleIntensity(progress: number) {
    if (!this.isPlaying || !this.sizzleGain || !this.ctx) return;
    const targetGain = Math.min(0.09, Math.max(0.005, (progress - 0.2) * 0.14));
    this.sizzleGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
  }

  public stop() {
    this.isPlaying = false;
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }

  public get active(): boolean {
    return this.isPlaying;
  }
}

export const cinematicAudio = new CinematicSoundEngine();
