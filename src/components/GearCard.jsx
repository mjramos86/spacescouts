import { useState, useRef, useEffect, useCallback } from 'react'
import { RARITY, STAT_META } from '../data'
import { salvageValue } from '../game'

const THRESHOLD = 120 // px to commit a swipe

// Build comparison rows: every stat present on the new piece OR the current one.
function compareRows(gear, current) {
  const keys = new Set([
    ...Object.keys(gear.stats),
    ...Object.keys(current?.stats || {}),
  ])
  return [...keys].map((k) => {
    const nv = gear.stats[k] || 0
    const cv = current?.stats?.[k] || 0
    return { k, nv, cv, delta: Math.round((nv - cv) * 10) / 10 }
  })
}

export default function GearCard({ gear, current, meta, onDecide }) {
  const [drag, setDrag]   = useState({ x: 0, y: 0, active: false })
  const [leaving, setLeaving] = useState(null) // 'equip' | 'salvage' while animating out
  const start = useRef({ x: 0, y: 0 })
  const decided = useRef(false)

  const R = RARITY[gear.rarity]
  const sval = salvageValue(gear, meta)
  const rows = compareRows(gear, current)

  const commit = useCallback((decision) => {
    if (decided.current) return
    decided.current = true
    setLeaving(decision)
    setTimeout(() => onDecide(decision), 260)
  }, [onDecide])

  const onDown = (e) => {
    if (leaving) return
    const p = 'touches' in e ? e.touches[0] : e
    start.current = { x: p.clientX, y: p.clientY }
    setDrag({ x: 0, y: 0, active: true })
  }

  useEffect(() => {
    if (!drag.active) return
    const move = (e) => {
      const p = 'touches' in e ? e.touches[0] : e
      setDrag({ x: p.clientX - start.current.x, y: p.clientY - start.current.y, active: true })
    }
    const up = () => {
      setDrag((d) => {
        if (d.x > THRESHOLD)      commit('equip')
        else if (d.x < -THRESHOLD) commit('salvage')
        return { x: 0, y: 0, active: false }
      })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
  }, [drag.active, commit])

  // transform: follow finger while dragging, fling off-screen when leaving
  let tx = drag.x, rot = drag.x * 0.06
  if (leaving === 'equip')   { tx = 700;  rot = 22 }
  if (leaving === 'salvage') { tx = -700; rot = -22 }
  const transition = drag.active ? 'none' : 'transform .26s cubic-bezier(.22,1,.36,1)'

  // overlay hint strength
  const equipOp   = clamp01(drag.x / THRESHOLD)
  const salvageOp = clamp01(-drag.x / THRESHOLD)

  return (
    <div className="gearcard-stage">
      {/* swipe-direction hint rails */}
      <div className="swipe-rail left"  style={{ opacity: 0.25 + salvageOp * 0.6 }}>◀ SALVAGE</div>
      <div className="swipe-rail right" style={{ opacity: 0.25 + equipOp * 0.6 }}>EQUIP ▶</div>

      <div
        className="gearcard"
        style={{
          transform: `translate(${tx}px, ${drag.y * 0.25}px) rotate(${rot}deg)`,
          transition,
          borderColor: R.col,
          boxShadow: `0 0 0 1px ${R.col}55, 0 18px 50px rgba(0,0,0,.6), 0 0 40px ${R.col}33`,
        }}
        onPointerDown={onDown}
        onTouchStart={onDown}
      >
        {/* commit stamps */}
        <div className="stamp equip"   style={{ opacity: equipOp }}>EQUIP</div>
        <div className="stamp salvage" style={{ opacity: salvageOp }}>SALVAGE</div>

        <div className="gearcard-head" style={{ background: `linear-gradient(180deg, ${R.col}22, transparent)` }}>
          <span className="gearcard-icon">{gear.icon}</span>
          <div className="gearcard-titles">
            <div className="gearcard-name" style={{ color: R.col }}>{gear.name}</div>
            <div className="gearcard-slot">
              <span className="gearcard-rar" style={{ color: R.col, borderColor: R.col }}>{R.name}</span>
              {gear.slotName}
            </div>
          </div>
        </div>

        <div className="gearcard-stats">
          {rows.map(({ k, nv, delta }) => {
            const m = STAT_META[k]
            const fmt = (v) => (m.kind === 'rate' ? v.toFixed(2) : Math.round(v)) + (m.kind === 'pct' ? '%' : '')
            return (
              <div key={k} className="gc-stat">
                <span className="gc-stat-icon">{m.icon}</span>
                <span className="gc-stat-label">{m.label}</span>
                <span className="gc-stat-val" style={{ color: m.col }}>+{fmt(nv)}</span>
                <span className={`gc-stat-delta ${delta > 0 ? 'up' : delta < 0 ? 'down' : 'eq'}`}>
                  {delta > 0 ? '▲' : delta < 0 ? '▼' : '='}{delta !== 0 ? Math.abs(delta % 1 ? delta.toFixed(2) : delta) : ''}
                </span>
              </div>
            )
          })}
        </div>

        <div className="gearcard-foot">
          <span className="gc-vs">vs. equipped {current ? '' : '(empty slot)'}</span>
          <span className="gc-salvage">salvage ≈ <b>{sval} ₢</b></span>
        </div>
      </div>

      <div className="swipe-actions">
        <button className="swipe-btn salvage" onClick={() => commit('salvage')}>
          ◀ SALVAGE <span className="sb-sub">+{sval} ₢</span>
        </button>
        <button className="swipe-btn equip" onClick={() => commit('equip')}>
          EQUIP ▶ <span className="sb-sub">slot: {gear.slotName}</span>
        </button>
      </div>
      <div className="swipe-hint">drag the card — right to equip, left to salvage</div>
    </div>
  )
}

function clamp01(v) { return Math.max(0, Math.min(1, v)) }
