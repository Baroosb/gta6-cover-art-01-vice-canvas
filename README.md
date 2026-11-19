[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/Baroosb/gta6-cover-art-01-vice-canvas/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/Baroosb/gta6-cover-art-01-vice-canvas/reward.svg)](https://make.fun/bounty/gta6-cover-art-01/reward?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

# VICE CANVAS

An entry in make.fun's [Make GTA 6 Cover Art](https://make.fun/bounty/gta6-cover-art-01) bounty.

## What it does

**VICE CANVAS** is a fully-featured, offline-first, GTA-inspired cover art maker built as a pure client-side web application using ES modules and the HTML5 Canvas API. It empowers users to compose multi-panel GTA-style posters, mix and match sample assets or uploaded photos, fine-tune compositions with interactive pan and zoom, apply cinematic colour grading, and export production-ready cover art PNGs at multiple resolutions.

## How to run it

Run the included static file server locally:

```bash
node serve.ts
```

Then open your browser at **http://localhost:8080**. Alternatively, any static file server pointing to the `app/` directory will serve the application.

## Features

- **Multi-Panel Layouts**: Choose between **Poster** (hero top panel + 3 bottom panels), **6-Grid**, **Duo Split**, and **Quad Grid** layouts.
- **Cinematic Colour Grades**: Apply signature 80s neon-noir and tropical aesthetic grades: *Sunset Vice*, *Neon Nights*, *Golden Hour*, and *Raw Print*.
- **Per-Panel Pan & Zoom**: Select any panel on the canvas, drag to pan the photo framing, and use the mouse wheel or slider to zoom.
- **Spread Mode**: Toggle full-canvas spread mode to feature a single image across the entire canvas with crisp white keylines.
- **Custom Captions & Typography**: Fully customizable title and subtitle rendered using the **Anton** display font with auto-scaling, bold outlines, and drop shadows.
- **Three Export Sizes**: Export high-resolution PNGs instantly at 1:1 Square (1080x1080), 4:5 Portrait (1080x1350), or 16:9 Landscape (1920x1080).

## Licensing & Assets

- **Display Font**: **Anton** (SIL Open Font License 1.1), stored in `app/fonts/`.
- **Sample Photos**: Four sample photos (`boulevard-car.jpg`, `neon-man.jpg`, `neon-woman.jpg`, `pier-sunset.jpg`) located in `app/samples/`, generated specifically for this application.
