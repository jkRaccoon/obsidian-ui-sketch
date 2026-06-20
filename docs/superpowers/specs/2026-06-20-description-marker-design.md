# Description Marker — Design

- **Date:** 2026-06-20
- **Status:** Approved (brainstormed)
- **Ships in:** v0.4.0

## Problem

Wireframes need annotations, but long description text inside a sketch breaks the
layout. Users want to flag "this part needs explanation" with a compact numbered
badge, then describe each number **outside** the sketch (in normal markdown), or
reveal a short description **on hover**.

There is already a `note:` base prop (renders an `ℹ` dot with a native-`title`
tooltip), but it cannot show a *number*, and its tooltip is OS-styled. This feature
adds a numbered, hover-revealed marker in a way that fits the wireframe aesthetic.

## Decisions (from brainstorming)

1. **Hybrid placement** — both a standalone `marker` component *and* a `mark`
   base prop that pins an overlay badge onto any component.
2. **CSS custom tooltip** — pure `:hover` bubble styled with Obsidian variables,
   no JS runtime state (fits the stateless `source → HTMLElement` architecture).
3. **Manual numbering** — the author writes `num: 1` / `mark: 2`; numbers/labels are
   stable so they map 1:1 to an external numbered list. `number | string`, so
   `A`, `*` etc. are also allowed. No auto-increment (render-order fragility).

## API surface

### Standalone component `marker`

```yaml
row:
  - button: { label: Save }
  - marker: { num: 1, text: "Auto-saves. No explicit save needed." }
```

| Prop | Type | Notes |
|---|---|---|
| `num` | number \| string | Badge label. Omitted → `ℹ` fallback. |
| `text` | string | Description shown on hover. Omitted → badge only, no tooltip. |
| `variant` | `default`/`primary`/`success`/`warning`/`danger` | Color. Default `primary` (accent). |

> **Why `num`, not `n`:** the parser runs YAML 1.1, where the bare scalar `n`
> resolves to boolean `false` — a `n:` key never survives parsing. (`on`, used by
> `toggle`, has the same latent issue; out of scope here.)

Renders inline so it sits in the flow next to siblings. Extends `BasePropsSchema`,
`.passthrough()`, same as every other component.

### Base prop overlay `mark` / `markText`

```yaml
button: { label: Save, mark: 2, markText: "Destructive — opens confirm modal" }
```

| Prop | Type | Notes |
|---|---|---|
| `mark` | number \| string | Overlay badge label, pinned to the host block. |
| `markText` | string | Hover description for the overlay badge. |

Added to `BasePropsSchema`, so it works on **any** component. The overlay is
absolutely positioned at the host block's **top-left** corner (the existing `note`
dot already owns top-right), so the two never collide and the overlay adds zero
layout space.

### External description (no feature needed)

"Describe by number outside the sketch" is just normal markdown the author writes
**below** the ` ```ui-sketch ` block, e.g.:

```
1. First screen the user lands on
2. Save is destructive here
```

YAGNI — no in-sketch legend component.

## Architecture

- **`src/components/marker.ts`** — new `MarkerDef` (`type: "marker"`). Also exports
  a dependency-free DOM helper:

  ```ts
  createMarkerBadge(label: string, text?: string, variant?: string, opts?: { pin?: boolean }): HTMLSpanElement
  ```

  Returns `<span class="uis-marker uis-marker--{variant} [uis-marker--pin]">` whose
  content is the label, with an optional child `<span class="uis-marker__tip">` for
  the hover tooltip. This is the single source of truth for both the component and
  the overlay.

- **`src/schema/base.ts`** — add `mark` (`number | string`) and `markText` (`string`)
  to `BasePropsSchema`.

- **`src/renderer/annotation.ts`** — change signature to an options object:
  `wrapWithAnnotation(el, { note?, mark?, markText? })`. Single relative wrapper:
  keeps the existing `note` → `ℹ` dot + native `title` (top-right), and adds the
  `mark` → `createMarkerBadge(..., { pin: true })` overlay (top-left) when present.
  Returns `el` unchanged when neither is set.

- **`src/renderer/layout.ts`** — `renderComponent` passes `{ note, mark, markText }`
  to `wrapWithAnnotation`.

- **`src/components/index.ts`** — append `MarkerDef` to the install list.

- **`styles.css`** — `.uis-marker` (inline circular numbered badge, accent),
  `.uis-marker--{variant}` colors (mirroring `.uis-badge`), `.uis-marker__tip`
  (hidden bubble, shown via `.uis-marker:hover .uis-marker__tip`), `.uis-marker--pin`
  (absolute top-left overlay).

## Edge cases / limitations

- **Tooltip clipping:** the CSS tooltip is `position:absolute` relative to the
  badge. The viewport frame (`.uis-frame`) does *not* clip, but `.uis-panel` uses
  `overflow:hidden`, so a tooltip on a marker inside a panel can be clipped. Accepted
  limitation — documented in the component reference. (Native `title` was the
  alternative the user explicitly rejected.)
- **Screenshots:** docs screenshots are static (no hover), so tooltip text is not
  visible there — the number is. Acceptable.
- **Empty marker:** `marker` with neither `n` nor `text` → renders an `ℹ` badge with
  no tooltip (permissive, no error).

## Testing

- `tests/components/marker.test.ts` — label render, `ℹ` fallback, tooltip presence
  with/without `text`, variant class.
- `tests/renderer/annotation.test.ts` — update to object signature; keep `note`
  behavior; add `mark` overlay (badge + `--pin`) and `markText` tooltip cases;
  assert unchanged element when empty.
- Snapshot/integration via existing `renderSource` path picks up registration.

## Docs

- README catalog (EN + KO): add `marker` to **Display**, bump every `44` → `45`.
- `docs/components/display.md` (+ `docs/ko/components/display.md`): `marker` section
  with `<!-- gen:props type=marker -->` markers; run `npm run gen:docs`.
- `gen-component-docs.ts` `DESCRIPTIONS`: add `marker` entries (en/ko).
- `docs/yaml-reference.md` (+ ko): document `mark` / `markText` base props.
- `manifest.json` / `package.json` descriptions: `44` → `45`.
