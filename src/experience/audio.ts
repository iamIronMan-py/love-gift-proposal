type Cue =
  | 'chime'
  | 'whoosh'
  | 'takeoff'
  | 'landing'
  | 'pop'
  | 'bark'
  | 'open'
  | 'celebrate';

class StoryAudio {
  private ctx: AudioContext | null = null;

  private master: GainNode | null = null;

  private ambientGain: GainNode | null = null;

  private noise: AudioBuffer | null = null;

  muted = false;

  private unlocked = false;

  private lastPlayed: Partial<Record<Cue, number>> = {};

  private bgmTimer: number | null = null;

  private padOscs: OscillatorNode[] = [];

  private engineGain: GainNode | null = null;

  private engineFilter: BiquadFilterNode | null = null;

  private engineOsc: OscillatorNode | null = null;


  private ensure() {
    if (this.ctx) return this.ctx;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = this.muted ? 0 : 0.5;
    master.connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
    const length = Math.floor(ctx.sampleRate * 1.2);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    this.noise = buffer;
    return ctx;
  }

  unlock() {
    const ctx = this.ensure();
    if (!ctx) return;
    this.unlocked = true;
    if (ctx.state === 'suspended') void ctx.resume();
    this.startAmbient();
    this.startMelody();
  }

  setMuted(value: boolean) {
    this.muted = value;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(value ? 0 : 0.5, this.ctx.currentTime, 0.05);
    }
  }

  private startAmbient() {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master || this.ambientGain) return;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(master);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 820;
    filter.Q.value = 0.7;
    filter.connect(gain);
    const progression = [
      [174.61, 220, 261.63, 329.63],
      [146.83, 196, 246.94, 293.66],
      [196, 246.94, 293.66, 392],
      [164.81, 220, 261.63, 349.23],
    ];
    const levels = [0.15, 0.11, 0.09, 0.06];
    progression[0].forEach((frequency, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = frequency;
      osc.detune.value = i * 4 - 4;
      const voice = ctx.createGain();
      voice.gain.value = levels[i];
      osc.connect(voice).connect(filter);
      osc.start();
      this.padOscs.push(osc);
    });
    let chordIndex = 0;
    const advance = () => {
      chordIndex = (chordIndex + 1) % progression.length;
      const now = ctx.currentTime;
      progression[chordIndex].forEach((frequency, i) => {
        this.padOscs[i]?.frequency.linearRampToValueAtTime(frequency, now + 3.4);
      });
      window.setTimeout(advance, 8400);
    };
    window.setTimeout(advance, 7800);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 240;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();
    gain.gain.setTargetAtTime(0.085, ctx.currentTime, 1.8);
    this.ambientGain = gain;
  }

  private pluck(frequency: number, volume: number) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = frequency;
    filter.type = 'lowpass';
    filter.frequency.value = 2400;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.7);
    osc.connect(filter).connect(gain).connect(master);
    osc.start(now);
    osc.stop(now + 1.8);
  }

  private startMelody() {
    if (this.bgmTimer !== null) return;
    const chords = [
      [392, 493.88, 587.33, 698.46],
      [349.23, 440, 523.25, 659.25],
      [329.63, 392, 493.88, 587.33],
      [293.66, 349.23, 440, 523.25],
    ];
    const pattern = [0, 2, 1, 3, 2, 1, 3, 0];
    let step = 0;
    const tick = () => {
      if (!this.ctx || this.muted) {
        this.bgmTimer = window.setTimeout(tick, 1600);
        return;
      }
      const chord = chords[Math.floor(step / 8) % chords.length];
      const degree = pattern[step % pattern.length];
      const note = chord[degree] * (step % 16 === 8 ? 2 : 1);
      this.pluck(note, 0.038 + (step % 4 === 0 ? 0.012 : 0));
      if (step % 8 === 0) this.pluck(chord[0] * 0.5, 0.026);
      if (step % 8 === 4) this.pluck(chord[3] * 2, 0.014);
      step += 1;
      this.bgmTimer = window.setTimeout(tick, 440 + (step % 4) * 55);
    };
    tick();
  }

  setFlight(t: number | null) {
    const ctx = this.ensure();
    if (!ctx) return;
    if (!this.unlocked) return;
    const now = ctx.currentTime;
    if (t === null) {
      if (this.engineGain) this.engineGain.gain.setTargetAtTime(0.0001, now, 0.5);
      if (this.ambientGain) this.ambientGain.gain.setTargetAtTime(0.075, now, 0.8);
      return;
    }
    if (!this.engineGain || !this.engineFilter || !this.engineOsc) {
      const gain = ctx.createGain();
      gain.gain.value = 0.0001;
      gain.connect(this.master ?? ctx.destination);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 1.1;
      filter.frequency.value = 320;
      filter.connect(gain);
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 62;
      osc.connect(filter);
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.22;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 14;
      lfo.connect(lfoGain).connect(osc.frequency);
      osc.start();
      lfo.start();
      if (this.noise) {
        const source = ctx.createBufferSource();
        source.buffer = this.noise;
        source.loop = true;
        const wind = ctx.createBiquadFilter();
        wind.type = 'lowpass';
        wind.frequency.value = 420;
        const windGain = ctx.createGain();
        windGain.gain.value = 0.28;
        source.connect(wind).connect(windGain).connect(gain);
        source.start();
      }
      this.engineGain = gain;
      this.engineFilter = filter;
      this.engineOsc = osc;
    }
    const level = 0.035 + 0.085 * Math.sin(Math.PI * Math.min(1, Math.max(0.04, t) * 1.08));
    this.engineGain.gain.setTargetAtTime(level, now, 0.25);
    this.engineFilter.frequency.setTargetAtTime(220 + 760 * t, now, 0.35);
    this.engineOsc.frequency.setTargetAtTime(50 + 66 * t, now, 0.35);
    if (this.ambientGain) this.ambientGain.gain.setTargetAtTime(0.045, now, 0.8);
  }

  play(cue: Cue) {
    const ctx = this.ensure();
    const master = this.master;
    if (!ctx || !master || this.muted || !this.unlocked) return;
    if (ctx.state === 'suspended') void ctx.resume();
    const stamp = performance.now();
    if (this.lastPlayed[cue] && stamp - (this.lastPlayed[cue] ?? 0) < 160) return;
    this.lastPlayed[cue] = stamp;
    const now = ctx.currentTime;
    const tone = (
      frequency: number,
      start: number,
      duration: number,
      type: OscillatorType,
      volume: number,
      glideTo?: number,
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now + start);
      if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, now + start + duration);
      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(volume, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
      osc.connect(gain).connect(master);
      osc.start(now + start);
      osc.stop(now + start + duration + 0.05);
    };
    const noiseBurst = (
      start: number,
      duration: number,
      volume: number,
      filterType: BiquadFilterType,
      from: number,
      to: number,
    ) => {
      if (!this.noise) return;
      const source = ctx.createBufferSource();
      source.buffer = this.noise;
      const filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(from, now + start);
      filter.frequency.exponentialRampToValueAtTime(to, now + start + duration);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(volume, now + start + duration * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
      source.connect(filter).connect(gain).connect(master);
      source.start(now + start);
      source.stop(now + start + duration + 0.05);
    };

    switch (cue) {
      case 'chime':
        tone(523.25, 0, 1.4, 'sine', 0.22);
        tone(659.25, 0.06, 1.5, 'sine', 0.16);
        tone(783.99, 0.12, 1.7, 'sine', 0.12);
        break;
      case 'whoosh':
        noiseBurst(0, 1.1, 0.35, 'bandpass', 220, 2400);
        noiseBurst(0.1, 0.9, 0.2, 'highpass', 900, 3800);
        break;
      case 'takeoff':
        noiseBurst(0, 2.6, 0.5, 'lowpass', 120, 900);
        tone(58, 0, 2.8, 'sawtooth', 0.16, 130);
        tone(87, 0.2, 2.4, 'triangle', 0.12, 190);
        break;
      case 'landing':
        tone(310, 0, 1.1, 'sine', 0.2, 92);
        noiseBurst(0.75, 0.5, 0.4, 'lowpass', 520, 90);
        tone(70, 0.8, 0.7, 'sine', 0.25, 42);
        break;
      case 'pop':
        tone(420, 0, 0.16, 'sine', 0.28, 620);
        noiseBurst(0, 0.14, 0.25, 'highpass', 1400, 2600);
        break;
      case 'bark':
        tone(210, 0, 0.15, 'square', 0.22, 150);
        tone(190, 0.2, 0.16, 'square', 0.18, 140);
        tone(330, 0.02, 0.1, 'triangle', 0.08, 260);
        break;
      case 'open':
        tone(392, 0, 0.8, 'sine', 0.18);
        tone(523.25, 0.14, 0.9, 'sine', 0.2);
        tone(659.25, 0.28, 1.1, 'sine', 0.18);
        tone(1046.5, 0.5, 0.9, 'triangle', 0.12);
        noiseBurst(0.2, 0.6, 0.18, 'highpass', 1800, 5200);
        break;
      case 'celebrate':
        [523.25, 587.33, 659.25, 783.99, 880].forEach((frequency, i) => {
          tone(frequency, i * 0.1, 1.6, 'triangle', 0.16);
          tone(frequency * 2, i * 0.1 + 0.02, 1.2, 'sine', 0.06);
        });
        noiseBurst(0.2, 1.2, 0.22, 'highpass', 2200, 6000);
        break;
      default:
        break;
    }
  }
}

export const storyAudio = new StoryAudio();
