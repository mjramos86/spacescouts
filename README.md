# 🚀 Space Scouts — Prototype v0.1

> *"The wormhole opens anywhere. Where will you go?"*

A browser-based RPG prototype built on the Space Scouts Game Design Document.
Turn-based tactical combat in space (Fire Emblem–style) and on the surface (Final Fantasy–style),
with a persistent hub station, loot system, and XP progression.

---

## Features

| Screen | Description |
|---|---|
| 🏠 Frontier Station | Clickable hub map with 8 areas |
| ⚔️ Space Combat | Tactical 8×6 hex grid with 6 zone types |
| 🪐 Surface Combat | Turn-based JRPG combat with 3-unit party |
| 🏆 Mission Debrief | XP, credits, and tiered loot rewards |
| 🧑‍🚀 Character Screens | Captain, Ship, and Robot crew stats/skills |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/space-scouts.git
cd space-scouts
npm install
npm run dev
\`\`\`

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

---

## Project Structure

\`\`\`
src/
├── App.jsx               # Root component & screen router
├── main.jsx              # React DOM entry point
├── styles.js             # All CSS (injected at runtime)
├── data.js               # Game data: units, enemies, zones, loot
├── utils.js              # Helpers: damage calc, clamp, rand, hpColor
├── components/
│   ├── StarField.jsx     # Animated parallax star canvas
│   ├── TopBar.jsx        # Header with player stats
│   └── HpBar.jsx         # Reusable HP / Energy bars
└── screens/
    ├── HubScreen.jsx     # Frontier Station hub
    ├── SurfaceCombat.jsx # Final Fantasy–style surface battle
    ├── SpaceCombat.jsx   # Fire Emblem–style grid combat
    ├── CharacterScreen.jsx # Captain / Ship / Robot viewer
    └── RewardScreen.jsx  # Post-mission loot & XP screen
\`\`\`

---

## Tech Stack

- **React 18** + **Vite 5**
- Vanilla CSS injected as JS string (zero dependencies for styles)
- Google Fonts: Orbitron · Exo 2 · Share Tech Mono

---

## Roadmap

See the full [Game Design Document](docs/SpaceScouts_GDD.docx) for the complete vision.

- [ ] Persistent save via localStorage
- [ ] Equipment inventory & equip system
- [ ] Galactic Market (buy/sell)
- [ ] More biomes, enemy factions, mission types
- [ ] Captain talent tree UI
- [ ] Co-op missions (2 players)
- [ ] Account system (email + password, no extra data)
- [ ] PayPal microtransactions (cosmetics only)

---

## License

MIT — prototype / pre-production. All game content © Space Scouts project.
