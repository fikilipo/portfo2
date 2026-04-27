import { useEffect, useState } from "react";
import { useEra } from "../context/EraContext";

interface Guest {
  name: string;
  text: string;
}

const SEED_GUESTS: Guest[] = [
  { name: "Vasya_1987", text: "Превед! Очень крутой сайт!!! Закладки += 1 :-)" },
  { name: "АнЮтА", text: "ня-ня-ня, гифки самые лучшие <3 жду апдейт!" },
  { name: "Кибер-Дед", text: "сижу на 56k, грузится 4 минуты, но оно того стоит" },
];

export function EraWild() {
  const { next } = useEra();
  const [counter, setCounter] = useState(13371);
  const [guests, setGuests] = useState<Guest[]>(SEED_GUESTS);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const t = window.setInterval(() => setCounter((n) => n + 1), 2200);
    return () => window.clearInterval(t);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setGuests((g) => [{ name: name.trim(), text: text.trim() }, ...g]);
    setName("");
    setText("");
  };

  return (
    <section className="crt relative min-h-screen tile-stars text-wild-ink font-wild overflow-hidden">
      {/* marquee */}
      <div className="absolute top-20 left-0 right-0 overflow-hidden border-y-2 border-wild-magenta bg-black/60 py-1">
        <p className="whitespace-nowrap animate-marquee text-wild-gold text-lg">
          ★ ДОБРО ПОЖАЛОВАТЬ НА МОЮ СТРАНИЧКУ! ★ САЙТ НАХОДИТСЯ В РАЗРАБОТКЕ ★ ОБНОВЛЕНИЕ КАЖДУЮ СУББОТУ ★ КОНАМИ-КОД? ★ ★ ★
        </p>
      </div>

      <div className="relative z-[1] mx-auto max-w-5xl px-4 pt-40 pb-20">
        {/* Title block in retro frame */}
        <div className="border-4 border-wild-cyan bg-black/70 p-6 text-center">
          <h1 className="text-4xl md:text-6xl text-wild-magenta animate-flicker tracking-wider">
            ◆ Номер один в Рунете ◆
          </h1>
          <p className="mt-2 text-wild-gold text-lg">
            домашняя страничка <span className="text-wild-cyan">Антона</span> на narod.ru
          </p>
          <p className="mt-1 text-sm text-wild-ink/80">
            обновлено: 14.08.2001 · автор сайта: я · хостинг: бесплатно :-)
          </p>
        </div>

        {/* Layout: table-like 2 columns */}
        <div className="mt-8 grid gap-6 md:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="border-2 border-wild-lime bg-black/60 p-3">
              <h2 className="text-wild-lime text-lg mb-2">::: МЕНЮ :::</h2>
              <ul className="space-y-1 text-base">
                <li><a href="#about" className="wild-link">→ обо мне</a></li>
                <li><a href="#friends" className="wild-link">→ мои френды</a></li>
                <li><a href="#guestbook" className="wild-link">→ гостевая</a></li>
                <li><a href="#links" className="wild-link">→ кул-линки</a></li>
                <li>
                  <button onClick={next} className="wild-link bg-transparent border-0 cursor-pointer">
                    → дальше в 2007 →
                  </button>
                </li>
              </ul>
            </div>

            {/* Visit counter */}
            <div className="border-2 border-wild-gold bg-black/80 p-3 text-center">
              <p className="text-xs uppercase text-wild-gold">счётчик посещений</p>
              <p className="mt-1 font-mono text-3xl text-wild-lime tracking-widest">
                {counter.toString().padStart(7, "0")}
              </p>
              <p className="mt-1 text-[10px] text-wild-ink/70">с 21.06.1999</p>
            </div>

            {/* 88x31 web banners — каноничный размер веб-1.0 */}
            <div className="grid grid-cols-2 gap-2 justify-items-center">
              {[
                { t: "NAROD",   c: "from-yellow-400 to-orange-500", k: "narod" },
                { t: "RAMBLER", c: "from-blue-500 to-indigo-700",   k: "rambler" },
                { t: "ANEKDOT", c: "from-pink-500 to-rose-600",     k: "anekdot" },
                { t: "FIDO",    c: "from-emerald-500 to-teal-700",  k: "fido" },
              ].map((b) => (
                <div
                  key={b.k}
                  className={`h-[31px] w-[88px] bg-gradient-to-r ${b.c} text-center text-[9px] font-bold leading-[31px] text-white border border-black animate-floaty shadow-[2px_2px_0_#000] tracking-wider`}
                >
                  {b.t}
                </div>
              ))}
            </div>
          </aside>

          {/* Main */}
          <main className="space-y-6">
            <article id="about" className="border-2 border-wild-magenta bg-black/60 p-4">
              <h2 className="text-2xl text-wild-cyan animate-blink mb-2">привет, странник!</h2>
              <p className="text-base leading-relaxed">
                Это моя домашняя страничка. Тут я выкладываю самое крутое: <span className="text-wild-gold">мои стихи</span>, скриншоты любимых игр (Diablo II FOREVER) и вообще всё, что найду в инете. Если у тебя есть гифка с огоньками — кидай в гостевую!
              </p>
              <p className="mt-3 text-sm text-wild-ink/80">
                P.S. сайт лучше всего смотрится в Internet Explorer 5.5 при разрешении 800×600.
              </p>
            </article>

            <article id="friends" className="border-2 border-wild-lime bg-black/60 p-4">
              <h2 className="text-2xl text-wild-lime mb-3">мои френды</h2>
              <ul className="grid grid-cols-3 md:grid-cols-5 gap-3 text-center text-xs">
                {["Дима", "Катя", "Серёга", "АнЮтА", "Палыч", "ZX_KING", "lola", "neoma", "тёма", "ёжик"].map((n) => (
                  <li key={n}>
                    <div className="mx-auto h-12 w-12 rounded-full border-2 border-wild-cyan bg-gradient-to-br from-wild-magenta to-wild-cyan" />
                    <p className="mt-1">{n}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article id="links" className="border-2 border-wild-gold bg-black/60 p-4">
              <h2 className="text-2xl text-wild-gold mb-2">кул-линки</h2>
              <ul className="text-base list-disc list-inside space-y-1">
                <li><span className="wild-link">www.anekdot.ru</span> — самые свежие шутки</li>
                <li><span className="wild-link">forum.kuvalda.ru</span> — лучший форум планеты</li>
                <li><span className="wild-link">www.fido.ru</span> — наши люди</li>
                <li><span className="wild-link">www.kasparov.ru</span> — шахматы рулят</li>
              </ul>
            </article>

            <article id="guestbook" className="border-2 border-wild-cyan bg-black/60 p-4">
              <h2 className="text-2xl text-wild-cyan mb-3">гостевая книга</h2>
              <form onSubmit={submit} className="space-y-2 mb-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="твой ник"
                  className="w-full bg-black border-2 border-wild-lime px-2 py-1 text-wild-ink placeholder:text-wild-ink/40"
                />
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="напиши что-нибудь хорошее :-)"
                  rows={2}
                  className="w-full bg-black border-2 border-wild-lime px-2 py-1 text-wild-ink placeholder:text-wild-ink/40"
                />
                <button
                  type="submit"
                  className="border-2 border-wild-magenta bg-black px-4 py-1 text-wild-magenta hover:bg-wild-magenta hover:text-black"
                >
                  [ оставить запись ]
                </button>
              </form>
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {guests.map((g, i) => (
                  <li key={i} className="border border-wild-ink/40 p-2 text-sm">
                    <span className="text-wild-gold">&lt;{g.name}&gt;</span> {g.text}
                  </li>
                ))}
              </ul>
            </article>

            <p className="text-center text-xs text-wild-ink/70">
              подсказка: попробуй ввести Konami-код …
            </p>
          </main>
        </div>
      </div>
    </section>
  );
}
