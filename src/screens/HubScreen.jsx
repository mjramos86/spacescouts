import { useState } from 'react'
import { HUB_PANELS } from '../data'

const NAVIGABLE = ['surface', 'space', 'character', 'ship', 'crew']

function XPBlock({ label, xp, xpNext, color }) {
  const pct = Math.round((xp / xpNext) * 100)
  return (
    <div className="xp-block">
      <div className="xp-label">
        <span style={{ fontFamily: 'var(--f1)', fontSize: 9, letterSpacing: '.1em', color: 'var(--dim)' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'var(--f3)', fontSize: 9, color: 'var(--muted)' }}>
          {xp.toLocaleString()} / {xpNext.toLocaleString()} XP
        </span>
      </div>
      <div className="xp-bar-bg">
        <div className={`xp-bar-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function HubScreen({ onNavigate, gs }) {
  const [hover, setHover] = useState(null)

  return (
    <div className="hub float-in">
      <div className="hub-header">
        <div className="hub-title">FRONTIER STATION</div>
        <div className="hub-sub">WORMHOLE ACTIVE · SECTOR 7-GAMMA · 3 CONTRACTS AVAILABLE</div>
      </div>

      <div className="hub-grid">
        {HUB_PANELS.map(p => (
          <div
            key={p.id}
            className="hub-panel"
            onMouseEnter={() => setHover(p.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => NAVIGABLE.includes(p.id) && onNavigate(p.id)}
            style={{ opacity: NAVIGABLE.includes(p.id) ? 1 : 0.6 }}
          >
            <div className={`hub-panel-badge${p.active ? ' active' : ''}`}>{p.badge}</div>
            <div>
              <div className="hub-panel-icon">{p.icon}</div>
              <div className="hub-panel-name">{p.name}</div>
            </div>
            <div className="hub-panel-desc">{p.desc}</div>
          </div>
        ))}
      </div>

      <div className="hub-bottom">
        <XPBlock label="CAPTAIN XP" xp={gs.captain.xp} xpNext={gs.captain.xpNext} color="" />
        <XPBlock label="SHIP XP"    xp={gs.ship.xp}     xpNext={gs.ship.xpNext}    color="gold" />
        {gs.robots.map(r => (
          <XPBlock
            key={r.id}
            label={`${r.name} XP`}
            xp={Math.floor(gs.captain.xp * 0.7)}
            xpNext={3000}
            color=""
          />
        ))}
      </div>
    </div>
  )
}
