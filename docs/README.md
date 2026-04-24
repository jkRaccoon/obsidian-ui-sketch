# UI Sketch Documentation

User-facing reference for the UI Sketch Obsidian plugin. For installation and a quick overview, see the [main README](../README.md).

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
