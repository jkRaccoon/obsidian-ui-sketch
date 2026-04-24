# Component Reference

All 44 builtin components, organized by category. Every component accepts the [base props](../yaml-reference.md#base-props) (`id`, `w`, `h`, `align`, `pad`, `note`, `muted`) in addition to its type-specific props listed below.

| Category | Components | Count |
|---|---|---|
| [**Layout**](./layout.md) | `container` · `card` · `panel` · `divider` · `spacer` | 5 |
| [**Navigation**](./navigation.md) | `navbar` · `sidebar` · `tabs` · `breadcrumb` · `pagination` · `stepper` | 6 |
| [**Input (basic)**](./input-basic.md) | `button` · `input` · `textarea` · `select` · `checkbox` · `radio` | 6 |
| [**Input (advanced)**](./input-advanced.md) | `toggle` · `slider` · `date-picker` · `file-upload` · `search` | 5 |
| [**Display**](./display.md) | `heading` · `text` · `image` · `icon` · `avatar` · `badge` · `tag` · `kbd` | 8 |
| [**Feedback**](./feedback.md) | `alert` · `progress` · `toast` · `modal` · `skeleton` | 5 |
| [**Data**](./data.md) | `table` · `list` · `tree` · `kv-list` | 4 |
| [**Placeholder**](./placeholder.md) | `chart` · `map` · `video` · `placeholder` | 4 |
| [**Escape hatch**](./raw.md) | `raw` | 1 |

## Prop notation

In prop tables:

- `string` / `number` / `boolean` — primitive types.
- `string[]` — array of strings.
- `"a" \| "b" \| "c"` — enum; only these values are accepted.
- `number \| string` — union; either accepted.
- A prop with no default is optional unless stated otherwise. Most components gracefully render with no props set (useful for placeholders).

Extra unknown props are ignored — they don't cause errors, so you can freely annotate YAML without breaking renders.

## Typo suggestions

If you misspell a component type (e.g. `buton` instead of `button`), the plugin suggests the closest valid name via Levenshtein distance (≤2). The rest of the wireframe still renders around the inline error.
