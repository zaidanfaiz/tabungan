"use client";

import { GOALS, DAILY } from "@/lib/constants";
import { fmt, pctOf, etaLabel, totalSaved, targetTotal } from "@/lib/storage";

export default function DreamsScreen({ state, onOpenSheet }) {
  const total = totalSaved(state.goals);
  const target = targetTotal();
  const totalRemaining = Math.max(0, target - total);
  const generalEta = etaLabel(totalRemaining);

  const dreamsList = [
    {
      id: "ipad",
      goal: GOALS.ipad,
      artClass: "dream-art--peach",
      fillClass: "prog-fill--peach",
      icon: "#d-ipad",
    },
    {
      id: "iphone",
      goal: GOALS.iphone,
      artClass: "dream-art--lav",
      fillClass: "prog-fill--lav",
      icon: "#d-iphone",
    },
  ];

  return (
    <div className="pad">
      <header className="scr-head">
        <h1>Impianmu</h1>
        <p>Dua benda, satu tabungan pelan-pelan</p>
      </header>

      <div className="dreams-grid">
        {dreamsList.map(({ id, goal, artClass, fillClass, icon }) => {
          const saved = state.goals[id]?.saved || 0;
          const pct = pctOf(saved, goal.target);
          const remaining = Math.max(0, goal.target - saved);
          const eta = etaLabel(remaining);

          return (
            <article key={id} className="dream">
              <div className={`dream-art ${artClass}`}>
                <svg aria-hidden="true">
                  <use href={icon} />
                </svg>
              </div>
              <div className="dream-body">
                <div className="goal-top">
                  <h2>{goal.name}</h2>
                  <span className="goal-pct">{Math.round(pct)}%</span>
                </div>
                <p className="dream-target">{fmt(goal.target)}</p>
                <div
                  className="prog"
                  role="progressbar"
                  aria-label={`Progres ${goal.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(pct)}
                >
                  <div
                    className={`prog-fill ${fillClass}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
                <div className="dream-grid">
                  <div>
                    <dt>terkumpul</dt>
                    <dd>{fmt(saved)}</dd>
                  </div>
                  <div>
                    <dt>sisa</dt>
                    <dd>{fmt(remaining)}</dd>
                  </div>
                </div>
                <p className="dream-eta">{eta}</p>
                <button
                  className="btn-line"
                  type="button"
                  onClick={() => onOpenSheet(id)}
                >
                  Nabung ke {goal.short}{" "}
                  <svg aria-hidden="true">
                    <use href="#d-heart" />
                  </svg>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Plan Card */}
      <article className="plan">
        <svg className="deco deco--star" aria-hidden="true">
          <use href="#d-star" />
        </svg>
        <p className="plan-k">rencana kecil</p>
        <p className="plan-line">
          Dengan <strong>{fmt(DAILY)}</strong> tiap hari, seluruh impian sekitar{" "}
          <strong>{generalEta}</strong>.
        </p>
        <p className="plan-sub">
          Tidak harus tiap hari. Yang penting halamannya tidak kosong terus.
        </p>
      </article>
    </div>
  );
}
