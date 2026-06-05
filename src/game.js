// ══════════════════════════════════════════════════════════════════════════════
// GAME LOGIC — pure helpers for Space Scouts: Wormhole Run
// ══════════════════════════════════════════════════════════════════════════════
import {
  RARITY, RARITY_ORDER, CLASSES, SLOTS, SLOT_ORDER, STAT_ROLL, STAT_META,
  GEAR_NAMES, LEGENDARY_NAMES, ENEMIES, BOSSES, BOSS_INTERVAL, ZONES, UPGRADES,
} from './data'

// ── tiny utils ─────────────────────────────────────────────────────────────────
export const rand   = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
export const randf  = (a, b) => Math.random() * (b - a) + a
export const clamp  = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
export const pick   = (arr) => arr[Math.floor(Math.random() * arr.length)]
export const deepClone = (o) => JSON.parse(JSON.stringify(o))
export const round1 = (v) => Math.round(v * 10) / 10

// HP / shield bar colour (green → yellow → red)
export function hpColor(pct) {
  if (pct > 0.55) return '#00e87a'
  if (pct > 0.28) return '#ffcc00'
  return '#ff3355'
}

// ── ZONE for a given depth ─────────────────────────────────────────────────────
export function zoneForDepth(depth) {
  let z = ZONES[0]
  for (const cand of ZONES) if (depth >= cand.from) z = cand
  return z
}

// ── BASE STATS = class base + permanent upgrades ───────────────────────────────
export function baseStats(meta) {
  const cls = CLASSES[meta.cls] || CLASSES.vanguard
  const b = { ...cls.base }
  for (const up of UPGRADES) {
    const lvl = meta.upgrades?.[up.id] || 0
    if (lvl > 0 && up.apply) up.apply(b, lvl)
  }
  return b
}

// ── DERIVED STATS = base + sum of equipped gear ────────────────────────────────
// equipped is { weapon|armor|core|module : gearObj|null }
export function deriveStats(base, equipped) {
  const s = { ...base }
  for (const slot of SLOT_ORDER) {
    const g = equipped[slot]
    if (!g) continue
    for (const [stat, val] of Object.entries(g.stats)) {
      s[stat] = (s[stat] || 0) + val
    }
  }
  // sane floors / ceilings
  s.maxHp     = Math.max(1, Math.round(s.maxHp))
  s.atk       = Math.max(1, Math.round(s.atk))
  s.armor     = Math.max(0, Math.round(s.armor))
  s.maxShield = Math.max(0, Math.round(s.maxShield))
  s.shieldRegen = Math.max(0, round1(s.shieldRegen))
  s.atkSpeed  = clamp(round1(s.atkSpeed), 0.3, 5)
  s.crit      = clamp(Math.round(s.crit), 0, 90)
  s.lifesteal = clamp(Math.round(s.lifesteal || 0), 0, 80)
  return s
}

// ── RARITY ROLL (weighted, with a depth-driven luck bump toward rarer) ─────────
export function rollRarity(depth) {
  // gentle push toward better rarities the deeper you go
  const lift = clamp(depth * 0.5, 0, 18)
  const weights = RARITY_ORDER.map((r, i) => {
    const w = RARITY[r].weight
    return i === 0 ? Math.max(4, w - lift) : w + (i >= 2 ? lift * (i - 1) * 0.25 : 0)
  })
  const total = weights.reduce((a, b) => a + b, 0)
  let roll = Math.random() * total
  for (let i = 0; i < RARITY_ORDER.length; i++) {
    if ((roll -= weights[i]) <= 0) return RARITY_ORDER[i]
  }
  return 'common'
}

// ── GEAR GENERATION ────────────────────────────────────────────────────────────
let _gid = 1
export function genGear(depth, opts = {}) {
  const slotId = opts.slot || pick(SLOT_ORDER)
  const slot   = SLOTS[slotId]
  const rarity = opts.rarity || rollRarity(depth)
  const R      = RARITY[rarity]

  // choose distinct stats from the slot's pool
  const pool = [...slot.pool]
  const nStats = Math.min(R.affixes, pool.length)
  const stats = {}
  for (let i = 0; i < nStats; i++) {
    const idx  = Math.floor(Math.random() * pool.length)
    const stat = pool.splice(idx, 1)[0]
    const roll = STAT_ROLL[stat]
    let val = (roll.base + roll.perDepth * (depth - 1)) * R.mult * randf(0.85, 1.15)
    // round per stat kind
    val = STAT_META[stat].kind === 'rate' ? round1(val) : Math.max(1, Math.round(val))
    stats[stat] = val
  }

  // name
  let name
  if (rarity === 'legendary' && LEGENDARY_NAMES[slotId]) {
    name = LEGENDARY_NAMES[slotId]
  } else {
    const n = GEAR_NAMES[slotId]
    name = `${pick(n.pre)} ${pick(n.noun)}`
  }

  return {
    uid: _gid++,
    slot: slotId,
    slotName: slot.name,
    icon: slot.icon,
    name,
    rarity,
    depth,
    stats,
  }
}

// Power score = quick heuristic so the swipe screen can show "better/worse".
export function gearScore(gear) {
  if (!gear) return 0
  const W = { maxHp: 0.5, atk: 3, atkSpeed: 40, armor: 1.5, maxShield: 0.4, shieldRegen: 3, crit: 4, lifesteal: 4 }
  return Math.round(Object.entries(gear.stats).reduce((s, [k, v]) => s + (W[k] || 1) * v, 0))
}

// ── STARTER LOADOUT (every run begins with basic common gear) ──────────────────
export function starterEquipped() {
  const eq = {}
  for (const slot of SLOT_ORDER) eq[slot] = genGear(1, { slot, rarity: 'common' })
  return eq
}

// ── ENEMY GENERATION (scaled by depth, boss on intervals) ──────────────────────
export function genEnemy(depth) {
  const isBoss = depth % BOSS_INTERVAL === 0
  const tpl = isBoss
    ? BOSSES[Math.min(BOSSES.length - 1, Math.floor(depth / BOSS_INTERVAL) - 1)]
    : pick(ENEMIES)

  // exponential-ish scaling so the dive eventually gets dangerous
  const hpScale  = Math.pow(1.18, depth - 1)
  const atkScale = Math.pow(1.13, depth - 1)
  const hp = Math.round(tpl.hp * hpScale)

  return {
    id: tpl.id,
    name: tpl.name,
    icon: tpl.icon,
    isBoss,
    hp,
    maxHp: hp,
    atk: Math.max(1, Math.round(tpl.atk * atkScale)),
    rate: tpl.rate,
    armor: tpl.armor + Math.floor(depth * 0.6),
    bounty: Math.round(tpl.bounty * (1 + depth * 0.22)),
    atkCD: 1 / tpl.rate, // first hit takes a beat
  }
}

// ── DAMAGE: armor gives diminishing reduction; crit rolls; returns detail ───────
export function strike(attacker, defenderArmor, opts = {}) {
  const base = attacker.atk * (opts.mult || 1)
  const reduction = defenderArmor / (defenderArmor + 70)
  let dmg = base * (1 - reduction)
  const crit = opts.crit != null ? opts.crit : (attacker.crit || 0)
  const isCrit = Math.random() * 100 < crit
  if (isCrit) dmg *= (opts.critMult || 2)
  dmg = Math.max(1, Math.round(dmg * randf(0.9, 1.1)))
  return { dmg, isCrit }
}

// Apply damage to a {hp, shield} target (shield absorbs first). Returns new vals.
export function applyDamage(target, dmg) {
  let { hp, shield } = target
  const sAbs = Math.min(shield, dmg)
  shield -= sAbs
  hp = Math.max(0, hp - (dmg - sAbs))
  return { hp, shield, shieldHit: sAbs, hullHit: dmg - sAbs }
}

// ── SALVAGE VALUE (rarity base × depth, boosted by Salvage Drone upgrade) ───────
export function salvageValue(gear, meta) {
  const lvl = meta?.upgrades?.salvage || 0
  const droneBonus = 1 + 0.12 * lvl
  const depthBonus = 1 + (gear.depth || 1) * 0.08
  return Math.round(RARITY[gear.rarity].salvage * depthBonus * droneBonus)
}

// ── PERSISTENCE ────────────────────────────────────────────────────────────────
export function loadMeta(key, init) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return deepClone(init)
    const parsed = JSON.parse(raw)
    return { ...deepClone(init), ...parsed, upgrades: { ...init.upgrades, ...(parsed.upgrades || {}) } }
  } catch {
    return deepClone(init)
  }
}
export function saveMeta(key, meta) {
  try { localStorage.setItem(key, JSON.stringify(meta)) } catch { /* ignore */ }
}
