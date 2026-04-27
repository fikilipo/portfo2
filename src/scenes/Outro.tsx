import { useEra } from "../context/EraContext";
import { NAV_ERAS } from "../types";

export function Outro() {
  const { goTo } = useEra();
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050507] text-eco-ink font-modern">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-5xl px-4 md:px-8 pt-32 pb-24">
        <p className="text-xs uppercase tracking-[.4em] text-eco-dim">финал</p>
        <h1 className="mt-4 text-5xl md:text-7xl font-extrabold">
          Это и есть{" "}
          <span className="bg-gradient-to-r from-eco-accent via-pink-400 to-eco-accent2 bg-clip-text text-transparent">
            эхо
          </span>{" "}
          Рунета.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-eco-dim leading-relaxed">
          Три эпохи — три способа быть в сети. Они не сменяют друг друга,
          они продолжают звучать одновременно. Ты только что прошёл через
          них и услышал каждую.
        </p>

        {/* timeline */}
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {NAV_ERAS.map((e, i) => (
            <li key={e.id} className="glass p-5">
              <p className="text-xs font-mono text-eco-accent2">0{i + 1} · {e.range}</p>
              <p className="mt-2 text-2xl font-bold">{e.title}</p>
              <p className="mt-2 text-sm text-eco-dim">{e.tagline}</p>
              <button
                onClick={() => goTo(e.id)}
                className="mt-4 text-sm text-eco-accent hover:underline"
              >
                вернуться →
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-20 flex flex-col items-start gap-2 border-t border-white/10 pt-8 text-sm text-eco-dim">
          <p>
            «Эхо Рунета» — иммерсивный веб-перформанс. React · Vite · Tailwind · GSAP.
          </p>
          <p>
            Сделано как письмо рунету самого себя из 2026 года.
          </p>
        </div>
      </div>
    </section>
  );
}
