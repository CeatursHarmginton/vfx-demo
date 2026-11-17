// 5-Step Connected Relay & Full-Screen Treasure Chest Detonation Director
(() => {
  'use strict';

  const state = {
    combo: 0,
    comboTimer: null,
    steps: { s1: false, s2: false, s3: false, s4: false },
    explosions: 0,
  };

  function setBubble(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }

  function flashImpactFrame(ms = 85) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.body.classList.add('impact-frame');
    setTimeout(() => document.body.classList.remove('impact-frame'), ms);
  }

  function addCombo(n = 1) {
    state.combo += n;
    const pill = document.getElementById('hud-combo');
    if (pill) {
      pill.textContent = `COMBO x${state.combo}`;
      pill.classList.toggle('hot', state.combo >= 8);
    }
    if (state.combo > 0 && state.combo % 10 === 0) {
      flashImpactFrame(80);
      window.SakugaFX?.sfx(`COMBO x${state.combo}!!`, scrollX + innerWidth * 0.5, scrollY + innerHeight * 0.25, {
        size: 165, col: '#FFE44D', edge: '#1D1A4A',
      });
    }
    clearTimeout(state.comboTimer);
    state.comboTimer = setTimeout(() => {
      state.combo = 0;
      if (pill) { pill.textContent = 'COMBO x0'; pill.classList.remove('hot'); }
    }, 5500);
  }

  function toast(msg) {
    document.getElementById('sakuga-toast-el')?.show(msg);
  }

  // Synchronize all 4 Step Conduits, HUD Nodes, Checkboxes, Storm Progress & Treasure Chest Seals!
  function syncPipeline() {
    const map = [
      ['s1', 'q-step1', 'seal-badge-1', 'conduit-1', 'conduit-label-1', 'nav-s1', 'orb-1', '⚡ Ấn #1: ĐÃ MỞ!', '⚡ Đã truyền điện xuống Pikachu ở Bước 02!'],
      ['s2', 'q-step2', 'seal-badge-2', 'conduit-2', 'conduit-label-2', 'nav-s2', 'orb-2', '💧 Ấn #2: ĐÃ MỞ!', '💧 Đã dẫn tinh thể ngọc xuống Kirby ở Bước 03!'],
      ['s3', 'q-step3', 'seal-badge-3', 'conduit-3', 'conduit-label-3', 'nav-s3', 'orb-3', '⭐ Ấn #3: ĐÃ MỞ!', '⭐ Đã khắc thần chú vào Trạm Tụ Bão Bước 04!'],
      ['s4', 'q-step4', 'seal-badge-4', 'conduit-4', 'conduit-label-4', 'nav-s4', 'orb-4', '🌟 Ấn #4: ĐÃ MỞ!', '🔥 100% CÔNG LỰC ĐÃ NẠP VÀO RƯƠNG KHO BÁU!!'],
    ];

    let unlockedCount = 0;
    map.forEach(([key, cbId, badgeId, condId, condLblId, navId, orbId, openText, pipeText], idx) => {
      const cb = document.getElementById(cbId);
      const isDone = state.steps[key] || !!cb?.checked;
      state.steps[key] = isDone;
      if (cb && cb.checked !== isDone) cb.checked = isDone;

      if (isDone) unlockedCount++;

      const sec = document.getElementById(`step-${idx + 1}`);
      sec?.classList.toggle('step-cleared', isDone);

      const badge = document.getElementById(badgeId);
      if (badge) {
        badge.classList.toggle('unlocked', isDone);
        if (isDone) badge.textContent = openText;
      }

      const cond = document.getElementById(condId);
      cond?.classList.toggle('lit', isDone);
      const condLbl = document.getElementById(condLblId);
      if (condLbl && isDone) condLbl.textContent = pipeText;

      document.getElementById(navId)?.classList.toggle('done', isDone);
      const orb = document.getElementById(orbId);
      if (orb) {
        orb.classList.toggle('lit', isDone);
        if (isDone) orb.textContent = openText;
      }
    });

    // Update Storm Progress Bar & Grand Treasure Chest Seals
    document.getElementById('storm-progress')?.set(unlockedCount / 4);
    const chest = document.getElementById('grand-treasure-chest');
    chest?.setSeals(unlockedCount);

    const navFinal = document.getElementById('nav-s5');
    navFinal?.classList.toggle('ready', unlockedCount >= 4);

    if (unlockedCount >= 4 && !state.notifiedReady) {
      state.notifiedReady = true;
      setBubble('bubble-chest', '🔥 ĐÃ MỞ ĐỦ 4/4 PHONG ẤN!! Rương đang rung bần bật — ẤN VÀO ĐỂ PHÁT NỔ NGAY!!');
      toast('🔥 Đủ 4/4 Phong Ấn! Cuộn xuống Bước 5 ấn nổ Rương Kho Báu ngay!');
    }
  }

  function unlockStep(stepKey, toastMsg) {
    if (!state.steps[stepKey]) {
      state.steps[stepKey] = true;
      toast(toastMsg);
    }
    syncPipeline();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const pikachu = document.getElementById('mascot-pikachu');
    const pokeball = document.getElementById('mascot-pokeball');
    const kirby = document.getElementById('mascot-kirby');
    const slime = document.getElementById('mascot-slime');
    const soot = document.getElementById('mascot-soot');
    const chest = document.getElementById('grand-treasure-chest');

    // HUD: Vietnamese / Japanese SFX Switch + Audio Mute
    const langBtn = document.getElementById('btn-sfx-lang');
    langBtn?.addEventListener('click', () => {
      const fx = window.SakugaFX;
      if (!fx) return;
      fx.sfxLang = fx.sfxLang === 'vi' ? 'jp' : 'vi';
      langBtn.textContent = fx.sfxLang === 'vi' ? '🇻🇳 SFX: Tiếng Việt' : '🇯🇵 SFX: Katakana';
      toast(fx.sfxLang === 'vi' ? 'Đã bật Chữ Truyện Tranh Tiếng Việt!' : 'Đã chuyển sang Chữ Katakana Nhật Bản!');
    });

    const soundBtn = document.getElementById('btn-sound-mute');
    soundBtn?.addEventListener('click', () => {
      const muted = window.MultiverseSFX?.toggleMute();
      soundBtn.textContent = muted ? '🔇 Đã tắt tiếng' : '🔊 Âm thanh: BẬT';
    });

    // ── BƯỚC 1: Công tắc nước 43 khung hình + Pokéball ──
    const liquidToggle = document.getElementById('liquid-theme-toggle');
    liquidToggle?.addEventListener('change', () => {
      const dark = liquidToggle.checked;
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      soot?.startle(dark ? 'BẬT ĐÊM!!' : 'SÁNG RỰC!!');
      setBubble('bubble-soot', 'Mạch nước đã thông! Điện đang truyền xuống Pikachu ở Bước 2 kìa!');
      addCombo(2);
      unlockStep('s1', '⚡ Bước 1 Hoàn Tất: Đã thông mạch năng lượng xuống Pikachu!');
    });

    pokeball?.addEventListener('pokeball-open', () => {
      addCombo(3);
      setBubble('bubble-pika', 'Pika-Pi!! Tớ đã nhận nguồn điện từ Bước 1, sẵn sàng phá giáp Slime! ⚡');
      setTimeout(() => pikachu?.summonJump(), 360);
      unlockStep('s1', '🔴 Bước 1 Hoàn Tất: Đã triệu hồi Pikachu thành công!');
    });

    document.getElementById('btn-step1-activate')?.addEventListener('click', () => {
      pokeball?.playCut('click');
    });

    // ── BƯỚC 2: Pikachu + Slider + Vua Slime Thủy Tinh ──
    const voltSlider = document.getElementById('volt-slider');
    const elementRadio = document.getElementById('element-radio');

    const strikeSlime = (forceThunder = false) => {
      const elem = forceThunder ? 'thunder' : (elementRadio?.value || 'thunder');
      if (elem === 'thunder') {
        pikachu?.unleashThunderbolt(slime);
        flashImpactFrame(80);
        setBubble('bubble-pika', 'PIKA-CHUUUU!! 100.000 VOLT XUYÊN GIÁP!! ⚡');
        setTimeout(() => {
          slime?.takeElementalHit('thunder');
          setBubble('bubble-slime', 'Á á nảy tung vương miện rồi! Ngọc năng lượng đã chảy xuống Bước 3!! 👑');
        }, 120);
      } else {
        slime?.takeElementalHit(elem);
        setBubble('bubble-slime', 'Bẹp dúm như thạch luôn! Phong Ấn #2 đã mở khóa rồi đó!! 👑');
      }
      addCombo(3);
      unlockStep('s2', '💧 Bước 2 Hoàn Tất: Đã phá giáp Slime, truyền ngọc xuống Kirby!');
    };

    voltSlider?.addEventListener('input', () => {
      const v = Number(voltSlider.value) || 0;
      pikachu?.setVoltage(v / 100);
      if (v >= 80) setBubble('bubble-pika', `Điện áp ${v}%! Thả tay ra là phóng sét 100.000V liền!`);
    });
    voltSlider?.addEventListener('change', () => {
      if ((Number(voltSlider.value) || 0) >= 80) strikeSlime(true);
    });

    pikachu?.addEventListener('pikachu-bolt', () => strikeSlime(true));
    slime?.addEventListener('slime-hit', () => strikeSlime(false));
    document.getElementById('btn-attack-slime')?.addEventListener('click', () => strikeSlime(false));

    // ── BƯỚC 3: Kirby Hút & Phun Thần Chú Tiếng Việt ──
    const kirbyInput = document.getElementById('kirby-word-input');
    const fireKirbySpell = () => {
      const spell = (kirbyInput?.value || '').trim().toUpperCase() || 'VỪNG ƠI MỞ RA!!';
      kirby?.inhaleAndSpit(spell);
      setBubble('bubble-kirby', `Phùù!! Thần chú "${spell}" đã bay thẳng xuống Trạm Tụ Bão Bước 4!! ⭐`);
      addCombo(3);
      unlockStep('s3', `⭐ Bước 3 Hoàn Tất: Đã khắc thần chú "${spell}"!`);
    };

    kirby?.addEventListener('kirby-spit', fireKirbySpell);
    document.getElementById('btn-kirby-fire')?.addEventListener('click', fireKirbySpell);
    document.querySelectorAll('.preset-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        if (kirbyInput) kirbyInput.value = chip.dataset.word || 'ĐẠI BÙNG NỔ!!';
        fireKirbySpell();
      });
    });

    // ── BƯỚC 4: Tabs, Checkboxes, 5-Star Rating & Storm Progress 100% ──
    const tabs = document.getElementById('showcase-tabs');
    tabs?.addEventListener('change', (e) => {
      const idx = e.detail.index;
      document.getElementById('panel-seals').hidden = idx !== 0;
      document.getElementById('panel-tips').hidden = idx !== 1;
    });

    const ratingEl = document.getElementById('sakuga-five-star');
    ratingEl?.addEventListener('change', () => {
      const val = ratingEl.value || 0;
      addCombo(val);
      if (val === 5) {
        window.MultiverseSFX?.fanfare();
        unlockStep('s4', '🌟 Bước 4 Hoàn Tất: 100% Mây Bão đã nạp xuống Rương Báu!');
      }
    });

    ['q-step1', 'q-step2', 'q-step3', 'q-step4'].forEach((id, i) => {
      document.getElementById(id)?.addEventListener('change', (ev) => {
        state.steps[`s${i + 1}`] = !!ev.target.checked;
        addCombo(2);
        syncPipeline();
      });
    });

    // ── BƯỚC 5: GRAND TREASURE CHEST FULL-SCREEN DETONATION!! ──
    document.getElementById('btn-detonate-chest')?.addEventListener('click', () => {
      chest?.detonateChest();
    });

    chest?.addEventListener('chest-charging', () => {
      document.body.classList.add('screen-charge');
      setBubble('bubble-chest', '⚠️ CẢNH BÁO: NĂNG LƯỢNG ĐANG NÉN TỚI CỰC HẠN... SẮP NỔ LỚN!!');
    });

    chest?.addEventListener('chest-exploded', () => {
      state.explosions++;
      document.body.classList.remove('screen-charge');
      // Double Sakuga Impact Frame + Full-Page Screen-Quake!
      flashImpactFrame(115);
      document.body.classList.remove('screen-quake');
      void document.body.offsetWidth;
      document.body.classList.add('screen-quake');
      setTimeout(() => document.body.classList.remove('screen-quake'), 700);

      addCombo(10);
      // All mascots on the page cheer simultaneously!
      pikachu?.summonJump();
      soot?.startle('GIÀU TO!!');
      setBubble('bubble-chest', `💥 BÙM CHẤN ĐỘNG LẦN #${state.explosions}!! Ấn tiếp vào Rương hoặc thử dàn 4 Siêu Bom bên dưới!!`);
    });

    // ── ARSENAL OF 4 APOCALYPSE BOMBS + ARMAGEDDON CHAIN BUTTON ──
    const bombs = ['bomb-void', 'bomb-crimson', 'bomb-cyber', 'bomb-chaos']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    bombs.forEach((bEl) => {
      bEl.addEventListener('bomb-charging', () => {
        document.body.classList.add('screen-charge');
      });
      bEl.addEventListener('bomb-exploded', () => {
        document.body.classList.remove('screen-charge');
        document.body.classList.remove('screen-quake');
        void document.body.offsetWidth;
        document.body.classList.add('screen-quake');
        setTimeout(() => document.body.classList.remove('screen-quake'), 700);
        addCombo(12);
      });
    });

    let armageddonRunning = false;
    document.getElementById('btn-armageddon-all')?.addEventListener('click', () => {
      if (armageddonRunning) return;
      armageddonRunning = true;
      toast('🚨 KÍCH HOẠT NGÀY TẬN THẾ: Nổ liên hoàn cả 4 Siêu Bom!!');
      bombs.forEach((bEl, idx) => {
        setTimeout(() => {
          bEl._busy = false;
          bEl.detonate();
          if (idx === bombs.length - 1) {
            setTimeout(() => { armageddonRunning = false; }, 2200);
          }
        }, idx * 1450);
      });
    });
  });
})();
