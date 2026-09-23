/* Tasha's Little Savings, diari nabung. state lives in localStorage
   so the diary keeps its pages between visits. */

(() => {
  "use strict";

  /* ── data ──────────────────────────────────────────────────── */

  const GOALS = {
    ipad:   { name: "iPad",                short: "iPad",     target: 4_000_000, tint: "peach" },
    iphone: { name: "iPhone 11 Pro Max",   short: "iPhone",   target: 6_500_000, tint: "lav"   },
  };
  const DAILY = 35_000;
  const MILESTONES = [1_000_000, 2_500_000, 5_000_000, 7_500_000, 10_500_000];
  const MESSAGES = [
    "Pelan-pelan juga tetap maju, ya ♡",
    "Hari ini kamu lebih dekat daripada kemarin.",
    "Sedikit tiap hari, jadi besar diam-diam.",
    "Konsisten itu yang paling manis.",
    "Halaman hari ini belum terlambat diisi.",
  ];
  const NOTES = [
    "Kopi dibikin sendiri, aman",
    "Keran online dibatalkan",
    "Dapat bonus kecil dari kerjaan",
    "Hari biasa, tetap diisi",
    "Sisa saldo dompet digital",
    "Nabung dulu sebelum jajan",
    "Gajian, langsung disisihkan",
    "Malam minggu di rumah aja",
    "Jalan kaki, ongkosnya ditabung",
    "Barang lama laku di sini",
    "Capek, tapi halamannya tetap",
    "Setahun lagi kelihatan dekat",
    "Awal bulan, semangat",
    "Receh dari kantong celana",
    "Es batu diganti es rumah",
    "Mulai lagi setelah bolong",
  ];

  const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const HARI_PENDEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                 "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const BULAN_PENDEK = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  /* monday-first labels for the week strip */
  const MINGGU = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  const STORE_KEY = "tasha-savings-v1";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── dates ─────────────────────────────────────────────────── */

  const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = () => key(new Date());
  const shift = (d, n) => { const c = new Date(d); c.setDate(c.getDate() + n); return c; };
  const fromKey = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const daysBetween = (a, b) => Math.round((fromKey(a) - fromKey(b)) / 86400000);

  /* ── format ────────────────────────────────────────────────── */

  const fmt = n => "Rp" + Math.round(n).toLocaleString("id-ID");
  const fmtShort = n => n >= 1000 ? Math.round(n / 1000) + "rb" : String(n);
  const digits = s => (s.match(/\d/g) || []).join("");
  const pctOf = (n, d) => d > 0 ? (n / d) * 100 : 0;

  /* ── state ─────────────────────────────────────────────────── */

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return { goals: { ipad: { saved: 0 }, iphone: { saved: 0 } }, entries: [] };
      const parsed = JSON.parse(raw);
      if (!parsed?.goals || !Array.isArray(parsed.entries)) return { goals: { ipad: { saved: 0 }, iphone: { saved: 0 } }, entries: [] };
      return parsed;
    } catch { return { goals: { ipad: { saved: 0 }, iphone: { saved: 0 } }, entries: [] }; }
  }
  function persist() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* private mode: diary stays for this visit */ }
  }

  const total = () => state.goals.ipad.saved + state.goals.iphone.saved;
  const targetTotal = () => GOALS.ipad.target + GOALS.iphone.target;
  const entriesOn = k => state.entries.filter(e => e.d === k);

  function streak() {
    const days = new Set(state.entries.map(e => e.d));
    let cursor = new Date();
    if (!days.has(key(cursor))) cursor = shift(cursor, -1);
    let n = 0;
    while (days.has(key(cursor))) { n++; cursor = shift(cursor, -1); }
    return n;
  }

  /* ── elements ──────────────────────────────────────────────── */

  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];

  const app = $("#app");
  const saveBtn = $("#saveBtn");
  const saveBtnLabel = $("#saveBtnLabel");
  const saveBtnAmt = $("#saveBtnAmt");
  const sheet = $("#sheet");
  const backdrop = $("#backdrop");
  const amountInput = $("#amountInput");
  const amountErr = $("#amountErr");
  const fx = $("#fx");
  const toasts = $("#toasts");

  /* ── render ────────────────────────────────────────────────── */

  function values() {
    const t = total(), tt = targetTotal();
    const out = {
      "total:amount": fmt(t),
      "total:goal": fmt(tt),
      "total:left": fmt(Math.max(0, tt - t)),
      "total:pct": Math.round(pctOf(t, tt)) + "% tercapai",
      "total:eta": etaLabel(Math.max(0, tt - t)),
    };
    for (const id of Object.keys(GOALS)) {
      const g = GOALS[id], s = state.goals[id].saved;
      out[`${id}:saved`] = fmt(s);
      out[`${id}:target`] = fmt(g.target);
      out[`${id}:left`] = fmt(Math.max(0, g.target - s));
      out[`${id}:pct`] = Math.round(pctOf(s, g.target)) + "%";
      out[`${id}:eta`] = etaLabel(Math.max(0, g.target - s));
    }
    return out;
  }

  function etaLabel(remaining) {
    if (remaining <= 0) return "impian ini sudah terkumpul semua";
    const days = Math.ceil(remaining / DAILY);
    const when = shift(new Date(), days);
    return `± ${days} hari lagi, sekitar ${when.getDate()} ${BULAN_PENDEK[when.getMonth()]} ${when.getFullYear()}`;
  }

  function render(opts = {}) {
    const v = values();

    $$("[data-f]").forEach(el => { const val = v[el.dataset.f]; if (val != null) el.textContent = val; });

    const t = total(), tt = targetTotal();
    const heroAmount = $("#heroAmount");
    if (opts.tweenFrom != null && opts.tweenFrom !== t) tween(heroAmount, opts.tweenFrom, t, 700, fmt);
    else heroAmount.textContent = v["total:amount"];

    const heroPct = pctOf(t, tt);
    $("#totalFill").style.width = heroPct + "%";
    $("#totalProg").setAttribute("aria-valuenow", Math.round(heroPct));

    for (const id of Object.keys(GOALS)) {
      const p = pctOf(state.goals[id].saved, GOALS[id].target);
      $$(`[data-fill="${id}"]`).forEach(el => { el.style.width = p + "%"; });
      $$(`[data-bar="${id}"]`).forEach(el => el.setAttribute("aria-valuenow", Math.round(p)));
    }

    renderWeek();
    renderStreak();
    renderMilestones();
    renderHistory();
    renderPages();
  }

  function renderWeek() {
    const now = new Date();
    const monday = shift(now, -((now.getDay() + 6) % 7));
    const tKey = today();

    $("#weekHome").innerHTML = Array.from({ length: 7 }, (_, i) => {
      const d = shift(monday, i), k = key(d);
      const list = entriesOn(k);
      const isToday = k === tKey;
      const future = d > now && !isToday;
      const sum = list.reduce((a, e) => a + e.a, 0);

      let cls = "day";
      if (future) cls += " day--future";
      else if (list.length) cls += " day--done";
      if (isToday) cls += " day--today";

      let status = "";
      if (list.length) status = `<svg aria-hidden="true"><use href="#d-check"/></svg><b>${fmtShort(sum)}</b>`;
      else if (isToday) status = `isi ♡`;

      const inner = `<span class="day-k">${MINGGU[i]}</span><span class="day-n">${d.getDate()}</span><span class="day-s">${status}</span>`;
      return isToday
        ? `<button class="${cls}" type="button" data-open-sheet aria-label="Isi halaman hari ini">${inner}</button>`
        : `<div class="${cls}">${inner}</div>`;
    }).join("");
  }

  function renderStreak() {
    const n = streak();
    $("#streakLine").innerHTML = n > 0
      ? `<strong>${n}</strong> hari berturut-turut`
      : `belum ada streak, mulai dari hari ini ♡`;
    $("#streakBig").textContent = n;

    const last7 = state.entries.slice(0, 40);
    const dots = Array.from({ length: 7 }, (_, i) => {
      const k = key(shift(new Date(), -(6 - i)));
      return `<i class="${last7.some(e => e.d === k) ? "is-on" : ""}"></i>`;
    }).join("");
    $("#streakDots").innerHTML = dots;
    $("#streakDots2").innerHTML = dots;

    const recent = state.entries.slice(0, 7);
    const avg = recent.length ? recent.reduce((a, e) => a + e.a, 0) / recent.length : 0;
    $("#avgWeek").textContent = fmt(avg);
  }

  function renderMilestones() {
    const t = total();
    const html = MILESTONES.map(m => {
      const on = t >= m;
      const sub = on ? "tercapai" : "sisa " + fmt(m - t);
      const icon = on ? "#d-check" : "#d-lock";
      return `<article class="mile ${on ? "mile--on" : ""}">
        <span class="mile-icon"><svg aria-hidden="true"><use href="${icon}"/></svg></span>
        <p class="mile-amt">${fmt(m)}</p>
        <p class="mile-sub">${sub}</p>
      </article>`;
    }).join("");
    $("#milesHome").innerHTML = html;
    $("#milesJourney").innerHTML = html;
  }

  function dayLabel(k) {
    const diff = daysBetween(today(), k);
    if (diff === 0) return "Hari ini";
    if (diff === 1) return "Kemarin";
    const d = fromKey(k);
    if (diff < 7) return HARI[d.getDay()];
    return `${d.getDate()} ${BULAN_PENDEK[d.getMonth()]}`;
  }

  function renderHistory() {
    const groups = new Map();
    for (const e of state.entries) {
      if (!groups.has(e.d)) groups.set(e.d, { sum: 0, notes: [], goals: new Set() });
      const g = groups.get(e.d);
      g.sum += e.a;
      if (e.n) g.notes.push(e.n);
      g.goals.add(e.g);
    }

    const rows = [...groups.entries()].map(([k, g]) => {
      const note = g.notes.length ? g.notes.join(" · ")
        : "nabung ke " + [...g.goals].map(id => GOALS[id].short).join(" & ");
      const onlyIphone = g.goals.size === 1 && g.goals.has("iphone");
      return `<div class="row row--in">
        <span class="row-stamp ${onlyIphone ? "row-stamp--lav" : ""}"><svg aria-hidden="true"><use href="#d-heart-f"/></svg></span>
        <div class="row-body">
          <p class="row-when">${dayLabel(k)}</p>
          <p class="row-note">${note}</p>
        </div>
        <span class="row-amt">+${fmt(g.sum)}</span>
      </div>`;
    }).join("");

    const empty = `<div class="empty"><strong>Belum ada catatan</strong>Isi halaman hari ini, riwayatnya mulai terbentuk.</div>`;
    $("#histFull").innerHTML = rows || empty;
    $("#histHome").innerHTML = rows ? rows : empty;
  }

  function weekDays() {
    const now = new Date();
    const monday = shift(now, -((now.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => shift(monday, i));
  }

  function renderPages() {
    const now = new Date(), tKey = today();

    $("#pages").innerHTML = weekDays().map(d => {
      const k = key(d);
      const list = entriesOn(k);
      const sum = list.reduce((a, e) => a + e.a, 0);
      const date = `<div class="page-date"><p class="page-d">${d.getDate()}</p><p class="page-w">${HARI[d.getDay()]}</p></div>`;

      if (k === tKey) {
        const done = list.length > 0;
        const note = done ? (list.find(e => e.n)?.n || "ditambahkan hari ini") : "tulis dulu, sekecil apa pun";
        return `<button class="page page--today ${done ? "page--done" : ""}" type="button" data-open-sheet>
          ${date}
          <div class="page-body">
            <p class="page-note">${done ? note : "Halaman hari ini masih kosong"}</p>
            <p class="page-sub">${done ? list.length + "x nabung" : "ketuk untuk mengisi"}</p>
          </div>
          ${done
            ? `<span class="page-amt">${fmt(sum)}</span><span class="page-check"><svg aria-hidden="true"><use href="#d-check"/></svg></span>`
            : `<span class="page-add"><svg aria-hidden="true"><use href="#d-plus"/></svg></span>`}
        </button>`;
      }

      if (d > now) {
        return `<div class="page page--future">
          <span class="page-tab"></span>${date}
          <div class="page-body"><p class="page-note">Belum waktunya</p><p class="page-sub">halaman menunggu</p></div>
        </div>`;
      }

      if (list.length) {
        const lav = list.every(e => e.g === "iphone");
        const note = list.find(e => e.n)?.n || "nabung tanpa catatan";
        return `<div class="page">
          <span class="page-tab ${lav ? "page-tab--lav" : ""}"></span>${date}
          <div class="page-body">
            <p class="page-note">${note}</p>
            <p class="page-sub">${list.length}x ke ${[...new Set(list.map(e => GOALS[e.g].short))].join(" & ")}</p>
          </div>
          <span class="page-amt">${fmt(sum)}</span>
          <span class="page-check"><svg aria-hidden="true"><use href="#d-check"/></svg></span>
        </div>`;
      }

      return `<div class="page">
        <span class="page-tab"></span>${date}
        <div class="page-body"><p class="page-note">Lewat begitu saja</p><p class="page-sub">tidak diisi</p></div>
      </div>`;
    }).join("");
  }

  /* ── animation helpers ─────────────────────────────────────── */

  function tween(el, from, to, dur, format) {
    if (reduced) { el.textContent = format(to); return; }
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = format(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  const FX_SHAPES = [
    ["#d-heart-f", "#C4767E"], ["#d-spark", "#E9CE86"], ["#d-star", "#A99BD1"],
    ["#d-heart", "#E0A2A8"], ["#d-heart-f", "#AA5C65"], ["#d-spark", "#EEA97F"],
  ];

  function burst(cx, cy, n = 14) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const [icon, color] = FX_SHAPES[i % FX_SHAPES.length];
      const s = 9 + Math.random() * 8;
      const el = document.createElement("span");
      el.style.cssText =
        `left:${cx + (Math.random() * 76 - 38)}px;top:${cy + (Math.random() * 16 - 8)}px;` +
        `width:${s}px;height:${s}px;color:${color};animation-delay:${i * 45}ms;` +
        `--sw1:${(Math.random() * 36 - 18).toFixed(1)}px;--sw2:${(Math.random() * 70 - 35).toFixed(1)}px;` +
        `--rot:${(Math.random() * 50 - 25).toFixed(1)}deg;--rot2:${(Math.random() * 90 - 45).toFixed(1)}deg`;
      el.innerHTML = `<svg viewBox="0 0 24 24"><use href="${icon}"/></svg>`;
      fx.appendChild(el);
      setTimeout(() => el.remove(), 1700 + i * 45);
    }
  }

  function toast(html, ms = 3000) {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = html;
    toasts.appendChild(el);
    while (toasts.children.length > 2) toasts.firstElementChild.remove();
    setTimeout(() => el.classList.add("is-out"), ms);
    setTimeout(() => el.remove(), ms + 400);
  }

  /* ── the save sheet ────────────────────────────────────────── */

  let sheetAmt = DAILY;
  let sheetGoal = "ipad";
  let lastFocus = null;
  let savedTodayBefore = entriesOn(today()).length > 0;

  const defaultGoal = () =>
    pctOf(state.goals.ipad.saved, GOALS.ipad.target) <= pctOf(state.goals.iphone.saved, GOALS.iphone.target)
      ? "ipad" : "iphone";

  function openSheet(goalId) {
    lastFocus = document.activeElement;
    if (goalId) sheetGoal = goalId;
    renderSheet();
    backdrop.hidden = false;
    sheet.hidden = false;
    document.body.classList.add("is-locked");
    app.classList.add("is-locked");
    sheet.focus();
  }

  function closeSheet() {
    backdrop.hidden = true;
    sheet.hidden = true;
    document.body.classList.remove("is-locked");
    app.classList.remove("is-locked");
    hideErr();
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function renderSheet() {
    amountInput.value = sheetAmt ? sheetAmt.toLocaleString("id-ID") : "";
    saveBtnAmt.textContent = fmt(sheetAmt || 0);
    $$("[data-amt]").forEach(c => c.classList.toggle("is-on", Number(c.dataset.amt) === sheetAmt));
    $$("[data-goal-chip]").forEach(c => c.classList.toggle("is-on", c.dataset.goalChip === sheetGoal));
    $("#sheetTitle").innerHTML = `Nabung untuk ${GOALS[sheetGoal].short} <svg aria-hidden="true"><use href="#d-heart"/></svg>`;
  }

  const showErr = () => { amountErr.hidden = false; };
  const hideErr = () => { amountErr.hidden = true; };

  function commit() {
    if (!sheetAmt || sheetAmt < 1) { showErr(); amountInput.focus(); return; }
    const before = total();
    state.goals[sheetGoal].saved += sheetAmt;
    state.entries.unshift({ d: today(), a: sheetAmt, g: sheetGoal, n: null });
    persist();
    closeSheet();

    const crossed = MILESTONES.find(m => before < m && total() >= m);
    render({ tweenFrom: before });

    const r = saveBtn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + 20);

    saveBtn.classList.add("is-done");
    saveBtnLabel.innerHTML = `Tercatat, Tasha <svg aria-hidden="true"><use href="#d-check"/></svg>`;
    setTimeout(() => {
      saveBtn.classList.remove("is-done");
      saveBtnLabel.innerHTML = `Nabung hari ini <svg aria-hidden="true"><use href="#d-heart"/></svg>`;
    }, 1800);

    const newPage = !savedTodayBefore;
    savedTodayBefore = true;
    if (newPage && !reduced) $$(".day--today, .page--today .page-check").forEach(el => el.classList.add("stamp-pop"));

    toast(`<b>${fmt(sheetAmt)}</b> masuk ke ${GOALS[sheetGoal].short} · ${streak()} hari berturut-turut`);
    if (crossed) setTimeout(() => toast(`Milestone <b>${fmt(crossed)}</b> kebuka ♡`), 1700);
  }

  amountInput.addEventListener("input", () => {
    const raw = digits(amountInput.value).slice(0, 12);
    sheetAmt = raw ? Number(raw) : 0;
    amountInput.value = sheetAmt ? sheetAmt.toLocaleString("id-ID") : "";
    saveBtnAmt.textContent = fmt(sheetAmt || 0);
    $$("[data-amt]").forEach(c => c.classList.toggle("is-on", Number(c.dataset.amt) === sheetAmt));
    if (sheetAmt > 0) hideErr();
  });
  amountInput.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
  });

  $("#sheetClose").addEventListener("click", closeSheet);
  backdrop.addEventListener("click", closeSheet);
  $("#confirmBtn").addEventListener("click", commit);

  document.addEventListener("keydown", e => {
    if (sheet.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); closeSheet(); return; }
    if (e.key !== "Tab") return;
    const focusables = [...sheet.querySelectorAll("button, input")].filter(el => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ── navigation ────────────────────────────────────────────── */

  function goto(name) {
    $$(".screen").forEach(s => {
      const on = s.id === "screen-" + name;
      s.hidden = !on;
      s.classList.toggle("is-active", on);
    });
    $$(".tab").forEach(t => {
      const on = t.dataset.goto === name;
      t.classList.toggle("is-active", on);
      if (on) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
    });
    app.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  /* ── delegated clicks ──────────────────────────────────────── */

  document.addEventListener("click", e => {
    const goEl = e.target.closest("[data-goto]");
    if (goEl) { goto(goEl.dataset.goto); return; }

    const addEl = e.target.closest("[data-add]");
    if (addEl) { openSheet(addEl.dataset.add); return; }

    const openEl = e.target.closest("[data-open-sheet]");
    if (openEl) { openSheet(); return; }

    const amtEl = e.target.closest("[data-amt]");
    if (amtEl) {
      sheetAmt = Number(amtEl.dataset.amt);
      hideErr();
      renderSheet();
      amountInput.focus();
      return;
    }

    const goalEl = e.target.closest("[data-goal-chip]");
    if (goalEl) { sheetGoal = goalEl.dataset.goalChip; renderSheet(); return; }
  });

  /* ── reset (two taps, no dialog) ───────────────────────────── */

  const resetBtn = $("#resetBtn");
  let armed = null;
  resetBtn.addEventListener("click", () => {
    if (armed) {
      clearTimeout(armed); armed = null;
      resetBtn.textContent = "Mulai ulang catatan";
      resetBtn.classList.remove("is-armed");
      state = seed();
      persist();
      savedTodayBefore = false;
      render();
      toast("Catatan diulang dari halaman pertama ♡");
      return;
    }
    resetBtn.textContent = "yakin? ketuk sekali lagi";
    resetBtn.classList.add("is-armed");
    armed = setTimeout(() => {
      resetBtn.textContent = "Mulai ulang catatan";
      resetBtn.classList.remove("is-armed");
      armed = null;
    }, 3200);
  });

  /* ── header shadow on scroll ───────────────────────────────── */

  const onScroll = () => {
    const top = app.scrollTop || window.scrollY || 0;
    document.querySelector(".topbar").classList.toggle("is-stuck", top > 6);
  };
  app.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── boot ──────────────────────────────────────────────────── */

  const now = new Date();
  $("#heroDate").textContent = `${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`;
  $("#journeyMonth").textContent = `${BULAN[now.getMonth()]} ${now.getFullYear()}`;
  $("#heroMsg").textContent = MESSAGES[Math.floor(now.getDate() / 3) % MESSAGES.length];

  /* totals count up once on boot, like ink settling on the page */
  render({ tweenFrom: reduced ? null : 0 });
  saveBtnAmt.textContent = fmt(sheetAmt);
})();
