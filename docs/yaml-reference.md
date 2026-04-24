# YAML Reference

Complete syntax for `ui-sketch` blocks. For a gentler intro, read [Getting Started](./getting-started.md) first.

## Top-level keys

```yaml
viewport: desktop        # desktop | tablet | mobile | custom  (default: desktop)
width: 375               # number (px) — required when viewport: custom
height: 640              # number (px) — required when viewport: custom
theme: adaptive          # only "adaptive" is supported in v0.2
background: default      # default | muted | transparent
screen:                  # required: layout array OR a single grid object
  - ...
```

### Viewport presets

| Value | Width | Use case |
|---|---|---|
| `desktop` | 1200px | Standard web UI, the default |
| `tablet` | 768px | Responsive breakpoint sketch |
| `mobile` | 375px | iPhone-sized mockup |
| `custom` | — | Any size; requires `width:` and `height:` |

### Background

- `default` — matches Obsidian's primary surface (most themes = note body color)
- `muted` — slightly darker/lighter surface for contrast
- `transparent` — no background (lets the note color show through)

### Theme

`theme: adaptive` means the wireframe inherits Obsidian's CSS variables — it adjusts automatically to light/dark/community themes. No other values are supported in v0.2.

## The `screen` key — two layout models

`screen` is either **a layout array** (flex model) or **a single grid object**. The two are mutually exclusive at the root.

### Flex array (primary)

Top-level is an array. Each item is a single-keyed map: the key is either a layout primitive (`row`, `col`) or a component type.

```yaml
screen:
  - navbar: { brand: "DocHub" }
  - row:
      gap: 16
      items:
        - card: { title: "Card A" }
        - card: { title: "Card B" }
```

### Named-area grid

Top-level is a single `grid:` object with CSS Grid template areas. Inside `map:`, assign one component per named area.

```yaml
screen:
  grid:
    areas:
      - "nav  nav  nav"
      - "side main main"
      - "side foot foot"
    cols: "180px 1fr 1fr"     # optional; matches column count in areas
    rows: "56px 1fr 48px"      # optional; matches row count
    map:
      nav:  { navbar: { brand: "MyApp" } }
      side: { sidebar: { items: ["Home", "Docs"] } }
      main: { card:    { title: "Welcome" } }
      foot: { text:    { value: "© 2026" } }
```

Grid cells can only hold a single component; nest a `container:` inside if you need composition.

## Layout primitives

### `row`

Lays out `items` horizontally (flex row).

| Prop | Type | Description |
|---|---|---|
| `gap` | number | Pixels between items |
| `items` | array | Child entries (components or nested row/col) |

```yaml
row:
  gap: 12
  items:
    - button: { label: "Cancel", variant: ghost }
    - button: { label: "Save",   variant: primary }
```

### `col`

Lays out `items` vertically (flex column). Useful to group items that share a column inside a `row`.

| Prop | Type | Description |
|---|---|---|
| `flex` | number | Flex-grow ratio (e.g. `1`, `3`) when inside a row |
| `items` | array | Child entries |

```yaml
row:
  gap: 16
  items:
    - col: { flex: 1, items: [ { sidebar: { items: ["Home"] } } ] }
    - col: { flex: 3, items: [ { card: { title: "Main" } } ] }
```

## Base props (all components)

Every component, in addition to its type-specific props, accepts these base props:

| Prop | Type | Description |
|---|---|---|
| `id` | string | Optional identifier (CSS-safe) |
| `w` | number \| string | Width: number = px, string = any CSS length (e.g. `"50%"`, `"12rem"`) |
| `h` | number \| string | Height: same rules |
| `align` | `start` \| `center` \| `end` | Self-alignment along cross-axis |
| `pad` | number \| string | Padding (number = px, string = CSS) |
| `note` | string | Hover tooltip annotation — adds a ⓘ marker |
| `muted` | boolean | De-emphasize (reduces opacity/contrast) |

## Safety limits

To prevent a runaway block from freezing Obsidian, the plugin enforces:

- **Max tree depth**: 32 (`row`/`col`/`grid`/component nesting combined)
- **Max node count**: 5000 per block

Hitting either produces a block-level error. If you need more, split into multiple `ui-sketch` blocks across several code fences.

## The `raw:` escape hatch

For cases where a builtin component doesn't fit, `raw:` accepts a limited subset of HTML (piped through `sanitize-html`):

```yaml
raw:
  html: "<strong>Beta</strong> — limited rollout"
```

See [`raw` component reference](./components/raw.md) for the allowlist and security notes.

## Error levels

| Level | When | Visual |
|---|---|---|
| **L1** YAML parse | Syntax error | Block-level red box with line/col |
| **L2** Structure | Missing `screen`, bad `viewport`, etc. | Block-level red box with path |
| **L3** Component | Unknown type or invalid prop | Inline red box at that position — rest still renders |
| **L4** Empty | No content | Friendly placeholder with starter example |

Unknown component types get Levenshtein-based suggestions (`butn` → "Did you mean `button`?").

See [Troubleshooting](./troubleshooting.md) for the common mistakes.
