"use client";

import { IconPlus } from "@/components/Icons";

export default function TopBar({ onOpenDeposit, onOpenNewGoal }) {
  return (
    <header className="app-topbar">
      <div className="topbar-inner">
        <div className="brand-group">
          <div className="brand-avatar">
            <span>T</span>
          </div>
          <div>
            <h1 className="brand-title">Tabungan Tasha</h1>
            <p className="brand-subtitle">Pencatatan target &amp; progres tabungan</p>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={onOpenNewGoal}
          >
            <IconPlus className="w-3.5 h-3.5 mr-1 inline" />
            <span>Target Baru</span>
          </button>
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={onOpenDeposit}
          >
            <IconPlus className="w-3.5 h-3.5 mr-1 inline" />
            <span>Nabung</span>
          </button>
        </div>
      </div>
    </header>
  );
}
