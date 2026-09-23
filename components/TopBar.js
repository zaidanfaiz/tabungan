export default function TopBar() {
  return (
    <header className="topbar">
      <div className="brand">
        <svg className="brand-bow" aria-hidden="true">
          <use href="#d-bow" />
        </svg>
        <span className="brand-name">Tasha’s Little Savings</span>
      </div>
      <span className="avatar" aria-hidden="true">
        T
      </span>
    </header>
  );
}
