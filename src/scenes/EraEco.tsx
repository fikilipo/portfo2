import { useEffect, useRef, useState } from "react";
import { useEra } from "../context/EraContext";

const METRICS = [
  { k: ".ru-доменов",  v: 5_400_000, suffix: "" },
  { k: "MAU рунета",   v: 102,       suffix: " млн" },
  { k: "генераций ИИ/день", v: 18.4, suffix: " млн" },
  { k: "ср. время онлайн", v: 4.2, suffix: " ч" },
];

const AI_REPLIES = [
  "В 2026 интерфейс — это разговор. Кнопки больше не просят, они предлагают.",
  "Каждый клик стал репликой. Каждая пауза — ответом нейросети, которая уже знает тебя.",
  "Рунет 2020-х — это не страницы, а среда. Не сайты, а голоса.",
];

function useCountUp(target: number, durMs = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / durMs);
      const ease = 1 - Math.pow(1 - k, 3);
      setV(target * ease);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durMs]);
  return v;
}

function Metric({ k, v, suffix }: { k: string; v: number; suffix: string }) {
  const x = useCountUp(v);
  const fmt =
    v > 1000
      ? Math.round(x).toLocaleString("ru-RU")
      : x.toFixed(1);
  return (
    <div className="glass p-5">
      <p className="text-xs uppercase tracking-widest text-eco-dim">{k}</p>
      <p className="mt-2 text-3xl md:text-4xl font-extrabold text-eco-ink">
        {fmt}
        <span className="text-eco-accent2 text-lg">{suffix}</span>
      </p>
    </div>
  );
}

export function EraEco() {
  const { next } = useEra();
  const [grad, setGrad] = useState({ x: 50, y: 35 });
  const [aiOpen, setAiOpen] = useState(false);
  const [aiText, setAiText] = useState("");
  const aiRef = useRef<number | null>(null);

  // throttle mousemove via rAF — иначе setGrad ререндерит сцену на каждое движение мыши
  useEffect(() => {
    let raf = 0;
    let pending: { x: number; y: number } | null = null;
    const onMove = (e: MouseEvent) => {
      pending = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        if (pending) setGrad(pending);
        pending = null;
        raf = 0;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // AI typewriter interval cleanup на unmount эпохи (иначе setState на размонтированном компоненте)
  useEffect(() => {
    return () => {
      if (aiRef.current) window.clearInterval(aiRef.current);
    };
  }, []);

  const askAi = () => {
    setAiOpen(true);
    const text = AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)];
    let i = 0;
    setAiText("");
    if (aiRef.current) window.clearInterval(aiRef.current);
    aiRef.current = window.setInterval(() => {
      i += 2;
      setAiText(text.slice(0, i));
      if (i >= text.length) {
        if (aiRef.current) window.clearInterval(aiRef.current);
      }
    }, 22);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-eco-bg text-eco-ink font-modern">
      {/* mesh gradient that follows cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(800px circle at ${grad.x}% ${grad.y}%, rgba(124,92,255,.30), transparent 55%),
            radial-gradient(700px circle at ${100 - grad.x}% ${grad.y + 20}%, rgba(34,211,238,.22), transparent 60%),
            radial-gradient(900px circle at 50% 110%, rgba(124,92,255,.18), transparent 60%)
          `,
        }}
      />
      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-6xl px-4 md:px-8 pt-32 pb-24">
        <p className="text-xs uppercase tracking-[.4em] text-eco-dim">эпоха 03 · 2020 — 2026</p>
        <h1 className="mt-4 text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95]">
          Рунет, который
          <br />
          <span className="bg-gradient-to-r from-eco-accent via-fuchsia-400 to-eco-accent2 bg-clip-text text-transparent">
            понимает тебя.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-eco-dim leading-relaxed">
          Минимализм, тёмные интерфейсы, нейросети-собеседники и графитовый стеклянный
          UI — третья кожа российского интернета.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            onClick={askAi}
            className="rounded-full bg-eco-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(124,92,255,.5)] hover:scale-[1.02] transition"
          >
            спросить «Эхо»
          </button>
          <button
            onClick={next}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-eco-ink hover:bg-white/5"
          >
            к финалу →
          </button>
          <kbd className="ml-2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-eco-dim font-mono">
            нажми /
          </kbd>
          <span className="text-xs text-eco-dim">— командная палитра</span>
        </div>

        {/* metrics */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {METRICS.map((m) => (
            <Metric key={m.k} {...m} />
          ))}
        </div>

        {/* feature row */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Нейроитог эпохи",
              d: "Сайт сам резюмирует, что ты увидел в каждой эре. Это твой персональный Wrapped по Рунету.",
            },
            {
              t: "Голос интерфейса",
              d: "AI-ассистент в углу понимает контекст и реагирует тоном эпохи, в которой ты сейчас находишься.",
            },
            {
              t: "Глитч-память",
              d: "Между эпохами — деформация пространства. Не баг, а способ помнить, что интернет всегда меняется.",
            },
          ].map((c) => (
            <div key={c.t} className="glass p-5">
              <p className="text-sm font-semibold text-eco-ink">{c.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-eco-dim">{c.d}</p>
            </div>
          ))}
        </div>

        {/* big quote */}
        <p className="mt-20 text-2xl md:text-3xl text-eco-ink/90 leading-snug max-w-3xl">
          «Когда интернет научился отвечать, он перестал быть библиотекой.
          Он стал зеркалом.»
        </p>
      </div>

      {/* AI floating bubble */}
      {aiOpen && (
        <div className="fixed bottom-6 right-6 z-[70] glass w-[min(420px,92vw)] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-eco-accent2">Эхо · нейро-ответ</p>
            <button
              className="text-eco-dim hover:text-eco-ink text-xs"
              onClick={() => setAiOpen(false)}
              aria-label="закрыть"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-eco-ink">
            {aiText}
            <span className="ml-1 inline-block h-3 w-2 -mb-0.5 bg-eco-accent2 animate-blink" />
          </p>
        </div>
      )}
    </section>
  );
}
