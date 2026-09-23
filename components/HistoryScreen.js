"use client";

import { useState, useMemo } from "react";
import { fmt, formatDateFull } from "@/lib/storage";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconCalendar,
  IconFilter,
} from "@/components/Icons";

export default function HistoryScreen({
  entries = [],
  goals = [],
  onOpenDeposit,
  onEditEntry,
  onDeleteEntry,
}) {
  const [selectedGoal, setSelectedGoal] = useState("all");

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (selectedGoal === "all") return true;
      return e.g === selectedGoal;
    });
  }, [entries, selectedGoal]);

  const totalFilteredSum = useMemo(() => {
    return filteredEntries.reduce((acc, e) => acc + (Number(e.a) || 0), 0);
  }, [filteredEntries]);

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups = new Map();
    for (const e of filteredEntries) {
      if (!groups.has(e.d)) groups.set(e.d, []);
      groups.get(e.d).push(e);
    }
    return [...groups.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filteredEntries]);

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <h2 className="view-title">Riwayat Tabungan</h2>
          <p className="view-subtitle">
            Daftar transaksi setoran tabungan yang telah dicatat.
          </p>
        </div>
        {goals.length > 0 && (
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => onOpenDeposit()}
          >
            <IconPlus className="w-3.5 h-3.5 mr-1 inline" /> Catat Tabungan
          </button>
        )}
      </div>

      {/* Filter and Summary Bar (only show if entries exist) */}
      {entries.length > 0 && (
        <div className="history-filter-bar">
          <div className="history-filter-controls">
            <IconFilter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">
              Filter Target:
            </span>
            <select
              className="input-select input-select-sm"
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
            >
              <option value="all">Semua Target ({entries.length})</option>
              {goals.map((g) => {
                const count = entries.filter((e) => e.g === g.id).length;
                return (
                  <option key={g.id} value={g.id}>
                    {g.name} ({count} transaksi)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="history-total-chip">
            <span className="text-xs text-slate-500">Total Periode Ini:</span>
            <span className="font-bold text-slate-900 text-sm">{fmt(totalFilteredSum)}</span>
          </div>
        </div>
      )}

      {/* Empty State when no entries at all */}
      {entries.length === 0 ? (
        <div className="empty-box py-12">
          <div className="empty-icon-wrap">
            <IconCalendar className="w-6 h-6 text-amber-700" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-3">Belum Ada Transaksi</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
            {goals.length === 0
              ? "Buat target tabungan terlebih dahulu sebelum mencatat setoran."
              : "Setiap setoran tabungan yang dicatat akan tersimpan di sini."}
          </p>
          {goals.length > 0 && (
            <button
              type="button"
              className="btn-primary btn-sm mt-4"
              onClick={() => onOpenDeposit()}
            >
              <IconPlus className="w-3.5 h-3.5 mr-1.5 inline" /> Catat Tabungan
            </button>
          )}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="empty-box py-10">
          <p className="font-semibold text-slate-700 text-sm">Tidak ada transaksi untuk target ini</p>
          <p className="text-xs text-slate-500 mt-1">
            Belum ada catatan setoran untuk target yang dipilih.
          </p>
          <button
            type="button"
            className="btn-secondary btn-xs mt-3"
            onClick={() => setSelectedGoal("all")}
          >
            Tampilkan Semua
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedEntries.map(([dateStr, items]) => {
            const dailySum = items.reduce((acc, it) => acc + (Number(it.a) || 0), 0);
            return (
              <div key={dateStr} className="history-date-group">
                <div className="history-date-header">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <IconCalendar className="w-4 h-4 text-slate-400" />
                    <span>{formatDateFull(dateStr)}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    Total: <strong className="text-slate-900 font-bold">+{fmt(dailySum)}</strong>
                  </span>
                </div>

                <div className="history-items-card">
                  {items.map((item) => {
                    const targetGoal = goals.find((g) => g.id === item.g);
                    return (
                      <div key={item.id} className="history-row">
                        <div className="history-row-main">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">
                              {targetGoal ? targetGoal.name : "Target Dihapus"}
                            </span>
                            {targetGoal?.category && (
                              <span className="badge-category">
                                {targetGoal.category}
                              </span>
                            )}
                          </div>
                          {item.n ? (
                            <p className="text-xs text-slate-600 mt-1 font-medium">{item.n}</p>
                          ) : (
                            <p className="text-xs text-slate-400 mt-1 italic">Tanpa catatan</p>
                          )}
                        </div>

                        <div className="history-row-actions">
                          <span className="history-row-amount">
                            +{fmt(item.a)}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              className="btn-icon-subtle"
                              title="Edit Catatan"
                              onClick={() => onEditEntry(item)}
                            >
                              <IconPencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="btn-icon-subtle text-red-500 hover:text-red-700"
                              title="Hapus Catatan"
                              onClick={() => onDeleteEntry(item)}
                            >
                              <IconTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
