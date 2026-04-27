import { useEffect, useRef, useState } from 'react';
import { useEra } from '../EraContext';
import { playDing, playClick } from '../audio/sfx';

interface Post {
  id: string;
  author: string;
  text: string;
  ts: number;
  likes: number;
  liked: boolean;
  comments: { author: string; text: string }[];
}

const SEED: Post[] = [
  {
    id: 'p1',
    author: 'Павел Дуров',
    text: 'Стену не трогайте. Стена — это святое.',
    ts: Date.now() - 1000 * 60 * 60 * 24 * 365 * 12,
    likes: 4815,
    liked: false,
    comments: [
      { author: 'Аноним', text: 'Дуров, верни стену!' },
      { author: 'Маша П.', text: '+1, без стены жизнь не та.' },
    ],
  },
  {
    id: 'p2',
    author: 'Хабр',
    text: 'Сегодня мы празднуем релиз iPhone 4. Скевоморфизм — это навсегда.',
    ts: Date.now() - 1000 * 60 * 60 * 24 * 365 * 11,
    likes: 308,
    liked: false,
    comments: [{ author: 'gentleman', text: 'IMHO стекло и кожа — топ.' }],
  },
  {
    id: 'p3',
    author: 'Демотиватор.ру',
    text: 'ЖИЗНЬ. Она такая.',
    ts: Date.now() - 1000 * 60 * 60 * 24 * 365 * 10,
    likes: 1024,
    liked: false,
    comments: [],
  },
];

export function Era2GoldenAge() {
  const { muted } = useEra();
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const raw = localStorage.getItem('echo:wall');
      if (raw) return JSON.parse(raw);
    } catch {/* ignore */}
    return SEED;
  });
  useEffect(() => {
    localStorage.setItem('echo:wall', JSON.stringify(posts));
  }, [posts]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    if (!muted) playDing();
    window.setTimeout(() => setToast(null), 2500);
  }

  function publish() {
    const text = (inputRef.current?.value || '').trim();
    if (!text) return;
    const newPost: Post = {
      id: 'p' + Date.now(),
      author: 'Вы',
      text,
      ts: Date.now(),
      likes: 0,
      liked: false,
      comments: [],
    };
    setPosts((p) => [newPost, ...p]);
    if (inputRef.current) inputRef.current.value = '';
    showToast('Запись опубликована на стене');
  }

  function toggleLike(id: string) {
    setPosts((p) => p.map((x) => (x.id === id ? { ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) } : x)));
    if (!muted) playClick();
  }

  function durovEgg() {
    setShake(true);
    if (!muted) playDing();
    window.setTimeout(() => setShake(false), 700);
    setPosts((p) => [
      {
        id: 'p' + Date.now(),
        author: 'Павел Дуров',
        text: 'Хорошо, верну. Но только эту стену.',
        ts: Date.now(),
        likes: 9999,
        liked: false,
        comments: [],
      },
      ...p,
    ]);
  }

  return (
    <div
      className="era-root min-h-screen w-full pt-20 pb-20"
      style={{
        background: 'linear-gradient(180deg, #EDEEF0 0%, #DDE2EA 100%)',
        color: '#2B587A',
        fontFamily: 'Tahoma, Verdana, Arial, sans-serif',
      }}
    >
      <div className="mx-auto w-[min(1100px,96vw)]">
        {/* Шапка */}
        <header
          className="rounded-md border border-[#B6C4D2] bg-gradient-to-b from-[#5A7DA8] to-[#45688E] text-white px-4 py-2 shadow"
          style={{ textShadow: '0 1px 0 rgba(0,0,0,0.4)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">эхо.рунета</span>
              <span className="opacity-80 text-sm">мой профиль</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <input
                placeholder="Поиск по сайту"
                className="rounded-sm border border-white/30 bg-white/95 px-2 py-1 text-[#2B587A] focus:outline-none"
              />
              <button className="rounded-sm bg-gradient-to-b from-white to-[#cfd6df] text-[#2B587A] px-2 py-1 font-bold border border-white/60">
                Найти
              </button>
            </div>
          </div>
        </header>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-3">
          {/* Профиль */}
          <aside className="rounded-md border border-[#B6C4D2] bg-white p-3 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div
                  className="h-32 w-32 rounded-full border-2 border-[#B6C4D2] shadow-inner"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 30%, #ffd7a8, #c97a3c 70%, #6b3818)',
                  }}
                  aria-label="Аватарка"
                />
                <span className="absolute bottom-2 right-2 h-3 w-3 rounded-full bg-[#7BCB6A] ring-2 ring-white" title="онлайн" />
              </div>
              <div className="mt-2 font-bold">Капитан Рунет</div>
              <div className="text-xs opacity-70">Москва · 199x года рождения</div>
            </div>
            <ul className="mt-3 text-sm divide-y divide-[#E0E6EE]">
              <ProfileRow k="Друзья" v="481" />
              <ProfileRow k="Подписчики" v="2 256" />
              <ProfileRow k="Аудиозаписи" v="МакSим, Звери, ВИА Гра" />
              <ProfileRow k="Любимая цитата" v="«Лучше с умным потерять, чем с дураком найти»" />
            </ul>
            <button
              onClick={durovEgg}
              className="mt-3 w-full rounded-sm border border-[#3D5A80] bg-gradient-to-b from-[#6E92BC] to-[#3D5A80] text-white py-2 font-bold shadow active:translate-y-px"
              style={{ textShadow: '0 1px 0 rgba(0,0,0,0.4)' }}
              title="Пасхалка"
            >
              ★ Дуров, верни стену
            </button>
          </aside>

          {/* Стена */}
          <main className={'rounded-md border border-[#B6C4D2] bg-white p-3 shadow-sm ' + (shake ? 'era2-shake' : '')}>
            <h2 className="text-lg font-bold border-b border-[#E0E6EE] pb-2 mb-3">Стена</h2>
            <div className="rounded-sm border border-[#C9D2DD] bg-[#F7FAFC] p-2">
              <textarea
                ref={inputRef}
                placeholder="Что у вас нового?"
                className="w-full bg-transparent outline-none text-sm h-16 resize-none"
                maxLength={400}
              />
              <div className="flex items-center justify-between text-xs">
                <div className="opacity-70">смайлики · фото · музыка</div>
                <button
                  onClick={publish}
                  className="rounded-sm border border-[#3D5A80] bg-gradient-to-b from-[#6E92BC] to-[#3D5A80] text-white px-3 py-1 font-bold"
                  style={{ textShadow: '0 1px 0 rgba(0,0,0,0.4)' }}
                >
                  Отправить
                </button>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} onLike={() => toggleLike(p.id)} />
              ))}
            </ul>

            <h2 className="mt-8 text-lg font-bold border-b border-[#E0E6EE] pb-2 mb-3">Демотиватор</h2>
            <Demotivator />
          </main>
        </div>

        <footer className="mt-3 text-xs text-center opacity-70">
          © 2007 — 2012. «Это копия эпохи Web 2.0 — никаких ваших данных мы не передаём, всё локально».
        </footer>
      </div>

      {/* QIP-like toast */}
      {toast && (
        <div className="fixed bottom-16 right-4 z-40 w-72 rounded-sm border border-[#B6C4D2] bg-gradient-to-b from-white to-[#E6ECF3] shadow-xl">
          <div className="bg-gradient-to-b from-[#6E92BC] to-[#3D5A80] text-white text-xs font-bold px-2 py-1">
            ICQ · уведомление
          </div>
          <div className="p-2 text-sm text-[#2B587A]">{toast}</div>
        </div>
      )}

      <style>{`
        .era2-shake { animation: era2shake 0.7s cubic-bezier(.36,.07,.19,.97); }
        @keyframes era2shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
}

function ProfileRow({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-baseline justify-between gap-2 py-1.5">
      <span className="text-xs opacity-70 shrink-0">{k}</span>
      <span className="text-sm font-semibold text-right truncate">{v}</span>
    </li>
  );
}

function PostCard({ post, onLike }: { post: Post; onLike: () => void }) {
  const date = new Date(post.ts).toLocaleString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <li className="rounded-sm border border-[#E0E6EE] p-2 hover:bg-[#F7FAFC] transition">
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-[#2B587A]">{post.author}</span>
        <span className="text-xs opacity-60">{date}</span>
      </div>
      <p className="mt-1 text-[15px] leading-snug">{post.text}</p>
      <div className="mt-2 flex items-center gap-3 text-sm">
        <button
          onClick={onLike}
          className={
            'rounded-sm border px-2 py-0.5 font-bold ' +
            (post.liked
              ? 'border-[#B23B3B] bg-[#FFEAEA] text-[#B23B3B]'
              : 'border-[#C9D2DD] bg-gradient-to-b from-white to-[#E6ECF3] text-[#2B587A]')
          }
        >
          {post.liked ? '♥' : '♡'} {post.likes.toLocaleString('ru-RU')}
        </button>
        <span className="text-xs opacity-70">Комментарии: {post.comments.length}</span>
      </div>
      {post.comments.length > 0 && (
        <ul className="mt-2 space-y-1 border-t border-dashed border-[#E0E6EE] pt-2">
          {post.comments.map((c, i) => (
            <li key={i} className="text-sm">
              <span className="font-bold text-[#2B587A]">{c.author}:</span> {c.text}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function Demotivator() {
  const [top, setTop] = useState('РУНЕТ');
  const [bot, setBot] = useState('Когда-то здесь было лучше.');
  return (
    <div className="grid sm:grid-cols-[1fr_280px] gap-3">
      <div className="bg-black p-4 border-2 border-black">
        <div className="bg-[#1a1a1a] aspect-[4/3] flex items-center justify-center">
          <div
            className="h-3/5 w-3/5 rounded-md"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, #6E92BC, #3D5A80 60%, #1a2a40)',
              boxShadow: '0 0 40px rgba(60,120,200,0.6) inset',
            }}
            aria-hidden
          />
        </div>
        <div className="mt-3 text-center text-white" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
          <div className="text-3xl font-bold tracking-wider uppercase">{top}</div>
          <div className="text-sm italic opacity-90 mt-1">{bot}</div>
        </div>
      </div>
      <div className="grid gap-2 content-start">
        <label className="text-xs opacity-70">Заголовок</label>
        <input
          value={top}
          onChange={(e) => setTop(e.target.value.toUpperCase())}
          maxLength={28}
          className="rounded-sm border border-[#C9D2DD] bg-white px-2 py-1 text-[#2B587A]"
        />
        <label className="text-xs opacity-70">Подпись</label>
        <input
          value={bot}
          onChange={(e) => setBot(e.target.value)}
          maxLength={80}
          className="rounded-sm border border-[#C9D2DD] bg-white px-2 py-1 text-[#2B587A]"
        />
        <p className="text-xs opacity-60 mt-2">
          Классика жанра: чёрная рамка, серьёзный шрифт, подпись с философским уклоном.
        </p>
      </div>
    </div>
  );
}
