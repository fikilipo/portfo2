import { useEffect, useState } from "react";
import { useEra } from "../context/EraContext";

const LINES = [
  "[BOOT] modem.handshake … OK",
  "[BOOT] dial-up tone : 56k",
  "[BOOT] mounting /archive/runet …",
  "[BOOT] decoding cyrillic … koi8-r → utf-8",
  "[BOOT] загрузка эпох [3] … OK",
  "[BOOT] press ENTER чтобы войти",
];

export function Boot() {
  const { goTo } = useEra();
  const [shown, setShown] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (shown >= LINES.length) {
      setReady(true);
      return;
    }
    const t = window.setTimeout(() => setShown((n) => n + 1), 320);
    return () => window.clearTimeout(t);
  }, [shown]);

  useEffect(() => {
    if (!ready) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") goTo("wild");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, goTo]);

  return (
    <section className="crt relative min-h-screen w-full bg-black text-wild-lime font-mono overflow-hidden">
      <div className="relative z-[1] mx-auto max-w-3xl px-6 pt-28 md:pt-32">
        <p className="text-xs opacity-70">echo-runet · v1.0 · cognition mainframe</p>
        <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-widest">
          ЭХО РУНЕТА
        </h1>
        <p className="mt-2 text-sm opacity-80">
          цифровое исследование души российского интернета
        </p>

        <div className="mt-10 space-y-1 text-sm md:text-base">
          {LINES.slice(0, shown).map((l, i) => (
            <p key={i}>{l}</p>
          ))}
          {!ready && <span className="inline-block h-4 w-2 bg-wild-lime animate-blink" />}
        </div>

        {ready && (
          <div className="mt-10 flex flex-col items-start gap-4">
            <button
              onClick={() => goTo("wild")}
              className="border-2 border-wild-lime px-5 py-2 text-wild-lime hover:bg-wild-lime hover:text-black animate-flicker"
            >
              [ENTER] войти в архив
            </button>
            <p className="text-xs opacity-60">
              навигация: ←/→ · клавиши 1/2/3 — эпохи · `/` — командная палитра в эпохе 3
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
