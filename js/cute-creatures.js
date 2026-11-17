// Studio-Grade Cute Round Mascots Pack:
//   1. <sakuga-pikachu>    — Ultra-detailed Chibi Pikachu with independent ear springs & 100,000V arcs
//   2. <sakuga-pokeball>   — 3-Tone Cel Pokéball with 3-shake capture wobble & lid-pop summon burst
//   3. <sakuga-kirby>      — Plump Pink Mochi Kirby with Vortex Inhale & Star/Text Cannon Spit
//   4. <sakuga-king-slime> — Translucent-Cel Jelly King Slime with Bouncing Crown & Elemental VFX Hits
//   5. <sakuga-soot>       — Ghibli Soot Sprite (Susuwatari) with Live Cursor-Tracking Eyes & Konpeito Candy
(() => {
  'use strict';
  const fx = window.SakugaFX;
  const {
    TAU, clamp, lerp, rnd, later, at, Spring,
    celShape, roundRectPath, ellipsePath, fiveStarPath,
    lightningArc, drawMiniBolt, buildJaggedFissure,
    burst, puff, shards, ring, splash, slash, lines, ticks, donut, wob, kira, sfx, hollow, dotted, CuteMascotBase,
  } = fx;

  // Global mouse tracker for Soot Sprite's adorable cursor-following eyes
  let mouseX = innerWidth * 0.5, mouseY = innerHeight * 0.5;
  window.addEventListener('pointermove', (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

  // =========================================================================
  // 1. <sakuga-pikachu> — Masterpiece Chibi Pikachu
  // =========================================================================
  class SakugaPikachu extends CuteMascotBase {
    initSprings() {
      this.hop = new Spring(0, 440, 13);
      this.earL = new Spring(0, 360, 10);
      this.earR = new Spring(0, 400, 11);
      this.thunder = new Spring(0, 520, 12);
      this.happy = new Spring(0, 440, 14);
      this.voltage = 0.45;
      return [this.hop, this.earL, this.earR, this.thunder, this.happy];
    }

    setVoltage(norm) {
      this.voltage = clamp(norm, 0, 1);
      this.earL.v += (Math.random() - 0.5) * 5;
      this.earR.v += (Math.random() - 0.5) * 5;
      this.dirty = true;
    }

    frame(dt) {
      if ((this.voltage > 0.32 || this.thunder.x > 0.05) && this.inView && !fx.calm) {
        const tick = Math.floor(fx.now * 16);
        if (tick !== this._boltTick) {
          this._boltTick = tick;
          this.dirty = true;
        }
      }
      super.frame(dt);
    }

    summonJump() {
      const n = ++this.seq, c = at(this.stageEl);
      this.cutUntil = fx.now + 1.2;
      this.hop.x = -0.6; this.hop.to = 1.15; this.hop.v = 11;
      this.happy.to = 1; this.earL.v = 10; this.earR.v = -10;
      this.dirty = true;
      burst(c.x, c.y, { r: 52, layer: this.back });
      kira(c.x - 42, c.y - 36, { r: 11, col: '#FFE44D' });
      kira(c.x + 42, c.y - 30, { r: 10, col: '#FF5FA8' });
      sfx('PIKA-PI!! ⚡', c.x + 28, c.y - 68, { size: 58, col: '#FFE44D', edge: '#1D1A4A' });
      window.MultiverseSFX?.gadget();
      later(700, () => {
        if (n === this.seq) { this.hop.to = 0; this.happy.to = 0; this.dirty = true; }
      });
    }

    unleashThunderbolt(targetEl) {
      const n = ++this.seq, c = at(this.stageEl);
      this.cutUntil = fx.now + 1.35;
      this.hop.to = 1.25; this.hop.v = 10;
      this.thunder.to = 1;
      this.earL.v = 12; this.earR.v = 12;
      this.dirty = true;

      burst(c.x, c.y - 8, { r: 62, layer: this.back });
      ring(c.x, c.y + 24, { rx: 46, ry: 13, w: 5 });
      shards(c.x, c.y - 10, { n: 8, speed: 220, size: 6 });
      sfx('100.000 VOLT!! ⚡', c.x + 16, c.y - 74, { size: 62, col: '#FFE44D', edge: '#1D1A4A' });
      window.MultiverseSFX?.thunder();

      if (targetEl) {
        const tc = at(targetEl);
        // Multi-layered calligraphic Sakuga 100,000V thunderbolt barrage!
        lightningArc(c.x, c.y - 10, tc.x, tc.y, {
          col: '#FFE44D', core: '#FFFFFF', ink: '#1D1A4A', width: 12.5, sway: 0.25, branches: 6, life: 0.48,
        });
        later(48, () => lightningArc(c.x + 8, c.y - 22, tc.x - 6, tc.y - 8, {
          col: '#38BDF8', core: '#FFFFFF', ink: '#1D1A4A', width: 8.8, sway: 0.31, branches: 5, life: 0.42,
        }));
        later(95, () => lightningArc(c.x - 12, c.y - 34, tc.x + 10, tc.y + 8, {
          col: '#FFE44D', core: '#FFFFFF', ink: '#1D1A4A', width: 7.4, sway: 0.35, branches: 4, life: 0.36,
        }));
        // Ground discharge arcs whipping outward under Pikachu!
        lightningArc(c.x - 14, c.y + 18, c.x - 86, c.y + 28, {
          col: '#FFE44D', width: 6.2, sway: 0.30, branches: 3, life: 0.32, impact: false,
        });
        lightningArc(c.x + 14, c.y + 18, c.x + 86, c.y + 26, {
          col: '#38BDF8', width: 5.8, sway: 0.30, branches: 3, life: 0.32, impact: false,
        });
      } else {
        lightningArc(c.x - 95, c.y - 105, c.x + 105, c.y - 18, {
          col: '#FFE44D', width: 11.5, sway: 0.28, branches: 6, life: 0.46,
        });
        later(55, () => lightningArc(c.x + 85, c.y - 110, c.x - 90, c.y - 12, {
          col: '#38BDF8', width: 8.2, sway: 0.32, branches: 4, life: 0.40,
        }));
      }

      later(650, () => {
        if (n === this.seq) { this.hop.to = 0; this.thunder.to = 0; this.dirty = true; }
      });
    }

    playCut(kind = 'loop') {
      if (fx.calm) return;
      if (kind === 'click') {
        this.emit('pikachu-bolt', {});
        return;
      }
      const n = ++this.seq, c = at(this.stageEl);
      this.cutUntil = fx.now + 1.1;
      this.hop.v = 5.5; this.earL.v = 8.5; this.earR.v = -6.5;
      this.happy.to = 1; this.dirty = true;
      kira(c.x - 36, c.y - 28, { r: 9, col: '#FFE44D' });
      later(520, () => { if (n === this.seq) { this.happy.to = 0; this.dirty = true; } });
    }

    drawMascot(ctx, sz, cw, ch) {
      const unit = sz / 48;
      ctx.save();
      ctx.translate(cw * 0.5, ch * 0.55);
      ctx.scale(unit, unit);
      ctx.lineJoin = ctx.lineCap = 'round';
      const ink = '#2A1810';
      const hp = this.hop.x;
      const th = clamp(this.thunder.x, 0, 1);
      const joy = clamp(this.happy.x, 0, 1);

      // Ground contact shadow
      const shSc = clamp(1 - Math.max(0, hp) * 0.24, 0.5, 1.1);
      ctx.fillStyle = 'rgba(29, 26, 74, 0.16)';
      ctx.beginPath(); ctx.ellipse(0, 20.2, 13.4 * shSc, 2.7 * shSc, 0, 0, TAU); ctx.fill();

      const liftY = -Math.max(0, hp) * 7.8 + Math.max(0, -hp) * 2.4 - this.hoverLift.x * 1.4;
      ctx.translate(0, liftY);
      const sy = hp < 0 ? 1 + hp * 0.16 : 1 + Math.max(0, hp) * 0.08;
      ctx.scale(1 / Math.sqrt(Math.max(0.72, sy)), sy);

      // Floating Golden Thunder-Crest Ring behind Pikachu (Silhouette Contour Breaker!)
      ctx.save();
      ctx.translate(0, 1.5);
      ctx.rotate(fx.now * 0.9);
      const crestR = 17.5 + this.voltage * 2.2;
      ctx.strokeStyle = th > 0.2 ? '#38BDF8' : '#FACC15';
      ctx.lineWidth = 1.35;
      for (let q = 0; q < 4; q++) {
        const a = (q / 4) * TAU + 0.2;
        ctx.beginPath(); ctx.arc(0, 0, crestR, a, a + 0.62); ctx.stroke();
      }
      ctx.restore();

      // Crackling Sakuga Electric Aura Arcs orbiting Pikachu when voltage high or thundering!
      if (this.voltage > 0.60 || th > 0.2) {
        const auraCount = th > 0.2 ? 5 : 3;
        for (let i = 0; i < auraCount; i++) {
          const a0 = fx.now * 3.8 + (i * TAU) / auraCount;
          const a1 = a0 + 0.72;
          drawMiniBolt(
            ctx,
            Math.cos(a0) * 14.5, -1.5 + Math.sin(a0) * 13.8,
            Math.cos(a1) * 20.4, -2.5 + Math.sin(a1) * 18.6,
            {
              width: th > 0.2 ? 1.55 : 1.25,
              col: (i % 2 === 0 && th > 0.2) ? '#38BDF8' : '#FFE44D',
              core: '#FFFFFF',
              ink,
              seed: 11 + i * 19,
              fork: true,
              sway: 0.36,
            }
          );
        }
      }

      // Iconic 5-Step Zig-Zag Lightning-Bolt Tail (with crisp cocoa-brown zigzag root + tail star glint!)
      ctx.save();
      ctx.translate(8.4, 10.6);
      ctx.rotate(Math.sin(fx.now * 5.5) * 0.09 + th * 0.28);
      const tail = new Path2D();
      tail.moveTo(-1.2, 1.2);
      tail.lineTo(4.4, -4.0); tail.lineTo(1.8, -5.0);
      tail.lineTo(8.6, -11.6); tail.lineTo(5.0, -12.8);
      tail.lineTo(14.2, -20.6);
      tail.lineTo(4.6, -19.6); tail.lineTo(1.0, -11.6);
      tail.lineTo(3.6, -10.4); tail.lineTo(-2.0, -3.6);
      tail.closePath();
      celShape(ctx, tail, 1.55, -1.5, -1.7, '#FFE135', '#F59E0B', '#B45309', ink);
      ctx.save();
      ctx.clip(tail);
      ctx.fillStyle = '#FFFDF0';
      ctx.beginPath(); ctx.ellipse(7.5, -18.5, 3.2, 1.1, -0.2, 0, TAU); ctx.fill();
      ctx.fillStyle = '#78350F';
      ctx.beginPath();
      ctx.moveTo(-4, 3); ctx.lineTo(5.5, -3.8); ctx.lineTo(2.0, -5.5); ctx.lineTo(-4, -2);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = ink; ctx.lineWidth = 1.35; ctx.stroke(tail);
      // Sparkling electric star perched at tail tip!
      ctx.save();
      ctx.translate(13.2, -19.8);
      ctx.rotate(fx.now * 4);
      const tsR = 2.6 + this.voltage * 1.4;
      celShape(ctx, fiveStarPath(tsR, tsR * 0.42), 1.0, -0.4, -0.4, '#FFE44D', '#F59E0B', '#B45309', ink);
      ctx.restore();
      ctx.restore();

      // Detailed Hind Feet with Toe Separation Notches & Rosy Paw Pads!
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(side * 6.0, 17.8);
        ctx.rotate(side * 0.22);
        celShape(ctx, ellipsePath(0, 0, 4.4, 2.3), 1.45, -0.8, -0.8, '#FFE135', '#F59E0B', '#B45309', ink);
        // Rosy sole pad hint + 2 crisp toe lines
        ctx.fillStyle = '#FB7185';
        ctx.beginPath(); ctx.ellipse(side * 0.8, 0.5, 1.2, 0.7, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = ink; ctx.lineWidth = 1.05;
        ctx.beginPath();
        ctx.moveTo(side * 2.4, -0.9); ctx.lineTo(side * 3.8, -0.4);
        ctx.moveTo(side * 2.5, 0.4); ctx.lineTo(side * 3.9, 0.8);
        ctx.stroke();
        ctx.restore();
      }

      // Sculpted Chubby Pikachu Torso + Cocoa-Brown Back Stripes + Chest Fur Tuft!
      const body = new Path2D();
      body.moveTo(-8.4, 2.2);
      body.bezierCurveTo(-11.8, 8.8, -11.2, 18.0, 0, 18.2);
      body.bezierCurveTo(11.2, 18.0, 11.8, 8.8, 8.4, 2.2);
      body.closePath();
      celShape(ctx, body, 1.7, -2.6, -2.6, '#FFE135', '#F59E0B', '#B45309', ink);
      // Warm cocoa-brown back stripes peeking on right flank!
      ctx.save();
      ctx.clip(body);
      ctx.fillStyle = '#FFFDF0';
      ctx.beginPath(); ctx.ellipse(-6.8, 9.5, 1.8, 4.5, 0.22, 0, TAU); ctx.fill();
      ctx.fillStyle = '#78350F';
      ctx.beginPath(); ctx.ellipse(9.6, 8.2, 3.6, 1.45, -0.25, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(9.8, 12.2, 3.4, 1.35, -0.20, 0, TAU); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.stroke(body);

      // Cute Fluffy Neck/Chest Fur Tuft right under the chin!
      const tuft = new Path2D();
      tuft.moveTo(-3.4, 5.2);
      tuft.lineTo(-1.8, 8.0); tuft.lineTo(0, 6.4);
      tuft.lineTo(1.8, 8.0); tuft.lineTo(3.4, 5.2);
      ctx.fillStyle = '#FFF9C4'; ctx.fill(tuft);
      ctx.strokeStyle = ink; ctx.lineWidth = 1.15; ctx.stroke(tuft);

      // Expressive Chubby Fore-Paws with 3 Tiny Digit Notches!
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(side * 5.8, 8.0 - (th + joy) * 2.0);
        ctx.rotate(side * (-0.38 + (th + joy) * 0.58));
        const arm = new Path2D();
        arm.ellipse(0, 0, 2.65, 4.0, 0, 0, TAU);
        celShape(ctx, arm, 1.4, -0.7, -0.9, '#FFE135', '#F59E0B', '#B45309', ink);
        ctx.strokeStyle = ink; ctx.lineWidth = 0.95;
        ctx.beginPath();
        ctx.moveTo(-0.9, -3.6); ctx.lineTo(-0.7, -2.4);
        ctx.moveTo(0.9, -3.6); ctx.lineTo(0.7, -2.4);
        ctx.stroke();
        ctx.restore();
      }

      // Long Curved Ears with Asymmetrical Springs, Inner Crease & Curved Black Tips!
      for (const [side, ang0, sp] of [[-1, -0.46, this.earL.x], [1, 0.56, this.earR.x]]) {
        ctx.save();
        ctx.translate(side * 7.4, -10.4);
        ctx.rotate(ang0 + sp * 0.20);
        const ear = new Path2D();
        ear.moveTo(-3.2, 0.8);
        ear.bezierCurveTo(-3.9, -7.2, -2.2, -13.4, 0, -16.8);
        ear.bezierCurveTo(2.2, -13.4, 3.9, -7.2, 3.2, 0.8);
        ear.closePath();
        celShape(ctx, ear, 1.6, -1.0, -1.2, '#FFE135', '#F59E0B', '#B45309', ink);
        ctx.save();
        ctx.clip(ear);
        // Curved diagonal obsidian tip + glossy white tip shine!
        ctx.fillStyle = '#1E1612';
        ctx.beginPath();
        ctx.moveTo(-5, -17.5); ctx.lineTo(5, -17.5);
        ctx.lineTo(5, -9.2);
        ctx.quadraticCurveTo(0, -11.2, -5, -10.2);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.beginPath(); ctx.ellipse(-0.8, -13.4, 0.7, 1.8, 0.15, 0, TAU); ctx.fill();
        ctx.restore();
        ctx.strokeStyle = ink; ctx.lineWidth = 1.45; ctx.stroke(ear);
        ctx.restore();
      }

      // Authentic Sculpted Peanut-Cheek Pikachu Head (Rich Vibrant Pikachu Yellow + Crisp Specular!)
      const head = new Path2D();
      head.moveTo(0, -12.8);
      head.bezierCurveTo(8.8, -12.8, 10.6, -7.4, 11.2, -3.6);
      head.bezierCurveTo(13.4, -0.4, 13.0, 4.6, 7.6, 5.8);
      head.bezierCurveTo(4.2, 6.5, -4.2, 6.5, -7.6, 5.8);
      head.bezierCurveTo(-13.0, 4.6, -13.4, -0.4, -11.2, -3.6);
      head.bezierCurveTo(-10.6, -7.4, -8.8, -12.8, 0, -12.8);
      head.closePath();
      celShape(ctx, head, 1.75, -2.6, -2.8, '#FFE135', '#F59E0B', '#B45309', ink);
      // Cute cream-white forehead crown shine
      ctx.fillStyle = '#FFFDF2';
      ctx.beginPath(); ctx.ellipse(-4.0, -9.8, 2.8, 1.05, -0.28, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(-7.4, -7.6, 0.85, 0, TAU); ctx.fill();

      // Bright 3-Tone Rosy-Red Electric Cheek Pouches + Specular Bean + Live Calligraphic Sparks!
      for (const side of [-1, 1]) {
        const cx = side * 8.4, cy = 0.2;
        celShape(ctx, ellipsePath(cx, cy, 3.05, 2.65, side * -0.12), 1.25, -0.8, -0.8, '#FF3B5C', '#E11D48', '#881337', ink);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.ellipse(cx - side * 0.8, cy - 0.9, 0.85, 0.45, -0.3, 0, TAU); ctx.fill();
        if (this.voltage > 0.34 || th > 0.2) {
          const tick = Math.floor(fx.now * 16);
          const showMain = th > 0.2 || this.voltage > 0.72 || ((tick + (side > 0 ? 1 : 0)) % 3 !== 0);
          if (showMain) {
            const reach = 6.5 + this.voltage * 5.0 + th * 4.2;
            const colMain = (this.voltage > 0.78 || th > 0.2) ? '#38BDF8' : '#FFE44D';
            drawMiniBolt(ctx, cx, cy, cx + side * reach, cy - 2.4 + Math.sin(tick + side) * 2.2, {
              width: 1.2 + this.voltage * 0.45,
              col: colMain,
              core: '#FFFFFF',
              ink,
              seed: side > 0 ? 101 : 203,
              fork: true,
              sway: 0.34,
            });
          }
          if (this.voltage > 0.68 || th > 0.2) {
            drawMiniBolt(ctx, cx, cy + 0.6, cx + side * 8.2, cy + 4.6, {
              width: 0.95,
              col: '#FFE44D',
              core: '#FFFFFF',
              ink,
              seed: side > 0 ? 307 : 409,
              fork: false,
              sway: 0.32,
            });
          }
        }
      }

      // 4-Layer Glossy Anime Eyes + Expressive Brows!
      for (const side of [-1, 1]) {
        const ex = side * 4.7, ey = -4.2;
        // Subtle expressive eyebrow arch
        ctx.strokeStyle = ink; ctx.lineWidth = 1.2;
        ctx.beginPath();
        if (th > 0.25) {
          ctx.moveTo(ex - side * 2.6, ey - 3.9);
          ctx.lineTo(ex + side * 1.8, ey - 2.8);
        } else {
          ctx.arc(ex, ey - 1.4, 3.4, Math.PI * 1.22, Math.PI * 1.78);
        }
        ctx.stroke();

        if (th > 0.35) {
          ctx.strokeStyle = ink; ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(ex - side * 2.3, ey - 1.6);
          ctx.lineTo(ex + side * 1.9, ey + 0.2);
          ctx.lineTo(ex - side * 2.3, ey + 1.7);
          ctx.stroke();
        } else if (joy > 0.45) {
          ctx.strokeStyle = ink; ctx.lineWidth = 2.1;
          ctx.beginPath(); ctx.arc(ex, ey + 0.8, 2.5, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
        } else {
          const eyeP = ellipsePath(ex, ey, 2.65, 2.85);
          ctx.save();
          ctx.fillStyle = ink; ctx.fill(eyeP);
          ctx.clip(eyeP);
          // Rich amber-gold lower iris glow
          ctx.fillStyle = '#B45309';
          ctx.beginPath(); ctx.ellipse(ex, ey + 1.5, 2.3, 1.8, 0, 0, TAU); ctx.fill();
          ctx.fillStyle = '#FBBF24';
          ctx.beginPath(); ctx.ellipse(ex, ey + 2.1, 1.6, 1.1, 0, 0, TAU); ctx.fill();
          // Dark pupil center
          ctx.fillStyle = ink;
          ctx.beginPath(); ctx.arc(ex, ey - 0.1, 1.25, 0, TAU); ctx.fill();
          ctx.restore();
          ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.stroke(eyeP);
          // Bold upper lash curve
          ctx.lineWidth = 1.75;
          ctx.beginPath(); ctx.arc(ex, ey, 2.75, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
          // Dual anime specular catchlights!
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.ellipse(ex - 0.85, ey - 0.95, 1.05, 1.25, -0.2, 0, TAU);
          ctx.arc(ex + 0.95, ey + 0.95, 0.52, 0, TAU);
          ctx.fill();
        }
      }

      // Cute Tiny Nose + Detailed 'ω' Cat-Mouth & 3-Tone Rosy Tongue!
      ctx.fillStyle = ink;
      ctx.beginPath(); ctx.moveTo(-0.95, -2.2); ctx.lineTo(0.95, -2.2); ctx.lineTo(0, -1.2); ctx.closePath(); ctx.fill();

      if (th > 0.28 || joy > 0.35 || this.voltage > 0.72) {
        const m = new Path2D();
        m.moveTo(-3.0, -0.3);
        m.quadraticCurveTo(-1.4, 0.6, 0, -0.3);
        m.quadraticCurveTo(1.4, 0.6, 3.0, -0.3);
        m.quadraticCurveTo(2.5, 3.8, 0, 3.8);
        m.quadraticCurveTo(-2.5, 3.8, -3.0, -0.3);
        m.closePath();
        celShape(ctx, m, 1.25, 0, 1.2, '#FDA4AF', '#E11D48', '#881337', ink);
      } else {
        // Adorable peeking pink tongue under 'ω' upper lip!
        const tg = new Path2D();
        tg.arc(0, 0.3, 1.65, 0.08 * Math.PI, 0.92 * Math.PI);
        tg.closePath();
        celShape(ctx, tg, 1.05, 0, 0.4, '#FECDD3', '#FB7185', '#BE123C', ink);
        ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-3.1, -0.2); ctx.quadraticCurveTo(-1.5, 1.1, 0, -0.2);
        ctx.quadraticCurveTo(1.5, 1.1, 3.1, -0.2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // 2. <sakuga-pokeball> — Collector-Grade Winged Master/Luxury Summon Orb!
  // =========================================================================
  class SakugaPokeball extends CuteMascotBase {
    initSprings() {
      this.tilt = new Spring(0, 420, 11);
      this.lidOpen = new Spring(0, 440, 13);
      this.hop = new Spring(0, 460, 14);
      this.btnGlow = new Spring(0, 380, 16);
      return [this.tilt, this.lidOpen, this.hop, this.btnGlow];
    }

    playCut(kind = 'loop') {
      if (fx.calm) return;
      const n = ++this.seq, c = at(this.stageEl);

      if (kind === 'click') {
        this.cutUntil = fx.now + 1.55;
        this.btnGlow.to = 1;
        this.tilt.v = -14; this.dirty = true;
        wob(c.x - 32, c.y, { dir: -1, r: 12 });
        window.MultiverseSFX?.bubble();

        later(220, () => {
          if (n !== this.seq) return;
          this.tilt.v = 15; this.dirty = true;
          wob(c.x + 32, c.y, { dir: 1, r: 12 });
          window.MultiverseSFX?.bubble();
        });

        later(460, () => {
          if (n !== this.seq) return;
          this.hop.to = 1; this.hop.v = 9.5;
          this.lidOpen.to = 1; this.lidOpen.v = 8.0;
          this.dirty = true;
          burst(c.x, c.y - 10, { r: 62, layer: this.back });
          donut(c.x, c.y - 18, { r: 24, vx: 0, vy: -55 });
          shards(c.x, c.y - 12, { n: 9, speed: 210, size: 6.0 });
          sfx('RA NÀO!! ⚡', c.x, c.y - 68, { size: 58, col: '#FF5FA8', edge: '#1D1A4A' });
          this.emit('pokeball-open', {});
        });

        later(1100, () => {
          if (n !== this.seq) return;
          this.hop.to = 0; this.lidOpen.to = 0; this.btnGlow.to = 0; this.dirty = true;
        });
        return;
      }

      this.cutUntil = fx.now + 1.0;
      this.tilt.v = 9.5; this.btnGlow.to = 1; this.dirty = true;
      later(420, () => { if (n === this.seq) { this.btnGlow.to = 0; this.dirty = true; } });
    }

    drawMascot(ctx, sz, cw, ch) {
      const unit = sz / 48;
      ctx.save();
      ctx.translate(cw * 0.5, ch * 0.56);
      ctx.scale(unit, unit);
      ctx.lineJoin = ctx.lineCap = 'round';
      const ink = '#1D1A4A';
      const op = clamp(this.lidOpen.x, 0, 1.25);
      const hp = Math.max(0, this.hop.x);

      ctx.fillStyle = 'rgba(29, 26, 74, 0.17)';
      ctx.beginPath(); ctx.ellipse(0, 19.2, 13.8 * (1 - hp * 0.2), 2.6, 0, 0, TAU); ctx.fill();

      ctx.translate(0, 1.8 - hp * 6.5 - this.hoverLift.x * 1.2);
      ctx.rotate(this.tilt.x * 0.30);

      const R = 14.8;

      // Twin Sculpted Golden Valkyrie Wing-Crests flanking the Equatorial Belt (Contour Breakers!)
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(side * (R - 1.2), -0.5);
        ctx.scale(side, 1);
        const wing = new Path2D();
        wing.moveTo(0, -2.2);
        wing.quadraticCurveTo(5.8, -7.8, 7.6, -5.2);
        wing.quadraticCurveTo(5.2, -1.6, 6.2, -0.4);
        wing.quadraticCurveTo(3.8, 1.8, 4.6, 2.8);
        wing.quadraticCurveTo(1.8, 3.6, 0, 2.2);
        wing.closePath();
        celShape(ctx, wing, 1.35, -0.8, -1.0, '#FACC15', '#D97706', '#78350F', ink);
        ctx.restore();
      }

      // Radiant Plasma Star Core erupting inside when Lid Hinges Open!
      if (op > 0.06) {
        celShape(ctx, ellipsePath(0, -2.5, R * 0.88, R * 0.68), 1.3, 0, -1.5, '#FFE44D', '#FF5FA8', '#BE185D', ink);
        ctx.save();
        ctx.translate(0, -4.5 - op * 3.5);
        ctx.rotate(fx.now * 5);
        celShape(ctx, fiveStarPath(7.8 * Math.min(1, op * 1.3), 3.4 * Math.min(1, op * 1.3)), 1.3, -1, -1, '#FFE44D', '#38BDF8', '#0284C7', ink);
        ctx.restore();
      }

      // Bottom Pearl-Titanium Armored Hemisphere + Pedestal Ring + Mech Grooves
      const bot = new Path2D();
      bot.arc(0, 0, R, 0, Math.PI, false);
      bot.closePath();
      celShape(ctx, bot, 1.8, -2.8, -2.2, '#F8FAFC', '#CBD5E1', '#64748B', ink);
      ctx.save();
      ctx.clip(bot);
      // Golden lower trim ring & sci-fi engraved seam lines
      ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.ellipse(0, 12.6, 9.5, 2.2, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = '#64748B'; ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(-7.5, 2.0); ctx.lineTo(-5.2, 11.2);
      ctx.moveTo(7.5, 2.0); ctx.lineTo(5.2, 11.2);
      ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = ink; ctx.lineWidth = 1.75; ctx.stroke(bot);

      // Top Ruby-Crimson Master Hemisphere (Hinges open upward!)
      ctx.save();
      ctx.translate(-R * 0.88, -1);
      ctx.rotate(-op * 0.78);
      ctx.translate(R * 0.88, 1);

      const top = new Path2D();
      top.arc(0, 0, R, Math.PI, TAU, false);
      top.closePath();
      celShape(ctx, top, 1.8, -3.0, -3.4, '#EF233C', '#B91C1C', '#690500', ink);

      ctx.save();
      ctx.clip(top);
      // Twin Sculpted Gold Master Capsules on upper dome!
      for (const side of [-1, 1]) {
        celShape(ctx, ellipsePath(side * 9.8, -8.8, 4.4, 3.2, side * 0.52), 1.25, -0.8, -0.8, '#FFE033', '#D97706', '#78350F', ink);
      }
      // Golden Crown Crest Diamond on Forehead!
      ctx.save();
      ctx.translate(0, -9.2);
      const crest = new Path2D();
      crest.moveTo(0, -3.4); crest.lineTo(2.8, 0); crest.lineTo(0, 3.4); crest.lineTo(-2.8, 0); crest.closePath();
      celShape(ctx, crest, 1.15, -0.5, -0.5, '#FFE44D', '#F59E0B', '#92400E', ink);
      ctx.restore();
      // Dual Curved Anime Glass Specular Highlights
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.ellipse(-5.8, -9.6, 3.4, 1.5, -0.52, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(-9.0, -6.2, 1.0, 0, TAU); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = ink; ctx.lineWidth = 1.75; ctx.stroke(top);

      // Armored Equatorial Tech Seam + Cyan LED Side Vents + 4-Ring Crystal Core Button!
      celShape(ctx, roundRectPath(-R - 0.6, -2.3, (R + 0.6) * 2, 4.6, 1.8), 1.45, 0, -1, '#334155', '#1E1B4B', '#090D16', ink);
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(side * 9.2 - 1.8, -0.8, 3.6, 1.6);
      }
      // Outer metallic bezel -> Glowing ring -> Crystal core!
      const isLit = this.btnGlow.x > 0.3 || op > 0.1;
      celShape(ctx, ellipsePath(0, 0, 5.2, 5.2), 1.55, -0.8, -0.8, '#F8FAFC', '#CBD5E1', '#64748B', ink);
      celShape(ctx, ellipsePath(0, 0, 3.1, 3.1), 1.15, -0.5, -0.5, isLit ? '#FF5FA8' : '#38BDF8', isLit ? '#E11D48' : '#0284C7', isLit ? '#881337' : '#1E3A8A', ink);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(-0.9, -0.9, 0.95, 0, TAU); ctx.fill();

      ctx.restore();
      ctx.restore();
    }
  }

  // =========================================================================
  // 3. <sakuga-kirby> — Star-Rod Wizard Kirby (Starry Cobalt Hat + Legendary Star Rod!)
  // =========================================================================
  class SakugaKirby extends CuteMascotBase {
    initSprings() {
      this.puffUp = new Spring(0, 380, 12);
      this.inhale = new Spring(0, 460, 14);
      this.flap = new Spring(0, 480, 11);
      this.hop = new Spring(0, 420, 13);
      return [this.puffUp, this.inhale, this.flap, this.hop];
    }

    inhaleAndSpit(customText = 'QUÁ ĐỈNH!!') {
      const n = ++this.seq, c = at(this.stageEl);
      this.cutUntil = fx.now + 1.55;
      this.inhale.to = 1;
      this.flap.v = 13;
      this.dirty = true;
      lines(c.x + 65, c.y, { n: 9, dir: Math.PI, len: 62, spread: 30, life: 0.36 });
      puff(c.x + 48, c.y, { size: 9.5, vx: -78, vy: 0, life: 0.38 });
      window.MultiverseSFX?.stretch();

      later(340, () => {
        if (n !== this.seq) return;
        this.inhale.to = 0;
        this.puffUp.to = 1; this.puffUp.v = 8.5;
        this.hop.to = 0.85; this.hop.v = 7.5;
        this.dirty = true;
      });

      later(680, () => {
        if (n !== this.seq) return;
        this.puffUp.to = 0; this.hop.to = 0;
        this.flap.v = -14;
        this.dirty = true;
        window.MultiverseSFX?.fanfare();
        burst(c.x + 38, c.y - 12, { r: 64, layer: this.back });
        slash(c.x + 44, c.y - 8, { len: 165, ang: -0.35, thick: 18, col: '#FFE44D', sub: '#FF5FA8' });
        shards(c.x + 38, c.y - 12, { n: 10, speed: 240, size: 6.8 });
        donut(c.x + 28, c.y - 10, { r: 22, vx: 65, vy: -25 });
        sfx(customText, c.x + 48, c.y - 68, { size: 62, col: '#FF5FA8', edge: '#1D1A4A' });
      });
    }

    playCut(kind = 'loop') {
      if (fx.calm) return;
      if (kind === 'click') {
        this.emit('kirby-spit', {});
        return;
      }
      this.cutUntil = fx.now + 1.05;
      this.hop.v = 5.8; this.flap.v = 10.5; this.dirty = true;
      const c = at(this.stageEl);
      kira(c.x + 36, c.y - 30, { r: 10, col: '#FFE44D' });
    }

    drawMascot(ctx, sz, cw, ch) {
      const unit = sz / 48;
      ctx.save();
      ctx.translate(cw * 0.5, ch * 0.58);
      ctx.scale(unit, unit);
      ctx.lineJoin = ctx.lineCap = 'round';
      const ink = '#2A1433';
      const pf = clamp(this.puffUp.x, 0, 1.3);
      const inh = clamp(this.inhale.x, 0, 1);
      const hp = Math.max(0, this.hop.x);

      ctx.fillStyle = 'rgba(29, 26, 74, 0.16)';
      ctx.beginPath(); ctx.ellipse(0, 18.8, 13.6 * (1 - hp * 0.18), 2.5, 0, 0, TAU); ctx.fill();

      ctx.translate(0, -hp * 6.5 - pf * 3.0 - this.hoverLift.x * 1.2);
      const bloat = 1 + pf * 0.20;
      ctx.scale(bloat, bloat);

      // Fluttering Golden Star-Cape Ribbon peeking behind Kirby!
      ctx.save();
      ctx.translate(-9.5, 5.5);
      ctx.rotate(0.2 + this.flap.x * 0.25);
      const cape = new Path2D();
      cape.moveTo(0, -4);
      cape.quadraticCurveTo(-8.5, -2.5, -10.2, 4.2);
      cape.lineTo(-5.8, 3.6);
      cape.lineTo(-4.2, 7.2);
      cape.quadraticCurveTo(0, 4.5, 2, 1);
      cape.closePath();
      celShape(ctx, cape, 1.35, -1, -1, '#FEF08A', '#FACC15', '#CA8A04', ink);
      ctx.restore();

      // Detailed Sculpted Ruby Adventurer Boots (with thick sole rim & dual toe speculars!)
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(side * 6.8, 14.4);
        ctx.rotate(side * (0.18 + hp * 0.26));
        const shoe = new Path2D();
        shoe.moveTo(-5.6, 2.2);
        shoe.bezierCurveTo(-6.2, -2.2, -1.8, -4.2, 2.2, -3.4);
        shoe.bezierCurveTo(6.2, -2.5, 6.8, 1.8, 5.2, 2.8);
        shoe.quadraticCurveTo(0, 3.6, -5.6, 2.2);
        shoe.closePath();
        celShape(ctx, shoe, 1.55, -1.4, -1.4, '#F43F5E', '#BE123C', '#690518', ink);
        ctx.strokeStyle = ink; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(-5.0, 1.6); ctx.quadraticCurveTo(0, 2.4, 4.8, 1.8); ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.ellipse(side * 1.6, -1.4, 1.8, 0.85, -0.15, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(side * -1.2, -1.2, 0.55, 0, TAU); ctx.fill();
        ctx.restore();
      }

      // Left Stubby Sakura Hand Flapping Cheerfully
      ctx.save();
      ctx.translate(-13.0, -0.2);
      ctx.rotate(0.45 - this.flap.x * 0.38);
      celShape(ctx, ellipsePath(-2.2, 0, 4.4, 3.3), 1.55, -0.9, -0.9, '#FF94C8', '#EC4899', '#9D174D', ink);
      ctx.restore();

      // Plump 3-Tone Vibrant Sakura-Pink Mochi Body + Soft Specular!
      celShape(ctx, ellipsePath(0, 1.4, 14.5, 14.0), 1.8, -3.2, -3.5, '#FF9AD0', '#EC4899', '#9D174D', ink);
      ctx.fillStyle = '#FFF0F6';
      ctx.beginPath(); ctx.ellipse(-7.8, -5.2, 2.6, 1.2, -0.55, 0, TAU); ctx.fill();

      // Rosy Blush Cheeks with Authentic '//' Anime Blush Hatch Ticks!
      for (const side of [-1, 1]) {
        const bx = side * 8.2, by = 1.6;
        ctx.fillStyle = '#F43F5E';
        ctx.beginPath(); ctx.ellipse(bx, by, 2.8, 1.45, side * -0.14, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#9F1239'; ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(bx - 0.8, by + 0.6); ctx.lineTo(bx - 0.1, by - 0.6);
        ctx.moveTo(bx + 0.5, by + 0.6); ctx.lineTo(bx + 1.2, by - 0.6);
        ctx.stroke();
      }

      // Authentic 5-Layer Tall Sapphire Kirby Eyes!
      for (const side of [-1, 1]) {
        const ex = side * 3.8, ey = -3.2;
        const eyeP = ellipsePath(ex, ey, 2.0, 4.35);
        ctx.save();
        ctx.fillStyle = ink; ctx.fill(eyeP);
        ctx.clip(eyeP);
        ctx.fillStyle = '#1D4ED8';
        ctx.beginPath(); ctx.ellipse(ex, ey + 2.4, 2.2, 2.6, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath(); ctx.ellipse(ex, ey + 3.3, 1.65, 1.55, 0, 0, TAU); ctx.fill();
        ctx.restore();
        ctx.strokeStyle = ink; ctx.lineWidth = 1.35; ctx.stroke(eyeP);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.ellipse(ex, ey - 1.65, 1.22, 1.85, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + side * 0.5, ey + 2.6, 0.52, 0, TAU); ctx.fill();
      }

      // Expressive Mouth: Swirling Vortex Tunnel (Inhale) | Puffed '3' Cheeks | 3-Tone Open Smile!
      if (inh > 0.25) {
        const rM = 4.8 * inh;
        celShape(ctx, ellipsePath(0, 3.6, rM, rM * 1.12), 1.35, 0, 1.4, '#FB7185', '#BE123C', '#4C0519', ink);
        ctx.strokeStyle = '#FFE4E6'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.arc(0, 3.6, rM * 0.55, 0.3, 4.2); ctx.stroke();
      } else if (pf > 0.35) {
        ctx.strokeStyle = ink; ctx.lineWidth = 1.55;
        ctx.beginPath();
        ctx.arc(-1.4, 2.4, 1.4, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.arc(1.4, 2.4, 1.4, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
      } else {
        const sm = new Path2D();
        sm.moveTo(-2.7, 1.6); sm.lineTo(2.7, 1.6);
        sm.quadraticCurveTo(2.2, 4.8, 0, 4.8);
        sm.quadraticCurveTo(-2.2, 4.8, -2.7, 1.6);
        sm.closePath();
        celShape(ctx, sm, 1.2, 0, 1.2, '#FB7185', '#E11D48', '#881337', ink);
      }

      // Iconic Star-Spangled Deep Cobalt Wizard Hat + Fluffy Gold Brim + Bouncing Star Pom-Pom!
      ctx.save();
      ctx.translate(0, -10.8);
      ctx.rotate(-0.08 + this.flap.x * 0.08);
      const cap = new Path2D();
      cap.moveTo(-11.8, 1.2);
      cap.bezierCurveTo(-10.2, -9.2, -1.0, -12.8, -13.5, -12.8);
      cap.bezierCurveTo(-3.2, -17.2, 9.6, -10.8, 11.6, 1.2);
      cap.closePath();
      celShape(ctx, cap, 1.55, -2.2, -2.2, '#3B82F6', '#1D4ED8', '#172554', ink);
      ctx.fillStyle = '#BAE6FD';
      ctx.beginPath(); ctx.ellipse(-3.5, -9.5, 2.6, 0.95, -0.35, 0, TAU); ctx.fill();
      ctx.save();
      ctx.translate(2.2, -5.2);
      celShape(ctx, fiveStarPath(2.5, 1.15), 0.9, 0, 0, '#FFE44D', '#F59E0B', '#B45309', ink);
      ctx.restore();
      ctx.save();
      ctx.translate(-13.8, -12.4 + Math.sin(fx.now * 6) * 0.8);
      ctx.rotate(fx.now * 2.5);
      celShape(ctx, fiveStarPath(3.5, 1.6), 1.1, -0.5, -0.5, '#FFE44D', '#F59E0B', '#B45309', ink);
      ctx.restore();
      const brim = new Path2D();
      brim.moveTo(-13.0, 2.2);
      brim.quadraticCurveTo(0, -2.6, 13.0, 2.2);
      brim.quadraticCurveTo(13.8, 4.8, 11.4, 4.8);
      brim.quadraticCurveTo(0, 0.8, -11.4, 4.8);
      brim.quadraticCurveTo(-13.8, 4.8, -13.0, 2.2);
      brim.closePath();
      celShape(ctx, brim, 1.45, -1.2, -1.2, '#FFE44D', '#F59E0B', '#B45309', ink);
      celShape(ctx, ellipsePath(0, 1.5, 2.4, 2.8), 1.15, -0.5, -0.5, '#38BDF8', '#0284C7', '#1E3A8A', ink);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(-0.7, 0.8, 0.75, 0, TAU); ctx.fill();
      ctx.restore();

      // Right Hand + Foreground Hero Prop: THE LEGENDARY STAR ROD!
      ctx.save();
      ctx.translate(12.8, 0.2);
      ctx.rotate(0.32 + this.flap.x * 0.36);
      celShape(ctx, roundRectPath(1.2, -14.5, 3.2, 18.5, 1.5), 1.35, -0.6, -0.6, '#F43F5E', '#BE123C', '#881337', ink);
      ctx.fillStyle = '#FFFDF0';
      ctx.fillRect(1.7, -11.0, 2.2, 2.4);
      ctx.fillRect(1.7, -5.5, 2.2, 2.4);
      celShape(ctx, ellipsePath(2.8, -13.5, 4.2, 1.6), 1.15, -0.5, -0.5, '#FFE44D', '#F59E0B', '#92400E', ink);
      ctx.save();
      ctx.translate(2.8, -18.2);
      ctx.rotate(Math.sin(fx.now * 4) * 0.14);
      celShape(ctx, fiveStarPath(6.5, 2.95), 1.45, -1.2, -1.2, '#FFE44D', '#F59E0B', '#B45309', ink);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(-1.4, -1.6, 1.2, 0, TAU); ctx.fill();
      ctx.restore();
      celShape(ctx, ellipsePath(1.8, 0, 4.2, 3.2), 1.5, -0.8, -0.8, '#FF9AD0', '#EC4899', '#9D174D', ink);
      ctx.restore();

      ctx.restore();
    }
  }

  // =========================================================================
  // 4. <sakuga-king-slime> — Translucent RPG Crystal Slime Emperor + 4 God-Tier Elemental Finishers!
  // =========================================================================
  const eOut = (t) => 1 - (1 - t) ** 3;
  const eIn = (t) => t * t * t;
  const eBack = (t) => 1 + 2.5 * (t - 1) ** 3 + 1.5 * (t - 1) ** 2;

  // 🌊 COLOSSAL HOKUSAI / UFOTABLE WATER-BREATHING TSUNAMI GEYSER (~320px wide!)
  function unleashHydroTsunami(cx, cy, backLayer) {
    const ink = '#08203E';
    window.MultiverseSFX?.pop();
    window.MultiverseSFX?.slash();

    // 1. Triple Concentric Ocean Shockwave Ripples!
    ring(cx, cy + 26, { rx: 98, ry: 24, w: 8.5, col: '#38BDF8', ink, life: 0.68 });
    later(75, () => ring(cx, cy + 28, { rx: 146, ry: 34, w: 6.5, col: '#FFFFFF', ink: '#0284C7', life: 0.72 }));
    later(150, () => ring(cx, cy + 30, { rx: 182, ry: 40, w: 4.8, col: '#67E8F9', ink, life: 0.65 }));

    // 2. Twin Curling Hokusai Great-Wave Tsunami Wings + Roaring Central Geyser Column!
    fx.spawn(0.84, (k, t, _dt, g) => {
      const surge = Math.sin(clamp(k / 0.88) * Math.PI);
      const shrink = 1 - eIn(clamp((k - 0.58) / 0.42));
      const sc = surge * shrink;
      if (sc < 0.05) return;

      // Central Roaring Hydro Geyser Column shooting 165px upward!
      const gH = 165 * eOut(clamp(k / 0.34)) * shrink;
      const gW = 48 * sc;
      if (gH > 8) {
        const gey = new Path2D();
        const N = 16;
        for (let i = 0; i <= N; i++) {
          const u = i / N;
          const yy = (cy + 24) - gH * u;
          const flare = (1 - u * 0.35) + Math.pow(u, 3) * 0.85 + Math.sin(u * 12 - t * 28) * 0.16;
          gey[i ? 'lineTo' : 'moveTo'](cx - gW * flare, yy);
        }
        for (let i = N; i >= 0; i--) {
          const u = i / N;
          const yy = (cy + 24) - gH * u;
          const flare = (1 - u * 0.35) + Math.pow(u, 3) * 0.85 + Math.cos(u * 11 - t * 26) * 0.16;
          gey.lineTo(cx + gW * flare, yy);
        }
        gey.closePath();
        celShape(g, gey, 2.6, -6, -6, '#38BDF8', '#0284C7', '#0369A1', ink);
        // Frothy white seafoam crest crowning the geyser top!
        const topY = (cy + 24) - gH;
        const foamTop = new Path2D();
        for (const [ox, oy, rr] of [[-28, 8, 16], [-12, -2, 19], [10, -4, 20], [28, 6, 16], [0, 6, 18]]) {
          const r = rr * sc;
          foamTop.moveTo(cx + ox * sc + r, topY + oy * sc);
          foamTop.arc(cx + ox * sc, topY + oy * sc, r, 0, TAU);
        }
        g.strokeStyle = ink; g.lineWidth = 4.2 * shrink; g.stroke(foamTop);
        g.fillStyle = '#FFFFFF'; g.fill(foamTop);
      }

      // Twin Curling Hokusai Tsunami Wings sweeping Left & Right!
      for (const side of [-1, 1]) {
        const reachX = 148 * eOut(clamp(k / 0.42));
        const peakY = 118 * surge;
        const wave = new Path2D();
        wave.moveTo(cx, cy + 26);
        wave.bezierCurveTo(
          cx + side * reachX * 0.45, cy + 16,
          cx + side * reachX * 1.12, cy - peakY * 0.55,
          cx + side * reachX * 0.86, cy - peakY
        );
        // Curling inner hook of the tsunami wave!
        wave.bezierCurveTo(
          cx + side * reachX * 0.56, cy - peakY * 1.08,
          cx + side * reachX * 0.52, cy - peakY * 0.58,
          cx + side * reachX * 0.68, cy - peakY * 0.48
        );
        wave.bezierCurveTo(
          cx + side * reachX * 0.72, cy - peakY * 0.12,
          cx + side * reachX * 0.35, cy + 8,
          cx, cy + 26
        );
        wave.closePath();
        celShape(g, wave, 2.4 * shrink, -side * 4, -5, '#00D2FF', '#0284C7', '#0C4A6E', ink);

        // Hokusai White Seafoam Claw-Bubbles on the curling wave crest!
        const cxTip = cx + side * reachX * 0.82;
        const cyTip = cy - peakY * 0.92;
        const claws = new Path2D();
        for (const [dx, dy, cr] of [[0, 0, 14], [-side * 14, -6, 11], [-side * 24, 4, 9.5], [side * 10, 10, 10]]) {
          const rr = cr * sc;
          if (rr < 1.2) continue;
          claws.moveTo(cxTip + dx * sc + rr, cyTip + dy * sc);
          claws.arc(cxTip + dx * sc, cyTip + dy * sc, rr, 0, TAU);
        }
        g.strokeStyle = ink; g.lineWidth = 3.6 * shrink; g.stroke(claws);
        g.fillStyle = '#FFFFFF'; g.fill(claws);
      }
    });

    // 3. Massive 230px Ocean Splash Crown + 20 Glossy Water Teardrops & Bubbles!
    splash(cx, cy + 22, { w: 230, h: 142, life: 0.88 });

    // 4. Twin Ufotable Water-Breathing Coiling Hydro-Slashes!
    slash(cx, cy - 4, { len: 245, ang: -0.36, thick: 24, col: '#0284C7', sub: '#67E8F9', ink, life: 0.54 });
    later(70, () => {
      slash(cx, cy - 10, { len: 235, ang: 0.40, thick: 21, col: '#00D2FF', sub: '#FFFFFF', ink, life: 0.50 });
    });

    sfx('SÓNG THẦN CUỐN!! 🌊', cx, cy - 118, { size: 78, col: '#38BDF8', edge: ink });
  }

  // 💎 COLOSSAL PRISMATIC CRYSTAL SPIRE ERUPTION & 3D GEMSTONE SHATTER (~340px wide!)
  function unleashCrystalSupernova(cx, cy, backLayer) {
    const ink = '#1D1A4A';
    window.MultiverseSFX?.punch();
    window.MultiverseSFX?.fanfare();

    burst(cx, cy, { r: 96, spikes: 16, life: 0.44, layer: backLayer });

    const prismPals = [
      ['#E0F2FE', '#38BDF8', '#0369A1'], // Diamond Cyan
      ['#F3E8FF', '#C084FC', '#6D28D9'], // Royal Amethyst
      ['#FFE4F0', '#FF4D8D', '#BE123C'], // Rose Ruby
      ['#FEF9C3', '#FFE033', '#B45309'], // Star Topaz
    ];

    // 1. Expanding Twin Counter-Rotating Hexagonal Crystal Shockwave Rings!
    fx.spawn(0.62, (k, t, _dt, g) => {
      const R = lerp(28, 168, eOut(k));
      const lw = Math.max(0, 9.5 * (1 - k));
      if (lw < 0.4) return;
      for (const [scaleR, dir, col] of [[1.0, 1, '#C084FC'], [0.76, -1.3, '#38BDF8']]) {
        const p = new Path2D();
        for (let i = 0; i < 6; i++) {
          const a = t * 2.4 * dir + (i / 6) * TAU;
          p[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * R * scaleR, cy + Math.sin(a) * R * scaleR);
        }
        p.closePath();
        g.strokeStyle = ink; g.lineWidth = lw + 4; g.stroke(p);
        g.strokeStyle = col; g.lineWidth = lw; g.stroke(p);
      }
    });

    // 2. 10 Towering 3D Beveled Prismatic Crystal Spires Jutting Radially Outward!
    const spires = Array.from({ length: 10 }, (_, i) => ({
      ang: -Math.PI + (i / 10) * TAU + rnd(-0.10, 0.10),
      len: rnd(92, 156),
      hw: rnd(12, 20),
      pal: prismPals[i % prismPals.length],
      delay: (i % 3) * 0.04,
    }));

    fx.spawn(0.68, (k, _t, _dt, g) => {
      for (const sp of spires) {
        const lk = clamp((k - sp.delay) / (1 - sp.delay), 0, 1);
        if (lk <= 0) continue;
        const grow = eBack(clamp(lk / 0.24));
        const shatter = 1 - eIn(clamp((lk - 0.48) / 0.52));
        const sc = grow * shatter;
        if (sc < 0.06) continue;

        const L = sp.len * sc;
        const W = sp.hw * sc;
        const pushOut = 14 + eIn(clamp((lk - 0.42) / 0.58)) * 42;
        const [hiC, midC, shC] = sp.pal;

        g.save();
        g.translate(cx + Math.cos(sp.ang) * pushOut, cy + Math.sin(sp.ang) * pushOut);
        g.rotate(sp.ang);

        const obelisk = new Path2D();
        obelisk.moveTo(0, -W * 0.55);
        obelisk.lineTo(L * 0.72, -W);
        obelisk.lineTo(L, 0);
        obelisk.lineTo(L * 0.72, W);
        obelisk.lineTo(0, W * 0.55);
        obelisk.closePath();

        // Bold ink border + 3D Split-Facet Shading (Upper sunlit plane vs Lower deep jewel plane + White Crown Tip!)
        g.lineJoin = 'round';
        g.strokeStyle = ink;
        g.lineWidth = Math.max(2.6, 5.2 * shatter);
        g.stroke(obelisk);
        g.fillStyle = shC;
        g.fill(obelisk);

        // Upper sunlit crystal plane
        g.fillStyle = hiC;
        g.beginPath();
        g.moveTo(0, -W * 0.55);
        g.lineTo(L * 0.72, -W);
        g.lineTo(L, 0);
        g.lineTo(0, 0);
        g.closePath();
        g.fill();

        // Lower saturated mid-gem plane
        g.fillStyle = midC;
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(L, 0);
        g.lineTo(L * 0.72, W * 0.68);
        g.lineTo(0, W * 0.35);
        g.closePath();
        g.fill();

        // Blazing white diamond crown facet at tip + crisp internal crystal ridge lines!
        g.fillStyle = '#FFFFFF';
        g.beginPath();
        g.moveTo(L * 0.72, -W);
        g.lineTo(L, 0);
        g.lineTo(L * 0.64, 0);
        g.closePath();
        g.fill();

        g.strokeStyle = '#FFFFFF';
        g.lineWidth = Math.max(1.2, 2.2 * shatter);
        g.beginPath();
        g.moveTo(0, 0); g.lineTo(L * 0.96, 0);
        g.moveTo(L * 0.72, -W * 0.92); g.lineTo(L * 0.62, 0); g.lineTo(L * 0.72, W * 0.92);
        g.stroke();

        g.restore();
      }
    });

    // 3. 24 Large Tumbling 3D Multi-Faceted Gemstone Shards Exploding 360°!
    later(90, () => {
      shards(cx, cy, { n: 24, speed: 345, size: 12.8, arc: TAU, grav: 440, life: 0.95 });
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * TAU;
        later(i * 45, () => kira(cx + Math.cos(a) * rnd(55, 125), cy + Math.sin(a) * rnd(45, 105), {
          r: rnd(12, 18), col: i % 2 === 0 ? '#FFE44D' : '#38BDF8',
        }));
      }
    });

    sfx('PHA LÊ BÙNG NỔ!! 💎', cx, cy - 118, { size: 78, col: '#C084FC', edge: ink });
  }

  class SakugaKingSlime extends CuteMascotBase {
    initSprings() {
      this.jelly = new Spring(0, 480, 9);
      this.crownLift = new Spring(0, 340, 11);
      this.dizzy = new Spring(0, 420, 15);
      return [this.jelly, this.crownLift, this.dizzy];
    }

    frame(dt) {
      if (this.inView && !fx.calm) {
        const tick = Math.floor(fx.now * 12);
        if (tick !== this._bubTick) {
          this._bubTick = tick;
          this.dirty = true; // animate floating inner crystal core & rising bubbles!
        }
      }
      super.frame(dt);
    }

    takeElementalHit(element = 'slash') {
      const n = ++this.seq, c = at(this.stageEl);
      this.cutUntil = fx.now + 1.15;
      this.jelly.x = -0.55; this.jelly.v = 14.5;
      this.crownLift.x = 1.25; this.crownLift.v = 9.5; this.crownLift.to = 0;
      this.dizzy.to = 1;
      this.dirty = true;

      if (element === 'slash') {
        // 3-Beat Master Sakuga Sword-Qi Combo (Blazing Crimson X Azure Wind X Golden Finisher!)
        window.MultiverseSFX?.slash();
        burst(c.x, c.y, { r: 64, layer: this.back });
        slash(c.x, c.y, { len: 220, ang: -0.60, thick: 23, col: '#FF2E7E', sub: '#FFE44D', life: 0.50 });
        lines(c.x - 40, c.y + 30, { n: 7, dir: -0.60, len: 70, spread: 22, life: 0.32 });
        later(65, () => {
          window.MultiverseSFX?.slash();
          slash(c.x, c.y, { len: 220, ang: 0.60, thick: 23, col: '#00E5FF', sub: '#8F8DF7', life: 0.50 });
        });
        later(135, () => {
          slash(c.x, c.y + 2, { len: 255, ang: -0.04, thick: 19, col: '#FFE44D', sub: '#FF2E7E', life: 0.48 });
          ring(c.x, c.y + 18, { rx: 56, ry: 15, w: 5.5 });
          shards(c.x, c.y, { n: 10, speed: 245, size: 6.2 });
        });
        sfx('TAM KIẾM XOẸT!! ⚔️', c.x + 24, c.y - 72, { size: 58, col: '#FF2E7E', edge: '#1D1A4A' });
      } else if (element === 'splash') {
        unleashHydroTsunami(c.x, c.y, this.back);
      } else if (element === 'crystal') {
        unleashCrystalSupernova(c.x, c.y, this.back);
      } else {
        window.MultiverseSFX?.thunder();
        burst(c.x, c.y, { r: 66, layer: this.back });
        lightningArc(c.x + rnd(-45, 45), c.y - 245, c.x, c.y, {
          col: '#FFE44D', core: '#FFFFFF', ink: '#1D1A4A', width: 12.5, sway: 0.24, branches: 6, life: 0.48,
        });
        later(52, () => lightningArc(c.x + rnd(-55, 55), c.y - 210, c.x + rnd(-12, 12), c.y + 6, {
          col: '#38BDF8', core: '#FFFFFF', ink: '#1D1A4A', width: 8.8, sway: 0.30, branches: 5, life: 0.40,
        }));
        lightningArc(c.x - 10, c.y + 18, c.x - 95, c.y + 26, { col: '#FFE44D', width: 6.4, sway: 0.30, branches: 3, life: 0.34, impact: false });
        lightningArc(c.x + 10, c.y + 18, c.x + 95, c.y + 26, { col: '#38BDF8', width: 6.4, sway: 0.30, branches: 3, life: 0.34, impact: false });
        sfx('GIẬT NẢY!! ⚡', c.x, c.y - 70, { size: 58, col: '#FFE44D', edge: '#1D1A4A' });
      }

      later(650, () => { if (n === this.seq) { this.dizzy.to = 0; this.dirty = true; } });
    }

    playCut(kind = 'loop') {
      if (fx.calm) return;
      if (kind === 'click') {
        this.emit('slime-hit', {});
        return;
      }
      this.cutUntil = fx.now + 1.0;
      this.jelly.v = 6.5; this.crownLift.v = 5.5; this.dirty = true;
    }

    drawMascot(ctx, sz, cw, ch) {
      const unit = sz / 48;
      ctx.save();
      ctx.translate(cw * 0.5, ch * 0.60);
      ctx.scale(unit, unit);
      ctx.lineJoin = ctx.lineCap = 'round';
      const ink = '#132043';
      const jl = this.jelly.x;
      const dz = clamp(this.dizzy.x, 0, 1);

      ctx.fillStyle = 'rgba(19, 32, 67, 0.17)';
      ctx.beginPath(); ctx.ellipse(0, 17.8, 16.0 * (1 - jl * 0.12), 2.8, 0, 0, TAU); ctx.fill();

      ctx.save();
      ctx.translate(0, 16.5 - this.hoverLift.x);
      const sy = clamp(1 + jl * 0.28, 0.62, 1.42);
      ctx.scale(1 / Math.sqrt(sy), sy);
      ctx.translate(0, -16.5);

      // Royal Crimson Velvet & Ermine Fur Cape peeking behind King Slime (Contour Breaker!)
      const cape = new Path2D();
      cape.moveTo(-13.5, 4.0);
      cape.quadraticCurveTo(-20.2, 11.5, -18.5, 16.8);
      cape.quadraticCurveTo(0, 18.8, 18.5, 16.8);
      cape.quadraticCurveTo(20.2, 11.5, 13.5, 4.0);
      cape.closePath();
      celShape(ctx, cape, 1.55, -2.0, -2.0, '#EF233C', '#B91C1C', '#690518', ink);

      // Orbiting Bouncy Mini Jelly Droplets flanking King Slime!
      for (const [side, yOff] of [[-1, -1.5], [1, 1.2]]) {
        const by = 4.5 + yOff + Math.sin(fx.now * 4.5 + side) * 1.6;
        celShape(ctx, ellipsePath(side * 18.5, by, 2.4, 2.7, side * 0.2), 1.2, -0.6, -0.6, '#38BDF8', '#0284C7', '#0C4A6E', ink);
      }

      // Sculpted Onion-Drop Aqua-Crystal Slime Silhouette!
      const slime = new Path2D();
      slime.moveTo(0, -14.2);
      slime.bezierCurveTo(4.8, -7.8, 16.8, -1.2, 16.5, 9.0);
      slime.bezierCurveTo(16.2, 16.4, 9.0, 17.4, 0, 17.4);
      slime.bezierCurveTo(-9.0, 17.4, -16.2, 16.4, -16.5, 9.0);
      slime.bezierCurveTo(-16.8, -1.2, -4.8, -7.8, 0, -14.2);
      slime.closePath();
      celShape(ctx, slime, 1.85, -3.4, -3.6, '#38BDF8', '#0284C7', '#0C4A6E', ink);

      // Translucent Liquid Interior: Bottom Caustic Glow + Suspended Enchanted Ruby Core + Rising Bubbles!
      ctx.save();
      ctx.clip(slime);
      // Luminous aqua-mint bottom bounce caustic!
      ctx.fillStyle = '#67E8F9';
      ctx.beginPath(); ctx.ellipse(0, 15.6, 13.2, 3.8, 0, 0, TAU); ctx.fill();

      // Suspended Glowing Monster Core Gem floating high inside the crystal dome!
      ctx.save();
      ctx.translate(0, -3.2 + Math.sin(fx.now * 3.5) * 0.8);
      ctx.rotate(Math.sin(fx.now * 2) * 0.18);
      const coreGem = new Path2D();
      coreGem.moveTo(0, -4.0); coreGem.lineTo(3.1, 0); coreGem.lineTo(0, 4.0); coreGem.lineTo(-3.1, 0); coreGem.closePath();
      ctx.fillStyle = 'rgba(255, 228, 77, 0.65)';
      ctx.beginPath(); ctx.arc(0, 0, 4.8, 0, TAU); ctx.fill();
      celShape(ctx, coreGem, 1.0, -0.6, -0.6, '#FF3B7F', '#BE123C', '#881337', '#0C4A6E');
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(-0.9, -1.2, 0.75, 0, TAU); ctx.fill();
      ctx.restore();

      // 5 Translucent Cel Air-Bubbles bobbing inside!
      for (const [bx, by, br, ph] of [[-8.8, 11.2, 1.5, 0], [9.4, 10.5, 1.8, 1.4], [-4.5, -2.5, 1.1, 2.6], [6.2, -1.2, 1.3, 3.8], [10.8, 4.5, 1.0, 5.0]]) {
        const yy = by + Math.sin(fx.now * 3.2 + ph) * 0.9;
        ctx.strokeStyle = '#E0F2FE'; ctx.lineWidth = 0.95;
        ctx.beginPath(); ctx.arc(bx, yy, br, 0, TAU); ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(bx - br * 0.35, yy - br * 0.35, br * 0.35, 0, TAU); ctx.fill();
      }
      ctx.restore();
      ctx.strokeStyle = ink; ctx.lineWidth = 1.8; ctx.stroke(slime);

      // Curved Glass Window Speculars on Upper-Left
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.ellipse(-7.2, 1.2, 3.8, 1.9, -0.64, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(-10.2, 5.6, 1.15, 0, TAU); ctx.fill();

      // Rosy Jelly Cheeks + Plump Royal Eyebrows + 4-Tone Golden Boss Eyes + Fanged Cat-King Grin!
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#FF5FA8';
        ctx.beginPath(); ctx.ellipse(side * 9.2, 9.2, 2.5, 1.2, 0, 0, TAU); ctx.fill();

        const ex = side * 5.2, ey = 6.2;
        // Plump royal white-gold eyebrow ('maro-mayu' / boss brow!)
        ctx.save();
        ctx.translate(ex - side * 0.4, ey - 3.9);
        ctx.rotate(side * (dz > 0.35 ? 0.32 : -0.24));
        celShape(ctx, ellipsePath(0, 0, 2.3, 1.05), 1.0, -0.3, -0.3, '#FFFFFF', '#FEF08A', '#FACC15', ink);
        ctx.restore();

        if (dz > 0.35) {
          ctx.strokeStyle = ink; ctx.lineWidth = 2.1;
          ctx.beginPath();
          ctx.moveTo(ex - side * 2.2, ey - 1.6);
          ctx.lineTo(ex + side * 1.8, ey + 0.2);
          ctx.lineTo(ex - side * 2.2, ey + 1.8);
          ctx.stroke();
        } else {
          const eyeP = ellipsePath(ex, ey, 2.45, 2.75);
          ctx.save();
          ctx.fillStyle = ink; ctx.fill(eyeP);
          ctx.clip(eyeP);
          ctx.fillStyle = '#D97706';
          ctx.beginPath(); ctx.ellipse(ex, ey + 1.4, 2.2, 1.8, 0, 0, TAU); ctx.fill();
          ctx.fillStyle = '#FDE047';
          ctx.beginPath(); ctx.ellipse(ex, ey + 2.0, 1.5, 1.1, 0, 0, TAU); ctx.fill();
          ctx.fillStyle = ink;
          ctx.beginPath(); ctx.arc(ex, ey - 0.1, 1.15, 0, TAU); ctx.fill();
          ctx.restore();
          ctx.strokeStyle = ink; ctx.lineWidth = 1.25; ctx.stroke(eyeP);
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(ex - 0.8, ey - 0.9, 0.95, 0, TAU);
          ctx.arc(ex + 0.85, ey + 0.85, 0.45, 0, TAU);
          ctx.fill();
        }
      }

      // Smug Cat-King 'ω' Grin with Cute Twin White Fangs (or shocked 'O' when hit!)
      if (dz > 0.35) {
        celShape(ctx, ellipsePath(0, 10.4, 2.4, 2.7), 1.2, 0, 0.8, '#FDA4AF', '#E11D48', '#881337', ink);
      } else {
        // Cute tiny white fangs!
        ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = ink; ctx.lineWidth = 0.95;
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(side * 1.8, 9.2); ctx.lineTo(side * 2.5, 11.2); ctx.lineTo(side * 3.3, 9.0);
          ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        ctx.strokeStyle = ink; ctx.lineWidth = 1.65;
        ctx.beginPath();
        ctx.moveTo(-3.6, 8.8); ctx.quadraticCurveTo(-1.8, 10.5, 0, 8.9);
        ctx.quadraticCurveTo(1.8, 10.5, 3.6, 8.8);
        ctx.stroke();
      }
      ctx.restore();

      // Ornate 5-Pronged Imperial Velvet-Lined Golden Crown + 3 Faceted Jewels & Pearl Tips!
      ctx.save();
      const crownY = -14.8 - Math.max(0, this.crownLift.x) * 8.8 - Math.max(0, jl) * 4.2;
      ctx.translate(0, crownY);
      ctx.rotate(this.crownLift.x * 0.22);
      // Crimson velvet inner cushion dome
      celShape(ctx, ellipsePath(0, -1.2, 6.2, 4.4), 1.3, -1, -1, '#EF233C', '#B91C1C', '#690518', ink);
      // 5-pronged golden crown frame
      const cr = new Path2D();
      cr.moveTo(-7.6, 2.4);
      cr.lineTo(-9.2, -4.6); cr.lineTo(-4.8, -1.2);
      cr.lineTo(-2.8, -5.8); cr.lineTo(0, -1.6);
      cr.lineTo(0, -7.2);
      cr.lineTo(2.8, -5.8); cr.lineTo(4.8, -1.2);
      cr.lineTo(9.2, -4.6); cr.lineTo(7.6, 2.4);
      cr.closePath();
      celShape(ctx, cr, 1.5, -1.4, -1.4, '#FFE033', '#F59E0B', '#92400E', ink);
      // White pearls on outer prongs + 3 jewels along base band!
      for (const [px, py] of [[-9.2, -4.8], [0, -7.4], [9.2, -4.8]]) {
        celShape(ctx, ellipsePath(px, py, 1.25, 1.25), 0.95, -0.3, -0.3, '#FFFFFF', '#E2E8F0', '#94A3B8', ink);
      }
      celShape(ctx, ellipsePath(0, -0.4, 1.75, 2.15), 1.0, -0.4, -0.4, '#FF3B6B', '#BE123C', '#881337', ink);
      for (const side of [-1, 1]) {
        celShape(ctx, ellipsePath(side * 4.8, 0.2, 1.2, 1.45), 0.9, -0.3, -0.3, '#34D399', '#059669', '#064E3B', ink);
      }
      ctx.restore();

      ctx.restore();
    }
  }

  // =========================================================================
  // 5. <sakuga-soot> — Ghibli Soot Sprite Trio + Spindly Limbs + 3 Konpeito Sugar Stars!
  // =========================================================================
  function bumpyKonpeitoPath(R) {
    const p = new Path2D();
    const spikes = 7;
    for (let i = 0; i < spikes * 2; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / spikes;
      const rad = i % 2 === 0 ? R : R * 0.56;
      p[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rad, Math.sin(a) * rad);
    }
    p.closePath();
    return p;
  }

  function spikySootPath(R, tufts = 24, spike = 2.6) {
    const p = new Path2D();
    for (let i = 0; i < tufts; i++) {
      const a0 = (i / tufts) * TAU;
      const aMid = ((i + 0.5) / tufts) * TAU;
      const a1 = ((i + 1) / tufts) * TAU;
      const rOut = R + spike * (i % 2 === 0 ? 1.15 : 0.72);
      if (i === 0) p.moveTo(Math.cos(a0) * R, Math.sin(a0) * R);
      p.quadraticCurveTo(Math.cos(aMid) * rOut, Math.sin(aMid) * rOut, Math.cos(a1) * R, Math.sin(a1) * R);
    }
    p.closePath();
    return p;
  }

  class SakugaSoot extends CuteMascotBase {
    initSprings() {
      this.pop = new Spring(0, 500, 12);
      return [this.pop];
    }

    frame(dt) {
      if (this.inView) this.dirty = true;
      super.frame(dt);
    }

    startle(wordText = 'Ú ÒA!!') {
      const c = at(this.stageEl);
      this.cutUntil = fx.now + 1.0;
      this.pop.x = 1.25; this.pop.v = 10; this.pop.to = 0;
      this.dirty = true;
      shards(c.x, c.y - 12, { n: 7, speed: 185, size: 5.2 });
      kira(c.x - 30, c.y - 28, { r: 9.5, col: '#FFE44D' });
      kira(c.x + 30, c.y - 24, { r: 9.5, col: '#FF5FA8' });
      sfx(wordText, c.x + 20, c.y - 56, { size: 48, ...hollow() });
      window.MultiverseSFX?.pop();
    }

    playCut(kind = 'loop') {
      if (fx.calm) return;
      if (kind === 'click') {
        this.startle('NHỘT QUÁ!!');
        return;
      }
      this.pop.v = 5.5; this.dirty = true;
    }

    drawMascot(ctx, sz, cw, ch) {
      const unit = sz / 48;
      ctx.save();
      ctx.translate(cw * 0.5, ch * 0.55);
      ctx.scale(unit, unit);
      ctx.lineJoin = ctx.lineCap = 'round';
      const ink = '#100E24';
      const pp = Math.max(0, this.pop.x);

      const rect = this.stageEl.getBoundingClientRect();
      const dx = mouseX - (rect.left + rect.width / 2);
      const dy = mouseY - (rect.top + rect.height / 2);
      const ang = Math.atan2(dy, dx);
      const lookDist = Math.min(1.65, Math.hypot(dx, dy) / 90);

      ctx.fillStyle = 'rgba(20, 18, 41, 0.15)';
      ctx.beginPath(); ctx.ellipse(0, 19.2, 13.2 * (1 - pp * 0.2), 2.3, 0, 0, TAU); ctx.fill();

      ctx.translate(0, -pp * 7.2 - this.hoverLift.x * 1.2);

      // 2 Adorable Baby Companion Soot Sprites peeking out asymmetrically!
      for (const [bx, by, br, ph] of [[-13.6, -8.8, 4.6, 0], [13.8, 6.2, 4.2, 2.2]]) {
        ctx.save();
        ctx.translate(bx, by + Math.sin(fx.now * 4 + ph) * 1.2 - pp * 2.5);
        celShape(ctx, spikySootPath(br, 14, 1.4), 1.15, -1.0, -1.0, '#4C4478', '#252040', '#120F24', ink);
        for (const s of [-1, 1]) {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath(); ctx.arc(s * 1.6, -0.4, 1.45, 0, TAU); ctx.fill();
          ctx.fillStyle = ink;
          ctx.beginPath(); ctx.arc(s * 1.6 + Math.cos(ang) * 0.55, -0.4 + Math.sin(ang) * 0.55, 0.62, 0, TAU); ctx.fill();
        }
        ctx.restore();
      }

      // Cute Spindly Ghibli Soot Arms & Dangling Legs!
      ctx.strokeStyle = ink; ctx.lineWidth = 1.65;
      for (const side of [-1, 1]) {
        const wave = Math.sin(fx.now * 5 + side) * 1.4 + pp * 3.5;
        // Waving thin arms
        ctx.beginPath();
        ctx.moveTo(side * 10.5, 2.0);
        ctx.quadraticCurveTo(side * 15.5, 0.5 - wave, side * 17.2, -2.5 - wave);
        ctx.stroke();
        // Dangling thin legs + tiny oval feet
        ctx.beginPath();
        ctx.moveTo(side * 4.2, 12.2);
        ctx.lineTo(side * (5.2 + pp * 2.0), 17.8);
        ctx.stroke();
        ctx.fillStyle = ink;
        ctx.beginPath(); ctx.ellipse(side * (5.8 + pp * 2.0), 18.0, 1.6, 0.9, side * 0.2, 0, TAU); ctx.fill();
      }

      // Main Fluffy Multi-Tuft Soot Sprite Body (26 spiky Ghibli soot tufts + 3-tone velvet cel!)
      const soot = spikySootPath(12.4, 26, 2.8 + pp * 1.8);
      celShape(ctx, soot, 1.45, -2.8, -3.0, '#4E467A', '#262142', '#131026', ink);

      // Soft Rosy Blush Glow + Big Expressive Studio Ghibli Eyes Tracking Cursor!
      for (const side of [-1, 1]) {
        ctx.fillStyle = 'rgba(255, 95, 168, 0.45)';
        ctx.beginPath(); ctx.ellipse(side * 7.6, 1.6, 2.0, 1.0, 0, 0, TAU); ctx.fill();

        const ex = side * 4.6, ey = -2.4;
        celShape(ctx, ellipsePath(ex, ey, 4.2, 4.45), 1.35, -0.6, -0.7, '#FFFFFF', '#F8FAFC', '#CBD5E1', ink);
        const px = ex + Math.cos(ang) * lookDist;
        const py = ey + Math.sin(ang) * lookDist;
        ctx.fillStyle = ink;
        ctx.beginPath(); ctx.arc(px, py, 1.65, 0, TAU); ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(px - 0.55, py - 0.55, 0.62, 0, TAU); ctx.fill();
      }

      // Bouquet of 3 Colorful Konpeito Japanese Sugar Stars cradled at bottom!
      const candies = [
        [-4.6, 8.8, 3.4, -0.25, '#E0F2FE', '#38BDF8', '#0284C7'],
        [4.6, 8.8, 3.4, 0.25, '#FEF9C3', '#FFE44D', '#D97706'],
        [0, 9.6, 4.4, 0, '#FFE4F0', '#FF5FA8', '#DB2777'],
      ];
      for (const [cx, cy, cr, rot, hi, mid, sh] of candies) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot + Math.sin(fx.now * 3.2 + cx) * 0.16);
        celShape(ctx, bumpyKonpeitoPath(cr), 1.15, -0.7, -0.7, hi, mid, sh, ink);
        ctx.restore();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // 6. FULL-SCREEN SAKUGA APOCALYPSE BLAST + <sakuga-treasure-chest>
  // =========================================================================
  const out = (t) => 1 - (1 - t) ** 3;
  const inn = (t) => t * t * t;

  function diamondGemPath(R) {
    const p = new Path2D();
    p.moveTo(0, -R * 1.15);
    p.lineTo(R * 0.88, 0);
    p.lineTo(0, R * 1.15);
    p.lineTo(-R * 0.88, 0);
    p.closePath();
    return p;
  }

  function fullScreenTreasureBlast(cx, cy, isSuperCharged = true) {
    const ink = '#1D1A4A';
    const voidInk = '#0B081D';

    // ── ACT I (0.00s -> 0.52s): FULL-SCREEN ABYSSAL BLACKOUT + GIANT RUNE IMPLOSION! ──
    const laserRays = Array.from({ length: 44 }, (_, i) => ({
      a: (i / 44) * TAU + rnd(-0.04, 0.04),
      w: rnd(4, 11),
      col: i % 3 === 0 ? '#FFFFFF' : (i % 2 === 0 ? '#FFE44D' : '#FF5FA8'),
    }));

    fx.spawn(0.54, (k, t, _dt, g) => {
      const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
      const maxD = Math.hypot(vw, vh) * 1.1;
      // Expanding dark void curtain swallowing 100% of the screen!
      const voidR = out(clamp(k / 0.36)) * maxD;
      g.fillStyle = voidInk;
      g.beginPath(); g.arc(cx, cy, voidR, 0, TAU); g.fill();

      // Giant spinning cel magic rings around chest
      const sealR = Math.min(vw, vh) * 0.42 * (1 - inn(clamp((k - 0.55) / 0.45)));
      if (sealR > 12) {
        g.save();
        g.translate(cx, cy);
        g.rotate(t * 7.5);
        g.strokeStyle = '#FF5FA8'; g.lineWidth = 6;
        g.beginPath(); g.arc(0, 0, sealR, 0, TAU); g.stroke();
        g.strokeStyle = '#FFE44D'; g.lineWidth = 4;
        for (let q = 0; q < 8; q++) {
          const a = (q / 8) * TAU;
          g.beginPath();
          g.arc(0, 0, sealR * 0.78, a, a + 0.48);
          g.stroke();
        }
        g.restore();
      }

      // 44 Tapered Energy Spears sucking inward from outside the monitor into (cx, cy)!
      const outer = maxD * (1 - inn(k) * 0.88);
      const inner = maxD * Math.max(0, 0.55 - out(k) * 0.65);
      for (const lr of laserRays) {
        const hw = lr.w * 0.68 * (1 - k * 0.4);
        const nx = -Math.sin(lr.a) * hw, ny = Math.cos(lr.a) * hw;
        const ox1 = cx + Math.cos(lr.a) * outer, oy1 = cy + Math.sin(lr.a) * outer;
        const ix1 = cx + Math.cos(lr.a) * inner, iy1 = cy + Math.sin(lr.a) * inner;
        g.fillStyle = lr.col;
        g.beginPath();
        g.moveTo(ox1 + nx, oy1 + ny);
        g.lineTo(ix1, iy1);
        g.lineTo(ox1 - nx, oy1 - ny);
        g.closePath();
        g.fill();
      }

      // Contracting white-hot singularity sphere at center
      const coreR = k < 0.75 ? lerp(18, 95, out(k / 0.75)) : lerp(95, 4, (k - 0.75) / 0.25);
      celShape(g, ellipsePath(cx, cy, coreR, coreR), 4, -6, -6, '#FFFFFF', '#FFE44D', '#FF5FA8', '#FFFFFF');
    });

    // Live crackling Sakuga lightning arcs converging into the chest during charge!
    for (let aIdx = 0; aIdx < 6; aIdx++) {
      later(aIdx * 65, () => {
        const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
        const ang = (aIdx / 6) * TAU + 0.35;
        const sx = cx + Math.cos(ang) * Math.max(vw, vh) * 0.68;
        const sy = cy + Math.sin(ang) * Math.max(vw, vh) * 0.68;
        lightningArc(sx, sy, cx, cy, {
          col: aIdx % 2 === 0 ? '#FFE44D' : '#FF5FA8',
          core: '#FFFFFF',
          ink: voidInk,
          width: 11,
          sway: 0.24,
          branches: 5,
          life: 0.24,
        });
      });
    }

    // ── ACT II (0.52s -> 0.70s): 3-FRAME FULL-SCREEN ANIME IMPACT FLASH (100% VIEWPORT!) ──
    later(520, () => {
      // Precompute 14 razor-tapered, branching Sakuga polygon lightning fissures (ZERO straight tubes!)
      const fissurePaths = Array.from({ length: 14 }, (_, i) => {
        const baseA = (i / 14) * TAU + rnd(-0.09, 0.09);
        return buildJaggedFissure(cx, cy, baseA, 1750, rnd(20, 36), 901 + i * 173, 1.0);
      });

      fx.spawn(0.19, (k, _t, _dt, g) => {
        const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
        if (k < 0.34) {
          // Frame A: 100% Blinding White Screen + Giant Branching Pitch-Black Sakuga Impact Lightning!
          g.fillStyle = '#FFFFFF';
          g.fillRect(ox - 20, oy - 20, vw + 40, vh + 40);
          g.save();
          g.translate(6, 6);
          g.fillStyle = '#FF2E7E';
          for (const fp of fissurePaths) g.fill(fp);
          g.restore();
          g.fillStyle = voidInk;
          for (const fp of fissurePaths) g.fill(fp);
        } else if (k < 0.68) {
          // Frame B: 100% Pitch-Black Screen + Edge-to-Edge Blinding Supernova Cross!
          g.fillStyle = voidInk;
          g.fillRect(ox - 20, oy - 20, vw + 40, vh + 40);
          g.fillStyle = '#FF2E7E';
          g.beginPath();
          g.moveTo(cx - 2200, cy - 95); g.lineTo(cx + 2200, cy + 95);
          g.lineTo(cx + 2200, cy - 95); g.lineTo(cx - 2200, cy + 95);
          g.closePath(); g.fill();
          g.fillStyle = '#FFFFFF';
          g.fillRect(ox - 20, cy - 48, vw + 40, 96);
          g.fillRect(cx - 48, oy - 20, 96, vh + 40);
        } else {
          // Frame C: 100% Solar Gold Flash!
          g.fillStyle = '#FFE44D';
          g.fillRect(ox - 20, oy - 20, vw + 40, vh + 40);
        }
      });
    });

    // ── ACT III (0.69s -> 3.10s): COLOSSAL SCREEN-COVERING FIREBALL & BILLOWING CLOUD WALL! ──
    later(690, () => {
      const ox0 = scrollX, oy0 = scrollY, vw0 = innerWidth, vh0 = innerHeight;
      const scx = ox0 + vw0 * 0.5, scy = oy0 + vh0 * 0.5;
      const fullR = Math.hypot(vw0, vh0) * 1.18;

      // 1. COLOSSAL 3-LAYER CEL-SHADED SUPERNOVA FIREBALL ENGULFING 100% OF THE SCREEN!
      const spikes = 26;
      const jag = Array.from({ length: spikes * 2 }, (_, i) => (i % 2 ? rnd(0.54, 0.72) : rnd(0.96, 1.28)));
      const makeMegaStar = (x0, y0, R, rotOff, hole = 1) => {
        const p = new Path2D();
        jag.forEach((m, i) => {
          const a = rotOff + (i / jag.length) * TAU;
          const rad = R * (i % 2 ? m * hole : m);
          p[i ? 'lineTo' : 'moveTo'](x0 + Math.cos(a) * rad, y0 + Math.sin(a) * rad);
        });
        p.closePath();
        return p;
      };

      fx.spawn(1.15, (k, t, _dt, g) => {
        const R = fullR * out(clamp(k / 0.28));
        const hollowOut = 1 + inn(clamp((k - 0.38) / 0.62)) * 1.45;
        if (k < 0.72) {
          // Outer Magenta-Crimson Plasma Starburst filling entire monitor
          const pOut = makeMegaStar(scx, scy, R * 1.12, t * 0.4, Math.min(1.65, hollowOut));
          g.fillStyle = '#FF2E7E'; g.fill(pOut);
          g.strokeStyle = ink; g.lineWidth = 12 * (1 - k); g.stroke(pOut);

          // Middle Solar-Orange Fireball Starburst
          const pMid = makeMegaStar(scx, scy, R * 0.92, -t * 0.35 + 0.14, Math.min(1.65, hollowOut));
          g.fillStyle = '#FF9F1C'; g.fill(pMid);
          g.strokeStyle = ink; g.lineWidth = 9 * (1 - k); g.stroke(pMid);

          // Inner Incandescent Cream-Gold Core
          const pIn = makeMegaStar(scx, scy, R * 0.72, t * 0.25, Math.min(1.65, hollowOut));
          celShape(g, pIn, Math.max(2, 7 * (1 - k)), -18, -22, '#FFFFFF', '#FFF3B0', '#FFE44D', ink);
        }
      });

      // 2. WALL-TO-WALL GIANT CEL-SHADED ANIME CUMULUS CLOUDS COVERING 100% OF THE SCREEN!
      // 30 colossal clouds (radius 190px - 410px each!) pack the entire viewport then part outward!
      const cloudBank = [];
      // Ring 1 + Ring 2 + Center Blanket so ZERO gap exists anywhere on screen!
      for (let i = 0; i < 30; i++) {
        const ringIdx = i < 6 ? 0 : (i < 16 ? 1 : 2);
        const a = (i / (ringIdx === 0 ? 6 : ringIdx === 1 ? 10 : 14)) * TAU + rnd(-0.2, 0.2);
        const startDist = ringIdx === 0 ? rnd(0, 120) : ringIdx === 1 ? rnd(160, Math.min(vw0, vh0) * 0.38) : rnd(Math.min(vw0, vh0) * 0.35, Math.max(vw0, vh0) * 0.58);
        const driftDist = rnd(260, 680);
        const baseR = rnd(185, 360);
        const subLobes = Array.from({ length: 5 }, (_, j) => ({
          la: (j / 5) * TAU + rnd(0.5),
          ld: baseR * rnd(0.32, 0.62),
          lr: baseR * rnd(0.52, 0.85),
        }));
        cloudBank.push({ a, startDist, driftDist, baseR, subLobes, spin: rnd(-0.6, 0.6) });
      }

      fx.spawn(1.95, (k, t, _dt, g) => {
        const grow = clamp(k / 0.14, 0, 1);
        const growCurve = 1 + 2.2 * (grow - 1) ** 3 + 1.2 * (grow - 1) ** 2;
        const partOut = inn(clamp((k - 0.32) / 0.68));
        const shrink = 1 - inn(clamp((k - 0.48) / 0.52));
        const sc = growCurve * shrink;
        if (sc < 0.04) return;

        for (const cb of cloudBank) {
          const dist = cb.startDist * out(clamp(k / 0.22)) + cb.driftDist * partOut;
          const px = scx + Math.cos(cb.a) * dist;
          const py = scy + Math.sin(cb.a) * dist * 0.82;
          const R = cb.baseR * sc;
          if (R < 6) continue;

          const u = new Path2D();
          u.moveTo(px + R, py);
          u.arc(px, py, R, 0, TAU);
          for (const sl of cb.subLobes) {
            const lx = px + Math.cos(sl.la + t * cb.spin) * sl.ld * sc;
            const ly = py + Math.sin(sl.la + t * cb.spin) * sl.ld * sc;
            const lr = sl.lr * sc;
            u.moveTo(lx + lr, ly);
            u.arc(lx, ly, lr, 0, TAU);
          }

          // Bold cel outline + 3-tone Sakuga Explosion Smoke (Cream top -> Rose-Gold mid -> Deep Violet shade!)
          g.save();
          g.lineWidth = Math.max(3, 12 * shrink);
          g.strokeStyle = ink;
          g.stroke(u);
          g.restore();

          g.save();
          g.clip(u);
          g.fillStyle = '#4C3B99';
          g.fillRect(px - R * 2.2, py - R * 2.2, R * 4.4, R * 4.4);
          g.save();
          g.translate(-R * 0.16, -R * 0.20);
          g.fillStyle = '#FBCFE8';
          g.fill(u);
          g.restore();
          g.save();
          g.translate(-R * 0.34, -R * 0.40);
          g.fillStyle = '#FFFDF7';
          g.fill(u);
          g.restore();
          g.restore();
        }
      });

      // 3. COLOSSAL CORNER-TO-CORNER CRESCENT SLASHES (2,200px LONG, 82px THICK!)
      slash(scx, scy, { len: fullR * 1.15, ang: -0.52, thick: 82, col: '#FF5FA8', life: 0.62 });
      slash(scx, scy, { len: fullR * 1.15, ang: 0.52, thick: 82, col: '#FFE44D', life: 0.62 });
      later(120, () => {
        slash(scx, scy, { len: fullR * 1.05, ang: 1.57, thick: 68, col: '#38BDF8', life: 0.58 });
        lightningArc(ox0 + 40, oy0 + 40, ox0 + vw0 - 40, oy0 + vh0 - 40, {
          col: '#FFE44D', core: '#FFFFFF', ink, width: 18, sway: 0.22, branches: 7, life: 0.58,
        });
        lightningArc(ox0 + vw0 - 40, oy0 + 40, ox0 + 40, oy0 + vh0 - 40, {
          col: '#FF5FA8', core: '#FFFFFF', ink, width: 18, sway: 0.22, branches: 7, life: 0.58,
        });
      });

      // 4. DELUGE OF 80 GIANT (24px - 52px!) CEL-SHADED TREASURES RAINING ACROSS 100% OF VIEWPORT!
      const itemCount = isSuperCharged ? 84 : 56;
      for (let i = 0; i < itemCount; i++) {
        const ang = (i / itemCount) * TAU + rnd(-0.15, 0.15);
        const spd = rnd(320, Math.max(980, fullR * 0.85));
        const vx = Math.cos(ang) * spd;
        const vy = Math.sin(ang) * spd - rnd(180, 420);
        const spin = (i % 2 ? 1 : -1) * rnd(5, 11);
        const kind = i % 3;
        const sz = rnd(20, 44);
        const gemMid = i % 2 === 0 ? '#38BDF8' : '#FF5FA8';
        const gemDark = i % 2 === 0 ? '#0284C7' : '#BE185D';

        fx.spawn(rnd(1.8, 2.7), (k, t, _dt, g) => {
          const die = 1 - inn(clamp((k - 0.70) / 0.30));
          if (die < 0.08) return;
          const px = scx + vx * t;
          const py = scy + vy * t + 680 * t * t;
          g.save();
          g.translate(px, py);
          if (kind === 0) {
            const flip = Math.max(0.24, Math.abs(Math.cos(spin * t)));
            g.scale(die * flip, die);
            celShape(g, ellipsePath(0, 0, sz * 0.82, sz), 2.4, -3.5, -3.5, '#FFFBEB', '#FACC15', '#CA8A04', ink);
            g.strokeStyle = ink; g.lineWidth = 2.2;
            g.beginPath(); g.moveTo(0, -sz * 0.45); g.lineTo(0, sz * 0.45); g.stroke();
          } else if (kind === 1) {
            g.rotate(spin * 0.6 * t);
            g.scale(die, die);
            celShape(g, diamondGemPath(sz), 2.4, -3.5, -3.5, '#FFFFFF', gemMid, gemDark, ink);
          } else {
            g.rotate(spin * 0.75 * t);
            g.scale(die, die);
            celShape(g, fiveStarPath(sz * 1.05, sz * 0.48), 2.4, -3.5, -3.5, '#FFF9C4', '#FFE44D', '#F59E0B', ink);
          }
          g.restore();
        });
      }

      // 5. TITANIC SCREEN-SPANNING VIETNAMESE MANGA BANNER RIGHT ACROSS THE MONITOR!
      const bannerWidth = Math.min(1140, Math.round(vw0 * 0.84));
      sfx('ĐẠI BÙNG NỔ!!', scx, scy - vh0 * 0.06, {
        size: bannerWidth, rot: -0.07, life: 1.95, col: '#FFE44D', edge: ink,
      });

      later(320, () => {
        sfx('SIÊU KHO BÁU!!', scrollX + innerWidth * 0.5, scrollY + innerHeight * 0.64, {
          size: Math.min(820, Math.round(innerWidth * 0.62)), rot: 0.05, life: 1.75, col: '#FF5FA8', edge: ink,
        });
      });

      // Secondary corner mega-bursts as the cloud curtain parts!
      const corners = [
        [0.18, 0.22, 'BÙM!!', '#FF5FA8', 220],
        [0.82, 0.22, 'CHẤN ĐỘNG!!', '#38BDF8', 380],
        [0.20, 0.78, 'XOẸT!!', '#FFE44D', 540],
        [0.82, 0.76, 'GIÀU TO!!', '#FF5FA8', 700],
      ];
      corners.forEach(([fxPct, fyPct, wTxt, col, dMs], idx) => {
        later(dMs, () => {
          const bx = scrollX + innerWidth * fxPct;
          const by = scrollY + innerHeight * fyPct;
          burst(bx, by, { r: 195, spikes: 16, life: 0.55 });
          sfx(wTxt, bx, by, { size: 280, rot: idx % 2 ? 0.12 : -0.12, life: 1.15, col, edge: ink });
        });
      });
    });
  }

  class SakugaTreasureChest extends CuteMascotBase {
    initSprings() {
      this.lidOpen = new Spring(0, 380, 12);
      this.squash = new Spring(0, 480, 11);
      this.lockGlow = new Spring(0, 340, 15);
      this.sealsCount = 0;
      this.isOpened = false;
      return [this.lidOpen, this.squash, this.lockGlow];
    }

    setSeals(count) {
      this.sealsCount = clamp(count, 0, 4);
      this.lockGlow.to = this.sealsCount / 4;
      this.squash.v = 6.5;
      this.dirty = true;
    }

    frame(dt) {
      if ((this.sealsCount >= 4 || this.isOpened) && this.inView) {
        this.dirty = true; // animate ready-rumble & open-treasure glints!
      }
      super.frame(dt);
    }

    detonateChest() {
      if (this._detonating) return;
      this._detonating = true;
      const c = at(this.stageEl);
      this.cutUntil = fx.now + 2.4;

      // Compress chest tightly for 0.44s before blowing wide open!
      this.lidOpen.to = 0;
      this.squash.to = -0.85;
      this.dirty = true;
      window.MultiverseSFX?.megaExplosion();
      this.emit('chest-charging', {});

      fullScreenTreasureBlast(c.x, c.y, this.sealsCount >= 4);

      later(690, () => {
        this.isOpened = true;
        this.squash.to = 0.45;
        this.squash.v = 16;
        this.lidOpen.to = 1;
        this.lidOpen.v = 14;
        this.dirty = true;
        this.emit('chest-exploded', { superCharged: this.sealsCount >= 4 });
      });

      later(1150, () => {
        this.squash.to = 0;
        this.dirty = true;
      });

      later(2850, () => {
        this._detonating = false;
      });
    }

    playCut(kind = 'loop') {
      if (fx.calm) return;
      if (kind === 'click') {
        this.detonateChest();
        return;
      }
      this.cutUntil = fx.now + 1.1;
      this.squash.v = this.sealsCount >= 4 ? 9.5 : 5.0;
      const c = at(this.stageEl);
      if (this.isOpened || this.sealsCount >= 4) {
        kira(c.x + rnd(-48, 48), c.y - rnd(20, 56), { r: 10, col: '#FFE44D' });
      }
      this.dirty = true;
    }

    drawMascot(ctx, sz, cw, ch) {
      const unit = sz / 48;
      ctx.save();
      ctx.translate(cw * 0.5, ch * 0.58);
      ctx.scale(unit, unit);
      ctx.lineJoin = ctx.lineCap = 'round';
      const ink = '#24140E';
      const op = clamp(this.lidOpen.x, 0, 1.35);
      const sq = this.squash.x;
      const readyJitter = (!this.isOpened && this.sealsCount >= 4) ? Math.sin(fx.now * 38) * 0.85 : 0;

      ctx.fillStyle = 'rgba(29, 26, 74, 0.19)';
      ctx.beginPath(); ctx.ellipse(0, 18.2, 20.5, 3.4, 0, 0, TAU); ctx.fill();

      ctx.translate(readyJitter, 16.5 - this.hoverLift.x * 1.2);
      const sy = clamp(1 + sq * 0.26, 0.65, 1.38);
      ctx.scale(1 / Math.sqrt(sy), sy);
      ctx.translate(0, -16.5);

      // Radiant Golden Aura + 4 Floating Elemental Seal Gems Behind/Around Chest!
      if (this.sealsCount >= 4 || op > 0.2) {
        ctx.save();
        ctx.translate(0, 1.5);
        ctx.rotate(fx.now * 1.4);
        celShape(ctx, fiveStarPath(22.2, 13.8), 1.25, 0, 0, '#FFFBEB', '#FFE44D', '#F59E0B', ink);
        ctx.restore();
      }
      const sealCols = ['#FFE44D', '#38BDF8', '#FF5FA8', '#10B981'];
      for (let i = 0; i < this.sealsCount; i++) {
        const a = -Math.PI * 0.85 + (i / 3) * Math.PI * 0.70;
        const gx = Math.cos(a) * 21.5;
        const gy = -2.0 + Math.sin(a) * 14.5 + Math.sin(fx.now * 4 + i) * 1.1;
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(fx.now * 2 + i);
        celShape(ctx, diamondGemPath(2.4), 1.0, -0.4, -0.4, '#FFFFFF', sealCols[i], '#1E1B4B', ink);
        ctx.restore();
      }

      // Horned Golden Side Handles / Dragon Claws (Contour Breakers!)
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(side * 18.2, 8.2);
        ctx.scale(side, 1);
        const horn = new Path2D();
        horn.moveTo(-1, -3.5);
        horn.quadraticCurveTo(4.8, -5.2, 4.5, -0.8);
        horn.quadraticCurveTo(4.2, 3.8, -1, 3.5);
        horn.closePath();
        celShape(ctx, horn, 1.35, -0.6, -0.6, '#FFE033', '#D97706', '#78350F', ink);
        ctx.restore();
      }

      // ── 1. Chest Lower Crimson-Oak Box + Wood Plank Grooves + Riveted Golden Straps ──
      const baseBox = roundRectPath(-17.8, 1.5, 35.6, 15.4, 3.2);
      celShape(ctx, baseBox, 1.9, -3.2, -2.6, '#B45309', '#78350F', '#3E1604', ink);
      // Wood plank horizontal grooves
      ctx.strokeStyle = '#24140E'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-16.5, 6.8); ctx.lineTo(16.5, 6.8);
      ctx.moveTo(-16.5, 11.8); ctx.lineTo(16.5, 11.8);
      ctx.stroke();
      // Golden Corner & Center Straps + Stud Rivets
      for (const sx of [-15.8, -2.6, 11.0]) {
        const w = sx === -2.6 ? 5.2 : 4.8;
        celShape(ctx, roundRectPath(sx, 1.5, w, 15.4, 1.2), 1.4, -0.8, -1.0, '#FFE033', '#D97706', '#78350F', ink);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(sx + w * 0.5, 4.5, 0.85, 0, TAU);
        ctx.arc(sx + w * 0.5, 14.0, 0.85, 0, TAU);
        ctx.fill();
      }

      // ── 2. Overflowing Mountain of Gold, Gems & Crown Inside When Open! ──
      if (op > 0.08) {
        ctx.save();
        ctx.translate(0, 2.2);
        ctx.scale(1, Math.min(1.18, op));
        celShape(ctx, ellipsePath(0, -1.6, 15.6, 7.2), 1.45, -2, -2, '#FFE44D', '#F59E0B', '#B45309', ink);
        ctx.save(); ctx.translate(-7.2, -4.8); ctx.rotate(-0.32);
        celShape(ctx, diamondGemPath(4.8), 1.35, -1, -1, '#38BDF8', '#0284C7', '#1E3A8A', ink);
        ctx.restore();
        ctx.save(); ctx.translate(7.2, -4.5); ctx.rotate(0.34);
        celShape(ctx, diamondGemPath(4.7), 1.35, -1, -1, '#FF3B7F', '#BE185D', '#831843', ink);
        ctx.restore();
        ctx.save(); ctx.translate(0, -7.2 + Math.sin(fx.now * 6) * 0.8);
        celShape(ctx, fiveStarPath(5.8, 2.6), 1.4, -1, -1, '#FFE44D', '#F59E0B', '#B45309', ink);
        ctx.restore();
        ctx.restore();
      }

      // ── 3. Royal Crimson-Domed Chest Lid + Winged Dragon Crest Lock! ──
      ctx.save();
      ctx.translate(0, 1.8 - op * 8.6);
      ctx.scale(1, clamp(1 - op * 0.32, 0.55, 1));
      const lid = new Path2D();
      lid.moveTo(-18.5, 1.5);
      lid.bezierCurveTo(-18.5, -12.8, 18.5, -12.8, 18.5, 1.5);
      lid.closePath();
      celShape(ctx, lid, 1.9, -3.4, -3.4, '#E11D48', '#9F1239', '#4C0519', ink);
      ctx.fillStyle = '#FDA4AF';
      ctx.beginPath(); ctx.ellipse(-7.5, -6.5, 3.2, 1.1, -0.25, 0, TAU); ctx.fill();

      for (const sx of [-13.6, 0, 13.6]) {
        celShape(ctx, roundRectPath(sx - 2.4, -9.5, 4.8, 11.0, 1.4), 1.35, -0.8, -1.0, '#FFE033', '#D97706', '#78350F', ink);
      }

      if (op < 0.55) {
        // Winged Golden Lock Escutcheon!
        for (const side of [-1, 1]) {
          const lw = new Path2D();
          lw.moveTo(side * 4.0, -0.5);
          lw.quadraticCurveTo(side * 9.2, -3.8, side * 9.8, -1.2);
          lw.quadraticCurveTo(side * 7.8, 2.2, side * 4.0, 3.2);
          lw.closePath();
          celShape(ctx, lw, 1.2, -0.5, -0.5, '#FFE033', '#D97706', '#78350F', ink);
        }
        celShape(ctx, roundRectPath(-5.0, -2.5, 10.0, 9.0, 2.8), 1.55, -1.0, -1.0, '#FFE033', '#D97706', '#78350F', ink);
        const gemReady = this.sealsCount >= 4;
        ctx.save();
        ctx.translate(0, 2.0);
        celShape(
          ctx,
          diamondGemPath(3.1),
          1.25, -0.6, -0.6,
          gemReady ? '#10B981' : '#FF2E7E',
          gemReady ? '#047857' : '#BE123C',
          gemReady ? '#064E3B' : '#4C0519',
          ink
        );
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(-0.8, -1.0, 0.75, 0, TAU); ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      ctx.restore();
    }
  }

  fx.fullScreenTreasureBlast = fullScreenTreasureBlast;
  fx.define('sakuga-pikachu', SakugaPikachu);
  fx.define('sakuga-pokeball', SakugaPokeball);
  fx.define('sakuga-kirby', SakugaKirby);
  fx.define('sakuga-king-slime', SakugaKingSlime);
  fx.define('sakuga-soot', SakugaSoot);
  fx.define('sakuga-treasure-chest', SakugaTreasureChest);
})();
