import { useState } from 'react'
import { HpBar, EnBar } from '../components/HpBar'
import { clamp } from '../utils'

export default function CharacterScreen({ gs }) {
  const [tab, setTab] = useState('captain')

  const tabs = [
    { id: 'captain', icon: '🧑‍🚀', name: 'CAPTAIN' },
    { id: 'ship',    icon: '🚀',   name: 'SHIP' },
    ...gs.robots.map(r => ({
      id: r.id,
      icon: r.id === 'bolt' ? '🤖' : '🦾',
      name: r.name.toUpperCase(),
    })),
  ]

  const unit =
    tab === 'captain' ? gs.captain :
    tab === 'ship'    ? gs.ship    :
    gs.robots.find(r => r.id === tab)

  const isShip = tab === 'ship'
  const xp     = unit.xp     ?? gs.captain.xp
  const xpNext = unit.xpNext ?? gs.captain.xpNext
  const xpPct  = clamp(xp / xpNext, 0, 1)

  return (
    <div className="screen">
      <div className="char-screen">
        {/* Tab nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 140, flexShrink: 0 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`cmd-btn${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
              style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span>{t.icon}</span><span>{t.name}</span>
            </button>
          ))}
        </div>

        {/* Detail card */}
        <div className="char-card">
          <div className="char-name">{unit.name}</div>
          <div className="char-sub">
            {isShip
              ? `${unit.type}  ·  Level ${unit.level}`
              : `${unit.cls || unit.arch}  ·  Level ${unit.level}`}
          </div>

          <div className="section-title">COMBAT STATS</div>
          <div className="stat-grid">
            {isShip ? (
              <>
                <div className="stat-row"><span className="stat-key">HULL HP</span>   <span className="stat-val">{unit.hp}/{unit.maxHp}</span></div>
                <div className="stat-row"><span className="stat-key">SHIELD</span>    <span className="stat-val">{unit.shield}/{unit.maxShield}</span></div>
                <div className="stat-row"><span className="stat-key">ATTACK</span>    <span className="stat-val">{unit.atk}</span></div>
                <div className="stat-row"><span className="stat-key">EVASION</span>   <span className="stat-val">{unit.eva}%</span></div>
                <div className="stat-row"><span className="stat-key">MOVE RNG</span>  <span className="stat-val">{unit.moveRange}</span></div>
                <div className="stat-row"><span className="stat-key">LEVEL</span>     <span className="stat-val">{unit.level}</span></div>
              </>
            ) : (
              <>
                <div className="stat-row"><span className="stat-key">HP</span>        <span className="stat-val">{unit.hp}/{unit.maxHp}</span></div>
                <div className="stat-row"><span className="stat-key">ENERGY</span>    <span className="stat-val">{unit.en}/{unit.maxEn}</span></div>
                <div className="stat-row"><span className="stat-key">ATTACK</span>    <span className="stat-val">{unit.atk}</span></div>
                <div className="stat-row"><span className="stat-key">DEFENSE</span>   <span className="stat-val">{unit.def}</span></div>
                <div className="stat-row"><span className="stat-key">SPEED</span>     <span className="stat-val">{unit.spd}</span></div>
                <div className="stat-row"><span className="stat-key">LUCK</span>      <span className="stat-val">{unit.luck}</span></div>
              </>
            )}
          </div>

          <div className="section-title">{isShip ? 'ABILITIES' : 'SKILLS'}</div>
          {(unit.skills || unit.abilities || []).map(sk => (
            <div key={sk.id} className="skill-card">
              <div className="skill-name">{sk.name}</div>
              <div className="skill-desc">{sk.desc}</div>
              <div className="skill-cost">
                {sk.cost  !== undefined ? `${sk.cost} EN`       : ''}
                {sk.range !== undefined ? `Range: ${sk.range}` : ''}
              </div>
            </div>
          ))}

          <div className="section-title" style={{ marginTop: 10 }}>EXPERIENCE</div>
          <div style={{ marginBottom: 4, fontFamily: 'var(--f3)', fontSize: 11, color: 'var(--muted)' }}>
            {xp.toLocaleString()} / {xpNext.toLocaleString()} XP
          </div>
          <div className="xp-bar-bg" style={{ height: 8 }}>
            <div className="xp-bar-fill" style={{ width: `${xpPct * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
