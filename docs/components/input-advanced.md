# Advanced Input Components

More specialized form controls. All accept the [base props](../yaml-reference.md#base-props) in addition to those listed.

## `toggle`

On/off switch with an optional label.

| Prop | Type | Description |
|---|---|---|
| `label` | string | Label text |
| `on` | boolean | Whether the switch is on |

```yaml
toggle:
  label: "Enable notifications"
  on: true
```

## `slider`

Range slider showing a value between `min` and `max`.

| Prop | Type | Description |
|---|---|---|
| `value` | number | Current value |
| `min` | number | Minimum (default 0) |
| `max` | number | Maximum (default 100) |

```yaml
slider:
  value: 35
  min: 0
  max: 100
  w: 240
```

## `date-picker`

Date input with a placeholder and optional initial value.

| Prop | Type | Description |
|---|---|---|
| `value` | string | Preset date (free-form string — not parsed) |
| `placeholder` | string | Placeholder shown when empty |

```yaml
date-picker:
  placeholder: "YYYY-MM-DD"
  value: "2026-04-24"
```

## `file-upload`

File picker area with a label.

| Prop | Type | Description |
|---|---|---|
| `label` | string | Text shown inside the dropzone |

```yaml
file-upload:
  label: "Drop CSV or click to browse"
  w: 320
  h: 120
```

## `search`

Search input with a placeholder and optional seed value. Visually distinct from `input` (usually shows a search icon).

| Prop | Type | Description |
|---|---|---|
| `value` | string | Pre-filled query |
| `placeholder` | string | Placeholder |

```yaml
search:
  placeholder: "Search docs..."
  w: 320
```
