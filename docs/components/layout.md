# Layout Components

Surfaces and spacing primitives. Use these to group or separate content. For arranging items horizontally/vertically, use the [`row` and `col` layout primitives](../yaml-reference.md#layout-primitives) instead of components.

All components below accept the [base props](../yaml-reference.md#base-props) in addition to those listed.

## `container`

A neutral rectangular surface with optional padding. Useful when you need a wrapper with visible bounds.

| Prop | Type | Description |
|---|---|---|
| *(no component-specific props)* | | Use `pad:` from base props to control inset |

```yaml
container:
  pad: 16
  w: 300
  h: 120
```

## `card`

Titled surface with optional body text — the default "content card" shape.

| Prop | Type | Description |
|---|---|---|
| `title` | string | Card heading |
| `body` | string | Card body text |

```yaml
card:
  title: "Revenue"
  body: "$12,400 this quarter"
```

## `panel`

A card-like surface with a distinct header bar — better for grouping a heading with arbitrary content.

| Prop | Type | Description |
|---|---|---|
| `header` | string | Panel header text |

```yaml
panel:
  header: "Account settings"
  w: 420
  h: 240
```

## `divider`

A thin horizontal or vertical rule. Great for visually breaking sections.

| Prop | Type | Description |
|---|---|---|
| `orientation` | `"horizontal"` \| `"vertical"` | Default: `horizontal` |

```yaml
# Section separator
screen:
  - heading: { text: "Profile" }
  - divider: {}
  - heading: { text: "Preferences" }
```

## `spacer`

Invisible gap — forces spacing where `gap:` on the parent `row`/`col` isn't enough.

| Prop | Type | Description |
|---|---|---|
| `size` | number | Gap size in pixels |

```yaml
col:
  items:
    - button: { label: "Save" }
    - spacer: { size: 24 }
    - button: { label: "Delete", variant: danger }
```
