// =============================================
//  回廊快走  絵と操作
// =============================================
(function () {
  const $ = id => document.getElementById(id);
  const T = I18N.t;
  const cv = $('view'), g = cv.getContext('2d');
  const C = MK.CONFIG, INK = '#3b2a20';
  const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  // 区間（500mごと）の色。c：[床, 左, 天井, 右]（最初の向き）  a：骨組みの色  fog：遠くの光の色
  const THEMES = [
    { k: 'th0', c: ['#f5c26b', '#8fc1f2', '#f6eedb', '#9ed98f'], a: '#7c5cff', fog: '#fff4dc' },
    { k: 'th1', c: ['#ffb3c7', '#ffd6e2', '#fff1f4', '#f59ab8'], a: '#e0457b', fog: '#fff0f4' },
    { k: 'th2', c: ['#7fd3e6', '#5fa8e8', '#c9f0f7', '#4cc4b8'], a: '#1f6fd1', fog: '#e6fbff' },
    { k: 'th3', c: ['#ffb066', '#e98bb8', '#ffd99a', '#f2786b'], a: '#b8406b', fog: '#fff0d9' },
    { k: 'th4', c: ['#a8d672', '#6fbf7a', '#dcefb4', '#8ccf5e'], a: '#3d8b3d', fog: '#f2fbe3' },
    { k: 'th5', c: ['#d9f1ff', '#addcf7', '#ffffff', '#95d0f0'], a: '#3aa0d8', fog: '#f4fbff' },
    { k: 'th6', c: ['#5b5bb0', '#4a73c2', '#3a3a7a', '#7158c4'], a: '#f5b800', fog: '#2a2550' },
    { k: 'th7', c: ['#ffc4e6', '#bff0cf', '#fff0b0', '#d4c8ff'], a: '#ff6fa5', fog: '#fff7fb' }
  ].map(t => ({ ...t, get n() { return T(t.k); }, c: t.c.map(hx), a: hx(t.a), fog: hx(t.fog) }));
  // ミッション（1回ごとに3つ。達成で +30m）
  const MIS_BONUS = 30;
  const MISSIONS = [
    { t: 'm_c15', get: r => r.coins, n: 15 }, { t: 'm_c30', get: r => r.coins, n: 30 },
    { t: 'm_r20', get: r => r.stat.rot, n: 20 }, { t: 'm_r50', get: r => r.stat.rot, n: 50 },
    { t: 'm_j30', get: r => r.stat.jump, n: 30 }, { t: 'm_p5', get: r => r.stat.pad, n: 5 },
    { t: 'm_mv10', get: r => r.stat.mover, n: 10 }, { t: 'm_d300', get: r => r.dist(), n: 300 },
    { t: 'm_a1', get: r => r.dist(), n: 500 }, { t: 'm_nr150', get: r => Math.floor(r.stat.noRotBest), n: 150 }
  ];
  let run = null, W = 0, H = 0, dpr = 1, cx = 0, cy = 0, S = 0, ang = 0, shake = 0, dead = false, acc = 0;
  let missions = [], ghost = null, rec = null, mode = 'run', vs = null, room = null;
  const BONUS_SEC = 30;
  const ZP = 1.75, NEAR = 0.32, FAR = 34;
  const store = { get(k, d) { try { const v = localStorage.getItem('kk_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem('kk_' + k, JSON.stringify(v)); } catch (e) {} } };
  let best = store.get('best', 0), bestDist = store.get('bestDist', 0), lastDeath = store.get('last', 0);
  let runBest = 0, runLast = 0;

  // ---------- 音 ----------
  let actx = null;
  function ac() { try { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) {} return actx; }
  function beep(f, d, type = 'triangle', v = 0.07, delay = 0, f2) {
    try {
      ac(); const t = actx.currentTime + delay, o = actx.createOscillator(), gn = actx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
      gn.gain.setValueAtTime(v, t); gn.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(gn); gn.connect(actx.destination); o.start(t); o.stop(t + d + 0.02);
    } catch (e) {}
  }
  let coinPitch = 0, coinT = 0;
  const snd = { jump: () => beep(420, 0.16, 'triangle', 0.07, 0, 760), pad: () => beep(300, 0.35, 'square', 0.06, 0, 1200), land: () => beep(140, 0.06, 'sine', 0.06), rot: () => beep(300, 0.14, 'sawtooth', 0.04, 0, 600),
    crash: () => { beep(110, 0.4, 'sawtooth', 0.1, 0, 40); beep(70, 0.5, 'square', 0.06); }, fall: () => beep(600, 0.9, 'sine', 0.08, 0, 60), stage: () => beep(880, 0.08, 'sine', 0.035),
    coin: () => { const f = 1046 * Math.pow(1.06, Math.min(coinPitch, 12)); beep(f, 0.09, 'square', 0.035); beep(f * 1.5, 0.12, 'square', 0.03, 0.05); },
    area: () => [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.2, 'triangle', 0.06, i * 0.09)), mis: () => [659, 880, 1175].forEach((f, i) => beep(f, 0.14, 'square', 0.045, i * 0.08)),
    tick: () => beep(1400, 0.03, 'square', 0.025), total: () => [523, 784, 1047, 1568].forEach((f, i) => beep(f, 0.22, 'triangle', 0.07, i * 0.08)) };
  function pop(t) { const el = $('pop'); el.textContent = t; el.classList.add('show'); clearTimeout(pop.tm); pop.tm = setTimeout(() => el.classList.remove('show'), 1600); }

  // ---------- 大きさ ----------
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; cx = W / 2;
    const k = Math.min(H * 0.42, W * 0.45);
    S = k * ZP; cy = Math.min(H * 0.5, H * 0.88 - k);
  }
  addEventListener('resize', resize); resize();

  // ---------- プレイヤーの絵 ----------
  function drawBlob(ctx, x, y, r, col, sx = 1, sy = 1, rot = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy); ctx.rotate(rot);
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = r * 0.12; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(-r * 0.4, r * 0.25, r * 0.16, r * 0.1, -0.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-r * 0.32, -r * 0.18, r * 0.2, 0, 7); ctx.arc(r * 0.32, -r * 0.18, r * 0.2, 0, 7); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-r * 0.32, -r * 0.24, r * 0.09, 0, 7); ctx.arc(r * 0.32, -r * 0.24, r * 0.09, 0, 7); ctx.fill();
    ctx.restore();
  }
  (function () { const c = $('title-blob'), x = c.getContext('2d'); drawBlob(x, 80, 85, 46, '#7c5cff'); })();

  // ---------- 遊ぶ ----------
  function start(withGhost) {
    ac();
    leaveRoom();
    const gd = withGhost ? store.get('ghost', null) : null;
    mode = gd ? 'ghost' : 'run';
    run = new MK.Run(gd ? gd.seed : (Math.random() * 1e9) >>> 0);
    ghost = gd ? gd.s : null; rec = [];
    ang = 0; dead = false; shake = 0; coinPitch = 0; parts = []; acc = 0;
    runBest = bestDist; runLast = lastDeath;
    const pool = MISSIONS.slice(); missions = [];
    for (let i = 0; i < 3; i++) missions.push({ ...pool.splice(Math.floor(Math.random() * pool.length), 1)[0], done: false });
    drawMissions();
    ['title', 'over', 'vs-result', 'vs-wait', 'ov-online'].forEach(id => $(id).classList.remove('show'));
    document.body.classList.add('playing'); hintT = 0; document.querySelectorAll('.hint-zone').forEach(e => e.classList.remove('gone'));
    $('best').textContent = mode === 'ghost' ? T('vs_best', { n: best }) : best ? T('best_n', { n: best }) : ''; $('coins').textContent = 0;
    beep(660, 0.1); beep(990, 0.14, 'triangle', 0.06, 0.1);
    MK.Music.start(actx, 0);
  }
  function drawMissions() {
    $('missions').innerHTML = missions.map(m => { const v = run ? Math.min(m.n, m.get(run)) : 0; return `<div class="mis${m.done ? ' done' : ''}"><b>${m.done ? '✓' : ''}${T(m.t)}</b><span>${m.done ? '+' + MIS_BONUS + 'm' : v + '/' + m.n}</span></div>`; }).join('');
  }
  function checkMissions() {
    let ch = false;
    for (const m of missions) if (!m.done && m.get(run) >= m.n) { m.done = true; ch = true; snd.mis(); pop(T('mis_done', { n: MIS_BONUS })); }
    if (ch || run.ticks % 15 === 0) drawMissions();
  }
  // ---------- 精算 ----------
  function gameOver() {
    MK.Music.stop();
    if (mode === 'vs') return vsFinish();
    const d = run.dist(), coins = run.coins, md = missions.filter(m => m.done).length, total = d + coins + md * MIS_BONUS;
    const nb = total > best;
    if (nb) { best = total; bestDist = d; store.set('best', best); store.set('bestDist', d); store.set('ghost', { seed: run.seed, s: rec }); }
    lastDeath = d; store.set('last', d);
    $('over-title').textContent = T(run.state === 'fall' ? 'fell' : 'bonk');
    $('b-dist').textContent = d + 'm'; $('b-coins').textContent = coins; $('b-coin-m').textContent = '+' + coins + 'm';
    $('b-mis').textContent = md; $('b-mis-m').textContent = '+' + md * MIS_BONUS + 'm'; $('b-total').textContent = 0;
    document.querySelectorAll('.bill .line').forEach(l => l.classList.remove('on'));
    $('over-best').textContent = ''; $('over-best').className = '';
    $('mis-result').innerHTML = missions.map(m => `<li class="${m.done ? 'done' : ''}">${m.done ? '★' : '☆'} ${T(m.t)}</li>`).join('');
    const a = Math.floor(d / C.AREA); $('over-area').textContent = T('area_reached', { a: THEMES[a % THEMES.length].n }) + (a >= THEMES.length ? T('lap', { n: Math.floor(a / THEMES.length) + 1 }) : '');
    $('btn-ghost2').hidden = !store.get('ghost', null);
    $('over').classList.add('show'); document.body.classList.remove('playing');
    // 数字が順に入っていく
    const lines = document.querySelectorAll('.bill .line'), steps = [d, d + coins, total];
    let k = 0;
    const next = () => {
      if (k >= 3) { $('b-total').textContent = total; snd.total(); $('over-best').textContent = nb ? (mode === 'ghost' ? T('ghost_beat') : T('new_best')) : T('best_n', { n: best }); $('over-best').className = nb ? 'new' : ''; return; }
      lines[k].classList.add('on'); const from = k ? steps[k - 1] : 0, to = steps[k], t0 = performance.now();
      const tick = () => { const q = Math.min(1, (performance.now() - t0) / 450); $('b-total').textContent = Math.round(from + (to - from) * q); if (q < 1) requestAnimationFrame(tick); else { snd.tick(); k++; setTimeout(next, 160); } };
      if (to === from) { k++; setTimeout(next, 120); } else tick();
    };
    setTimeout(next, 350);
  }
  $('btn-start').onclick = () => start(false); $('btn-retry').onclick = () => start(mode === 'ghost');
  $('btn-ghost').onclick = () => start(true); $('btn-ghost2').onclick = () => start(true);
  $('btn-title').onclick = () => toTitle();
  function toTitle() { leaveRoom(); ['over', 'vs-result', 'vs-wait', 'ov-online'].forEach(id => $(id).classList.remove('show')); $('title').classList.add('show'); run = null; mode = 'run'; showTitle(); document.body.classList.remove('playing', 'vs'); }
  function showTitle() { $('best-title').textContent = best ? T('best_n', { n: best }) : ''; $('btn-ghost').hidden = !store.get('ghost', null); }
  showTitle();
  document.addEventListener('langchange', () => { showTitle(); if (run) drawMissions(); if (vs) updOpp(); });

  // ---------- あいことば対戦 ----------
  function loadScript(src) { return new Promise((res, rej) => { const el = document.createElement('script'); el.src = src; el.onload = res; el.onerror = () => rej(new Error(T('err_net'))); document.head.appendChild(el); }); }
  async function getDb() {
    if (MK._db) return MK._db;
    if (!MK.FIREBASE_CONFIG) throw new Error(T('err_notready'));
    const v = '10.12.2';
    await loadScript('https://www.gstatic.com/firebasejs/' + v + '/firebase-app-compat.js');
    await loadScript('https://www.gstatic.com/firebasejs/' + v + '/firebase-database-compat.js');
    if (!firebase.apps.length) firebase.initializeApp(MK.FIREBASE_CONFIG);
    return MK._db = firebase.database();
  }
  function leaveRoom() { QM.ended(); if (room) { room.leave(); room = null; } vs = null; document.body.classList.remove('vs'); $('bonus').classList.remove('show'); $('count').classList.remove('show'); clearTimeout(hideTm); }
  const lobby = w => { $('online-form').hidden = w; $('online-wait').hidden = !w; };
  function openOnline(code) {
    lobby(false); $('online-err').textContent = '';
    try { $('in-name').value = localStorage.getItem('kk_name') || ''; } catch (e) {}
    if (code) $('in-code').value = code;
    $('title').classList.remove('show'); $('ov-online').classList.add('show');
  }
  $('btn-vs').onclick = () => { ac(); openOnline(); };
  $('btn-online-close').onclick = () => { leaveRoom(); $('ov-online').classList.remove('show'); $('title').classList.add('show'); };
  $('btn-copy').onclick = async () => {
    const url = location.origin + location.pathname + '?room=' + encodeURIComponent(room ? room.code : '');
    try { await navigator.clipboard.writeText(url); $('btn-copy').textContent = T('copied'); } catch (e) { prompt(T('send_link'), url); }
    setTimeout(() => { $('btn-copy').textContent = T('copy_link'); }, 2000);
  };
  $('btn-join').onclick = joinOnline;
  $('in-code').addEventListener('keydown', e => { if (e.key === 'Enter') joinOnline(); });
  async function joinOnline() {
    ac();
    const code = MK.cleanCode($('in-code').value), name = $('in-name').value.trim().slice(0, 8) || T('noname');
    if (!code) { $('online-err').textContent = T('err_code'); return; }
    try { localStorage.setItem('kk_name', name); } catch (e) {}
    $('online-err').textContent = ''; $('btn-join').disabled = true; $('btn-join').textContent = T('connecting');
    try {
      const db = await getDb();
      leaveRoom();
      const r = new MK.Room(db, code, name, {
        onPeople: p => { if (room === r && r.slot >= 0 && !p.names[1 - r.slot] && !vs) $('wait-msg').textContent = T('waiting'); if (room === r && vs) vs.names = p.names.map((n, i) => n || vs.names[i]); },
        onStart: g => { if (room === r) startVs(g); },
        onOpp: st => { if (room === r && vs) { vs.oppSt = st; vs.oppAt = performance.now(); } },
        onEnd: ends => { if (room === r && vs) onEnds(ends); },
        onOppLeft: () => { if (room === r && vs) { vs.oppLeft = true; if (!vs.oppEnd) oppGone(); else { $('btn-rematch').hidden = true; $('r-note').textContent = T('left'); } } }
      });
      room = r;
      await r.join();
      $('wait-code').textContent = r.code; $('wait-msg').textContent = T('waiting'); lobby(true);
    } catch (e) { $('online-err').textContent = e.message || T('err_conn'); leaveRoom(); }
    $('btn-join').disabled = false; $('btn-join').textContent = T('join');
  }
  function startVs(gm) {
    const r = room; leaveRoomKeep();
    QM.started({ code: r && r.code, watch: gm.slot < 0 });
    run = new MK.Run(gm.seed); mode = 'vs'; ghost = null; rec = null;
    vs = { slot: gm.slot, round: gm.round, names: gm.names.map(n => n || '?'), startAt: performance.now() + gm.wait, oppSt: null, oppAt: 0, oppEnd: null, myEnd: null, bonusUntil: 0, ox: 0, oh: 0, lastCount: -1, go: false };
    ang = 0; dead = false; shake = 0; coinPitch = 0; parts = []; acc = 0; missions = []; drawMissions();
    runBest = -1; runLast = -1;
    ['title', 'over', 'vs-result', 'vs-wait', 'ov-online'].forEach(id => $(id).classList.remove('show'));
    document.body.classList.add('playing', 'vs'); hintT = 0; document.querySelectorAll('.hint-zone').forEach(e => e.classList.remove('gone'));
    $('best').textContent = T('score_rule'); $('coins').textContent = 0; $('bonus').classList.remove('show');
    $('btn-rematch').hidden = false; $('btn-rematch').disabled = false; $('r-note').textContent = '';
    updOpp();
  }
  function leaveRoomKeep() { $('bonus').classList.remove('show'); clearTimeout(hideTm); }
  function updOpp() {
    if (!vs) return;
    const el = $('opp'), nm = vs.names[1 - vs.slot] || T('opp'), e = vs.oppEnd, sc = e ? e.sc : vs.oppSt ? vs.oppSt.sc : 0;
    el.innerHTML = nm + (e ? T(e.how === 'left' ? 'st_left' : e.how === 'done' ? 'st_goal' : 'st_over') : '') + '<b>' + sc + 'm</b>'; el.classList.toggle('out', !!e);
  }
  // 相手の記録がとどいた
  function onEnds(ends) {
    const o = ends[1 - vs.slot]; if (!o || vs.oppEnd) return;
    vs.oppEnd = o; oppEnded();
  }
  function oppGone() {
    if (!vs || vs.oppEnd) return;
    const s = vs.oppSt || { t: 0, d: 0, sc: 0 }; vs.oppEnd = { t: s.t, d: s.d, c: s.sc - s.d, sc: s.sc, how: 'left' }; vs.oppLeft = true; oppEnded();
  }
  function oppEnded() {
    updOpp();
    if (run && run.state === 'run' && !vs.bonusUntil) {
      // 自分だけ残った：30秒のボーナスタイム（コインがたくさん）
      vs.bonusUntil = run.ticks + BONUS_SEC * 60; addBonusCoins();
      pop(T(vs.oppEnd.how === 'left' ? 'opp_left_bonus' : 'opp_down_bonus')); snd.area();
      $('bonus').classList.add('show');
    } else if (vs.myEnd) showVsResult();
  }
  function addBonusCoins() {
    const c = run.course, p = Math.floor(run.pos) + 5, n = Math.ceil(BONUS_SEC * 16);
    c.ensure(p + n + 60);
    for (let i = p; i < p + n; i++) for (let f = 0; f < 4; f++) for (const k of [(i + f) % 5, (i + f + 2) % 5]) if (!c.rows[i][f * 5 + k]) c.coins.add(c.key(i, f, k));
  }
  function vsFinish() {
    const d = run.dist(), c = run.coins;
    vs.myEnd = { t: run.ticks, d, c, sc: d + c, how: run.state }; vs.myEndAt = performance.now();
    room && room.sendEnd(vs.myEnd);
    $('bonus').classList.remove('show'); document.body.classList.remove('playing');
    if (vs.oppEnd) showVsResult(); else showWait();
  }
  function showWait() {
    $('w-title').textContent = T(run.state === 'fall' ? 'fell' : 'bonk');
    $('w-me-n').textContent = vs.names[vs.slot] + T('you_sfx'); $('w-op-n').textContent = vs.names[1 - vs.slot];
    $('w-me').textContent = vs.myEnd.sc; $('vs-wait').classList.add('show');
  }
  function showVsResult() {
    $('vs-wait').classList.remove('show'); document.body.classList.remove('playing');
    const me = vs.myEnd, op = vs.oppEnd, t = $('r-title');
    // ランダム対戦で相手が抜けたら、残った人の勝ち
    const res = vs.oppLeft && QM.isRandom() ? 'win' : me.sc > op.sc ? 'win' : me.sc < op.sc ? 'lose' : 'draw';
    t.textContent = T(res === 'win' ? 'res_win' : res === 'lose' ? 'res_lose' : 'res_draw'); t.className = res;
    $('r-me-n').textContent = vs.names[vs.slot] + T('you_sfx'); $('r-op-n').textContent = vs.names[1 - vs.slot];
    $('r-me-d').textContent = me.d + 'm'; $('r-op-d').textContent = op.d + 'm'; $('r-me-c').textContent = '×' + me.c; $('r-op-c').textContent = '×' + op.c;
    $('r-me-s').textContent = me.sc + 'm'; $('r-op-s').textContent = op.sc + 'm';
    $('r-me-s').className = res === 'win' ? 'win' : ''; $('r-op-s').className = res === 'lose' ? 'win' : '';
    $('r-note').textContent = vs.oppLeft ? (QM.isRandom() ? T('left_win') : T('left')) : '';
    $('btn-rematch').hidden = !!vs.oppLeft; $('btn-rematch').disabled = false;
    $('vs-result').classList.add('show'); res === 'lose' ? beep(330, 0.4, 'triangle', 0.07, 0, 200) : snd.total();
  }
  $('btn-rematch').onclick = () => { if (!room) return; room.rematch(); $('btn-rematch').disabled = true; $('r-note').textContent = T('wait_rematch'); };
  $('btn-vs-title').onclick = () => toTitle();

  // ---------- だれかと対戦（ランダム対戦） ----------
  QM.setup({
    game: 'kairou', ver: 'v1', name: '回廊快走',
    getDb, anchor: '#btn-vs', anchorWhere: 'before', btnClass: 'btn vs', nextClass: 'btn primary', nameKey: 'kk_name',
    join: (code, name) => { ac(); $('in-code').value = code; $('in-name').value = name; joinOnline(); },
    cpu: () => $('btn-start').click(), cpuLabel: () => T('solo_wait'),
    quit: toTitle,
    colors: { main: '#e2553f', alt: '#3d6fd8', bg: '#fffaf0', fg: 'var(--ink)' },
  });
  QM.resultSlot('#vs-result .box', '#btn-vs-title');
  // 待っている間：相手のスコアと残り時間
  setInterval(() => {
    if (!vs || !$('vs-wait').classList.contains('show')) return;
    $('w-op').textContent = vs.oppSt ? vs.oppSt.sc : 0;
    $('w-left').textContent = T('left_n', { n: Math.max(0, Math.ceil(BONUS_SEC - (performance.now() - vs.myEndAt) / 1000)) });
    if (vs.oppAt && performance.now() - vs.oppAt > 8000 + BONUS_SEC * 1000 && !vs.oppEnd) oppGone();
  }, 200);
  // 対戦中に別の画面へ行ったまま5秒たったら、その人の負け（おわり）
  let hideTm = 0;
  document.addEventListener('visibilitychange', () => {
    clearTimeout(hideTm);
    if (document.hidden && vs && run && run.state === 'run') hideTm = setTimeout(() => { if (document.hidden && vs && run.state === 'run') { run.die('fall'); dead = true; MK.Music.stop(); vsFinish(); } }, 5000);
  });
  try { const rc = new URLSearchParams(location.search).get('room'); if (rc) openOnline(MK.cleanCode(rc)); } catch (e) {}

  // ---------- 操作 ----------
  const keys = new Set();
  addEventListener('keydown', e => {
    if (e.repeat) return;
    keys.add(e.code);
    if (!run || run.state !== 'run' || (vs && performance.now() < vs.startAt)) {
      if (e.code === 'Space' && ($('title').classList.contains('show') || $('over').classList.contains('show'))) { e.preventDefault(); start(false); }
      return;
    }
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); run.jump(); }
    if (e.code === 'KeyE' || e.code === 'KeyD') run.rotate(1);
    if (e.code === 'KeyQ' || e.code === 'KeyA') run.rotate(-1);
  });
  addEventListener('keyup', e => keys.delete(e.code));
  const touches = new Map(); let hintT = 0;
  function jumpBtnHit(x, y) { const r = $('jump-btn').getBoundingClientRect(); return Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) < r.width * 0.62; }
  cv.addEventListener('touchstart', e => {
    e.preventDefault();
    for (const t of e.changedTouches) {
      const left = t.clientX < W / 2, btn = !left && jumpBtnHit(t.clientX, t.clientY);
      touches.set(t.identifier, { x: t.clientX, y: t.clientY, ox: t.clientX, oy: t.clientY, left, btn, done: false });
      if (btn && run && !(vs && performance.now() < vs.startAt)) { run.jump(); $('jump-btn').classList.add('on'); }
    }
  }, { passive: false });
  cv.addEventListener('touchmove', e => {
    e.preventDefault();
    for (const t of e.changedTouches) {
      const s = touches.get(t.identifier); if (!s || !run || (vs && performance.now() < vs.startAt)) continue;
      if (s.left) run.move((t.clientX - s.x) / (W * 0.22) * 2);
      else if (!s.btn && !s.done && Math.abs(t.clientX - s.ox) > 26 && Math.abs(t.clientX - s.ox) > Math.abs(t.clientY - s.oy)) { s.done = true; run.rotate(t.clientX > s.ox ? 1 : -1); }
      s.x = t.clientX; s.y = t.clientY;
    }
  }, { passive: false });
  const endT = e => { for (const t of e.changedTouches) { const s = touches.get(t.identifier); if (s && s.btn) $('jump-btn').classList.remove('on'); touches.delete(t.identifier); } };
  cv.addEventListener('touchend', endT); cv.addEventListener('touchcancel', endT);

  // ---------- 絵 ----------
  function facePt(f, xl, inset) { const a = f * Math.PI / 2, y = 1 - (inset || 0), c = Math.cos(a), s = Math.sin(a); return [xl * c - y * s, xl * s + y * c]; }
  function proj(p, z) { const c = Math.cos(-ang), s = Math.sin(-ang), x = p[0] * c - p[1] * s, y = p[0] * s + p[1] * c, k = S / z; return [cx + x * k, cy + y * k]; }
  function poly(pts, fill, stroke, lw) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw || 1; g.stroke(); } }
  const line = (a, b, col, lw) => { g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); };
  const PIT = [59, 42, 32];
  let FOG = THEMES[0].fog;
  const fogT = z => Math.min(1, Math.max(0, (z - 3) / (FAR - 5))) ** 0.75;
  const mix = (rgb, z, k = 1) => { const t = fogT(z); return rgb.map((v, i) => Math.round(Math.min(255, v * k) * (1 - t) + FOG[i] * t)); };
  const css = a => `rgb(${a[0]},${a[1]},${a[2]})`;
  const fogged = (rgb, z, k = 1) => css(mix(rgb, z, k));
  const themeAt = i => THEMES[Math.floor(Math.max(0, i) / C.AREA) % THEMES.length];
  function faceCol(i, f) {
    const a = Math.floor(Math.max(0, i) / C.AREA), m = Math.max(0, i) % C.AREA, cur = THEMES[a % THEMES.length].c[f];
    if (a === 0 || m >= 8) return cur;
    const prev = THEMES[(a - 1) % THEMES.length].c[f], t = m / 8; return cur.map((v, j) => prev[j] * (1 - t) + v * t);
  }
  function ring(i, z, color, label, dash) {
    const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(p => proj(p, z));
    g.save(); g.globalAlpha = 1 - fogT(z) * 0.7; g.lineJoin = 'round';
    g.strokeStyle = INK; g.lineWidth = Math.max(3, S / z * 0.075); if (dash) g.setLineDash([S / z * 0.12, S / z * 0.08]);
    g.beginPath(); pts.forEach((p, j) => j ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.stroke();
    g.strokeStyle = color; g.lineWidth = Math.max(2, S / z * 0.045); g.stroke(); g.setLineDash([]);
    if (label) { const top = proj([0, -1], z), fs = Math.max(10, Math.min(30, S / z * 0.13)); g.font = `900 ${fs}px "M PLUS Rounded 1c", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'top'; g.lineWidth = fs * 0.3; g.strokeStyle = INK; g.strokeText(label, top[0], top[1] + fs * 0.4); g.fillStyle = color; g.fillText(label, top[0], top[1] + fs * 0.4); }
    g.restore();
  }
  function rib(z, col) {
    const o = [[-1, -1], [1, -1], [1, 1], [-1, 1]], q = 0.9, inn = o.map(p => [p[0] * q, p[1] * q]);
    const P = o.map(p => proj(p, z)), Q = inn.map(p => proj(p, z));
    g.beginPath(); P.forEach((p, j) => j ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath();
    Q.slice().reverse().forEach((p, j) => j ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath();
    g.fillStyle = fogged(col, z); g.fill('evenodd'); g.strokeStyle = fogged(PIT, z); g.lineWidth = Math.max(1.5, S / z * 0.022); g.lineJoin = 'round'; g.stroke();
  }
  // 箱・かべ。kind：box（低い・白い帯）、wall（高い・たてじま）、mover（高い・矢印）
  function cube(f, x0, x1, hgt, zz0, zz1, col, kind) {
    const A = facePt(f, x0), B = facePt(f, x1), A2 = facePt(f, x0, hgt), B2 = facePt(f, x1, hgt);
    const lw = Math.max(1.5, S / zz0 * 0.018), ink = fogged(PIT, zz0), fade = 1 - fogT(zz0);
    poly([proj(A2, zz0), proj(B2, zz0), proj(B2, zz1), proj(A2, zz1)], fogged(col, zz0, 1.15), ink, lw);
    poly([proj(A, zz0), proj(A2, zz0), proj(A2, zz1), proj(A, zz1)], fogged(col, zz0, 0.78), ink, lw);
    poly([proj(B, zz0), proj(B2, zz0), proj(B2, zz1), proj(B, zz1)], fogged(col, zz0, 0.78), ink, lw);
    poly([proj(A, zz0), proj(B, zz0), proj(B2, zz0), proj(A2, zz0)], fogged(col, zz0, 0.97), ink, lw * 1.3);
    const P = (u, v) => proj(facePt(f, x0 + (x1 - x0) * u, hgt * v), zz0), wc = `rgba(255,255,255,${0.75 * fade})`;
    if (kind === 'box') { poly([P(0.06, 0.42), P(0.94, 0.42), P(0.94, 0.62), P(0.06, 0.62)], wc); }
    else if (kind === 'wall') { for (const u of [0.3, 0.5, 0.7]) line(P(u, 0.12), P(u, 0.88), `rgba(255,255,255,${0.4 * fade})`, lw * 1.4); }
    else if (kind === 'mover') { for (const v of [0.35, 0.65]) { line(P(0.12, v), P(0.3, v - 0.1), wc, lw * 1.4); line(P(0.12, v), P(0.3, v + 0.1), wc, lw * 1.4); line(P(0.88, v), P(0.7, v - 0.1), wc, lw * 1.4); line(P(0.88, v), P(0.7, v + 0.1), wc, lw * 1.4); } }
    line(proj(facePt(f, x0 + (x1 - x0) * 0.12, hgt * 0.9), zz0), proj(facePt(f, x0 + (x1 - x0) * 0.4, hgt * 0.9), zz0), `rgba(255,255,255,${0.55 * fade})`, lw * 1.2);
  }
  let parts = [];
  function puff(x, y, n, col, up) { for (let i = 0; i < n; i++) { const a = up ? -Math.PI / 2 + (Math.random() - 0.5) * 2 : Math.PI + Math.random() * Math.PI, sp = 60 + Math.random() * 120; parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * (up ? 1 : 0.4), t: 0.45 + Math.random() * 0.2, col, r: 3 + Math.random() * 4 }); } }
  function draw(dt) {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pos = run ? run.pos : performance.now() / 1000 * 3, course = run ? run.course : demoCourse, tnow = run ? run.t : performance.now() / 1000;
    const base = Math.floor(pos), th = themeAt(base + 6);
    FOG = FOG.map((v, i) => v + (th.fog[i] - v) * Math.min(1, dt * 2));
    g.fillStyle = css(FOG); g.fillRect(0, 0, W, H);
    if (shake > 0) { g.translate((Math.random() - 0.5) * shake * 14, (Math.random() - 0.5) * shake * 14); shake = Math.max(0, shake - dt * 2.5); }
    const gl = g.createRadialGradient(cx, cy, 0, cx, cy, S * 0.22); gl.addColorStop(0, 'rgba(255,255,255,.95)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gl; g.fillRect(cx - S * 0.25, cy - S * 0.25, S * 0.5, S * 0.5);
    for (let i = base + FAR; i >= base - 2; i--) {
      let z0 = i - pos + ZP, z1 = z0 + 1; if (z1 <= NEAR) continue; z0 = Math.max(NEAR, z0);
      const ahead = i - pos;
      for (let f = 0; f < 4; f++) {
        const fc = faceCol(i, f), grout = mix(fc, z0, 0.8);
        const a0 = facePt(f, -1), a1 = facePt(f, 1);
        poly([proj(a0, z0), proj(a1, z0), proj(a1, z1), proj(a0, z1)], css(grout));
        for (let k = 0; k < 5; k++) {
          let c = course.cell(i, f, k); const x0 = -1 + k * 0.4, x1 = x0 + 0.4;
          let drop = 0;
          if (c === 4) { if (ahead < C.CRUMBLE) { drop = (C.CRUMBLE - ahead) / C.CRUMBLE; } }
          if (c === 1 || drop > 0) {
            const a = facePt(f, x0), b = facePt(f, x1);
            poly([proj(a, z0), proj(b, z0), proj(b, z1), proj(a, z1)], fogged(PIT, z0));
            const d = facePt(f, x0, -0.12), e2 = facePt(f, x1, -0.12);
            poly([proj(a, z1), proj(b, z1), proj(e2, z1), proj(d, z1)], fogged(fc, z1, 0.62));
            if (drop > 0 && drop < 1) { // 落ちていくタイル
              g.save(); g.globalAlpha = 1 - drop; const out = -drop * 0.9, m = 0.03 + drop * 0.05;
              const p = facePt(f, x0 + m, out), q = facePt(f, x1 - m, out);
              poly([proj(p, z0 + 0.06), proj(q, z0 + 0.06), proj(q, z1 - 0.06), proj(p, z1 - 0.06)], fogged(fc, z0, 0.85), fogged(PIT, z0), 1.5); g.restore();
            }
            continue;
          }
          const m = 0.03, zm = Math.min(0.06, (z1 - z0) * 0.08), shade = (i + k) % 2 ? 0.92 : 1.04;
          // くずれる床は、近づくとふるえる
          const jit = c === 4 && ahead < 6 ? Math.sin(tnow * 60 + k * 3 + i) * 0.012 * (6 - ahead) : 0;
          const a = facePt(f, x0 + m + jit, jit), b = facePt(f, x1 - m + jit, jit);
          const Q = [proj(a, z0 + zm), proj(b, z0 + zm), proj(b, z1 - zm), proj(a, z1 - zm)];
          poly(Q, fogged(fc, z0, c === 4 ? shade * 0.9 : shade));
          if (c === 4) { // ひび
            const lw = Math.max(1, S / z0 * 0.012), cc = fogged(PIT, z0, 1.4);
            line(Q[0].map((v, j) => v * 0.7 + Q[2][j] * 0.3), Q[2].map((v, j) => v * 0.6 + Q[0][j] * 0.4), cc, lw);
            line(Q[1].map((v, j) => v * 0.6 + Q[3][j] * 0.4), Q[0].map((v, j) => v * 0.45 + Q[2][j] * 0.55), cc, lw);
          } else if (c === 5) { // ジャンプ台：奥向きの黄色い矢印
            const col = fogged([245, 184, 0], z0), lw = Math.min(7, Math.max(1.5, S / z0 * 0.03));
            poly(Q, fogged([255, 214, 90], z0));
            if (z0 > 0.9) for (const zz of [0.3, 0.65]) { const L = proj(facePt(f, x0 + 0.08), z0 + zz + 0.2), M = proj(facePt(f, x0 + 0.2), z0 + zz), R2 = proj(facePt(f, x1 - 0.08), z0 + zz + 0.2); g.strokeStyle = fogged(PIT, z0); g.lineWidth = lw * 1.6; g.lineJoin = 'round'; g.beginPath(); g.moveTo(L[0], L[1]); g.lineTo(M[0], M[1]); g.lineTo(R2[0], R2[1]); g.stroke(); g.strokeStyle = col; g.lineWidth = lw; g.stroke(); }
          }
        }
      }
      if (i % 6 === 0) { const zr = i - pos + ZP; if (zr > NEAR) rib(zr, themeAt(i).a); }
      if (run && i > 0) {
        const zr = i - pos + ZP;
        if (zr > NEAR) {
          if (i % C.AREA === 0) ring(i, zr, '#ffffff', THEMES[(i / C.AREA) % THEMES.length].n);
          if (i === runBest && mode !== 'ghost') ring(i, zr, '#f5b800', T('best_n', { n: i }));
          else if (i === runLast && mode !== 'ghost') ring(i, zr, '#ff7aa8', T('last_n', { n: i }), true);
        }
      }
      const zz0 = Math.max(NEAR, i - pos + ZP + 0.1), zz1 = i - pos + ZP + 0.9;
      if (zz1 > NEAR) {
        for (let f = 0; f < 4; f++) for (let k = 0; k < 5; k++) {
          const c = course.cell(i, f, k); if (c !== 2 && c !== 3) continue;
          const x0 = -1 + k * 0.4 + 0.02; cube(f, x0, x0 + 0.36, c === 2 ? C.BOX_H : C.WALL_H, zz0, zz1, c === 2 ? [239, 68, 68] : [124, 92, 255], c === 2 ? 'box' : 'wall');
        }
        const ms = course.moversAt(i);
        if (ms) for (const m of ms) { const o = MK.moverOff(m, tnow), x0 = -1 + o * 0.4 + 0.02; cube(m.f, x0, x0 + m.w * 0.4 - 0.04, C.WALL_H, zz0, zz1, [20, 184, 166], 'mover'); }
        const zc = i - pos + ZP + 0.5;
        if (zc > 0.8) for (let f = 0; f < 4; f++) for (let k = 0; k < 5; k++) {
          if (!course.coin(i, f, k)) continue;
          const p = proj(facePt(f, -1 + k * 0.4 + 0.2, 0.26 + Math.sin(tnow * 4 + i) * 0.03), zc), r = S / zc * 0.1, sx = Math.abs(Math.cos(tnow * 5 + i * 0.7));
          g.save(); g.globalAlpha = 1 - fogT(zc) * 0.85; g.translate(p[0], p[1]);
          g.fillStyle = '#f5b800'; g.strokeStyle = INK; g.lineWidth = Math.max(1, r * 0.22);
          g.beginPath(); g.ellipse(0, 0, Math.max(r * 0.15, r * sx), r, 0, 0, 7); g.fill(); g.stroke();
          if (sx > 0.4) { g.fillStyle = '#ffe58a'; g.beginPath(); g.ellipse(-r * 0.2 * sx, -r * 0.25, r * 0.25 * sx, r * 0.35, 0, 0, 7); g.fill(); }
          g.restore();
        }
      }
    }
    if (run && run.state === 'run' && run.speed > 9) {
      const a = Math.min(0.35, (run.speed - 9) / 10); g.strokeStyle = `rgba(255,255,255,${a})`; g.lineCap = 'round';
      for (let n = 0; n < 10; n++) { const an = (n * 2.39 + Math.floor(tnow * 12) * 0.7) % (Math.PI * 2), r0 = S * (0.55 + ((n * 0.37 + tnow * 3) % 0.5)), r1 = r0 + S * 0.25; g.lineWidth = 3; g.beginPath(); g.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); g.lineTo(cx + Math.cos(an) * r1, cy + Math.sin(an) * r1); g.stroke(); }
    }
    if (run) { drawGhost(); drawOpp(); drawPlayer(); }
    for (const p of parts) { p.t -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 300 * dt; g.globalAlpha = Math.max(0, Math.min(1, p.t * 3)); g.fillStyle = p.col; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill(); }
    g.globalAlpha = 1; parts = parts.filter(p => p.t > 0);
    g.setTransform(1, 0, 0, 1, 0, 0);
  }
  // ゴースト：ベストのときの自分。同じコース・同じ速さなので、いつもプレイヤーと同じ深さにいる
  function drawGhost() {
    if (!ghost) return;
    const gi = Math.floor(run.ticks / 3); if (gi >= ghost.length) return;
    const [gx, gh, gv] = ghost[gi];
    // ゴーストの面 gv の上に立つ（今の向きから見ると、壁や天井にいることもある）
    const p = facePt(gv, gx, C.PR + gh), q = proj(p, ZP), r = C.PR * S / ZP, rot = (gv * Math.PI / 2) - ang;
    g.save(); g.globalAlpha = 0.45; drawBlob(g, q[0], q[1], r, '#ffffff', 1, 1, rot); g.restore();
    const fs = Math.max(11, r * 0.45); g.font = `900 ${fs}px "M PLUS Rounded 1c", sans-serif`; g.textAlign = 'center'; g.lineWidth = fs * 0.28; g.strokeStyle = INK; g.fillStyle = '#fff';
    g.strokeText(T('best'), q[0], q[1] - r * 1.3); g.fillText(T('best'), q[0], q[1] - r * 1.3);
  }
  // 対戦相手：同じコース・同じ速さなので、自分と同じ深さにいる
  function drawOpp() {
    if (!vs || !vs.oppSt || vs.oppEnd) return;
    const o = vs.oppSt; vs.ox += (o.x - vs.ox) * 0.25; vs.oh += (o.h - vs.oh) * 0.35;
    const p = facePt(o.v, vs.ox, C.PR + Math.max(0, vs.oh)), q = proj(p, ZP), r = C.PR * S / ZP, rot = (o.v * Math.PI / 2) - ang;
    g.save(); g.globalAlpha = 0.55; drawBlob(g, q[0], q[1], r, '#ff9a4d', 1, 1, rot); g.restore();
    const fs = Math.max(11, r * 0.45), nm = vs.names[1 - vs.slot] || T('opp'); g.font = `900 ${fs}px "M PLUS Rounded 1c", sans-serif`; g.textAlign = 'center'; g.lineWidth = fs * 0.28; g.strokeStyle = INK; g.fillStyle = '#ffd0a8';
    g.strokeText(nm, q[0], q[1] - r * 1.3); g.fillText(nm, q[0], q[1] - r * 1.3);
  }
  function drawPlayer() {
    const k = S / ZP, fallY = run.state === 'fall' ? -run.h : 0;
    const px = cx + run.x * k, floorY = cy + 1 * k, r = C.PR * k;
    const h = run.state === 'fall' ? 0 : run.h, py = floorY - r - h * k + fallY * k * 0.6;
    if (run.state !== 'fall') { g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(px, floorY - 2, r * (1 - h * 0.5), r * 0.3 * (1 - h * 0.5), 0, 0, 7); g.fill(); }
    const sq = run.air ? 1.08 : 1 + Math.sin(run.t * 22) * 0.04, sc = run.state === 'fall' ? Math.max(0.2, 1 - run.t * 0.9) : 1;
    drawBlob(g, px, py, r, '#7c5cff', sc / sq, sc * sq, run.state === 'crash' ? Math.sin(run.t * 40) * 0.15 : 0);
  }

  // ---------- 毎フレーム ----------
  const demoCourse = new MK.Course(7);
  let last = performance.now(), stageTm = 0, areaTm = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (run) {
      const mx = (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0);
      // 動きは 1/60秒ずつ（画面がカクついても結果は同じ）
      const waiting = vs && now < vs.startAt;
      if (vs) { const n = Math.ceil((vs.startAt - now) / 1000), el = $('count'); el.classList.toggle('show', waiting || now < vs.startAt + 700); el.textContent = waiting ? n : 'GO!'; if (waiting && n !== vs.lastCount) { vs.lastCount = n; beep(n ? 660 : 990, 0.12, 'square', 0.05); } if (!waiting && !vs.go) { vs.go = true; beep(1046, 0.25, 'square', 0.06); MK.Music.start(actx, 0); } }
      if (!waiting) acc += dt;
      while (acc >= C.DT) {
        acc -= C.DT; run.tick({ mx });
        if (run.state === 'run' && run.ticks % 3 === 0 && rec) rec.push([+run.x.toFixed(3), +run.h.toFixed(3), run.view]);
        if (vs) {
          if (run.state === 'run' && run.ticks % 8 === 0) room && room.sendState({ t: run.ticks, x: +run.x.toFixed(3), h: +run.h.toFixed(3), v: run.view, d: run.dist(), sc: run.dist() + run.coins });
          if (vs.bonusUntil && run.ticks >= vs.bonusUntil) run.finish();
        }
      }
      if (vs && vs.bonusUntil && run.state === 'run') $('bonus').textContent = T('bonus_left', { n: Math.max(0, Math.ceil((vs.bonusUntil - run.ticks) / 60)) });
      // 相手から長く連絡がない（電波が切れた）
      if (vs && run.state === 'run' && !waiting && !vs.oppEnd && vs.oppAt && now - vs.oppAt > 8000) oppGone();
      coinT -= dt; if (coinT <= 0) coinPitch = 0;
      const k = S / ZP;
      for (const e of run.events) {
        if (e === 'jump') snd.jump(); else if (e === 'pad') { snd.pad(); puff(cx + run.x * k, cy + k - 4, 8, '#ffd34d'); } else if (e === 'land') { snd.land(); puff(cx + run.x * k, cy + k - 4, 6, 'rgba(255,255,255,.85)'); } else if (e === 'rotR' || e === 'rotL') snd.rot();
        else if (e === 'done') { snd.total(); pop(T('finish')); $('bonus').classList.remove('show'); }
        else if (e === 'crash') { snd.crash(); shake = 1; MK.Music.stop(); } else if (e === 'fall') { snd.fall(); MK.Music.stop(); }
        else if (e === 'coin') { puff(cx + run.x * k, cy + k - C.PR * k * 2 - run.h * k, 7, '#ffd34d', true); snd.coin(); coinPitch++; coinT = 0.6; $('coins').textContent = run.coins; }
        else if (e.startsWith('stage:')) { const el = $('stage-name'); const sn = e.slice(6), sk = (window.I18N_STAGE || {})[sn]; el.textContent = sk ? T(sk) : sn; el.classList.add('show'); clearTimeout(stageTm); stageTm = setTimeout(() => el.classList.remove('show'), 1500); snd.stage(); }
        else if (e.startsWith('area:')) { const a = +e.slice(5), el = $('area-name'); el.innerHTML = '<small>' + a * C.AREA + 'm</small>\n' + THEMES[a % THEMES.length].n; el.classList.add('show'); clearTimeout(areaTm); areaTm = setTimeout(() => el.classList.remove('show'), 2200); snd.area(); MK.Music.area(a); }
      }
      run.events = [];
      if (run.state === 'run') checkMissions();
      if (run.state !== 'run' && !dead && run.t > (run.state === 'done' ? 1.4 : 0.9)) { dead = true; gameOver(); }
      $('dist').textContent = run.dist() + (vs ? run.coins : 0);
      if (vs) updOpp();
      hintT += dt; if (hintT > 6) document.querySelectorAll('.hint-zone').forEach(e => e.classList.add('gone'));
    }
    const target = run ? run.view * Math.PI / 2 : 0; let d = target - ang; d = Math.atan2(Math.sin(d), Math.cos(d));
    ang += d * Math.min(1, dt * 16);
    draw(dt);
  }
  requestAnimationFrame(frame);
  MK._debug = { get run() { return run; }, start, THEMES, get missions() { return missions; }, get vs() { return vs; }, get room() { return room; } };
})();
