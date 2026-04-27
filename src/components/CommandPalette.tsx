import { useEffect, useRef, useState } from "react";
import { useEra } from "../context/EraContext";
import { NAV_ERAS, type EraId } from "../types";

interface Command {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

/** Era-3 easter egg: press `/` to open the command palette. */
export function CommandPalette() {
  const { era, goTo } = useEra();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (era !== "eco") {
      setOpen(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "/") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [era]);

  useEffect(() => {
    if (open) {
      setQ("");
      setAiAnswer(null);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  if (era !== "eco" || !open) return null;

  const commands: Command[] = [
    ...NAV_ERAS.map<Command>((e) => ({
      id: `era-${e.id}`,
      label: `Перейти: ${e.title}`,
      hint: e.range,
      run: () => {
        setOpen(false);
        goTo(e.id as EraId);
      },
    })),
    {
      id: "summon-ai",
      label: "summon-ai · о смысле эпохи",
      hint: "генерация",
      run: () => {
        setAiAnswer("");
        const text =
          "Эпоха «Экосистемы» — это интерфейс, который перестал быть страницей и стал собеседником. Рунет научился предсказывать тебя ещё до того, как ты сам себя понял.";
        let i = 0;
        const tick = () => {
          if (i > text.length) return;
          setAiAnswer(text.slice(0, i));
          i += 2;
          if (i <= text.length + 2) window.setTimeout(tick, 18);
        };
        tick();
      },
    },
    {
      id: "about",
      label: "about · кто построил «Эхо»",
      hint: "info",
      run: () => {
        setAiAnswer(
          "«Эхо Рунета» — иммерсивный веб-перформанс. Vite + React + Tailwind + GSAP. Сделано как письмо рунету самого себя из 2026 года.",
        );
      },
    },
  ];

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-[85] flex items-start justify-center bg-black/60 backdrop-blur-md p-6 pt-[18vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="glass w-[min(640px,92vw)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <span className="text-eco-dim font-mono text-xs">/</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="команда или эпоха…"
            className="w-full bg-transparent text-eco-ink placeholder:text-eco-dim/70 outline-none font-modern"
          />
          <span className="text-[10px] text-eco-dim font-mono">ESC</span>
        </div>
        <ul className="max-h-[40vh] overflow-y-auto">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-eco-dim">ничего не найдено</li>
          )}
          {filtered.map((c) => (
            <li key={c.id}>
              <button
                onClick={c.run}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-eco-ink hover:bg-white/5"
              >
                <span>{c.label}</span>
                <span className="text-xs text-eco-dim font-mono">{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        {aiAnswer !== null && (
          <div className="border-t border-white/10 px-4 py-3 text-sm text-eco-ink/90 font-modern">
            <span className="mr-2 text-eco-accent2">::</span>
            {aiAnswer}
            <span className="ml-1 inline-block h-3 w-2 -mb-0.5 bg-eco-accent2 animate-blink" />
          </div>
        )}
      </div>
    </div>
  );
}
