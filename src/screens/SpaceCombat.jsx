import { useState, useRef, useEffect, useCallback } from 'react'
import { deepClone, rand, clamp, dist, calcDamage, hpColor } from '../utils'
import { SPACE_ENEMIES_INIT, GRID_W, GRID_H, ZONE_MAP, ZONES, LOOT_POOL } from '../data'
import { HpBar } from '../components/HpBar'

export default function SpaceCombat({ gs, onComplete }) {
  const [ship, setShip] = useState({
    ...deepClone(gs.ship), pos: { x: 1, y: 2 }, hasMoved: false, hasAttacked: false,
  })
  const [enemies,          setEnemies]         = useState(deepClone(SPACE_ENEMIES_INIT))
  const [phase,            setPhase]           = useState('player-select')
  const [selectedAbility,  setSelectedAbility] = useState(null)
  const [moveTargets,      setMoveTargets]     = useState([])
  const [atkTargets,       setAtkTargets]      = useState([])
  const [log,              setLog]             = useState(['🚀 Tactical combat initiated. Select your ship.'])
  const [hovCell,          setHovCell]         = useState(null)
  const [shipCharges,      setShipCharges]     = useState({ a1: 99, a2: 2, a3: 1 })

  const logRef = useRef(null)
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = 0 }, [log])
  const addLog = (msg) => setLog(p => [msg, ...p.slice(0, 30)])

  const liveEnemies = enemies.filter(e => e.hp > 0)

  const computeMoveTargets = useCallback((pos, range) => {
    const targets = []
    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        if (Math.abs(dx) + Math.abs(dy) <= range && (dx !== 0 || dy !== 0)) {
          const nx = pos.x + dx, ny = pos.y + dy
          if (nx >= 0 && nx < GRID_W && ny >= 0 && ny < GRID_H) {
            const blocked = enemies.find(e => e.hp > 0 && e.pos.x === nx && e.pos.y === ny)
            if (!blocked) targets.push({ x: nx, y: ny })
          }
        }
      }
    }
    return targets
  }, [enemies])

  const computeAtkTargets = useCallback((pos, range) =>
    enemies.filter(e => e.hp > 0 && dist(e.pos, pos) <= range).map(e => e.id)
  , [enemies])

  const selectShip = () => {
    if (phase !== 'player-select') return
    const zone = ZONE_MAP[ship.pos.y][ship.pos.x]
    const range = Math.max(0, ship.moveRange - (zone === 4 ? 1 : 0))
    setMoveTargets(!ship.hasMoved ? computeMoveTargets(ship.pos, range) : [])
    setPhase('player-move')
    addLog(`ISS Renegade selected. Move range: ${range}.`)
  }

  const moveShip = (x, y) => {
    if (phase !== 'player-move' || ship.hasMoved) return
    const zone = ZONE_MAP[y][x]
    if (zone === 5) {
      const dmg = Math.round(ship.maxHp * 0.05)
      setShip(s => ({ ...s, pos: { x, y }, hasMoved: true, hp: Math.max(1, s.hp - dmg) }))
      addLog(`⚠️ Debris Field! ISS Renegade takes ${dmg} hull damage!`)
    } else {
      setShip(s => ({ ...s, pos: { x, y }, hasMoved: true }))
      addLog(`ISS Renegade moves to (${x},${y}). ${ZONES[zone].fx ? 'Zone: ' + ZONES[zone].fx : ''}`)
    }
    setMoveTargets([])
    if (!ship.hasAttacked && selectedAbility) {
      setAtkTargets(computeAtkTargets({ x, y }, selectedAbility.range))
    }
    setPhase('player-attack')
  }

  const selectAbility = (ab) => {
    if (phase === 'end') return
    if (shipCharges[ab.id] <= 0) return
    setSelectedAbility(ab)
    if (ab.isMove) {
      setMoveTargets(computeMoveTargets(ship.pos, ship.moveRange + ab.moveBonus))
      setShipCharges(c => ({ ...c, [ab.id]: c[ab.id] - 1 }))
      setShip(s => ({ ...s, hasMoved: false }))
      setPhase('player-move')
      addLog(`🔥 Afterburner activated! Extended move range: ${ship.moveRange + ab.moveBonus}`)
    } else if (!ship.hasAttacked) {
      setAtkTargets(computeAtkTargets(ship.pos, ab.range))
      setPhase('player-attack')
      addLog(`⚡ ${ab.name} selected. Range: ${ab.range}. Select an enemy target.`)
    }
  }

  const attackEnemy = (enemyId) => {
    if (phase !== 'player-attack' || ship.hasAttacked || !selectedAbility) return
    const target = enemies.find(e => e.id === enemyId)
    if (!target || target.hp <= 0) return

    const zone      = ZONE_MAP[ship.pos.y][ship.pos.x]
    const ionStorm  = zone === 3
    if (ionStorm && Math.random() > 0.8) {
      addLog(`⚡ Ion Storm interference! ${selectedAbility.name} missed!`)
      setShip(s => ({ ...s, hasAttacked: true }))
      setShipCharges(c => ({ ...c, [selectedAbility.id]: Math.max(0, c[selectedAbility.id] - 1) }))
      setAtkTargets([]); setPhase('player-select')
      return
    }

    const nebulaZone = ZONE_MAP[target.pos.y][target.pos.x] === 1
    const evasion    = target.eva + (nebulaZone ? 15 : 0)
    if (Math.random() * 100 < evasion) {
      addLog(`💨 ${target.name} evaded ${selectedAbility.name}!`)
      setShip(s => ({ ...s, hasAttacked: true }))
      setShipCharges(c => ({ ...c, [selectedAbility.id]: Math.max(0, c[selectedAbility.id] - 1) }))
      setAtkTargets([]); setPhase('player-select')
      return
    }

    const dmg = calcDamage({ atk: ship.atk }, { def: 0 }, selectedAbility.dmgMult)
    const shieldDmg = Math.min(target.shield, dmg)
    const hullDmg   = dmg - shieldDmg

    const newEnemies = enemies.map(e =>
      e.id === enemyId
        ? { ...e, shield: Math.max(0, e.shield - shieldDmg), hp: Math.max(0, e.hp - hullDmg) }
        : e
    )
    setEnemies(newEnemies)
    setShipCharges(c => ({ ...c, [selectedAbility.id]: Math.max(0, c[selectedAbility.id] - 1) }))
    addLog(`💥 ${selectedAbility.name} hits ${target.name}! ${shieldDmg > 0 ? shieldDmg + ' shield + ' : ''}${hullDmg} hull damage!`)

    if (!newEnemies.some(e => e.hp > 0)) {
      setPhase('end'); addLog('🏆 All enemy ships destroyed! Victory!')
      setTimeout(() => onComplete({
        victory: true,
        xpGain: 600,
        loot: [LOOT_POOL[rand(2, LOOT_POOL.length - 1)]],
        credits: rand(500, 1200),
      }), 1800)
      return
    }
    setShip(s => ({ ...s, hasAttacked: true }))
    setAtkTargets([]); setPhase('player-select')
  }

  const endPlayerTurn = () => {
    if (phase === 'end') return
    setPhase('enemy-turn')
    setShip(s => ({ ...s, hasMoved: false, hasAttacked: false }))
    addLog('--- Enemy turn ---')

    let newEnemies = deepClone(enemies)
    let shipHp     = ship.hp
    let shipShield = ship.shield
    const messages = []

    for (const en of newEnemies.filter(e => e.hp > 0)) {
      const zone     = ZONE_MAP[en.pos.y][en.pos.x]
      const gravWell = zone === 4

      if (dist(en.pos, ship.pos) > 2) {
        const dx = Math.sign(ship.pos.x - en.pos.x)
        const dy = Math.sign(ship.pos.y - en.pos.y)
        const nx = clamp(en.pos.x + dx, 0, GRID_W - 1)
        const ny = clamp(en.pos.y + (dx === 0 ? dy : 0), 0, GRID_H - 1)
        const blocked = newEnemies.find(e2 => e2.id !== en.id && e2.hp > 0 && e2.pos.x === nx && e2.pos.y === ny)
        if (!blocked && (nx !== ship.pos.x || ny !== ship.pos.y)) {
          en.pos = { x: nx, y: ny }
        }
      }

      if (dist(en.pos, ship.pos) <= 2) {
        const dmg      = calcDamage(en, { def: 0 })
        const sAbsorb  = Math.min(shipShield, dmg)
        const hDmg     = dmg - sAbsorb
        shipShield = Math.max(0, shipShield - sAbsorb)
        shipHp     = Math.max(0, shipHp - hDmg)
        messages.push(`${en.name} fires! ${sAbsorb > 0 ? sAbsorb + ' shield + ' : ''}${hDmg} hull damage on ISS Renegade!`)
      }

      if (zone === 2 && en.shield < en.maxShield) {
        const regen = Math.round(en.maxShield * 0.1)
        en.shield = Math.min(en.maxShield, en.shield + regen)
        messages.push(`${en.name} recharges ${regen} shield in Asteroid Belt.`)
      }
    }

    setTimeout(() => {
      messages.forEach(m => addLog(m))
      setEnemies(newEnemies)
      setShip(s => ({ ...s, hp: shipHp, shield: shipShield }))
      if (shipHp <= 0) {
        setPhase('end'); addLog('💀 ISS Renegade destroyed. Mission failed.')
        setTimeout(() => onComplete({ victory: false }), 1500)
      } else {
        setPhase('player-select'); addLog('--- Your turn. Select your ship. ---')
        setSelectedAbility(null)
      }
    }, 600)
  }

  // ── GRID CELLS ─────────────────────────────────────────────────────────────
  const cells = []
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const zoneType    = ZONE_MAP[y][x]
      const zone        = ZONES[zoneType]
      const playerHere  = ship.pos.x === x && ship.pos.y === y
      const enemy       = enemies.find(e => e.hp > 0 && e.pos.x === x && e.pos.y === y)
      const isMoveTarget = moveTargets.some(t => t.x === x && t.y === y)
      const isAtkTarget  = enemy && atkTargets.includes(enemy.id)
      const isSelected   = playerHere && phase === 'player-move'

      cells.push(
        <div
          key={`${x}-${y}`}
          className={[
            'grid-cell',
            isMoveTarget ? 'move-target' : '',
            isAtkTarget  ? 'atk-target'  : '',
            isSelected   ? 'selected'    : '',
          ].filter(Boolean).join(' ')}
          style={{ background: zone.bg, borderColor: zoneType > 0 ? zone.border : 'var(--b1)' }}
          onMouseEnter={() => setHovCell({ x, y, zone })}
          onMouseLeave={() => setHovCell(null)}
          onClick={() => {
            if (isMoveTarget) moveShip(x, y)
            else if (isAtkTarget && enemy) attackEnemy(enemy.id)
            else if (playerHere && (phase === 'player-select' || phase === 'player-move')) selectShip()
          }}
        >
          {zoneType > 0 && (
            <span className="zone-label" style={{ color: zone.border }}>
              {zoneType === 6 ? '◎' : '·'}
            </span>
          )}
          {playerHere && (
            <div className="unit-icon" style={{ textShadow: '0 0 12px var(--cyan)' }}>
              🚀
              <div className="unit-hp-bar">
                <div className="unit-hp-fill" style={{
                  width: `${(ship.hp / ship.maxHp) * 100}%`,
                  background: hpColor(ship.hp / ship.maxHp),
                }} />
              </div>
            </div>
          )}
          {enemy && !playerHere && (
            <div className="unit-icon">
              {enemy.icon}
              <div className="unit-hp-bar">
                <div className="unit-hp-fill" style={{
                  width: `${(enemy.hp / enemy.maxHp) * 100}%`,
                  background: hpColor(enemy.hp / enemy.maxHp),
                }} />
              </div>
            </div>
          )}
        </div>
      )
    }
  }

  const phaseText = {
    'player-select': 'SELECT YOUR SHIP',
    'player-move':   ship.hasMoved ? 'ATTACK PHASE — SELECT ABILITY' : 'MOVE PHASE — SELECT DESTINATION',
    'player-attack': 'ATTACK PHASE — SELECT TARGET',
    'enemy-turn':    'ENEMY TURN — PROCESSING...',
    'end':           'BATTLE ENDED',
  }

  return (
    <div className="screen">
      <div className="space-combat">
        {/* Grid */}
        <div className="grid-wrap">
          <div className="grid-title">
            <span>⚔️ ORBITAL COMBAT — WORMHOLE EXIT</span>
          </div>
          <div className="phase-indicator">{phaseText[phase]}</div>

          <div className="grid-container" style={{
            gridTemplateColumns: `repeat(${GRID_W}, 1fr)`,
            gridTemplateRows:    `repeat(${GRID_H}, 1fr)`,
          }}>
            {cells}
          </div>

          {/* Zone legend */}
          <div className="zone-legend">
            {Object.entries(ZONES).filter(([k]) => Number(k) > 0).map(([k, z]) => (
              <div key={k} className="zone-legend-item">
                <div className="zone-dot" style={{ background: z.border }} />
                <span>{z.name}: <span style={{ color: z.border }}>{z.fx}</span></span>
              </div>
            ))}
          </div>
          {hovCell && (
            <div style={{ fontFamily: 'var(--f3)', fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
              ({hovCell.x},{hovCell.y}) — {hovCell.zone.name}{hovCell.zone.fx ? ` — ${hovCell.zone.fx}` : ''}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-sidebar">
          <div className="ss-panel">
            <div className="ss-panel-title">YOUR SHIP</div>
            <div className="ship-name">ISS RENEGADE</div>
            <div className="ship-type">Scout Frigate · Lv.{ship.level}</div>
            <HpBar cur={ship.hp} max={ship.maxHp} label="HP" />
            <div className="bar-row">
              <span className="bar-label" style={{ fontSize: 9, color: 'var(--dim)', width: 18 }}>SH</span>
              <div className="bar-bg">
                <div className="bar-fill" style={{
                  width: `${(ship.shield / ship.maxShield) * 100}%`,
                  background: 'linear-gradient(90deg,#004488,#4488ff)',
                }} />
              </div>
              <span className="bar-val">{ship.shield}/{ship.maxShield}</span>
            </div>

            <div style={{ marginTop: 6 }} className="ss-panel-title">ABILITIES</div>
            <div className="ability-list">
              {gs.ship.abilities.map(ab => (
                <button
                  key={ab.id}
                  className={`ability-btn${selectedAbility?.id === ab.id ? ' selected' : ''}`}
                  disabled={phase === 'enemy-turn' || phase === 'end' || ship.hasAttacked || shipCharges[ab.id] <= 0}
                  onClick={() => selectAbility({ ...ab })}
                >
                  <div className="ability-name">{ab.name}</div>
                  <div className="ability-desc">{ab.desc}</div>
                  <div className="ability-charges">
                    {ab.isMove
                      ? `Charges: ${shipCharges[ab.id]}`
                      : ab.maxCharges < 99
                        ? `Charges: ${shipCharges[ab.id]}/${ab.maxCharges}`
                        : `Range: ${ab.range}`}
                  </div>
                </button>
              ))}
            </div>

            {(ship.hasMoved || ship.hasAttacked) && phase !== 'enemy-turn' && phase !== 'end' && (
              <button className="btn btn-gold" style={{ width: '100%', marginTop: 8, padding: '6px' }} onClick={endPlayerTurn}>
                END TURN →
              </button>
            )}
            {phase === 'player-select' && !ship.hasMoved && !ship.hasAttacked && (
              <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8, padding: '6px', fontSize: 10 }} onClick={endPlayerTurn}>
                SKIP TURN
              </button>
            )}
          </div>

          {/* Enemy list */}
          <div className="ss-panel">
            <div className="ss-panel-title">ENEMY FLEET</div>
            <div className="enemy-list">
              {enemies.map(e => (
                <div key={e.id} className={`e-row${e.hp <= 0 ? ' dead' : ''}`}>
                  <div className="e-name">{e.icon} <span style={{ fontFamily: 'var(--f1)', fontSize: 10 }}>{e.name}</span></div>
                  <HpBar cur={e.hp} max={e.maxHp} />
                  <div className="bar-row">
                    <span className="bar-label" style={{ fontSize: 9, color: 'var(--dim)', width: 18 }}>SH</span>
                    <div className="bar-bg">
                      <div className="bar-fill" style={{
                        width: `${(e.shield / e.maxShield) * 100}%`,
                        background: 'linear-gradient(90deg,#002255,#2255aa)',
                      }} />
                    </div>
                    <span className="bar-val">{e.shield}/{e.maxShield}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Log */}
          <div className="ss-panel" style={{ flex: 1 }}>
            <div className="ss-panel-title">COMBAT LOG</div>
            <div className="space-log" ref={logRef}>
              {log.map((l, i) => (
                <div key={i} style={{
                  color: l.includes('hits') || l.includes('fires') ? 'var(--red)'
                       : l.includes('Victory') || l.includes('destroyed') ? 'var(--gold)'
                       : 'var(--muted)',
                }}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
