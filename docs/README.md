# UI Sketch Documentation

**English · [한국어](./ko/README.md)**

![A UI Sketch wireframe rendered inline in a note](./img/hero.png)

User-facing reference for the UI Sketch Obsidian plugin — render mid-fidelity web UI wireframes inside Obsidian notes from a short YAML block. For installation and an overview, see the [main README](https://github.com/jkRaccoon/obsidian-ui-sketch#readme).

## Sections

- **[Getting Started](./getting-started.md)** — your first sketch in 5 minutes.
- **[YAML Reference](./yaml-reference.md)** — complete syntax: viewport, screen, row/col, grid, and base props.
- **[Component Reference](./components/README.md)** — all 44 components, organized by category, with prop tables and examples.
- **Recipes** — copy-paste templates for common layouts:
  - [Dashboard](./recipes/dashboard.md) — grid-based admin layout
  - [Login form](./recipes/login-form.md) — centered mobile form
  - [Settings panel](./recipes/settings-panel.md) — two-column settings screen
- **[Troubleshooting](./troubleshooting.md)** — error levels, common mistakes, FAQ.

## Versioning

These docs track the plugin version. If a prop or component behaves differently from what's documented, check `manifest.json` — the docs in the `main` branch reflect the latest release on GitHub.

## Design docs

For internal design specs and implementation plans, see [`superpowers/`](./superpowers/). Those are not for users — they document how the plugin is built.
