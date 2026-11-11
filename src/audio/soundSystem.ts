/**
 * Apex Grid Procedural Web Audio Engine
 * Real-time synthesis of a V6 turbo hybrid engine,
 * turbo spool, wastegate flutter, tire screech, kerb rumble, DRS chimes, and crash impacts.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Engine nodes
  private engineOsc1: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private engineGain: GainNode | null = null;

  // Turbo whistle
  private turboOsc: OscillatorNode | null = null;
  private turboGain: GainNode | null = null;

  // ERS boost
  private ersOsc: OscillatorNode | null = null;
  private ersGain: GainNode | null = null;

  // Kerb rumble
  private kerbOsc: OscillatorNode | null = null;
  private kerbGain: GainNode | null = null;

  // Tire screech
  private screechGain: GainNode | null = null;
  private screechFilter: BiquadFilterNode | null = null;
  private screechSource: AudioBufferSourceNode | null = null;

  // State
  private isEnabled: boolean = false;
  private volume: number = 0.5;
  private prevThrottle: number = 0;
  private lastDrsBeepTime: number = 0;

  constructor() {
    // Lazy init on first user gesture
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupEngine();
      this.setupTurbo();
      this.setupErs();
      this.setupKerb();
      this.setupTireScreech();

      this.isEnabled = true;
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    if (enabled && !this.ctx) {
      this.init();
    }
    this.isEnabled = enabled;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(enabled ? this.volume : 0, this.ctx.currentTime, 0.05);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && this.isEnabled) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  private setupEngine() {
    if (!this.ctx || !this.masterGain) return;

    // Dual sawtooth oscillators for aggressive V6 engine harmonics
    this.engineOsc1 = this.ctx.createOscillator();
    this.engineOsc1.type = 'sawtooth';
    this.engineOsc1.frequency.setValueAtTime(70, this.ctx.currentTime);

    this.engineOsc2 = this.ctx.createOscillator();
    this.engineOsc2.type = 'triangle';
    this.engineOsc2.frequency.setValueAtTime(140, this.ctx.currentTime);

    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
    this.engineFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.engineOsc1.connect(this.engineFilter);
    this.engineOsc2.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    this.engineOsc1.start();
    this.engineOsc2.start();
  }

  private setupTurbo() {
    if (!this.ctx || !this.masterGain) return;

    this.turboOsc = this.ctx.createOscillator();
    this.turboOsc.type = 'sine';
    this.turboOsc.frequency.setValueAtTime(1800, this.ctx.currentTime);

    this.turboGain = this.ctx.createGain();
    this.turboGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.turboOsc.connect(this.turboGain);
    this.turboGain.connect(this.masterGain);
    this.turboOsc.start();
  }

  private setupErs() {
    if (!this.ctx || !this.masterGain) return;

    this.ersOsc = this.ctx.createOscillator();
    this.ersOsc.type = 'sawtooth';
    this.ersOsc.frequency.setValueAtTime(850, this.ctx.currentTime);

    const ersFilter = this.ctx.createBiquadFilter();
    ersFilter.type = 'bandpass';
    ersFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    ersFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    this.ersGain = this.ctx.createGain();
    this.ersGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.ersOsc.connect(ersFilter);
    ersFilter.connect(this.ersGain);
    this.ersGain.connect(this.masterGain);
    this.ersOsc.start();
  }

  private setupKerb() {
    if (!this.ctx || !this.masterGain) return;

    this.kerbOsc = this.ctx.createOscillator();
    this.kerbOsc.type = 'square';
    this.kerbOsc.frequency.setValueAtTime(45, this.ctx.currentTime);

    this.kerbGain = this.ctx.createGain();
    this.kerbGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.kerbOsc.connect(this.kerbGain);
    this.kerbGain.connect(this.masterGain);
    this.kerbOsc.start();
  }

  private setupTireScreech() {
    if (!this.ctx || !this.masterGain) return;

    // Generate 1 second looped white noise
    const bufferSize = this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.screechSource = this.ctx.createBufferSource();
    this.screechSource.buffer = noiseBuffer;
    this.screechSource.loop = true;

    this.screechFilter = this.ctx.createBiquadFilter();
    this.screechFilter.type = 'bandpass';
    this.screechFilter.frequency.setValueAtTime(1100, this.ctx.currentTime);
    this.screechFilter.Q.setValueAtTime(5.0, this.ctx.currentTime);

    this.screechGain = this.ctx.createGain();
    this.screechGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.screechSource.connect(this.screechFilter);
    this.screechFilter.connect(this.screechGain);
    this.screechGain.connect(this.masterGain);
    this.screechSource.start();
  }

  /**
   * Called every frame with current physics telemetry
   */
  public updateTelemetry(
    rpm: number,
    throttle: number,
    brake: number,
    speedRatio: number,
    slipRatio: number,
    onKerb: boolean,
    ersActive: boolean
  ) {
    if (!this.ctx || !this.isEnabled) return;
    const t = this.ctx.currentTime;

    // Engine frequency based on RPM (idle ~60Hz, 15000 RPM ~420Hz)
    const normalizedRpm = Math.max(0, Math.min(1, rpm / 15000));
    const fundamentalFreq = 65 + normalizedRpm * 360;

    if (this.engineOsc1 && this.engineOsc2 && this.engineFilter && this.engineGain) {
      this.engineOsc1.frequency.setTargetAtTime(fundamentalFreq, t, 0.03);
      this.engineOsc2.frequency.setTargetAtTime(fundamentalFreq * 1.5, t, 0.03);

      const filterCutoff = 550 + throttle * 2800 + normalizedRpm * 1400;
      this.engineFilter.frequency.setTargetAtTime(filterCutoff, t, 0.04);

      // Volume: audible at idle, loud under load
      const baseGain = 0.06 + throttle * 0.12 + normalizedRpm * 0.06;
      this.engineGain.gain.setTargetAtTime(baseGain, t, 0.03);
    }

    // Turbo whistle tracks high RPM + throttle
    if (this.turboOsc && this.turboGain) {
      const turboFreq = 1600 + normalizedRpm * 2200;
      this.turboOsc.frequency.setTargetAtTime(turboFreq, t, 0.05);
      const turboVol = throttle > 0.3 ? (throttle * 0.035 * normalizedRpm) : 0;
      this.turboGain.gain.setTargetAtTime(turboVol, t, 0.06);
    }

    // Wastegate pop when throttle drops suddenly from high RPM
    if (this.prevThrottle > 0.8 && throttle < 0.2 && normalizedRpm > 0.5) {
      this.playWastegateFlutter();
    }
    this.prevThrottle = throttle;

    // ERS boost whine
    if (this.ersGain && this.ersOsc) {
      if (ersActive) {
        this.ersOsc.frequency.setTargetAtTime(900 + speedRatio * 800, t, 0.04);
        this.ersGain.gain.setTargetAtTime(0.08, t, 0.04);
      } else {
        this.ersGain.gain.setTargetAtTime(0.0, t, 0.06);
      }
    }

    // Kerb rumble
    if (this.kerbGain && this.kerbOsc) {
      if (onKerb && speedRatio > 0.1) {
        const kerbFreq = 40 + speedRatio * 35;
        this.kerbOsc.frequency.setTargetAtTime(kerbFreq, t, 0.02);
        this.kerbGain.gain.setTargetAtTime(0.12 * Math.min(speedRatio * 2, 1), t, 0.02);
      } else {
        this.kerbGain.gain.setTargetAtTime(0.0, t, 0.04);
      }
    }

    // Tire Screech on lateral slide or heavy brake lockup
    if (this.screechGain && this.screechFilter) {
      const isLockup = brake > 0.7 && speedRatio > 0.3;
      const effectiveSlip = Math.max(slipRatio, isLockup ? 0.75 : 0);

      if (effectiveSlip > 0.25) {
        const screechIntensity = Math.min((effectiveSlip - 0.25) * 1.5, 1);
        this.screechGain.gain.setTargetAtTime(screechIntensity * 0.14, t, 0.03);
        this.screechFilter.frequency.setTargetAtTime(1000 + effectiveSlip * 600, t, 0.03);
      } else {
        this.screechGain.gain.setTargetAtTime(0.0, t, 0.05);
      }
    }
  }

  public playWastegateFlutter() {
    if (!this.ctx || !this.isEnabled || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.18);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  public playDrsChime() {
    if (!this.ctx || !this.isEnabled || !this.masterGain) return;
    const now = performance.now();
    if (now - this.lastDrsBeepTime < 400) return;
    this.lastDrsBeepTime = now;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // High-pitched two-tone steering wheel confirmation
    osc.frequency.setValueAtTime(1480, t);
    osc.frequency.setValueAtTime(1960, t + 0.06);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  public playCrashImpact() {
    if (!this.ctx || !this.isEnabled || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // Deep punch boom
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'square';
    boomOsc.frequency.setValueAtTime(140, t);
    boomOsc.frequency.exponentialRampToValueAtTime(18, t + 0.45);

    boomGain.gain.setValueAtTime(0.4, t);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    boomOsc.connect(boomGain);
    boomGain.connect(this.masterGain);
    boomOsc.start(t);
    boomOsc.stop(t + 0.52);

    // Crunch noise
    const noiseLength = 0.35;
    const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * noiseLength), this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(700, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + noiseLength);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseSource.start(t);
  }

  public playSectorChime(isPurple: boolean) {
    if (!this.ctx || !this.isEnabled || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = isPurple ? 1318.5 : 1046.5; // E6 or C6
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.25, t + 0.12);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.28);
  }

  public playLapRecord() {
    if (!this.ctx || !this.isEnabled || !this.masterGain) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.09);

      gain.gain.setValueAtTime(0, t);
      gain.gain.setValueAtTime(0.18, t + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + i * 0.09);
      osc.stop(t + i * 0.09 + 0.35);
    });
  }

  public stopAll() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (this.engineGain) this.engineGain.gain.setTargetAtTime(0, t, 0.05);
    if (this.turboGain) this.turboGain.gain.setTargetAtTime(0, t, 0.05);
    if (this.ersGain) this.ersGain.gain.setTargetAtTime(0, t, 0.05);
    if (this.kerbGain) this.kerbGain.gain.setTargetAtTime(0, t, 0.05);
    if (this.screechGain) this.screechGain.gain.setTargetAtTime(0, t, 0.05);
  }
}

export const soundEngine = new SoundSystem();
