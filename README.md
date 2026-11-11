# Apex Grid — Time Trial

A top-down open-wheel time-trial racer that runs in the browser. It has 24 circuits (real layouts, parody names), 6 car liveries, sector timing, ghost laps, ERS and DRS boost, three crash modes, and engine sound made with the Web Audio API.

Built with React 19, TypeScript, Vite 8 and Tailwind CSS 4. Everything runs in the browser: there is no backend and no API key is needed.

## Prerequisites

- **Node.js 20.19+ or 22.12+** (Vite 8 needs one of these; tested on Node 26)
- **npm** (comes with Node)

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open **http://localhost:3000** and press **Enter** or **Space** on the title screen to start.

## Scripts

| Command           | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Dev server on port 3000 (listens on `0.0.0.0`, so other devices on your network can open it) |
| `npm run build`   | Production build to `dist/`                                   |
| `npm run preview` | Serves the production build to test it locally               |
| `npm run lint`    | Type-checks with `tsc --noEmit`                               |
| `npm run clean`   | Deletes `dist/`                                               |

## Deploying

`npm run build` creates a static site in `dist/`. You can upload that folder to any static host, such as Netlify, Vercel, GitHub Pages, S3 or nginx. No server is needed.

## Controls

| Key                 | Action                  |
| ------------------- | ----------------------- |
| `W` / `↑`           | Throttle                |
| `S` / `↓`           | Brake                   |
| `A` `D` / `←` `→`   | Steer                   |
| `Space` / `Shift`   | ERS boost (hold)        |
| `E`                 | Open DRS (in DRS zones) |
| `C`                 | Switch between chase and overview camera |
| `R`                 | Reset car / lap         |
| `Esc`               | Pause                   |

Touch devices get on-screen buttons.

## Crash modes

Click the **Mode** button on the title screen to switch between them:

| Mode         | When the car explodes                                                      |
| ------------ | -------------------------------------------------------------------------- |
| Simcade      | Only when almost the whole car is off the track at high speed; otherwise the gravel just slows you down |
| Pro Hardcore | As soon as half the car is off the track, at any speed                     |
| Sudden Death | The instant any part of the car crosses the outer edge of the kerbs        |

After an explosion, the car respawns and the lap restarts. Best laps and ghosts are saved per track in `localStorage` under keys named `apex_grid_<trackId>`.

## Project structure

```
index.html              Entry HTML (loads Google Fonts and src/main.tsx)
src/
  main.tsx              React root
  App.tsx               Game state machine: title, racing, pause and lap summary
  game/
    gameEngine.ts       Physics, input, rendering, timing, ghosts and saved best laps
    tracks.ts           Circuit definitions (24 tracks)
    carLiveries.ts      Car colour schemes
  audio/soundSystem.ts  Engine and effect sounds made with Web Audio
  components/           Title screen, HUD, pause and lap-summary overlays
  types/game.ts         Shared TypeScript types
```
