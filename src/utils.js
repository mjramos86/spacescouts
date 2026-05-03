// ── General helpers ────────────────────────────────────────────────────────
export const deepClone = (o) => JSON.parse(JSON.stringify(o))
export const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
export const dist = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

// ── Combat math ────────────────────────────────────────────────────────────
export function calcDamage(atk, def, mult = 1.0) {
  const base = (typeof atk === 'object' ? atk.atk : atk) * mult
  const defVal = typeof def === 'object' ? def.def : def
  const reduction = defVal / (defVal + 60)
  return Math.max(1, Math.round(base * (1 - reduction) * (0.88 + Math.random() * 0.24)))
}

// ── HP colour (green → yellow → red) ──────────────────────────────────────
export function hpColor(pct) {
  if (pct > 0.55) return '#00e87a'
  if (pct > 0.28) return '#ffcc00'
  return '#ff3355'
}
