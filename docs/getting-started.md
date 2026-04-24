# Getting Started

Your first wireframe in five minutes. Assumes the plugin is already installed (see the [main README](../README.md#-quick-start) for install steps).

## 1. Create a code block

In any note, type a fenced code block with the `ui-sketch` language tag:

````markdown
```ui-sketch
screen:
  - button: { label: "Hello" }
```
````

Switch to Reading view (`Cmd/Ctrl+E`). You see a button.

## 2. Add a viewport frame

By default, the sketch renders at desktop width (1200px). Override it:

```yaml
viewport: mobile
screen:
  - button: { label: "Sign in" }
```

Valid viewports: `desktop` (1200px), `tablet` (768px), `mobile` (375px), or `custom` with explicit `width:` and `height:`.

## 3. Stack components vertically

`screen:` is an array. Items render top-to-bottom:

```yaml
screen:
  - heading: { level: 1, text: "Welcome" }
  - text: { value: "Sign in to continue." }
  - input: { placeholder: "Email" }
  - button: { label: "Continue", variant: primary }
```

## 4. Arrange side by side with `row`

Wrap items in a `row` to lay them out horizontally. `col` does the reverse for nesting:

```yaml
screen:
  - row:
      gap: 16
      items:
        - card: { title: "Revenue", body: "$12,400" }
        - card: { title: "Users",   body: "342" }
        - card: { title: "Errors",  body: "0" }
```

`gap:` controls the spacing in pixels. Inside a `col`, you can set `flex:` to proportionally size columns (`flex: 1` vs `flex: 3` makes a 1:3 ratio).

## 5. Common props every component supports

Any component accepts these on top of its own props:

```yaml
button:
  label: "Save"       # component-specific
  w: 160              # width (px or "50%")
  h: 40               # height
  align: center       # start | center | end
  pad: 12             # padding
  note: "Saves draft" # hover tooltip (ⓘ indicator appears)
  muted: true         # de-emphasized look
  id: primary-save    # optional identifier
```

See [YAML Reference](./yaml-reference.md#base-props) for details.

## 6. Add a note

`note:` is handy for design annotations — it adds a hover tooltip with a little ⓘ marker, so you can explain intent without cluttering the visual:

```yaml
screen:
  - button:
      label: "Delete account"
      variant: danger
      note: "Requires password confirmation in follow-up modal"
```

## Next steps

- **[YAML Reference](./yaml-reference.md)** — complete syntax including `grid:` for dashboard layouts.
- **[Component Reference](./components/README.md)** — full prop tables for all 44 components.
- **[Recipes](./recipes/dashboard.md)** — copy-paste templates for common screens.

If something doesn't render the way you expect, check [Troubleshooting](./troubleshooting.md) — the plugin surfaces detailed error messages, and most mistakes have clear fixes.
