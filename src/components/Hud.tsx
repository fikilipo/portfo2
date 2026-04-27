import { useEra } from "../context/EraContext";
import { NAV_ERAS } from "../types";

const styleByEra: Record<string, { wrap: string; pill: string; active: string; idle: string; brand: string }> = {
  wild: {
    wrap: "bg-black/70 border-wild-lime/40",
    pill: "font-wild text-wild-ink",
    active: "bg-wild-lime text-black",
    idle: "text-wild-cyan hover:text-wild-gold",
    brand: "text-wild-lime font-wild tracking-widest",
  },
  web2: {
    wrap: "bg-white/85 border-web2-border shadow-md",
    pill: "font-web2 text-web2-ink",
    active: "btn-glossy",
    idle: "text-web2-accent hover:text-web2-orange",
    brand: "text-web2-accent font-web2 font-bold",
  },
  eco: {
    wrap: "glass border-white/10",
    pill: "font-modern text-eco-ink",
    active: "bg-eco-accent text-white shadow-[0_0_24px_rgba(124,92,255,.55)]",
    idle: "text-eco-dim hover:text-eco-ink",
    brand: "text-eco-ink font-modern font-extrabold",
  },
  outro: {
    wrap: "glass border-white/10",
    pill: "font-modern text-eco-ink",
    active: "bg-eco-accent text-white",
    idle: "text-eco-dim hover:text-eco-ink",
    brand: "text-eco-ink font-modern font-extrabold",
  },
  boot: {
    wrap: "bg-black/80 border-wild-lime/30",
    pill: "font-mono text-wild-lime",
    active: "bg-wild-lime text-black",
    idle: "text-wild-lime/60",
    brand: "text-wild-lime font-mono",
  },
};

export function Hud() {
  const { era, goTo } = useEra();
  const s = styleByEra[era] ?? styleByEra.eco;

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-3 py-2 rounded-2xl border backdrop-blur ${s.wrap}`}
      role="navigation"
      aria-label="Эпохи"
    >
      <div className="flex items-center gap-3">
        <div className={`px-2 text-xs uppercase ${s.brand}`}>
          ЭХО · РУНЕТА
          {era === "outro" && <span className="ml-2 opacity-60">· финал</span>}
        </div>
        <div className="h-5 w-px bg-current opacity-20" />
        <ul className="flex items-center gap-1">
          {NAV_ERAS.map((e, i) => {
            const active = e.id === era;
            return (
              <li key={e.id}>
                <button
                  onClick={() => goTo(e.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs md:text-sm transition ${s.pill} ${
                    active ? s.active : s.idle
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="opacity-60 mr-1">0{i + 1}</span>
                  {e.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
