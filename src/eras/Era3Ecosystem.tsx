import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useEra } from '../EraContext';
import { playClick, playDing } from '../audio/sfx';

const Scene3D = lazy(() => import('./era3/Scene3D'));

interface Msg {
  role: 'user' | 'system';
  text: string;
}

const SYSTEM_REPLIES: Array<{ match: RegExp; reply: string }> = [
  { match: /привет|здравствуй|hello/i, reply: 'Здравствуйте. Я нейро-эхо. Могу описать настроение Рунета 2026.' },
  { match: /кто ты/i, reply: 'Я — синтетический наблюдатель. Я существую, пока существует ваш курсор.' },
  { match: /дуров/i, reply: 'Стена возвращена. Но никто этого уже не заметил.' },
  { match: /что нового/i, reply: 'Сегодня в Рунете: тёплая нейро-метель, индекс ностальгии 7.2, риск глитча низкий.' },
  { match: /стих|поэзия|написать/i, reply: 'Тишина в проводах,\nпиксель помнит ICQ,\nты — лог из 1999-го,\nкоторый всё ещё бежит.' },
];

export function Era3Ecosystem() {
  const { muted, triggerGlitch } = useEra();
  const cursorRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'system', text: '> система. готова. чем помочь?' },
  ]);
  const [input, setInput] = useState('');

  // Кастомный курсор + интерактивный градиент
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        heroRef.current.style.setProperty('--mx', `${x}%`);
        heroRef.current.style.setProperty('--my', `${y}%`);
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  function send() {
    const text = input.trim();
    if (!text) return;
    if (text === '/glitch') {
      setInput('');
      setMsgs((m) => [...m, { role: 'user', text }, { role: 'system', text: '> разрыв реальности инициирован.' }]);
      triggerGlitch();
      return;
    }
    const reply =
      SYSTEM_REPLIES.find((r) => r.match.test(text))?.reply ??
      `> я обработал «${text}». вывод: совпадений с Рунетом 2026 не найдено.`;
    setMsgs((m) => [...m, { role: 'user', text }, { role: 'system', text: reply }]);
    setInput('');
    if (!muted) playDing();
  }

  return (
    <div
      className="era-root min-h-screen w-full text-eco-ink"
      style={{
        backgroundColor: '#070708',
        cursor: 'none',
        fontFamily: 'Manrope, Inter, system-ui, sans-serif',
      }}
    >
      {/* кастомный курсор */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.7)',
          mixBlendMode: 'difference',
          background: 'rgba(255,255,255,0.04)',
          transition: 'width 200ms ease, height 200ms ease',
        }}
      />

      <section
        ref={heroRef}
        className="relative min-h-screen flex items-end pb-12 px-4 sm:px-10 overflow-hidden"
        style={
          {
            background:
              'radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(124,58,237,0.35), transparent 55%), #070708',
          } as React.CSSProperties
        }
      >
        <Suspense fallback={null}>
          <div className="absolute inset-0 z-0 opacity-90">
            <Scene3D />
          </div>
        </Suspense>

        <div className="relative z-10 max-w-5xl">
          <div className="text-xs font-mono tracking-[0.3em] text-eco-lime/90 mb-3">
            /03 · ЭКОСИСТЕМА · НЕЙРО-СИНТЕЗ · 2020 — 2026
          </div>
          <h1
            className="font-black leading-[0.85] tracking-tight"
            style={{
              fontSize: 'clamp(60px, 12vw, 200px)',
              backgroundImage:
                'linear-gradient(120deg, #F5F5F7 0%, #C6FF00 40%, #7C3AED 80%, #F5F5F7 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              filter: 'drop-shadow(0 6px 30px rgba(124,58,237,0.25))',
            }}
          >
            эхо<br />рунета<span className="text-eco-lime">.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-white/75">
            Здесь интерфейсы догадываются о вас раньше, чем вы — о себе. Чёрный фон стал нормой,
            кириллица — оружием, AI — собеседником, который умеет молчать.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#console"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
                if (!muted) playClick();
              }}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 backdrop-blur-md text-sm hover:bg-white/10 transition"
            >
              открыть AI-консоль ↓
            </a>
            <button
              onClick={() => {
                if (!muted) playClick();
                triggerGlitch();
              }}
              className="rounded-full bg-eco-lime text-black px-5 py-2.5 text-sm font-semibold hover:brightness-95 transition"
            >
              /glitch ⚡
            </button>
          </div>
        </div>
      </section>

      {/* Метрики «нейро-погоды» */}
      <section className="px-4 sm:px-10 py-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        <Metric label="Индекс ностальгии" value="7.2" hint="по 10-балльной" />
        <Metric label="Активных эпох" value="3" hint="одновременно" />
        <Metric label="Глитч-энергия" value="42%" hint="ниже среднего" />
        <Metric label="Темп Рунета" value="120 BPM" hint="субъективно" />
      </section>

      {/* Хроника */}
      <section className="px-4 sm:px-10 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-black mb-8">хроника. цифры. духи.</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { y: '2020', t: 'Тёмная тема', d: 'Чёрный фон становится дефолтом по всему Рунету.' },
            { y: '2021', t: 'Огромная типографика', d: '12vw заголовки. Кириллица возвращает себе достоинство.' },
            { y: '2022', t: 'Glassmorphism', d: 'Полупрозрачные карточки заменяют скевоморфизм навсегда.' },
            { y: '2023', t: 'AI-ассистенты', d: 'Иконка LLM появляется в каждом интерфейсе.' },
            { y: '2024', t: 'Нейро-стикеры', d: 'Сообщения теперь синтезируются по контексту разговора.' },
            { y: '2026', t: 'Эхо', d: 'Рунет вспоминает себя. Сайт, который вы сейчас читаете.' },
          ].map((c) => (
            <article
              key={c.y}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-white/25"
            >
              <div className="text-xs font-mono tracking-[0.3em] text-eco-lime/80 mb-2">/{c.y}</div>
              <h3 className="text-2xl font-bold">{c.t}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{c.d}</p>
              <div
                aria-hidden
                className="absolute -inset-1 -z-10 opacity-0 group-hover:opacity-60 transition"
                style={{
                  background:
                    'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.4), transparent 60%)',
                }}
              />
            </article>
          ))}
        </div>
      </section>

      {/* AI-консоль */}
      <section id="console" className="px-4 sm:px-10 py-16 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-black mb-2">AI-консоль</h2>
        <p className="text-sm text-white/60 mb-6">Подсказки: «привет», «кто ты», «что нового», «напиши стих», команда <code className="bg-white/10 px-1 rounded">/glitch</code>.</p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4">
          <ul className="space-y-2 max-h-72 overflow-y-auto pr-1 font-mono text-sm">
            {msgs.map((m, i) => (
              <li
                key={i}
                className={
                  m.role === 'user'
                    ? 'text-white'
                    : 'text-eco-lime whitespace-pre-line'
                }
              >
                {m.role === 'user' ? '> ' + m.text : m.text}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-eco-lime font-mono">»</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send();
              }}
              placeholder="напишите что-нибудь нейро..."
              className="flex-1 bg-transparent border-b border-white/15 focus:border-eco-lime outline-none py-2 text-sm font-mono"
            />
            <button
              onClick={send}
              className="rounded-full bg-eco-lime text-black px-4 py-1.5 text-sm font-semibold"
            >
              отправить
            </button>
          </div>
        </div>
      </section>

      <footer className="px-4 sm:px-10 py-12 max-w-7xl mx-auto text-xs text-white/40 flex flex-wrap items-center justify-between gap-3">
        <div>© 2020 — 2026. эхо рунета. сделано вручную.</div>
        <div className="font-mono">cyrillic-first · dark-by-default · ai-aware</div>
      </footer>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5">
      <div className="text-xs uppercase tracking-widest text-white/50">{label}</div>
      <div className="mt-2 text-4xl font-black">{value}</div>
      <div className="mt-1 text-xs text-white/40">{hint}</div>
    </div>
  );
}
