## Task: E-49 — Production Build & Deploy

### Problem
The game runs locally via `npm run dev` but has never been built for production or deployed. Need a working production build deployed to a public URL.

### What to Build

1. **Production build** — `npm run build` should produce an optimized `dist/` folder with:
   - Minified JS
   - Optimized assets
   - Proper base path for deployment

2. **Deploy to GitHub Pages** — since the repo is already on GitHub (`thegizmopro/happy-nerds`), deploy to GitHub Pages:
   - URL: `https://thegizmopro.github.io/happy-nerds/`
   - Base path: `/happy-nerds/`
   - Deploy the `dist/` folder via `gh-pages` branch or GitHub Actions

3. **Vite config update** — set `base: '/happy-nerds/'` in `vite.config.js` so asset paths are correct on GitHub Pages

4. **Deploy script** — add `npm run deploy` that builds and pushes to gh-pages branch

### Implementation Details

**In `vite.config.js`:**
```js
export default defineConfig({
  base: '/happy-nerds/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
```

**In `package.json`:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vite build && gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.0.0"
  }
}
```

**GitHub Pages deployment:**
1. Install gh-pages: `npm install -D gh-pages`
2. Run `npm run deploy` — this builds and pushes dist/ to gh-pages branch
3. In GitHub repo settings, enable GitHub Pages from gh-pages branch

**Also add a proper `index.html` title and meta tags:**
- Title: "Happy Nerds — Math Arcade"
- Meta description
- Favicon (can be a simple emoji favicon for now)
- Viewport meta tag for mobile

### Files to Modify
- `vite.config.js` — base path + build config
- `package.json` — deploy script + gh-pages dependency
- `index.html` — title, meta tags, favicon

### Constraints
- Must work on GitHub Pages (static hosting, no server)
- Must handle the `/happy-nerds/` base path correctly for all assets
- Do NOT modify any game logic or level data
- The dev server should still work with `npm run dev`

### Verification
1. `npm run build` produces a working dist/ folder
2. `npm run preview` serves the built version correctly
3. All assets (JS, CSS) load with correct paths including base
4. Game is playable in the production build
5. `npm run deploy` pushes to gh-pages branch
6. Game loads at https://thegizmopro.github.io/happy-nerds/
