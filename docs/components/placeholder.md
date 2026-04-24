# Placeholder Components

Visually indicate *"something goes here"* without committing to content. All accept the [base props](../yaml-reference.md#base-props) in addition to those listed.

Sizing these with `w`/`h` is recommended — they don't have intrinsic dimensions.

## `chart`

Placeholder for a data visualization with a rough silhouette hint.

| Prop | Type | Description |
|---|---|---|
| `kind` | `"bar"` \| `"line"` \| `"pie"` | Which shape to suggest |
| `label` | string | Caption shown on or below the chart |

```yaml
chart:
  kind: bar
  label: "Monthly revenue"
  w: 400
  h: 220
```

## `map`

Map placeholder — a shaded rectangle with a "MAP" badge. No props beyond base.

```yaml
map:
  w: 320
  h: 200
  note: "Shows pickup location"
```

## `video`

Video placeholder — a shaded rectangle with a ▶ play icon and a "VIDEO" badge. No props beyond base.

```yaml
video:
  w: 480
  h: 270
  note: "Onboarding intro, 90s"
```

## `placeholder`

Generic labeled box — for anything that doesn't fit a specific category yet.

| Prop | Type | Description |
|---|---|---|
| `label` | string | Caption text shown centered |

```yaml
placeholder:
  label: "Activity feed (TODO)"
  w: 300
  h: 180
```
