# Эхо Рунета

Иммерсивный веб-перформанс о трёх эпохах российского интернета: **«Дикий Запад» (1997–2003)**, **«Золотой век» (2007–2012)** и **«Экосистема / Нейро-Синтез» (2020–2026)**.

Между эпохами — глитч-переход (RGB-сдвиг + горящая плёнка + scanline). У каждой эпохи — собственная типографика, палитра, поведение интерфейса и пасхалки.

> Расширенное ТЗ — в [`TZ.md`](./TZ.md). Исходный креативный бриф — в [`TZ`](./TZ).

---

## Стек

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** (три «темы» эпох через CSS-переменные)
- **GSAP** (timeline для глитч-перехода)
- ESLint

Без бэкенда — это статический одностраничник.

## Запуск

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production-сборка в ./dist
npm run preview  # локальный preview production-сборки
npm run lint
npm run typecheck
```

> Открывать `dist/index.html` двойным кликом (через `file://`) **не получится** —
> модули ES не грузятся по `file://`. Используй `npm run preview` или любой
> статический сервер.

## Деплой на GitHub Pages

В репо настроен workflow `.github/workflows/pages.yml`. На каждый push в `main`
он билдит проект и публикует `dist/` через **actions/deploy-pages**. Сайт будет
доступен по `https://<owner>.github.io/portfo2/`.

Один раз нужно переключить Pages в режим Actions:

1. Repo → **Settings** → **Pages**.
2. **Source** → выбрать **GitHub Actions** (а не «Deploy from a branch»).

Если форкаешь репозиторий с другим именем — поменяй `base` в `vite.config.ts`
на `/<your-repo>/`. Для деплоя на корневой домен (Vercel/Netlify/собственный
домен) поставь `base: "/"`.

## Навигация

- `←` / `→` — переключение эпох
- `1` / `2` / `3` — мгновенный переход в эпоху
- `/` — командная палитра (только в Эре 3)
- HUD сверху — клик по таблетке эпохи

## Пасхалки

- **Эра 1 — Дикий Запад.** Konami-код (`↑ ↑ ↓ ↓ ← → ← → B A`) → ASCII-огонь и секретная благодарность.
- **Эра 2 — Золотой век.** Двойной клик по «Нравится» → каскад из ~36 пиксельных сердечек.
- **Эра 3 — Экосистема.** `/` → командная палитра с `summon-ai`, `about` и быстрыми переходами.

## Структура

```
src/
  App.tsx
  main.tsx
  index.css
  types.ts
  context/EraContext.tsx     # состояние эпохи + transitions
  components/
    Hud.tsx                  # верхняя адаптивная навигация
    GlitchTransition.tsx     # SVG turbulence + RGB-split + flash
    CustomCursor.tsx         # магнитный курсор для Эры 3
    KonamiListener.tsx       # Эра 1 — пасхалка
    CommandPalette.tsx       # Эра 3 — пасхалка / командная палитра
  scenes/
    Boot.tsx                 # CRT-загрузка + вход
    EraWild.tsx              # 1997–2003
    EraWeb2.tsx              # 2007–2012
    EraEco.tsx               # 2020–2026
    Outro.tsx                # таймлайн всех трёх эпох
```

## Что считаем «готово»

См. раздел Definition of Done в [`TZ.md`](./TZ.md).
