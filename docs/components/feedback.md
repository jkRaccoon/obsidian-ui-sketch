# Feedback Components

Notifications and loading states. All accept the [base props](../yaml-reference.md#base-props) in addition to those listed.

## `alert`

Banner-style notification with severity.

| Prop | Type | Description |
|---|---|---|
| `title` | string | Alert title |
| `message` | string | Alert body text |
| `severity` | `"info"` \| `"warn"` \| `"error"` \| `"success"` | Color/icon style. Default: `info` |

```yaml
alert:
  severity: warning
  title: "Heads up"
  message: "Review your changes before committing."
```

> **Note:** The `severity` enum is `info` / `warn` / `error` / `success` (not `warning`). Using `warning` triggers an L3 inline error.

## `progress`

Progress bar with value 0–100.

| Prop | Type | Description |
|---|---|---|
| `value` | number | Percentage 0–100 |
| `label` | string | Optional label shown alongside |

```yaml
progress:
  value: 42
  label: "Uploading..."
  w: 320
```

## `toast`

Transient notification chip — typically shown at corner of the screen.

| Prop | Type | Description |
|---|---|---|
| `message` | string | Toast body |
| `severity` | `"info"` \| `"warn"` \| `"error"` \| `"success"` | Color style. Default: `info` |

```yaml
toast:
  severity: success
  message: "Settings saved"
```

## `modal`

Modal dialog placeholder. Drawn inline (not truly overlaid) — this is a sketch.

| Prop | Type | Description |
|---|---|---|
| `title` | string | Dialog title |
| `body` | string | Dialog body text |

```yaml
modal:
  title: "Confirm deletion"
  body: "This action cannot be undone."
  w: 400
```

## `skeleton`

Gray shimmer placeholder for loading states.

| Prop | Type | Description |
|---|---|---|
| `width` | number \| string | Width (default: 100%) |
| `height` | number \| string | Height (default: 1em) |

```yaml
col:
  gap: 8
  items:
    - skeleton: { width: "80%", height: 20 }
    - skeleton: { width: "60%", height: 14 }
    - skeleton: { width: "90%", height: 14 }
```

> **Note:** `skeleton` uses `width`/`height` (not base `w`/`h`) because the semantics differ — these set the *shimmer area*, not the outer box.
