import { useState, useEffect, useRef } from 'react'
import { CLASSES, SLOT_ORDER, SLOTS, STAT_META } from '../data'
import {
  baseStats, deriveStats, starterEquipped, genEnemy, genGear, strike, applyDamage,
  salvageValue, zoneForDepth, hpColor, clamp, round1,
} from '../game'
import GearCard from '../components/GearCard'

const TICK_MS = 100
const DT = TICK_MS / 1000
const ADVANCE_TIME = 0.8        // seconds to walk between encounters
const FLOAT_TTL = 8             // ticks a damage number lives
const DROP_CHANCE = 0.8         // normal kills that drop a card (bosses always)

let _ev = 1

// ── build a fresh run sim from meta ────────────────────────────────────────────
function newSim(meta) {
  const base = baseStats(meta)
  const equipped = starterEquipped()
  const stats = deriveStats(base, equipped)
  const cls = CLASSES[meta.cls] || CLASSES.vanguard
  return {
    phase: 'advance',
    depth: 1,
    tick: 0,
    adv: 0,
    base,
    equipped,
    stats,
    hp: stats.maxHp,
    shield: stats.maxShield,
    abilityCD: 0,
    abilityFlash: -99,
    enemy: null,
    enemyFlash: -99,
    heroFlash: -99,
    pendingCard: null,
    floats: [],
    log: [`⟫ Wormhole breached. Diving into ${zoneForDepth(1).name}…`],
    runCredits: 0,
    kills: 0,
    cls,
  }
}

function addFloat(s, side, dmg, crit) {
  s.floats.push({ id: _ev++, side, dmg, crit, bornTick: s.tick })
}
function addLog(s, msg) {
  s.log = [...s.log.slice(-6), msg]
}

// recompute derived stats after gear change & carry over pools sensibly
function reequip(s, slot, gear) {
  const oldMaxHp = s.stats.maxHp
  const oldMaxShield = s.stats.maxShield
  s.equipped = { ...s.equipped, [slot]: gear }
  s.stats = deriveStats(s.base, s.equipped)
  s.hp = clamp(s.hp + (s.stats.maxHp - oldMaxHp), 1, s.stats.maxHp)
  s.shield = clamp(s.shield + (s.stats.maxShield - oldMaxShield), 0, s.stats.maxShield)
}

// ── one simulation step (pure-ish: mutates a clone) ────────────────────────────
function step(prev) {
  if (prev.phase === 'loot' || prev.phase === 'dead') return prev
  const s = { ...prev, floats: prev.floats.slice() }
  s.tick += 1

  // expire old floating numbers
  s.floats = s.floats.filter((f) => s.tick - f.bornTick < FLOAT_TTL)

  // global ticks: shield regen + ability cooldown
  if (s.shield < s.stats.maxShield) {
    s.shield = clamp(round1(s.shield + s.stats.shieldRegen * DT), 0, s.stats.maxShield)
  }
  if (s.abilityCD > 0) s.abilityCD = Math.max(0, round1(s.abilityCD - DT))

  if (s.phase === 'advance') {
    s.adv += DT / ADVANCE_TIME
    if (s.adv >= 1) {
      s.adv = 0
      s.enemy = genEnemy(s.depth)
      s.heroAtkCD = 0.15           // hero gets first lick on contact
      s.phase = 'fight'
      addLog(s, `⚠ Contact: ${s.enemy.name}${s.enemy.isBoss ? ' (BOSS)' : ''} — Depth ${s.depth}`)
    }
    return s
  }

  // ── FIGHT ────────────────────────────────────────────────────────────────────
  const e = { ...s.enemy }

  // hero attacks
  s.heroAtkCD = (s.heroAtkCD ?? 1 / s.stats.atkSpeed) - DT
  if (s.heroAtkCD <= 0 && e.hp > 0) {
    s.heroAtkCD += 1 / s.stats.atkSpeed
    const { dmg, isCrit } = strike(s.stats, e.armor, { crit: s.stats.crit })
    e.hp = Math.max(0, e.hp - dmg)
    addFloat(s, 'enemy', dmg, isCrit)
    s.enemyFlash = s.tick
    if (s.stats.lifesteal > 0) {
      const heal = Math.max(1, Math.round(dmg * s.stats.lifesteal / 100))
      s.hp = clamp(s.hp + heal, 0, s.stats.maxHp)
    }
  }

  // enemy attacks
  e.atkCD -= DT
  if (e.atkCD <= 0 && e.hp > 0) {
    e.atkCD += 1 / e.rate
    const { dmg, isCrit } = strike(e, s.stats.armor, { crit: 5 })
    const res = applyDamage({ hp: s.hp, shield: s.shield }, dmg)
    s.hp = res.hp
    s.shield = res.shield
    addFloat(s, 'hero', dmg, isCrit)
    s.heroFlash = s.tick
  }

  s.enemy = e

  // resolve deaths
  if (s.hp <= 0) {
    s.hp = 0
    s.phase = 'dead'
    addLog(s, `☠ ${s.cls.captain} went dark at Depth ${s.depth}.`)
    return s
  }
  if (e.hp <= 0) {
    s.kills += 1
    s.runCredits += e.bounty
    addLog(s, `✔ ${e.name} destroyed — +${e.bounty} ₢`)
    // loot decision
    const drops = e.isBoss || Math.random() < DROP_CHANCE
    if (drops) {
      s.pendingCard = genGear(s.depth, e.isBoss ? { rarity: pickBossRarity() } : {})
      s.phase = 'loot'
    } else {
      s.phase = 'advance'
    }
    s.depth += 1
    s.enemy = null
    return s
  }

  return s
}

function pickBossRarity() {
  const r = Math.random()
  return r < 0.45 ? 'epic' : r < 0.8 ? 'rare' : 'legendary'
}

// ── COMPONENT ──────────────────────────────────────────────────────────────────
export default function RunScreen({ meta, onEnd }) {
  const [sim, setSim] = useState(() => newSim(meta))
  const endedRef = useRef(false)
  const onEndRef = useRef(onEnd)
  onEndRef.current = onEnd

  // single sim loop
  useEffect(() => {
    const iv = setInterval(() => setSim((s) => step(s)), TICK_MS)
    return () => clearInterval(iv)
  }, [])

  // death → hand result back to App (once)
  useEffect(() => {
    if (sim.phase === 'dead' && !endedRef.current) {
      endedRef.current = true
      const t = setTimeout(() => {
        onEndRef.current({
          depth: sim.depth,
          reached: sim.depth,
          creditsEarned: sim.runCredits,
          kills: sim.kills,
          equipped: sim.equipped,
        })
      }, 1100)
      return () => clearTimeout(t)
    }
  }, [sim.phase, sim.depth, sim.runCredits, sim.kills, sim.equipped])

  // ── handlers ──────────────────────────────────────────────────────────────────
  const useAbility = () => {
    setSim((s) => {
      if (s.phase !== 'fight' || s.abilityCD > 0 || !s.enemy || s.enemy.hp <= 0) return s
      const ns = { ...s, floats: s.floats.slice() }
      const e = { ...ns.enemy }
      const ab = ns.cls.ability
      let total = 0
      const hit = (mult) => {
        const { dmg, isCrit } = strike(ns.stats, e.armor, { crit: ns.stats.crit, mult })
        e.hp = Math.max(0, e.hp - dmg); total += dmg
        addFloat(ns, 'enemy', dmg, isCrit)
      }
      if (ab.id === 'powerstrike') hit(3.5)
      else if (ab.id === 'rapidvolley') { for (let i = 0; i < 6; i++) hit(0.9) }
      else if (ab.id === 'ionnova') { hit(2.8); ns.shield = ns.stats.maxShield }
      ns.enemy = e
      ns.abilityCD = ab.cd
      ns.abilityFlash = ns.tick
      ns.enemyFlash = ns.tick
      addLog(ns, `${ab.icon} ${ab.name}! ${total} damage.`)
      if (e.hp <= 0) {
        ns.kills += 1; ns.runCredits += e.bounty
        addLog(ns, `✔ ${e.name} destroyed — +${e.bounty} ₢`)
        const drops = e.isBoss || Math.random() < DROP_CHANCE
        if (drops) { ns.pendingCard = genGear(ns.depth, e.isBoss ? { rarity: pickBossRarity() } : {}); ns.phase = 'loot' }
        else ns.phase = 'advance'
        ns.depth += 1; ns.enemy = null
      }
      return ns
    })
  }

  const onDecide = (decision) => {
    setSim((s) => {
      if (!s.pendingCard) return s
      const ns = { ...s }
      const card = s.pendingCard
      if (decision === 'equip') {
        reequip(ns, card.slot, card)
        addLog(ns, `🔧 Equipped ${card.name}.`)
      } else {
        const val = salvageValue(card, meta)
        ns.runCredits += val
        addLog(ns, `♻ Salvaged ${card.name} — +${val} ₢`)
      }
      ns.pendingCard = null
      ns.phase = 'advance'
      ns.adv = 0
      return ns
    })
  }

  const abort = () => {
    if (endedRef.current) return
    endedRef.current = true
    onEndRef.current({
      depth: sim.depth, reached: sim.depth, creditsEarned: sim.runCredits,
      kills: sim.kills, equipped: sim.equipped, retreated: true,
    })
  }

  // ── derived view data ─────────────────────────────────────────────────────────
  const zone = zoneForDepth(sim.depth)
  const s = sim
  const hpPct = s.hp / s.stats.maxHp
  const shPct = s.stats.maxShield ? s.shield / s.stats.maxShield : 0
  const ab = s.cls.ability
  const abReady = s.abilityCD <= 0 && s.phase === 'fight'
  const enemyFlashing = s.tick - s.enemyFlash < 2
  const heroFlashing = s.tick - s.heroFlash < 2

  return (
    <div className="run" style={{ '--zone': zone.accent }}>
      {/* zone tint wash */}
      <div className="run-wash" style={{ background: `radial-gradient(ellipse at 50% 30%, ${zone.tint}, transparent 70%)` }} />

      {/* header: depth + zone + run credits */}
      <div className="run-top">
        <div className="run-depth">
          <span className="rd-num" style={{ color: zone.accent }}>DEPTH {sim.depth}</span>
          <span className="rd-zone">{zone.name}</span>
        </div>
        <div className="run-credits">
          <span className="rc-val">+{sim.runCredits.toLocaleString()} ₢</span>
          <span className="rc-lbl">RUN HAUL · {sim.kills} KILLS</span>
        </div>
        <button className="btn btn-ghost run-abort" onClick={abort}>RETREAT ⟩</button>
      </div>

      {/* ─── COMBAT LANE ─── */}
      <div className="lane">
        {/* hero */}
        <div className={`fighter hero${heroFlashing ? ' flash' : ''}`}>
          <div className="fighter-floats">
            {s.floats.filter((f) => f.side === 'hero').map((f) => (
              <span key={f.id} className={`float dmg${f.crit ? ' crit' : ''}`}>-{f.dmg}</span>
            ))}
          </div>
          <div className="fighter-avatar hero-av">{s.cls.icon}</div>
          <div className="fighter-name">{s.cls.captain}</div>
          <div className="bars">
            <Bar label="HULL" cur={s.hp} max={s.stats.maxHp} color={hpColor(hpPct)} />
            <Bar label="SHLD" cur={Math.round(s.shield)} max={s.stats.maxShield} color="#3399ff" />
          </div>
        </div>

        {/* middle: advancing OR vs */}
        <div className="lane-mid">
          {s.phase === 'advance' ? (
            <div className="advancing">
              <div className="adv-icon">⟫⟫⟫</div>
              <div className="adv-bar"><div className="adv-fill" style={{ width: `${Math.min(100, s.adv * 100)}%`, background: zone.accent }} /></div>
              <div className="adv-text">SCANNING — CONTACT IMMINENT</div>
            </div>
          ) : (
            <div className="vs">VS</div>
          )}
        </div>

        {/* enemy */}
        <div className={`fighter enemy${enemyFlashing ? ' flash' : ''}${!s.enemy ? ' empty' : ''}`}>
          {s.enemy && (
            <>
              <div className="fighter-floats">
                {s.floats.filter((f) => f.side === 'enemy').map((f) => (
                  <span key={f.id} className={`float dmg enemy-dmg${f.crit ? ' crit' : ''}`}>-{f.dmg}</span>
                ))}
              </div>
              <div className={`fighter-avatar enemy-av${s.enemy.isBoss ? ' boss' : ''}`}>{s.enemy.icon}</div>
              <div className="fighter-name">{s.enemy.name}{s.enemy.isBoss && <span className="boss-tag">BOSS</span>}</div>
              <div className="bars">
                <Bar label="HP" cur={Math.round(s.enemy.hp)} max={s.enemy.maxHp} color={hpColor(s.enemy.hp / s.enemy.maxHp)} />
                <div className="enemy-meta">⚔ {s.enemy.atk} · 🛡 {s.enemy.armor} · ⚡ {s.enemy.rate.toFixed(1)}/s</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── ABILITY + EQUIPPED STATS ─── */}
      <div className="run-controls">
        <button
          className={`ability-big${abReady ? ' ready' : ''}`}
          onClick={useAbility}
          disabled={!abReady}
          style={{ borderColor: abReady ? zone.accent : undefined }}
        >
          <span className="ab-icon">{ab.icon}</span>
          <span className="ab-name">{ab.name}</span>
          <span className="ab-cd">{s.abilityCD > 0 ? `${s.abilityCD.toFixed(1)}s` : 'READY'}</span>
          {s.abilityCD > 0 && (
            <span className="ab-cd-fill" style={{ width: `${100 - (s.abilityCD / ab.cd) * 100}%` }} />
          )}
        </button>

        <div className="loadout-strip">
          {SLOT_ORDER.map((slot) => {
            const g = s.equipped[slot]
            return (
              <div key={slot} className="ls-slot" title={g?.name}>
                <span className="ls-icon">{SLOTS[slot].icon}</span>
                <span className="ls-name" style={{ color: g ? 'var(--text)' : 'var(--dim)' }}>
                  {g ? g.name : SLOTS[slot].name}
                </span>
              </div>
            )
          })}
        </div>

        <div className="stat-strip">
          {['atk', 'atkSpeed', 'armor', 'crit', 'lifesteal'].map((k) => {
            const m = STAT_META[k]
            const v = s.stats[k]
            return (
              <div key={k} className="ss-stat">
                <span style={{ color: m.col }}>{m.icon}</span>
                <b>{m.kind === 'rate' ? v.toFixed(2) : v}{m.kind === 'pct' ? '%' : ''}</b>
                <span className="ss-lbl">{m.short}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── SWIPE LOOT OVERLAY ─── */}
      {s.phase === 'loot' && s.pendingCard && (
        <div className="loot-overlay">
          <div className="loot-overlay-title">SALVAGE RECOVERED</div>
          <GearCard
            key={s.pendingCard.uid}
            gear={s.pendingCard}
            current={s.equipped[s.pendingCard.slot]}
            meta={meta}
            onDecide={onDecide}
          />
        </div>
      )}

      {/* ─── DEATH FLASH ─── */}
      {s.phase === 'dead' && (
        <div className="run-dead">
          <div className="run-dead-title">SIGNAL LOST</div>
          <div className="run-dead-sub">Depth {sim.depth} · {sim.kills} kills · {sim.runCredits} ₢ recovered</div>
        </div>
      )}

      {/* combat log */}
      <div className="run-log">
        {s.log.map((l, i) => <div key={i} className="run-log-line">{l}</div>)}
      </div>
    </div>
  )
}

function Bar({ label, cur, max, color }) {
  const pct = max ? clamp(cur / max, 0, 1) : 0
  return (
    <div className="rbar">
      <span className="rbar-label">{label}</span>
      <div className="rbar-bg">
        <div className="rbar-fill" style={{ width: `${pct * 100}%`, background: color }} />
      </div>
      <span className="rbar-val">{cur}/{max}</span>
    </div>
  )
}
