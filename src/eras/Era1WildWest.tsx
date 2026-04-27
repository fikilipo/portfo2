import { useEffect, useRef, useState } from 'react';
import { useEra } from '../EraContext';
import { playClick, playDialup, playDing } from '../audio/sfx';

const TILE_BG =
  // мелкий "шахматный" паттерн как в early-www
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">' +
      '<rect width="16" height="16" fill="#c8c8c8"/>' +
      '<rect x="0" y="0" width="8" height="8" fill="#bcbcbc"/>' +
      '<rect x="8" y="8" width="8" height="8" fill="#bcbcbc"/>' +
      '</svg>',
  );

interface GuestEntry {
  name: string;
  text: string;
  ts: number;
}

export function Era1WildWest() {
  const { muted } = useEra();
  const [visits] = useState<number>(() => {
    const v = Number(localStorage.getItem('echo:hits') ?? '0');
    const next = Number.isFinite(v) && v > 0 ? v + 1 : 1337;
    localStorage.setItem('echo:hits', String(next));
    return next;
  });

  const [guest, setGuest] = useState<GuestEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('echo:guest') ?? '[]');
    } catch {
      return [];
    }
  });
  const nameRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // konami easter egg
  const konamiRef = useRef<string[]>([]);
  const [konami, setKonami] = useState(false);
  useEffect(() => {
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    const onKey = (e: KeyboardEvent) => {
      konamiRef.current = [...konamiRef.current, e.key].slice(-seq.length);
      if (konamiRef.current.join(',').toLowerCase() === seq.join(',').toLowerCase()) {
        setKonami(true);
        window.setTimeout(() => setKonami(false), 6000);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // курсор-звёздочки
  useEffect(() => {
    const root = document.getElementById('era1-root');
    if (!root) return;
    let last = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - last < 35) return;
      last = now;
      const s = document.createElement('span');
      s.textContent = ['★','✦','✧','✨','*'][Math.floor(Math.random() * 5)];
      s.style.position = 'fixed';
      s.style.left = `${e.clientX}px`;
      s.style.top = `${e.clientY}px`;
      s.style.pointerEvents = 'none';
      s.style.color = ['#ff00ff','#ffff00','#00ffff','#ff8800'][Math.floor(Math.random() * 4)];
      s.style.fontSize = `${10 + Math.random() * 10}px`;
      s.style.transition = 'transform 700ms ease-out, opacity 700ms ease-out';
      s.style.zIndex = '9';
      document.body.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = `translate(${(Math.random()-0.5)*40}px, ${20 + Math.random()*30}px) scale(0.4)`;
        s.style.opacity = '0';
      });
      window.setTimeout(() => s.remove(), 750);
    };
    root.addEventListener('mousemove', onMove);
    return () => root.removeEventListener('mousemove', onMove);
  }, []);

  const [constructionClicks, setConstructionClicks] = useState(0);
  useEffect(() => {
    if (constructionClicks >= 5) {
      if (!muted) playDialup();
      setConstructionClicks(0);
    }
  }, [constructionClicks, muted]);

  function submitGuest(e: React.FormEvent) {
    e.preventDefault();
    const name = (nameRef.current?.value || '').trim();
    const text = (textRef.current?.value || '').trim();
    if (!name || !text) return;
    const next = [{ name, text, ts: Date.now() }, ...guest].slice(0, 30);
    setGuest(next);
    localStorage.setItem('echo:guest', JSON.stringify(next));
    if (nameRef.current) nameRef.current.value = '';
    if (textRef.current) textRef.current.value = '';
    if (!muted) playDing();
  }

  return (
    <div
      id="era1-root"
      className="era-root min-h-screen w-full pt-20 pb-20"
      style={{
        backgroundImage: `url("${TILE_BG}")`,
        backgroundColor: '#c0c0c0',
        color: '#000',
        fontFamily: '"Times New Roman", Times, serif',
        cursor: 'crosshair',
      }}
    >
      {/* «оградка» страницы как в Народ.ру */}
      <div className="mx-auto w-[min(1100px,96vw)] border-2 border-black bg-[#dfdfdf] p-3 shadow-[6px_6px_0_#000]">
        <table className="w-full border-2 border-[#000080]" cellPadding={6} cellSpacing={0}>
          <tbody>
            <tr>
              <td colSpan={2} className="bg-[#000080] text-white text-center">
                <h1 className="text-3xl sm:text-5xl font-black tracking-wider"
                    style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive', textShadow: '2px 2px 0 #ff0' }}>
                  ★彡 ЭХО РУНЕТА — ДОБРО ПОЖАЛОВАТЬ! 彡★
                </h1>
                <Marquee>
                  «Скоро тут будет много нового! Заходите ещё! Передавайте друзьям!»
                  &nbsp;★&nbsp; ICQ: 1337-4242 &nbsp;★&nbsp; Email: webmaster@narod.ru &nbsp;★&nbsp;
                </Marquee>
              </td>
            </tr>
            <tr>
              <td className="align-top w-[200px] bg-[#ffffe0] border border-[#808080]">
                <Sidebar
                  visits={visits}
                  onConstructionClick={() => {
                    if (!muted) playClick();
                    setConstructionClicks((c) => c + 1);
                  }}
                />
              </td>
              <td className="align-top bg-[#fffff0]">
                <MainColumn />
                <h2 className="mt-6 text-2xl font-bold underline" style={{ color: '#000080' }}>
                  &gt; Гостевая книга
                </h2>
                <form onSubmit={submitGuest} className="mt-2 grid gap-2">
                  <input
                    ref={nameRef}
                    placeholder="Ваше имя"
                    className="border-2 border-[#808080] bg-white px-2 py-1 text-base"
                    maxLength={40}
                  />
                  <textarea
                    ref={textRef}
                    placeholder="Напишите что-нибудь хорошее..."
                    className="border-2 border-[#808080] bg-white px-2 py-1 text-base h-20"
                    maxLength={400}
                  />
                  <button
                    type="submit"
                    className="self-start border-2 border-[#000] bg-[#dcdcdc] px-3 py-1 font-bold shadow-[2px_2px_0_#000] active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    [ ОСТАВИТЬ ЗАПИСЬ ]
                  </button>
                </form>
                <ul className="mt-3 space-y-2">
                  {guest.length === 0 && (
                    <li className="text-sm italic opacity-70">
                      Записей пока нет. Будь первым, оставь след в Рунете!
                    </li>
                  )}
                  {guest.map((g, i) => (
                    <li key={i} className="border border-[#808080] bg-[#ffffe0] p-2">
                      <div className="text-sm">
                        <span className="font-bold" style={{ color: '#800080' }}>{g.name}</span>
                        <span className="opacity-60 text-xs"> — {new Date(g.ts).toLocaleString('ru-RU')}</span>
                      </div>
                      <div className="text-base">{g.text}</div>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="bg-[#dfdfdf] text-center text-xs border-t-2 border-[#808080]">
                © 1999 — 2003. Все права защищены. Лучше всего смотреть в IE 5.5 при разрешении 800×600.
                <br />
                <a href="#" onClick={(e) => e.preventDefault()} className="underline" style={{ color: '#0000ee' }}>
                  написать вебмастеру
                </a>
                {' · '}
                <a href="#" onClick={(e) => e.preventDefault()} className="underline" style={{ color: '#800080' }}>
                  добавить в избранное
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {konami && <KonamiOverlay />}
    </div>
  );
}

function Marquee({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden whitespace-nowrap py-1" aria-hidden>
      <div
        className="inline-block"
        style={{
          animation: 'echoMarquee 18s linear infinite',
          paddingLeft: '100%',
        }}
      >
        {children}
      </div>
      <style>{`@keyframes echoMarquee { from { transform: translateX(0) } to { transform: translateX(-100%) } }`}</style>
    </div>
  );
}

function Sidebar({ visits, onConstructionClick }: { visits: number; onConstructionClick: () => void }) {
  const digits = String(visits).padStart(7, '0').split('');
  return (
    <div className="text-sm">
      <h3 className="bg-[#000080] text-white px-2 py-1 font-bold">МЕНЮ</h3>
      <ul className="px-2 py-2 list-disc list-inside" style={{ color: '#0000ee' }}>
        <li><a href="#" onClick={(e) => e.preventDefault()} className="underline">Главная</a></li>
        <li><a href="#" onClick={(e) => e.preventDefault()} className="underline">Обо мне</a></li>
        <li><a href="#" onClick={(e) => e.preventDefault()} className="underline">Фотоальбом</a></li>
        <li><a href="#" onClick={(e) => e.preventDefault()} className="underline">Любимая музыка</a></li>
        <li><a href="#" onClick={(e) => e.preventDefault()} className="underline">Ссылки друзей</a></li>
        <li><a href="#" onClick={(e) => e.preventDefault()} className="underline">Чат «Кроватка»</a></li>
      </ul>

      <h3 className="bg-[#800000] text-white px-2 py-1 font-bold mt-3">СЧЁТЧИК</h3>
      <div className="bg-black text-[#0f0] font-mono tracking-widest text-2xl text-center py-2 my-2 border border-[#0f0]">
        {digits.map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="text-center text-xs opacity-70">
        Вы — посетитель №{visits.toLocaleString('ru-RU')}
      </div>

      <h3 className="bg-[#006400] text-white px-2 py-1 font-bold mt-3">ОНЛАЙН-ОГНЁК</h3>
      <Flame />

      <button
        type="button"
        onClick={onConstructionClick}
        className="mt-3 w-full border-2 border-black bg-yellow-300 p-2 text-xs font-bold tracking-widest hover:bg-yellow-200"
        title="Кликните 5 раз!"
      >
        🚧 ПОД CONSTRUCTION 🚧
      </button>

      <div className="mt-3 grid grid-cols-3 gap-1">
        <Badge color="#ffcc00" text="HTML 4.0" />
        <Badge color="#33cc33" text="GeoCities" />
        <Badge color="#3366ff" text="Best with IE" />
        <Badge color="#cc0066" text="WebRing" />
        <Badge color="#990000" text="Top100" />
        <Badge color="#000000" text="No Frames" />
      </div>
    </div>
  );
}

function Badge({ color, text }: { color: string; text: string }) {
  return (
    <div
      className="text-[9px] font-bold text-center text-white px-1 py-0.5 border border-black uppercase tracking-wider"
      style={{ background: color, textShadow: '1px 1px 0 #000' }}
    >
      {text}
    </div>
  );
}

function Flame() {
  return (
    <div className="flex items-end justify-center h-12 gap-0.5 my-1" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="block w-1.5 rounded-t-full"
          style={{
            height: `${20 + Math.sin(i) * 10 + Math.random() * 10}px`,
            background: i % 2 ? '#ff5500' : '#ffaa00',
            animation: `era1flame ${0.4 + Math.random() * 0.3}s steps(2) infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes era1flame {
          from { transform: translateY(0) scaleY(1); filter: hue-rotate(0deg); }
          to   { transform: translateY(-3px) scaleY(1.1); filter: hue-rotate(-15deg); }
        }
      `}</style>
    </div>
  );
}

function MainColumn() {
  return (
    <div className="space-y-3 leading-relaxed">
      <p>
        <span style={{ background: '#ffff00' }}>★ ВНИМАНИЕ! ★</span>{' '}
        Этот сайт был сделан вручную в <b>Microsoft FrontPage</b> (или Блокноте).
        Спасибо моему модему <i>USR Sportster</i> 33.6 за то, что он&nbsp;вообще работает!
      </p>
      <p>
        Здесь вы найдёте мои любимые ссылки, фотки с дачи и стихи. Если что-то не отображается —{' '}
        <b>обновите страницу через 5 минут</b>, иногда помогает.
      </p>
      <h2 className="text-2xl font-bold underline" style={{ color: '#000080' }}>&gt; Хроника эпохи</h2>
      <ul className="list-disc list-inside text-base">
        <li>1997 — Запущен <b>«Народ.ру»</b>: бесплатный хостинг для каждого.</li>
        <li>1998 — В Рунет приходит <b>ICQ</b>. «Уии-уии» становится мелодией поколения.</li>
        <li>1999 — <b>«Анекдот.ру»</b>, <b>«Кроватка»</b>, первые мемы.</li>
        <li>2000 — <b>Яндекс</b> выкатывает «Поиск по блогам». Все срочно заводят дневники.</li>
        <li>2003 — <b>LiveJournal</b> на пике. Кириллица — уже официально.</li>
      </ul>
      <blockquote className="border-l-4 pl-3 italic" style={{ borderColor: '#800080' }}>
        «Здравствуйте, уважаемый посетитель! Меня зовут Эхо, и я расскажу вам про&nbsp;Рунет.
        Нажмите на ссылочку слева, чтобы продолжить путешествие.»
      </blockquote>
    </div>
  );
}

function KonamiOverlay() {
  const items = Array.from({ length: 24 });
  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-yellow-400 bg-fuchsia-700 px-5 py-3 text-white"
        style={{ fontFamily: '"Comic Sans MS", cursive', textShadow: '2px 2px 0 #000' }}
      >
        <div className="text-2xl font-black">[ САЙТ ОБНОВЛЁН! ]</div>
        <div className="text-sm">Поздравляем, вы&nbsp;нашли пасхалку!</div>
      </div>
      {items.map((_, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            color: ['#ff0','#0ff','#f0f','#0f0'][i % 4],
            fontSize: `${14 + Math.random() * 22}px`,
            animation: `era1twirl ${1.5 + Math.random() * 2}s ease-in-out infinite alternate`,
          }}
        >
          {['🔥','✨','💥','★','♥'][i % 5]}
        </span>
      ))}
      <style>{`
        @keyframes era1twirl {
          from { transform: translate(0,0) rotate(0deg); }
          to   { transform: translate(${Math.random()*40-20}px, ${Math.random()*40-20}px) rotate(20deg); }
        }
      `}</style>
    </div>
  );
}
