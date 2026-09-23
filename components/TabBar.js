"use client";

import { IconWallet, IconTrendingUp, IconCalendar } from "@/components/Icons";

export default function TabBar({ activeTab, onSelectTab, goalCount = 0, entryCount = 0 }) {
  const tabs = [
    { id: "overview", label: "Ringkasan", icon: IconTrendingUp },
    { id: "goals", label: "Target Impian", icon: IconWallet, badge: goalCount },
    { id: "history", label: "Riwayat Transaksi", icon: IconCalendar, badge: entryCount },
  ];

  return (
    <nav className="segment-nav-container" aria-label="Navigasi Menu">
      <div className="segment-nav">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              className={`segment-tab ${isActive ? "is-active" : ""}`}
              onClick={() => onSelectTab(t.id)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.badge > 0 && (
                <span className={`tab-badge ${isActive ? "tab-badge-active" : ""}`}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
