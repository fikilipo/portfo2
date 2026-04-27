import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ERAS, NAV_ERAS, type EraId } from "../types";

interface EraContextValue {
  era: EraId;
  prev: EraId | null;
  isTransitioning: boolean;
  goTo: (id: EraId) => void;
  next: () => void;
  back: () => void;
  reducedMotion: boolean;
}

const EraContext = createContext<EraContextValue | null>(null);

export function EraProvider({ children }: { children: ReactNode }) {
  const [era, setEra] = useState<EraId>("boot");
  const [prev, setPrev] = useState<EraId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lockRef = useRef(false);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const goTo = useCallback(
    (id: EraId) => {
      if (lockRef.current) return;
      if (id === era) return;
      lockRef.current = true;
      setPrev(era);
      setIsTransitioning(true);
      const dur = reducedMotion ? 250 : 1100;
      window.setTimeout(() => {
        setEra(id);
      }, dur * 0.45);
      window.setTimeout(() => {
        setIsTransitioning(false);
        lockRef.current = false;
      }, dur);
    },
    [era, reducedMotion]
  );

  const next = useCallback(() => {
    const ids: EraId[] = ["wild", "web2", "eco", "outro"];
    if (era === "boot") {
      goTo("wild");
      return;
    }
    const i = ids.indexOf(era as EraId);
    if (i >= 0 && i < ids.length - 1) goTo(ids[i + 1]);
  }, [era, goTo]);

  const back = useCallback(() => {
    const ids: EraId[] = ["wild", "web2", "eco", "outro"];
    const i = ids.indexOf(era as EraId);
    if (i > 0) goTo(ids[i - 1]);
  }, [era, goTo]);

  // keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
      if (e.key >= "1" && e.key <= "3") {
        const target = NAV_ERAS[Number(e.key) - 1];
        if (target) goTo(target.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, back, goTo]);

  // theme variables
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (era === "wild") {
      root.style.setProperty("--era-bg", "#0b0030");
      root.style.setProperty("--era-fg", "#ffffff");
      body.dataset.cursor = "wild";
    } else if (era === "web2") {
      root.style.setProperty("--era-bg", "#e7eef7");
      root.style.setProperty("--era-fg", "#2b587a");
      body.dataset.cursor = "default";
    } else if (era === "eco") {
      root.style.setProperty("--era-bg", "#0a0a0c");
      root.style.setProperty("--era-fg", "#f4f4f5");
      body.dataset.cursor = "hidden";
    } else if (era === "outro") {
      root.style.setProperty("--era-bg", "#050507");
      root.style.setProperty("--era-fg", "#f4f4f5");
      body.dataset.cursor = "default";
    } else {
      root.style.setProperty("--era-bg", "#000");
      root.style.setProperty("--era-fg", "#39ff14");
      body.dataset.cursor = "default";
    }
  }, [era]);

  const value = useMemo<EraContextValue>(
    () => ({ era, prev, isTransitioning, goTo, next, back, reducedMotion }),
    [era, prev, isTransitioning, goTo, next, back, reducedMotion]
  );

  return <EraContext.Provider value={value}>{children}</EraContext.Provider>;
}

export function useEra() {
  const ctx = useContext(EraContext);
  if (!ctx) throw new Error("useEra must be used inside EraProvider");
  return ctx;
}

export function eraIndexOf(id: EraId) {
  return ERAS.findIndex((e) => e.id === id);
}
