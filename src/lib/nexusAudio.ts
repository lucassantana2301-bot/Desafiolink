'use client';

/**
 * NEXUS Procedural Web Audio Engine
 * Lightweight, zero-asset synthesized soundscape tailored for sci-fi atmosphere:
 * - Sub-bass ambient drone
 * - Biometric telemetry blips & clicks
 * - Laser scanner resonance
 * - Neural synaptic pulses
 * - Climax sub-drop impact
 */

class NexusAudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  private isMuted = true;

  // Persistent Drone Nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;

  private lastSceneTrigger = -1;

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.isInitialized = true;
    } catch {
      // AudioContext unavailable
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.isInitialized) {
      this.init();
    }

    if (this.ctx && this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume();
    }

    if (!muted) {
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
  }

  public toggle(): boolean {
    const nextState = !this.isMuted;
    this.setMuted(nextState);
    return !nextState; // Returns isActive
  }

  private startAmbientDrone() {
    if (!this.ctx || this.droneOsc1) return;

    try {
      const now = this.ctx.currentTime;

      // Low pass filter for dark sci-fi ambience
      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(140, now);
      this.droneFilter.Q.setValueAtTime(3.5, now);

      // Master drone gain
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.18, now + 3);

      // Sub-bass root drone (55Hz / A1)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, now);

      // Detuned fifth harmonic (82.4Hz)
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(82.4, now);

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);
    } catch {
      // Ignore audio start failures
    }
  }

  private stopAmbientDrone() {
    if (!this.ctx || !this.droneGain) return;

    try {
      const now = this.ctx.currentTime;
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      setTimeout(() => {
        if (this.droneOsc1) {
          try {
            this.droneOsc1.stop();
            this.droneOsc1.disconnect();
          } catch {}
          this.droneOsc1 = null;
        }
        if (this.droneOsc2) {
          try {
            this.droneOsc2.stop();
            this.droneOsc2.disconnect();
          } catch {}
          this.droneOsc2 = null;
        }
      }, 900);
    } catch {
      // Ignore cleanup error
    }
  }

  /**
   * Procedural Telemetry Click / UI interaction beep
   */
  public playTelemetryClick() {
    if (this.isMuted || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  /**
   * Laser Scanner Harmonic Sweep (Scene 02)
   */
  public playScannerSweep() {
    if (this.isMuted || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.linearRampToValueAtTime(840, now + 0.25);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  /**
   * Neural Pulse Sound (Scene 04/05)
   */
  public playNeuralPulse() {
    if (this.isMuted || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch {}
  }

  /**
   * Cinematic Sub-Impact (Scene 06 Climax)
   */
  public playClimaxImpact() {
    if (this.isMuted || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    } catch {}
  }

  /**
   * Dynamic Modulation based on Scroll Progress
   */
  public updateScrollAudio(scrollProgress: number) {
    if (this.isMuted || !this.ctx) return;

    // Filter modulation based on depth
    if (this.droneFilter) {
      const targetFreq = 120 + scrollProgress * 300;
      this.droneFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
    }

    // Trigger keyframe scene audio cues
    const sceneIndex = Math.floor(scrollProgress * 6);
    if (sceneIndex !== this.lastSceneTrigger) {
      this.lastSceneTrigger = sceneIndex;

      if (sceneIndex === 1) this.playScannerSweep();
      else if (sceneIndex === 3 || sceneIndex === 4) this.playNeuralPulse();
      else if (sceneIndex === 5) this.playClimaxImpact();
      else this.playTelemetryClick();
    }
  }
}

export const nexusAudio = new NexusAudioEngine();
