# Navigation Components

Primitives for site chrome and wayfinding.

All components accept the [base props](../yaml-reference.md#base-props) in addition to those listed.

## `navbar`

Top navigation bar with a brand and menu items.

| Prop | Type | Description |
|---|---|---|
| `brand` | string | Logo/brand text (left side) |
| `items` | string[] | Menu items (right side) |

```yaml
navbar:
  brand: "DocHub"
  items: ["Home", "Docs", "Pricing", "Blog"]
```

## `sidebar`

Vertical navigation list. Commonly placed as the left column of a dashboard layout.

| Prop | Type | Description |
|---|---|---|
| `items` | string[] | Menu entries |
| `active` | string \| number | The active entry — either its label or zero-based index |

```yaml
sidebar:
  items: ["Getting Started", "API", "FAQ"]
  active: "API"
```

## `tabs`

Horizontal tabbed navigation.

| Prop | Type | Description |
|---|---|---|
| `items` | string[] | Tab labels |
| `active` | string \| number | The active tab — label or zero-based index |

```yaml
tabs:
  items: ["Overview", "Billing", "Team"]
  active: 0
```

## `breadcrumb`

Hierarchical trail showing the user's path.

| Prop | Type | Description |
|---|---|---|
| `items` | string[] | Segments from root to current |

```yaml
breadcrumb:
  items: ["Projects", "Dashboard", "Settings"]
```

## `pagination`

Page navigation control showing current/total.

| Prop | Type | Description |
|---|---|---|
| `current` | number | Current page (1-based) |
| `total` | number | Total page count |

```yaml
pagination:
  current: 3
  total: 12
```

## `stepper`

Multi-step progress indicator. Useful for onboarding or checkout flows.

| Prop | Type | Description |
|---|---|---|
| `items` | string[] | Step labels |
| `active` | number | Zero-based index of the active step |

```yaml
stepper:
  items: ["Account", "Plan", "Payment", "Confirm"]
  active: 2
```
