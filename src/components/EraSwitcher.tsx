import { ERAS, useEra } from '../EraContext';
import { playClick } from '../audio/sfx';

export function EraSwitcher() {
  const { era, setEra, isTransitioning, muted } = useEra();

  return (
    <nav
      aria-label="Переключатель эпох"
      className="fixed top-3 left-1/2 z-50 -translate-x-1/2 w-[min(96vw,820px)]"
    >
      <div className="flex items-stretch gap-1 rounded-full border border-white/10 bg-black/55 p-1 backdrop-blur-md shadow-xl">
        {ERAS.map((e) => {
          const active = e.id === era;
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => {
                if (!muted) playClick();
                setEra(e.id);
              }}
              disabled={isTransitioning}
              className={
                'group relative flex-1 rounded-full px-3 py-2 text-left transition ' +
                (active
                  ? 'bg-white text-black shadow'
                  : 'text-white/80 hover:text-white hover:bg-white/5')
              }
              aria-current={active ? 'true' : undefined}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] tracking-widest opacity-70">
                  /0{e.id}
                </span>
                <span className="font-bold text-sm sm:text-base truncate">
                  {e.title}
                </span>
              </div>
              <div className="mt-0.5 hidden sm:block text-[11px] leading-tight opacity-60 truncate">
                {e.year} · {e.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
