import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useEra } from '../EraContext';
import { playGlitch } from '../audio/sfx';

export function GlitchTransition() {
  const { isTransitioning, reducedMotion, muted } = useEra();
  const rRef = useRef<HTMLDivElement>(null);
  const gRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTransitioning) return;
    if (!muted) playGlitch();

    const tl = gsap.timeline();
    if (reducedMotion) {
      tl.to([rRef.current, gRef.current, bRef.current], { opacity: 0.4, duration: 0.05 })
        .to([rRef.current, gRef.current, bRef.current], { opacity: 0, duration: 0.15 });
      return () => {
        tl.kill();
      };
    }

    tl.set([rRef.current, gRef.current, bRef.current], { opacity: 0, x: 0, y: 0 })
      .set(scanRef.current, { opacity: 0 })
      .set(flashRef.current, { opacity: 0 })
      .to(rRef.current, { opacity: 0.85, x: -10, y: 2, duration: 0.05 }, 0)
      .to(gRef.current, { opacity: 0.85, x: 0, y: -3, duration: 0.05 }, 0)
      .to(bRef.current, { opacity: 0.85, x: 10, y: 4, duration: 0.05 }, 0)
      .to(scanRef.current, { opacity: 0.7, duration: 0.05 }, 0)
      .to(rootRef.current, {
        keyframes: [
          { x: 0, skewX: 0, duration: 0.0 },
          { x: 6, skewX: -2, duration: 0.05 },
          { x: -8, skewX: 3, duration: 0.05 },
          { x: 4, skewX: -1, duration: 0.05 },
          { x: 0, skewX: 0, duration: 0.05 },
        ],
      }, 0)
      .to(flashRef.current, { opacity: 0.85, duration: 0.04 }, 0.4)
      .to(flashRef.current, { opacity: 0, duration: 0.18 }, 0.45)
      .to(rRef.current, { opacity: 0, x: 0, duration: 0.2 }, 0.55)
      .to(gRef.current, { opacity: 0, y: 0, duration: 0.2 }, 0.55)
      .to(bRef.current, { opacity: 0, x: 0, duration: 0.2 }, 0.55)
      .to(scanRef.current, { opacity: 0, duration: 0.2 }, 0.6);

    return () => {
      tl.kill();
    };
  }, [isTransitioning, reducedMotion, muted]);

  return (
    <div ref={rootRef} aria-hidden>
      <div className="glitch-overlay">
        <div ref={rRef} className="channel r" style={channelBg('rgba(255,0,80,0.55)')} />
        <div ref={gRef} className="channel g" style={channelBg('rgba(0,255,140,0.45)')} />
        <div ref={bRef} className="channel b" style={channelBg('rgba(80,80,255,0.55)')} />
      </div>
      <div ref={scanRef} className="scanlines" />
      <div ref={flashRef} className="flash" />
    </div>
  );
}

function channelBg(color: string): React.CSSProperties {
  return {
    background: `radial-gradient(ellipse at 50% 50%, ${color}, transparent 70%)`,
  };
}
