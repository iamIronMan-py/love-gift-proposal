# Dubai to Canada Gift

A cinematic, interactive gift-surprise journey built with React, TypeScript, Vite, and Anime.js. The story travels from Dubai to Canada through seven illustrated scenes, ending with a puppy, flowers, and a personal note.

## The Experience

1. A wrapped letter introduces the journey.
2. The gift is packed and sealed in Dubai.
3. The parcel crosses the world on an animated flight path.
4. A garden blooms with flowers and a golden puppy.
5. The parcel lands in Canada with a delivery card.
6. The ribbon is untied and the box opens.
7. The finale reveals the puppy, the garden, and a replayable ending.

The site is responsive, respects `prefers-reduced-motion`, and uses inline SVG illustrations instead of external image assets.

## Tech Stack

- React 19
- TypeScript
- Vite 8
- Anime.js 4
- Plain CSS with custom properties

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To expose the dev server on your local network:

```bash
npm run dev -- --host
```

## Production Build

```bash
npm run build
npm start
```

`npm run build` type-checks the project and writes the production site to `dist/`. `npm start` serves `dist/` on `0.0.0.0:4173` by default and uses `process.env.PORT` when provided.

To preview the build with Vite:

```bash
npm run preview
```

## Personalize

Edit `src/config.ts` for the recipient name, signature, route, and distance. The recipient falls back to “For you” when left empty.

Scene copy lives in `src/scenes/`. Theme colors, spacing, and responsive rules live in `src/styles.css`. Illustrations are in `src/components/illustrations/`.

## Deployment

- Render instructions, including the `npm run build` and `npm start` setup, are in [DEPLOY.md](DEPLOY.md).
- GitHub Pages deploys through `.github/workflows/static.yml`, which builds `dist/` and publishes it.
- `vite.config.ts` uses `base: './'` so the build works from a repository subpath.

## Local Network

`npm start` binds to `0.0.0.0`, so other devices on the same Wi-Fi can open:

```text
http://YOUR_LOCAL_IP:4173
```

If another device cannot connect, allow Node.js or TCP port `4173` through Windows Firewall.

## Project Structure

```text
src/
  components/        UI, effects, and inline SVG illustrations
  hooks/             Shared scene entrance animation
  scenes/            The seven story scenes
  App.tsx            Scene state, preloader, veil transitions, replay
  config.ts          Gift and route configuration
  motion.ts          Reduced-motion helpers
  styles.css         Design system and responsive layout
server.mjs           Production static server for npm start
DEPLOY.md            Render deployment guide
```
