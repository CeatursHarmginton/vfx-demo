// Zero-Dependency Web Audio API Anime & 8-Bit Sound Synthesizer
// Includes Grand Full-Screen Treasure Chest Charge & Mega-Detonation Choreography!
(() => {
  'use strict';
  let ctx = null;
  let muted = false;

  function ensure() {
    if (muted) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  function tone(freq0, freq1, dur, type = 'square', vol = 0.09, delay = 0) {
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq0, t0);
    if (freq1 && freq1 !== freq0) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq1), t0 + dur);
    }
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.01);
  }

  function noiseBurst(dur = 0.18, vol = 0.11, highpass = 600, delay = 0) {
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.3);
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    const flt = c.createBiquadFilter();
    flt.type = 'highpass';
    flt.frequency.value = highpass;
    const gain = c.createGain();
    gain.gain.setValueAtTime(vol, t0);
    src.connect(flt);
    flt.connect(gain);
    gain.connect(c.destination);
    src.start(t0);
  }

  window.MultiverseSFX = {
    get muted() { return muted; },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    coin() {
      tone(987.77, 987.77, 0.07, 'square', 0.08, 0);
      tone(1318.5, 1318.5, 0.24, 'square', 0.08, 0.07);
    },
    slash() {
      noiseBurst(0.16, 0.12, 1600);
      tone(740, 180, 0.18, 'sawtooth', 0.08, 0);
      tone(1480, 920, 0.12, 'triangle', 0.05, 0.03);
    },
    thunder() {
      noiseBurst(0.35, 0.16, 320);
      tone(880, 110, 0.32, 'sawtooth', 0.11, 0);
      tone(1320, 220, 0.22, 'square', 0.07, 0.05);
    },
    stretch() {
      tone(190, 620, 0.16, 'sine', 0.09, 0);
    },
    punch() {
      noiseBurst(0.14, 0.14, 150);
      tone(180, 48, 0.20, 'triangle', 0.15, 0);
    },
    gadget() {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, f * 1.04, 0.09, 'triangle', 0.08, i * 0.055));
    },
    bubble() {
      tone(360, 880, 0.11, 'sine', 0.08, 0);
    },
    pop() {
      tone(720, 180, 0.07, 'triangle', 0.10, 0);
      noiseBurst(0.06, 0.07, 1200);
    },
    fanfare() {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
        tone(f, f, i === 4 ? 0.36 : 0.11, 'square', 0.08, i * 0.09);
      });
    },
    // Rising anime energy compression + Full-Screen Treasure Chest Detonation!
    megaExplosion() {
      // 0.00s - 0.52s: Rising abyssal laser turbine charge
      tone(110, 1180, 0.52, 'sawtooth', 0.12, 0);
      tone(180, 1680, 0.52, 'triangle', 0.10, 0.02);
      // 0.52s: Sharp Impact-Frame Lightning Crack!
      noiseBurst(0.16, 0.20, 900, 0.52);
      tone(1400, 90, 0.16, 'square', 0.14, 0.52);
      // 0.69s: COLOSSAL FULL-SCREEN SUPERNOVA ROAR & SUB-BASS EARTHQUAKE!
      noiseBurst(1.35, 0.26, 75, 0.69);
      tone(175, 24, 0.95, 'sawtooth', 0.22, 0.69);
      tone(88, 20, 1.15, 'sine', 0.26, 0.69);
      // 0.90s - 2.10s: Cascading giant treasure gems & secondary blasts!
      for (let i = 0; i < 8; i++) {
        noiseBurst(0.24, 0.11, 380, 0.88 + i * 0.15);
        tone(880 + i * 130, 1420 + i * 170, 0.15, 'square', 0.07, 0.92 + i * 0.13);
      }
      // Triumphant Grand Victory Chord
      [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98].forEach((f, idx) => {
        tone(f, f, 0.65, 'triangle', 0.08, 1.25 + idx * 0.07);
      });
    },
    // 1. Void Black-Hole Singularity Bass-Drop & Dimension Shatter!
    voidBlast() {
      tone(420, 38, 0.54, 'sine', 0.22, 0);
      tone(840, 62, 0.54, 'sawtooth', 0.11, 0.03);
      // Dimension glass shatter crack at 0.55s
      noiseBurst(0.22, 0.22, 2200, 0.55);
      tone(1950, 220, 0.18, 'square', 0.14, 0.55);
      // Colossal anime bass drop (Za Warudo / Singularity style!) at 0.72s
      tone(135, 22, 1.35, 'sawtooth', 0.26, 0.72);
      tone(72, 18, 1.45, 'sine', 0.28, 0.72);
      noiseBurst(1.15, 0.22, 95, 0.72);
    },
    // 2. Crimson Hellfire Thermonuclear Strike!
    crimsonNuke() {
      // Tactical warning siren + orbital laser beam
      tone(660, 990, 0.22, 'sawtooth', 0.10, 0);
      tone(660, 1280, 0.26, 'sawtooth', 0.12, 0.25);
      // Colossal thermonuclear roar at 0.58s
      noiseBurst(1.55, 0.28, 60, 0.58);
      tone(190, 26, 1.20, 'sawtooth', 0.24, 0.58);
      tone(95, 22, 1.35, 'triangle', 0.26, 0.58);
      for (let i = 0; i < 6; i++) {
        noiseBurst(0.28, 0.12, 240, 0.85 + i * 0.18);
      }
    },
    // 3. Cyber EMP 1-Billion-Volt Thunder Cage!
    cyberEmp() {
      [440, 880, 1320, 1760, 2400].forEach((f, i) => tone(f, f * 1.15, 0.09, 'square', 0.09, i * 0.09));
      noiseBurst(1.20, 0.25, 420, 0.52);
      tone(1680, 42, 0.85, 'sawtooth', 0.22, 0.52);
      for (let i = 0; i < 9; i++) {
        tone(1850 - i * 110, 280, 0.11, 'square', 0.10, 0.60 + i * 0.11);
      }
    },
    // 4. Toxic Neon Chaos Carnival Bomb!
    chaosCarnival() {
      [587, 784, 987, 1174, 1568].forEach((f, i) => tone(f, f * 0.85, 0.09, 'sawtooth', 0.10, i * 0.095));
      noiseBurst(1.25, 0.25, 140, 0.54);
      tone(220, 32, 0.90, 'sawtooth', 0.22, 0.54);
      for (let i = 0; i < 8; i++) {
        tone(520 + (i % 4) * 330, 1480, 0.13, 'square', 0.09, 0.68 + i * 0.12);
        noiseBurst(0.18, 0.11, 520, 0.68 + i * 0.12);
      }
    },
  };
})();
