import { useState } from 'react'
import { CLASSES, CLASS_ORDER, UPGRADES, STAT_META } from '../data'
import { baseStats } from '../game'

function StatPreview({ meta }) {
  const b = baseStats(meta)
  const rows = [
    ['maxHp', b.maxHp], ['atk', b.atk], ['atkSpeed', b.atkSpeed.toFixed(2) + '/s'],
    ['armor', b.armor], ['maxShield', b.maxShield], ['shieldRegen', b.shieldRegen + '/s'],
    ['crit', b.crit + '%'], ['lifesteal', (b.lifesteal || 0) + '%'],
  ]
  return (
    <div className="stat-preview">
      {rows.map(([k, v]) => {
        const m = STAT_META[k]
        return (
          <div key={k} className="sp-row">
            <span className="sp-icon">{m.icon}</span>
            <span className="sp-label">{m.label}</span>
            <span className="sp-val" style={{ color: m.col }}>{v}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function StationScreen({ meta, setMeta, onJump }) {
  const [tab, setTab] = useState('crew') // crew | upgrades

  const chooseClass = (id) => setMeta((m) => ({ ...m, cls: id }))

  const buyUpgrade = (up) => {
    const lvl = meta.upgrades[up.id] || 0
    if (lvl >= up.max) return
    const cost = up.cost(lvl)
    if (meta.credits < cost) return
    setMeta((m) => ({
      ...m,
      credits: m.credits - cost,
      upgrades: { ...m.upgrades, [up.id]: lvl + 1 },
    }))
  }

  return (
    <div className="station float-in">
      <div className="station-header">
        <div>
          <div className="station-title">FRONTIER STATION</div>
          <div className="station-sub">SECTOR 7-GAMMA · WORMHOLE PRIMED · “It opens anywhere. How deep will you go?”</div>
        </div>
        <button className="btn btn-gold jump-btn" onClick={onJump}>
          ⟫ JUMP INTO THE WORMHOLE
        </button>
      </div>

      <div className="station-body">
        {/* Left: tabs + content */}
        <div className="station-main">
          <div className="seg">
            <button className={`seg-btn${tab === 'crew' ? ' on' : ''}`} onClick={() => setTab('crew')}>🧑‍🚀 SELECT SCOUT</button>
            <button className={`seg-btn${tab === 'upgrades' ? ' on' : ''}`} onClick={() => setTab('upgrades')}>⚙️ STATION UPGRADES</button>
          </div>

          {tab === 'crew' && (
            <div className="class-grid">
              {CLASS_ORDER.map((id) => {
                const c = CLASSES[id]
                const on = meta.cls === id
                return (
                  <div key={id} className={`class-card${on ? ' on' : ''}`} onClick={() => chooseClass(id)}>
                    <div className="class-icon">{c.icon}</div>
                    <div className="class-name">{c.name}</div>
                    <div className="class-captain">{c.captain}</div>
                    <div className="class-blurb">{c.blurb}</div>
                    <div className="class-ability">
                      <span className="ca-icon">{c.ability.icon}</span>
                      <div>
                        <div className="ca-name">{c.ability.name} <span className="ca-cd">CD {c.ability.cd}s</span></div>
                        <div className="ca-desc">{c.ability.desc}</div>
                      </div>
                    </div>
                    {on && <div className="class-selected">▶ ACTIVE SCOUT</div>}
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'upgrades' && (
            <div className="upgrade-grid">
              {UPGRADES.map((up) => {
                const lvl = meta.upgrades[up.id] || 0
                const maxed = lvl >= up.max
                const cost = maxed ? 0 : up.cost(lvl)
                const afford = meta.credits >= cost
                return (
                  <div key={up.id} className="upgrade-card">
                    <div className="up-top">
                      <span className="up-icon">{up.icon}</span>
                      <div className="up-name">{up.name}</div>
                      <div className="up-lvl">LV {lvl}/{up.max}</div>
                    </div>
                    <div className="up-desc">{up.desc}</div>
                    <div className="up-pips">
                      {Array.from({ length: up.max }).map((_, i) => (
                        <span key={i} className={`pip${i < lvl ? ' on' : ''}`} />
                      ))}
                    </div>
                    <button
                      className={`btn ${maxed ? 'btn-ghost' : afford ? 'btn-cyan' : 'btn-ghost'} up-buy`}
                      disabled={maxed || !afford}
                      onClick={() => buyUpgrade(up)}
                    >
                      {maxed ? 'MAXED' : `UPGRADE — ${cost} ₢`}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: live loadout preview */}
        <aside className="station-aside">
          <div className="aside-title">LOADOUT PREVIEW</div>
          <div className="aside-class">
            <span className="aside-class-icon">{CLASSES[meta.cls].icon}</span>
            <div>
              <div className="aside-class-name">{CLASSES[meta.cls].name}</div>
              <div className="aside-class-cap">{CLASSES[meta.cls].captain}</div>
            </div>
          </div>
          <StatPreview meta={meta} />
          <div className="aside-stats-foot">
            Every dive starts with basic gear. Swipe loot mid-run to rebuild your stats on the fly.
          </div>
          <div className="aside-record">
            <div><span>RUNS</span><b>{meta.totalRuns}</b></div>
            <div><span>KILLS</span><b>{meta.totalKills}</b></div>
            <div><span>BEST</span><b>D{meta.bestDepth}</b></div>
          </div>
        </aside>
      </div>
    </div>
  )
}
