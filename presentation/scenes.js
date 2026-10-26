/* Scene data for "Blockchain in the Oil & Gas Industry".
   Each scene: markup + beats. beats[0] is the state when the scene opens (B0);
   beats[1..n] are the presses marked ▸ in script.md. Elements with class "off" start hidden.
   Auto mode: B0 holds b0Ms (no narration before the first ▸), then each beat stays for its autoMs value. */
(() => {
  'use strict';

  /* ---------- line icons (48 × 48 grid) ---------- */
  function gearD(cx, cy, ro, ri, n) {
    let d = '';
    const w = Math.PI / n;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * 2 * Math.PI - Math.PI / 2;
      [[ri, a - w * 0.62], [ro, a - w * 0.34], [ro, a + w * 0.34], [ri, a + w * 0.62]].forEach(([r, t], j) => {
        d += (k === 0 && j === 0 ? 'M' : 'L') + (cx + r * Math.cos(t)).toFixed(1) + ' ' + (cy + r * Math.sin(t)).toFixed(1);
      });
    }
    return d + 'Z';
  }

  const PAGE = '<path class="page" d="M14 5h14l10 10v26a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M28 5v10h10"/>';
  const ICONS = {
    ship: '<path d="M5 30h38l-4.4 8.6a2 2 0 0 1-1.8 1.1H11.2a2 2 0 0 1-1.8-1.1Z"/><path d="M30 30v-9h8v9"/><path d="M34 21v-4"/><path d="M9 30v-4h17v4"/>',
    doc: PAGE + '<path d="M18 24h14M18 30h14M18 36h9"/>',
    mail: '<rect x="6" y="11" width="36" height="26" rx="3"/><path d="m7.5 13.5 16.5 12.5 16.5-12.5"/>',
    pdf: PAGE + '<rect x="15" y="24" width="20" height="11" rx="2"/><text x="25" y="32.4" text-anchor="middle" font-size="7.6" font-family="IBM Plex Mono" font-weight="500" fill="currentColor" stroke="none">PDF</text>',
    sheet: '<rect x="11" y="5" width="26" height="38" rx="2.5"/><path d="M16 14h16M16 20h16M16 26h16M16 32h10"/>',
    clock: '<circle cx="24" cy="24" r="17"/><path d="M24 14v10l7 4.5"/>',
    xmark: '<circle cx="24" cy="24" r="17"/><path d="m17.5 17.5 13 13M30.5 17.5l-13 13"/>',
    warn: '<path d="M21.4 8.5a3 3 0 0 1 5.2 0l15 26a3 3 0 0 1-2.6 4.5H9a3 3 0 0 1-2.6-4.5Z"/><path d="M24 19v9"/><path d="M24 33.5v.1"/>',
    book: '<path d="M10 38V10a4 4 0 0 1 4-4h24v28H14a4 4 0 0 0-4 4 4 4 0 0 0 4 4h24v-8"/><path d="M17 14h14M17 20h10"/>',
    lock: '<rect x="11" y="21" width="26" height="20" rx="3.5"/><path d="M16 21v-5a8 8 0 0 1 16 0v5"/><path d="M24 29v4.5"/>',
    people: '<circle cx="18" cy="16" r="6.5"/><path d="M6 39v-1.5A9.5 9.5 0 0 1 15.5 28h5a9.5 9.5 0 0 1 9.5 9.5V39"/><circle cx="33.5" cy="15" r="5"/><path d="M34 25h1a8 8 0 0 1 8 8v2"/>',
    plug: '<path d="M18 5v9M30 5v9"/><path d="M13 14h22v7a11 11 0 0 1-22 0Z"/><path d="M24 32v11"/>',
    scales: '<path d="M24 7v33M16 41h16M9 13h30"/><path d="M9 13 4 25a5 5 0 0 0 10 0Z"/><path d="m39 13-5 12a5 5 0 0 0 10 0Z"/>',
    eyeoff: '<path d="M4 24s7.5-12 20-12 20 12 20 12-7.5 12-20 12S4 24 4 24Z"/><circle cx="24" cy="24" r="5"/><path d="m8 8 32 32"/>',
    funnel: '<path d="M6 9h36L28 25.5V37l-8 4V25.5Z"/>',
    shield: '<path d="M24 5 39 10.5V22c0 9.6-6.3 16.6-15 20.5C15.3 38.6 9 31.6 9 22V10.5Z"/><path d="m17.5 23.5 4.5 4.5 9-9.5"/>',
    timeline: '<path d="M4 31h4M16 31h4M28 31h4M40 31h4"/><circle cx="12" cy="31" r="4"/><circle cx="24" cy="31" r="4"/><circle cx="36" cy="31" r="4"/><path d="M12 13v8M24 17v4M36 9v12"/>',
    gearcheck: '<path d="' + gearD(21, 21, 15, 11, 8) + '"/><circle cx="21" cy="21" r="4.5"/><circle class="page" cx="35.5" cy="35.5" r="8.5"/><path d="m31.5 35.8 3 3 5.2-6"/>',
    truck: '<path d="M8 33H4V12h24v21H16"/><path d="M28 18h8.5l6.5 7.5V33h-4M28 33h3"/><circle cx="12" cy="34" r="4"/><circle cx="35" cy="34" r="4"/>',
    pipe: '<path d="M4 18h40M4 30h40"/><path d="M13 13v22M35 13v22"/>',
    tank: '<ellipse cx="24" cy="13" rx="15" ry="5"/><path d="M9 13v21c0 2.8 6.7 5 15 5s15-2.2 15-5V13"/><path d="M9 23.5c0 2.8 6.7 5 15 5s15-2.2 15-5"/>',
    bank: '<path d="M6 18 24 8l18 10Z"/><path d="M11 22v13M19 22v13M29 22v13M37 22v13"/><path d="M6 40h36"/>',
    inspect: '<circle cx="21" cy="21" r="13"/><path d="m30.5 30.5 10 10"/><path d="m15.5 21 4 4 7-8"/>',
    monitor: '<rect x="5" y="8" width="38" height="25" rx="3"/><path d="M17 41h14M24 33v8"/>',
    leaf: '<path d="M9 39C9 20 21 9 40 9c0 19-11 30-31 30Z"/><path d="M9 39 26 22"/>',
    tag: '<path d="M24.2 6H40a2 2 0 0 1 2 2v15.8a2 2 0 0 1-.6 1.4L25.2 41.4a2 2 0 0 1-2.8 0L6.6 25.6a2 2 0 0 1 0-2.8L22.8 6.6a2 2 0 0 1 1.4-.6Z"/><circle cx="34" cy="14" r="3"/>',
    case: '<rect x="5" y="14" width="38" height="26" rx="3"/><path d="M17 14v-3a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"/><path d="M5 25h38"/><path d="M21 25v4h6v-4"/>',
    deal: PAGE + '<path d="M18 16h10M18 22h14"/><path d="M17 34c2-4 4-4 5 0s3 3 5-1 3-2 5 1"/>',
    check: '<path d="m11 25 8.5 8.5L37 15"/>',
    x: '<path d="m14 14 20 20M34 14 14 34"/>',
  };

  /* six different paperwork formats: same page, different tag (motif 4) */
  const TAGS = [
    '<rect class="tag" x="17" y="10" width="7" height="7" rx="1.5" style="fill:var(--ink-soft)"/>',
    '<path class="tag" d="M12.9 37.5h24.2V41a1.5 1.5 0 0 1-1.5 1.5H14.4a1.5 1.5 0 0 1-1.5-1.5Z" style="fill:var(--line)"/>',
    '<circle class="tag" cx="32" cy="36" r="3.6" style="fill:var(--ink-soft)"/>',
    '<path class="tag" d="M28.6 5.8v8.6h8.6Z" style="fill:var(--line)"/>',
    '<rect class="tag" x="17" y="10" width="9" height="3" rx="1.5" style="fill:var(--ink-soft)"/><rect class="tag" x="17" y="15" width="5" height="3" rx="1.5" style="fill:var(--line)"/>',
    '<rect class="tag" x="13.6" y="9" width="2.6" height="30" rx="1.3" style="fill:var(--line)"/>',
  ];

  const sw = size => ((size >= 56 ? 3 : 2.5) * 48 / size).toFixed(2);
  const svg48 = (inner, size, cls = '') =>
    `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 48 48" style="stroke-width:${sw(size)}" aria-hidden="true">${inner}</svg>`;
  const icon = (name, size = 48, cls = '') => svg48(ICONS[name], size, cls);
  const docIcon = (v, size = 48, cls = '') => svg48(ICONS.doc + TAGS[v % TAGS.length], size, cls);

  /* small right-pointing arrow drawn with line + head (draw() animates .ln, fades .hd) */
  const arrow = (w = 48, cls = '') =>
    `<svg class="ico arr ${cls}" width="${w}" height="24" viewBox="0 0 ${w} 24" style="stroke-width:2.5" aria-hidden="true">` +
    `<path class="ln" pathLength="1" d="M2 12H${w - 3}"/><path class="hd" d="M${w - 10} 5l7 7-7 7"/></svg>`;
  const tick = (size = 40, cls = '') =>
    `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 48 48" style="stroke-width:${(4 * 48 / size).toFixed(2)}" aria-hidden="true"><path class="ln" pathLength="1" d="m11 25 8.5 8.5L37 15"/></svg>`;
  const xIcon = (size = 32, cls = '') =>
    `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 48 48" style="stroke-width:${(4 * 48 / size).toFixed(2)}" aria-hidden="true">${ICONS.x}</svg>`;

  const PH = name => `assets/img/${name}.jpg`;
  const COLX = [120, 690.67, 1261.33];      // the three 4-column groups
  const COLW = 538.67;

  const S = [];

  /* =========================== PART A =========================== */

  /* S1 · The hook */
  S.push({
    id: 's1', part: 'A', bg: 'night', b0Ms: 900,
    autoMs: [2200, 5600, 4000, 3300],
    html: `
      <div class="photo off" id="s1-photo"><img src="${PH('tanker')}" alt=""><div class="scrim"></div></div>
      <div class="abs s1-docs" style="left:120px;top:590px">
        <span class="s1-doc off">${icon('mail', 64)}</span>
        <span class="s1-doc off">${icon('pdf', 64)}</span>
        <span class="s1-doc off">${icon('sheet', 64)}</span>
        <span class="label w80 off" id="s1-docs-l">emails · PDFs · paper</span>
      </div>
      <div class="abs s1-stat off" id="s1-bbl" style="left:120px;top:704px"><span class="mono" id="s1-num">2,000,000</span><span class="kw w80 s1-unit">barrels</span></div>
      <div class="abs kw w80 off" id="s1-usd" style="left:120px;top:830px">&gt; $100 million cargo</div>
      <div class="abs serif s1-q off" id="s1-q">How is blockchain changing that?</div>
      <div class="abs s1-dark off" id="s1-dark"></div>`,
    beats: [
      null,
      f => { f.fade('#s1-photo', { dur: 800 }); f.kenburns('#s1-photo img'); },
      f => { f.show('#s1-bbl'); f.count('#s1-num', 2000000, { dur: 900 }); f.show('#s1-usd', { delay: 80 }); },
      f => {
        f.dim(['#s1-bbl', '#s1-usd'], true, 'faint');
        f.show('.s1-doc', { y: -16, stagger: 120 });
        f.show('#s1-docs-l', { delay: 360 });
      },
      f => {
        f.hide(['#s1-bbl', '#s1-usd', '.s1-doc', '#s1-docs-l']);
        f.show('#s1-q', { delay: 150 });
      },
    ],
    outro: f => { f.fade('#s1-dark', { dur: 300 }); return 300; },
  });

  /* S2 · Title and roadmap */
  const ROAD = ['How the oil business works', 'What blockchain is', 'Where it’s used', 'Real example: VAKT', 'Challenges &amp; benefits'];
  S.push({
    id: 's2', part: 'A', bg: 'paper', b0Ms: 1200,
    autoMs: [6000, 10500],
    html: `
      <div class="abs" style="left:120px;top:384px;width:967px">
        <div class="eyebrow off" id="s2-eb">CGEB4112 · Group 10</div>
        <h1 class="s2-title off" id="s2-title">Blockchain in the<br>Oil &amp; Gas Industry</h1>
        <div class="s2-rule off" id="s2-rule"></div>
      </div>
      <ol class="abs s2-road" style="left:1119px;top:296px;width:681px">
        ${ROAD.map((t, i) => `<li class="off"><span class="mono">0${i + 1}</span><span>${t}</span></li>`).join('')}
      </ol>`,
    beats: [
      null,
      f => { f.show('#s2-eb'); f.show('#s2-title', { delay: 80 }); f.grow('#s2-rule', { delay: 380, dur: 500 }); },
      f => { f.show('.s2-road li', { stagger: 80 }); },
    ],
  });

  /* S3 · The value chain (creates motif 1) */
  const STAGES = [
    { k: 'up', name: 'Upstream', sub: 'Find · Drill · Produce', img: 'upstream' },
    { k: 'mid', name: 'Midstream', sub: 'Transport · Store', img: 'midstream' },
    { k: 'down', name: 'Downstream', sub: 'Refine · Sell', img: 'downstream' },
  ];
  const dotX = i => COLX[i] + COLW / 2 - 14;
  S.push({
    id: 's3', part: 'A', bg: 'paper', b0Ms: 1200,
    autoMs: [3200, 5200, 4400, 7200, 3200],
    html: `
      <h2 class="title">Three stages of oil</h2>
      <div class="rail off" id="s3-rail" style="left:120px;top:859px;width:1680px"></div>
      ${STAGES.map((s, i) => `
        <div class="vc" id="s3-c${i + 1}" style="left:${COLX[i]}px">
          <div class="vc-frame off"></div>
          <div class="vc-ph off"><img src="${PH(s.img)}" alt=""></div>
          <div class="vc-name off">${s.name}</div>
          <div class="vc-sub label off">${s.sub}</div>
        </div>`).join('')}
      <div class="cargo off" id="s3-dot" style="left:106px;top:845px"></div>
      <svg class="abs ico off" id="s3-br" width="1680" height="30" viewBox="0 0 1680 30" style="left:120px;top:282px;stroke-width:3;color:var(--petrol)">
        <path class="ln" pathLength="1" d="M2 28V4h1676v24"/></svg>
      <div class="abs label petrol off" id="s3-br-l" style="right:120px;top:232px;font-weight:600">Petronas: all three</div>`,
    beats: [
      null,
      f => {
        f.grow('#s3-rail', { dur: 600 });
        f.show('.s3 .vc-frame', { delay: 200, stagger: 80 });
        f.show('#s3-dot', { delay: 350, y: 0 });
      },
      f => { fill(f, 1); f.moveTo('#s3-dot', { left: dotX(0) }); },
      f => { fill(f, 2); f.moveTo('#s3-dot', { left: dotX(1) }); f.dim('#s3-c1', true, 'd60'); },
      f => { fill(f, 3); f.moveTo('#s3-dot', { left: dotX(2) }); f.dim('#s3-c2', true, 'd60'); },
      f => {
        f.dim(['#s3-c1', '#s3-c2'], false, 'd60');
        f.draw('#s3-br', { delay: 100 });
        f.show('#s3-br-l', { delay: 400 });
      },
    ],
  });
  function fill(f, n) {
    f.fade(`#s3-c${n} .vc-ph`, { dur: 500 });
    f.show([`#s3-c${n} .vc-name`, `#s3-c${n} .vc-sub`], { delay: 150 });
  }

  /* =========================== PART B =========================== */

  /* S4 · Many hands on one cargo */
  const CG = { x: 960, y: 590 };
  const HANDS = [
    { k: 'seller', name: 'Seller', ico: 'tag', x: 310, y: 590 },
    { k: 'buyer', name: 'Buyer', ico: 'case', x: 1610, y: 590 },
    { k: 'bank', name: 'Bank', ico: 'bank', x: 542, y: 398 },
    { k: 'ship', name: 'Shipping', ico: 'ship', x: 1378, y: 398 },
    { k: 'insp', name: 'Inspector', ico: 'inspect', x: 542, y: 782 },
    { k: 'term', name: 'Terminal', ico: 'tank', x: 1378, y: 782 },
  ];
  const spoke = n => {
    const dx = CG.x - n.x, dy = CG.y - n.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    return `M${(n.x + ux * 54).toFixed(1)} ${(n.y + uy * 54).toFixed(1)}L${(CG.x - ux * 102).toFixed(1)} ${(CG.y - uy * 102).toFixed(1)}`;
  };
  const cycleArc = a => {
    const r = 112, p = t => [CG.x + r * Math.cos(t), CG.y + r * Math.sin(t)].map(v => v.toFixed(1)).join(' ');
    const a0 = a * Math.PI / 180, a1 = (a + 62) * Math.PI / 180;
    const [hx, hy] = [CG.x + r * Math.cos(a1), CG.y + r * Math.sin(a1)];
    const tx = -Math.sin(a1), ty = Math.cos(a1);            // tangent direction at the arc end
    const nx = Math.cos(a1), ny = Math.sin(a1);
    const h1 = `${(hx - tx * 11 + nx * 7).toFixed(1)} ${(hy - ty * 11 + ny * 7).toFixed(1)}`;
    const h2 = `${(hx - tx * 11 - nx * 7).toFixed(1)} ${(hy - ty * 11 - ny * 7).toFixed(1)}`;
    return `<path d="M${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}"/><path d="M${h1}L${hx.toFixed(1)} ${hy.toFixed(1)}L${h2}"/>`;
  };
  S.push({
    id: 's4', part: 'B', bg: 'paper', b0Ms: 1200,
    autoMs: [3600, 2800, 8600, 4400],
    html: `
      <h2 class="title">One cargo, many hands</h2>
      <svg class="abs ico s4-lines" width="1920" height="1080" viewBox="0 0 1920 1080" style="left:0;top:0;stroke-width:2.5">
        <path class="ln off" id="s4-l-sb" pathLength="1" d="M362 590H1558"/>
        ${HANDS.slice(2).map(n => `<path class="ln off s4-sp" pathLength="1" d="${spoke(n)}"/>`).join('')}
      </svg>
      <div class="s4-cargo" style="left:${CG.x - 92}px;top:${CG.y - 92}px">${icon('ship', 104)}</div>
      <svg class="abs ico s4-cycle off" width="1920" height="1080" viewBox="0 0 1920 1080" style="left:0;top:0;stroke-width:3">
        ${[0, 120, 240].map(cycleArc).join('')}
      </svg>
      <div class="abs label crude off" id="s4-sold" style="left:${CG.x - 250}px;width:500px;top:704px;text-align:center">bought &amp; sold many times</div>
      ${HANDS.map((n, i) => `
        <div class="ng" style="left:${n.x}px;top:${n.y}px">
          <div class="node off" id="s4-${n.k}">${icon(n.ico, 48)}</div>
          <div class="node-l label off" id="s4-${n.k}-l">${n.name}</div>
          <div class="ndoc off" data-flip="doc${i}">${docIcon(i, 52)}</div>
        </div>`).join('')}
      <div class="abs label off" id="s4-own" style="left:560px;width:800px;top:930px;text-align:center">each keeps its own records</div>`,
    beats: [
      null,
      f => {
        f.show('#s4-sold');
        f.fade('.s4-cycle', { dur: 200 });
        f.spin('.s4-cycle', { dur: 800 });
        f.hide('.s4-cycle', { delay: 650, dur: 200 });
      },
      f => {
        f.show(['#s4-seller', '#s4-seller-l', '#s4-buyer', '#s4-buyer-l'], { stagger: 60 });
        f.draw('#s4-l-sb', { delay: 200, dur: 600 });
      },
      f => {
        f.show(['#s4-bank', '#s4-bank-l', '#s4-ship', '#s4-ship-l', '#s4-insp', '#s4-insp-l', '#s4-term', '#s4-term-l'], { stagger: 50 });
        f.draw('.s4-sp', { delay: 150, stagger: 100, dur: 400 });
      },
      f => { f.show('.s4 .ndoc', { stagger: 80 }); f.show('#s4-own', { delay: 380 }); },
    ],
  });

  /* S5 · The paper problem */
  const PILE = [[300, 470, -10], [416, 432, 7], [348, 560, 3], [462, 548, -6], [326, 652, 12], [452, 668, -3]];
  const PAPERS = [
    { k: 'contract', name: 'Contract', sub: '', v: 0 },
    { k: 'bol', name: 'Bill of lading', sub: 'proves who owns the cargo', v: 2 },
    { k: 'loc', name: 'Letter of credit', sub: 'bank guarantees payment', v: 4 },
  ];
  const PROBLEMS = [
    { k: 'slow', word: 'Slow', ico: 'clock', cls: '' },
    { k: 'err', word: 'Mistakes', ico: 'xmark', cls: '' },
    { k: 'fraud', word: 'Fraud', ico: 'warn', cls: 'risk' },
  ];
  S.push({
    id: 's5', part: 'B', bg: 'paper', b0Ms: 1200,
    autoMs: [4600, 9000, 5200, 12600, 4900],
    html: `
      <div class="s5-main">
        <h2 class="title">The paper problem</h2>
        ${PILE.map(([x, y, r], i) => `<div class="pdoc p${i}" data-flip="doc${i}" style="left:${x}px;top:${y}px"><div class="rot" style="rotate:${r}deg">${docIcon(i, 150)}</div></div>`).join('')}
        <div class="abs s5-count off" id="s5-count">checked <span class="mono">×<span id="s5-n">6</span></span></div>
        <div class="abs label off" id="s5-count-l" style="left:120px;width:720px;top:860px;text-align:center">same deal, re-checked again and again</div>
        <div class="abs label off" id="s5-mail-l" style="left:1600px;top:262px">email / courier</div>
        ${PAPERS.map((p, i) => `
          <div class="s5-card off" id="s5-${p.k}" style="top:${300 + i * 176}px">
            ${docIcon(p.v, 56)}
            <div><div class="s5-cn">${p.name}</div>${p.sub ? `<div class="s5-cs label">${p.sub}</div>` : ''}</div>
          </div>
          <div class="abs s5-arr off" style="left:1580px;top:${300 + i * 176 + 48}px">
            <svg class="ico" width="300" height="40" viewBox="0 0 300 40" style="stroke-width:2.5"><path class="dash" d="M2 20H286"/><path d="M276 11l9 9-9 9"/></svg>
            <span class="s5-env">${icon('mail', 40)}</span>
          </div>`).join('')}
        ${PROBLEMS.map((p, i) => `
          <div class="s5-prob off ${p.cls}" id="s5-${p.k}" style="top:${370 + i * 164}px">${icon(p.ico, 88)}<span>${p.word}</span></div>`).join('')}
      </div>
      <div class="photo off" id="s5-photo">
        <img src="${PH('singapore-port')}" alt=""><div class="scrim"></div>
        <div class="abs eyebrow w80 off s5-ht" style="left:120px;top:600px;color:rgba(255,255,255,.8)">Singapore · 2020</div>
        <div class="abs serif off s5-ht" style="left:120px;top:634px;font-size:72px;line-height:1.1;color:#fff">Hin Leong collapses</div>
        <div class="abs kw off s5-ht" style="left:120px;top:732px;color:#fff">US$<span class="tnum" id="s5-bn">3.5</span> bn owed to 23 banks</div>
        <div class="abs label w80 off s5-ht" style="left:120px;top:800px">forged documents · same cargo financed more than once</div>
        <div class="abs cap off s5-ht" style="right:120px;top:950px;color:rgba(255,255,255,.7)">Sources: PwC report via GTR, CNBC, 2020</div>
      </div>
      <div class="abs serif s5-truth off" id="s5-truth">No <span class="hl">single<i class="hl-bg"></i></span> version of the truth.</div>`,
    beats: [
      null,
      f => { f.show('#s5-count', { y: 0 }); f.count('#s5-n', 6, { from: 1, dur: 900 }); f.show('#s5-count-l', { delay: 200 }); },
      f => {
        f.hide('#s5-count-l');
        PAPERS.forEach((p, i) => {
          // each card slides out of the pile (from where the pile sits) to its place on the right
          const card = f.q(`#s5-${p.k}`);
          f.show(card, { x: -560, y: 232 - i * 176, delay: i * 150, dur: 500 });
        });
        f.hide(['.s5 .p5', '.s5 .p3', '.s5 .p4'], { stagger: 150, dur: 250 });
        f.wipe('.s5-arr', { delay: 200, stagger: 120, dur: 400 });
        f.show('#s5-mail-l', { delay: 350 });
      },
      f => {
        f.hide(['.s5-arr', '#s5-mail-l']);
        f.flip('.s5-card', () => f.qa('.s5-card').forEach(c => c.classList.add('mini')), { dur: 500 });
        f.show('.s5-prob', { delay: 100, stagger: 150, dur: 450 });
      },
      f => {
        f.fade('#s5-photo', { dur: 500 });
        f.count('#s5-bn', 3.5, { decimals: 1, delay: 300, dur: 600 });
        f.show('.s5-ht', { delay: 100, stagger: 60 });
      },
      f => {
        f.hide('.s5-main', { dur: 0 });
        f.hide('#s5-photo', { dur: 450 });
        f.show('#s5-truth', { delay: 150 });
        f.mark('#s5-truth .hl', { delay: 480 });
      },
    ],
  });

  /* =========================== PART C =========================== */

  /* S6 · A shared record book (creates motifs 2 and 4) */
  const ROW5 = HANDS.slice(0, 5).map((n, i) => ({ ...n, x: 320 + i * 320, y: 320 }));
  const BLOCKS = [
    { n: 1, data: 'Deal: Brent', prev: '', hash: '#a3f9…' },
    { n: 2, data: '<span class="old">600k bbl</span> <span class="new off">900k bbl</span>', prev: 'prev #a3f9…', hash: '<span class="swap"><span class="h-ok">#7c21…</span><span class="h-bad off">#d90e…</span></span>' },
    { n: 3, data: 'Paid', prev: 'prev #7c21…', hash: '#e04b…' },
    { n: 4, data: 'Delivered', prev: 'prev #e04b…', hash: '#5b8d…' },
  ];
  S.push({
    id: 's6', part: 'C', bg: 'paper', b0Ms: 1200,
    autoMs: [3100, 6900, 8500, 7200, 4000],
    html: `
      <h2 class="title">Blockchain = one shared record</h2>
      ${ROW5.map((n, i) => `
        <div class="ng" style="left:${n.x}px;top:${n.y}px">
          <div class="node">${icon(n.ico, 48)}</div>
          <div class="node-l label">${n.name}</div>
          <div class="ndoc s6-doc">${docIcon(i, 52)}</div>
          <div class="nbook off" id="s6-book${i}">${icon('book', 52)}<i class="s6-alert off"></i></div>
        </div>`).join('')}
      <div class="abs off" id="s6-cbook" style="left:924px;top:540px;color:var(--petrol)">${icon('book', 72)}</div>
      <div class="abs label off" id="s6-copy" style="left:560px;width:800px;top:558px;text-align:center">everyone holds the same copy</div>
      <div class="abs s6-strip" id="s6-strip" data-flip="ledger" data-flip-fade>
        ${BLOCKS.map((b, i) => `
          <div class="blk off" id="s6-b${b.n}" style="left:${i * 400}px">
            <div class="blk-h">Block ${b.n}</div>
            <div class="blk-d">${b.data}</div>
            <div class="blk-f"><span class="blk-prev mono">${b.prev}</span><span class="blk-hash mono">${b.hash}</span></div>
            ${b.n === 4 ? `<span class="blk-tick off">${tick(24)}</span>` : ''}
          </div>
          ${i < 3 ? `<div class="lnk off" id="s6-k${b.n}" style="left:${i * 400 + 320}px"></div>` : ''}`).join('')}
        <svg class="abs ico off" id="s6-arc" width="600" height="240" viewBox="0 0 600 240" style="left:0;top:0;stroke-width:2.5;color:var(--petrol)">
          <path class="ln" pathLength="1" d="M258 176C268 238 482 238 492 180"/><path class="hd" d="M484.5 190.5 492.5 178.5l7 12.5"/>
        </svg>
      </div>
      <div class="abs label s6-sl off" id="s6-l1">linked by a “fingerprint” (hash)</div>
      <div class="abs label s6-sl off" id="s6-l2">change one record → everyone sees it</div>
      <div class="abs label s6-sl off" id="s6-l3">add <span class="ok">${tick(28)}</span> · secretly change <span class="risk">${xIcon(26)}</span></div>`,
    beats: [
      null,
      f => { f.hide('.s6-doc'); },
      f => {
        f.fade('#s6-cbook', { dur: 200 });
        const c = { x: 960, y: 576 };
        ROW5.forEach((n, i) => {
          f.show(`#s6-book${i}`, { x: c.x - n.x, y: c.y - (n.y + 130), delay: 150 + i * 60, dur: 450 });
        });
        f.hide('#s6-cbook', { delay: 380, dur: 200 });
        f.show('#s6-copy', { delay: 400, dur: 450 });
      },
      f => {
        f.hide('#s6-copy');
        f.show('#s6-b1', { y: 0, dur: 300 });
        f.grow('#s6-k1', { delay: 200, dur: 200 });
        f.show('#s6-b2', { y: 0, delay: 200, dur: 300 });
        f.grow('#s6-k2', { delay: 400, dur: 200 });
        f.show('#s6-b3', { y: 0, delay: 400, dur: 300 });
        f.draw('#s6-arc', { delay: 450, dur: 380 });
        f.show('#s6-l1', { delay: 300 });
      },
      f => {
        f.setc('#s6-b2 .old', 'struck', null, ['color']);
        f.show('#s6-b2 .new', { y: 0, delay: 100, dur: 300 });
        f.hide('#s6-b2 .h-ok', { delay: 250, dur: 120 });
        f.show('#s6-b2 .h-bad', { y: 0, delay: 300, dur: 200 });
        f.setc(['#s6-b2', '#s6-b3'], 'bad', null, ['borderColor', 'backgroundColor'], { delay: 350 });
        f.setc('#s6-b3 .blk-prev', 'bad', null, ['color'], { delay: 350 });
        f.wobble(['#s6-b2', '#s6-b3'], { delay: 400 });
        f.show('.s6-alert', { y: 0, delay: 400, dur: 250, stagger: 0 });
        f.hide('#s6-l1');
        f.show('#s6-l2', { delay: 200 });
      },
      f => {
        f.hide(['#s6-b2 .new', '#s6-b2 .h-bad', '.s6-alert'], { dur: 200 });
        f.show('#s6-b2 .h-ok', { y: 0, delay: 150, dur: 200 });
        f.setc('#s6-b2 .old', null, 'struck', ['color']);
        f.setc(['#s6-b2', '#s6-b3'], null, 'bad', ['borderColor', 'backgroundColor']);
        f.setc('#s6-b3 .blk-prev', null, 'bad', ['color']);
        f.grow('#s6-k3', { delay: 250, dur: 250 });
        f.show('#s6-b4', { x: 48, y: 0, delay: 350, dur: 400 });
        f.show('#s6-b4 .blk-tick', { y: 0, delay: 650, dur: 250 });
        f.hide('#s6-l2');
        f.show('#s6-l3', { delay: 250 });
      },
    ],
  });

  /* S7 · Private blockchains & smart contracts */
  const sunflower = (n, R, rDot, cls) => Array.from({ length: n }, (_, i) => {
    const r = R * Math.sqrt((i + 0.5) / n), t = i * 2.39996;
    return `<circle class="${cls}" cx="${(190 + r * Math.cos(t)).toFixed(1)}" cy="${(190 + r * Math.sin(t)).toFixed(1)}" r="${rDot}"/>`;
  }).join('');
  const HEX = Array.from({ length: 6 }, (_, i) => {
    const t = (i / 6) * 2 * Math.PI + Math.PI / 6;
    return [190 + 92 * Math.cos(t), 190 + 92 * Math.sin(t)].map(v => +v.toFixed(1));
  });
  const LIT = [0, 2];
  const miniStrip = id => `
    <div class="abs s7-strip" id="${id}" data-flip="ledger" data-flip-fade>
      ${['#a3f9…', '#7c21…', '#e04b…', '#5b8d…'].map((h, i) => `<div class="mblk mono" style="left:${i * 180}px">${h}</div>${i < 3 ? `<div class="mlnk" style="left:${i * 180 + 140}px"></div>` : ''}`).join('')}
    </div>`;
  S.push({
    id: 's7', part: 'C', bg: 'paper', b0Ms: 1200,
    autoMs: [3000, 7400, 9200],
    html: `
      <h2 class="title" id="s7-t1">Who can join?</h2>
      <h2 class="title off" id="s7-t2">Smart contract</h2>
      <div class="s7-col off" id="s7-pub" style="left:120px">
        <div class="s7-h">Public</div>
        <svg class="s7-field" width="380" height="380" viewBox="0 0 380 380">${sunflower(42, 168, 9, 'pdot')}</svg>
        <div class="label s7-l">Bitcoin · anyone can join</div>
      </div>
      <div class="s7-col off" id="s7-priv" style="left:976px">
        <div class="s7-h">Private <span class="s7-perm">(permissioned)</span></div>
        <svg class="s7-field" width="380" height="380" viewBox="0 0 380 380">
          <circle cx="190" cy="190" r="170" class="ring"/>
          <path class="ln off" id="s7-pline" pathLength="1" d="M${HEX[LIT[0]].join(' ')}L${HEX[LIT[1]].join(' ')}"/>
          ${HEX.map(([x, y], i) => `<circle class="vdot ${LIT.includes(i) ? 'lit-c' : 'oth'}" cx="${x}" cy="${y}" r="15"/>`).join('')}
          <circle cx="190" cy="20" r="26" class="lockbg"/>
          <svg x="168" y="-2" width="44" height="44" viewBox="0 0 48 48" class="ico" style="stroke-width:3.3">${ICONS.lock}</svg>
        </svg>
        <div class="label s7-l">energy companies · approved members only</div>
        <div class="label s7-l2 off" id="s7-own">you see only your own deals</div>
      </div>
      <div class="s7-rule off" id="s7-rule">
        <div class="s7-row"><span class="mono kwd">IF</span><span>cargo arrives</span><span class="ok s7-tk off" id="s7-tk1">${tick(44)}</span></div>
        <div class="s7-row"><span class="mono kwd">AND</span><span>passes inspection</span><span class="ok s7-tk off" id="s7-tk2">${tick(44)}</span></div>
        <div class="s7-row s7-then"><span class="mono kwd">→ THEN</span><span><span class="hl" id="s7-pay">release payment<i class="hl-bg"></i></span></span><span></span></div>
      </div>
      ${miniStrip('s7-strip')}`,
    beats: [
      null,
      f => { f.show('#s7-pub'); },
      f => {
        f.show('#s7-priv');
        f.dim('#s7-pub', true);
        f.setc('#s7-priv .lit-c', 'lit', null, ['fill'], { delay: 450 });
        f.setc('#s7-priv .oth', 'faded', null, ['opacity'], { delay: 450 });
        f.draw('#s7-pline', { delay: 500, dur: 350 });
        f.show('#s7-own', { delay: 400, dur: 450 });
      },
      f => {
        f.hide(['#s7-pub', '#s7-priv'], { y: -16 });
        f.hide('#s7-t1');
        f.show('#s7-t2', { delay: 100 });
        f.show('#s7-rule', { delay: 100, dur: 400 });
        f.show('#s7-tk1', { y: 0, delay: 350, dur: 250 });
        f.show('#s7-tk2', { y: 0, delay: 480, dur: 250 });
        f.mark('#s7-pay', { delay: 500 });
      },
    ],
  });

  /* =========================== PART D =========================== */

  /* S8 · Across the value chain (motif 1 returns) */
  const iconRow = items => `<div class="pan-icons">${items.map((it, i) => (i ? arrow(40) : '') + it).join('')}</div>`;
  const handoff = () => {
    const at = [0, 205, 410];
    const nest = (name, x) => `<svg x="${x}" y="8" width="64" height="64" viewBox="0 0 48 48" class="ico" style="stroke-width:2.25">${ICONS[name]}</svg>`;
    return `<svg class="ico pan-hand" width="474" height="80" viewBox="0 0 474 80" style="stroke-width:2.5">
      <path class="ln" pathLength="1" d="M74 40H117M157 40H203M271 40H322M362 40H408"/>
      <rect class="mb off" x="117" y="27" width="40" height="26" rx="6"/>
      <rect class="mb off" x="322" y="27" width="40" height="26" rx="6"/>
      ${nest('pipe', at[0])}${nest('ship', at[1])}${nest('tank', at[2])}
    </svg>`;
  };
  S.push({
    id: 's8', part: 'D', bg: 'paper', b0Ms: 1200,
    autoMs: [3800, 11900, 5100, 4300, 4000],
    html: `
      <h2 class="title">Where it’s used</h2>
      <div id="s8-bar">
        <div class="vb-rail off" id="s8-rail"></div>
        ${STAGES.map((s, i) => `
          <div class="vb-ph off" style="left:${COLX[i]}px"><img src="${PH(s.img)}" alt=""></div>
          <div class="vb-name off" style="left:${COLX[i]}px">${s.name}</div>`).join('')}
        <div class="cargo off" id="s8-dot" style="left:${dotX(2)}px;top:845px"></div>
      </div>
      <div class="s8-pan off" id="s8-p1" style="left:${COLX[0]}px">
        ${iconRow([icon('truck', 64), icon('doc', 64), `<span class="ok">${icon('check', 64)}</span>`])}
        <div class="pan-h">Paying suppliers automatically</div>
        <div class="pan-d">Pilot: 10 oil companies incl. Chevron, ExxonMobil, Shell</div>
        <div class="pan-d">Platform: GumboNet</div>
        <div class="pan-s">water-hauling trucks tracked → bills settled by smart contract</div>
      </div>
      <div class="s8-pan off" id="s8-p2" style="left:${COLX[1]}px">
        ${handoff()}
        <div class="pan-h">Every handover recorded once</div>
      </div>
      <div class="s8-pan off" id="s8-p3" style="left:${COLX[2]}px">
        ${iconRow([icon('deal', 64), icon('doc', 64), icon('bank', 64)])}
        <div class="pan-h">Deals, documents, finance — digital</div>
      </div>
      <div class="s8-band off" id="s8-band"><span class="petrol">${icon('leaf', 48)}</span><span>Origin &amp; carbon footprint tracking</span></div>`,
    beats: [
      null,
      f => {
        f.reveal(['.s8 .vb-ph', '.s8 .vb-name', '#s8-rail', '#s8-dot']);
        f.flip(['.s8 .vb-ph', '.s8 .vb-name', '#s8-rail', '#s8-dot'], () => {
          f.q('#s8-bar').classList.add('slim');
          Object.assign(f.q('#s8-dot').style, { left: '106px', top: '342px' });
        }, { dur: 700, fadeIn: true });
      },
      f => { openPanel(f, 1); f.moveTo('#s8-dot', { left: dotX(0) }); },
      f => {
        f.dim('#s8-p1', true);
        openPanel(f, 2);
        f.draw('#s8-p2 .ln', { delay: 250, dur: 550 });
        f.show('#s8-p2 .mb', { y: 0, delay: 420, stagger: 180, dur: 250 });
        f.moveTo('#s8-dot', { left: dotX(1) });
      },
      f => { f.dim('#s8-p2', true); openPanel(f, 3); f.moveTo('#s8-dot', { left: dotX(2) }); },
      f => { f.dim('#s8-p3', true); f.show('#s8-band', { delay: 100 }); },
    ],
  });
  function openPanel(f, n) {
    f.wipe(`#s8-p${n}`, { dir: 'down', dur: 500 });
    f.show(`#s8-p${n} > *`, { delay: 150, stagger: 60, dur: 450 });
  }

  /* S9 · When does it make sense? */
  const CHECKS = ['Many companies share the same data', 'They don’t fully trust each other', 'Mistakes or fraud are expensive'];
  S.push({
    id: 's9', part: 'D', bg: 'paper', b0Ms: 1200,
    autoMs: [4400, 2600, 2900, 4700],
    html: `
      <h2 class="title">When does blockchain make sense?</h2>
      <div class="abs s9-sub off" id="s9-sub">Not for everything.</div>
      ${CHECKS.map((t, i) => `
        <div class="s9-item off" id="s9-i${i + 1}" style="top:${420 + i * 124}px">
          <span class="s9-box">${tick(40, 's9-tick off')}</span><span class="s9-txt">${t}</span>
        </div>`).join('')}
      <div class="abs s9-pill off" id="s9-pill">Oil trading <span class="s9-ticks">${tick(40)}${tick(40)}${tick(40)}</span></div>`,
    beats: [
      null,
      f => { f.show('#s9-sub'); f.show('.s9-item', { delay: 120, stagger: 80 }); },
      f => check(f, 1),
      f => check(f, 2),
      f => { check(f, 3); f.show('#s9-pill', { delay: 380 }); },
    ],
  });
  function check(f, n) {
    f.setc(`#s9-i${n} .s9-txt`, 'on', null, ['color']);
    f.setc(`#s9-i${n} .s9-box`, 'on', null, ['backgroundColor', 'borderColor']);
    f.draw(`#s9-i${n} .s9-tick`, { delay: 150, dur: 350 });
  }

  /* =========================== PART E =========================== */

  /* S10 · Meet VAKT */
  const TL = [
    { x: 1092, year: '2017–18', chips: ['BP', 'Shell', 'Equinor'], note: 'traders &amp; banks' },
    { x: 1332, year: '2019', chips: ['Chevron', 'Total', 'Reliance'] },
    { x: 1572, year: '2020', chips: ['Saudi Aramco', '$<span id="s10-five">5</span> M'] },
  ];
  S.push({
    id: 's10', part: 'E', bg: 'paper', b0Ms: 1200,
    autoMs: [2400, 6000, 8800, 6300],
    html: `
      <div class="photo s10-ph"><img src="${PH('northsea')}" alt=""><div class="scrim"></div>
        <div class="abs label w80 off" id="s10-cap" style="left:120px;top:932px">First market: North Sea crude (Brent)</div>
      </div>
      <div class="abs big off" id="s10-vakt" style="left:1080px;top:196px">VAKT</div>
      <div class="abs label off" id="s10-loc" style="left:1084px;top:334px">London · real-world example</div>
      <div class="s10-flow">
        <div class="abs s10-deal off" style="left:1080px;top:476px">Deal agreed</div>
        <div class="abs off" style="left:1292px;top:496px">${arrow(52)}</div>
        <div class="abs s10-div off" style="left:1356px;top:440px"></div>
        <div class="abs s10-zone off" style="left:1372px;top:440px">
          <div class="eyebrow petrol" style="font-weight:600">Post-trade</div>
          <div class="s10-steps">confirm · documents · finance · settle</div>
        </div>
      </div>
      <div class="abs label off" id="s10-after" style="left:1372px;top:604px">everything after the deal</div>
      <div class="abs s10-tl off" id="s10-tl"></div>
      ${TL.map((t, i) => `
        <div class="s10-pt off" id="s10-pt${i + 1}" style="left:${t.x}px">
          <i class="s10-dot"></i><span class="mono s10-yr">${t.year}</span>
          <div class="s10-chips">${t.chips.map(c => `<span class="chip">${c}</span>`).join('')}${t.note ? `<span class="cap">${t.note}</span>` : ''}</div>
        </div>`).join('')}`,
    beats: [
      null,
      f => { f.show('#s10-vakt'); f.show('#s10-loc', { delay: 150 }); },
      f => {
        f.grow('#s10-tl', { dur: 600 });
        f.show('.s10-flow > *', { delay: 100, stagger: 80 });
        f.show('#s10-after', { delay: 380, dur: 450 });
      },
      f => {
        f.dim('.s10-flow', true);
        f.hide('#s10-after');
        f.show('#s10-pt1', { delay: 100 });
        f.show('#s10-pt1 .chip', { delay: 200, stagger: 80 });
        f.show('#s10-cap', { delay: 350 });
      },
      f => {
        f.show('#s10-pt2');
        f.show('#s10-pt2 .chip', { delay: 80, stagger: 70 });
        f.show('#s10-pt3', { delay: 250 });
        f.show('#s10-pt3 .chip', { delay: 330, stagger: 70 });
        f.count('#s10-five', 5, { delay: 300, dur: 600 });
      },
    ],
  });

  /* S11 · How a deal works on VAKT (motif 2 returns) */
  const STEPS = [
    { name: 'Enter trade', ico: 'monitor', block: 'Trade entered', hash: '#a3f9…' },
    { name: 'Match', ico: 'check', block: 'Matched', hash: '#7c21…' },
    { name: 'Shipping &amp; inspection', ico: 'ship', block: 'Inspection report', hash: '#e04b…' },
    { name: 'Finance', ico: 'bank', block: 'Financed', hash: '#5b8d…' },
  ];
  const STEPX = [316, 744, 1172, 1600];
  const tradeCard = (id, date) => `
    <div class="s11-card off" id="${id}">
      <div class="s11-c1">Brent · 600k bbl · $</div>
      <div class="s11-c2 mono">Load: ${date}</div>
    </div>`;
  S.push({
    id: 's11', part: 'E', bg: 'paper', b0Ms: 1200,
    autoMs: [2100, 5100, 6400, 5100, 9300, 7000],
    html: `
      <h2 class="title">How a deal works</h2>
      <div class="abs s11-conn off" id="s11-conn"></div>
      ${STEPS.map((s, i) => `
        <div class="s11-step off" id="s11-s${i + 1}" style="left:${STEPX[i] - 40}px"><span class="mono">${i + 1}</span></div>
        <div class="s11-lab off" id="s11-l${i + 1}" style="left:${STEPX[i] - 160}px">${icon(s.ico, 32)}<span>${s.name}</span></div>`).join('')}
      <div class="s11-story">
        <div class="s11-scr off" id="s11-sell" style="left:240px">${icon('monitor', 120)}<span class="label">Seller</span></div>
        <div class="s11-scr off" id="s11-buy" style="left:1560px">${icon('monitor', 120)}<span class="label">Buyer</span></div>
        ${tradeCard('s11-cs', '12 Mar')}
        ${tradeCard('s11-cb', '<span class="swap"><span class="d-bad">13 Mar</span><span class="d-ok off">12 Mar</span></span>')}
        <div class="s11-ok off" id="s11-ok">${tick(26)}</div>
        <div class="abs label ok off" id="s11-matched" style="left:810px;width:300px;top:672px;text-align:center;font-weight:600">matched</div>
        <div class="s11-actor off" id="s11-ship" style="left:524px;top:470px">${icon('ship', 72)}</div>
        <div class="s11-actor off" id="s11-insp" style="left:524px;top:610px">${icon('inspect', 72)}</div>
        <div class="s11-att off" id="s11-d1" style="left:822px;top:468px">${docIcon(1, 44)}</div>
        <div class="s11-att off" id="s11-d2" style="left:862px;top:468px">${docIcon(3, 44)}</div>
        <div class="abs off" id="s11-komgo" style="left:1120px;top:560px">
          <svg class="ico" width="260" height="40" viewBox="0 0 260 40" style="stroke-width:2.5;color:var(--petrol)"><path class="dash" d="M2 20H258"/></svg>
          <span class="s11-kl">komgo</span>
        </div>
        <div class="s11-actor off" id="s11-bank" style="left:1392px;top:544px">${icon('bank', 72)}<span class="s11-bt ok off">${tick(22)}</span></div>
      </div>
      <div class="abs s11-quorum off" id="s11-quorum">
        <div class="s11-q1">Built on Quorum</div>
        <div class="label">private Ethereum, first built by JPMorgan</div>
      </div>
      <div class="abs s11-strip" id="s11-strip">
        <div class="s11-base"></div>
        ${STEPS.map((s, i) => `<div class="s11-blk off" id="s11-b${i + 1}" style="left:${STEPX[i] - 150}px"><span>${s.block}</span><span class="mono">${s.hash}</span></div>`).join('')}
        <div class="s11-lock off" id="s11-lock">${icon('lock', 40)}</div>
      </div>
      <div class="abs label off" id="s11-only" style="left:460px;width:1000px;top:922px;text-align:center">only the parties in the deal can see it</div>`,
    beats: [
      null,
      f => { f.grow('#s11-conn', { dur: 600 }); f.show('.s11-step', { stagger: 80, y: 0 }); },
      f => {
        step(f, 1);
        f.show(['#s11-sell', '#s11-buy'], { stagger: 80 });
        f.show('#s11-cs', { x: -350, y: 0, delay: 150, dur: 700 });
        f.show('#s11-cb', { x: 350, y: 0, delay: 150, dur: 700 });
      },
      f => {
        step(f, 2);
        f.flip(['#s11-cs', '#s11-cb'], () => {
          f.q('#s11-cs').classList.add('mid');
          f.q('#s11-cb').classList.add('mid');
        }, { dur: 350 });
        f.setc('#s11-cb .d-bad', 'bad', null, ['color'], { delay: 350, dur: 150 });
        f.at(560, () => { f.hide('#s11-cb .d-bad', { dur: 80 }); f.show('#s11-cb .d-ok', { y: 0, dur: 120 }); });
        f.at(660, () => {
          f.flip('#s11-cb', () => f.q('#s11-cb').classList.add('merged'), { dur: 200 });
          f.hide('#s11-cb', { dur: 200 });
        });
        f.show(['#s11-ok', '#s11-matched'], { y: 0, delay: 700, dur: 200, stagger: 0 });
      },
      f => {
        step(f, 3);
        f.hide(['#s11-sell', '#s11-buy']);
        f.show(['#s11-ship', '#s11-insp'], { stagger: 80, dur: 400 });
        f.show('#s11-d1', { x: 560 - 844, y: 506 - 490, delay: 380, dur: 450 });
        f.show('#s11-d2', { x: 560 - 884, y: 646 - 490, delay: 450, dur: 450 });
      },
      f => {
        step(f, 4);
        f.dim(['#s11-ship', '#s11-insp'], true);
        f.show('#s11-bank', { dur: 400 });
        f.wipe('#s11-komgo', { dir: 'left', delay: 250, dur: 450 });
        f.show('#s11-bank .s11-bt', { y: 0, delay: 650, dur: 250 });
      },
      f => {
        f.hide('.s11-story');
        f.dim(['.s11-step', '.s11-lab', '#s11-conn'], true);
        f.setc('#s11-strip', 'big', null, ['scale', 'translate'], { dur: 500 });
        f.show('#s11-quorum', { delay: 200 });
        f.show('#s11-lock', { y: 0, delay: 400, dur: 300 });
        f.show('#s11-only', { delay: 380, dur: 450 });
      },
    ],
  });
  function step(f, n) {
    if (n > 1) f.setc(`#s11-s${n - 1}`, 'done', 'now', ['backgroundColor', 'borderColor', 'color']);
    f.setc(`#s11-s${n}`, 'now', null, ['backgroundColor', 'borderColor', 'color']);
    f.show(`#s11-l${n}`, { delay: 80 });
    f.show(`#s11-b${n}`, { y: 0, delay: 450, dur: 350 });
  }

  /* S12 · The result */
  const SCATTER = [[20, 30, -8], [120, 6, 5], [230, 40, -4], [60, 120, 9], [170, 110, -10], [280, 130, 6], [10, 210, 4], [120, 200, -6], [240, 220, 10]];
  S.push({
    id: 's12', part: 'E', bg: 'paper', b0Ms: 1200,
    autoMs: [4300, 4100, 6200],
    html: `
      <h2 class="title">The result</h2>
      <div class="s12-g off" id="s12-before"><div class="s12-in">
        <div class="s12-docs">${SCATTER.map(([x, y, r], i) => `<div class="abs" style="left:${x}px;top:${y}px;rotate:${r}deg">${docIcon(i, 72)}</div>`).join('')}</div>
        <div class="label s12-l">many copies</div>
      </div></div>
      <div class="s12-g off" id="s12-arr"><div class="s12-in">
        <svg class="ico" width="300" height="40" viewBox="0 0 300 40" style="stroke-width:2.5;color:var(--ink-soft)">
          <path class="ln" pathLength="1" d="M2 20H294"/><path class="hd" d="M282 9l12 11-12 11"/></svg>
      </div></div>
      <div class="s12-g off" id="s12-after"><div class="s12-in">
        <div class="s12-book">${icon('book', 150)}</div>
        <div class="label petrol s12-l" style="font-weight:600">one shared record</div>
      </div></div>
      <div class="abs s12-ring off" id="s12-ring">
        <svg width="340" height="340" viewBox="0 0 340 340">
          <circle cx="170" cy="170" r="150" class="track"/>
          <circle cx="170" cy="170" r="150" class="arc" id="s12-arc" pathLength="100"/>
        </svg>
        <span class="serif">≈ ⅔</span>
      </div>
      <div class="abs kw off" id="s12-lab" style="left:960px;top:620px;width:840px">of North Sea oil deals on VAKT at launch (2019)</div>
      <div class="abs s12-still off" id="s12-still">Still in use — 2024: Shell Trading Rotterdam adopts vSure</div>`,
    beats: [
      null,
      f => {
        f.show('#s12-before');
        f.reveal('#s12-arr'); f.draw('#s12-arr svg', { delay: 200, dur: 500 });
        f.show('#s12-after', { delay: 450, dur: 450 });
      },
      f => {
        f.flip(['#s12-before', '#s12-arr', '#s12-after'], () => f.qa('.s12-g').forEach(g => g.classList.add('up')), { dur: 600 });
        f.show('#s12-ring', { delay: 200, y: 0, dur: 300 });
        const arc = f.q('#s12-arc');
        f.tween(700, p => { arc.style.strokeDashoffset = (100 - 66 * p).toFixed(2); }, { delay: 200 });
        f.show('#s12-lab', { delay: 400 });
      },
      f => { f.show('#s12-still'); },
    ],
  });

  /* =========================== PART F =========================== */

  /* S13 · Implementation challenges */
  const CHALL = [
    { ico: 'people', word: 'Adoption', line: 'works only if everyone joins' },
    { ico: 'plug', word: 'Integration', line: 'old trading &amp; accounting systems' },
    { ico: 'scales', word: 'Law &amp; standards', line: 'e-documents not accepted everywhere' },
    { ico: 'eyeoff', word: 'Privacy', line: 'rivals must not see prices' },
    { ico: 'funnel', word: 'Garbage in, garbage out', line: 'can’t verify data at entry' },
  ];
  const adoptViz = `<svg class="abs s13-viz" width="170" height="110" viewBox="0 0 170 110">
      <circle cx="58" cy="55" r="40" class="ring"/>
      <circle cx="44" cy="40" r="8" class="in"/><circle cx="74" cy="44" r="8" class="in"/><circle cx="56" cy="72" r="8" class="in"/>
      <circle cx="128" cy="34" r="8" class="out"/><circle cx="150" cy="70" r="8" class="out"/></svg>`;
  const gigoViz = `<svg class="abs s13-viz" width="170" height="110" viewBox="0 0 170 110">
      <rect x="6" y="38" width="112" height="58" rx="10" class="vblk"/>
      <text x="62" y="75" text-anchor="middle" class="vval" id="s13-val">900k</text>
      <g transform="translate(118 2)">
        <rect x="11" y="21" width="26" height="20" rx="3.5" class="lockb"/>
        <path id="s13-shackle" d="M16 21v-5a8 8 0 0 1 16 0v5" class="locks"/>
      </g></svg>`;
  S.push({
    id: 's13', part: 'F', bg: 'paper', b0Ms: 1200,
    autoMs: [2500, 5700, 5000, 4800, 3800, 7200],
    html: `
      <h2 class="title" style="top:388px">Challenges</h2>
      <div class="abs s13-sub off" id="s13-sub">Why it’s not everywhere yet</div>
      ${CHALL.map((c, i) => `
        <div class="s13-row" id="s13-r${i + 1}" style="top:${214 + i * 152}px">
          <span class="mono s13-n off">0${i + 1}</span><i class="s13-slot off"></i>
          <div class="s13-c off">
            ${icon(c.ico, 56)}
            <div class="s13-w">${c.word}</div>
            <div class="label s13-line">${c.line}</div>
            ${i === 0 ? adoptViz : ''}${i === 4 ? gigoViz : ''}
          </div>
        </div>`).join('')}`,
    beats: [
      null,
      f => { f.show('#s13-sub'); f.show(['.s13-n', '.s13-slot'], { delay: 100, stagger: 30 }); },
      ...CHALL.map((c, i) => f => {
        const n = i + 1;
        if (n > 1) f.dim([`#s13-r${n - 1} .s13-c`, `#s13-r${n - 1} .s13-n`], true);
        f.show(`#s13-r${n} .s13-c`);
        if (n === 1) f.show('#s13-r1 .out', { y: 0, x: 20, delay: 300, stagger: 100, dur: 400 });
        if (n === 5) {
          f.show('#s13-val', { x: -40, y: 0, delay: 250, dur: 400 });
          f.show('#s13-shackle', { y: -7, delay: 620, dur: 250 });
        }
      }),
    ],
    outro: f => { f.dim(['.s13-c', '.s13-n'], false, 'dim', { dur: 250 }); return 250; },
    printOutro: true,
  });

  /* S14 · Advantages */
  const BENEFITS = [
    { ico: 'book', word: 'One shared truth', line: 'no re-checking' },
    { ico: 'clock', word: 'Speed', line: `days ${arrow(44, 'inl')} minutes` },
    { ico: 'shield', word: 'Less fraud', line: 'no double financing', cls: 'ok' },
    { ico: 'timeline', word: 'Audit trail', line: 'who · what · when' },
    { ico: 'gearcheck', word: 'Automation', line: 'smart contracts pay &amp; approve' },
  ];
  S.push({
    id: 's14', part: 'F', bg: 'paper', b0Ms: 1200,
    autoMs: [2700, 3700, 3200, 3800, 4100, 4300],
    html: `
      <h2 class="title">Benefits</h2>
      ${BENEFITS.map((b, i) => `
        <div class="s14-tile off" id="s14-t${i + 1}" style="left:${(120 + i * 342.4).toFixed(1)}px">
          <span class="s14-i off ${b.cls || ''}">${icon(b.ico, 80)}</span>
          <div class="s14-w off">${b.word}</div>
          <div class="label s14-l off">${b.line}</div>
        </div>`).join('')}`,
    beats: [
      null,
      f => { f.show('.s14-tile', { stagger: 80 }); },
      ...BENEFITS.map((b, i) => f => {
        const t = `#s14-t${i + 1}`;
        f.setc(t, 'on', null, ['backgroundColor', 'borderColor']);
        f.show([`${t} .s14-i`, `${t} .s14-w`, `${t} .s14-l`], { delay: 100, stagger: 80 });
        if (i === 1) f.draw(`${t} .inl`, { delay: 450, dur: 400 });
      }),
    ],
  });

  /* S15 · Conclusion — full circle */
  const FIELD = [[330, 380, -9], [520, 450, 6], [700, 372, -4], [880, 470, 11], [1060, 390, -7], [1250, 462, 4],
    [1440, 384, -12], [1580, 470, 8], [420, 600, 7], [800, 610, -10], [1150, 596, 5], [1500, 610, -5]];
  const S15B = [390, 690, 990, 1290];
  S.push({
    id: 's15', part: 'F', bg: 'paper', b0Ms: 1200,
    autoMs: [6400, 5600, 6000, 4400],
    html: `
      <div class="s15-bar off" id="s15-bar">
        <i class="s15-join"></i>
        ${STAGES.map((s, i) => `<div class="s15-vb" style="left:${450 + i * 380}px">${s.name}</div>`).join('')}
        <i class="cargo" style="left:756px;top:234px;width:24px;height:24px"></i>
      </div>
      ${FIELD.map(([x, y, r], i) => `<div class="s15-doc off" style="left:${x}px;top:${y}px"><div style="rotate:${r}deg">${docIcon(i, 56)}</div></div>`).join('')}
      <div class="abs label off" id="s15-l1" style="left:460px;width:1000px;top:760px;text-align:center">many hands · many records</div>
      <div class="s15-strip">
        ${S15B.map((x, i) => `<div class="s15-blk off mono" style="left:${x}px">${['#a3f9…', '#7c21…', '#e04b…', '#5b8d…'][i]}</div>${i < 3 ? `<i class="s15-lnk off" style="left:${x + 240}px"></i>` : ''}`).join('')}
      </div>
      <div class="abs s15-one off" id="s15-l2">one shared record</div>
      <div class="abs serif s15-end off" id="s15-l3">Not perfect yet — but VAKT shows it works.</div>
      <div class="photo off" id="s15-photo"><img src="${PH('tanker')}" alt=""><div class="scrim"></div><div class="s15-veil"></div>
        <div class="abs serif s15-ty off" id="s15-ty">Thank you</div>
        <div class="abs kw w80 s15-qs off" id="s15-qs">Questions?</div>
        <div class="abs cap s15-cr off" id="s15-cr">Group 10 · CGEB4112 Energy and Computing</div>
      </div>`,
    beats: [
      null,
      f => { f.show('#s15-bar'); f.show('.s15-doc', { delay: 150, stagger: 40, y: 0, dur: 300 }); f.show('#s15-l1', { delay: 380, dur: 450 }); },
      f => {
        f.hide('#s15-l1');
        f.qa('.s15-doc').forEach((d, i) => {
          const tx = S15B[i % 4] + 120 - 28, ty = 470 + 43 - 28;
          f.hide(d, { x: tx - parseFloat(d.style.left), y: ty - parseFloat(d.style.top), dur: 520, delay: i * 15, easing: 'cubic-bezier(.5,0,.75,1)' });
        });
        f.show('.s15-blk', { y: 0, delay: 420, stagger: 50, dur: 300 });
        f.grow('.s15-lnk', { delay: 520, stagger: 50, dur: 250 });
        f.show('#s15-l2', { delay: 380, dur: 450 });
      },
      f => { f.show('#s15-l3'); },
      f => {
        f.fade('#s15-photo', { dur: 500 });
        f.kenburns('#s15-photo img');
        f.show(['#s15-ty', '#s15-qs', '#s15-cr'], { delay: 150, stagger: 100 });
      },
    ],
  });

  window.SCENES = S;
  window.SCENE_HELPERS = { icon, docIcon };
})();
