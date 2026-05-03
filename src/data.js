// ══════════════════════════════════════════════════════════════════════════════
// INITIAL GAME STATE
// ══════════════════════════════════════════════════════════════════════════════
export const INIT_STATE = {
  captain: {
    id: 'cap',
    name: 'Cdr. Zara Voss',
    cls: 'Vanguard',
    level: 12,
    hp: 180, maxHp: 180,
    en: 80,  maxEn: 80,
    atk: 45, def: 32, spd: 28, luck: 15,
    xp: 3420, xpNext: 5000,
    skills: [
      { id: 's1', name: 'Power Strike', cost: 20, type: 'atk',  mult: 1.8,    desc: 'Melee burst — 180% ATK' },
      { id: 's2', name: 'Tac-Shield',   cost: 25, type: 'def',  defMult: 2.5, desc: 'DEF ×2.5 for 1 turn' },
      { id: 's3', name: 'Battle Cry',   cost: 30, type: 'buff', atkPct: 0.25, desc: 'Party ATK +25% (2 turns)' },
    ],
  },
  robots: [
    {
      id: 'bolt', name: 'BOLT-7', arch: 'Tank-Bot', level: 8,
      hp: 220, maxHp: 220, en: 60, maxEn: 60,
      atk: 35, def: 55, spd: 18, luck: 8,
      skills: [
        { id: 'b1', name: 'Iron Bash',   cost: 15, type: 'atk', mult: 1.5,    desc: '150% ATK damage' },
        { id: 'b2', name: 'Shield Wall', cost: 20, type: 'def', defMult: 3.0, desc: 'DEF ×3 for 1 turn' },
      ],
    },
    {
      id: 'lyra', name: 'LYRA-3', arch: 'Healer-Bot', level: 10,
      hp: 120, maxHp: 120, en: 100, maxEn: 100,
      atk: 20, def: 28, spd: 35, luck: 22,
      skills: [
        { id: 'l1', name: 'Nano-Repair', cost: 30, type: 'heal',   amount: 70, desc: 'Restore 70 HP to one ally' },
        { id: 'l2', name: 'E-Surge',     cost: 25, type: 'healEn', amount: 40, desc: '+40 Energy to one ally' },
      ],
    },
  ],
  ship: {
    name: 'ISS Renegade', type: 'Scout Frigate', level: 12,
    hp: 320, maxHp: 320, shield: 100, maxShield: 100,
    atk: 65, eva: 30, moveRange: 3,
    xp: 4100, xpNext: 6000,
    pos: { x: 1, y: 2 },
    abilities: [
      { id: 'a1', name: 'Plasma Burst',  dmgMult: 1.0, range: 2, maxCharges: 99, desc: 'Standard attack, range 2' },
      { id: 'a2', name: 'Torpedo Salvo', dmgMult: 2.2, range: 4, maxCharges: 2,  desc: 'High damage, long range' },
      { id: 'a3', name: 'Afterburner',   dmgMult: 0,   range: 0, maxCharges: 1,  isMove: true, moveBonus: 2, desc: '+2 Move this turn' },
    ],
    charges: { a1: 99, a2: 2, a3: 1 },
  },
  credits: 12450,
  crystals: 120,
}

// ══════════════════════════════════════════════════════════════════════════════
// SURFACE ENEMIES
// ══════════════════════════════════════════════════════════════════════════════
export const SURFACE_ENEMIES = [
  { id: 'e1', name: 'Crawler Drone', icon: '🤖', hp: 85,  maxHp: 85,  atk: 22, def: 12, spd: 22, xpVal: 80  },
  { id: 'e2', name: 'Sentry Guard',  icon: '🛡️', hp: 145, maxHp: 145, atk: 35, def: 28, spd: 16, xpVal: 140 },
]

// ══════════════════════════════════════════════════════════════════════════════
// SPACE ENEMIES
// ══════════════════════════════════════════════════════════════════════════════
export const SPACE_ENEMIES_INIT = [
  { id: 'se1', name: 'Interceptor',    icon: '🛸', hp: 180, maxHp: 180, shield: 50,  maxShield: 50,  atk: 55, eva: 25, moveRange: 2, pos: { x: 7, y: 0 } },
  { id: 'se2', name: 'Battle Cruiser', icon: '🚀', hp: 280, maxHp: 280, shield: 120, maxShield: 120, atk: 70, eva: 10, moveRange: 1, pos: { x: 6, y: 3 } },
  { id: 'se3', name: 'Recon Probe',    icon: '🛰️', hp: 90,  maxHp: 90,  shield: 20,  maxShield: 20,  atk: 35, eva: 40, moveRange: 3, pos: { x: 7, y: 5 } },
]

// ══════════════════════════════════════════════════════════════════════════════
// SPACE COMBAT GRID
// ══════════════════════════════════════════════════════════════════════════════
export const GRID_W = 8
export const GRID_H = 6

// Zone type index per cell [row][col]
export const ZONE_MAP = [
  [0, 0, 1, 1, 0, 0, 3, 3],
  [0, 2, 2, 0, 0, 5, 5, 3],
  [0, 2, 0, 0, 6, 5, 0, 0],
  [0, 0, 0, 4, 4, 0, 2, 0],
  [3, 3, 0, 4, 0, 0, 2, 2],
  [3, 0, 0, 0, 0, 1, 1, 0],
]

export const ZONES = {
  0: { name: 'Open Space',    bg: 'transparent',            border: '#1a3a5a', fx: null },
  1: { name: 'Nebula',        bg: 'rgba(110,20,220,.18)',   border: '#8833ff', fx: '+15% Evasion' },
  2: { name: 'Asteroid Belt', bg: 'rgba(140,80,0,.20)',     border: '#cc8800', fx: '+10% Shield/turn' },
  3: { name: 'Ion Storm',     bg: 'rgba(220,60,0,.18)',     border: '#ff5522', fx: '-20% Accuracy' },
  4: { name: 'Gravity Well',  bg: 'rgba(0,50,200,.20)',     border: '#4466ff', fx: '-1 Move Range' },
  5: { name: 'Debris Field',  bg: 'rgba(220,0,50,.18)',     border: '#ff2244', fx: '5% Max HP dmg/turn' },
  6: { name: 'Objective',     bg: 'rgba(0,200,100,.20)',    border: '#00ff88', fx: 'Capture for bonus' },
}

// ══════════════════════════════════════════════════════════════════════════════
// LOOT POOL
// ══════════════════════════════════════════════════════════════════════════════
export const LOOT_POOL = [
  { name: 'Nano-Blade+1',      rar: 'uncommon',  col: '#44dd88', st: '+12 ATK' },
  { name: 'Void Plating',      rar: 'rare',       col: '#4499ff', st: '+20 DEF' },
  { name: 'Holo-Scope',        rar: 'rare',       col: '#4499ff', st: '+15% Accuracy' },
  { name: 'Nebula Core',       rar: 'epic',       col: '#aa44ff', st: '+3 Move Range' },
  { name: 'Echo Shield Mk.II', rar: 'epic',       col: '#aa44ff', st: '+50 Shield, Regen 5/turn' },
  { name: 'APEX Cannon',       rar: 'legendary',  col: '#ffc530', st: '+35 ATK, +20% Crit' },
  { name: 'Repair Kit',        rar: 'common',     col: '#888888', st: 'Restore 80 HP' },
  { name: 'Ion Rounds',        rar: 'uncommon',   col: '#44dd88', st: '+8 ATK (3 battles)' },
]

// ══════════════════════════════════════════════════════════════════════════════
// HUB PANELS
// ══════════════════════════════════════════════════════════════════════════════
export const HUB_PANELS = [
  { id: 'character', icon: '🧑‍🚀', name: 'COMMAND BRIDGE', desc: 'Captain stats, equipment, talent tree',  badge: 'LV 12' },
  { id: 'ship',      icon: '🚀',   name: 'HANGAR BAY',      desc: 'Ship stats, weapons, hull upgrades',    badge: 'LV 12' },
  { id: 'crew',      icon: '🤖',   name: 'ROBOT WORKSHOP',  desc: 'Manage crew, modules, customization',   badge: '2 ACTIVE' },
  { id: 'surface',   icon: '🪐',   name: 'MISSION CONTROL', desc: 'Launch surface combat mission',         badge: 'READY', active: true },
  { id: 'space',     icon: '⚔️',   name: 'WORMHOLE JUMP',   desc: 'Launch space tactical combat',          badge: 'READY', active: true },
  { id: 'market',    icon: '🏪',   name: 'GALACTIC MARKET', desc: 'Buy, sell and trade equipment',          badge: '3 NEW' },
  { id: 'workshop',  icon: '⚙️',   name: 'WORKSHOP',        desc: 'Salvage, craft, upgrade gear',           badge: 'OPEN' },
  { id: 'lounge',    icon: '🌌',   name: "OFFICER'S LOUNGE",desc: 'Codex, achievements, leaderboards',     badge: 'CODEX' },
]
