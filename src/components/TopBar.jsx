export default function TopBar({ gs, screen, onBack }) {
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {screen !== 'hub' && (
          <button
            className="btn btn-ghost"
            style={{ padding: '4px 10px', fontSize: 10 }}
            onClick={onBack}
          >
            ← HUB
          </button>
        )}
        <div className="topbar-logo">
          SPACE SCOUTS <span>PROTOTYPE v0.1</span>
        </div>
      </div>
      <div className="topbar-right">
        <div className="stat-pill">
          <span className="lbl">LV</span>
          <span className="val">{gs.captain.level}</span>
        </div>
        <div className="stat-pill">
          <span className="lbl">HP</span>
          <span className="val">{gs.captain.hp}/{gs.captain.maxHp}</span>
        </div>
        <div className="stat-pill">
          <span className="lbl">CREDITS</span>
          <span className="val">{gs.credits.toLocaleString()}</span>
        </div>
        <div className="stat-pill">
          <span className="lbl">CRYSTALS</span>
          <span className="val gold">{gs.crystals}</span>
        </div>
      </div>
    </div>
  )
}
