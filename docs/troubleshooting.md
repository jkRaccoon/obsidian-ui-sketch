# Troubleshooting

The plugin never silently fails — when something is wrong, it renders an explicit error. This page explains each error level and the most common causes.

## Error levels at a glance

| Level | When | Visual |
|---|---|---|
| **L1** YAML parse | Malformed YAML syntax | Full-block red box with line & column |
| **L2** Structure | Missing `screen`, bad `viewport`, etc. | Full-block red box with path |
| **L3** Component | Unknown type or invalid props | Inline red box — rest of the wireframe still renders |
| **L4** Empty | No content at all | Friendly placeholder with a starter example |

## L1 — YAML parse error

Shows the reason plus line/column.

### Common causes

**Missing space after colon:**

```yaml
# ✗ Wrong
viewport:desktop
screen:
  - button: { label:"Save" }

# ✓ Right
viewport: desktop
screen:
  - button: { label: "Save" }
```

**Indentation mismatch:**

```yaml
# ✗ Wrong — "items" looks indented 3 under "row", but siblings are 4
screen:
  - row:
      items:
       - button: { label: "X" }

# ✓ Right — consistent 2-space indentation
screen:
  - row:
      items:
        - button: { label: "X" }
```

**Unquoted special characters:**

```yaml
# ✗ Wrong — the colon breaks parsing
text: { value: "Time: 3:42 PM" }

# ✓ Right — quote the value
text: { value: "Time: 3:42 PM" }   # already fine — outer quotes save you

# ✗ Definitely wrong
text: { value: Time: 3:42 PM }
```

## L2 — Structure error

The YAML parsed, but doesn't match the expected shape.

### "screen is required"

The top-level map needs a `screen:` key.

```yaml
# ✗ Wrong
viewport: desktop

# ✓ Right
viewport: desktop
screen:
  - button: { label: "Hello" }
```

### "viewport=custom requires numeric width and height"

When using `viewport: custom`, provide both:

```yaml
viewport: custom
width: 500
height: 800
screen: [...]
```

### "expected an array" at `screen`

`screen` must be either an array or a `grid:` object, not a single component:

```yaml
# ✗ Wrong
screen:
  button: { label: "X" }

# ✓ Right
screen:
  - button: { label: "X" }
```

### "entry must have exactly one key"

Each item in `screen` (or inside `row.items` / `col.items`) must be a single-keyed map:

```yaml
# ✗ Wrong — two keys in one entry
screen:
  - button: { label: "A" }
    card:   { title: "B" }

# ✓ Right — two entries
screen:
  - button: { label: "A" }
  - card:   { title: "B" }
```

## L3 — Component error

Unlike L1/L2, an L3 error renders inline and does **not** break the rest of the wireframe — you see a red box at the exact position with the message.

### Unknown component type

```
⚠ butn: unknown component type
Did you mean "button"?
at screen[1]
```

The suggestion uses Levenshtein distance ≤ 2. Fix the spelling or replace with a valid type from the [component reference](./components/README.md).

### Invalid enum value

Schema errors show the first failing field:

```
⚠ alert: severity: Invalid enum value. Expected 'info' | 'warn' | 'error' | 'success', received 'warning'
at screen[0]
```

Many enums use short forms — check the component page for the exact values. Common traps:

| Component | Prop | Valid values |
|---|---|---|
| `alert`, `toast` | `severity` | `info`, `warn`, `error`, `success` (not `warning`) |
| `button` | `variant` | `primary`, `secondary`, `ghost`, `danger` |
| `badge` | `variant` | `default`, `primary`, `success`, `warning`, `danger` |
| `divider` | `orientation` | `horizontal`, `vertical` |
| `chart` | `kind` | `bar`, `line`, `pie` |
| `text` | `tone` | `muted`, `strong`, `accent` |

### Wrong type

Zod rejects mismatched types:

```
⚠ table: rows: Expected array, received string
```

Check the [component reference](./components/README.md) for expected prop types.

## L4 — Empty block

If a `ui-sketch` block is empty or only whitespace, you see a friendly placeholder with a starter example. Replace the placeholder content with YAML to render.

## Safety-cap errors

Block-level errors with these messages:

- **"layout depth exceeds 32"** — your nesting is >32 levels deep. Almost always a YAML anchor/alias loop. Unwind or split into multiple blocks.
- **"too many nodes (>5000) — split the block"** — the tree exploded. Again, usually aliases multiplying — or you have a genuinely huge sketch. Split into sections, each in its own `ui-sketch` block.

## FAQ

**Q: My wireframe renders, but the colors look wrong in dark mode.**
A: UI Sketch uses Obsidian CSS variables (`--interactive-accent`, etc.). If a community theme overrides these oddly, the wireframe follows. Try the default Obsidian theme to isolate, then report if it's a plugin bug.

**Q: Can I embed an image from my vault?**
A: Not in v0.2. `image:` is a placeholder showing `alt`/`src` as metadata, not a real fetcher. v0.3+ is evaluating this.

**Q: Can I use Obsidian wikilinks inside `text:` or `card:`?**
A: No — text is rendered via `textContent`, not through Obsidian's markdown pipeline. For inline markup, use `raw:` with sanitized HTML.

**Q: Live Preview isn't re-rendering when I edit the YAML.**
A: Live Preview should re-render on blur. If it doesn't, toggle to Reading view (`Cmd/Ctrl+E`) and back. This is an Obsidian pipeline quirk, not a plugin bug.

**Q: How do I report a bug?**
A: Open an issue at [GitHub](https://github.com/jkRaccoon/obsidian-ui-sketch/issues) with:
1. The minimal YAML block that reproduces
2. Expected render
3. Actual render (screenshot if possible)
4. Obsidian version and OS
