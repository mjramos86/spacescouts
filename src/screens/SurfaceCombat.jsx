import { useState, useEffect, useRef, useCallback } from 'react'
import { deepClone, rand, calcDamage } from '../utils'
import { SURFACE_ENEMIES, LOOT_POOL } from '../data'
import { HpBar, EnBar } from '../components/HpBar'

function buildQueue(allies, enemies) {
  return [...allies, ...enemies].sort((a, b) => b.spd - a.spd)
}

export default function SurfaceCombat({ gs, onComplete }) {
  const initAllies = () => [
    { ...deepClone(gs.captain), icon: '🧑‍🚀' },
    ...gs.robots.map(r => ({ ...deepClone(r), icon: r.id === 'bolt' ? '🤖' : '🦾' })),
  ]

  const [allies,   setAllies]   = useState(initAllies)
  const [enemies,  setEnemies]  = useState(deepClone(SURFACE_ENEMIES))
  const [log,      setLog]      = useState([{ msg: '⚡ Mission start! Defeat all enemies.', type: 'info' }])
  const [phase,    setPhase]    = useState('action') // action | skill | end
  const [buffs,    setBuffs]    = useState({})
  const [shielded, setShielded] = useState({})
  const [turnIdx,  setTurnIdx]  = useState(0)
  const [flash,    setFlash]    = useState(null)
  const [healMode, setHealMode] = useState(false)
  const [pendingSkill, setPendingSkill] = useState(null)

  const logRef = useRef(null)
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [log])

  const addLog = (msg, type = 'info') =>
    setLog(p => [...p.slice(-40), { msg, type }])

  const queue       = buildQueue(allies, enemies)
  const currentUnit = queue[turnIdx % queue.length]
  const isPlayerTurn = allies.find(a => a.id === currentUnit?.id)
  const liveAllies  = allies.filter(a => a.hp > 0)
  const liveEnemies = enemies.filter(e => e.hp > 0)

  const tickBuffs = useCallback((b, sh, unitId) => {
    const nb = { ...b }
    if (nb[unitId]) { nb[unitId].turns--; if (nb[unitId].turns <= 0) delete nb[unitId] }
    const nsh = { ...sh }
    if (nsh[unitId]) { nsh[unitId]--; if (nsh[unitId] <= 0) delete nsh[unitId] }
    return [nb, nsh]
  }, [])

  const nextTurn = useCallback((a, e, b, sh) => {
    const q = buildQueue(a, e)
    let idx = 0
    for (let i = 1; i <= q.length; i++) {
      const u = q[(turnIdx + i) % q.length]
      const isAlly   = a.find(x => x.id === u.id)
      const isDead   = isAlly
        ? (a.find(x => x.id === u.id)?.hp ?? 0) <= 0
        : (e.find(x => x.id === u.id)?.hp ?? 0) <= 0
      if (!isDead) { idx = (turnIdx + i) % q.length; break }
    }
    setTurnIdx(idx)
    setPhase('action')
    setHealMode(false)
    setPendingSkill(null)
  }, [turnIdx])

  // Enemy AI
  const doEnemyTurn = useCallback((a, e, b, sh, unit) => {
    const la = a.filter(x => x.hp > 0)
    if (!la.length) return
    const target = la[Math.floor(Math.random() * la.length)]
    const defMult = (sh[target.id] ?? 0) > 0 ? 2.0 : 1.0
    const dmg = calcDamage(unit, { ...target, def: target.def * defMult })
    const newA = a.map(x => x.id === target.id ? { ...x, hp: Math.max(0, x.hp - dmg) } : x)
    setAllies(newA)
    setFlash(target.id); setTimeout(() => setFlash(null), 300)
    addLog(`${unit.name} attacks ${target.name} for ${dmg} damage!`, 'atk')

    if (!newA.some(x => x.hp > 0)) {
      setPhase('end')
      addLog('💀 Mission failed. All party members down.', 'win')
      setTimeout(() => onComplete({ victory: false }), 1500)
      return
    }
    const [nb, nsh] = tickBuffs(b, sh, unit.id)
    setBuffs(nb); setShielded(nsh)
    nextTurn(newA, e, nb, nsh)
  }, [nextTurn, tickBuffs, onComplete])

  // Trigger enemy turn
  useEffect(() => {
    if (phase !== 'action') return
    const enemy = enemies.find(e => e.id === currentUnit?.id)
    if (enemy && (enemy.hp ?? 0) > 0 && liveEnemies.length > 0 && liveAllies.length > 0) {
      const t = setTimeout(() => doEnemyTurn(allies, enemies, buffs, shielded, enemy), 800)
      return () => clearTimeout(t)
    }
    if (enemy && (enemy.hp ?? 0) <= 0) nextTurn(allies, enemies, buffs, shielded)
  }, [turnIdx, phase])

  // ── COMMANDS ────────────────────────────────────────────────────────────────
  const checkVictory = (newE) => {
    if (!newE.some(e => e.hp > 0)) {
      setPhase('end')
      addLog('✨ Victory! All enemies defeated!', 'win')
      const xpGain = SURFACE_ENEMIES.reduce((s, e) => s + e.xpVal, 0)
      const loot   = [LOOT_POOL[rand(0, LOOT_POOL.length - 1)]]
      setTimeout(() => onComplete({ victory: true, xpGain, loot, credits: rand(200, 600) }), 1500)
      return true
    }
    return false
  }

  const cmdAttack = () => {
    if (!isPlayerTurn) return
    const le = enemies.filter(e => e.hp > 0)
    if (!le.length) return
    const target  = le[Math.floor(Math.random() * le.length)]
    const atkBuff = buffs[currentUnit.id]?.atkPct ?? 0
    const dmg     = calcDamage({ atk: Math.round(currentUnit.atk * (1 + atkBuff)) }, target)
    const newE    = enemies.map(e => e.id === target.id ? { ...e, hp: Math.max(0, e.hp - dmg) } : e)
    setEnemies(newE)
    setFlash(`e_${target.id}`); setTimeout(() => setFlash(null), 300)
    addLog(`${currentUnit.name} attacks ${target.name} for ${dmg} damage!`, 'atk')
    if (checkVictory(newE)) return
    const [nb, nsh] = tickBuffs(buffs, shielded, currentUnit.id)
    setBuffs(nb); setShielded(nsh)
    nextTurn(allies, newE, nb, nsh)
  }

  const cmdDefend = () => {
    if (!isPlayerTurn) return
    addLog(`${currentUnit.name} takes a defensive stance!`, 'info')
    const [nb, nsh] = tickBuffs(buffs, shielded, currentUnit.id)
    setBuffs(nb)
    nextTurn(allies, enemies, nb, { ...nsh, [currentUnit.id]: 1 })
  }

  const cmdSkill = (skill) => {
    if (!isPlayerTurn) return
    const unit = currentUnit
    if (unit.en < skill.cost) { addLog('Not enough Energy!', 'info'); return }

    if (skill.type === 'atk') {
      const le  = enemies.filter(e => e.hp > 0)
      if (!le.length) return
      const target = le[Math.floor(Math.random() * le.length)]
      const dmg    = calcDamage(unit, target, skill.mult)
      const newE   = enemies.map(e => e.id === target.id ? { ...e, hp: Math.max(0, e.hp - dmg) } : e)
      const newA   = allies.map(a => a.id === unit.id ? { ...a, en: Math.max(0, a.en - skill.cost) } : a)
      setEnemies(newE); setAllies(newA)
      setFlash(`e_${target.id}`); setTimeout(() => setFlash(null), 300)
      addLog(`⚡ ${unit.name} uses ${skill.name}! Hits ${target.name} for ${dmg}!`, 'atk')
      if (checkVictory(newE)) return
      const [nb, nsh] = tickBuffs(buffs, shielded, unit.id)
      setBuffs(nb); setShielded(nsh)
      nextTurn(newA, newE, nb, nsh)

    } else if (skill.type === 'def') {
      const newA = allies.map(a => a.id === unit.id ? { ...a, en: Math.max(0, a.en - skill.cost) } : a)
      setAllies(newA)
      addLog(`🛡️ ${unit.name} activates ${skill.name}!`, 'info')
      const [nb, nsh] = tickBuffs(buffs, shielded, unit.id)
      nextTurn(newA, enemies, nb, { ...nsh, [unit.id]: 1 })

    } else if (skill.type === 'buff') {
      const newA  = allies.map(a => a.id === unit.id ? { ...a, en: Math.max(0, a.en - skill.cost) } : a)
      const nb2   = {}
      allies.forEach(a => { nb2[a.id] = { atkPct: skill.atkPct, turns: 2 } })
      setAllies(newA); setBuffs(b => ({ ...b, ...nb2 }))
      addLog(`💪 ${unit.name} uses ${skill.name}! Party ATK +${Math.round(skill.atkPct * 100)}% for 2 turns!`, 'info')
      const [nb, nsh] = tickBuffs(buffs, shielded, unit.id)
      nextTurn(newA, enemies, { ...nb, ...nb2 }, nsh)

    } else if (skill.type === 'heal' || skill.type === 'healEn') {
      setPendingSkill(skill)
      setHealMode(true)
      setPhase('skill')
    }
  }

  const doHeal = (targetId) => {
    const skill  = pendingSkill
    const healer = currentUnit
    const newA = allies.map(a => {
      if (a.id === targetId) {
        return skill.type === 'healEn'
          ? { ...a, en: Math.min(a.maxEn, a.en + skill.amount) }
          : { ...a, hp: Math.min(a.maxHp, a.hp + skill.amount) }
      }
      if (a.id === healer.id) return { ...a, en: Math.max(0, a.en - skill.cost) }
      return a
    })
    const tgt = allies.find(a => a.id === targetId)
    setAllies(newA)
    addLog(`💊 ${healer.name} uses ${skill.name} on ${tgt.name}! +${skill.amount} ${skill.type === 'healEn' ? 'EN' : 'HP'}`, 'heal')
    const [nb, nsh] = tickBuffs(buffs, shielded, healer.id)
    setBuffs(nb); setShielded(nsh)
    nextTurn(newA, enemies, nb, nsh)
  }

  return (
    <div className="screen">
      <div className="sc">
        <div className="sc-header">
          <div className="sc-title">🪐 SURFACE MISSION — DERELICT COLONY</div>
          <div className="sc-turn">
            TURN:{' '}
            <span style={{ color: 'var(--cyan)' }}>
              {isPlayerTurn
                ? currentUnit?.name?.toUpperCase()
                : `${currentUnit?.name?.toUpperCase()} (ENEMY)`}
            </span>
          </div>
        </div>

        <div className="sc-field">
          {/* Ally cards */}
          <div className="sc-allies">
            {allies.map(a => (
              <div
                key={a.id}
                className={[
                  'ally-card',
                  a.id === currentUnit?.id && isPlayerTurn ? 'active'       : '',
                  a.hp <= 0                               ? 'dead'         : '',
                  healMode && a.hp > 0                    ? 'heal-target'  : '',
                  flash === a.id                          ? 'hit'          : '',
                ].filter(Boolean).join(' ')}
                onClick={() => healMode && a.hp > 0 && doHeal(a.id)}
              >
                {a.id === currentUnit?.id && isPlayerTurn && <div className="active-indicator" />}
                <div className="ally-row">
                  <span className="ally-icon">{a.icon || '🤖'}</span>
                  <div>
                    <div className="ally-name">{a.name}</div>
                    <div className="ally-class">{a.cls || a.arch}</div>
                  </div>
                  {buffs[a.id] && (
                    <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--green)', fontFamily: 'var(--f3)' }}>ATK↑</span>
                  )}
                  {(shielded[a.id] ?? 0) > 0 && (
                    <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--cyan)', fontFamily: 'var(--f3)' }}>DEF↑</span>
                  )}
                </div>
                <HpBar cur={a.hp} max={a.maxHp} label="HP" />
                <EnBar cur={a.en} max={a.maxEn} />
              </div>
            ))}
          </div>

          {/* Arena */}
          <div className="sc-arena">
            <div className="sc-arena-bg" />
            <div className="sc-enemies">
              {enemies.map(e => (
                <div
                  key={e.id}
                  className={[
                    'enemy-card',
                    e.hp <= 0          ? 'dead'     : '',
                    flash === `e_${e.id}` ? 'hit'  : '',
                  ].filter(Boolean).join(' ')}
                >
                  <div className="enemy-icon">{e.icon}</div>
                  <div className="enemy-name">{e.name}</div>
                  <HpBar cur={e.hp} max={e.maxHp} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Command panel */}
        {phase !== 'end' && (
          <div className="cmd-panel">
            {!healMode ? (
              <>
                <div className="cmd-title">
                  {isPlayerTurn ? `▶ ${currentUnit?.name} — COMMAND` : '⏳ ENEMY TURN...'}
                </div>
                {isPlayerTurn && (
                  <>
                    <div className="cmd-row">
                      <button className="cmd-btn" onClick={cmdAttack} disabled={phase !== 'action'}>⚔ ATTACK</button>
                      <button className="cmd-btn" onClick={cmdDefend} disabled={phase !== 'action'}>🛡 DEFEND</button>
                      <button
                        className={`cmd-btn${phase === 'skill' ? ' active' : ''}`}
                        disabled={phase !== 'action' && phase !== 'skill'}
                        onClick={() => setPhase(p => p === 'skill' ? 'action' : 'skill')}
                      >⚡ SKILL</button>
                    </div>
                    {phase === 'skill' && (
                      <div className="skill-row">
                        {(currentUnit?.skills || []).map(sk => (
                          <button
                            key={sk.id}
                            className="skill-btn"
                            disabled={currentUnit.en < sk.cost}
                            onClick={() => cmdSkill(sk)}
                            title={sk.desc}
                          >
                            {sk.name} <span className="cost">({sk.cost} EN)</span>
                          </button>
                        ))}
                        <button className="skill-btn" onClick={() => setPhase('action')}>✕ Back</button>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <div className="cmd-title">SELECT HEAL TARGET ↓</div>
                <button className="skill-btn" onClick={() => { setHealMode(false); setPhase('action') }}>✕ Cancel</button>
              </>
            )}
          </div>
        )}

        {/* Combat log */}
        <div className="combat-log" ref={logRef}>
          {log.map((l, i) => (
            <div key={i} className={`log-line ${l.type}`}>{l.msg}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
