"use client";

import {
  GOALS,
  DAILY,
  MILESTONES,
  MESSAGES,
  HARI,
  BULAN,
  MINGGU,
} from "@/lib/constants";
import {
  fmt,
  fmtShort,
  pctOf,
  totalSaved,
  targetTotal,
  entriesOn,
  calculateStreak,
  key,
  today,
  shift,
  dayLabel,
} from "@/lib/storage";

export default function HomeScreen({
  state,
  onOpenSheet,
  onGoto,
  isSavedJustNow,
}) {
  const now = new Date();
  const tKey = today();
  const total = totalSaved(state.goals);
  const target = targetTotal();
  const pct = pctOf(total, target);
  const remaining = Math.max(0, target - total);
  const streakCount = calculateStreak(state.entries);

  // Motivational message based on day of month
  const msgIndex = Math.floor(now.getDate() / 3) % MESSAGES.length;
  const heroMsg = MESSAGES[msgIndex];

  // Current date formatted: e.g. "Rabu, 23 September 2026"
  const formattedDate = `${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`;

  // Week days starting from Monday
  const monday = shift(now, -((now.getDay() + 6) % 7));
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = shift(monday, i);
    const dKey = key(d);
    const list = entriesOn(state.entries, dKey);
    const isToday = dKey === tKey;
    const isFuture = d > now && !isToday;
    const sum = list.reduce((a, e) => a + e.a, 0);
    return { date: d, key: dKey, list, isToday, isFuture, sum };
  });

  // Recent 7 days for streak dots
  const last7 = state.entries.slice(0, 40);
  const streakDots = Array.from({ length: 7 }, (_, i) => {
    const k = key(shift(new Date(), -(6 - i)));
    return last7.some((e) => e.d === k);
  });

  // History grouped by date
  const groups = new Map();
  for (const e of state.entries) {
    if (!groups.has(e.d)) groups.set(e.d, { sum: 0, notes: [], goals: new Set() });
    const g = groups.get(e.d);
    g.sum += e.a;
    if (e.n) g.notes.push(e.n);
    g.goals.add(e.g);
  }
  const historyList = [...groups.entries()].slice(0, 5);

  return (
    <div className="pad">
      <div className="home-grid">
        {/* Left Column: Hero & Action Focus */}
        <div className="home-col-main">
          {/* Hero Card */}
          <article className="hero">
            <svg className="deco deco--spark" aria-hidden="true">
              <use href="#d-spark" />
            </svg>
            <svg className="deco deco--flower" aria-hidden="true">
              <use href="#d-flower" />
            </svg>
            <p className="hero-hi">
              Hi Tasha{" "}
              <svg className="hero-hi-heart" aria-hidden="true">
                <use href="#d-heart" />
              </svg>
            </p>
            <p className="hero-date">{formattedDate}</p>
            <p className="hero-amount">{fmt(total)}</p>
            <p className="hero-sub">
              dari total impian <strong>{fmt(target)}</strong>
            </p>

            <div
              className="prog"
              role="progressbar"
              aria-label="Progres menuju total impian"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
            >
              <div
                className="prog-fill prog-fill--ribbon"
                style={{ width: `${Math.min(100, pct)}%` }}
              >
                <svg className="prog-knob" aria-hidden="true">
                  <use href="#d-heart-f" />
                </svg>
              </div>
            </div>

            <div className="hero-meta">
              <span>{Math.round(pct)}% tercapai</span>
              <span>
                sisa <strong>{fmt(remaining)}</strong>
              </span>
            </div>

            <p className="hero-msg">{heroMsg}</p>
          </article>

          {/* Main Action CTA */}
          <div className="cta">
            <button
              className={`btn-save ${isSavedJustNow ? "is-done" : ""}`}
              type="button"
              onClick={() => onOpenSheet()}
            >
              <span className="btn-save-label">
                {isSavedJustNow ? (
                  <>
                    Tercatat, Tasha{" "}
                    <svg aria-hidden="true">
                      <use href="#d-check" />
                    </svg>
                  </>
                ) : (
                  <>
                    Nabung hari ini{" "}
                    <svg aria-hidden="true">
                      <use href="#d-heart" />
                    </svg>
                  </>
                )}
              </span>
              <span className="btn-save-amt">{fmt(DAILY)}</span>
            </button>
            <p className="cta-hint">ketuk untuk ganti jumlah &amp; pilih impian</p>
          </div>

          {/* Streak Line */}
          <div className="streakline">
            <svg className="streakline-flame" aria-hidden="true">
              <use href="#d-flame" />
            </svg>
            <p>
              {streakCount > 0 ? (
                <>
                  <strong>{streakCount}</strong> hari berturut-turut
                </>
              ) : (
                "belum ada streak, mulai dari hari ini ♡"
              )}
            </p>
            <div className="dots" aria-hidden="true">
              {streakDots.map((on, idx) => (
                <i key={idx} className={on ? "is-on" : ""} />
              ))}
            </div>
          </div>

          {/* Small Milestones */}
          <div className="sec-head sec-head--plain">
            <h2 className="sec-title">Milestone kecil</h2>
          </div>
          <div className="miles">
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
        </div>

        {/* Right Column: Goals, Week, & History */}
        <div className="home-col-side">
          {/* Impianmu Quick Section */}
          <div className="sec-head">
            <h2 className="sec-title">Impianmu</h2>
            <button
              className="link"
              type="button"
              onClick={() => onGoto("dreams")}
            >
              semua impian{" "}
              <svg aria-hidden="true">
                <use href="#d-arrow" />
              </svg>
            </button>
          </div>

          <div className="goals">
            {/* iPad */}
            <article className="goal">
              <div className="goal-art goal-art--peach">
                <svg aria-hidden="true">
                  <use href="#d-ipad" />
                </svg>
              </div>
              <div className="goal-body">
                <div className="goal-top">
                  <h3>{GOALS.ipad.name}</h3>
                  <span className="goal-pct">
                    {Math.round(pctOf(state.goals.ipad.saved, GOALS.ipad.target))}%
                  </span>
                </div>
                <p className="goal-target">{fmt(GOALS.ipad.target)}</p>
                <div
                  className="prog prog--sm"
                  role="progressbar"
                  aria-label={`Progres ${GOALS.ipad.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(
                    pctOf(state.goals.ipad.saved, GOALS.ipad.target)
                  )}
                >
                  <div
                    className="prog-fill prog-fill--peach"
                    style={{
                      width: `${Math.min(
                        100,
                        pctOf(state.goals.ipad.saved, GOALS.ipad.target)
                      )}%`,
                    }}
                  />
                </div>
                <div className="goal-foot">
                  <p className="goal-left">
                    sisa{" "}
                    <strong>
                      {fmt(Math.max(0, GOALS.ipad.target - state.goals.ipad.saved))}
                    </strong>
                  </p>
                  <button
                    className="mini-btn"
                    type="button"
                    onClick={() => onOpenSheet("ipad")}
                  >
                    nabung{" "}
                    <svg aria-hidden="true">
                      <use href="#d-heart" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>

            {/* iPhone */}
            <article className="goal">
              <div className="goal-art goal-art--lav">
                <svg aria-hidden="true">
                  <use href="#d-iphone" />
                </svg>
              </div>
              <div className="goal-body">
                <div className="goal-top">
                  <h3>{GOALS.iphone.name}</h3>
                  <span className="goal-pct">
                    {Math.round(pctOf(state.goals.iphone.saved, GOALS.iphone.target))}%
                  </span>
                </div>
                <p className="goal-target">{fmt(GOALS.iphone.target)}</p>
                <div
                  className="prog prog--sm"
                  role="progressbar"
                  aria-label={`Progres ${GOALS.iphone.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(
                    pctOf(state.goals.iphone.saved, GOALS.iphone.target)
                  )}
                >
                  <div
                    className="prog-fill prog-fill--lav"
                    style={{
                      width: `${Math.min(
                        100,
                        pctOf(state.goals.iphone.saved, GOALS.iphone.target)
                      )}%`,
                    }}
                  />
                </div>
                <div className="goal-foot">
                  <p className="goal-left">
                    sisa{" "}
                    <strong>
                      {fmt(
                        Math.max(0, GOALS.iphone.target - state.goals.iphone.saved)
                      )}
                    </strong>
                  </p>
                  <button
                    className="mini-btn"
                    type="button"
                    onClick={() => onOpenSheet("iphone")}
                  >
                    nabung{" "}
                    <svg aria-hidden="true">
                      <use href="#d-heart" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Minggu ini */}
          <div className="sec-head">
            <h2 className="sec-title">Minggu ini</h2>
            <button
              className="link"
              type="button"
              onClick={() => onGoto("journey")}
            >
              buka catatan{" "}
              <svg aria-hidden="true">
                <use href="#d-arrow" />
              </svg>
            </button>
          </div>

          <div className="week">
            {weekDays.map((w, idx) => {
              let cls = "day";
              if (w.isFuture) cls += " day--future";
              else if (w.list.length) cls += " day--done";
              if (w.isToday) cls += " day--today";

              let status = null;
              if (w.list.length) {
                status = (
                  <>
                    <svg aria-hidden="true">
                      <use href="#d-check" />
                    </svg>
                    <b>{fmtShort(w.sum)}</b>
                  </>
                );
              } else if (w.isToday) {
                status = "isi ♡";
              }

              const inner = (
                <>
                  <span className="day-k">{MINGGU[idx]}</span>
                  <span className="day-n">{w.date.getDate()}</span>
                  <span className="day-s">{status}</span>
                </>
              );

              return w.isToday ? (
                <button
                  key={w.key}
                  className={cls}
                  type="button"
                  onClick={() => onOpenSheet()}
                  aria-label="Isi halaman hari ini"
                >
                  {inner}
                </button>
              ) : (
                <div key={w.key} className={cls}>
                  {inner}
                </div>
              );
            })}
          </div>

          {/* Riwayat terakhir */}
          <div className="sec-head">
            <h2 className="sec-title">Riwayat terakhir</h2>
            <button
              className="link"
              type="button"
              onClick={() => onGoto("journey")}
            >
              lihat semua{" "}
              <svg aria-hidden="true">
                <use href="#d-arrow" />
              </svg>
            </button>
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
