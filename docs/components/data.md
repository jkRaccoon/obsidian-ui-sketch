# Data Components

Tabular, list, tree, and key-value display. All accept the [base props](../yaml-reference.md#base-props) in addition to those listed.

## `table`

Simple data table with headers and rows. All values are rendered as text.

| Prop | Type | Description |
|---|---|---|
| `columns` | string[] | Column header labels |
| `rows` | string[][] | Each row is an array of strings — cells should align 1:1 with `columns` |

```yaml
table:
  columns: ["Name", "Role", "Status"]
  rows:
    - ["Ada",    "PM",  "✓"]
    - ["Ben",    "ENG", "…"]
    - ["Clara",  "ENG", "✗"]
```

## `list`

Bulleted or numbered list.

| Prop | Type | Description |
|---|---|---|
| `items` | string[] | List entries |
| `ordered` | boolean | `true` for numbered (ol), otherwise bulleted (ul) |

```yaml
list:
  ordered: true
  items:
    - "Write the spec"
    - "Ship the MVP"
    - "Gather feedback"
```

## `tree`

Nested hierarchical list. Each item has a `label` and optional `children` (recursively).

| Prop | Type | Description |
|---|---|---|
| `items` | `{ label: string, children?: [...] }[]` | Top-level tree entries |

```yaml
tree:
  items:
    - label: "src"
      children:
        - label: "components"
          children:
            - { label: "button.ts" }
            - { label: "card.ts" }
        - { label: "main.ts" }
    - label: "tests"
      children:
        - { label: "sanity.test.ts" }
    - { label: "README.md" }
```

Leaf nodes can be written as `{ label: "..." }` without `children`. Empty children arrays are allowed.

## `kv-list`

Key-value pair list — great for settings summaries or object inspection.

| Prop | Type | Description |
|---|---|---|
| `items` | `[string, string][]` | Array of `[key, value]` pairs |

```yaml
kv-list:
  items:
    - ["Plan",          "Pro"]
    - ["Billing cycle", "Monthly"]
    - ["Next charge",   "2026-05-01"]
    - ["Amount",        "$19.00"]
```

Each item is a YAML flow-sequence of exactly two strings.
