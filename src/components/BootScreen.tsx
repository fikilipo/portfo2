import { useEffect, useState } from 'react';

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const total = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          setHidden(true);
          onDone();
        }, 220);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[1100] flex flex-col items-center justify-center bg-black text-[#7CFFB0] font-mono"
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 opacity-40 pointer-events-none"
           style={{
             background:
               'radial-gradient(ellipse at center, rgba(124,255,176,0.15), transparent 70%)',
           }} />
      <pre className="text-xs sm:text-sm leading-tight text-center select-none">
{`╔══════════════════════════════════╗
║   ECHO RUNET — BOOTING...        ║
║   v0.1.0 · cyrillic-first        ║
╚══════════════════════════════════╝`}
      </pre>
      <div className="mt-6 text-[11px] tracking-widest opacity-80">
        ЗАГРУЗКА ВРЕМЕННЫХ СЛОЁВ {Math.floor(progress * 100)}%
      </div>
      <div className="mt-3 h-2 w-64 border border-[#7CFFB0]/40">
        <div
          className="h-full bg-[#7CFFB0]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          setHidden(true);
          onDone();
        }}
        className="absolute bottom-6 right-6 text-[11px] underline opacity-70 hover:opacity-100"
      >
        пропустить →
      </button>
    </div>
  );
}
