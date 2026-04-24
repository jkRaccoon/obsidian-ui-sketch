# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Obsidian community plugin that renders mid-fidelity web UI wireframes from YAML inside a ` ```ui-sketch ` fenced code block. Entry point is `src/main.ts`; esbuild bundles everything to `main.js` at the repo root (alongside `manifest.json` and `styles.css`, which is how Obsidian loads a plugin).

## Commands

Package manager is **yarn 3** (`packageManager` pinned in `package.json`; `.yarnrc.yml` uses `nodeLinker: node-modules`). Requires Node 18+.

```bash
yarn dev         # esbuild watch (sourcemaps, no minify) → main.js
yarn build       # tsc --noEmit && esbuild production bundle → main.js
yarn test        # vitest run (happy-dom environment)
yarn test:watch  # vitest watch
yarn typecheck   # tsc --noEmit
```

Run a single test file or filter: `yarn test tests/components/button.test.ts` or `yarn test -t "renders a button"`.

The build step runs `tsc --noEmit` first — a type error fails the build. esbuild does not typecheck on its own.

## Architecture

### Rendering pipeline

`src/main.ts` registers a markdown code-block processor for the `ui-sketch` language. Each render is a pure function `source → HTMLElement` with zero runtime state, orchestrated by `renderSource()` in `src/renderer/index.ts`:

1. **Empty check** → `renderEmptyPlaceholder()` (L4).
2. **`parser/`** (`js-yaml`) → YAML to raw object. Top-level must be a mapping, otherwise L1 error box with line/col.
3. **`schema/document.ts`** → structural validation (viewport, background, theme, screen shape). L2 error box with path.
4. **`renderer/safety.ts`** → enforces `MAX_DEPTH=32` and `MAX_NODES=5000` over the screen tree. This is also the defense against YAML alias bombs (js-yaml 4.x doesn't support `maxAliasCount`).
5. **`renderer/layout.ts`** → dispatches layout nodes (`row` / `col` / `grid` / `component`). Grid and flex-array are mutually exclusive at the root.
6. **`styler/`** → wraps the rendered tree in a viewport frame (`data-viewport`, `data-theme`, `data-background`).

The `row` and `col` keys are reserved layout primitives, parsed in `schema/layout.ts`; everything else is treated as a component entry.

### Component registry

Components live under `src/components/`, one file per component, each exporting a `ComponentDef` (`type`, optional zod `schema`, `render(props, ctx)`). They register into a module-level `Map` via `register()` in `src/components/registry.ts`.

Installation is a single-shot side effect: `installBuiltinComponents()` in `src/components/index.ts` iterates a list of every def and calls `register()`. **Adding a new component requires both creating the file and appending it to that list** — the registry will not pick it up automatically.

- `src/main.ts` calls `installBuiltinComponents()` in `onload()`.
- Tests that go through `renderSource` (e.g. `tests/renderer/snapshot.test.ts`) must also call it once at module top-level; tests that import a `ComponentDef` directly do not.
- Component schemas extend `BasePropsSchema` from `src/schema/base.ts` (adds `id`/`w`/`h`/`align`/`pad`/`note`/`muted`) and use `.passthrough()` so extra props don't cause validation errors.
- Base layout props (`w`/`h`/`align`/`muted`) are applied by `applyBaseLayout()` in `renderer/layout.ts`, not inside each component — the component renderer only handles its own type-specific props.

### Error model

Four levels, defined in `src/errors/`:

- **L1 YAML** — full-block red box (`renderErrorBox`).
- **L2 Structure** — full-block red box with YAML path.
- **L3 Component** — **inline** red box via `renderInlineError`; the surrounding wireframe still renders. Triggered by unknown `type` (with Levenshtein-≤2 suggestion from `schema/suggestions.ts`) or zod schema failure.
- **L4 Empty** — friendly placeholder with a starter example.

When adding a component, a schema failure is surfaced as L3 using the first zod issue's path and message. Keep schemas permissive where the runtime doesn't truly care.

### Security

The `raw:` component is the only HTML escape hatch. All `html` input is piped through `sanitize-html` with a narrow allow-list (`src/components/raw.ts`) — never expand this without a specific reason.

### Theming

All styling lives in `styles.css` at the repo root and consumes Obsidian CSS variables (`--interactive-accent`, `--background-primary`, etc.). **Do not hard-code colors** — if a new component needs a color, use an existing Obsidian variable. The plugin supports only `theme: adaptive` today; other values are rejected at validation.

## Conventions

- TypeScript path alias: `@/*` → `src/*` (configured in both `tsconfig.json` and `vitest.config.mts`).
- Test layout mirrors `src/` under `tests/`. Snapshot fixtures live in `tests/fixtures/*.yaml`.
- Design context lives in `docs/superpowers/specs/` (spec) and `docs/superpowers/plans/` (implementation plans). Consult these before large changes.
- README documents all 44 components and the YAML surface — it is the user-facing contract. Keep the catalog section in sync when adding/removing components.
