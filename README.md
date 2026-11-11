# For You — A Little Surprise

A cinematic, scroll-driven gift journey from Dubai to Paris, built with React, TypeScript, Vite, GSAP, Three.js, and inline SVG illustrations.

## The Experience

1. A wrapped letter introduces the journey.
2. The gift is packed in Dubai.
3. A three.js aircraft crosses a golden sky while petals trail behind it.
4. A garden blooms with red roses, lavender, and a golden puppy.
5. A runway cutscene loads the parcel and bouquet before takeoff.
6. The parcel lands in Paris with a delivery card.
7. The gift box opens into a bouquet, a puppy, and a replayable finale.

The site is responsive, respects `prefers-reduced-motion`, and uses inline SVG illustrations instead of external image assets.

## Tech Stack

- React 19
- TypeScript
- Vite 8
- GSAP + ScrollTrigger
- Three.js
- Anime.js 4 (legacy scenes kept in `src/App.tsx` and `src/scenes/`)
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

The Node server also serves the pretty path `/for-you`; `/for-you/` redirects to `/for-you` so relative assets keep working.

To preview the build with Vite:

```bash
npm run preview
```

## Personalize

Edit `src/config.ts` for the recipient name, signature, route, and distance. The recipient falls back to “For you” when left empty.

Story copy and the scroll timeline live in `src/experience/Experience.tsx`. Theme colors and responsive rules live in `src/experience/experience.css`. Illustrations are in `src/components/illustrations/`.

## Deployment

- Render instructions, including the `npm run build` and `npm start` setup, are in [DEPLOY.md](DEPLOY.md).
- GitHub Pages deploys through `.github/workflows/static.yml`, which builds `dist/` and publishes it.
- `vite.config.ts` uses `base: './'` so the build works from a repository subpath.
- The `/for-you` slug requires the Node server or an equivalent rewrite. Static hosts serve the site at their root or repository subpath.

## Local Network

`npm start` binds to `0.0.0.0`, so other devices on the same Wi-Fi can open:

```text
http://YOUR_LOCAL_IP:4173/for-you
```

If another device cannot connect, allow Node.js or TCP port `4173` through Windows Firewall.

## Project Structure

```text
src/
  components/        UI, effects, and inline SVG illustrations
  experience/        Scroll-driven Dubai → Paris experience, audio, and 3D box
  three/             Three.js flight world and petal trail
  hooks/             Shared helpers (legacy scroll helper retained)
  scenes/            Legacy Anime.js scenes (not mounted)
  App.tsx            Legacy scene app (not mounted)
  config.ts          Gift and route configuration
  motion.ts          Reduced-motion helpers
  main.tsx           Mounts the experience
server.mjs           Production static server for npm start
DEPLOY.md            Render deployment guide
```
