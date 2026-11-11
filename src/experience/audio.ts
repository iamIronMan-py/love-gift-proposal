import bgmUrl from '../assets/married-life.mp3';
import barkUrl from '../assets/puppy-bark.mp3';
import takeoffUrl from '../assets/takeoff-sfx.mp3';
import landingUrl from '../assets/landing-sfx.mp3';

class StoryAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bgm: HTMLAudioElement | null = null;
  private bgmFade = 0;
  private barkBase: HTMLAudioElement | null = null;
  private takeoffAudio: HTMLAudioElement | null = null;
  private landingAudio: HTMLAudioElement | null = null;
  muted = false;
  private unlocked = false;

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
    return ctx;
  }

  unlock() {
    const ctx = this.ensure();
    if (!ctx) return;
    this.unlocked = true;
    if (ctx.state === 'suspended') void ctx.resume();
    this.startBgm();
  }

  setMuted(value: boolean) {
    this.muted = value;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(value ? 0 : 0.5, this.ctx.currentTime, 0.05);
    }
    if (this.bgmFade) {
      window.cancelAnimationFrame(this.bgmFade);
      this.bgmFade = 0;
    }
    if (this.bgm) {
      this.bgm.muted = value;
      this.bgm.volume = value ? 0 : 0.34;
      if (!value) void this.bgm.play().catch(() => undefined);
    }
  }

  private startBgm() {
    if (!this.bgm) {
      const audio = new Audio(bgmUrl);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0;
      audio.muted = this.muted;
      this.bgm = audio;
      void audio.play().then(() => {
        const started = performance.now();
        const fade = () => {
          if (!this.bgm) return;
          const progress = Math.min(1, (performance.now() - started) / 2200);
          this.bgm.volume = (this.muted ? 0 : 0.34) * progress;
          if (progress < 1) {
            this.bgmFade = window.requestAnimationFrame(fade);
          } else {
            this.bgmFade = 0;
          }
        };
        this.bgmFade = window.requestAnimationFrame(fade);
      }).catch(() => undefined);
      return;
    }
    if (this.bgm.paused) {
      void this.bgm.play().catch(() => undefined);
    }
  }

  setFlight(_t: number | null) {
    // continuous airplane/engine sound intentionally disabled
  }

  stopTakeoff() {
    if (this.takeoffAudio) {
      this.takeoffAudio.pause();
      this.takeoffAudio.currentTime = 0;
    }
  }

  stopLanding() {
    if (this.landingAudio) {
      this.landingAudio.pause();
      this.landingAudio.currentTime = 0;
    }
  }

  play(cue: string) {
    if (this.muted || !this.unlocked) return;
    if (this.ctx?.state === 'suspended') void this.ctx.resume();
    if (cue === 'bark') {
      const audio = this.barkBase ? (this.barkBase.cloneNode(true) as HTMLAudioElement) : new Audio(barkUrl);
      if (!this.barkBase) this.barkBase = audio;
      audio.currentTime = 0;
      audio.volume = 0.85;
      void audio.play().catch(() => undefined);
      return;
    }
    if (cue === 'takeoff') {
      if (!this.takeoffAudio) this.takeoffAudio = new Audio(takeoffUrl);
      this.takeoffAudio.currentTime = 0;
      this.takeoffAudio.volume = 0.7;
      void this.takeoffAudio.play().catch(() => undefined);
      return;
    }
    if (cue === 'landing') {
      if (!this.landingAudio) this.landingAudio = new Audio(landingUrl);
      this.landingAudio.currentTime = 0;
      this.landingAudio.volume = 0.75;
      void this.landingAudio.play().catch(() => undefined);
      return;
    }
  }
}

export const storyAudio = new StoryAudio();
