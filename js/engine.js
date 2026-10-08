// =============================================
//  回廊快走  コースと動き（画面とは切りはなし）
//  通路は四角い筒。面は 0〜3（0＝最初の床）。面 f は「床を f×90°まわした場所」
//  view：今どの面が床か。右の壁を床にする＝view-1、左の壁＝view+1
//  1列ごとに 4面×5レーン：0＝床 1＝穴 2＝箱 3＝かべ 4＝くずれる床 5＝ジャンプ台
//  ほかに、コイン（列・面・レーン）と動くかべ（列ごと）を持つ
//  動きは 1/60秒ずつ進める（端末の速さで結果が変わらないように）
// =============================================
(function () {
  const C = MK.CONFIG = {
    LANES: 5, LEAD: 14, GAP: 3, AREA: 500, DT: 1 / 60,
    SPEED0: 7.5, SPEED_MAX: 13, SPEED_UP: 0.0012,   // 列/秒、1列ごとの加速
    JUMP_V: 3.55, PAD_V: 5.0, GRAV: 11.4,             // ふつう：高さ0.55・空中0.62秒  ジャンプ台：高さ1.1・空中0.88秒
    BOX_H: 0.42, WALL_H: 1.15, PR: 0.16,
    CRUMBLE: 2.2,                                     // くずれる床は、この列数まで近づくと落ちる
    COYOTE: 0.08,                                     // 穴の上に出ても、この秒数はまだ落ちない（ジャンプもできる）
  };
  const FACE = { F: 0, L: 1, C: 2, R: 3 };
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  MK.rng = rng;
  MK.moverOff = (m, t) => (1 + Math.sin(2 * Math.PI * t / m.per + m.ph)) / 2 * (5 - m.w);
  // 走った距離 → 速さ（区間を1周したあとも、少しずつ上がる）
  MK.speedAt = pos => { const lap = Math.max(0, pos - C.AREA * 8); return Math.min(C.SPEED_MAX + Math.min(2, lap / 2000), C.SPEED0 + pos * C.SPEED_UP + 0); };

  function build(st, turn, flip) {
    const rows = [], coins = [], movers = []; for (let i = 0; i < st.len; i++) rows.push(new Uint8Array(20));
    const code = { h: 1, b: 2, k: 3, x: 4, p: 5 };
    for (const op of st.ops) {
      const [t, r0, n, fc, arg] = op;
      let f = FACE[fc]; if (flip) f = (4 - f) % 4; f = (f + turn) % 4;
      for (let r = r0; r < r0 + n && r < st.len; r++) {
        if (t === 'm') { movers.push({ r, f, w: arg || 2, per: op[5] || 2.2, ph: (op[6] || 0) + (flip ? Math.PI : 0) }); continue; }
        for (let k = 0; k < 5; k++) {
          if ((arg || '11111')[flip ? 4 - k : k] !== '1') continue;
          if (t === 'c') coins.push([r, f, k]); else rows[r][f * 5 + k] = code[t];
        }
      }
    }
    return { rows, coins, movers };
  }
  MK.buildStage = build;

  class Course {
    constructor(seed) {
      this.r = rng(seed); this.rows = []; this.marks = []; this.coins = new Set(); this.movers = new Map();
      for (let i = 0; i < C.LEAD; i++) this.rows.push(new Uint8Array(20));
      this.made = 0;
    }
    pick() {
      const n = this.made, w = n < 3 ? [1, 0, 0] : n < 7 ? [3, 2, 0] : n < 12 ? [2, 3, 1] : n < 40 ? [1, 3, 3] : [0, 2, 5];
      let t = this.r() * (w[0] + w[1] + w[2]), d = 1; for (let i = 0; i < 3; i++) { if (t < w[i]) { d = i + 1; break; } t -= w[i]; }
      const list = MK.STAGES.filter(s => s.d === d);
      let s = list[Math.floor(this.r() * list.length)];
      if (s === this.last && list.length > 1) s = list[(list.indexOf(s) + 1) % list.length];
      return this.last = s;
    }
    ensure(upto) {
      while (this.rows.length < upto) {
        const s = this.pick(), turn = Math.floor(this.r() * 4), flip = this.r() < 0.5, base = this.rows.length;
        const b = build(s, turn, flip);
        this.marks.push({ at: base, name: s.n, d: s.d });
        for (const [r, f, k] of b.coins) if (!b.rows[r][f * 5 + k]) this.coins.add(this.key(base + r, f, k));
        for (const m of b.movers) { const i = base + m.r; if (!this.movers.has(i)) this.movers.set(i, []); this.movers.get(i).push(m); }
        for (let n = 0; n < 2; n++) {
          const f = Math.floor(this.r() * 4), k = Math.floor(this.r() * 5), r0 = 6 + Math.floor(this.r() * (s.len - 16));
          for (let r = r0; r < r0 + 6; r++) if (!b.rows[r][f * 5 + k] && !b.movers.some(m => m.r === r && m.f === f)) this.coins.add(this.key(base + r, f, k));
        }
        for (const row of b.rows) this.rows.push(row);
        for (let i = 0; i < C.GAP; i++) this.rows.push(new Uint8Array(20));
        this.made++;
      }
    }
    key(i, f, k) { return i * 20 + f * 5 + k; }
    cell(i, f, k) { if (i < 0) return 0; this.ensure(i + 60); return this.rows[i][f * 5 + k]; }
    coin(i, f, k) { return this.coins.has(this.key(i, f, k)); }
    moversAt(i) { return this.movers.get(i); }
  }
  MK.Course = Course;

  class Run {
    constructor(seed) {
      this.seed = seed; this.course = new Course(seed);
      this.pos = 0; this.speed = C.SPEED0; this.view = 0; this.coins = 0;
      this.x = 0; this.h = 0; this.vh = 0; this.air = false; this.pad = false; this.overHole = 0;
      this.state = 'run'; this.t = 0; this.ticks = 0; this.events = []; this.lastRow = 0;
      this.stat = { rot: 0, jump: 0, pad: 0, mover: 0, noRot: 0, noRotBest: 0 };
    }
    lane() { return Math.max(0, Math.min(4, Math.floor((this.x + 1) / 2 * 5))); }
    jump() {
      if (this.state !== 'run' || (this.air && this.overHole <= 0)) return false;
      if (this.air && this.overHole > 0) this.overHole = 0;
      this.air = true; this.vh = C.JUMP_V; this.pad = false; this.stat.jump++; this.events.push('jump'); return true;
    }
    rotate(dir) { if (this.state !== 'run') return; this.view = (this.view - dir + 4) % 4; this.stat.rot++; this.stat.noRot = 0; this.events.push(dir > 0 ? 'rotR' : 'rotL'); }
    move(dx) { if (this.state !== 'run') return; this.x = Math.max(-1 + C.PR, Math.min(1 - C.PR, this.x + dx)); }
    // 1回 = 1/60秒
    tick(input) {
      const dt = C.DT; this.t += dt; this.ticks++;
      if (this.state !== 'run') { if (this.state === 'fall') { this.vh -= C.GRAV * dt; this.h += this.vh * dt; } return; }
      if (input && input.mx) this.move(input.mx * Math.max(3.2, this.speed * 0.42) * dt);
      const before = this.pos;
      this.pos += this.speed * dt; this.speed = MK.speedAt(this.pos);
      this.stat.noRot += this.pos - before; this.stat.noRotBest = Math.max(this.stat.noRotBest, this.stat.noRot);
      if (this.air && this.overHole <= 0) { this.vh -= C.GRAV * dt; this.h += this.vh * dt; if (this.h <= 0) { this.h = 0; this.vh = 0; this.air = false; this.pad = false; this.events.push('land'); } }
      const row = Math.floor(this.pos), k = this.lane(); let c = this.course.cell(row, this.view, k);
      if (c === 4) c = 1;   // くずれる床は、乗るころには落ちている
      if (this.course.coin(row, this.view, k)) { this.course.coins.delete(this.course.key(row, this.view, k)); this.coins++; this.events.push('coin'); }
      const ms = this.course.moversAt(row);
      if (ms) { const u = (this.x + 1) / 2 * 5; for (const m of ms) { if (m.f !== this.view) continue; const o = MK.moverOff(m, this.t); if (u > o - 0.15 && u < o + m.w + 0.15) return this.die('crash'); } }
      if (c === 3 || (c === 2 && this.h < C.BOX_H - 0.06)) return this.die('crash');
      if (c === 5 && !this.air) { this.air = true; this.pad = true; this.vh = C.PAD_V; this.stat.pad++; this.events.push('pad'); }
      // 穴：ほんの少しだけ待ってから落ちる（ぎりぎりのジャンプを助ける）
      if (c === 1 && !this.air) { this.air = true; this.overHole = C.COYOTE; }
      if (this.overHole > 0) { this.overHole -= dt; if (this.overHole <= 0) { if (this.course.cell(row, this.view, this.lane()) % 3 === 1 || this.course.cell(row, this.view, this.lane()) === 4) return this.die('fall'); this.air = false; } }
      if (row !== this.lastRow) {
        // 動くかべのある列を無事に通った
        const pm = this.course.moversAt(this.lastRow); if (pm && pm.some(m => m.f === this.view)) this.stat.mover++;
        this.lastRow = row; const m = this.course.marks.find(m => m.at === row); if (m) this.events.push('stage:' + m.name);
        if (row > 0 && row % C.AREA === 0) this.events.push('area:' + row / C.AREA);
      }
    }
    finish() { if (this.state === 'run') { this.state = 'done'; this.t = 0; this.events.push('done'); } }
    die(how) { this.state = how; this.t = 0; this.vh = 0; this.h = how === 'fall' ? 0 : this.h; this.events.push(how); }
    dist() { return Math.floor(this.pos); }
  }
  MK.Run = Run;

  // ---------- ステージが本当に抜けられるかの確認 ----------
  // 1列ごとに：レーンは1つまで、面は1回まで動ける。地面ならジャンプ（J列空中）。ジャンプ台に乗るとJ2列とぶ
  // くずれる床は穴と同じ。動くかべは「まわして別の面に逃げられる」形にしか置かないので数えない
  MK.checkStage = function (st, J, J2) {
    const rows = [], lead = 6;
    for (let i = 0; i < lead; i++) rows.push(new Uint8Array(20));
    for (const r of build(st, 0, false).rows) rows.push(r);
    const key = (f, k, a, big) => (((f * 5 + k) * 16 + a) * 2) + (big ? 1 : 0);
    const bad = [];
    for (let f0 = 0; f0 < 4; f0++) for (let k0 = 0; k0 < 5; k0++) {
      let cur = new Set([key(f0, k0, 0, 0)]);
      for (let i = 0; i < rows.length && cur.size; i++) {
        const nx = new Set();
        for (const s of cur) {
          const big = s % 2, rest = s >> 1, a = rest % 16, fk = rest >> 4, f = fk / 5 | 0, k = fk % 5;
          for (const df of [0, 1, -1]) for (const dk of [0, 1, -1]) {
            const nf = (f + df + 4) % 4, nk = k + dk; if (nk < 0 || nk > 4) continue;
            for (const jump of a === 0 ? [false, true] : [false]) {
              let na = jump ? J : Math.max(0, a - 1), nb = jump ? 0 : (na > 0 ? big : 0), c = rows[i][nf * 5 + nk];
              if (c === 4) c = 1;
              if (c === 5 && na === 0) { na = J2; nb = 1; }
              const L = nb ? J2 : J, inAir = na > 0, high = na > 0 && na < L && na > 1;
              if (c === 3) continue;
              if (c === 2 && !high) continue;
              if (c === 1 && !inAir) continue;
              nx.add(key(nf, nk, na, nb));
            }
          }
        }
        cur = nx;
      }
      if (!cur.size) bad.push(f0 + ':' + k0);
    }
    return bad;
  };
})();
