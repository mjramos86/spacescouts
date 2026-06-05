// ══════════════════════════════════════════════════════════════════════════════
// SPACE SCOUTS: WORMHOLE RUN — GAME DATA
// ------------------------------------------------------------------------------
// Same universe & story as the Space Scouts prototype, rebuilt around the
// "Path of Kings" loop: an auto-running, auto-fighting dive where every kill
// drops a gear card you SWIPE to equip or salvage. Sell for credits, spend
// credits on permanent upgrades back at Frontier Station, dive deeper.
// ══════════════════════════════════════════════════════════════════════════════

// ── RARITY ────────────────────────────────────────────────────────────────────
// Reuses the original loot palette. `mult` scales stat rolls, `affixes` is how
// many stat lines a piece of gear of this rarity rolls, `weight` is drop odds.
export const RARITY = {
  common:    { name: 'COMMON',    col: '#8aa4c0', mult: 1.0,  affixes: 1, weight: 46, salvage: 18 },
  uncommon:  { name: 'UNCOMMON',  col: '#44dd88', mult: 1.5,  affixes: 2, weight: 28, salvage: 40 },
  rare:      { name: 'RARE',      col: '#4499ff', mult: 2.1,  affixes: 2, weight: 16, salvage: 90 },
  epic:      { name: 'EPIC',      col: '#aa44ff', mult: 3.0,  affixes: 3, weight: 8,  salvage: 200 },
  legendary: { name: 'LEGENDARY', col: '#ffc530', mult: 4.2,  affixes: 3, weight: 2,  salvage: 480 },
}
export const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary']

// ── STAT KEYS ────────────────────────────────────────────────────────────────
// Sci-fi mapping of Path of Kings' "health / armor / damage / etc."
export const STAT_META = {
  maxHp:       { label: 'HULL',     short: 'HP',  icon: '❤️', col: '#00e87a', kind: 'flat'  },
  atk:         { label: 'DAMAGE',   short: 'DMG', icon: '⚔️', col: '#ff6644', kind: 'flat'  },
  atkSpeed:    { label: 'FIRE RATE',short: 'SPD', icon: '⚡', col: '#ffcc00', kind: 'rate'  },
  armor:       { label: 'ARMOR',    short: 'ARM', icon: '🛡️', col: '#88bbff', kind: 'flat'  },
  maxShield:   { label: 'SHIELD',   short: 'SHD', icon: '🔷', col: '#4499ff', kind: 'flat'  },
  shieldRegen: { label: 'SHD REGEN',short: 'RGN', icon: '🔋', col: '#22ccff', kind: 'flat'  },
  crit:        { label: 'CRIT',     short: 'CRT', icon: '🎯', col: '#ff44aa', kind: 'pct'   },
  lifesteal:   { label: 'LIFESTEAL',short: 'LFS', icon: '🩸', col: '#ff5577', kind: 'pct'   },
}

// ── CLASSES (playstyles: brutal warrior / swift rogue / dark mage) ─────────────
export const CLASSES = {
  vanguard: {
    id: 'vanguard',
    name: 'VANGUARD',
    icon: '🪖',
    captain: 'Cdr. Zara Voss',
    blurb: 'Front-line bruiser. Heavy hull, crushing strikes, born to soak fire.',
    base: { maxHp: 220, atk: 26, atkSpeed: 0.85, armor: 14, maxShield: 60, shieldRegen: 6, crit: 8, lifesteal: 0 },
    ability: { id: 'powerstrike', name: 'POWER STRIKE', icon: '💥', cd: 8,
      desc: 'Overload melee burst — 350% damage to current target.' },
  },
  ranger: {
    id: 'ranger',
    name: 'RANGER',
    icon: '🛰️',
    captain: 'Lt. Kade Ardent',
    blurb: 'Swift scout. Blistering fire rate and precision crits, light on armor.',
    base: { maxHp: 150, atk: 18, atkSpeed: 1.7, armor: 6, maxShield: 50, shieldRegen: 8, crit: 22, lifesteal: 0 },
    ability: { id: 'rapidvolley', name: 'RAPID VOLLEY', icon: '🔥', cd: 7,
      desc: 'Unload a 6-shot volley at blinding speed.' },
  },
  technomancer: {
    id: 'technomancer',
    name: 'TECHNOMANCER',
    icon: '🌀',
    captain: 'Dr. Iris Cael',
    blurb: 'Dark-tech caster. Ion bursts and siphoning fields bend the void.',
    base: { maxHp: 170, atk: 22, atkSpeed: 1.1, armor: 8, maxShield: 90, shieldRegen: 12, crit: 12, lifesteal: 8 },
    ability: { id: 'ionnova', name: 'ION NOVA', icon: '☄️', cd: 9,
      desc: 'Detonate an ion nova — 280% damage and overcharges your shield.' },
  },
}
export const CLASS_ORDER = ['vanguard', 'ranger', 'technomancer']

// ── GEAR SLOTS ────────────────────────────────────────────────────────────────
export const SLOTS = {
  weapon: { id: 'weapon', name: 'WEAPON', icon: '🔫', pool: ['atk', 'crit', 'atkSpeed', 'lifesteal'] },
  armor:  { id: 'armor',  name: 'PLATING', icon: '🧱', pool: ['maxHp', 'armor', 'shieldRegen'] },
  core:   { id: 'core',   name: 'SHIELD CORE', icon: '🔷', pool: ['maxShield', 'shieldRegen', 'maxHp'] },
  module: { id: 'module', name: 'MODULE', icon: '🧩', pool: ['atk', 'crit', 'maxHp', 'lifesteal', 'atkSpeed', 'armor'] },
}
export const SLOT_ORDER = ['weapon', 'armor', 'core', 'module']

// Base roll value per stat (before rarity mult & depth scaling) when it appears.
export const STAT_ROLL = {
  maxHp:       { base: 22,  perDepth: 3.0  },
  atk:         { base: 5,   perDepth: 0.9  },
  atkSpeed:    { base: 0.12, perDepth: 0.004 },
  armor:       { base: 4,   perDepth: 0.5  },
  maxShield:   { base: 16,  perDepth: 2.2  },
  shieldRegen: { base: 2,   perDepth: 0.18 },
  crit:        { base: 4,   perDepth: 0.12 },
  lifesteal:   { base: 3,   perDepth: 0.08 },
}

// Flavorful gear name fragments per slot (prefix + core noun).
export const GEAR_NAMES = {
  weapon: { pre: ['Plasma', 'Ion', 'Rail', 'Pulse', 'Nano', 'Void', 'Arc', 'Photon', 'Quark'],
            noun: ['Carbine', 'Lance', 'Repeater', 'Blaster', 'Cannon', 'Blade', 'Driver'] },
  armor:  { pre: ['Titan', 'Aegis', 'Composite', 'Reactive', 'Carbon', 'Adamant', 'Bulwark'],
            noun: ['Plating', 'Carapace', 'Exo-Frame', 'Weave', 'Harness', 'Shell'] },
  core:   { pre: ['Echo', 'Halo', 'Flux', 'Aurora', 'Bastion', 'Phase', 'Helios'],
            noun: ['Shield Core', 'Barrier', 'Deflector', 'Field Node', 'Capacitor'] },
  module: { pre: ['Quantum', 'Neural', 'Override', 'Cipher', 'Apex', 'Spectre', 'Warp'],
            noun: ['Module', 'Matrix', 'Chip', 'Relay', 'Coprocessor', 'Augment'] },
}

// Named legendary keepsakes that nod to the original crew/ship.
export const LEGENDARY_NAMES = {
  weapon: 'APEX Cannon',
  armor:  'Renegade Hull-Plate',
  core:   'Echo Shield Mk.II',
  module: 'BOLT-7 Combat Core',
}

// ── ENEMY ARCHETYPES (scale with depth) ───────────────────────────────────────
// hp/atk are at depth 1; scaling applied in game.js. `rate` = attacks/sec.
export const ENEMIES = [
  { id: 'crawler', name: 'Crawler Drone', icon: '🤖', hp: 40,  atk: 8,  rate: 0.9, armor: 2,  bounty: 6  },
  { id: 'probe',   name: 'Recon Probe',   icon: '🛰️', hp: 28,  atk: 6,  rate: 1.5, armor: 0,  bounty: 5  },
  { id: 'sentry',  name: 'Sentry Guard',  icon: '🛡️', hp: 70,  atk: 12, rate: 0.7, armor: 8,  bounty: 9  },
  { id: 'raptor',  name: 'Void Raptor',   icon: '👾', hp: 50,  atk: 14, rate: 1.1, armor: 3,  bounty: 8  },
  { id: 'inter',   name: 'Interceptor',   icon: '🛸', hp: 60,  atk: 16, rate: 1.2, armor: 4,  bounty: 11 },
  { id: 'brute',   name: 'Hive Brute',    icon: '🦂', hp: 110, atk: 18, rate: 0.6, armor: 10, bounty: 14 },
]

// Bosses appear at every BOSS_INTERVAL depths. Tougher, slower, big bounty.
export const BOSSES = [
  { id: 'tyrant',  name: 'Hive Tyrant',      icon: '🐲', hp: 320, atk: 30, rate: 0.8, armor: 14, bounty: 90  },
  { id: 'dread',   name: 'Iron Dreadnought', icon: '🛸', hp: 420, atk: 26, rate: 0.6, armor: 22, bounty: 120 },
  { id: 'devour',  name: 'The Devourer',     icon: '🦑', hp: 560, atk: 38, rate: 0.7, armor: 18, bounty: 160 },
  { id: 'warden',  name: 'Void Warden',      icon: '👁️', hp: 700, atk: 44, rate: 0.9, armor: 26, bounty: 220 },
]
export const BOSS_INTERVAL = 5

// ── ZONES (themed sectors you dive through, re-skin of POK's biomes) ───────────
export const ZONES = [
  { name: 'ASTEROID DRIFT',   from: 1,  tint: 'rgba(140,90,0,.10)',   accent: '#cc8800' },
  { name: 'DERELICT ARMADA',  from: 6,  tint: 'rgba(40,80,140,.12)',  accent: '#4488cc' },
  { name: 'NEBULA REACH',     from: 11, tint: 'rgba(110,20,220,.12)', accent: '#aa44ff' },
  { name: 'ION STORM FRONT',  from: 16, tint: 'rgba(220,60,0,.12)',   accent: '#ff5522' },
  { name: "DEVOURER'S MAW",   from: 21, tint: 'rgba(180,0,40,.14)',   accent: '#ff2244' },
  { name: 'THE DEEP VOID',    from: 26, tint: 'rgba(0,40,90,.16)',    accent: '#00d4ff' },
]

// ── PERMANENT UPGRADES (Frontier Station meta-progression) ─────────────────────
// `apply` mutates a base-stat object. cost(level) is credits for the NEXT level.
export const UPGRADES = [
  { id: 'hull',    name: 'Hull Plating',      icon: '🧱', max: 10, desc: '+24 max Hull per level',
    cost: (l) => 120 + l * 110, apply: (b, l) => { b.maxHp += 24 * l } },
  { id: 'weapon',  name: 'Weapon Calibration',icon: '⚔️', max: 10, desc: '+4 base Damage per level',
    cost: (l) => 140 + l * 130, apply: (b, l) => { b.atk += 4 * l } },
  { id: 'reactor', name: 'Reactor Core',      icon: '🔷', max: 8,  desc: '+18 Shield & +2 regen per level',
    cost: (l) => 130 + l * 120, apply: (b, l) => { b.maxShield += 18 * l; b.shieldRegen += 2 * l } },
  { id: 'servos',  name: 'Overclocked Servos',icon: '⚡', max: 8,  desc: '+6% Fire Rate per level',
    cost: (l) => 160 + l * 160, apply: (b, l) => { b.atkSpeed *= (1 + 0.06 * l) } },
  { id: 'targeting',name:'Targeting Matrix',  icon: '🎯', max: 8,  desc: '+3% Crit per level',
    cost: (l) => 150 + l * 140, apply: (b, l) => { b.crit += 3 * l } },
  { id: 'salvage', name: 'Salvage Drone',     icon: '💰', max: 6,  desc: '+12% salvage credits per level',
    cost: (l) => 180 + l * 200, apply: null /* handled in game.js salvageValue */ },
]

// ── INITIAL PERSISTENT META STATE (saved to localStorage) ──────────────────────
export const INIT_META = {
  credits: 0,
  crystals: 0,
  cls: 'vanguard',
  upgrades: { hull: 0, weapon: 0, reactor: 0, servos: 0, targeting: 0, salvage: 0 },
  bestDepth: 0,
  totalRuns: 0,
  totalKills: 0,
}

export const SAVE_KEY = 'spacescouts.wormholerun.v1'
