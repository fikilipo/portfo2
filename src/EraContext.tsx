import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type Era = 1 | 2 | 3;

export const ERAS: { id: Era; year: string; title: string; subtitle: string }[] = [
  { id: 1, year: '1997 — 2003', title: 'Дикий Запад', subtitle: 'Народ.ру, ICQ, под construction' },
  { id: 2, year: '2007 — 2012', title: 'Золотой Век', subtitle: 'Web 2.0, ВКонтакте, демотиваторы' },
  { id: 3, year: '2020 — 2026', title: 'Экосистема',  subtitle: 'Минимализм, AI, нейро-синтез' },
];

interface EraCtx {
  era: Era;
  setEra: (era: Era) => void;
  isTransitioning: boolean;
  muted: boolean;
  setMuted: (m: boolean) => void;
  reducedMotion: boolean;
  triggerGlitch: () => void;
}

const Ctx = createContext<EraCtx | null>(null);

function readInitialEra(): Era {
  if (typeof window === 'undefined') return 1;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('era');
  const n = raw ? Number(raw) : NaN;
  if (n === 1 || n === 2 || n === 3) return n;
  return 1;
}

export function EraProvider({ children }: { children: ReactNode }) {
  const [era, setEraState] = useState<Era>(readInitialEra);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [muted, setMuted] = useState(true);
  const reducedMotion = useReducedMotion();
  const transitionResolverRef = useRef<((v: boolean) => void) | null>(null);

  // sync URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('era') !== String(era)) {
      params.set('era', String(era));
      const url = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', url);
    }
    document.documentElement.dataset.era = String(era);
  }, [era]);

  // back/forward
  useEffect(() => {
    const onPop = () => setEraState(readInitialEra());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const setEra = useCallback(
    (next: Era) => {
      if (next === era || isTransitioning) return;
      setIsTransitioning(true);
      const dur = reducedMotion ? 200 : 900;
      window.setTimeout(() => {
        setEraState(next);
      }, Math.floor(dur * 0.45));
      window.setTimeout(() => {
        setIsTransitioning(false);
        transitionResolverRef.current?.(true);
        transitionResolverRef.current = null;
      }, dur);
    },
    [era, isTransitioning, reducedMotion],
  );

  const triggerGlitch = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const dur = reducedMotion ? 200 : 900;
    window.setTimeout(() => setIsTransitioning(false), dur);
  }, [isTransitioning, reducedMotion]);

  const value = useMemo<EraCtx>(
    () => ({ era, setEra, isTransitioning, muted, setMuted, reducedMotion, triggerGlitch }),
    [era, setEra, isTransitioning, muted, reducedMotion, triggerGlitch],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEra(): EraCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useEra must be used inside EraProvider');
  return v;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}
