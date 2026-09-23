export default function TabBar({ activeTab, onSelectTab }) {
  const tabs = [
    { id: "home", label: "Beranda", icon: "#d-home" },
    { id: "journey", label: "Catatan", icon: "#d-book" },
    { id: "dreams", label: "Impian", icon: "#d-bow" },
  ];

  return (
    <nav className="tabbar" aria-label="Navigasi utama">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            className={`tab ${isActive ? "is-active" : ""}`}
            type="button"
            onClick={() => onSelectTab(t.id)}
            aria-current={isActive ? "page" : undefined}
          >
            <svg aria-hidden="true">
              <use href={t.icon} />
            </svg>
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
