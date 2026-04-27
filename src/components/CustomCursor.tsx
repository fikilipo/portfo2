import { useEffect, useRef } from "react";
import { useEra } from "../context/EraContext";

/**
 * Magnetic dot+ring cursor for Era 3 (Eco).
 * Other eras get the default / pixel cursor via CSS.
 */
export function CustomCursor() {
  const { era, reducedMotion } = useEra();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (era !== "eco" || reducedMotion) return;
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [era, reducedMotion]);

  if (era !== "eco" || reducedMotion) return null;

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-9 w-9 rounded-full border border-white/40"
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[91] h-1.5 w-1.5 rounded-full bg-white"
      />
    </>
  );
}
