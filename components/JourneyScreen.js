"use client";

import { useState } from "react";
import { GOALS, MILESTONES, BULAN, HARI } from "@/lib/constants";
import {
  fmt,
  totalSaved,
  entriesOn,
  calculateStreak,
  key,
  today,
  shift,
  dayLabel,
} from "@/lib/storage";

export default function JourneyScreen({ state, onOpenSheet, onReset }) {
  const [isArmed, setIsArmed] = useState(false);
  const now = new Date();
  const tKey = today();
  const total = totalSaved(state.goals);
  const streakCount = calculateStreak(state.entries);

  // Current month for header
  const currentMonthStr = `${BULAN[now.getMonth()]} ${now.getFullYear()}`;

  // Recent 7 entries for average
  const recent = state.entries.slice(0, 7);
  const avg = recent.length
    ? recent.reduce((a, e) => a + e.a, 0) / recent.length
    : 0;

  // Streak dots
  const last7 = state.entries.slice(0, 40);
  const streakDots = Array.from({ length: 7 }, (_, i) => {
    const k = key(shift(new Date(), -(6 - i)));
    return last7.some((e) => e.d === k);
  });

  // Week days starting from Monday
  const monday = shift(now, -((now.getDay() + 6) % 7));
  const weekDays = Array.from({ length: 7 }, (_, i) => shift(monday, i));

  // History grouped by date
  const groups = new Map();
  for (const e of state.entries) {
    if (!groups.has(e.d)) groups.set(e.d, { sum: 0, notes: [], goals: new Set() });
    const g = groups.get(e.d);
    g.sum += e.a;
    if (e.n) g.notes.push(e.n);
    g.goals.add(e.g);
  }
  const historyList = [...groups.entries()];

  const handleResetClick = () => {
    if (isArmed) {
      setIsArmed(false);
      onReset();
      return;
    }
    setIsArmed(true);
    setTimeout(() => {
      setIsArmed(false);
    }, 3200);
  };

  return (
    <div className="pad">
      <header className="scr-head">
        <h1>Catatan nabung</h1>
        <p>{currentMonthStr}</p>
      </header>

      <div className="journey-grid">
        {/* Left Column: Streak, Milestones, and Action */}
        <div className="journey-col-main">
          {/* Streak Summary Card */}
          <article className="streak-card">
            <div className="streak-card-main">
              <svg aria-hidden="true">
                <use href="#d-flame" />
              </svg>
              <div>
                <p className="streak-card-num">{streakCount}</p>
                <p className="streak-card-label">
                  hari berturut-turut
                  <br />
                  diisi tanpa bolong
                </p>
              </div>
            </div>
            <div className="streak-card-side">
              <p className="streak-card-k">rata-rata 7 hari</p>
              <p className="streak-card-v">{fmt(avg)}</p>
              <div className="dots dots--lg" aria-hidden="true">
                {streakDots.map((on, idx) => (
                  <i key={idx} className={on ? "is-on" : ""} />
                ))}
              </div>
            </div>
          </article>

          {/* Milestones Wrap */}
          <div className="sec-head">
            <h2 className="sec-title">Milestone</h2>
          </div>
          <div className="miles miles--wrap">
            {MILESTONES.map((m) => {
              const reached = total >= m;
              const sub = reached ? "tercapai" : `sisa ${fmt(m - total)}`;
              const icon = reached ? "#d-check" : "#d-lock";
              return (
                <article
                  key={m}
                  className={`mile ${reached ? "mile--on" : ""}`}
                >
                  <span className="mile-icon">
                    <svg aria-hidden="true">
                      <use href={icon} />
                    </svg>
                  </span>
                  <p className="mile-amt">{fmt(m)}</p>
                  <p className="mile-sub">{sub}</p>
                </article>
              );
            })}
          </div>

          {/* Reset button with 2-tap confirmation */}
          <button
            className={`ghost ${isArmed ? "is-armed" : ""}`}
            type="button"
            onClick={handleResetClick}
          >
            {isArmed ? "yakin? ketuk sekali lagi" : "Mulai ulang catatan"}
          </button>
        </div>

        {/* Right Column: Weekly Pages and Full History */}
        <div className="journey-col-side">
          {/* Halaman minggu ini */}
          <div className="sec-head sec-head--plain">
            <h2 className="sec-title">Halaman minggu ini</h2>
          </div>

          <div className="pages">
            {weekDays.map((d) => {
              const dKey = key(d);
              const list = entriesOn(state.entries, dKey);
              const sum = list.reduce((a, e) => a + e.a, 0);
              const isToday = dKey === tKey;
              const isFuture = d > now && !isToday;

              const dateBlock = (
                <div className="page-date">
                  <p className="page-d">{d.getDate()}</p>
                  <p className="page-w">{HARI[d.getDay()]}</p>
                </div>
              );

              if (isToday) {
                const done = list.length > 0;
                const note = done
                  ? list.find((e) => e.n)?.n || "ditambahkan hari ini"
                  : "tulis dulu, sekecil apa pun";
                return (
                  <button
                    key={dKey}
                    className={`page page--today ${done ? "page--done" : ""}`}
                    type="button"
                    onClick={() => onOpenSheet()}
                  >
                    {dateBlock}
                    <div className="page-body">
                      <p className="page-note">
                        {done ? note : "Halaman hari ini masih kosong"}
                      </p>
                      <p className="page-sub">
                        {done ? `${list.length}x nabung` : "ketuk untuk mengisi"}
                      </p>
                    </div>
                    {done ? (
                      <>
                        <span className="page-amt">{fmt(sum)}</span>
                        <span className="page-check">
                          <svg aria-hidden="true">
                            <use href="#d-check" />
                          </svg>
                        </span>
                      </>
                    ) : (
                      <span className="page-add">
                        <svg aria-hidden="true">
                          <use href="#d-plus" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              }

              if (isFuture) {
                return (
                  <div key={dKey} className="page page--future">
                    <span className="page-tab" />
                    {dateBlock}
                    <div className="page-body">
                      <p className="page-note">Belum waktunya</p>
                      <p className="page-sub">halaman menunggu</p>
                    </div>
                  </div>
                );
              }

              if (list.length) {
                const isLav = list.every((e) => e.g === "iphone");
                const note = list.find((e) => e.n)?.n || "nabung tanpa catatan";
                const goalsSet = [
                  ...new Set(list.map((e) => GOALS[e.g]?.short)),
                ].join(" & ");
                return (
                  <div key={dKey} className="page">
                    <span
                      className={`page-tab ${isLav ? "page-tab--lav" : ""}`}
                    />
                    {dateBlock}
                    <div className="page-body">
                      <p className="page-note">{note}</p>
                      <p className="page-sub">
                        {list.length}x ke {goalsSet}
                      </p>
                    </div>
                    <span className="page-amt">{fmt(sum)}</span>
                    <span className="page-check">
                      <svg aria-hidden="true">
                        <use href="#d-check" />
                      </svg>
                    </span>
                  </div>
                );
              }

              return (
                <div key={dKey} className="page">
                  <span className="page-tab" />
                  {dateBlock}
                  <div className="page-body">
                    <p className="page-note">Lewat begitu saja</p>
                    <p className="page-sub">tidak diisi</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Riwayat Lengkap */}
          <div className="sec-head">
            <h2 className="sec-title">Riwayat lengkap</h2>
          </div>
          <div className="hist">
            {historyList.length === 0 ? (
              <div className="empty">
                <strong>Belum ada catatan</strong>
                Isi halaman hari ini, riwayatnya mulai terbentuk.
              </div>
            ) : (
              historyList.map(([dKey, g]) => {
                const note = g.notes.length
                  ? g.notes.join(" · ")
                  : "nabung ke " +
                    [...g.goals].map((id) => GOALS[id]?.short).join(" & ");
                const onlyIphone = g.goals.size === 1 && g.goals.has("iphone");
                return (
                  <div key={dKey} className="row row--in">
                    <span
                      className={`row-stamp ${
                        onlyIphone ? "row-stamp--lav" : ""
                      }`}
                    >
                      <svg aria-hidden="true">
                        <use href="#d-heart-f" />
                      </svg>
                    </span>
                    <div className="row-body">
                      <p className="row-when">{dayLabel(dKey)}</p>
                      <p className="row-note">{note}</p>
                    </div>
                    <span className="row-amt">+{fmt(g.sum)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
