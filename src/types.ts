export type EraId = "boot" | "wild" | "web2" | "eco" | "outro";

export interface EraMeta {
  id: EraId;
  index: number;
  title: string;
  range: string;
  tagline: string;
}

export const ERAS: EraMeta[] = [
  { id: "boot", index: 0, title: "Инициализация", range: "хх.хх.хххх", tagline: "Соединение с архивом..." },
  { id: "wild", index: 1, title: "Дикий Запад", range: "1997 — 2003", tagline: "Народ.ру, форумы, кроватка" },
  { id: "web2", index: 2, title: "Золотой век", range: "2007 — 2012", tagline: "ВК, Хабр, демотиваторы" },
  { id: "eco", index: 3, title: "Экосистема", range: "2020 — 2026", tagline: "Бигтех, нейросети, тёмный UI" },
  { id: "outro", index: 4, title: "Эхо", range: "→", tagline: "Что мы услышали" },
];

export const NAV_ERAS: EraMeta[] = ERAS.filter((e) => e.id !== "boot" && e.id !== "outro");
