"use client";

import { useState, useEffect } from "react";
import { digits, today, fmt } from "@/lib/storage";
import { IconX } from "@/components/Icons";

const QUICK_AMOUNTS = [10_000, 25_000, 35_000, 50_000, 100_000];

export default function EntryModal({
  isOpen,
  initialEntry = null,
  defaultGoalId = "",
  goals = [],
  onClose,
  onSave,
}) {
  const [amount, setAmount] = useState("");
  const [goalId, setGoalId] = useState("");
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialEntry) {
      setAmount(initialEntry.a ? Number(initialEntry.a).toLocaleString("id-ID") : "");
      setGoalId(initialEntry.g || (goals[0]?.id || ""));
      setDate(initialEntry.d || today());
      setNote(initialEntry.n || "");
    } else {
      setAmount("35.000");
      setGoalId(defaultGoalId || (goals[0]?.id || ""));
      setDate(today());
      setNote("");
    }
    setError("");
  }, [initialEntry, defaultGoalId, goals, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAmountChange = (e) => {
    const raw = digits(e.target.value).slice(0, 14);
    const val = raw ? Number(raw) : 0;
    setAmount(val ? val.toLocaleString("id-ID") : "");
    if (error) setError("");
  };

  const handleSelectQuick = (amt) => {
    setAmount(amt.toLocaleString("id-ID"));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(digits(amount));
    if (!numAmount || numAmount < 1000) {
      setError("Nominal tabungan minimal Rp1.000.");
      return;
    }
    if (!goalId) {
      setError("Pilih target tabungan.");
      return;
    }

    onSave({
      id: initialEntry ? initialEntry.id : `entry-${Date.now()}`,
      a: numAmount,
      g: goalId,
      d: date || today(),
      n: note.trim() || null,
      createdAt: initialEntry ? initialEntry.createdAt : new Date().toISOString(),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-modal-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="entry-modal-title" className="modal-title">
              {initialEntry ? "Edit Catatan Tabungan" : "Catat Tabungan"}
            </h2>
            <p className="modal-subtitle">
              Pilih target tujuan dan masukkan nominal setoran.
            </p>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Tutup"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="alert-error" role="alert">{error}</div>}

          {/* Amount Input */}
          <div className="form-group">
            <label htmlFor="entry-amount" className="form-label">
              Nominal Tabungan (Rp) <span className="text-rose-500">*</span>
            </label>
            <div className="input-currency-wrap">
              <span className="input-prefix">Rp</span>
              <input
                id="entry-amount"
                type="text"
                inputMode="numeric"
                className="input-currency"
                placeholder="35.000"
                value={amount}
                onChange={handleAmountChange}
                autoFocus
              />
            </div>
            {/* Quick chips */}
            <div className="chips-row">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className={`chip-btn ${digits(amount) === String(amt) ? "is-active" : ""}`}
                  onClick={() => handleSelectQuick(amt)}
                >
                  +{fmt(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Selector */}
          <div className="form-group">
            <label htmlFor="entry-goal" className="form-label">
              Target Tabungan <span className="text-rose-500">*</span>
            </label>
            <select
              id="entry-goal"
              className="input-select"
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
            >
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} (Terkumpul {fmt(g.saved)} dari {fmt(g.target)})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Note in 2 Columns */}
          <div className="grid-2-col">
            <div className="form-group">
              <label htmlFor="entry-date" className="form-label">
                Tanggal
              </label>
              <input
                id="entry-date"
                type="date"
                className="input-text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="entry-note" className="form-label">
                Catatan (Opsional)
              </label>
              <input
                id="entry-note"
                type="text"
                className="input-text"
                placeholder="Contoh: Uang saku, Tabungan mingguan"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={onClose}
            >
              Batal
            </button>
            <button type="submit" className="btn-primary btn-sm">
              {initialEntry ? "Simpan Perubahan" : "Simpan Setoran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
