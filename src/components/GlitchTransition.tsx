import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useEra } from "../context/EraContext";

/**
 * Full-screen "reality tear" overlay used between eras.
 * Effect stack:
 *  - SVG turbulence + displacement layer
 *  - RGB-split bars (3 absolutely positioned coloured layers)
 *  - sweeping scanline
 *  - white burn-in flash
 */
export function GlitchTransition() {
  const { isTransitioning, reducedMotion } = useEra();
  const root = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const slices = useRef<HTMLDivElement[]>([]);

  slices.current = [];
  const addSlice = (el: HTMLDivElement | null) => {
    if (el && !slices.current.includes(el)) slices.current.push(el);
  };

  useEffect(() => {
    if (!isTransitioning) return;
    const r = root.current;
    const f = flash.current;
    if (!r || !f) return;

    if (reducedMotion) {
      gsap.fromTo(r, { opacity: 0 }, { opacity: 1, duration: 0.12 });
      gsap.to(r, { opacity: 0, duration: 0.12, delay: 0.18 });
      return;
    }

    const tl = gsap.timeline();
    tl.set(r, { opacity: 1 })
      .fromTo(
        slices.current,
        { x: 0, opacity: 0.0 },
        {
          x: () => gsap.utils.random(-40, 40),
          opacity: 0.85,
          duration: 0.35,
          ease: "steps(6)",
          stagger: 0.04,
        },
      )
      .to(
        slices.current,
        {
          x: () => gsap.utils.random(-80, 80),
          duration: 0.25,
          ease: "steps(4)",
        },
        "<0.05",
      )
      .to(f, { opacity: 1, duration: 0.06 }, "+=0.05")
      .to(f, { opacity: 0, duration: 0.35, ease: "power2.out" })
      .to(slices.current, { x: 0, opacity: 0, duration: 0.3 }, "<")
      .to(r, { opacity: 0, duration: 0.2 }, "-=0.1");

    return () => {
      tl.kill();
    };
  }, [isTransitioning, reducedMotion]);

  return (
    <div
      ref={root}
      className="pointer-events-none fixed inset-0 z-[100] opacity-0"
      aria-hidden="true"
    >
      {/* SVG displacement noise full-screen */}
      <svg
        className="absolute inset-0 h-full w-full mix-blend-screen opacity-70"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="glitch-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3">
            <animate attributeName="baseFrequency" dur="1.1s" values="0.7;1.4;0.6" repeatCount="1" />
          </feTurbulence>
          <feColorMatrix
            type="matrix"
            values="0 0 0 9 -4
                    0 0 0 9 -4
                    0 0 0 9 -4
                    0 0 0 0 1"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#glitch-noise)" />
      </svg>

      {/* RGB split bars */}
      <div ref={addSlice} className="absolute inset-x-0 top-[20%] h-[18%] bg-[#ff003c] mix-blend-screen" />
      <div ref={addSlice} className="absolute inset-x-0 top-[42%] h-[14%] bg-[#00ffd0] mix-blend-screen" />
      <div ref={addSlice} className="absolute inset-x-0 top-[60%] h-[20%] bg-[#7a00ff] mix-blend-screen" />

      {/* sweeping scanline */}
      <div
        className="absolute inset-x-0 h-px bg-white/80"
        style={{ animation: "scanline-sweep 0.9s linear" }}
      />

      {/* white burn-in flash */}
      <div ref={flash} className="absolute inset-0 bg-white opacity-0" />

      {/* horizontal text noise */}
      <div className="absolute inset-0 flex flex-col gap-1 justify-center text-[10px] font-mono text-white/40 px-4 select-none">
        <p>:: signal-loss :: re-tuning archive ::</p>
        <p>:: rebuilding DOM :: era[k] -&gt; era[k+1]</p>
        <p>:: 010100100110100101110011 ::</p>
      </div>
    </div>
  );
}
