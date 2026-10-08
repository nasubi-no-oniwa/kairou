// =============================================
//  回廊快走  音楽（その場で合成。区間ごとに曲調が変わる）
// =============================================
(function () {
  const N = null;
  // 区間ごとの曲：テンポ、和音（根音のMIDI番号と種類）、メロディ（16分音符×16）
  const SONGS = [
    { bpm: 132, ch: [[57, 'm'], [53, 'M'], [60, 'M'], [55, 'M']], mel: [76, N, 79, N, 81, N, 79, 76, N, 74, N, 76, N, N, 72, N] },
    { bpm: 126, ch: [[60, 'M'], [57, 'm'], [53, 'M'], [55, 'M']], mel: [79, N, N, 76, N, N, 81, N, 79, N, 76, N, 74, N, N, N] },
    { bpm: 138, ch: [[62, 'm'], [58, 'M'], [60, 'M'], [57, 'm']], mel: [74, N, 77, N, 81, N, 77, N, 79, N, 76, N, 72, N, 74, N] },
    { bpm: 120, ch: [[55, 'M'], [52, 'm'], [48, 'M'], [50, 'M']], mel: [79, N, 78, N, 76, N, N, 74, N, 76, N, 79, N, N, 83, N] },
    { bpm: 140, ch: [[53, 'M'], [55, 'M'], [52, 'm'], [57, 'm']], mel: [77, N, 76, N, 72, N, 76, N, 79, N, N, 77, 76, N, 74, N] },
    { bpm: 124, ch: [[64, 'm'], [60, 'M'], [62, 'M'], [59, 'm']], mel: [83, N, N, 79, N, 76, N, N, 81, N, N, 78, N, 74, N, N] },
    { bpm: 116, ch: [[57, 'm'], [57, 'm'], [53, 'M'], [52, 'M']], mel: [69, N, 72, N, 76, N, N, 72, 74, N, 71, N, 68, N, N, N] },
    { bpm: 144, ch: [[60, 'M'], [64, 'm'], [65, 'M'], [67, 'M']], mel: [84, N, 79, N, 76, 79, N, 84, N, 83, N, 79, 81, N, N, N] }
  ];
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  let ctx = null, gain = null, timer = 0, song = 0, step = 0, nextT = 0, on = false;
  function note(f, t, d, type, v) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(gain); o.start(t); o.stop(t + d + 0.02);
  }
  function kick(t) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16); o.connect(g); g.connect(gain); o.start(t); o.stop(t + 0.18); }
  function hat(t) { const b = ctx.createBuffer(1, 2205, 44100), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = 'highpass'; f.frequency.value = 6000; g.gain.value = 0.12; s.buffer = b; s.connect(f); f.connect(g); g.connect(gain); s.start(t); }
  function schedule() {
    if (!on || document.hidden) return;
    const S = SONGS[song % SONGS.length], sp = 60 / S.bpm / 4;
    while (nextT < ctx.currentTime + 0.15) {
      const t = nextT, s16 = step % 16, bar = Math.floor(step / 16) % 4, [root, kind] = S.ch[bar];
      if (s16 % 4 === 0) kick(t);
      if (s16 % 2 === 1) hat(t);
      if (s16 % 2 === 0) note(hz(root - 12 + (s16 % 8 === 4 ? 7 : 0)), t, sp * 1.8, 'triangle', 0.22);
      const tri = kind === 'M' ? [0, 4, 7] : [0, 3, 7];
      note(hz(root + 12 + tri[s16 % 3]), t, sp * 0.9, 'square', 0.035);
      const m = S.mel[s16]; if (m && bar !== 3) note(hz(m), t, sp * 2.4, 'square', 0.05);
      step++; nextT += sp;
    }
  }
  MK.Music = {
    start(c, area) { ctx = c; if (!ctx) return; if (!gain) { gain = ctx.createGain(); gain.gain.value = 0.32; gain.connect(ctx.destination); } song = area || 0; step = 0; nextT = ctx.currentTime + 0.1; on = true; clearInterval(timer); timer = setInterval(schedule, 40); },
    area(a) { song = a; },
    stop() { on = false; clearInterval(timer); }
  };
})();
