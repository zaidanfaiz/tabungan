"use client";

import { IconWallet, IconPlus } from "@/components/Icons";

export default function TopBar({ onOpenDeposit, onOpenNewGoal }) {
  return (
    <header className="app-topbar">
      <div className="topbar-inner">
        <div className="brand-group">
          <div className="brand-logo">
            <IconWallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="brand-title">Tabungan</h1>
            <p className="brand-subtitle">Smart Personal Finance &amp; Goals</p>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={onOpenNewGoal}
          >
            <IconPlus className="w-4 h-4 mr-1 inline" />
            <span>Target Baru</span>
          </button>
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={onOpenDeposit}
          >
            <IconPlus className="w-4 h-4 mr-1 inline" />
            <span>Catat Tabungan</span>
          </button>
        </div>
      </div>
    </header>
  );
}
