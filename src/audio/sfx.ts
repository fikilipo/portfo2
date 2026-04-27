/**
 * Лёгкие эффекты на Web Audio — никаких ассетов, всё синтезируется.
 * Используем общий AudioContext, ленивая инициализация.
 */

let ctx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const W = window as Window & { webkitAudioContext?: typeof AudioContext };
    const C = window.AudioContext || W.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

export function playGlitch(volume = 0.05) {
  const a = ac();
  if (!a) return;
  const t = a.currentTime;
  const dur = 0.35;
  const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const k = 1 - i / data.length;
    data[i] = (Math.random() * 2 - 1) * k * k;
  }
  const src = a.createBufferSource();
  src.buffer = buf;
  const g = a.createGain();
  g.gain.value = volume;
  const lp = a.createBiquadFilter();
  lp.type = 'bandpass';
  lp.frequency.value = 1800;
  lp.Q.value = 0.7;
  src.connect(lp).connect(g).connect(a.destination);
  src.start(t);
  src.stop(t + dur);
}

export function playDialup(volume = 0.06) {
  const a = ac();
  if (!a) return;
  const t = a.currentTime;
  const tones: Array<[number, number, number]> = [
    // freq, start, dur
    [1100, 0.0, 0.25],
    [2100, 0.25, 0.35],
    [800, 0.6, 0.2],
    [2400, 0.85, 0.25],
    [600, 1.1, 0.4],
  ];
  tones.forEach(([f, s, d]) => {
    const o = a.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = a.createGain();
    g.gain.value = 0;
    g.gain.setValueAtTime(0, t + s);
    g.gain.linearRampToValueAtTime(volume, t + s + 0.02);
    g.gain.linearRampToValueAtTime(0, t + s + d);
    o.connect(g).connect(a.destination);
    o.start(t + s);
    o.stop(t + s + d + 0.02);
  });

  // финальный «шум согласования»
  const dur = 1.4;
  const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const k = i / data.length;
    data[i] = (Math.random() * 2 - 1) * (1 - k) * 0.6;
  }
  const src = a.createBufferSource();
  src.buffer = buf;
  const g = a.createGain();
  g.gain.value = volume * 0.7;
  const bp = a.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1500;
  src.connect(bp).connect(g).connect(a.destination);
  src.start(t + 1.5);
  src.stop(t + 1.5 + dur);
}

export function playDing(volume = 0.05) {
  const a = ac();
  if (!a) return;
  const t = a.currentTime;
  const o = a.createOscillator();
  o.type = 'triangle';
  o.frequency.setValueAtTime(880, t);
  o.frequency.exponentialRampToValueAtTime(1320, t + 0.08);
  const g = a.createGain();
  g.gain.value = 0;
  g.gain.linearRampToValueAtTime(volume, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + 0.4);
}

export function playClick(volume = 0.04) {
  const a = ac();
  if (!a) return;
  const t = a.currentTime;
  const o = a.createOscillator();
  o.type = 'square';
  o.frequency.value = 1500;
  const g = a.createGain();
  g.gain.value = 0;
  g.gain.linearRampToValueAtTime(volume, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + 0.07);
}
