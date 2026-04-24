# Basic Input Components

Standard form controls. All accept the [base props](../yaml-reference.md#base-props) in addition to those listed.

## `button`

A clickable button with variants.

| Prop | Type | Description |
|---|---|---|
| `label` | string | Button text |
| `variant` | `"primary"` \| `"secondary"` \| `"ghost"` \| `"danger"` | Default: `primary` |
| `icon` | string | Optional icon label (text only in v0.2) |

```yaml
button:
  label: "Save"
  variant: primary

button:
  label: "Delete account"
  variant: danger
  note: "Requires confirmation modal"
```

## `input`

Single-line text input.

| Prop | Type | Description |
|---|---|---|
| `placeholder` | string | Placeholder text shown when empty |
| `value` | string | Pre-filled value |

```yaml
input:
  placeholder: "you@example.com"
  w: 280
```

## `textarea`

Multi-line text input.

| Prop | Type | Description |
|---|---|---|
| `placeholder` | string | Placeholder |
| `value` | string | Pre-filled value |
| `rows` | number | Visible rows (affects height) |

```yaml
textarea:
  placeholder: "Write your feedback..."
  rows: 4
```

## `select`

Dropdown picker.

| Prop | Type | Description |
|---|---|---|
| `placeholder` | string | Shown when no value selected |
| `value` | string | Currently selected value |
| `options` | string[] | Available options (not always rendered in mid-fi view) |

```yaml
select:
  placeholder: "Select a country"
  value: "South Korea"
  options: ["United States", "South Korea", "Japan"]
```

## `checkbox`

Single checkbox with a label.

| Prop | Type | Description |
|---|---|---|
| `label` | string | Label text shown next to the box |
| `checked` | boolean | Whether the box is ticked |

```yaml
checkbox:
  label: "I agree to the terms"
  checked: true
```

## `radio`

Single radio button with a label. For a group, stack several in a `col`.

| Prop | Type | Description |
|---|---|---|
| `label` | string | Label text |
| `selected` | boolean | Whether this radio is selected |

```yaml
col:
  items:
    - radio: { label: "Monthly",  selected: true }
    - radio: { label: "Annually", selected: false }
    - radio: { label: "Lifetime", selected: false }
```
