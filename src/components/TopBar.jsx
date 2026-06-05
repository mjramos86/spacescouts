import { CLASSES } from '../data'

export default function TopBar({ meta, screen, onBack }) {
  const cls = CLASSES[meta.cls] || CLASSES.vanguard
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {screen !== 'station' && (
          <button
            className="btn btn-ghost"
            style={{ padding: '4px 10px', fontSize: 10 }}
            onClick={onBack}
          >
            ← STATION
          </button>
        )}
        <div className="topbar-logo">
          SPACE SCOUTS <span>WORMHOLE RUN</span>
        </div>
      </div>
      <div className="topbar-right">
        <div className="stat-pill">
          <span className="lbl">CLASS</span>
          <span className="val">{cls.icon} {cls.name}</span>
        </div>
        <div className="stat-pill">
          <span className="lbl">BEST</span>
          <span className="val">D{meta.bestDepth}</span>
        </div>
        <div className="stat-pill">
          <span className="lbl">CREDITS</span>
          <span className="val">{meta.credits.toLocaleString()} ₢</span>
        </div>
        <div className="stat-pill">
          <span className="lbl">CRYSTALS</span>
          <span className="val gold">{meta.crystals} ◈</span>
        </div>
      </div>
    </div>
  )
}
