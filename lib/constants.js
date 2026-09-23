export const CATEGORIES = [
  { id: "gadget", label: "Gadget & Elektronik", icon: "laptop" },
  { id: "darurat", label: "Dana Darurat", icon: "shield" },
  { id: "liburan", label: "Liburan & Traveling", icon: "plane" },
  { id: "kendaraan", label: "Kendaraan", icon: "car" },
  { id: "rumah", label: "Rumah & Properti", icon: "home" },
  { id: "pendidikan", label: "Pendidikan", icon: "book" },
  { id: "lainnya", label: "Lainnya", icon: "spark" },
];

export const INITIAL_GOALS = [
  {
    id: "goal-1",
    name: "iPad Air M2",
    target: 9_500_000,
    saved: 3_200_000,
    category: "gadget",
    image: null,
    deadline: "2026-12-31",
    createdAt: "2026-09-01",
  },
  {
    id: "goal-2",
    name: "Dana Darurat 3 Bulan",
    target: 15_000_000,
    saved: 6_500_000,
    category: "darurat",
    image: null,
    deadline: "2027-03-31",
    createdAt: "2026-09-01",
  },
  {
    id: "goal-3",
    name: "Liburan Akhir Tahun",
    target: 5_000_000,
    saved: 1_750_000,
    category: "liburan",
    image: null,
    deadline: "2026-11-30",
    createdAt: "2026-09-10",
  },
];

export const INITIAL_ENTRIES = [
  {
    id: "entry-1",
    d: "2026-09-23",
    a: 50_000,
    g: "goal-1",
    n: "Sisa jajan harian",
    createdAt: "2026-09-23T08:30:00.000Z",
  },
  {
    id: "entry-2",
    d: "2026-09-22",
    a: 100_000,
    g: "goal-2",
    n: "Alokasi mingguan",
    createdAt: "2026-09-22T19:00:00.000Z",
  },
  {
    id: "entry-3",
    d: "2026-09-20",
    a: 200_000,
    g: "goal-3",
    n: "Hemat belanja bulanan",
    createdAt: "2026-09-20T14:15:00.000Z",
  },
];

export const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
export const HARI_PENDEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
export const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
export const BULAN_PENDEK = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export const STORE_KEY = "tabungan-pro-v2";
