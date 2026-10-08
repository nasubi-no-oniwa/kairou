// =============================================
//  回廊快走  あいことば対戦（Firebase Realtime Database）
//
//  データの形： kairou/{あいことば}/
//    players/{0|1}      : { id, name }              2人まで（3人目は満員）
//    ready/{0|1}        : 何回戦をやりたいか         （2人そろうと開始）
//    game               : { round, seed, startAt }  （0番の人が書く。同じ seed で同じコース）
//    st/{0|1}           : { t, x, h, v, sc, d }      走っている様子（1秒に7回くらい）
//    end/r{回戦}/{0|1}  : { t, d, c, sc, how }       終わったときの記録（how：fall / crash / done / left）
// =============================================
(function () {
  const clean = s => String(s || '').replace(/[.#$\[\]\/\s]/g, '').slice(0, 20);
  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  class Room {
    constructor(db, code, name, cb) {
      this.db = db; this.code = clean(code); this.name = (String(name || '').trim().slice(0, 8)) || 'ななし';
      this.cb = cb || {}; this.id = uid(); this.slot = -1; this.players = {}; this.ready = {};
      this.game = null; this.round = 0; this.subs = []; this.rsubs = []; this.offset = 0; this.left = false;
      this.root = db.ref('kairou/' + this.code);
    }
    call(n, ...a) { if (this.cb[n]) this.cb[n](...a); }
    now() { return Date.now() + this.offset; }
    on(ref, ev, fn, list) { ref.on(ev, fn); (list || this.subs).push([ref, ev, fn]); }
    async join() {
      if (!this.code) throw new Error('あいことばを入れてください');
      this.on(this.db.ref('.info/serverTimeOffset'), 'value', s => { this.offset = s.val() || 0; });
      for (const s of [0, 1]) {
        const res = await this.root.child('players/' + s).transaction(cur => (cur ? undefined : { id: this.id, name: this.name }));
        if (res.committed && res.snapshot.val() && res.snapshot.val().id === this.id) { this.slot = s; break; }
      }
      if (this.slot < 0) { this.leave(); throw new Error('この部屋は満員です（2人まで）。ちがうあいことばにしてください'); }
      const s = this.slot, o = 1 - s;
      for (const p of ['players/', 'ready/', 'st/']) this.root.child(p + s).onDisconnect().remove();
      const g0 = (await this.root.child('game').once('value')).val();
      this.joinRound = ((g0 && g0.round) || 0) + 1;
      this.on(this.root.child('players'), 'value', snap => {
        const prev = this.players; this.players = snap.val() || {};
        this.call('onPeople', this.people());
        if (prev[o] && !this.players[o]) this.call('onOppLeft');
        this.tryStart();
      });
      this.on(this.root.child('ready'), 'value', snap => { this.ready = snap.val() || {}; this.tryStart(); });
      this.on(this.root.child('game'), 'value', snap => this.onGame(snap.val()));
      this.on(this.root.child('st/' + o), 'value', snap => { const v = snap.val(); if (v) this.call('onOpp', v); });
      await this.root.child('ready/' + s).set(this.joinRound);
      return { slot: s, code: this.code };
    }
    people() { return { names: [0, 1].map(s => (this.players[s] ? this.players[s].name : null)), slot: this.slot }; }
    tryStart() {
      if (this.slot !== 0 || this.left || !this.joinRound) return;
      const r = this.ready || {}, next = (this.game ? this.game.round : 0) + 1;
      if (!this.players[0] || !this.players[1] || !(r[0] >= next && r[1] >= next) || this.starting === next) return;
      this.starting = next;
      this.root.child('game').set({ round: next, seed: (Math.random() * 2147483647) | 0, startAt: this.now() + 3600 });
      if (next > 2) this.root.child('end/r' + (next - 2)).remove();
    }
    onGame(g) {
      if (!g || this.left) { this.game = g; return; }
      if (this.game && this.game.round === g.round) return;
      this.game = g;
      if (g.round < this.joinRound) return;
      this.round = g.round;
      for (const [ref, ev, fn] of this.rsubs) ref.off(ev, fn); this.rsubs = [];
      this.call('onStart', { round: g.round, seed: g.seed, slot: this.slot, wait: Math.max(0, g.startAt - this.now()), names: this.people().names });
      this.on(this.root.child('end/r' + g.round), 'value', snap => this.call('onEnd', snap.val() || {}), this.rsubs);
    }
    sendState(o) { if (!this.left) this.root.child('st/' + this.slot).set(o); }
    sendEnd(o) { if (!this.left) this.root.child('end/r' + this.round + '/' + this.slot).set(o); }
    rematch() { if (!this.left) this.root.child('ready/' + this.slot).set(this.round + 1); }
    leave() {
      if (this.left) return; this.left = true;
      for (const [ref, ev, fn] of this.subs.concat(this.rsubs)) ref.off(ev, fn);
      this.subs = []; this.rsubs = [];
      if (this.slot >= 0) for (const p of ['players/', 'ready/', 'st/']) this.root.child(p + this.slot).remove();
    }
  }
  MK.Room = Room; MK.cleanCode = clean;
})();
