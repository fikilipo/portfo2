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
 */
export function KonamiListener() {
  const { era } = useEra();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (era !== "wild") return;
    let buf: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      buf = [...buf, e.key.toLowerCase()].slice(-SEQUENCE.length);
      const target = SEQUENCE.map((k) => k.toLowerCase());
      if (buf.length === target.length && buf.every((k, i) => k === target[i])) {
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
