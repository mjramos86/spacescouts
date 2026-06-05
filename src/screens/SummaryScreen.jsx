import { SLOT_ORDER, RARITY, STAT_META } from '../data'
import { zoneForDepth } from '../game'

export default function SummaryScreen({ result, meta, newBest, onContinue }) {
  const reached = result.reached || 1
  const zone = zoneForDepth(reached)

  return (
    <div className="summary float-in">
      <div className="summary-banner" style={{ color: result.retreated ? 'var(--cyan)' : 'var(--red)' }}>
        {result.retreated ? 'RETREAT SUCCESSFUL' : 'SIGNAL LOST'}
      </div>
      <div className="summary-zone">Reached <b style={{ color: zone.accent }}>DEPTH {reached}</b> · {zone.name}</div>

      {newBest && <div className="summary-best">★ NEW PERSONAL BEST ★</div>}

      <div className="summary-box">
        <div className="summary-grid">
          <Stat label="DEPTH REACHED" val={`D${reached}`} />
          <Stat label="ENEMIES DOWNED" val={result.kills} />
          <Stat label="CREDITS BANKED" val={`${result.creditsEarned.toLocaleString()} ₢`} gold />
          <Stat label="CREDIT BALANCE" val={`${meta.credits.toLocaleString()} ₢`} />
        </div>

        <div className="summary-loadout-title">FINAL LOADOUT</div>
        <div className="summary-loadout">
          {SLOT_ORDER.map((slot) => {
            const g = result.equipped?.[slot]
            const R = g ? RARITY[g.rarity] : null
            return (
              <div key={slot} className="sl-item" style={{ borderColor: R ? R.col : 'var(--b1)' }}>
                <span className="sl-icon">{g ? g.icon : '·'}</span>
                <div className="sl-text">
                  <div className="sl-name" style={{ color: R ? R.col : 'var(--dim)' }}>{g ? g.name : '— empty —'}</div>
                  {g && (
                    <div className="sl-stats">
                      {Object.entries(g.stats).map(([k, v]) => {
                        const m = STAT_META[k]
                        return <span key={k} className="sl-stat" style={{ color: m.col }}>{m.icon}{m.kind === 'rate' ? v.toFixed(2) : v}{m.kind === 'pct' ? '%' : ''}</span>
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button className="btn btn-gold summary-btn" onClick={onContinue}>RETURN TO STATION →</button>
      <div className="summary-tip">Spend your credits on permanent station upgrades, then dive deeper.</div>
    </div>
  )
}

function Stat({ label, val, gold }) {
  return (
    <div className="summary-stat">
      <div className="summary-stat-val" style={gold ? { color: 'var(--gold)' } : null}>{val}</div>
      <div className="summary-stat-label">{label}</div>
    </div>
  )
}
