import { useEffect, useState } from "react";
import { useEra } from "../context/EraContext";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Era-1 easter egg: Konami code triggers an ASCII fire + secret thank-you.
 *
 * Listens in the capture phase and consumes (stopPropagation + preventDefault)
 * any key that extends a valid Konami prefix. Without this, the global
 * Arrow-Left/Right era-navigation in EraContext eats the middle of the
 * sequence and the easter egg never triggers.
 */
export function KonamiListener() {
  const { era } = useEra();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (era !== "wild") return;
    let buf: string[] = [];
    const target = SEQUENCE.map((k) => k.toLowerCase());
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const candidate = [...buf, key];
      const isValidPrefix =
        candidate.length <= target.length &&
        candidate.every((k, i) => k === target[i]);
      if (isValidPrefix) {
        // Consume the key so era navigation doesn't see it.
        e.stopPropagation();
        e.preventDefault();
        buf = candidate;
        if (buf.length === target.length) {
          setOpen(true);
          buf = [];
        }
      } else {
        // Restart buffer; key may itself start a new sequence.
        buf = key === target[0] ? [key] : [];
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [era]);

  if (era !== "wild" || !open) return null;

  const fire = String.raw`
        (  .      )
     )           (              )
           .  '   .   '  .  '  .
   (    , )       (.   )  (   ',    )
    .' ) ( . )    ,  ( ,     )   ( .
 ). , ( .   (  ) ( , ')  .' (  ,    )
(_,) . ),  ) _) _,')  (, ) '.) ( ' )
`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-sm">
      <div className="relative w-[min(640px,92vw)] border-4 border-wild-gold bg-wild-bg p-6 text-center font-wild text-wild-ink shadow-[0_0_60px_rgba(255,212,0,.5)]">
        <pre className="text-wild-gold leading-tight text-[10px] md:text-xs whitespace-pre">{fire}</pre>
        <h3 className="mt-4 text-2xl text-wild-magenta">::: SECRET FOUND :::</h3>
        <p className="mt-2 text-sm md:text-base">
          Спасибо, что заглянул на мою страничку! Не забудь подписаться на гостевую книгу <span className="text-wild-cyan">:-)</span>
        </p>
        <button
          className="mt-4 border-2 border-wild-cyan bg-black px-4 py-1 text-wild-cyan hover:bg-wild-cyan hover:text-black"
          onClick={() => setOpen(false)}
        >
          [ закрыть ]
        </button>
      </div>
    </div>
  );
}
