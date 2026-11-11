# Deploy For You — A Little Surprise on Render

This project is a Vite + React static site. The production files are generated into `dist/`. Use the `/for-you` path when serving through `server.mjs` (Render Web Service); static hosts serve the site from their root or repository subpath.

## Option A: Render Web Service (uses `npm start`)

Use this if you specifically want the commands:

- Build Command: `npm run build`
- Start Command: `npm start`

The included `server.mjs` serves the built `dist/` directory on Render's assigned `PORT`.

### Render settings

1. Create a new **Web Service** on Render and connect the repository.
2. Set **Runtime** to `Node`.
3. Set **Build Command** to `npm run build`.
4. Set **Start Command** to `npm start`.
5. Leave the port setting on Render's default. The app reads `process.env.PORT`.
6. Deploy.

### Local check

```bash
npm install
npm run build
npm start
```

Open `http://localhost:4173/for-you`.

## Option B: Render Static Site (recommended)

A static site is simpler and does not need a start command.

### Render settings

1. Create a new **Static Site** on Render and connect the repository.
2. Set **Build Command** to `npm run build`.
3. Set **Publish Directory** to `dist`.
4. Deploy.

No `npm start` command is used for a static site.

## Notes

- `npm run build` runs `tsc --noEmit` and then `vite build`.
- `vite.config.ts` uses `base: './'`, so the build works from a subpath.
- `server.mjs` serves `index.html` for `/for-you` and redirects `/for-you/` to `/for-you`.
- The GitHub Pages workflow builds the same `dist/` output. GitHub Pages does not run `server.mjs`, so it serves the experience at the repository path instead of `/for-you`.
- If the build fails on Render, ensure the Node version is 20.19+ or 22.12+.
