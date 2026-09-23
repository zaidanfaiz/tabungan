export default function ToastContainer({ toasts }) {
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.isOut ? "is-out" : ""}`}
          dangerouslySetInnerHTML={{ __html: t.html }}
        />
      ))}
    </div>
  );
}
