import {
  INITIAL_GOALS,
  INITIAL_ENTRIES,
  STORE_KEY,
  BULAN,
  BULAN_PENDEK,
  HARI,
} from "./constants";

export const key = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const today = () => key(new Date());

export const shiftDays = (d, n) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

export const fromKey = (k) => {
  if (!k) return new Date();
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const daysBetween = (a, b) => Math.round((fromKey(a) - fromKey(b)) / 86400000);

export const fmt = (n) => "Rp" + Math.round(Number(n) || 0).toLocaleString("id-ID");

export const fmtShort = (n) => {
  const val = Number(n) || 0;
  if (val >= 1_000_000) {
    const jt = val / 1_000_000;
    return (Number.isInteger(jt) ? jt : jt.toFixed(1)).replace(".", ",") + "jt";
  }
  if (val >= 1000) {
    return Math.round(val / 1000) + "rb";
  }
  return String(val);
};

export const digits = (s) => (String(s || "").match(/\d/g) || []).join("");

export const pctOf = (n, d) => (d > 0 ? Math.min(100, Math.max(0, (n / d) * 100)) : 0);

export function formatDateFull(dateStr) {
  if (!dateStr) return "-";
  const d = fromKey(dateStr);
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateShort(dateStr) {
  if (!dateStr) return "-";
  const d = fromKey(dateStr);
  return `${d.getDate()} ${BULAN_PENDEK[d.getMonth()]} ${d.getFullYear()}`;
}

export function defaultState() {
  return {
    profile: {
      name: "Pengguna",
      targetTotal: 0,
    },
    goals: INITIAL_GOALS,
    entries: INITIAL_ENTRIES,
  };
}

export function loadState() {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.goals) || !Array.isArray(parsed?.entries)) {
      return defaultState();
    }
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Gagal menyimpan ke localStorage:", err);
  }
}

export function totalSavedAll(goals = []) {
  return goals.reduce((acc, g) => acc + (Number(g.saved) || 0), 0);
}

export function targetTotalAll(goals = []) {
  return goals.reduce((acc, g) => acc + (Number(g.target) || 0), 0);
}

export function calculateStreak(entries = []) {
  if (!entries.length) return 0;
  const days = new Set(entries.map((e) => e.d));
  let cursor = new Date();
  if (!days.has(key(cursor))) cursor = shiftDays(cursor, -1);
  let count = 0;
  while (days.has(key(cursor))) {
    count++;
    cursor = shiftDays(cursor, -1);
  }
  return count;
}

export function compressImage(file, maxDimension = 360, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("File bukan gambar yang valid"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
