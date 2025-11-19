# Project — Vite + React + TypeScript (with Tailwind)

This repository is a Vite + React + TypeScript frontend scaffold configured with Tailwind CSS, ESLint, and basic tooling. The README below helps collaborators get the project running locally, follow quality gates, and contribute.

## Quick overview

- Framework: React + TypeScript
- Bundler: Vite
- CSS: Tailwind CSS (PostCSS)
- Linting: ESLint

Files of interest:

- `src/` — application source files
- `index.html` — app entry
- `vite.config.ts` — Vite configuration
- `tsconfig.app.json` / `tsconfig.json` — TypeScript config
- `tailwind.config.js`, `postcss.config.js` — Tailwind/PostCSS
- `eslint.config.js` — ESLint configuration

## Prerequisites

- Node.js (recommended LTS). This project uses modern tooling — Node 18+ is recommended. If you use nvm/nvs/Volta, pick an LTS build (18 or 20).
- A package manager: npm (examples below use npm). pnpm or yarn should also work.

Note: `package.json` ships with these scripts: `dev`, `build`, `preview`, `lint`, and `typecheck`.

## Setup (first time)

Open a terminal in the project root and run:

```powershell
npm install
```

Alternatives:

- pnpm: `pnpm install`
- yarn: `yarn install`

## Run the dev server

```powershell
npm run dev
```

This starts Vite's dev server (hot module replacement). By default it will log the local and network URLs.

## Build and preview

Build for production:

```powershell
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

## Linting and type-checking

Run ESLint across the codebase:

```powershell
npm run lint
```

Run TypeScript type-check only (no emit):

```powershell
npm run typecheck
```

## Environment variables

If the app requires secrets or API URLs, add a `.env` file at the project root (do NOT commit secrets). Common names:

- `.env` — general env
- `.env.local` — local overrides (ignored in many setups)

Example `.env` entries (do not commit):

```
VITE_API_URL=https://api.example.com
VITE_SUPABASE_URL=https://your-supabase-url
VITE_SUPABASE_KEY=public-anon-key
```

Note: Vite exposes env variables prefixed with `VITE_` to the client.

## Development tips

- Editor: VS Code is recommended. Helpful extensions: ESLint, Prettier, Tailwind CSS IntelliSense, TypeScript Hero.
- If Tailwind utilities don't apply, ensure `index.css` imports the Tailwind base, components, and utilities and that `tailwind.config.js` includes the correct `content` globs.
- If you change TypeScript config or plugins, restart the TypeScript server in your editor.

## Commit & PR guidelines

- Keep changes small and focused.
- Run `npm run lint` and `npm run typecheck` locally before opening a PR.
- Describe the change, include screenshots for UI changes, and link any related issue.

## Quality gates (quick checklist)

Before merging a PR, prefer to verify these locally:

- Build: `npm run build` — should complete without errors.
- Lint: `npm run lint` — fix ESLint issues.
- Types: `npm run typecheck` — no new type errors.

If any of these fail on CI, reproduce locally and fix before merging.

## Troubleshooting

- Node version mismatch: use nvm/Volta to match the recommended Node LTS.
- Port in use: Vite will choose another port, or run `npx kill-port 5173` (or use a different port with `--port`).
- Missing env keys: verify `.env` is present and contains required `VITE_` variables.
- Tailwind not compiling: check `postcss.config.js` and ensure `tailwindcss` is installed and up-to-date.

## Useful commands summary

```powershell
# Install deps
npm install

# Dev
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Typecheck
npm run typecheck
```

## Where to go next

- Explore `src/` and `components/` to understand the app structure.
- Look at `vite.config.ts` for aliases and plugin configurations.
- Check `tailwind.config.js` for design tokens and customizations.

---

If you'd like, I can also add a `.github/` PR template, a small CONTRIBUTING.md, or a `.vscode/extensions.json` with recommended extensions. Tell me which of those you'd like and I can add them.

<!-- End of README -->
