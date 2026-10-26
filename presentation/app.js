/* Presentation engine: stage scaling, presenter input (tap / double-tap / hold),
   beat runner, scene crossfades with shared-element FLIP, auto mode, print mode. */
(() => {
  'use strict';

  const W = 1920, H = 1080;
  const EASE = 'cubic-bezier(.22,.61,.36,1)';
  const T = { fast: 250, base: 500, slow: 800, stagger: 80, cross: 450, flip: 700 };
  const DOUBLE_MS = 350, HOLD_MS = 400, HOLD_STEP = 180, HOLD_STEP_FAST = 90, HOLD_FAST_AFTER = 2000;
  const B0_HOLD = 1200, PART_PAUSE = 1500;

  const SCENES = window.SCENES;
  const params = new URLSearchParams(location.search);
  const PRINT = params.has('print');

  const stage = document.getElementById('stage');
  const flipLayer = document.getElementById('flip-layer');
  let scale = 1;

  /* ---------------------------------------------------------------
     Animation registry. Every action sets the FINAL state first and then
     animates from the start state, so finishing (or skipping) an animation
     always leaves the correct end state behind.
     --------------------------------------------------------------- */
  const A = {
    speed: 1,        // >1 plays faster (hold = 4×, auto hold = 2×)
    instant: false,  // replaying earlier beats: render final states only
    skip: false,     // fast hold: render final states only
    anims: new Set(), tweens: new Set(), timers: new Set(), cleanups: new Set(),
  };
  const instant = () => A.instant || A.skip;

  function play(el, keyframes, o = {}) {
    const { dur = T.base, delay = 0, easing = EASE, done = null } = o;
    if (instant() || dur <= 0) { if (done) done(); return null; }
    const a = el.animate(keyframes, { duration: dur / A.speed, delay: delay / A.speed, easing, fill: 'backwards' });
    A.anims.add(a);
    let ended = false;
    const end = () => {
      if (ended) return;
      ended = true;
      A.anims.delete(a);
      A.cleanups.delete(end);
      if (done) done();
    };
    A.cleanups.add(end);
    a.finished.then(end, end);
    return a;
  }

  function tween(dur, update, o = {}) {
    const { delay = 0, ease = p => 1 - Math.pow(1 - p, 3) } = o;
    if (instant()) { update(1); return; }
    const tw = {
      t0: performance.now() + delay / A.speed, d: Math.max(1, dur / A.speed), update, ease,
      finish() { A.tweens.delete(tw); update(1); },
    };
    update(0);
    A.tweens.add(tw);
  }

  function at(ms, fn) {
    const root = FX.root;
    const run = () => { const prev = FX.root; FX.root = root; try { fn(); } finally { FX.root = prev; } };
    if (instant()) { run(); return; }
    const t = { run, id: 0 };
    t.id = setTimeout(() => { A.timers.delete(t); run(); }, ms / A.speed);
    A.timers.add(t);
  }

  /* Bring every running animation to its end state, synchronously. */
  function finishAll() {
    for (let guard = 0; guard < 8; guard++) {
      if (!A.timers.size && !A.anims.size && !A.tweens.size && !A.cleanups.size) return;
      const prev = A.instant;
      A.instant = true;
      for (const t of [...A.timers]) { A.timers.delete(t); clearTimeout(t.id); t.run(); }
      A.instant = prev;
      for (const a of [...A.anims]) { A.anims.delete(a); try { a.finish(); } catch (e) { /* already gone */ } }
      for (const tw of [...A.tweens]) tw.finish();
      for (const c of [...A.cleanups]) c();
    }
  }

  /* ---------------------------------------------------------------
     Actions used by scenes.js. Targets: selector (inside the current
     scene), element, or an array of either.
     --------------------------------------------------------------- */
  function els(t) {
    if (!t) return [];
    if (typeof t === 'string') return [...FX.root.querySelectorAll(t)];
    if (t instanceof Element) return [t];
    return [...t].flatMap(els);
  }
  const val = (v, el, i) => (typeof v === 'function' ? v(el, i) : v);
  function rect(el) {
    const r = el.getBoundingClientRect();
    return { left: r.left / scale, top: r.top / scale, width: r.width / scale, height: r.height / scale };
  }
  const fmt = (v, dec) => v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });

  const FX = {
    root: null,
    q: sel => FX.root.querySelector(sel),
    qa: sel => [...FX.root.querySelectorAll(sel)],
    at, tween,

    /* enter: opacity 0→1 + translate (default 16 px up) */
    show(t, o = {}) {
      const { delay = 0, stagger = T.stagger, dur = T.base, x = 0, y = 16, easing = EASE } = o;
      els(t).forEach((el, i) => {
        el.classList.remove('off');
        const dx = val(x, el, i), dy = val(y, el, i);
        const kf = { opacity: 0, offset: 0 };
        if (dx || dy) kf.translate = `${dx}px ${dy}px`;
        play(el, [kf], { dur, delay: delay + i * stagger, easing });
      });
    },
    /* enter without movement */
    fade(t, o = {}) { FX.show(t, { y: 0, dur: T.slow, ...o }); },
    reveal(t) { els(t).forEach(el => el.classList.remove('off')); },

    /* exit: opacity →0 (optionally moving to x/y) */
    hide(t, o = {}) {
      const { delay = 0, stagger = 0, dur = T.fast, x = 0, y = 0, easing = EASE } = o;
      els(t).forEach((el, i) => {
        const from = getComputedStyle(el).opacity;
        el.classList.add('off');
        const dx = val(x, el, i), dy = val(y, el, i);
        const kf = [{ opacity: from, offset: 0 }];
        if (dx || dy) { kf[0].translate = '0px 0px'; kf.push({ translate: `${dx}px ${dy}px`, offset: 1 }); }
        play(el, kf, { dur, delay: delay + i * stagger, easing });
      });
    },

    /* class change, animating the listed computed properties */
    setc(t, add, remove, props = ['opacity'], o = {}) {
      const list = els(t);
      const before = list.map(el => { const cs = getComputedStyle(el); return props.map(p => cs[p]); });
      list.forEach(el => {
        if (remove) el.classList.remove(...remove.split(' '));
        if (add) el.classList.add(...add.split(' '));
      });
      list.forEach((el, i) => {
        const kf = { offset: 0 };
        props.forEach((p, j) => { kf[p] = before[i][j]; });
        play(el, [kf], { dur: o.dur ?? 400, delay: (o.delay || 0) + i * (o.stagger || 0) });
      });
    },
    dim(t, on = true, cls = 'dim', o = {}) {
      FX.setc(t, on ? cls : null, on ? null : cls, ['opacity'], { dur: T.base, ...o });
    },

    /* SVG line draw: .ln paths (pathLength="1") draw, .hd heads fade in at the end */
    draw(t, o = {}) {
      const { delay = 0, stagger = 0, dur = 600 } = o;
      els(t).forEach((el, i) => {
        el.classList.remove('off');
        const d = delay + i * stagger;
        const lines = el.classList.contains('ln') ? [el] : [...el.querySelectorAll('.ln')];
        lines.forEach(ln => play(ln, [
          { strokeDashoffset: 1, opacity: 0, offset: 0 }, { opacity: 1, offset: 0.04 }, { strokeDashoffset: 0, opacity: 1, offset: 1 },
        ], { dur, delay: d }));
        el.querySelectorAll('.hd').forEach(h => play(h, [{ opacity: 0, offset: 0 }], { dur: 160, delay: d + dur - 120 }));
      });
    },
    /* clip-path reveal (dashed lines, panels opening) */
    wipe(t, o = {}) {
      const { delay = 0, stagger = 0, dur = 600, dir = 'right' } = o;
      const from = { right: 'inset(0 100% 0 0)', left: 'inset(0 0 0 100%)', down: 'inset(0 0 100% 0)' }[dir];
      els(t).forEach((el, i) => {
        el.classList.remove('off');
        play(el, [{ clipPath: from, offset: 0 }, { clipPath: 'inset(0 0 0 0)', offset: 1 }], { dur, delay: delay + i * stagger });
      });
    },
    /* rules and rails: scaleX 0→1 from the left */
    grow(t, o = {}) {
      const { delay = 0, stagger = 0, dur = 600 } = o;
      els(t).forEach((el, i) => {
        el.classList.remove('off');
        el.style.transformOrigin = '0 50%';
        play(el, [{ scale: '0 1', offset: 0 }], { dur, delay: delay + i * stagger });
      });
    },
    count(t, to, o = {}) {
      const { from = 0, dur = 900, delay = 0, decimals = 0 } = o;
      els(t).forEach(el => {
        el.classList.remove('off');
        tween(dur, p => { el.textContent = fmt(from + (to - from) * p, decimals); }, { delay });
      });
    },
    /* flat marker sweep behind a .hl word */
    mark(t, o = {}) {
      els(t).forEach(el => {
        el.classList.add('on');
        const bg = el.querySelector('.hl-bg');
        if (bg) play(bg, [{ scale: '0 1', offset: 0 }], { dur: 400, delay: o.delay || 0 });
      });
    },
    /* FLIP: measure, apply the change, animate from the old box to the new one */
    flip(t, change, o = {}) {
      const list = els(t);
      const first = list.map(rect);
      change();
      if (instant()) return;
      const last = list.map(rect);
      list.forEach((el, i) => {
        const f = first[i], l = last[i];
        if (!l.width || !l.height) return;
        el.style.transformOrigin = '0 0';
        const kf = [{ transform: `translate(${f.left - l.left}px, ${f.top - l.top}px) scale(${f.width / l.width}, ${f.height / l.height})`, offset: 0 }];
        if (o.fadeIn) { kf[0].opacity = 0; kf.push({ opacity: 1, offset: 0.35 }); }
        play(el, kf, { dur: o.dur ?? T.flip, delay: (o.delay || 0) + i * (o.stagger || 0) });
      });
    },
    moveTo(t, pos, o = {}) {
      FX.flip(t, () => els(t).forEach(el => {
        if (pos.left != null) el.style.left = pos.left + 'px';
        if (pos.top != null) el.style.top = pos.top + 'px';
      }), { dur: 600, ...o });
    },
    /* the only shake allowed: one 6 px wobble, two cycles */
    wobble(t, o = {}) {
      els(t).forEach(el => play(el, [
        { translate: '0 0' }, { translate: '-6px 0' }, { translate: '6px 0' }, { translate: '-6px 0' }, { translate: '6px 0' }, { translate: '0 0' },
      ], { dur: 420, delay: o.delay || 0, easing: 'ease-in-out' }));
    },
    spin(t, o = {}) {
      els(t).forEach(el => {
        el.style.transformOrigin = '960px 590px';
        play(el, [{ rotate: '0deg', offset: 0 }, { rotate: '360deg', offset: 1 }], { dur: o.dur || 800, delay: o.delay || 0 });
      });
    },
    /* very slow scale on full-bleed photos; ambient, never blocks a beat */
    kenburns(t) {
      if (PRINT) return;
      els(t).forEach(el => el.animate([{ scale: 1 }, { scale: 1.06 }], { duration: 12000, easing: 'linear', fill: 'forwards' }));
    },
  };
  window.FX = FX;

  /* ---------------------------------------------------------------
     Scenes
     --------------------------------------------------------------- */
  const state = { si: 0, bi: 0, layer: null };
  const nBeats = si => SCENES[si].beats.length - 1;
  const TOTAL = SCENES.reduce((n, s) => n + s.beats.length, 0);

  function build(si) {
    const def = SCENES[si];
    const el = document.createElement('section');
    el.className = `scene ${def.id} bg-${def.bg}`;
    el.innerHTML = def.html;
    return el;
  }
  function runBeats(el, si, from, to, animateLast) {
    const def = SCENES[si];
    const prevRoot = FX.root, prevInstant = A.instant;
    FX.root = el;
    try {
      for (let b = from; b <= to; b++) {
        A.instant = !(animateLast && b === to);
        if (def.beats[b]) def.beats[b](FX);
      }
    } finally {
      A.instant = prevInstant;
      FX.root = prevRoot || el;
    }
  }
  const shown = (el, root) => {
    for (let n = el; n && n !== root; n = n.parentElement) if (n.classList.contains('off')) return false;
    return true;
  };

  /* shared elements: an overlay clone travels from the old box to the new one */
  function crossFlip(old, nw, delay) {
    nw.querySelectorAll('[data-flip]').forEach(target => {
      if (!shown(target, nw)) return;
      const src = old.querySelector(`[data-flip="${target.dataset.flip}"]`);
      if (!src || !shown(src, old)) return;
      const f = rect(src), l = rect(target), base = rect(stage);
      const fade = target.hasAttribute('data-flip-fade');
      const clone = target.cloneNode(true);
      clone.removeAttribute('id');
      Object.assign(clone.style, {
        position: 'absolute', margin: '0', left: (l.left - base.left) + 'px', top: (l.top - base.top) + 'px',
        width: l.width + 'px', height: l.height + 'px', transformOrigin: '0 0',
      });
      flipLayer.appendChild(clone);
      if (!fade) src.style.visibility = 'hidden';
      target.style.visibility = 'hidden';
      const kf = [{ transform: `translate(${f.left - l.left}px, ${f.top - l.top}px) scale(${f.width / l.width}, ${f.height / l.height})`, offset: 0 }];
      if (fade) { kf[0].opacity = 0; kf.push({ opacity: 1, offset: 0.5 }); }
      play(clone, kf, { dur: T.flip, delay, done: () => { clone.remove(); target.style.visibility = ''; } });
    });
  }

  function enterScene(si, bi, o = {}) {
    const old = state.layer, oldSi = state.si;
    const el = build(si);
    stage.insertBefore(el, old || flipLayer);   // new scene sits under the old one
    state.layer = el; state.si = si; state.bi = bi;
    runBeats(el, si, 0, bi, false);
    if (!old) return;
    if (o.cut || instant()) { old.remove(); return; }
    let delay = 0;
    const odef = SCENES[oldSi];
    if (o.outro && odef.outro) {
      FX.root = old;
      delay = odef.outro(FX) || 0;
      FX.root = el;
    }
    if (o.flip) crossFlip(old, el, delay);
    old.style.opacity = '0';
    old.style.pointerEvents = 'none';
    play(old, [{ opacity: 1, offset: 0 }], { dur: T.cross, delay, done: () => old.remove() });
  }
  function rebuild(si, bi) {           // instant, exact state (used when going back)
    const old = state.layer;
    const el = build(si);
    stage.insertBefore(el, old || flipLayer);
    if (old) old.remove();
    state.layer = el; state.si = si; state.bi = bi;
    runBeats(el, si, 0, bi, false);
  }

  function stepForward() {
    finishAll();
    const { si, bi } = state;
    if (bi < nBeats(si)) {
      state.bi = bi + 1;
      runBeats(state.layer, si, state.bi, state.bi, true);
    } else if (si < SCENES.length - 1) {
      enterScene(si + 1, 0, { flip: true, outro: true });
    } else return false;
    moved();
    return true;
  }
  function stepBack() {
    finishAll();
    const { si, bi } = state;
    if (bi > 0) rebuild(si, bi - 1);
    else if (si > 0) enterScene(si - 1, nBeats(si - 1), { cut: inp.holding });
    else return false;
    moved();
    return true;
  }
  function jump(si, bi = 0) {
    finishAll();
    enterScene(si, bi, {});
    moved();
  }

  /* ---------------------------------------------------------------
     Indicator, progress, black screen, cursor
     --------------------------------------------------------------- */
  const ind = document.getElementById('ind');
  const prog = document.getElementById('progress');
  const black = document.getElementById('black');
  const FF = '<svg width="22" height="14" viewBox="0 0 22 14"><path d="M0 0l10 7-10 7zM11 0l10 7-10 7z" fill="currentColor"/></svg>';
  const RW = '<svg width="22" height="14" viewBox="0 0 22 14"><path d="M22 0 12 7l10 7zM11 0 1 7l10 7z" fill="currentColor"/></svg>';
  let indTimer = 0;
  function indicate(html, persist) {
    clearTimeout(indTimer);
    ind.innerHTML = html;
    ind.classList.add('on');
    if (!persist) indTimer = setTimeout(() => ind.classList.remove('on'), 600);
  }
  function indicateLater(ms = 600) { clearTimeout(indTimer); indTimer = setTimeout(() => ind.classList.remove('on'), ms); }

  function moved() {
    let n = 0;
    for (let s = 0; s < state.si; s++) n += SCENES[s].beats.length;
    prog.style.width = ((n + state.bi) / (TOTAL - 1) * 100).toFixed(2) + '%';
    if (auto.on) resetAuto();
  }

  let idleTimer = 0;
  function wake() {
    document.body.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => document.body.classList.add('idle'), 1500);
  }

  /* ---------------------------------------------------------------
     Auto mode: B0 shows at once, each beat stays for its autoMs value,
     +1.5 s at every Part change (simulated handover).
     --------------------------------------------------------------- */
  const auto = { on: false, paused: false, remaining: 0, rate: 1 };
  function beatMs(si, bi) {
    const def = SCENES[si];
    let ms = bi === 0 ? (def.b0Ms ?? B0_HOLD) : (def.autoMs[bi - 1] ?? 3000);
    if (bi === nBeats(si) && si < SCENES.length - 1 && SCENES[si + 1].part !== def.part) ms += PART_PAUSE;
    return ms;
  }
  function resetAuto() { auto.remaining = beatMs(state.si, state.bi); }
  function toggleAuto() {
    if (auto.on && auto.paused) { auto.paused = false; resetAuto(); indicate('Auto'); return; }
    auto.on = !auto.on; auto.paused = false; auto.rate = 1;
    if (auto.on) resetAuto();
    indicate(auto.on ? 'Auto' : 'Auto off');
  }

  let lastNow = performance.now();
  function frame(now) {
    const dt = Math.min(100, now - lastNow);
    lastNow = now;
    for (const tw of [...A.tweens]) {
      const p = Math.min(1, Math.max(0, (now - tw.t0) / tw.d));
      tw.update(tw.ease(p));
      if (p >= 1) A.tweens.delete(tw);
    }
    if (auto.on && !auto.paused && !black.classList.contains('on')) {
      auto.remaining -= dt * auto.rate;
      if (auto.remaining <= 0) {
        if (!stepForward()) { auto.on = false; } else resetAuto();
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------
     Input: tap acts at once; a second tap within 350 ms overrides it
     (scene jump); key down > 400 ms becomes a hold (own timer, no OS repeat).
     --------------------------------------------------------------- */
  const inp = { dir: 0, key: null, holdTimer: 0, stepTimer: 0, holding: false, holdStart: 0, last: null };

  function press(dir, key) {
    if (inp.dir) return;
    inp.dir = dir; inp.key = key;
    const now = performance.now();
    const l = inp.last;
    if (l && l.dir === dir && now - l.t < DOUBLE_MS) {
      inp.last = null;
      doubleTap(dir, l.origin);
    } else {
      inp.last = { dir, t: now, origin: { si: state.si, bi: state.bi } };
      if (dir > 0) stepForward(); else stepBack();
    }
    clearTimeout(inp.holdTimer);
    inp.holdTimer = setTimeout(startHold, HOLD_MS);
  }
  function release(key) {
    if (!inp.dir || (key && key !== inp.key)) return;
    clearTimeout(inp.holdTimer);
    clearTimeout(inp.stepTimer);
    const wasHolding = inp.holding;
    inp.dir = 0; inp.key = null;
    if (wasHolding) endHold();
  }
  function doubleTap(dir, origin) {
    let target;
    if (dir > 0) {
      if (origin.si >= SCENES.length - 1) return;
      target = origin.si + 1;
    } else {
      target = origin.bi > 0 ? origin.si : Math.max(0, origin.si - 1);
    }
    if (state.si === target && state.bi === 0) { finishAll(); return; }
    jump(target, 0);
    indicate(`Scene ${target + 1}`);
  }
  function startHold() {
    if (!inp.dir) return;
    inp.holding = true;
    inp.last = null;
    inp.holdStart = performance.now();
    if (auto.on && !auto.paused && inp.dir > 0) {
      auto.rate = 2; A.speed = 2;
      indicate(`${FF}<span>2×</span>`, true);
      return;
    }
    if (auto.on && inp.dir < 0) auto.paused = true;
    holdTick();
  }
  function holdTick() {
    if (!inp.holding) return;
    const fast = performance.now() - inp.holdStart > HOLD_FAST_AFTER;
    A.speed = 4;
    A.skip = fast || inp.dir < 0;
    indicate(inp.dir > 0 ? `${FF}<span>${fast ? '8×' : '4×'}</span>` : `${RW}<span>${fast ? '8×' : '4×'}</span>`, true);
    const ok = inp.dir > 0 ? stepForward() : stepBack();
    if (!ok) return;                       // first or last beat: stop here
    inp.stepTimer = setTimeout(holdTick, fast ? HOLD_STEP_FAST : HOLD_STEP);
  }
  function endHold() {
    inp.holding = false;
    finishAll();
    A.speed = 1; A.skip = false; auto.rate = 1;
    if (auto.on) resetAuto();
    indicateLater(600);
  }

  const NEXT = new Set(['ArrowRight', 'PageDown', ' ', 'Spacebar', 'ArrowDown']);
  const PREV = new Set(['ArrowLeft', 'PageUp', 'ArrowUp']);
  function onKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (NEXT.has(k) || PREV.has(k)) {
      e.preventDefault();
      if (!e.repeat) press(NEXT.has(k) ? 1 : -1, 'k:' + k);
      return;
    }
    if (e.repeat) return;
    if (k === 'Home') { e.preventDefault(); jump(0, 0); indicate('Scene 1'); return; }
    const lk = k.toLowerCase();
    if (lk === 'f') toggleFullscreen();
    else if (lk === 'b' || k === '.') black.classList.toggle('on');
    else if (lk === 'a') toggleAuto();
    else if (lk === 'p') prog.classList.toggle('on');
    else if (/^[1-6]$/.test(k)) {
      const part = 'ABCDEF'[+k - 1];
      const si = SCENES.findIndex(s => s.part === part);
      if (si >= 0) { jump(si, 0); indicate(`Scene ${si + 1}`); }
    }
  }
  function onKeyUp(e) { if (NEXT.has(e.key) || PREV.has(e.key)) release('k:' + e.key); }
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }

  function fit() {
    scale = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  function preload() {
    const srcs = new Set();
    SCENES.forEach(s => (s.html.match(/assets\/img\/[\w.-]+/g) || []).forEach(u => srcs.add(u)));
    srcs.forEach(src => { const im = new Image(); im.src = src; });
  }

  /* one page per scene, final beat, for slides.pdf */
  function renderPrint() {
    document.body.classList.add('print');
    stage.remove();
    SCENES.forEach((def, si) => {
      const el = build(si);
      el.classList.add('page');
      document.body.appendChild(el);
      runBeats(el, si, 0, nBeats(si), false);
    });
    document.body.dataset.ready = '1';
  }

  function start() {
    if (PRINT) { renderPrint(); return; }
    fit();
    addEventListener('resize', fit);
    preload();
    const si = Math.min(SCENES.length - 1, Math.max(0, (parseInt(params.get('scene'), 10) || 1) - 1));
    const bi = Math.min(nBeats(si), Math.max(0, parseInt(params.get('beat'), 10) || 0));
    enterScene(si, bi);
    moved();
    addEventListener('keydown', onKeyDown);
    addEventListener('keyup', onKeyUp);
    addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      press(e.clientX >= innerWidth / 2 ? 1 : -1, 'mouse');
    });
    addEventListener('pointerup', () => release('mouse'));
    addEventListener('pointercancel', () => release('mouse'));
    addEventListener('blur', () => release());
    addEventListener('contextmenu', e => e.preventDefault());
    addEventListener('mousemove', wake);
    wake();
    requestAnimationFrame(frame);
    // rehearsal / test hook
    window.show = {
      goto(s, b = 0) { finishAll(); enterScene(s, b, { cut: true }); moved(); },
      next: stepForward, prev: stepBack, finishAll, state, total: TOTAL,
      beats: SCENES.map((s, i) => nBeats(i)),
    };
    document.body.dataset.ready = '1';
  }

  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start, start);
})();
