# 🌀 Space Scouts: Wormhole Run

> *"The wormhole opens anywhere. How deep will you go?"*

A browser-based **roguelite auto-runner** set in the Space Scouts universe.
Same crew, same frontier, same story — rebuilt around the gameplay loop of the
mobile hit **Path of Kings**: an endless-runner-meets-card-game where you
auto-dive into uncharted space, auto-fight everything you meet, and **swipe**
each piece of salvage to **equip** or **sell** it. Build your stats on the fly,
die in the dark, bank your credits, upgrade your station, dive deeper.

---

## The loop (straight out of Path of Kings)

| Beat | What happens |
|---|---|
| 🛰️ **Auto-dive** | Your scout advances through the wormhole on its own, sector by sector. |
| ⚔️ **Auto-combat** | Enemies close in and you trade fire automatically — real-time, with crits, shields & lifesteal. |
| 🃏 **Swipe loot** | Every kill drops a **gear card**. **Swipe right to EQUIP**, **left to SALVAGE** for credits. |
| 📈 **Build-craft** | Each card rewrites your HULL / DAMAGE / FIRE RATE / ARMOR / SHIELD / CRIT. Live stat deltas help you decide. |
| 💥 **Abilities** | A class signature ability on cooldown — Power Strike, Rapid Volley, or Ion Nova. |
| 👹 **Boss gates** | Every 5th depth is a boss that guarantees epic/legendary salvage. |
| 🏠 **Meta-progression** | Bank credits at **Frontier Station** and buy permanent upgrades, then dive again — further each time. |

It's still a browser game — runs entirely client-side, plays great on desktop
*and* in portrait on mobile (just like the original).

---

## Choose your scout (playstyle)

| Class | Captain | Style |
|---|---|---|
| 🪖 **Vanguard** | Cdr. Zara Voss | Brutal warrior — heavy hull, crushing strikes |
| 🛰️ **Ranger** | Lt. Kade Ardent | Swift rogue — blistering fire rate & crits |
| 🌀 **Technomancer** | Dr. Iris Cael | Dark-tech mage — ion bursts & siphoning shields |

Dive through six themed sectors — **Asteroid Drift → Derelict Armada → Nebula
Reach → Ion Storm Front → Devourer's Maw → The Deep Void** — against drones,
sentries, void raptors, and named bosses (Hive Tyrant, Iron Dreadnought, The
Devourer, Void Warden).

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Build for Production

```bash
npm run build
npm run preview
```

Your progress (credits, upgrades, best depth) is saved in the browser via
`localStorage`.

---

## Project Structure

```
src/
├── App.jsx                 # Root: screen router + persistent meta-state
├── main.jsx                # React DOM entry
├── data.js                 # Classes, gear pools, enemies, zones, upgrades
├── game.js                 # Pure logic: stat derivation, gear/enemy gen, combat math
├── styles.css              # All styling (theme + screens)
├── components/
│   ├── StarField.jsx       # Animated parallax star canvas
│   ├── TopBar.jsx          # Header: class, best depth, credits, crystals
│   └── GearCard.jsx        # The swipe-to-equip-or-salvage loot card
└── screens/
    ├── LoadingScreen.jsx   # Wormhole spin-up boot sequence
    ├── StationScreen.jsx   # Frontier Station — class select & permanent upgrades
    ├── RunScreen.jsx       # The dive: auto-runner, auto-combat, swipe loot, abilities
    └── SummaryScreen.jsx   # Run debrief — depth, kills, banked credits, final loadout
```

---

## Tech Stack

- **React 18** + **Vite 5**
- Plain CSS, zero UI dependencies
- Google Fonts: Orbitron · Exo 2 · Share Tech Mono

---

## Roadmap

- [ ] Daily seeded dives & leaderboards
- [ ] Set bonuses / gear synergies
- [ ] Companion robots (BOLT-7, LYRA-3) as active drones
- [ ] Branching path choices (shops, events, elite fights)
- [ ] Crystal shop (cosmetics only)

---

## License

MIT — prototype / pre-production. All game content © Space Scouts project.
