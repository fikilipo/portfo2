import { useState } from "react";
import { useEra } from "../context/EraContext";

interface Comment {
  author: string;
  text: string;
}

const FRIENDS = [
  { name: "Аня",     online: true  },
  { name: "Серёга",  online: true  },
  { name: "Палыч",   online: false },
  { name: "Маша",    online: true  },
  { name: "ZX_KING", online: false },
  { name: "Лёша",    online: true  },
];

export function EraWeb2() {
  const { next } = useEra();
  const [likes, setLikes] = useState(127);
  const [liked, setLiked] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; dx: number; dur: number }[]>([]);
  const [demoTop, setDemoTop] = useState("ИНТЕРНЕТ 2008");
  const [demoBottom, setDemoBottom] = useState("Дуров, верни стену");
  const [comments, setComments] = useState<Comment[]>([
    { author: "Серёга", text: "плюсую, это база" },
    { author: "Аня", text: "с днём пятницы, котики ❤" },
  ]);
  const [draft, setDraft] = useState("");

  const onLike = () => {
    setLiked((v) => !v);
    setLikes((n) => (liked ? n - 1 : n + 1));
  };

  const onDoubleLike = () => {
    const burst = Array.from({ length: 36 }).map((_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 60,
      dx: (Math.random() - 0.5) * 240,
      dur: 1200 + Math.random() * 900,
    }));
    setHearts((h) => [...h, ...burst]);
    window.setTimeout(() => {
      setHearts((h) => h.filter((x) => !burst.find((b) => b.id === x.id)));
    }, 2400);
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setComments((c) => [...c, { author: "ты", text: draft.trim() }]);
    setDraft("");
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-web2-bg font-web2 text-web2-ink">
      {/* glossy header strip */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-web2-accent to-[#3b6a99] shadow-md" />
      <div className="relative z-[1] mx-auto max-w-5xl px-4 pt-28 pb-16">
        {/* title */}
        <div className="rounded-md border border-web2-border bg-web2-panel p-5 shadow-sm">
          <h1 className="text-3xl font-bold text-web2-accent">
            Стена · 2009
          </h1>
          <p className="text-sm text-web2-ink/80 mt-1">
            Web 2.0, скевоморфизм, лайки и репосты — рунет учится дружить онлайн.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[260px_1fr]">
          {/* sidebar: friends online */}
          <aside className="rounded-md border border-web2-border bg-web2-panel p-4 shadow-sm h-fit">
            <h2 className="text-sm font-bold text-web2-accent mb-3">друзья онлайн</h2>
            <ul className="space-y-2 text-sm">
              {FRIENDS.map((f) => (
                <li key={f.name} className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-gradient-to-br from-[#a8c2e0] to-[#5181b8]" />
                  <span>{f.name}</span>
                  <span
                    className={`ml-auto h-2.5 w-2.5 rounded-full ${
                      f.online ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,.7)]" : "bg-gray-300"
                    }`}
                  />
                </li>
              ))}
            </ul>
            <button
              onClick={next}
              className="btn-glossy mt-5 w-full"
            >
              перейти в 2020-е →
            </button>
          </aside>

          {/* main column */}
          <main className="space-y-6">
            {/* wall post */}
            <article className="relative rounded-md border border-web2-border bg-web2-panel p-4 shadow-sm">
              <header className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#ffd58a] to-[#ff8c00]" />
                <div>
                  <p className="font-bold text-web2-accent">Антон Соколов</p>
                  <p className="text-xs text-web2-ink/70">2 ноября 2009 · 23:14 · из мобильного</p>
                </div>
              </header>
              <p className="mt-3 leading-relaxed">
                друзья! только что закончил новый плейлист для понедельника. там есть и Земфира, и dub-step, и даже
                один трек, который мне посоветовал чувак из <span className="underline decoration-dotted">/b/</span>.
                кто хочет — пишите, скину ссылкой :)
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <button
                  onClick={onLike}
                  onDoubleClick={onDoubleLike}
                  className="btn-glossy flex items-center gap-2"
                  aria-pressed={liked}
                >
                  <span className={liked ? "text-web2-like" : "text-web2-ink/60"}>♥</span>
                  <span>Нравится · {likes}</span>
                </button>
                <button className="btn-glossy">Поделиться · 14</button>
                <button className="btn-glossy">Комментировать</button>
                <span className="ml-auto text-xs text-web2-ink/60">подсказка: двойной клик по «нравится»</span>
              </div>

              {/* hearts overlay */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {hearts.map((h) => (
                  <span
                    key={h.id}
                    className="absolute bottom-4 text-web2-like"
                    style={{
                      left: `${h.x}%`,
                      animation: `heart-fly ${h.dur}ms ease-out forwards`,
                      ["--dx" as string]: `${h.dx}px`,
                    }}
                  >
                    ♥
                  </span>
                ))}
              </div>

              {/* comments */}
              <ul className="mt-4 space-y-2 border-t border-web2-border pt-3 text-sm">
                {comments.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-[#cfd8e3] to-[#92a6c0]" />
                    <p>
                      <span className="font-bold text-web2-accent">{c.author}: </span>
                      {c.text}
                    </p>
                  </li>
                ))}
              </ul>
              <form onSubmit={submitComment} className="mt-3 flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="ваш комментарий…"
                  className="flex-1 rounded-md border border-web2-border bg-white px-3 py-1.5 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-web2-accent/40"
                />
                <button type="submit" className="btn-glossy">отправить</button>
              </form>
            </article>

            {/* demotivator generator */}
            <article className="rounded-md border border-web2-border bg-web2-panel p-4 shadow-sm">
              <h2 className="text-lg font-bold text-web2-accent">демотиватор-генератор</h2>
              <div className="mt-3 grid gap-4 md:grid-cols-[1fr_280px]">
                <div className="bg-black p-2">
                  <div className="border border-white/40 p-3 text-center">
                    <div className="aspect-video bg-gradient-to-br from-[#1f2937] to-[#0b1220] flex items-center justify-center text-white/60 text-xs">
                      [фото из интернета]
                    </div>
                    <p className="mt-3 font-serif text-2xl text-white tracking-wider">{demoTop || "ВВЕДИ ВЕРХ"}</p>
                    <p className="mt-1 text-sm text-white/80">{demoBottom || "и подпись снизу"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-web2-ink/80">верхний текст</label>
                  <input
                    value={demoTop}
                    onChange={(e) => setDemoTop(e.target.value)}
                    className="w-full rounded-md border border-web2-border bg-white px-3 py-1.5 text-sm shadow-inner"
                  />
                  <label className="block text-xs font-bold text-web2-ink/80">нижний текст</label>
                  <input
                    value={demoBottom}
                    onChange={(e) => setDemoBottom(e.target.value)}
                    className="w-full rounded-md border border-web2-border bg-white px-3 py-1.5 text-sm shadow-inner"
                  />
                  <p className="text-xs text-web2-ink/60">кириллица. чёрная рамка. дух 2009 года.</p>
                </div>
              </div>
            </article>

            {/* habr-style quote */}
            <article className="rounded-md border border-web2-border bg-gradient-to-b from-[#fafcff] to-[#eef3fb] p-4 shadow-sm">
              <h2 className="text-lg font-bold text-web2-accent">с Хабра</h2>
              <blockquote className="mt-2 italic text-web2-ink">
                «Если ты не знаешь, что писать в свой первый пост, напиши, как ты переехал
                с PHP на Python. Это всегда работает.»
              </blockquote>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-700 font-bold">+128</span>
                <span className="text-web2-ink/70">42 комментария</span>
              </div>
            </article>
          </main>
        </div>
      </div>
    </section>
  );
}
