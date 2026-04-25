# Layout Components

Surfaces and spacing primitives. Use these to group or separate content. For arranging items horizontally/vertically, use the [`row` and `col` layout primitives](../yaml-reference.md#layout-primitives) instead of components.

All components below accept the [base props](../yaml-reference.md#base-props) in addition to those listed.

> Prop tables in this file are auto-generated from the live zod schemas by `npm run gen:docs`. Hand-editing inside `<!-- gen:props -->` blocks will be overwritten.

## `container`

A neutral rectangular surface with optional padding. Useful when you need a wrapper with visible bounds.

<!-- gen:props type=container -->
_No component-specific props — accepts [base props](../yaml-reference.md#base-props) only._
<!-- /gen:props -->

```yaml
container:
  pad: 16
  w: 300
  h: 120
```

## `card`

Titled surface with optional body text — the default "content card" shape.

<!-- gen:props type=card -->
| Prop | Type | Description |
|---|---|---|
| `title` | string | Card heading |
| `body` | string | Card body text |
<!-- /gen:props -->

```yaml
card:
  title: "Revenue"
  body: "$12,400 this quarter"
```

## `panel`

A card-like surface with a distinct header bar — better for grouping a heading with arbitrary content.

<!-- gen:props type=panel -->
| Prop | Type | Description |
|---|---|---|
| `header` | string | Panel header text |
<!-- /gen:props -->

```yaml
panel:
  header: "Account settings"
  w: 420
  h: 240
```

## `divider`

A thin horizontal or vertical rule. Great for visually breaking sections.

<!-- gen:props type=divider -->
| Prop | Type | Description |
|---|---|---|
| `orientation` | `"horizontal"` \| `"vertical"` | Direction of the rule |
<!-- /gen:props -->

```yaml
screen:
  - heading: { text: "Profile" }
  - divider: {}
  - heading: { text: "Preferences" }
```

## `spacer`

Invisible gap — forces spacing where `gap:` on the parent `row`/`col` isn't enough.

<!-- gen:props type=spacer -->
| Prop | Type | Description |
|---|---|---|
| `size` | number | Gap size in pixels |
<!-- /gen:props -->

```yaml
col:
  items:
    - button: { label: "Save" }
    - spacer: { size: 24 }
    - button: { label: "Delete", variant: danger }
```
