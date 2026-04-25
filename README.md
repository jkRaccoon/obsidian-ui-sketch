# UI Sketch

**English · [한국어](./README.ko.md)** · 📖 [**Full docs**](https://jkraccoon.github.io/obsidian-ui-sketch/)

> Render mid-fidelity web UI wireframes inside Obsidian notes — with YAML, not ASCII.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Obsidian](https://img.shields.io/badge/Obsidian-1.5%2B-7c3aed)](https://obsidian.md)
[![Sponsor](https://img.shields.io/github/sponsors/jkRaccoon?label=Sponsor&logo=GitHub)](https://github.com/sponsors/jkRaccoon)
[![Tests](https://img.shields.io/badge/tests-115%20passing-brightgreen)](./tests)

---

Tired of fighting ASCII box drawings inside your spec notes? **UI Sketch** turns short, readable YAML into a clean wireframe right inside your Obsidian pane — theme-adaptive, live-previewable, and never out of sync with your prose.

```yaml
viewport: desktop
screen:
  - navbar: { brand: "DocHub", items: ["Home", "Docs", "Pricing"] }
  - row:
      gap: 16
      items:
        - col:
            flex: 1
            items:
              - sidebar: { items: ["Getting Started", "API", "FAQ"] }
        - col:
            flex: 3
            items:
              - heading: { level: 1, text: "Welcome back" }
              - row:
                  gap: 12
                  items:
                    - card: { title: "Tasks", body: "12 open" }
                    - card: { title: "Docs",  body: "3 drafts" }
              - button:
                  label: "New document"
                  variant: primary
                  note: "Navigates to /documents/new"
```

![DocHub dashboard rendered by UI Sketch](./docs/img/hero.png)

Drop that in a ` ```ui-sketch ` fenced block. Switch to Reading view. There's your wireframe — live in your note, adapting to your Obsidian theme, never out of sync with your prose.

---

## ✨ Why UI Sketch

| Pain | Before | After |
|---|---|---|
| Aligning columns in a spec | `│ Header │ Actions │` ASCII gymnastics | `- row: { items: [...] }` |
| Tweaking layout | Retype the entire diagram | Edit one line of YAML |
| Reading another writer's sketch | Decode what the boxes meant | Render it and see |
| Keeping vault consistent with theme | Manual color adjustments | Uses Obsidian CSS variables automatically |

- **Mid-fi by design.** Not a Figma replacement — a *fast sketching* tool that lives in your notes.
- **Theme-adaptive.** Bright, dark, community themes: UI Sketch inherits them via `var(--interactive-accent)` & friends.
- **Friendly errors.** YAML typo? You get a red box with line number. Unknown component? It suggests the closest real one (Levenshtein).
- **Safe.** Depth caps and node-count caps prevent runaway blocks. The `raw:` escape hatch runs through `sanitize-html` — no XSS surface.
- **Zero runtime state.** Each render is a pure function from YAML to DOM. No surprises in Live Preview.

Sketches scale from desktop to mobile with a single `viewport:` key:

<table>
<tr>
<td width="50%" valign="top">

**`viewport: mobile`** — a 375px login form from [the recipe](./docs/recipes/login-form.md):

![Mobile login form sketch](./docs/img/recipes/login-form-1.png)

</td>
<td width="50%" valign="top">

**`viewport: desktop`** with a named-area grid from [the dashboard recipe](./docs/recipes/dashboard.md):

![Dashboard grid layout](./docs/img/recipes/dashboard-1.png)

</td>
</tr>
</table>

---

## 🚀 Quick Start

### 1. Install

**BRAT beta (recommended during early versions)**:
1. Install the [BRAT](https://github.com/TfTHacker/obsidian42-brat) community plugin.
2. BRAT → "Add Beta plugin" → `jkRaccoon/obsidian-ui-sketch`.
3. Enable **UI Sketch** in Community plugins.

**Manual**:
1. Download `main.js`, `manifest.json`, and `styles.css` from [the latest release](https://github.com/jkRaccoon/obsidian-ui-sketch/releases).
2. Copy them into `<your-vault>/.obsidian/plugins/ui-sketch/`.
3. Enable the plugin in Settings.

### 2. Write your first sketch

In any note, add a fenced code block tagged `ui-sketch`:

````markdown
```ui-sketch
screen:
  - navbar: { brand: "MyApp" }
  - button: { label: "Sign in", variant: primary }
```
````

Switch to Reading view (`Ctrl/Cmd+E`). You'll see a rendered wireframe.

### 3. Go deeper

Full docs live in [**`docs/`**](./docs/README.md):

- [Getting Started](./docs/getting-started.md) — a 5-minute tutorial
- [YAML Reference](./docs/yaml-reference.md) — complete syntax
- [Component Reference](./docs/components/README.md) — prop tables & examples for all 44 components
- [Recipes](./docs/recipes/dashboard.md) — copy-paste templates for common screens
- [Troubleshooting](./docs/troubleshooting.md) — error levels & common fixes

---

## 🧩 Component Catalog

**44 components across 8 categories, plus one escape hatch.** Every component accepts the base props (`id`, `w`, `h`, `align`, `pad`, `note`, `muted`) on top of its type-specific props. For detailed prop tables, click through to the [Component Reference](./docs/components/README.md).

| Category | Components |
|---|---|
| [**Layout structure**](./docs/components/layout.md) | `container` · `card` · `panel` · `divider` · `spacer` |
| [**Navigation**](./docs/components/navigation.md) | `navbar` · `sidebar` · `tabs` · `breadcrumb` · `pagination` · `stepper` |
| [**Basic input**](./docs/components/input-basic.md) | `button` · `input` · `textarea` · `select` · `checkbox` · `radio` |
| [**Advanced input**](./docs/components/input-advanced.md) | `toggle` · `slider` · `date-picker` · `file-upload` · `search` |
| [**Display**](./docs/components/display.md) | `heading` · `text` · `image` · `icon` · `avatar` · `badge` · `tag` · `kbd` |
| [**Feedback**](./docs/components/feedback.md) | `alert` · `progress` · `toast` · `modal` · `skeleton` |
| [**Data**](./docs/components/data.md) | `table` · `list` · `tree` · `kv-list` |
| [**Placeholder**](./docs/components/placeholder.md) | `chart` · `map` · `video` · `placeholder` |
| [**Escape hatch**](./docs/components/raw.md) | `raw` (sanitized HTML) |

### A few examples

```yaml
alert:
  severity: warn
  title: "Heads up"
  message: "Review before committing."

table:
  columns: ["Name", "Role", "Status"]
  rows:
    - ["Ada",  "PM",  "✓"]
    - ["Ben",  "ENG", "…"]

tree:
  items:
    - label: "src"
      children:
        - { label: "main.ts" }
        - { label: "types.ts" }
    - { label: "docs" }

kbd:
  keys: ["Ctrl", "K"]
```

---

## 📐 YAML structure

See [**YAML Reference**](./docs/yaml-reference.md) for complete syntax. Quick overview:

Top-level keys:

```yaml
viewport: desktop | tablet | mobile | custom   # default: desktop (1200px)
width: 375                                      # custom only
height: 640                                     # custom only
theme: adaptive                                 # v0.2 only supports "adaptive"
background: default | muted | transparent
screen:                                         # required: either an array OR a grid
  - ...
```

Two layout models, mutually exclusive at the root:

**Flex (row/col nesting)** — primary model, fits 99% of web UIs:

```yaml
screen:
  - row:
      gap: 12
      items:
        - col: { flex: 1, items: [ { sidebar: {...} } ] }
        - col: { flex: 3, items: [ ... ] }
```

**Named-area grid** — for dashboard layouts:

```yaml
screen:
  grid:
    areas:
      - "nav  nav  nav"
      - "side main main"
      - "side foot foot"
    cols: "180px 1fr 1fr"
    rows: "56px 1fr 48px"
    map:
      nav:  { navbar: { brand: "MyApp" } }
      side: { sidebar: { items: ["Home", "Docs"] } }
      main: { card:    { title: "Welcome" } }
      foot: { text:    { value: "© 2026" } }
```

---

## 🛡️ Error handling

UI Sketch never silently fails. You always see something actionable.

| Level | When | Result |
|---|---|---|
| **L1** YAML parse error | Malformed YAML | Full-block error box with line/col |
| **L2** Structure error | Missing `screen`, unknown viewport, etc. | Full-block error box with path |
| **L3** Component error | Unknown component type or invalid props | Inline error box at that component's position — rest of the wireframe still renders |
| **L4** Empty block | No content | Friendly placeholder with a starter example |

**Typo suggestions** (Levenshtein distance ≤ 2):

> ⚠ `butn`: unknown component type · Did you mean "button"?

**Safety caps**:
- Max tree depth: **32**
- Max node count: **5000 per block**
- `raw:` HTML is always piped through `sanitize-html` — no `<script>`, no inline event handlers.

For common causes and fixes, see [**Troubleshooting**](./docs/troubleshooting.md).

---

## ⚙️ Settings

Open Settings → Community plugins → **UI Sketch**:

| Setting | Default | Notes |
|---|---|---|
| Default viewport | `desktop` | Applied to any block that omits `viewport:` |
| Default theme | `adaptive` | Locked in v0.2 |
| Compact mode | Off | Scales spacing and fonts by ×0.875 — useful when stacking several blocks in one note |

---

## 🛠️ Development

```bash
# Requires Node 18+
npm install

npm run dev        # esbuild watch mode
npm test           # vitest (happy-dom)
npm run typecheck  # tsc --noEmit
npm run build      # production bundle → main.js
```

Plugin files at repo root:
- `main.js` — bundled plugin
- `manifest.json` — plugin metadata for Obsidian
- `styles.css` — theme-adaptive styling

Source organized by responsibility:

```
src/
├── main.ts                Plugin lifecycle, code-block processor
├── settings.ts            Settings tab + data model
├── types.ts               Shared AST types
├── parser/                YAML → document (+ location info)
├── schema/                Structural validation + per-component zod
├── components/            44 builtin components, each a single file
├── renderer/              Dispatches layout tree → DOM
├── styler/                Viewport frame, theme hooks
└── errors/                L1/L2/L3 error rendering
```

---

## 🗺️ Roadmap

- **v0.1** (released) — Foundation: 10 components, L1/L2/L4 errors, viewport frames.
- **v0.2** (current) — 44 components total, L3 inline errors + typo suggestions, safety caps, `raw:` + sanitize-html, zod schemas per component.
- **v0.3** (planned) — Auto-generated component docs, canonical examples (`examples/`), README screenshots, GitHub Actions CI, Community Plugins submission.
- **Future ideas** — PNG/SVG export, multi-screen storyboards with connectors, reusable component definitions (partials), brand-color theme presets.

See [`docs/superpowers/specs/`](./docs/superpowers/specs/) for the full design spec and [`docs/superpowers/plans/`](./docs/superpowers/plans/) for the implementation plans.

---

## 💚 Sponsor

If UI Sketch saves you time on your wireframes, consider **[sponsoring on GitHub](https://github.com/sponsors/jkRaccoon)**. Sponsorships fund time spent on this plugin and future Obsidian tools.

---

## 🙌 Contributing

Issues and PRs welcome. Before a bigger change, please open an issue so we can talk through design. Small fixes can go straight to a PR.

- **Found a bug?** Include the YAML block that reproduces it, the expected render, and what you actually got.
- **Want a new component?** Check the catalog first. If it's genuinely missing, open an issue with a minimal YAML example.
- **Styling tweaks?** Keep all color/radius/spacing values as Obsidian CSS variables — no hard-coded colors.

---

## 📄 License

[MIT](./LICENSE) © 2026 jikwangkim

Built with TypeScript, [esbuild](https://esbuild.github.io/), [zod](https://zod.dev/), [js-yaml](https://github.com/nodeca/js-yaml), [sanitize-html](https://github.com/apostrophecms/sanitize-html), and [Vitest](https://vitest.dev/) · [happy-dom](https://github.com/capricorn86/happy-dom).
