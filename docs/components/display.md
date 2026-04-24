# Display Components

Text and small visual elements. All accept the [base props](../yaml-reference.md#base-props) in addition to those listed.

## `heading`

Section heading, sized by level.

| Prop | Type | Description |
|---|---|---|
| `text` | string | Heading text |
| `level` | number | 1–6, matching HTML `<h1>`–`<h6>`. Default: 2 |

```yaml
heading:
  level: 1
  text: "Welcome back"
```

## `text`

Inline or block text with optional emphasis tone.

| Prop | Type | Description |
|---|---|---|
| `value` | string | The text content |
| `tone` | `"muted"` \| `"strong"` \| `"accent"` | Emphasis style |

```yaml
text:
  value: "Last synced 2 minutes ago"
  tone: muted
```

## `image`

Image placeholder. Uses `src`/`alt` but the actual image is not fetched — this is a mid-fi sketch tool, not a renderer.

| Prop | Type | Description |
|---|---|---|
| `src` | string | Image URL (shown in hover/title for reference) |
| `alt` | string | Alt text |

```yaml
image:
  src: "https://example.com/hero.jpg"
  alt: "Product hero image"
  w: 400
  h: 240
```

## `icon`

Small icon marker. In v0.2 this is a text label in an icon-sized box (Obsidian's Lucide icons are not directly wired yet).

| Prop | Type | Description |
|---|---|---|
| `name` | string | Icon identifier text |
| `size` | number | Box size in pixels |

```yaml
icon:
  name: "settings"
  size: 20
```

## `avatar`

Circular user avatar showing initials derived from `name`.

| Prop | Type | Description |
|---|---|---|
| `name` | string | Display name — initials are derived from it |
| `size` | number | Diameter in pixels |

```yaml
avatar:
  name: "Ada Lovelace"
  size: 40
```

## `badge`

Small status badge with a variant.

| Prop | Type | Description |
|---|---|---|
| `label` | string | Badge text |
| `variant` | `"default"` \| `"primary"` \| `"success"` \| `"warning"` \| `"danger"` | Visual style |

```yaml
badge:
  label: "Beta"
  variant: primary

badge:
  label: "Failed"
  variant: danger
```

## `tag`

Tag-shaped label (think "topic" or "keyword"). Simpler than `badge` — no variants, more neutral.

| Prop | Type | Description |
|---|---|---|
| `label` | string | Tag text |

```yaml
row:
  gap: 6
  items:
    - tag: { label: "react" }
    - tag: { label: "typescript" }
    - tag: { label: "obsidian" }
```

## `kbd`

Keyboard shortcut display. Renders each key in a `<kbd>`-style box joined by `+`.

| Prop | Type | Description |
|---|---|---|
| `keys` | string[] | The keys in the shortcut |

```yaml
kbd:
  keys: ["Ctrl", "K"]

kbd:
  keys: ["Cmd", "Shift", "P"]
```
