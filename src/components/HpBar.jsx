import { clamp, hpColor } from '../utils'

export function HpBar({ cur, max, label }) {
  const pct = clamp(cur / max, 0, 1)
  return (
    <div className="bar-row">
      {label && <span className="bar-label">{label}</span>}
      <div className="bar-bg">
        <div
          className="bar-fill"
          style={{ width: `${pct * 100}%`, background: hpColor(pct) }}
        />
      </div>
      <span className="bar-val">{cur}/{max}</span>
    </div>
  )
}

export function EnBar({ cur, max }) {
  const pct = clamp(cur / max, 0, 1)
  return (
    <div className="bar-row">
      <span className="bar-label">EN</span>
      <div className="bar-bg">
        <div className="bar-fill en-fill" style={{ width: `${pct * 100}%` }} />
      </div>
      <span className="bar-val">{cur}/{max}</span>
    </div>
  )
}
