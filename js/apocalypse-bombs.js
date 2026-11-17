// Arsenal of 4 God-Tier ("Bố Đời") Full-Screen Sakuga Apocalypse Bombs (<sakuga-mega-bomb>)
// Upgraded with ultra-detailed, organic, multi-layered Act-1 Charge Choreography (ZERO flat rectangles or stiff lines!):
//   1. type="void"    — Bom Hố Đen Vũ Trụ (Purple #B517FF x Emerald #00FF9D x Dimension Glass Shatter)
//   2. type="crimson" — Bom Hạt Nhân Hỏa Ngục (Intricate Hexagram Runes + Helical Dragon-Fire Lance + Lava Splash Crown + Magma Fissures)
//   3. type="cyber"   — Bom Bão Từ 1 Tỷ Volt (Segmented HUD Lock-On + Corner-to-Core Tesla Arcs + 28-Arc Thunder Cage)
//   4. type="chaos"   — Bom Hỗn Mang Neon (Curved Crescent Whip-Slashes + Multi-Drop Graffiti Paint Splatters + Sawtooth Vortex)
(() => {
  'use strict';
  const fx = window.SakugaFX;
  const {
    TAU, clamp, lerp, rnd, later, at, Spring,
    celShape, roundRectPath, ellipsePath, fiveStarPath,
    lightningArc, drawMiniBolt, buildJaggedFissure,
    burst, puff, shards, slash, sfx, CuteMascotBase,
  } = fx;
  const out = (t) => 1 - (1 - t) ** 3;
  const inn = (t) => t * t * t;
  const back = (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;

  function hexPath(cx, cy, R, rot = 0) {
    const p = new Path2D();
    for (let i = 0; i < 6; i++) {
      const a = rot + (i / 6) * TAU;
      p[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    }
    p.closePath();
    return p;
  }

  // Intricate Sacred Magic Circle (Drawn in local flat coords; wrap with g.scale(1, 0.30) for 3D perspective!)
  function drawSacredMagicArray(g, R, rot, colMain, colSub, colCore) {
    g.save();
    g.rotate(rot);

    // Outer double rim
    g.strokeStyle = colMain;
    g.lineWidth = 4.5;
    g.beginPath();
    g.arc(0, 0, R, 0, TAU);
    g.stroke();

    g.strokeStyle = colSub;
    g.lineWidth = 2.4;
    g.beginPath();
    g.arc(0, 0, R * 0.86, 0, TAU);
    g.arc(0, 0, R * 0.46, 0, TAU);
    g.stroke();

    // 24 Radial Rune Degree Ticks between 0.86R and 1.0R
    g.strokeStyle = colCore;
    g.lineWidth = 2.2;
    g.beginPath();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * TAU;
      const r0 = i % 2 === 0 ? R * 0.82 : R * 0.88;
      g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
      g.lineTo(Math.cos(a) * R * 0.98, Math.sin(a) * R * 0.98);
    }
    g.stroke();

    // Interwoven 6-Pointed Hexagram Star (2 Equilateral Triangles!)
    g.strokeStyle = colSub;
    g.lineWidth = 3.0;
    for (const offset of [0, Math.PI / 3]) {
      g.beginPath();
      for (let i = 0; i <= 3; i++) {
        const a = offset + (i / 3) * TAU;
        const px = Math.cos(a) * R * 0.85;
        const py = Math.sin(a) * R * 0.85;
        g[i ? 'lineTo' : 'moveTo'](px, py);
      }
      g.stroke();
    }

    // 6 Orbiting Flame Rune Nodes on Hexagram Vertices
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      const nx = Math.cos(a) * R * 0.85;
      const ny = Math.sin(a) * R * 0.85;
      g.fillStyle = colMain;
      g.beginPath(); g.arc(nx, ny, 7.5, 0, TAU); g.fill();
      g.fillStyle = colCore;
      g.beginPath(); g.arc(nx, ny, 3.8, 0, TAU); g.fill();
    }

    g.restore();
  }

  // Organic Cel-Shaded Paint / Magma Splatter Blob (Multi-lobe + flying droplets — zero stiff geometry!)
  function buildSplatterPath(cx, cy, R, lobes) {
    const p = new Path2D();
    p.moveTo(cx + R, cy);
    p.arc(cx, cy, R, 0, TAU);
    for (const [ang, distM, radM] of lobes) {
      const lx = cx + Math.cos(ang) * R * distM;
      const ly = cy + Math.sin(ang) * R * distM;
      const lr = R * radM;
      if (lr > 1.2) {
        p.moveTo(lx + lr, ly);
        p.arc(lx, ly, lr, 0, TAU);
      }
    }
    return p;
  }

  // Wall-to-Wall 32-Cloud Full-Screen Sakuga Blanket
  function spawnFullScreenCloudWall({ scx, scy, vw, vh, hi, mid, shade, ink, life = 1.95, swirl = 1 }) {
    const clouds = [];
    for (let i = 0; i < 32; i++) {
      const ringIdx = i < 6 ? 0 : (i < 16 ? 1 : 2);
      const a = (i / (ringIdx === 0 ? 6 : ringIdx === 1 ? 10 : 16)) * TAU + rnd(-0.18, 0.18);
      const startDist = ringIdx === 0 ? rnd(0, 110) : ringIdx === 1 ? rnd(150, Math.min(vw, vh) * 0.38) : rnd(Math.min(vw, vh) * 0.34, Math.max(vw, vh) * 0.60);
      const driftDist = rnd(280, 720);
      const baseR = rnd(190, 370);
      const subLobes = Array.from({ length: 5 }, (_, j) => ({
        la: (j / 5) * TAU + rnd(0.5),
        ld: baseR * rnd(0.32, 0.62),
        lr: baseR * rnd(0.52, 0.86),
      }));
      const pickMid = Array.isArray(mid) ? mid[i % mid.length] : mid;
      const pickShade = Array.isArray(shade) ? shade[i % shade.length] : shade;
      const pickHi = Array.isArray(hi) ? hi[i % hi.length] : hi;
      clouds.push({ a, startDist, driftDist, baseR, subLobes, spin: rnd(-0.8, 0.8) * swirl, pickHi, pickMid, pickShade });
    }

    fx.spawn(life, (k, t, _dt, g) => {
      const grow = clamp(k / 0.13, 0, 1);
      const growCurve = 1 + 2.2 * (grow - 1) ** 3 + 1.2 * (grow - 1) ** 2;
      const partOut = inn(clamp((k - 0.32) / 0.68));
      const shrink = 1 - inn(clamp((k - 0.48) / 0.52));
      const sc = growCurve * shrink;
      if (sc < 0.04) return;

      for (const cb of clouds) {
        const curA = cb.a + partOut * 0.25 * swirl;
        const dist = cb.startDist * out(clamp(k / 0.20)) + cb.driftDist * partOut;
        const px = scx + Math.cos(curA) * dist;
        const py = scy + Math.sin(curA) * dist * 0.84;
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

        g.save();
        g.lineWidth = Math.max(3, 12 * shrink);
        g.strokeStyle = ink;
        g.stroke(u);
        g.restore();

        g.save();
        g.clip(u);
        g.fillStyle = cb.pickShade;
        g.fillRect(px - R * 2.2, py - R * 2.2, R * 4.4, R * 4.4);
        g.save();
        g.translate(-R * 0.16, -R * 0.20);
        g.fillStyle = cb.pickMid;
        g.fill(u);
        g.restore();
        g.save();
        g.translate(-R * 0.34, -R * 0.40);
        g.fillStyle = cb.pickHi;
        g.fill(u);
        g.restore();
        g.restore();
      }
    });
  }

  // Colossal Multi-Spike Supernova Dome Covering 100% of Viewport
  function spawnMegaStarDome({ scx, scy, fullR, colOuter, colMid, colInner, ink, life = 1.05 }) {
    const spikes = 28;
    const jag = Array.from({ length: spikes * 2 }, (_, i) => (i % 2 ? rnd(0.55, 0.74) : rnd(0.98, 1.30)));
    const build = (R, rot, hole) => {
      const p = new Path2D();
      jag.forEach((m, i) => {
        const a = rot + (i / jag.length) * TAU;
        const rad = R * (i % 2 ? m * hole : m);
        p[i ? 'lineTo' : 'moveTo'](scx + Math.cos(a) * rad, scy + Math.sin(a) * rad);
      });
      p.closePath();
      return p;
    };
    fx.spawn(life, (k, t, _dt, g) => {
      if (k > 0.75) return;
      const R = fullR * out(clamp(k / 0.25));
      const hole = 1 + inn(clamp((k - 0.35) / 0.65)) * 1.45;
      const p1 = build(R * 1.15, t * 0.45, Math.min(1.65, hole));
      g.fillStyle = colOuter; g.fill(p1);
      g.strokeStyle = ink; g.lineWidth = 11 * (1 - k); g.stroke(p1);

      const p2 = build(R * 0.92, -t * 0.35 + 0.12, Math.min(1.65, hole));
      g.fillStyle = colMid; g.fill(p2);
      g.strokeStyle = ink; g.lineWidth = 8 * (1 - k); g.stroke(p2);

      const p3 = build(R * 0.70, t * 0.25, Math.min(1.65, hole));
      celShape(g, p3, Math.max(2, 6 * (1 - k)), -16, -20, '#FFFFFF', colInner, colMid, ink);
    });
  }

  // =========================================================================
  // 1. ABYSSAL SINGULARITY ("BOM HỐ ĐEN VŨ TRỤ" — #B517FF x #00FF9D)
  // =========================================================================
  function detonateVoidBomb(cx, cy) {
    const ink = '#070212';
    window.MultiverseSFX?.voidBlast();

    const spirals = Array.from({ length: 38 }, (_, i) => ({
      a0: (i / 38) * TAU,
      r0: rnd(300, 1450),
      col: i % 2 === 0 ? '#B517FF' : '#00FF9D',
    }));
    fx.spawn(0.56, (k, _t, _dt, g) => {
      const vw = innerWidth, vh = innerHeight;
      const maxD = Math.hypot(vw, vh) * 1.1;
      g.fillStyle = ink;
      g.beginPath(); g.arc(cx, cy, out(clamp(k / 0.32)) * maxD, 0, TAU); g.fill();

      for (const sp of spirals) {
        const curR = sp.r0 * (1 - inn(k));
        const curA = sp.a0 + k * 4.8;
        g.strokeStyle = sp.col;
        g.lineWidth = 5 * (1 - k * 0.5);
        g.beginPath();
        g.arc(cx, cy, Math.max(4, curR), curA, curA + 0.55);
        g.stroke();
      }
      const hR = lerp(190, 6, inn(k));
      celShape(g, ellipsePath(cx, cy, hR * 2.2, hR * 0.55, -0.22), 3, 0, -4, '#00FF9D', '#B517FF', '#000000', '#FFFFFF');
      celShape(g, ellipsePath(cx, cy, hR, hR), 4, -4, -4, '#000000', '#000000', '#B517FF', '#00FF9D');
    });

    later(550, () => {
      const shardPolys = Array.from({ length: 20 }, (_, i) => {
        const a1 = (i / 20) * TAU, a2 = ((i + 1) / 20) * TAU;
        return [a1, a2, i % 3 === 0 ? '#00FF9D' : i % 3 === 1 ? '#B517FF' : '#FFFFFF'];
      });
      fx.spawn(0.19, (k, _t, _dt, g) => {
        const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
        g.fillStyle = k < 0.5 ? '#00FF9D' : ink;
        g.fillRect(ox - 20, oy - 20, vw + 40, vh + 40);
        for (const [a1, a2, col] of shardPolys) {
          const push = k * 90;
          const midA = (a1 + a2) * 0.5;
          const px = cx + Math.cos(midA) * push, py = cy + Math.sin(midA) * push;
          g.fillStyle = k < 0.5 ? ink : col;
          g.strokeStyle = '#00FF9D'; g.lineWidth = 5;
          g.beginPath();
          g.moveTo(px, py);
          g.lineTo(px + Math.cos(a1) * 1800, py + Math.sin(a1) * 1800);
          g.lineTo(px + Math.cos(a2) * 1800, py + Math.sin(a2) * 1800);
          g.closePath();
          g.fill(); g.stroke();
        }
      });
    });

    later(720, () => {
      const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
      const scx = ox + vw * 0.5, scy = oy + vh * 0.5;
      const fullR = Math.hypot(vw, vh) * 1.18;

      spawnMegaStarDome({ scx, scy, fullR, colOuter: '#7B00FF', colMid: '#00FF9D', colInner: '#E0AAFF', ink });
      spawnFullScreenCloudWall({
        scx, scy, vw, vh,
        hi: ['#E0FFFA', '#F3E8FF'],
        mid: ['#00FF9D', '#B517FF'],
        shade: ['#1E0538', '#082E26'],
        ink, swirl: 1.6,
      });

      slash(scx, scy, { len: fullR * 1.2, ang: -0.45, thick: 90, col: '#00FF9D', life: 0.65 });
      slash(scx, scy, { len: fullR * 1.2, ang: 0.45, thick: 90, col: '#B517FF', life: 0.65 });

      for (let i = 0; i < 65; i++) {
        const a = (i / 65) * TAU + rnd(-0.1, 0.1), spd = rnd(350, 1300);
        const sz = rnd(18, 44), col = i % 2 === 0 ? '#00FF9D' : '#B517FF';
        fx.spawn(rnd(1.6, 2.5), (k, t, _dt, g) => {
          const sc = 1 - inn(clamp((k - 0.65) / 0.35));
          if (sc < 0.08) return;
          g.save();
          g.translate(scx + Math.cos(a) * spd * t, scy + Math.sin(a) * spd * t);
          g.rotate(t * 7); g.scale(sc, sc);
          celShape(g, hexPath(0, 0, sz), 2.2, -3, -3, '#FFFFFF', col, ink, ink);
          g.restore();
        });
      }

      sfx('HỐ ĐEN HỦY DIỆT!!', scx, scy - vh * 0.06, {
        size: Math.min(1140, Math.round(vw * 0.84)), rot: -0.06, life: 2.0, col: '#00FF9D', edge: ink,
      });
      later(300, () => {
        sfx('XÉ TOẠC KHÔNG GIAN!!', scrollX + innerWidth * 0.5, scrollY + innerHeight * 0.65, {
          size: Math.min(860, Math.round(innerWidth * 0.65)), rot: 0.05, life: 1.75, col: '#D8B4FE', edge: ink,
        });
      });
    });
  }

  // =========================================================================
  // 2. CRIMSON HELLFIRE NUKE ("BOM HẠT NHÂN HỎA NGỤC" — UPGRADED ORGANIC SAKUGA!)
  //    Zero flat rectangles! Features:
  //    - Branching glowing Magma Ground Fissures spreading from the bomb
  //    - 3 Intricate Counter-Rotating Hexagram Sacred Flame Arrays in 3D perspective
  //    - Undulating Dragon-Fire Plasma Lance + Twin Spiraling Helical Flame Ribbons
  //    - Roaring Molten Lava Impact Splash Crown + Billowing Smoke Rings at (cx, cy)!
  // =========================================================================
  function detonateCrimsonBomb(cx, cy) {
    const ink = '#140407';
    window.MultiverseSFX?.crimsonNuke();

    // Precompute 14 jagged branching Magma Ground Fissures radiating from (cx, cy)
    const fissureSpecs = Array.from({ length: 14 }, (_, i) => ({
      ang: (i / 14) * TAU + rnd(-0.12, 0.12),
      len: rnd(620, 1280),
      hw: rnd(10, 18),
      seed: 511 + i * 137,
    }));

    // Precompute 34 Rising Ember Sparks during the 0.60s charge!
    const chargeEmbers = Array.from({ length: 34 }, () => ({
      dx: rnd(-520, 520),
      dy: rnd(-120, 260),
      spdY: rnd(260, 680),
      r: rnd(3.5, 9.5),
      phase: rnd(TAU),
    }));

    // Act 1 (0.00s - 0.60s): SACRED HEXAGRAM ARRAYS + SPIRALING DRAGON-FIRE LANCE + LAVA IMPACT CROWN!
    fx.spawn(0.61, (k, t, _dt, g) => {
      const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
      const maxD = Math.hypot(vw, vh) * 1.12;

      // 1. Expanding Scorched Obsidian Crater Dome
      g.fillStyle = '#0F0306';
      g.beginPath();
      g.arc(cx, cy, out(clamp(k / 0.26)) * maxD, 0, TAU);
      g.fill();

      // 2. Tapered, Spiky, Branching Molten Magma Polygon Fissures Cracking Across the Ground!
      const fReach = out(clamp(k / 0.46));
      if (fReach > 0.06) {
        const pulseW = 0.80 + 0.25 * Math.sin(t * 28);
        for (const fs of fissureSpecs) {
          const outerF = buildJaggedFissure(cx, cy, fs.ang, fs.len, fs.hw * pulseW, fs.seed, fReach);
          const innerF = buildJaggedFissure(cx, cy, fs.ang, fs.len, fs.hw * pulseW * 0.44, fs.seed, fReach);
          g.strokeStyle = '#FF003C';
          g.lineWidth = 4.5;
          g.stroke(outerF);
          g.fillStyle = '#FF7B00';
          g.fill(outerF);
          g.fillStyle = '#FFFDF0';
          g.fill(innerF);
        }
      }

      // 3. Rising Glowing Ash & Flame Embers
      for (const em of chargeEmbers) {
        const ex = cx + em.dx + Math.sin(t * 9 + em.phase) * 18;
        const ey = cy + em.dy - t * em.spdY;
        const er = em.r * out(clamp(k / 0.25));
        celShape(g, fiveStarPath(er * 1.3, er * 0.5), 1.0, 0, 0, '#FFFFFF', '#FFD000', '#FF003C', ink);
      }

      // 4. Three Counter-Rotating Intricate Hexagram Magic Circles in 3D Perspective!
      const tiers = [
        [oy + vh * 0.14, Math.min(vw * 0.44, 480), 1.0],
        [oy + vh * 0.32, Math.min(vw * 0.33, 350), -1.35],
        [cy, Math.min(vw * 0.38, 410), 1.6], // Ground target seal right under the bomb!
      ];
      tiers.forEach(([ty, rad, dir], idx) => {
        const openSc = back(clamp((k - idx * 0.06) / 0.28));
        if (openSc <= 0.05) return;
        g.save();
        g.translate(cx, ty);
        g.scale(openSc, openSc * 0.29); // 3D tilted magic perspective!
        drawSacredMagicArray(g, rad, t * 2.8 * dir, '#FF003C', '#FF7B00', '#FFF3B0');
        g.restore();
      });

      // 5. Organic Roaring Dragon-Fire Plasma Lance + Twin Spiraling Helical Ribbons + Impact Splash Crown!
      if (k > 0.18) {
        const bk = clamp((k - 0.18) / 0.82);
        const topY = oy - 40;
        const hitY = lerp(topY, cy, out(clamp(bk / 0.28)));
        const baseHalfW = lerp(10, 96, out(bk));

        // Build undulating jagged plasma beam contour (NEVER a flat rectangle!)
        const buildFlameStream = (widthMul, waveAmp) => {
          const p = new Path2D();
          const N = 26;
          for (let i = 0; i <= N; i++) {
            const u = i / N;
            const y = lerp(topY, hitY, u);
            // Flares wider near top & flares dramatically into impact crater at bottom!
            const flare = 1 + Math.pow(u, 3) * 0.55 + Math.sin(u * 16 - t * 38) * 0.18;
            const w = baseHalfW * widthMul * flare + Math.sin(u * 29 - t * 45) * waveAmp;
            p[i ? 'lineTo' : 'moveTo'](cx - w, y);
          }
          for (let i = N; i >= 0; i--) {
            const u = i / N;
            const y = lerp(topY, hitY, u);
            const flare = 1 + Math.pow(u, 3) * 0.55 + Math.cos(u * 15 - t * 36) * 0.18;
            const w = baseHalfW * widthMul * flare + Math.cos(u * 27 - t * 42) * waveAmp;
            p.lineTo(cx + w, y);
          }
          p.closePath();
          return p;
        };

        // Outer Crimson Plasma Sheath -> Mid Magma -> White-Hot Jagged Core!
        const outerStream = buildFlameStream(1.32, 14);
        g.fillStyle = '#FF003C'; g.fill(outerStream);
        g.strokeStyle = ink; g.lineWidth = 5; g.stroke(outerStream);

        const midStream = buildFlameStream(0.88, 10);
        g.fillStyle = '#FF7B00'; g.fill(midStream);

        const coreStream = buildFlameStream(0.46, 6);
        g.fillStyle = '#FFFDF2'; g.fill(coreStream);

        // Twin Intertwining Helical Fire Dragon Ribbons Spiraling Down the Beam!
        for (const phaseOff of [0, Math.PI]) {
          g.strokeStyle = phaseOff === 0 ? '#FFE600' : '#FF003C';
          g.lineWidth = 14;
          g.beginPath();
          for (let i = 0; i <= 32; i++) {
            const u = i / 32;
            const y = lerp(topY, hitY, u);
            const x = cx + Math.sin(u * 11 - t * 24 + phaseOff) * (baseHalfW * 1.48);
            g[i ? 'lineTo' : 'moveTo'](x, y);
          }
          g.stroke();
          g.strokeStyle = '#FFFFFF';
          g.lineWidth = 4.5;
          g.stroke();
        }

        // Roaring Molten Impact Splash Crown at hitY (Hides the bottom edge completely in explosive magma tongues!)
        if (bk > 0.22) {
          const crSc = back(clamp((bk - 0.22) / 0.35)) * (1 + bk * 0.35);
          const crown = new Path2D();
          const CW = 155 * crSc;
          crown.moveTo(cx - CW, cy + 18);
          const tongues = [
            [-0.95, 95], [-0.68, 145], [-0.40, 110], [-0.15, 175],
            [0.15, 170], [0.42, 115], [0.70, 150], [0.96, 92],
          ];
          tongues.forEach(([ux, hPeak], idx) => {
            const wobH = hPeak * crSc * (0.85 + 0.22 * Math.sin(t * 32 + idx * 1.7));
            const tx = cx + ux * CW * 1.28;
            const ty = cy - wobH;
            const bxMid = cx + ux * CW * 0.85;
            crown.quadraticCurveTo(bxMid - 18, cy - wobH * 0.25, tx, ty);
            crown.quadraticCurveTo(bxMid + 18, cy - wobH * 0.25, cx + (ux + 0.14) * CW, cy + 12);
          });
          crown.lineTo(cx + CW, cy + 18);
          crown.quadraticCurveTo(cx, cy + 46 * crSc, cx - CW, cy + 18);
          crown.closePath();

          celShape(g, crown, 3.5, -10, -14, '#FFFDF0', '#FF7B00', '#FF003C', ink);
          // Blinding Star Core at Impact Point
          g.save();
          g.translate(cx, cy);
          g.rotate(t * 9);
          celShape(g, fiveStarPath(68 * crSc, 28 * crSc), 2.5, 0, 0, '#FFFFFF', '#FFE600', '#FF003C', ink);
          g.restore();
        }
      }
    });

    // Act 2 (0.60s - 0.75s): Stark Red-Black-White Impact Frame with Radial Flame Fissures!
    later(600, () => {
      const spikes = Array.from({ length: 24 }, (_, i) => ({
        a: (i / 24) * TAU + rnd(-0.06, 0.06),
        w: rnd(0.04, 0.09),
      }));
      fx.spawn(0.16, (k, _t, _dt, g) => {
        const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
        g.fillStyle = k < 0.5 ? '#FF003C' : '#0D0205';
        g.fillRect(ox - 20, oy - 20, vw + 40, vh + 40);
        g.fillStyle = k < 0.5 ? '#0D0205' : '#FFFDF0';
        g.beginPath();
        for (const sp of spikes) {
          g.moveTo(cx, cy);
          g.lineTo(cx + Math.cos(sp.a - sp.w) * 2200, cy + Math.sin(sp.a - sp.w) * 2200);
          g.lineTo(cx + Math.cos(sp.a + sp.w) * 2200, cy + Math.sin(sp.a + sp.w) * 2200);
          g.closePath();
        }
        g.fill();
      });
    });

    // Act 3 (0.74s): ORGANIC MUSHROOM CLOUD PILLAR & WALL-TO-WALL HELLFIRE SUPERNOVA!
    later(740, () => {
      const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
      const scx = ox + vw * 0.5, scy = oy + vh * 0.5;
      const fullR = Math.hypot(vw, vh) * 1.2;

      spawnMegaStarDome({ scx, scy, fullR, colOuter: '#D90429', colMid: '#FF6D00', colInner: '#FFE600', ink });

      // Organic Tapered Billowing Mushroom Stem & Cap (Curved Bezier waist + multi-lobe cap, ZERO straight rects!)
      fx.spawn(1.55, (k, t, _dt, g) => {
        const die = 1 - inn(clamp((k - 0.45) / 0.55));
        const grow = out(clamp(k / 0.22)) * die;
        if (grow < 0.06) return;
        const curOx = scrollX, curOy = scrollY;
        const mx = curOx + innerWidth * 0.5;
        const baseW = innerWidth * 0.36 * grow;
        const waistW = innerWidth * 0.16 * grow;
        const capW = innerWidth * 0.52 * grow;

        const stem = new Path2D();
        stem.moveTo(mx - baseW, curOy + innerHeight + 40);
        stem.bezierCurveTo(mx - waistW, curOy + innerHeight * 0.62, mx - waistW, curOy + innerHeight * 0.34, mx - capW, curOy + innerHeight * 0.18);
        stem.bezierCurveTo(mx - capW * 0.8, curOy - 90, mx + capW * 0.8, curOy - 90, mx + capW, curOy + innerHeight * 0.18);
        stem.bezierCurveTo(mx + waistW, curOy + innerHeight * 0.34, mx + waistW, curOy + innerHeight * 0.62, mx + baseW, curOy + innerHeight + 40);
        stem.closePath();
        celShape(g, stem, 9 * die, -28, -24, '#FFFDF0', '#FF7B00', '#D90429', ink);

        // Swirling Vortex Collar Rings Around the Mushroom Stem!
        for (const ry of [0.32, 0.52, 0.72]) {
          const rw = lerp(capW * 0.72, baseW * 0.85, ry);
          celShape(g, ellipsePath(mx, curOy + innerHeight * ry, rw, rw * 0.18), 4 * die, 0, -6, '#FFE600', '#FF4D00', '#7F1D1D', ink);
        }
      });

      spawnFullScreenCloudWall({
        scx, scy, vw, vh,
        hi: ['#FFFBEB', '#FFE66D'],
        mid: ['#FF6D00', '#FF003C'],
        shade: ['#3D0814', '#1F0808'],
        ink, swirl: 0.75,
      });

      for (let i = 0; i < 80; i++) {
        const px0 = ox + rnd(0, vw), py0 = oy + vh + rnd(-80, 80);
        const vx = rnd(-260, 260), vy = -rnd(580, 1450);
        const sz = rnd(14, 38);
        fx.spawn(rnd(1.5, 2.4), (k, t, _dt, g) => {
          const sc = 1 - inn(clamp((k - 0.6) / 0.4));
          if (sc < 0.08) return;
          g.save();
          g.translate(px0 + vx * t, py0 + vy * t + 320 * t * t);
          g.rotate(t * 8); g.scale(sc, sc);
          celShape(g, fiveStarPath(sz, sz * 0.44), 2.2, -3, -3, '#FFFDF0', '#FF6D00', '#B91C1C', ink);
          g.restore();
        });
      }

      sfx('HỎA NGỤC BÙNG NỔ!!', scx, scy - vh * 0.06, {
        size: Math.min(1140, Math.round(vw * 0.84)), rot: -0.05, life: 2.0, col: '#FFD000', edge: ink,
      });
      later(310, () => {
        sfx('THIÊU RỤI TẤT CẢ!!', scrollX + innerWidth * 0.5, scrollY + innerHeight * 0.65, {
          size: Math.min(860, Math.round(innerWidth * 0.64)), rot: 0.06, life: 1.75, col: '#FF4D00', edge: ink,
        });
      });
    });
  }

  // =========================================================================
  // 3. CYBER EMP 1-BILLION-VOLT ("BOM BÃO TỪ SIÊU ĐIỆN" — #00F5FF x #EEFF00)
  //    Upgraded with True Calligraphic Branching Sakuga Lightning:
  //    - 12 High-Voltage Multi-Forked Tesla Bolts Converging Into Bomb Core
  //    - Yutaka Nakamura 2-Frame Black-and-Cyan Branching Thunder Impact Flash
  //    - 3 Colossal Sky-to-Ground Thunder Pillars + 26 Wild Plasma Storm Arcs!
  // =========================================================================
  function detonateCyberBomb(cx, cy) {
    const ink = '#041026';
    window.MultiverseSFX?.cyberEmp();

    fx.spawn(0.54, (k, t, _dt, g) => {
      const vw = innerWidth, vh = innerHeight;
      const maxD = Math.hypot(vw, vh) * 1.1;
      g.fillStyle = '#040D1F';
      g.beginPath(); g.arc(cx, cy, out(clamp(k / 0.28)) * maxD, 0, TAU); g.fill();

      // Segmented Rotating HUD Radar Sweeps + Twin Counter-Spinning Hex Locks
      const lockR = lerp(520, 48, out(k));
      g.save();
      g.translate(cx, cy);
      g.rotate(t * 5.5);
      g.strokeStyle = '#00F5FF'; g.lineWidth = 5.5;
      for (let q = 0; q < 4; q++) {
        const a = (q / 4) * TAU;
        g.beginPath(); g.arc(0, 0, lockR, a, a + 0.95); g.stroke();
      }
      g.strokeStyle = '#EEFF00'; g.lineWidth = 4.2;
      g.stroke(hexPath(0, 0, lockR * 0.68, -t * 9));
      g.restore();

      // Pulsing White-Hot Plasma Core Gathering 1 Billion Volts!
      const cR = lerp(16, 78, out(k));
      celShape(g, ellipsePath(cx, cy, cR, cR), 3.5, -5, -5, '#FFFFFF', '#00F5FF', '#0051FF', '#EEFF00');
    });

    // 12 Multi-Branching Calligraphic Tesla Bolts Converging Into Core During Charge!
    for (let cIdx = 0; cIdx < 12; cIdx++) {
      later(cIdx * 40, () => {
        const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
        const anchors = [
          [ox, oy], [ox + vw, oy], [ox, oy + vh], [ox + vw, oy + vh],
          [ox + vw * 0.5, oy], [ox + vw * 0.5, oy + vh],
        ];
        const [sx, sy] = anchors[cIdx % anchors.length];
        lightningArc(sx + rnd(-60, 60), sy + rnd(-40, 40), cx, cy, {
          col: cIdx % 2 ? '#EEFF00' : '#00F5FF',
          core: '#FFFFFF',
          ink,
          width: 12.5,
          sway: 0.25,
          branches: 6,
          life: 0.25,
        });
      });
    }

    // Act 2: 2-Frame Yutaka Nakamura Branching Thunder Impact Frame!
    later(530, () => {
      const impactBolts = Array.from({ length: 14 }, (_, i) => {
        const baseA = (i / 14) * TAU + rnd(-0.08, 0.08);
        return buildJaggedFissure(cx, cy, baseA, 1850, rnd(22, 40), 733 + i * 191, 1.0);
      });
      fx.spawn(0.17, (k, _t, _dt, g) => {
        const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
        if (k < 0.5) {
          g.fillStyle = '#E0FFFF';
          g.fillRect(ox - 20, oy - 20, vw + 40, vh + 40);
          g.save(); g.translate(7, 7); g.fillStyle = '#00F5FF';
          for (const bp of impactBolts) g.fill(bp);
          g.restore();
          g.fillStyle = ink;
          for (const bp of impactBolts) g.fill(bp);
        } else {
          g.fillStyle = ink;
          g.fillRect(ox - 20, oy - 20, vw + 40, vh + 40);
          g.save(); g.translate(5, 5); g.fillStyle = '#00F5FF';
          for (const bp of impactBolts) g.fill(bp);
          g.restore();
          g.fillStyle = '#EEFF00';
          for (const bp of impactBolts) g.fill(bp);
        }
      });
    });

    later(680, () => {
      const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
      const scx = ox + vw * 0.5, scy = oy + vh * 0.5;
      const fullR = Math.hypot(vw, vh) * 1.18;

      spawnMegaStarDome({ scx, scy, fullR, colOuter: '#0051FF', colMid: '#00F5FF', colInner: '#EEFF00', ink });
      spawnFullScreenCloudWall({
        scx, scy, vw, vh,
        hi: ['#FFFFFF', '#F7FEE7'],
        mid: ['#00F5FF', '#38BDF8'],
        shade: ['#00359E', '#091E42'],
        ink, swirl: 1.2,
      });

      fx.spawn(1.05, (k, t, _dt, g) => {
        const R = fullR * out(k);
        const lw = Math.max(0, 28 * (1 - k));
        if (lw < 0.5) return;
        g.strokeStyle = ink; g.lineWidth = lw + 10; g.stroke(hexPath(scx, scy, R, t * 0.8));
        g.strokeStyle = '#00F5FF'; g.lineWidth = lw; g.stroke(hexPath(scx, scy, R, t * 0.8));
      });

      // 3 Colossal Sky-to-Earth God-Thunder Pillars!
      for (const xPct of [0.22, 0.50, 0.78]) {
        later(xPct === 0.50 ? 0 : 75, () => {
          const curOx = scrollX, curOy = scrollY;
          lightningArc(
            curOx + innerWidth * xPct + rnd(-60, 60),
            curOy - 30,
            curOx + innerWidth * xPct + rnd(-90, 90),
            curOy + innerHeight + 30,
            {
              col: xPct === 0.50 ? '#EEFF00' : '#00F5FF',
              core: '#FFFFFF',
              ink,
              width: 21,
              sway: 0.21,
              branches: 8,
              life: 0.66,
            }
          );
        });
      }

      // 24 Wild Multi-Branching Calligraphic Sakuga Thunderbolts Tearing Across All Quadrants!
      for (let b = 0; b < 24; b++) {
        later((b % 6) * 90, () => {
          const curOx = scrollX, curOy = scrollY;
          const x1 = curOx + rnd(-30, innerWidth + 30);
          const y1 = curOy + (b % 2 === 0 ? -20 : rnd(0, innerHeight));
          const x2 = curOx + rnd(-30, innerWidth + 30);
          const y2 = curOy + (b % 2 === 0 ? innerHeight + 20 : rnd(0, innerHeight));
          lightningArc(x1, y1, x2, y2, {
            col: b % 3 === 0 ? '#EEFF00' : (b % 3 === 1 ? '#00F5FF' : '#38BDF8'),
            core: '#FFFFFF',
            ink,
            width: rnd(12.5, 18.5),
            sway: 0.24,
            branches: 7,
            life: 0.54,
          });
        });
      }

      sfx('BÃO TỪ 1 TỶ VOLT!!', scx, scy - vh * 0.06, {
        size: Math.min(1140, Math.round(vw * 0.84)), rot: -0.06, life: 2.0, col: '#00F5FF', edge: ink,
      });
      later(300, () => {
        sfx('TÊ LIỆT TOÀN TẬP!!', scrollX + innerWidth * 0.5, scrollY + innerHeight * 0.65, {
          size: Math.min(860, Math.round(innerWidth * 0.64)), rot: 0.05, life: 1.75, col: '#EEFF00', edge: ink,
        });
      });
    });
  }

  // =========================================================================
  // 4. TOXIC NEON CHAOS ("BOM HỖN MANG NEON" — UPGRADED JINX/GRAFFITI SAKUGA!)
  //    Zero stiff straight lines! Features:
  //    - 14 Organic Multi-Droplet Cel Paint Splatters slamming across the screen
  //    - 8 Curved Razor Crescent Whip-Slashes racing from every angle
  //    - Manic Spinning 14-Blade Sawtooth Shuriken Vortex + Graffiti Laugh Popups ("HAHA!")
  // =========================================================================
  function detonateChaosBomb(cx, cy) {
    const ink = '#140326';
    window.MultiverseSFX?.chaosCarnival();

    const neonPalette = [
      ['#E8FFD6', '#39FF14', '#0E6B00'], // Acid Green
      ['#FFE0F5', '#FF00AA', '#7A0052'], // Hot Magenta
      ['#FFFDE0', '#FFF000', '#A38A00'], // Volt Lemon
      ['#E0FFFF', '#00F5FF', '#006B8F'], // Cyber Cyan
    ];

    // Precompute 14 Organic Graffiti Paint Splatters popping rapidly across the viewport!
    const splatters = Array.from({ length: 14 }, (_, i) => ({
      delay: (i / 14) * 0.42,
      fxPct: rnd(0.10, 0.90),
      fyPct: rnd(0.12, 0.88),
      r: rnd(58, 135),
      pal: neonPalette[i % neonPalette.length],
      lobes: Array.from({ length: 8 }, (_, j) => [
        (j / 8) * TAU + rnd(-0.28, 0.28),
        rnd(0.65, 1.38),
        rnd(0.16, 0.44),
      ]),
    }));

    // Precompute 52 Perimeter Comic Action Speed-Lines!
    const speedBorder = Array.from({ length: 52 }, (_, i) => ({
      a: (i / 52) * TAU,
      len: rnd(160, 380),
      w: rnd(3, 8),
      col: neonPalette[i % 4][1],
    }));

    // Act 1 (0.00s - 0.60s): GRAFFITI PAINT SPLATTER BARRAGE + SPINNING SAWTOOTH VORTEX + CRESCENT WHIPS!
    fx.spawn(0.61, (k, t, _dt, g) => {
      const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
      const maxD = Math.hypot(vw, vh) * 1.12;

      // 1. Expanding Deep Ultraviolet Punk Backdrop
      g.fillStyle = '#120224';
      g.beginPath();
      g.arc(cx, cy, out(clamp(k / 0.24)) * maxD, 0, TAU);
      g.fill();

      // 2. Perimeter Neon Comic Speed-Lines Pulsing Inward!
      const scx = ox + vw * 0.5, scy = oy + vh * 0.5;
      for (const sb of speedBorder) {
        g.strokeStyle = sb.col;
        g.lineWidth = sb.w;
        const rIn = maxD * 0.52 - sb.len * out(k);
        g.beginPath();
        g.moveTo(scx + Math.cos(sb.a) * maxD * 0.56, scy + Math.sin(sb.a) * maxD * 0.56);
        g.lineTo(scx + Math.cos(sb.a) * rIn, scy + Math.sin(sb.a) * rIn);
        g.stroke();
      }

      // 3. 14 Organic Cel-Shaded Graffiti Paint Splatters Slamming Onto the Screen!
      for (const sp of splatters) {
        if (k < sp.delay) continue;
        const lk = clamp((k - sp.delay) / 0.22);
        const popSc = back(lk);
        const px = ox + vw * sp.fxPct;
        const py = oy + vh * sp.fyPct;
        const blobP = buildSplatterPath(px, py, sp.r * popSc, sp.lobes);
        celShape(g, blobP, 3.2, -sp.r * 0.14, -sp.r * 0.18, sp.pal[0], sp.pal[1], sp.pal[2], ink);
      }

      // 4. Manic Spinning 14-Blade Curved Sawtooth Vortex at Bomb Core!
      const vorR = lerp(45, 235, out(k));
      g.save();
      g.translate(cx, cy);
      g.rotate(-t * 14);
      const saw = new Path2D();
      const B = 14;
      for (let i = 0; i < B; i++) {
        const a0 = (i / B) * TAU;
        const aTip = ((i + 0.65) / B) * TAU;
        const aNext = ((i + 1) / B) * TAU;
        if (i === 0) saw.moveTo(Math.cos(a0) * vorR * 0.48, Math.sin(a0) * vorR * 0.48);
        saw.quadraticCurveTo(
          Math.cos(a0 + 0.15) * vorR * 0.95,
          Math.sin(a0 + 0.15) * vorR * 0.95,
          Math.cos(aTip) * vorR * 1.18,
          Math.sin(aTip) * vorR * 1.18
        );
        saw.lineTo(Math.cos(aNext) * vorR * 0.48, Math.sin(aNext) * vorR * 0.48);
      }
      saw.closePath();
      celShape(g, saw, 3.8, -8, -8, '#FFF000', '#FF00AA', '#39FF14', ink);
      celShape(g, fiveStarPath(vorR * 0.42, vorR * 0.18), 2.5, 0, 0, '#FFFFFF', '#39FF14', '#00F5FF', ink);
      g.restore();
    });

    // Staggered Curved Razor Crescent Whip-Slashes + Manic "HAHA!" Graffiti Words During Charge!
    for (let w = 0; w < 7; w++) {
      later(w * 68, () => {
        const col = neonPalette[w % 4][1];
        slash(cx + rnd(-140, 140), cy + rnd(-110, 110), {
          len: rnd(420, 880), ang: w * 0.92, thick: 34, col, life: 0.34,
        });
        if (w % 2 === 1) {
          sfx('HAHA!!', scrollX + innerWidth * rnd(0.22, 0.78), scrollY + innerHeight * rnd(0.22, 0.75), {
            size: 165, rot: rnd(-0.28, 0.28), life: 0.46, col, edge: ink,
          });
        }
      });
    }

    // Act 2 (0.60s): 2-Frame Split Jagged Starburst Impact Flash!
    later(600, () => {
      fx.spawn(0.15, (k, _t, _dt, g) => {
        const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
        g.fillStyle = k < 0.5 ? '#39FF14' : '#FF00AA';
        g.fillRect(ox - 20, oy - 20, vw + 40, vh + 40);
        g.save();
        g.translate(cx, cy);
        celShape(g, fiveStarPath(950, 340), 12, 0, 0, '#FFFFFF', '#FFF000', ink, ink);
        g.restore();
      });
    });

    // Act 3 (0.73s): 32-CLOUD NEON GRAFFITI CYCLONE + RAINBOW CROSS-SLASHES!
    later(730, () => {
      const ox = scrollX, oy = scrollY, vw = innerWidth, vh = innerHeight;
      const scx = ox + vw * 0.5, scy = oy + vh * 0.5;
      const fullR = Math.hypot(vw, vh) * 1.2;

      spawnMegaStarDome({ scx, scy, fullR, colOuter: '#FF00AA', colMid: '#39FF14', colInner: '#FFF000', ink });
      spawnFullScreenCloudWall({
        scx, scy, vw, vh,
        hi: ['#FFFDF7', '#FFF000', '#E0FFFA'],
        mid: ['#39FF14', '#FF00AA', '#00F5FF', '#FFF000'],
        shade: ['#2D0659', '#6B0047', '#063B1C'],
        ink, swirl: 2.1,
      });

      ['#39FF14', '#FF00AA', '#FFF000', '#00F5FF', '#39FF14', '#FF00AA'].forEach((col, i) => {
        later(i * 70, () => {
          slash(scrollX + innerWidth * 0.5, scrollY + innerHeight * 0.5, {
            len: fullR * 1.15, ang: i * 0.54, thick: 76, col, life: 0.55,
          });
        });
      });

      const neonCols = ['#39FF14', '#FF00AA', '#FFF000', '#00F5FF'];
      for (let i = 0; i < 80; i++) {
        const a = (i / 80) * TAU + rnd(-0.12, 0.12), spd = rnd(380, 1380);
        const sz = rnd(20, 48), col = neonCols[i % neonCols.length];
        fx.spawn(rnd(1.7, 2.6), (k, t, _dt, g) => {
          const sc = 1 - inn(clamp((k - 0.65) / 0.35));
          if (sc < 0.08) return;
          g.save();
          g.translate(scx + Math.cos(a) * spd * t, scy + Math.sin(a) * spd * t + 520 * t * t);
          g.rotate(t * 9 * (i % 2 ? 1 : -1)); g.scale(sc, sc);
          celShape(g, fiveStarPath(sz, sz * 0.46), 2.4, -3, -3, '#FFFFFF', col, ink, ink);
          g.restore();
        });
      }

      sfx('BÙM BANH NÓC!!', scx, scy - vh * 0.06, {
        size: Math.min(1140, Math.round(vw * 0.84)), rot: -0.08, life: 2.0, col: '#39FF14', edge: ink,
      });
      later(290, () => {
        sfx('HỖN MANG BÙNG NỔ!!', scrollX + innerWidth * 0.5, scrollY + innerHeight * 0.65, {
          size: Math.min(880, Math.round(innerWidth * 0.66)), rot: 0.06, life: 1.8, col: '#FF00AA', edge: ink,
        });
      });
    });
  }

  // =========================================================================
  // <sakuga-mega-bomb type="void | crimson | cyber | chaos"> Web Component
  // =========================================================================
  class SakugaMegaBomb extends CuteMascotBase {
    static observedAttributes = ['type', 'size', 'label', 'mode'];

    get bombType() { return this.getAttribute('type') || 'void'; }

    initSprings() {
      this.swell = new Spring(0, 480, 11);
      this.tilt = new Spring(0, 420, 12);
      return [this.swell, this.tilt];
    }

    frame(dt) {
      if (this.inView) this.dirty = true;
      super.frame(dt);
    }

    detonate() {
      if (this._busy) return;
      this._busy = true;
      const c = at(this.stageEl);
      this.swell.to = 0.65;
      this.tilt.v = 18;
      this.dirty = true;
      this.emit('bomb-charging', { type: this.bombType });

      const tp = this.bombType;
      if (tp === 'crimson') detonateCrimsonBomb(c.x, c.y);
      else if (tp === 'cyber') detonateCyberBomb(c.x, c.y);
      else if (tp === 'chaos') detonateChaosBomb(c.x, c.y);
      else detonateVoidBomb(c.x, c.y);

      later(680, () => {
        this.swell.to = -0.3;
        this.swell.v = -14;
        this.dirty = true;
        this.emit('bomb-exploded', { type: tp });
      });

      later(1050, () => {
        this.swell.to = 0;
        this.dirty = true;
      });

      later(2300, () => {
        this._busy = false;
      });
    }

    playCut(kind = 'loop') {
      if (fx.calm) return;
      if (kind === 'click') {
        this.detonate();
        return;
      }
      this.swell.v = 6.5;
      this.tilt.v = (Math.random() > 0.5 ? 1 : -1) * 7;
      this.dirty = true;
    }

    drawMascot(ctx, sz, cw, ch) {
      const unit = sz / 48;
      ctx.save();
      ctx.translate(cw * 0.5, ch * 0.56);
      ctx.scale(unit, unit);
      ctx.lineJoin = ctx.lineCap = 'round';
      const tp = this.bombType;
      const sw = 1 + this.swell.x * 0.28;
      const pulse = Math.sin(fx.now * 8) * 0.5 + 0.5;

      ctx.fillStyle = 'rgba(20, 16, 48, 0.18)';
      ctx.beginPath(); ctx.ellipse(0, 18.8, 14.5, 2.6, 0, 0, TAU); ctx.fill();

      ctx.translate(0, -this.hoverLift.x * 1.5);
      ctx.rotate(this.tilt.x * 0.18);
      ctx.scale(sw, sw);

      if (tp === 'void') {
        const ink = '#090314';
        // Twin intersecting cosmic accretion rings + orbiting emerald crystal!
        ctx.save();
        ctx.rotate(-0.34 + Math.sin(fx.now * 2.4) * 0.09);
        celShape(ctx, ellipsePath(0, 0, 22.0, 5.6), 1.5, 0, -1.5, '#A7F3D0', '#00FF9D', '#4C1D95', ink);
        ctx.restore();
        ctx.save();
        ctx.rotate(0.42 - Math.sin(fx.now * 2.0) * 0.08);
        ctx.strokeStyle = '#D8B4FE'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.ellipse(0, 0, 19.5, 4.2, 0, 0, TAU); ctx.stroke();
        ctx.restore();
        // Horned Abyssal Core Sphere
        for (const side of [-1, 1]) {
          const horn = new Path2D();
          horn.moveTo(side * 8, -9);
          horn.quadraticCurveTo(side * 15, -17, side * 11, -19.5);
          horn.quadraticCurveTo(side * 10, -13, side * 4, -12);
          horn.closePath();
          celShape(ctx, horn, 1.35, -0.6, -0.6, '#E9D5FF', '#B517FF', '#3B0764', ink);
        }
        celShape(ctx, ellipsePath(0, 0.5, 14.5, 14.5), 1.85, -3.2, -3.4, '#6B21A8', '#1E0538', '#090214', ink);
        // Glowing Eldritch Slit-Eye Core + Forehead Rune Gem!
        celShape(ctx, ellipsePath(0, 0.2, 7.2, 4.6), 1.45, 0, -1, '#FFFFFF', '#00FF9D', '#047857', ink);
        ctx.fillStyle = ink;
        ctx.beginPath(); ctx.ellipse(0, 0.2, 1.6, 3.8, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(-2.2, -1.2, 1.0, 0, TAU); ctx.fill();
        celShape(ctx, roundRectPath(-4.8, -17.2, 9.6, 4.4, 1.8), 1.45, -1, -1, '#F3E8FF', '#B517FF', '#4C1D95', ink);
      } else if (tp === 'crimson') {
        const ink = '#1F070B';
        // 8 Naval Warhead Spikes + Horned Demon Visor + Fanged Magma Jaw!
        for (let i = 0; i < 8; i++) {
          ctx.save(); ctx.rotate((i / 8) * TAU + 0.39);
          const spk = new Path2D(); spk.moveTo(-2.9, -13); spk.lineTo(0, -19.2); spk.lineTo(2.9, -13); spk.closePath();
          celShape(ctx, spk, 1.35, -0.6, -0.6, '#FFD000', '#FF5400', '#991B1B', ink);
          ctx.restore();
        }
        celShape(ctx, ellipsePath(0, 1, 14.6, 14.6), 1.9, -3.2, -3.4, '#EF233C', '#991B1B', '#3B0404', ink);
        ctx.fillStyle = '#FDA4AF';
        ctx.beginPath(); ctx.ellipse(-6.5, -7.2, 2.8, 1.1, -0.45, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#690505'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(0, 1, 13.8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
        // Glowing Molten Gold Visor Eyes
        for (const side of [-1, 1]) {
          const ep = new Path2D();
          ep.moveTo(side * 1.8, -0.8); ep.lineTo(side * 8.8, -4.0); ep.lineTo(side * 7.8, 1.2); ep.closePath();
          celShape(ctx, ep, 1.25, 0, 0, '#FFE600', '#FF7B00', '#FF003C', ink);
        }
        // Jagged Molten Furnace Grin!
        const jaw = new Path2D();
        jaw.moveTo(-7.2, 5.0);
        jaw.lineTo(-3.6, 6.8); jaw.lineTo(0, 5.2); jaw.lineTo(3.6, 6.8); jaw.lineTo(7.2, 5.0);
        jaw.quadraticCurveTo(4.2, 10.2, 0, 10.2);
        jaw.quadraticCurveTo(-4.2, 10.2, -7.2, 5.0);
        jaw.closePath();
        celShape(ctx, jaw, 1.2, 0, 0, '#FFE600', '#FF5400', '#B91C1C', ink);
        // Fuse Cap + Burning Rope Fuse + Spinning Star Spark
        celShape(ctx, roundRectPath(-3.8, -15.4, 7.6, 3.6, 1.4), 1.3, -0.6, -0.6, '#64748B', '#334155', '#0F172A', ink);
        ctx.strokeStyle = ink; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(0, -15.2); ctx.quadraticCurveTo(4, -20.5, 8.8, -19.0); ctx.stroke();
        const spR = 3.8 + pulse * 1.8;
        ctx.save(); ctx.translate(9.2, -19.2); ctx.rotate(fx.now * 9);
        celShape(ctx, fiveStarPath(spR, spR * 0.45), 1.15, 0, 0, '#FFE600', '#FF6D00', '#FF003C', ink);
        ctx.restore();
      } else if (tp === 'cyber') {
        const ink = '#06152D';
        const wingY = -8.0 + Math.sin(fx.now * 6) * 1.3;
        for (const side of [-1, 1]) {
          const wx = side > 0 ? 14.0 : -19.4;
          const wing = roundRectPath(wx, wingY, 5.4, 16.0, 2.0);
          celShape(ctx, wing, 1.45, -1, -1, '#00F5FF', '#0284C7', '#1E3A8A', ink);
          ctx.fillStyle = '#EEFF00';
          ctx.fillRect(wx + 1.0, wingY + 7.2, 3.4, 2.0);
        }
        celShape(ctx, roundRectPath(-2.2, -19.5, 4.4, 5.0, 1.5), 1.3, -0.5, -0.5, '#EEFF00', '#CA8A04', '#713F12', ink);
        celShape(ctx, hexPath(0, 0, 15.8, Math.PI / 6), 1.85, -3.0, -3.2, '#475569', '#1E293B', '#090D16', ink);
        celShape(ctx, ellipsePath(0, 0, 9.8, 9.8), 1.55, -2.0, -2.0, '#00E5FF', '#0284C7', '#1E3A8A', ink);
        drawMiniBolt(ctx, -7.2, 2.4, 7.2, -2.6, {
          width: 1.45, col: '#EEFF00', core: '#FFFFFF', ink, seed: 53, fork: true, sway: 0.36,
        });
        const tick = Math.floor(fx.now * 16);
        if (tick % 2 === 0) {
          drawMiniBolt(ctx, -14.2, wingY + 3.5, -7.5, -1.5, {
            width: 1.1, col: '#00F5FF', core: '#FFFFFF', ink, seed: 89, fork: false, sway: 0.34,
          });
        } else {
          drawMiniBolt(ctx, 14.2, wingY + 11.5, 7.5, 1.5, {
            width: 1.1, col: '#EEFF00', core: '#FFFFFF', ink, seed: 131, fork: false, sway: 0.34,
          });
        }
      } else {
        const ink = '#170426';
        for (const side of [-1, 1]) {
          ctx.save(); ctx.translate(side * 8.6, -12.6); ctx.rotate(side * 0.36);
          const ear = new Path2D();
          ear.moveTo(-3.0, 1.5);
          ear.quadraticCurveTo(-3.6, -7.5, 0, -9.2);
          ear.quadraticCurveTo(3.6, -7.5, 3.0, 1.5);
          ear.closePath();
          celShape(ctx, ear, 1.45, -0.8, -0.8, '#FF00AA', '#BE185D', '#500724', ink);
          ctx.restore();
        }
        celShape(ctx, ellipsePath(0, 1, 14.9, 14.5), 1.9, -3.2, -3.4, '#8B5CF6', '#581C87', '#1E0538', ink);
        const drip = new Path2D();
        drip.moveTo(-6, -12.2);
        drip.quadraticCurveTo(-3, -7.5, -2.5, -9.8);
        drip.quadraticCurveTo(0, -5.5, 1.8, -10.2);
        drip.quadraticCurveTo(4.5, -8.0, 6.2, -12.0);
        drip.quadraticCurveTo(0, -14.0, -6, -12.2);
        drip.closePath();
        celShape(ctx, drip, 1.1, -0.5, -0.5, '#39FF14', '#16A34A', '#052E16', ink);
        ctx.strokeStyle = '#39FF14'; ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(-7.6, -5.0); ctx.lineTo(-2.6, 0);
        ctx.moveTo(-2.6, -5.0); ctx.lineTo(-7.6, 0);
        ctx.stroke();
        ctx.save(); ctx.translate(5.4, -2.5); ctx.rotate(fx.now * 3);
        celShape(ctx, fiveStarPath(4.0, 1.8), 1.1, 0, 0, '#FFF000', '#FF00AA', '#831843', ink);
        ctx.restore();
        const grin = new Path2D();
        grin.moveTo(-9.2, 2.2);
        grin.quadraticCurveTo(0, 10.6, 9.2, 2.2);
        grin.quadraticCurveTo(0, 4.8, -9.2, 2.2);
        grin.closePath();
        celShape(ctx, grin, 1.3, 0, 0, '#FFFFFF', '#E2E8F0', '#94A3B8', ink);
        ctx.strokeStyle = ink; ctx.lineWidth = 1.15;
        for (const sx of [-4.5, 0, 4.5]) {
          ctx.beginPath(); ctx.moveTo(sx, 3.2); ctx.lineTo(sx, 7.2); ctx.stroke();
        }
      }

      ctx.restore();
    }
  }

  fx.define('sakuga-mega-bomb', SakugaMegaBomb);
})();
