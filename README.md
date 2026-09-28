# Wearform — Personal T-shirt Studio

An original, dark, responsive design studio with a neutral slim youth mannequin, independent front/back artwork, live color and rotation controls, and a two-sided PNG design-sheet export.

## Run locally

Requires Node.js 22.12+ and pnpm 11.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm test
pnpm build
pnpm preview
```

The production build is the `dist/` directory. No backend, API keys, database, or paid service is required.

## Deploy

### GitHub Pages

In repository Settings → Pages → Build and deployment, choose **GitHub Actions**. Run the **Deploy to GitHub Pages** workflow from the Actions tab. Future pushes to `main` also build and deploy. The relative Vite base supports the `/protest/` project path.

### Vercel / Netlify / another static host

Import this repository, use `pnpm build`, and publish `dist`. Vite is usually detected automatically. No environment variables are needed.

## Personalize

- Edit `src/config.js` for the brand name, neutral 2 October note, colors, and optional avatar URL.
- Upload PNG/JPG/WebP images up to 8 MB into either print area. Artwork is decoded locally and never sent to a server. Refreshing the page clears the session; save the design sheet before leaving.
- Put a licensed/consented GLB model in `public/`, then set `AVATAR.modelUrl` to a relative path such as `./avatar.glb`. The loader expects feet at y=0, height about 3.4 scene units, facing +Z. Adjust scale/position/rotation in config and align the two print surfaces in `src/preview.js` for your garment. Color controls target the built-in mannequin; custom GLB garment materials may need to be connected explicitly.
- The procedural mannequin is a faceless placeholder for a slim 17-year-old male body. It does not claim to reproduce anyone's face or exact measurements.
- Uploaded art is shown on flat placement surfaces, not a cloth-physics simulation. Export is a concept sheet, not a manufacturing-ready print file. Confirm measurements and print settings with your printer.

## Accessibility and resilience

Semantic sections, labeled controls, keyboard-operable front/back and rotation controls, visible focus, a skip link, live upload feedback, reduced-motion support, and mobile/touch layout. Auto rotation starts off, stops on manual interactions, and pauses offscreen or in a hidden tab. If WebGL is unavailable, a flat preview keeps front/back editing and export available. Font loading has local sans-serif fallbacks.

## Project map

- `src/main.js`: editor UI, file validation, local uploads, export
- `src/preview.js`: Three.js mannequin, print planes, lighting and camera
- `src/design.js`: image validation and geometry helpers
- `src/config.js`: brand and replacement avatar configuration
- `src/style.css`: responsive design
- `tests/design.test.js`: artwork validation, image aspect ratio and rotation tests

The visual reference informed the immersive mannequin-centered interaction. No reference-site code, imagery, personal likeness, or sponsorship data was copied. Event copy is informational and politically neutral.
