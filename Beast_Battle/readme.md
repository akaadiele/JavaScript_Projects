# Beast Battle

A small browser-based Role-Playing Game (RPG) built with HTML, CSS, and vanilla JavaScript.

## Project summary
- Single-page game with button-driven navigation between Town Square, Store, Cave, and Fight states.
- Player starts with XP, Health, Gold, and a basic weapon, then upgrades by buying/selling weapons and defeating monsters.
- Combat uses monster level, weapon power, and random chance to determine hits, damage, and weapon break events.
- Includes win/lose states, restart flow, and a hidden easter-egg mini game for bonus gold.

## Code breakdown
- `beast_battle.html`: game layout (stats, controls, monster panel, and text output area).
- `beast_battle.css`: visual styling for the game container, stats, controls, and combat panel.
- `beast_battle.js`: game state, location routing, shop actions, combat logic, and restart/easter-egg behavior.

## Run
Open `beast_battle.html` in a browser.
No backend or package installation is required.
