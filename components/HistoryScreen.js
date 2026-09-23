"use client";

import { useState, useMemo } from "react";
import { fmt, formatDateFull, formatDateShort } from "@/lib/storage";
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
          <h2 className="view-title">Riwayat Transaksi Tabungan</h2>
          <p className="view-subtitle">
            Catatan detail uang yang kamu sisihkan beserta catatan sumber dan tujuan impian.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => onOpenDeposit()}
        >
          <IconPlus className="w-4 h-4 mr-1.5 inline" /> Catat Tabungan
        </button>
      </div>

      {/* Filter and Summary Bar */}
      <div className="history-filter-bar">
        <div className="flex items-center gap-2">
          <IconFilter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Filter Tujuan:
          </span>
          <select
            className="input-select input-select-sm"
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
          >
            <option value="all">Semua Target Impian ({entries.length})</option>
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
          <span className="font-bold text-slate-900">{fmt(totalFilteredSum)}</span>
        </div>
      </div>

      {/* Transactions Feed */}
      {filteredEntries.length === 0 ? (
        <div className="empty-box py-12">
          <p className="font-semibold text-slate-700 text-base">Belum ada riwayat transaksi</p>
          <p className="text-sm text-slate-500 mt-1">
            {selectedGoal === "all"
              ? "Catat setoran tabungan pertamamu untuk mulai membangun kebiasaan finansial."
              : "Belum ada transaksi untuk target impian yang dipilih."}
          </p>
          <button
            type="button"
            className="btn-primary btn-sm mt-4"
            onClick={() => onOpenDeposit(selectedGoal !== "all" ? selectedGoal : "")}
          >
            <IconPlus className="w-4 h-4 mr-1 inline" /> Catat Tabungan Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedEntries.map(([dateStr, items]) => {
            const dailySum = items.reduce((acc, it) => acc + (Number(it.a) || 0), 0);
            return (
              <div key={dateStr} className="history-date-group">
                <div className="history-date-header">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <IconCalendar className="w-4 h-4 text-slate-400" />
                    <span>{formatDateFull(dateStr)}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Total: <strong className="text-slate-800 font-bold">+{fmt(dailySum)}</strong>
                  </span>
                </div>

                <div className="history-items-card">
                  {items.map((item) => {
                    const targetGoal = goals.find((g) => g.id === item.g);
                    return (
                      <div key={item.id} className="history-row">
                        <div className="history-row-main">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-900 text-sm">
                              {targetGoal ? targetGoal.name : "Target Dihapus"}
                            </span>
                            {targetGoal?.category && (
                              <span className="badge-category">
                                {targetGoal.category}
                              </span>
                            )}
                          </div>
                          {item.n ? (
                            <p className="text-xs text-slate-500 mt-0.5">{item.n}</p>
                          ) : (
                            <p className="text-xs text-slate-400 mt-0.5 italic">Tanpa catatan</p>
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
                              title="Edit Transaksi"
                              onClick={() => onEditEntry(item)}
                            >
                              <IconPencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="btn-icon-subtle text-red-500 hover:text-red-700"
                              title="Hapus Transaksi"
                              onClick={() => onDeleteEntry(item)}
                            >
                              <IconTrash className="w-4 h-4" />
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
