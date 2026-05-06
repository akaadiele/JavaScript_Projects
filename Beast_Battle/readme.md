# Beast Battle — README (standardized)

A compact browser RPG demo implemented with plain HTML, CSS, and JavaScript. The game is single-file and runs entirely in the browser.

## Overview
- What: Lightweight button-driven RPG (Town, Store, Cave, Fight) with combat, equipment, gold economy, and a hidden mini-game.
- Goal: Defeat monsters, upgrade weapons, and reach the win condition while managing health and resources.

## Key Features
- Single-page UI with location states and contextual controls.
- Weapon shop (buy/sell/upgrades) and inventory displayed in the UI.
- Combat system based on weapon power, monster level, and randomness (chance to hit, variable damage, weapon break events).
- Win/Lose flows and a restart option.

## Files
- `Beast_Battle/beast_battle.html` — main game file (includes markup, styles, and script references).
- `Beast_Battle/beast_battle.css` — styles for layout, panels, and responsive tweaks.
- `Beast_Battle/beast_battle.js` — game logic: state management, locations, shop, combat, and easter-egg handling.

## Run / Play
1. Open the project folder and launch `Beast_Battle/beast_battle.html` in any modern browser.
2. Use the on-screen buttons to navigate locations, buy/sell, and fight monsters.
3. If you want to iterate on the code, edit `beast_battle.js` and refresh the page.

No build step or backend is required.

## Developer Notes
- Designed for learning: minimal dependencies and clear separation of UI/state logic.
- To debug: open browser DevTools console to view game logs and state output.
- Suggested improvements: add persistent storage (localStorage), unit tests for combat logic, and accessibility enhancements for keyboard navigation.

