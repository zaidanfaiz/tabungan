"use client";

import { useState, useMemo } from "react";
import { fmt, pctOf, formatDateShort, daysBetween, today } from "@/lib/storage";
import { CATEGORIES } from "@/lib/constants";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconCalendar,
  IconCheck,
} from "@/components/Icons";

export default function GoalsScreen({
  goals = [],
  onOpenDeposit,
  onOpenNewGoal,
  onEditGoal,
  onDeleteGoal,
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      const matchCat = selectedCategory === "all" || g.category === selectedCategory;
      const matchSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [goals, selectedCategory, searchQuery]);

  return (
    <div className="view-container">
      {/* Header & Actions */}
      <div className="view-header">
        <div>
          <h2 className="view-title">Target Tabungan</h2>
          <p className="view-subtitle">
            Kelola nominal target, foto, dan pantau progres pencapaian.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary btn-sm"
          onClick={onOpenNewGoal}
        >
          <IconPlus className="w-3.5 h-3.5 mr-1 inline" /> Tambah Target
        </button>
      </div>

      {/* Filter and Search Bar (only show if goals exist) */}
      {goals.length > 0 && (
        <div className="filter-bar">
          <div className="filter-scroll">
            <button
              type="button"
              className={`filter-chip ${selectedCategory === "all" ? "is-active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              Semua ({goals.length})
            </button>
            {CATEGORIES.map((c) => {
              const count = goals.filter((g) => g.category === c.id).length;
              if (count === 0 && selectedCategory !== c.id) return null;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`filter-chip ${selectedCategory === c.id ? "is-active" : ""}`}
                  onClick={() => setSelectedCategory(c.id)}
                >
                  {c.label} ({count})
                </button>
              );
            })}
          </div>

          <input
            type="text"
            placeholder="Cari target..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Empty State when no goals at all */}
      {goals.length === 0 ? (
        <div className="empty-box py-12">
          <div className="empty-icon-wrap">
            <IconPlus className="w-6 h-6 text-amber-700" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-3">Belum Ada Target Tabungan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
            Mulai dengan membuat target pertama untuk memantau progres tabungan Tasha.
          </p>
          <button
            type="button"
            className="btn-primary btn-sm mt-4"
            onClick={onOpenNewGoal}
          >
            <IconPlus className="w-3.5 h-3.5 mr-1.5 inline" /> Tambah Target
          </button>
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="empty-box py-12">
          <p className="font-semibold text-slate-700 text-base">Tidak ada target yang cocok</p>
          <p className="text-sm text-slate-500 mt-1">
            {searchQuery
              ? `Tidak ditemukan target dengan kata kunci "${searchQuery}".`
              : "Belum ada target di kategori ini."}
          </p>
          <button
            type="button"
            className="btn-secondary btn-sm mt-4"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="goals-cards-grid">
          {filteredGoals.map((g) => {
            const pct = pctOf(g.saved, g.target);
            const sisa = Math.max(0, g.target - g.saved);
            const isCompleted = g.saved >= g.target;

            let deadlineInfo = null;
            if (g.deadline) {
              const diff = daysBetween(g.deadline, today());
              if (diff > 0) {
                deadlineInfo = `${diff} hari lagi`;
              } else if (diff === 0) {
                deadlineInfo = "Hari ini";
              } else {
                deadlineInfo = "Tenggat lewat";
              }
            }

            return (
              <div key={g.id} className={`goal-card ${isCompleted ? "goal-card-completed" : ""}`}>
                {/* Photo Preview if Available */}
                {g.image ? (
                  <div className="goal-photo-wrap">
                    <img src={g.image} alt={g.name} className="goal-photo" />
                    {isCompleted && (
                      <span className="goal-photo-tag-completed">
                        <IconCheck className="w-3.5 h-3.5 inline mr-1" /> Tercapai
                      </span>
                    )}
                  </div>
                ) : (
                  isCompleted && (
                    <div className="p-3 bg-emerald-50 border-b border-emerald-100 flex items-center text-xs font-semibold text-emerald-800">
                      <IconCheck className="w-4 h-4 mr-1.5 text-emerald-600" /> Target Tercapai!
                    </div>
                  )
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

                  {g.deadline && (
                    <div className="text-[11.5px] text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                      <IconCalendar className="w-3 h-3 text-slate-400" />
                      <span>Target: {formatDateShort(g.deadline)}</span>
                      {deadlineInfo && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                          {deadlineInfo}
                        </span>
                      )}
                    </div>
                  )}

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
                      className={`progress-bar-fill ${isCompleted ? "bg-emerald-500" : "bg-emerald-600"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="goal-card-footer">
                    <span className="text-[11.5px] text-slate-500 font-medium">
                      {Math.round(pct)}% {isCompleted ? "Selesai" : `(Sisa ${fmt(sisa)})`}
                    </span>
                    <button
                      type="button"
                      className="btn-primary btn-xs"
                      onClick={() => onOpenDeposit(g.id)}
                    >
                      <IconPlus className="w-3 h-3 mr-1 inline" /> Nabung
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
