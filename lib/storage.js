import { GOALS, DAILY, BULAN_PENDEK, HARI, STORE_KEY } from "./constants";

export const key = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const today = () => key(new Date());

export const shift = (d, n) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

export const fromKey = (k) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const daysBetween = (a, b) => Math.round((fromKey(a) - fromKey(b)) / 86400000);

export const fmt = (n) => "Rp" + Math.round(n).toLocaleString("id-ID");

export const fmtShort = (n) => (n >= 1000 ? Math.round(n / 1000) + "rb" : String(n));

export const digits = (s) => (s.match(/\d/g) || []).join("");

export const pctOf = (n, d) => (d > 0 ? (n / d) * 100 : 0);

export function etaLabel(remaining) {
  if (remaining <= 0) return "impian ini sudah terkumpul semua";
  const days = Math.ceil(remaining / DAILY);
  const when = shift(new Date(), days);
  return `± ${days} hari lagi, sekitar ${when.getDate()} ${BULAN_PENDEK[when.getMonth()]} ${when.getFullYear()}`;
}

export function defaultState() {
  return {
    goals: {
      ipad: { saved: 0 },
      iphone: { saved: 0 },
    },
    entries: [],
  };
}

export function loadState() {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed?.goals || !Array.isArray(parsed.entries)) return defaultState();
    return {
      goals: {
        ipad: { saved: Number(parsed.goals.ipad?.saved) || 0 },
        iphone: { saved: Number(parsed.goals.iphone?.saved) || 0 },
      },
      entries: parsed.entries,
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* quota or private browsing mode */
  }
}

export const totalSaved = (goals) => (goals.ipad?.saved || 0) + (goals.iphone?.saved || 0);

export const targetTotal = () => GOALS.ipad.target + GOALS.iphone.target;

export const entriesOn = (entries, k) => entries.filter((e) => e.d === k);

export function calculateStreak(entries) {
  const days = new Set(entries.map((e) => e.d));
  let cursor = new Date();
  if (!days.has(key(cursor))) cursor = shift(cursor, -1);
  let count = 0;
  while (days.has(key(cursor))) {
    count++;
    cursor = shift(cursor, -1);
  }
  return count;
}

export function dayLabel(k) {
  const diff = daysBetween(today(), k);
  if (diff === 0) return "Hari ini";
  if (diff === 1) return "Kemarin";
  const d = fromKey(k);
  if (diff < 7) return HARI[d.getDay()];
  return `${d.getDate()} ${BULAN_PENDEK[d.getMonth()]}`;
}
