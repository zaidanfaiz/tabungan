"use client";

import {
  fmt,
  pctOf,
  totalSavedAll,
  targetTotalAll,
  calculateStreak,
  formatDateShort,
} from "@/lib/storage";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconArrowRight,
  IconCalendar,
  IconCheck,
} from "@/components/Icons";

export default function HomeScreen({
  goals = [],
  entries = [],
  onOpenDeposit,
  onOpenNewGoal,
  onEditGoal,
  onDeleteGoal,
  onEditEntry,
  onDeleteEntry,
  onNavigateTab,
}) {
  const totalSaved = totalSavedAll(goals);
  const totalTarget = targetTotalAll(goals);
  const globalPct = pctOf(totalSaved, totalTarget);
  const remaining = Math.max(0, totalTarget - totalSaved);
  const streak = calculateStreak(entries);

  const recentEntries = entries.slice(0, 5);

  // If empty, render an intimate, lovely onboarding screen for Tasha
  if (goals.length === 0) {
    return (
      <div className="view-container">
        <div className="welcome-journal-card">
          <div className="welcome-badge">
            <span>Diari Tabungan Tasha ♡</span>
          </div>

          <h2 className="welcome-title">Hai Tasha, Apa Impianmu Hari Ini?</h2>
          <p className="welcome-desc">
            Buku catatan impian kecil milik Tasha. Tuliskan apa saja impian yang ingin Tasha wujudkan, pasang foto impiannya, dan isi halamannya sedikit demi sedikit setiap hari.
          </p>

          <div className="welcome-actions">
            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={onOpenNewGoal}
            >
              <IconPlus className="w-3.5 h-3.5 mr-1.5 inline" /> Buat Impian Pertama Tasha ♡
            </button>
          </div>

          <div className="welcome-features-grid">
            <div className="feature-pill">
              <span className="feature-dot bg-rose-400" />
              <div>
                <p className="font-semibold text-slate-800 text-xs">Impian &amp; Foto</p>
                <p className="text-[11px] text-slate-500">Pasang foto barang idaman Tasha</p>
              </div>
            </div>

            <div className="feature-pill">
              <span className="feature-dot bg-amber-400" />
              <div>
                <p className="font-semibold text-slate-800 text-xs">Target Fleksibel</p>
                <p className="text-[11px] text-slate-500">Edit nominal target kapan saja</p>
              </div>
            </div>

            <div className="feature-pill">
              <span className="feature-dot bg-emerald-400" />
              <div>
                <p className="font-semibold text-slate-800 text-xs">Pelan &amp; Pasti</p>
                <p className="text-[11px] text-slate-500">Sedikit tiap hari jadi besar diam-diam</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-container">
      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card metric-card-hero">
          <div className="flex items-center justify-between">
            <p className="metric-label">Tabungan Terkumpul Tasha</p>
            <span className="text-xs text-rose-200 font-medium">Hi Tasha ♡</span>
          </div>
          <p className="metric-value metric-value-serif text-white">{fmt(totalSaved)}</p>
          <div className="metric-footer">
            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill bg-emerald-400"
                style={{ width: `${globalPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-200 mt-2 font-medium">
              <span>{Math.round(globalPct)}% tercapai</span>
              <span>Sisa {fmt(remaining)}</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <p className="metric-label text-slate-500">Total Impian Tasha</p>
          <p className="metric-value metric-value-serif text-slate-900">{fmt(totalTarget)}</p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Terbagi dalam <strong>{goals.length}</strong> impian manis
          </p>
        </div>

        <div className="metric-card">
          <p className="metric-label text-slate-500">Streak Konsistensi</p>
          <div className="flex items-baseline gap-1.5">
            <p className="metric-value metric-value-serif text-amber-700">{streak}</p>
            <span className="text-xs font-semibold text-slate-600">hari berturut-turut</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {streak > 0 ? "Keren banget Tasha, tetap semangat ya ♡" : "Yuk sisihkan sedikit tabungan hari ini ♡"}
          </p>
        </div>
      </div>

      {/* Main Grid: Goals Summary & Recent Activities */}
      <div className="home-dashboard-layout">
        {/* Left/Main Column: Active Goals */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Impian Tasha</h2>
              <p className="section-subtitle">Daftar impian yang sedang dikumpulkan pelan-pelan</p>
            </div>
            <button
              type="button"
              className="btn-link"
              onClick={() => onNavigateTab("goals")}
            >
              Semua ({goals.length}) <IconArrowRight className="w-3.5 h-3.5 ml-1 inline" />
            </button>
          </div>

          <div className="goals-cards-grid">
            {goals.slice(0, 4).map((g) => {
              const pct = pctOf(g.saved, g.target);
              const sisa = Math.max(0, g.target - g.saved);
              const isDone = g.saved >= g.target;

              return (
                <div key={g.id} className="goal-card">
                  {g.image && (
                    <div className="goal-photo-wrap">
                      <img src={g.image} alt={g.name} className="goal-photo" />
                      {isDone && (
                        <span className="goal-photo-tag-completed">
                          <IconCheck className="w-3 h-3 inline mr-1" /> Tercapai ♡
                        </span>
                      )}
                    </div>
                  )}

                  <div className="goal-card-body">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="badge-category">{g.category || "Impian"}</span>
                        <h3 className="goal-name">{g.name}</h3>
                      </div>
                      <div className="goal-actions-row">
                        <button
                          type="button"
                          className="btn-action-icon"
                          title="Edit Target & Foto"
                          onClick={() => onEditGoal(g)}
                        >
                          <IconPencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="btn-action-icon btn-action-danger"
                          title="Hapus Target"
                          onClick={() => onDeleteGoal(g)}
                        >
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="goal-amount-row">
                      <div>
                        <p className="text-[11px] text-slate-400">Terkumpul</p>
                        <p className="text-sm font-bold text-slate-900">{fmt(g.saved)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-slate-400">Target</p>
                        <p className="text-xs font-semibold text-slate-600">{fmt(g.target)}</p>
                      </div>
                    </div>

                    <div className="progress-bar-wrap">
                      <div
                        className={`progress-bar-fill ${isDone ? "bg-emerald-500" : "bg-emerald-600"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="goal-card-footer">
                      <span className="text-[11.5px] text-slate-500 font-medium">
                        {Math.round(pct)}% {isDone ? "Selesai ♡" : `(Sisa ${fmt(sisa)})`}
                      </span>
                      <button
                        type="button"
                        className="btn-primary btn-xs"
                        onClick={() => onOpenDeposit(g.id)}
                      >
                        <IconPlus className="w-3 h-3 mr-1 inline" /> Nabung ♡
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right/Side Column: Recent Transactions */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Catatan Harian</h2>
              <p className="section-subtitle">Halaman tabungan terakhir Tasha</p>
            </div>
            <button
              type="button"
              className="btn-link"
              onClick={() => onNavigateTab("history")}
            >
              Semua ({entries.length}) <IconArrowRight className="w-3.5 h-3.5 ml-1 inline" />
            </button>
          </div>

          {recentEntries.length === 0 ? (
            <div className="empty-box">
              <p className="font-semibold text-slate-700 text-xs">Belum ada catatan nabung</p>
              <p className="text-[11.5px] text-slate-500 mt-1">
                Catat setiap kali Tasha menabung, sekecil apa pun ♡
              </p>
              <button
                type="button"
                className="btn-secondary btn-xs mt-3"
                onClick={() => onOpenDeposit()}
              >
                <IconPlus className="w-3 h-3 mr-1 inline" /> Catat Sekarang
              </button>
            </div>
          ) : (
            <div className="recent-list">
              {recentEntries.map((e) => {
                const targetGoal = goals.find((g) => g.id === e.g);
                return (
                  <div key={e.id} className="transaction-item">
                    <div className="transaction-info">
                      <p className="transaction-title">
                        {targetGoal ? targetGoal.name : "Target Dihapus"}
                      </p>
                      <div className="transaction-meta">
                        <span className="flex items-center gap-1">
                          <IconCalendar className="w-3 h-3 text-slate-400" />
                          {formatDateShort(e.d)}
                        </span>
                        {e.n && <span>· {e.n}</span>}
                      </div>
                    </div>

                    <div className="transaction-amount-col">
                      <span className="transaction-amount">+{fmt(e.a)}</span>
                      <div className="transaction-actions">
                        <button
                          type="button"
                          className="btn-icon-subtle"
                          title="Edit Catatan"
                          onClick={() => onEditEntry(e)}
                        >
                          <IconPencil className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          className="btn-icon-subtle text-red-500 hover:text-red-700"
                          title="Hapus Catatan"
                          onClick={() => onDeleteEntry(e)}
                        >
                          <IconTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
