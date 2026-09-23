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

  // Recent 5 entries
  const recentEntries = entries.slice(0, 5);

  return (
    <div className="view-container">
      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card metric-card-primary">
          <p className="metric-label text-slate-400">Total Tabungan Terkumpul</p>
          <p className="metric-value text-white">{fmt(totalSaved)}</p>
          <div className="metric-footer">
            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill bg-emerald-400"
                style={{ width: `${globalPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-300 mt-2">
              <span>{Math.round(globalPct)}% dari target</span>
              <span>Sisa {fmt(remaining)}</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <p className="metric-label text-slate-500">Target Keseluruhan</p>
          <p className="metric-value text-slate-900">{fmt(totalTarget)}</p>
          <p className="text-xs text-slate-500 mt-3">
            Tersebar di <strong>{goals.length}</strong> target impian aktif
          </p>
        </div>

        <div className="metric-card">
          <p className="metric-label text-slate-500">Streak Menabung</p>
          <div className="flex items-baseline gap-2">
            <p className="metric-value text-emerald-600">{streak}</p>
            <span className="text-sm font-semibold text-slate-600">hari berturut-turut</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            {streak > 0 ? "Pertahankan konsistensimu!" : "Mulai menabung hari ini untuk membangun streak."}
          </p>
        </div>
      </div>

      {/* Main Grid: Goals Summary & Recent Activities */}
      <div className="home-dashboard-layout">
        {/* Left/Main Column: Active Goals */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Target Impian</h2>
              <p className="section-subtitle">Daftar target yang sedang kamu kumpulkan</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-link"
                onClick={() => onNavigateTab("goals")}
              >
                Lihat Semua ({goals.length}) <IconArrowRight className="w-4 h-4 ml-1 inline" />
              </button>
            </div>
          </div>

          {goals.length === 0 ? (
            <div className="empty-box">
              <p className="font-semibold text-slate-700">Belum ada target impian</p>
              <p className="text-sm text-slate-500 mt-1">Mulai rencanakan impian masa depanmu sekarang.</p>
              <button
                type="button"
                className="btn-primary btn-sm mt-4"
                onClick={onOpenNewGoal}
              >
                <IconPlus className="w-4 h-4 mr-1 inline" /> Buat Target Pertama
              </button>
            </div>
          ) : (
            <div className="goals-cards-grid">
              {goals.slice(0, 4).map((g) => {
                const pct = pctOf(g.saved, g.target);
                const sisa = Math.max(0, g.target - g.saved);
                return (
                  <div key={g.id} className="goal-card">
                    {/* Optional Goal Photo */}
                    {g.image && (
                      <div className="goal-photo-wrap">
                        <img src={g.image} alt={g.name} className="goal-photo" />
                      </div>
                    )}

                    <div className="goal-card-body">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="badge-category">{g.category || "Umum"}</span>
                          <h3 className="goal-name">{g.name}</h3>
                        </div>
                        <div className="goal-actions-row">
                          <button
                            type="button"
                            className="btn-action-icon"
                            title="Edit Target"
                            onClick={() => onEditGoal(g)}
                          >
                            <IconPencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="btn-action-icon btn-action-danger"
                            title="Hapus Target"
                            onClick={() => onDeleteGoal(g)}
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="goal-amount-row">
                        <div>
                          <p className="text-xs text-slate-400">Terkumpul</p>
                          <p className="text-base font-bold text-slate-800">{fmt(g.saved)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Target</p>
                          <p className="text-sm font-semibold text-slate-600">{fmt(g.target)}</p>
                        </div>
                      </div>

                      <div className="progress-bar-wrap">
                        <div
                          className="progress-bar-fill bg-emerald-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="goal-card-footer">
                        <span className="text-xs text-slate-500 font-medium">
                          {Math.round(pct)}% (Sisa {fmt(sisa)})
                        </span>
                        <button
                          type="button"
                          className="btn-primary btn-xs"
                          onClick={() => onOpenDeposit(g.id)}
                        >
                          <IconPlus className="w-3.5 h-3.5 mr-1 inline" /> Nabung
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right/Side Column: Recent Transactions */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Riwayat Terakhir</h2>
              <p className="section-subtitle">Catatan setoran tabungan terbaru</p>
            </div>
            <button
              type="button"
              className="btn-link"
              onClick={() => onNavigateTab("history")}
            >
              Semua ({entries.length}) <IconArrowRight className="w-4 h-4 ml-1 inline" />
            </button>
          </div>

          {recentEntries.length === 0 ? (
            <div className="empty-box">
              <p className="font-semibold text-slate-700">Belum ada transaksi</p>
              <p className="text-sm text-slate-500 mt-1">Setoran pertama akan muncul di sini.</p>
              <button
                type="button"
                className="btn-secondary btn-sm mt-4"
                onClick={() => onOpenDeposit()}
              >
                <IconPlus className="w-4 h-4 mr-1 inline" /> Catat Tabungan
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
                        {targetGoal ? targetGoal.name : "Target Telah Dihapus"}
                      </p>
                      <div className="transaction-meta">
                        <span className="flex items-center gap-1">
                          <IconCalendar className="w-3.5 h-3.5 text-slate-400" />
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
                          <IconPencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="btn-icon-subtle text-red-500 hover:text-red-700"
                          title="Hapus Catatan"
                          onClick={() => onDeleteEntry(e)}
                        >
                          <IconTrash className="w-3.5 h-3.5" />
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
