# `raw` — HTML Escape Hatch

For cases where no builtin component fits, `raw:` lets you inject a limited subset of HTML. Every input is piped through [`sanitize-html`](https://github.com/apostrophecms/sanitize-html) with a strict allow-list before rendering — there is no way to execute scripts or attach event handlers through it.

Prefer builtin components when possible. `raw:` is intentionally mid-fi; richer embeds are not a v0.2 goal.

## Props

<!-- gen:props type=raw -->
| Prop | Type | Description |
|---|---|---|
| `html` | string | Sanitized HTML (piped through sanitize-html) |
| `text` | string | Plain text — textContent only |
<!-- /gen:props -->

Plus all [base props](../yaml-reference.md#base-props). If both `html` and `text` are provided, `html` wins.

## Allowed tags

```
b, i, em, strong, a, p, br,
span, div, ul, ol, li, code, pre,
h1, h2, h3, h4, h5, h6, blockquote
```

Any other tag (including `script`, `style`, `iframe`, `img`, `object`, `form`, `input`, `button`) is stripped.

## Allowed attributes

- On `<a>`: `href` only (no `target`, no `rel`, no `onclick`)
- On any tag: `class`, `style`

## Allowed style properties

Inline `style` attributes are parsed and filtered. Only these properties survive:

```
color, background, font-weight, text-align, padding, margin
```

Other CSS properties (like `position`, `transform`, `display`, URLs in `background-image`) are stripped.

## Examples

### Inline emphasis mixed with tags

```yaml
raw:
  html: "Release <strong>0.2.1</strong> · <code>npm install</code>"
```

### Paragraph with a link

```yaml
raw:
  html: '<p>See the <a href="https://example.com">docs</a> for details.</p>'
```

### Plain text (no HTML parsing)

```yaml
raw:
  text: "Just <em>plain</em> text — these tags are shown literally"
```

## Security notes

- Scripts, event handlers (`onclick`, etc.), and `javascript:` URLs are all stripped. This is a plugin invariant.
- If you need functionality beyond the allow-list, consider whether a real component should be added — open an issue with a use case.
- `raw:` is not a shortcut for full Obsidian markdown. Obsidian's note-rendering pipeline does not run on `raw:` content; only the sanitized HTML renders.
