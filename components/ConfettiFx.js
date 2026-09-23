export default function ConfettiFx({ particles }) {
  return (
    <div className="fx" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            color: p.color,
            animationDelay: `${p.delay}ms`,
            "--sw1": `${p.sw1}px`,
            "--sw2": `${p.sw2}px`,
            "--rot": `${p.rot}deg`,
            "--rot2": `${p.rot2}deg`,
          }}
        >
          <svg viewBox="0 0 24 24">
            <use href={p.icon} />
          </svg>
        </span>
      ))}
    </div>
  );
}
