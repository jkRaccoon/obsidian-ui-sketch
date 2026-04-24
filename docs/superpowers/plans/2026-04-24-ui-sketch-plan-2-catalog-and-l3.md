# UI Sketch — Plan 2: Component Catalog + L3 Error UX

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the `ui-sketch` plugin from 10 to 44 components, add per-component zod validation with inline L3 error UX (Levenshtein typo suggestions), install safety guards (max aliases / depth / node count), and add the `raw:` escape-hatch component with `sanitize-html`.

**Architecture:** Keep the Plan 1 pipeline (`parser → schema → renderer + components → styler → DOM`). Add two new modules (`schema/suggestions.ts`, `renderer/safety.ts`), extend `ComponentDef` with an optional `schema: ZodSchema`, and when set, route schema failures through a new `renderInlineError` path. No structural changes to the existing pipeline contract.

**Tech Stack:** TypeScript, `zod` (already installed), `js-yaml` (already installed), **new dep**: `sanitize-html` + `@types/sanitize-html`. Package manager: `yarn`.

**Scope of this plan (v0.2):**
- 34 new component files + their unit tests (tabs, sidebar, breadcrumb, pagination, stepper, textarea, select, checkbox, radio, toggle, slider, date-picker, file-upload, search, image, icon, avatar, badge, tag, kbd, alert, progress, toast, modal, skeleton, table, list, tree, kv-list, chart, map, video, placeholder, raw).
- New `ComponentError` type + inline error UI for L3.
- Levenshtein typo suggestions when an unknown component type is encountered.
- Safety guards: `maxAliasCount: 200` in parser, `MAX_DEPTH: 32` + `MAX_NODES: 5000` in renderer.
- `raw:` component passes through `sanitize-html`.
- Retrofit Plan 1's 10 components with zod schemas (removes a quiet "dead dep" flagged in Plan 1 review).
- CSS for new components.

**Out of scope (Plan 3):**
- Component doc auto-generation script.
- `examples/` folder and canonical wireframes.
- README + screenshots.
- GitHub Actions CI.
- BRAT beta + Community Plugins submission.

---

## File map

```
o_layout/
├── styles.css                            modify — add styles for 34 new components
├── src/
│   ├── components/
│   │   ├── registry.ts                   modify — ComponentDef.schema field
│   │   ├── index.ts                      modify — register all 44
│   │   ├── container.ts ... navbar.ts    modify (×10) — add zod schemas to the Plan 1 components
│   │   ├── sidebar.ts                    NEW
│   │   ├── tabs.ts                       NEW
│   │   ├── breadcrumb.ts                 NEW
│   │   ├── pagination.ts                 NEW
│   │   ├── stepper.ts                    NEW
│   │   ├── textarea.ts                   NEW
│   │   ├── select.ts                     NEW
│   │   ├── checkbox.ts                   NEW
│   │   ├── radio.ts                      NEW
│   │   ├── toggle.ts                     NEW
│   │   ├── slider.ts                     NEW
│   │   ├── date-picker.ts                NEW
│   │   ├── file-upload.ts                NEW
│   │   ├── search.ts                     NEW
│   │   ├── image.ts                      NEW
│   │   ├── icon.ts                       NEW
│   │   ├── avatar.ts                     NEW
│   │   ├── badge.ts                      NEW
│   │   ├── tag.ts                        NEW
│   │   ├── kbd.ts                        NEW
│   │   ├── alert.ts                      NEW
│   │   ├── progress.ts                   NEW
│   │   ├── toast.ts                      NEW
│   │   ├── modal.ts                      NEW
│   │   ├── skeleton.ts                   NEW
│   │   ├── table.ts                      NEW
│   │   ├── list.ts                       NEW
│   │   ├── tree.ts                       NEW
│   │   ├── kv-list.ts                    NEW
│   │   ├── chart.ts                      NEW
│   │   ├── map.ts                        NEW
│   │   ├── video.ts                      NEW
│   │   ├── placeholder.ts                NEW
│   │   └── raw.ts                        NEW
│   ├── errors/
│   │   ├── types.ts                      modify — add ComponentError (L3)
│   │   └── render.ts                     modify — add renderInlineError
│   ├── parser/index.ts                   modify — maxAliasCount: 200
│   ├── renderer/
│   │   ├── layout.ts                     modify — schema-based validation + L3 inline error + safety guards at renderComponent
│   │   ├── index.ts                      modify — invoke safety guards before buildTree
│   │   └── safety.ts                     NEW — countAndCheckDepth
│   └── schema/
│       └── suggestions.ts                NEW — editDistance + suggestType
└── tests/
    └── components/*.test.ts              NEW (×34) — one per component
    └── errors/inline.test.ts             NEW — L3 render
    └── renderer/safety.test.ts           NEW — depth/count
    └── renderer/l3.test.ts               NEW — end-to-end L3 behavior
    └── schema/suggestions.test.ts        NEW — Levenshtein behavior
```

---

## Task 1: Add ComponentError (L3) to errors/types.ts

**Files:** Modify `src/errors/types.ts`.

- [ ] **Step 1: Replace the file**

```ts
// src/errors/types.ts
import type { Loc } from "@/types";

export interface YamlError { kind: "yaml"; message: string; loc?: Loc; }
export interface StructureError { kind: "structure"; message: string; path: string; }
export interface ComponentError {
  kind: "component";
  componentType: string;
  message: string;
  path: string;
  suggestion?: string;
}

export type BlockError = YamlError | StructureError;
export type InlineError = ComponentError;
```

- [ ] **Step 2: Typecheck**

Run: `yarn typecheck`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/errors/types.ts
git commit -m "feat(errors): add ComponentError type for L3 inline errors"
```

---

## Task 2: Add renderInlineError

**Files:**
- Modify: `src/errors/render.ts`
- Create: `tests/errors/inline.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/errors/inline.test.ts
import { describe, it, expect } from "vitest";
import { renderInlineError } from "@/errors/render";

describe("renderInlineError", () => {
  it("renders component name and message", () => {
    const el = renderInlineError({
      kind: "component",
      componentType: "button",
      message: "label is required",
      path: "screen[0]",
    });
    expect(el.className).toContain("uis-error");
    expect(el.className).toContain("uis-error--inline");
    expect(el.textContent).toContain("button");
    expect(el.textContent).toContain("label is required");
  });

  it("includes typo suggestion when provided", () => {
    const el = renderInlineError({
      kind: "component",
      componentType: "butn",
      message: "unknown component",
      path: "screen[0]",
      suggestion: "button",
    });
    expect(el.textContent).toContain("button");
    expect(el.textContent).toContain("Did you mean");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/errors/inline.test.ts`
Expected: FAIL (`renderInlineError` not exported).

- [ ] **Step 3: Implement — append to `src/errors/render.ts`**

Add the following export (keep the existing exports intact):

```ts
import type { ComponentError } from "./types";

export function renderInlineError(err: ComponentError): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-error uis-error--inline";

  const title = document.createElement("div");
  title.className = "uis-error__title";
  title.textContent = `⚠ ${err.componentType}: ${err.message}`;
  el.appendChild(title);

  if (err.suggestion) {
    const hint = document.createElement("div");
    hint.className = "uis-error__hint";
    hint.textContent = `Did you mean "${err.suggestion}"?`;
    el.appendChild(hint);
  }

  const path = document.createElement("div");
  path.className = "uis-error__body";
  path.textContent = `at ${err.path}`;
  el.appendChild(path);

  return el;
}
```

- [ ] **Step 4: Run — expect pass.**

Run: `yarn test tests/errors/inline.test.ts`
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add src/errors/render.ts tests/errors/inline.test.ts
git commit -m "feat(errors): renderInlineError for L3 component errors"
```

---

## Task 3: Levenshtein suggestion module

**Files:**
- Create: `src/schema/suggestions.ts`
- Create: `tests/schema/suggestions.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/schema/suggestions.test.ts
import { describe, it, expect } from "vitest";
import { editDistance, suggestType } from "@/schema/suggestions";

describe("editDistance", () => {
  it("returns 0 for identical strings", () => {
    expect(editDistance("button", "button")).toBe(0);
  });
  it("returns 1 for single-char typo", () => {
    expect(editDistance("butn", "button")).toBe(2);
    expect(editDistance("buton", "button")).toBe(1);
  });
  it("returns length for empty counterpart", () => {
    expect(editDistance("", "abc")).toBe(3);
    expect(editDistance("abc", "")).toBe(3);
  });
});

describe("suggestType", () => {
  it("returns closest match within threshold", () => {
    expect(suggestType("buton", ["button", "input", "card"])).toBe("button");
  });
  it("returns undefined when no match within threshold", () => {
    expect(suggestType("xyz", ["button", "input"])).toBeUndefined();
  });
  it("prefers exact edit-distance winner", () => {
    expect(suggestType("cal", ["card", "avatar"])).toBe("card");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/schema/suggestions.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/schema/suggestions.ts
export function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function suggestType(unknown: string, known: string[], maxDistance = 2): string | undefined {
  let best: string | undefined;
  let bestDist = Infinity;
  for (const t of known) {
    const d = editDistance(unknown, t);
    if (d < bestDist && d <= maxDistance) {
      best = t;
      bestDist = d;
    }
  }
  return best;
}
```

- [ ] **Step 4: Run — expect pass (6 tests).**

Run: `yarn test tests/schema/suggestions.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/schema/suggestions.ts tests/schema/suggestions.test.ts
git commit -m "feat(schema): Levenshtein typo suggestions"
```

---

## Task 4: Safety guards (depth + node count)

**Files:**
- Create: `src/renderer/safety.ts`
- Create: `tests/renderer/safety.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/renderer/safety.test.ts
import { describe, it, expect } from "vitest";
import { countAndCheckDepth, MAX_DEPTH, MAX_NODES } from "@/renderer/safety";

describe("countAndCheckDepth", () => {
  it("passes a shallow tree", () => {
    const r = countAndCheckDepth({ a: [1, 2, 3] });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.count).toBeGreaterThan(0);
  });

  it("rejects a tree exceeding MAX_DEPTH", () => {
    let deep: any = "leaf";
    for (let i = 0; i < MAX_DEPTH + 2; i++) deep = { nested: deep };
    const r = countAndCheckDepth(deep);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toBe("depth");
  });

  it("rejects a tree exceeding MAX_NODES", () => {
    const big: any[] = Array.from({ length: MAX_NODES + 10 }, (_, i) => i);
    const r = countAndCheckDepth(big);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toBe("count");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/renderer/safety.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/renderer/safety.ts
export const MAX_DEPTH = 32;
export const MAX_NODES = 5000;

export type SafetyResult =
  | { ok: true; count: number }
  | { ok: false; reason: "depth" | "count" };

export function countAndCheckDepth(root: unknown): SafetyResult {
  const counter = { n: 0 };
  return walk(root, 0, counter);
}

function walk(node: unknown, depth: number, counter: { n: number }): SafetyResult {
  if (depth > MAX_DEPTH) return { ok: false, reason: "depth" };
  counter.n++;
  if (counter.n > MAX_NODES) return { ok: false, reason: "count" };

  if (Array.isArray(node)) {
    for (const item of node) {
      const r = walk(item, depth + 1, counter);
      if (!r.ok) return r;
    }
  } else if (typeof node === "object" && node !== null) {
    for (const v of Object.values(node as Record<string, unknown>)) {
      const r = walk(v, depth + 1, counter);
      if (!r.ok) return r;
    }
  }
  return { ok: true, count: counter.n };
}
```

- [ ] **Step 4: Run — expect pass (3 tests).**

- [ ] **Step 5: Commit**

```bash
git add src/renderer/safety.ts tests/renderer/safety.test.ts
git commit -m "feat(renderer): depth and node-count safety guards"
```

---

## Task 5: Parser maxAliasCount

**Files:** Modify `src/parser/index.ts`.

- [ ] **Step 1: Update the `yaml.load` call**

Find the line in `parseDocument`:

```ts
const doc = yaml.load(source, { schema: yaml.DEFAULT_SCHEMA });
```

Replace with:

```ts
const doc = yaml.load(source, { schema: yaml.DEFAULT_SCHEMA, maxAliasCount: 200 });
```

- [ ] **Step 2: Run existing parser tests — they must still pass.**

Run: `yarn test tests/parser`
Expected: all parser tests pass (3 from Plan 1 + 4 from the edge_cases file if present — verify count is unchanged).

- [ ] **Step 3: Commit**

```bash
git add src/parser/index.ts
git commit -m "feat(parser): cap maxAliasCount at 200 to prevent alias bomb"
```

---

## Task 6: Extend ComponentDef with optional schema

**Files:** Modify `src/components/registry.ts`.

- [ ] **Step 1: Update the file**

```ts
// src/components/registry.ts
import type { ZodType } from "zod";

export interface ComponentRenderCtx {
  muted?: boolean;
}

export interface ComponentDef {
  type: string;
  schema?: ZodType<Record<string, unknown>>;
  render(props: Record<string, unknown>, ctx: ComponentRenderCtx): HTMLElement;
}

const defs = new Map<string, ComponentDef>();

export function register(def: ComponentDef): void {
  defs.set(def.type, def);
}

export function lookup(type: string): ComponentDef | undefined {
  return defs.get(type);
}

export function registeredTypes(): string[] {
  return [...defs.keys()].sort();
}
```

- [ ] **Step 2: Typecheck**

Run: `yarn typecheck`
Expected: 0 errors. (None of the existing components set `schema`, so backward compatibility is preserved.)

- [ ] **Step 3: Commit**

```bash
git add src/components/registry.ts
git commit -m "feat(components): ComponentDef supports optional zod schema"
```

---

## Task 7: Wire L3 into renderer/layout.ts (schema + unknown + suggestion)

**Files:**
- Modify: `src/renderer/layout.ts`
- Create: `tests/renderer/l3.test.ts`

- [ ] **Step 1: Write failing L3 behavior test**

```ts
// tests/renderer/l3.test.ts
import { describe, it, expect } from "vitest";
import { installBuiltinComponents } from "@/components";
import { renderLayoutNodes } from "@/renderer/layout";
import { register } from "@/components/registry";
import { z } from "zod";

installBuiltinComponents();

// Register a throwaway component with a strict schema for testing.
register({
  type: "strict-demo",
  schema: z.object({ label: z.string() }).passthrough(),
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-demo";
    el.textContent = String(props.label);
    return el;
  },
});

describe("L3 inline errors", () => {
  it("renders schema failure as inline error with component name and message", () => {
    const host = document.createElement("div");
    host.appendChild(
      renderLayoutNodes([{ kind: "component", type: "strict-demo", props: {} }]),
    );
    const err = host.querySelector(".uis-error--inline");
    expect(err).not.toBeNull();
    expect(err?.textContent).toContain("strict-demo");
  });

  it("renders unknown type with suggestion when close to a registered type", () => {
    const host = document.createElement("div");
    host.appendChild(
      renderLayoutNodes([{ kind: "component", type: "buton", props: {} }]),
    );
    const err = host.querySelector(".uis-error--inline");
    expect(err).not.toBeNull();
    expect(err?.textContent).toContain("buton");
    expect(err?.textContent).toContain("button");
    expect(err?.textContent).toContain("Did you mean");
  });

  it("renders unknown type without suggestion when far from any registered type", () => {
    const host = document.createElement("div");
    host.appendChild(
      renderLayoutNodes([{ kind: "component", type: "zzzzzzzz", props: {} }]),
    );
    const err = host.querySelector(".uis-error--inline");
    expect(err).not.toBeNull();
    expect(err?.textContent).not.toContain("Did you mean");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/renderer/l3.test.ts`

- [ ] **Step 3: Update `src/renderer/layout.ts`**

Replace the file with:

```ts
// src/renderer/layout.ts
import type { LayoutNode, RowNode, ColNode, GridNode, ComponentNode } from "@/types";
import { lookup, registeredTypes } from "@/components/registry";
import { wrapWithAnnotation } from "./annotation";
import { renderInlineError } from "@/errors/render";
import { suggestType } from "@/schema/suggestions";

export function renderLayoutNodes(nodes: LayoutNode[], path = "screen"): HTMLElement {
  const root = document.createElement("div");
  root.className = "uis-flow";
  nodes.forEach((n, i) => root.appendChild(renderNode(n, `${path}[${i}]`)));
  return root;
}

export function renderNode(n: LayoutNode, path: string): HTMLElement {
  if ("kind" in n) {
    if (n.kind === "row") return renderRow(n, path);
    if (n.kind === "col") return renderCol(n, path);
    if (n.kind === "grid") return renderGrid(n, path);
    if (n.kind === "component") return renderComponent(n, path);
  }
  return placeholder("invalid node");
}

function renderRow(n: RowNode, path: string): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-row";
  if (typeof n.gap === "number") el.style.gap = `${n.gap}px`;
  n.items.forEach((child, i) => el.appendChild(renderNode(child, `${path}.items[${i}]`)));
  return el;
}

function renderCol(n: ColNode, path: string): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-col";
  if (typeof n.flex === "number") el.style.flex = `${n.flex} 1 0`;
  n.items.forEach((child, i) => el.appendChild(renderNode(child, `${path}.items[${i}]`)));
  return el;
}

export function renderGrid(n: GridNode, path = "screen"): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-grid";
  el.style.display = "grid";
  el.style.gridTemplateAreas = n.areas.map((row) => `"${row}"`).join(" ");
  if (n.cols) el.style.gridTemplateColumns = n.cols;
  if (n.rows) el.style.gridTemplateRows = n.rows;
  for (const [name, node] of Object.entries(n.map)) {
    const cell = document.createElement("div");
    cell.className = "uis-grid__cell";
    cell.style.gridArea = name;
    cell.appendChild(renderComponent(node, `${path}.map.${name}`));
    el.appendChild(cell);
  }
  return el;
}

function renderComponent(n: ComponentNode, path: string): HTMLElement {
  const def = lookup(n.type);
  if (!def) {
    const suggestion = suggestType(n.type, registeredTypes());
    return renderInlineError({
      kind: "component",
      componentType: n.type,
      message: "unknown component type",
      path,
      suggestion,
    });
  }

  let props: Record<string, unknown> = n.props;
  if (def.schema) {
    const result = def.schema.safeParse(n.props);
    if (!result.success) {
      const first = result.error.errors[0];
      const fieldPath = first?.path.join(".") ?? "";
      const message = fieldPath ? `${fieldPath}: ${first.message}` : first?.message ?? "invalid props";
      return renderInlineError({
        kind: "component",
        componentType: n.type,
        message,
        path,
      });
    }
    props = result.data as Record<string, unknown>;
  }

  const inner = def.render(props, { muted: props.muted === true });
  applyBaseLayout(inner, props);
  return wrapWithAnnotation(inner, typeof props.note === "string" ? props.note : undefined);
}

function applyBaseLayout(el: HTMLElement, props: Record<string, unknown>): void {
  if (typeof props.w === "number") el.style.width = `${props.w}px`;
  else if (typeof props.w === "string") el.style.width = props.w;
  if (typeof props.h === "number") el.style.height = `${props.h}px`;
  else if (typeof props.h === "string") el.style.height = props.h;
  if (typeof props.align === "string") el.style.alignSelf = props.align;
  if (props.muted === true) el.classList.add("uis-muted");
}

function placeholder(message: string): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-unknown";
  el.textContent = message;
  return el;
}
```

- [ ] **Step 4: Run all renderer tests.**

Run: `yarn test tests/renderer`
Expected: all existing renderer tests still pass, plus the new L3 tests (3). The Plan 1 layout test that expected `.uis-unknown` for `type: "mystery"` will need adjusting — the new behavior renders an inline error instead. That test is in `tests/renderer/layout.test.ts`. Update **that one test only** to assert `.uis-error--inline` instead of `.uis-unknown`:

**Exact edit to `tests/renderer/layout.test.ts`**, replace:
```ts
  it("renders an unknown component as a placeholder (L3 deferred; v0.1 shows a stub)", () => {
    const host = document.createElement("div");
    host.appendChild(renderLayoutNodes([{ kind: "component", type: "mystery", props: {} }]));
    expect(host.querySelector(".uis-unknown")).not.toBeNull();
  });
```
With:
```ts
  it("renders an unknown component as an inline L3 error", () => {
    const host = document.createElement("div");
    host.appendChild(renderLayoutNodes([{ kind: "component", type: "mystery", props: {} }]));
    expect(host.querySelector(".uis-error--inline")).not.toBeNull();
  });
```

- [ ] **Step 5: Run tests again — expect pass.**

Run: `yarn test tests/renderer`

- [ ] **Step 6: Commit**

```bash
git add src/renderer/layout.ts tests/renderer/l3.test.ts tests/renderer/layout.test.ts
git commit -m "feat(renderer): route schema failures and unknown types to L3 inline errors"
```

---

## Task 8: Invoke safety guards from renderSource

**Files:** Modify `src/renderer/index.ts`.

- [ ] **Step 1: Replace the file**

```ts
// src/renderer/index.ts
import { parseDocument } from "@/parser";
import { validate } from "@/schema";
import { renderLayoutNodes, renderGrid } from "./layout";
import { applyFrame } from "@/styler";
import { renderErrorBox, renderEmptyPlaceholder } from "@/errors/render";
import { countAndCheckDepth } from "./safety";
import type { ValidatedDoc } from "@/types";

export function renderSource(source: string): HTMLElement {
  const trimmed = source.trim();
  if (trimmed === "") return renderEmptyPlaceholder();

  const parsed = parseDocument(source);
  if (!parsed.ok) return renderErrorBox(parsed.error);

  const validated = validate(parsed.doc);
  if (!validated.ok) return renderErrorBox(validated.error);

  const doc: ValidatedDoc = validated.doc;

  const safety = countAndCheckDepth(doc.screen);
  if (!safety.ok) {
    return renderErrorBox({
      kind: "structure",
      message: safety.reason === "depth"
        ? "layout depth exceeds 32"
        : "too many nodes (>5000) — split the block",
      path: "screen",
    });
  }

  if (Array.isArray(doc.screen) && doc.screen.length === 0) return renderEmptyPlaceholder();

  const inner = Array.isArray(doc.screen)
    ? renderLayoutNodes(doc.screen)
    : renderGrid(doc.screen);
  return applyFrame(inner, doc);
}
```

- [ ] **Step 2: Run snapshot + safety tests.**

Run: `yarn test tests/renderer`
Expected: all pass; existing snapshot unchanged (safety guards add no nodes for normal trees).

- [ ] **Step 3: Commit**

```bash
git add src/renderer/index.ts
git commit -m "feat(renderer): enforce depth and node-count limits in renderSource"
```

---

## Task 9: Component — `sidebar`

**Files:** `src/components/sidebar.ts`, `tests/components/sidebar.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/sidebar.test.ts
import { describe, it, expect } from "vitest";
import { SidebarDef } from "@/components/sidebar";

describe("sidebar", () => {
  it("renders a list of items", () => {
    const el = SidebarDef.render({ items: ["Home", "Docs"] }, {});
    expect(el.className).toContain("uis-sidebar");
    expect(el.querySelectorAll(".uis-sidebar__item").length).toBe(2);
  });
  it("highlights active by string match", () => {
    const el = SidebarDef.render({ items: ["Home", "Docs"], active: "Docs" }, {});
    const items = el.querySelectorAll(".uis-sidebar__item");
    expect((items[1] as HTMLElement).className).toContain("uis-sidebar__item--active");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/sidebar.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const SidebarSchema = BasePropsSchema.extend({
  items: z.array(z.string()).optional(),
  active: z.union([z.string(), z.number()]).optional(),
}).passthrough();

export const SidebarDef: ComponentDef = {
  type: "sidebar",
  schema: SidebarSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-sidebar";
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    const active = props.active;
    items.forEach((label, i) => {
      const item = document.createElement("div");
      item.className = "uis-sidebar__item";
      if (active === label || active === i) item.className += " uis-sidebar__item--active";
      item.textContent = label;
      el.appendChild(item);
    });
    return el;
  },
};
```

- [ ] Step 4: pass (2).
- [ ] Step 5: commit `feat(components): add sidebar`.

---

## Task 10: Component — `tabs`

**Files:** `src/components/tabs.ts`, `tests/components/tabs.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/tabs.test.ts
import { describe, it, expect } from "vitest";
import { TabsDef } from "@/components/tabs";

describe("tabs", () => {
  it("renders tabs horizontally with active marker", () => {
    const el = TabsDef.render({ items: ["One", "Two"], active: 1 }, {});
    expect(el.className).toContain("uis-tabs");
    const tabs = el.querySelectorAll(".uis-tabs__item");
    expect(tabs.length).toBe(2);
    expect((tabs[1] as HTMLElement).className).toContain("uis-tabs__item--active");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/tabs.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const TabsSchema = BasePropsSchema.extend({
  items: z.array(z.string()).optional(),
  active: z.union([z.string(), z.number()]).optional(),
}).passthrough();

export const TabsDef: ComponentDef = {
  type: "tabs",
  schema: TabsSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-tabs";
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    const active = props.active;
    items.forEach((label, i) => {
      const tab = document.createElement("div");
      tab.className = "uis-tabs__item";
      if (active === label || active === i) tab.className += " uis-tabs__item--active";
      tab.textContent = label;
      el.appendChild(tab);
    });
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add tabs`.

---

## Task 11: Component — `breadcrumb`

**Files:** `src/components/breadcrumb.ts`, `tests/components/breadcrumb.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/breadcrumb.test.ts
import { describe, it, expect } from "vitest";
import { BreadcrumbDef } from "@/components/breadcrumb";

describe("breadcrumb", () => {
  it("renders items separated by chevrons", () => {
    const el = BreadcrumbDef.render({ items: ["A", "B", "C"] }, {});
    expect(el.className).toContain("uis-breadcrumb");
    expect(el.querySelectorAll(".uis-breadcrumb__item").length).toBe(3);
    expect(el.querySelectorAll(".uis-breadcrumb__sep").length).toBe(2);
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/breadcrumb.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const BreadcrumbSchema = BasePropsSchema.extend({
  items: z.array(z.string()).optional(),
}).passthrough();

export const BreadcrumbDef: ComponentDef = {
  type: "breadcrumb",
  schema: BreadcrumbSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-breadcrumb";
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    items.forEach((label, i) => {
      if (i > 0) {
        const sep = document.createElement("span");
        sep.className = "uis-breadcrumb__sep";
        sep.textContent = "›";
        el.appendChild(sep);
      }
      const item = document.createElement("span");
      item.className = "uis-breadcrumb__item";
      item.textContent = label;
      el.appendChild(item);
    });
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add breadcrumb`.

---

## Task 12: Component — `pagination`

**Files:** `src/components/pagination.ts`, `tests/components/pagination.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/pagination.test.ts
import { describe, it, expect } from "vitest";
import { PaginationDef } from "@/components/pagination";

describe("pagination", () => {
  it("renders prev + current/total + next", () => {
    const el = PaginationDef.render({ current: 3, total: 10 }, {});
    expect(el.className).toContain("uis-pagination");
    expect(el.textContent).toContain("3");
    expect(el.textContent).toContain("10");
    expect(el.querySelector(".uis-pagination__prev")).not.toBeNull();
    expect(el.querySelector(".uis-pagination__next")).not.toBeNull();
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/pagination.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const PaginationSchema = BasePropsSchema.extend({
  current: z.number().optional(),
  total: z.number().optional(),
}).passthrough();

export const PaginationDef: ComponentDef = {
  type: "pagination",
  schema: PaginationSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-pagination";
    const prev = document.createElement("span");
    prev.className = "uis-pagination__prev";
    prev.textContent = "‹";
    el.appendChild(prev);
    const label = document.createElement("span");
    label.className = "uis-pagination__label";
    const c = typeof props.current === "number" ? props.current : 1;
    const t = typeof props.total === "number" ? props.total : 1;
    label.textContent = `${c} / ${t}`;
    el.appendChild(label);
    const next = document.createElement("span");
    next.className = "uis-pagination__next";
    next.textContent = "›";
    el.appendChild(next);
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add pagination`.

---

## Task 13: Component — `stepper`

**Files:** `src/components/stepper.ts`, `tests/components/stepper.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/stepper.test.ts
import { describe, it, expect } from "vitest";
import { StepperDef } from "@/components/stepper";

describe("stepper", () => {
  it("renders numbered steps with active marker", () => {
    const el = StepperDef.render({ items: ["Login", "Plan", "Confirm"], active: 1 }, {});
    expect(el.className).toContain("uis-stepper");
    const steps = el.querySelectorAll(".uis-stepper__step");
    expect(steps.length).toBe(3);
    expect((steps[1] as HTMLElement).className).toContain("uis-stepper__step--active");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/stepper.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const StepperSchema = BasePropsSchema.extend({
  items: z.array(z.string()).optional(),
  active: z.number().optional(),
}).passthrough();

export const StepperDef: ComponentDef = {
  type: "stepper",
  schema: StepperSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-stepper";
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    const active = typeof props.active === "number" ? props.active : -1;
    items.forEach((label, i) => {
      const step = document.createElement("div");
      step.className = "uis-stepper__step";
      if (i === active) step.className += " uis-stepper__step--active";
      const circle = document.createElement("span");
      circle.className = "uis-stepper__num";
      circle.textContent = String(i + 1);
      step.appendChild(circle);
      const text = document.createElement("span");
      text.className = "uis-stepper__label";
      text.textContent = label;
      step.appendChild(text);
      el.appendChild(step);
    });
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add stepper`.

---

## Task 14: Component — `textarea`

**Files:** `src/components/textarea.ts`, `tests/components/textarea.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/textarea.test.ts
import { describe, it, expect } from "vitest";
import { TextareaDef } from "@/components/textarea";

describe("textarea", () => {
  it("shows placeholder when no value", () => {
    const el = TextareaDef.render({ placeholder: "Notes" }, {});
    expect(el.className).toContain("uis-textarea");
    expect(el.querySelector(".uis-textarea__placeholder")?.textContent).toBe("Notes");
  });
  it("shows value when provided", () => {
    const el = TextareaDef.render({ value: "Hello\nworld" }, {});
    expect(el.querySelector(".uis-textarea__value")?.textContent).toBe("Hello\nworld");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/textarea.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const TextareaSchema = BasePropsSchema.extend({
  placeholder: z.string().optional(),
  value: z.string().optional(),
  rows: z.number().optional(),
}).passthrough();

export const TextareaDef: ComponentDef = {
  type: "textarea",
  schema: TextareaSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-textarea";
    const rows = typeof props.rows === "number" ? props.rows : 3;
    el.style.minHeight = `${rows * 18 + 16}px`;
    if (typeof props.value === "string" && props.value.length > 0) {
      const v = document.createElement("div");
      v.className = "uis-textarea__value";
      v.textContent = props.value;
      el.appendChild(v);
    } else if (typeof props.placeholder === "string") {
      const p = document.createElement("div");
      p.className = "uis-textarea__placeholder";
      p.textContent = props.placeholder;
      el.appendChild(p);
    }
    return el;
  },
};
```

- [ ] Step 4: pass (2).
- [ ] Step 5: commit `feat(components): add textarea`.

---

## Task 15: Component — `select`

**Files:** `src/components/select.ts`, `tests/components/select.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/select.test.ts
import { describe, it, expect } from "vitest";
import { SelectDef } from "@/components/select";

describe("select", () => {
  it("renders a chevron + placeholder", () => {
    const el = SelectDef.render({ placeholder: "Choose one" }, {});
    expect(el.className).toContain("uis-select");
    expect(el.querySelector(".uis-select__chevron")?.textContent).toBe("▼");
    expect(el.textContent).toContain("Choose one");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/select.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const SelectSchema = BasePropsSchema.extend({
  placeholder: z.string().optional(),
  value: z.string().optional(),
  options: z.array(z.string()).optional(),
}).passthrough();

export const SelectDef: ComponentDef = {
  type: "select",
  schema: SelectSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-select";
    const label = document.createElement("div");
    label.className = "uis-select__label";
    if (typeof props.value === "string" && props.value.length > 0) {
      label.textContent = props.value;
    } else if (typeof props.placeholder === "string") {
      label.className += " uis-select__placeholder";
      label.textContent = props.placeholder;
    }
    el.appendChild(label);
    const chevron = document.createElement("span");
    chevron.className = "uis-select__chevron";
    chevron.textContent = "▼";
    el.appendChild(chevron);
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add select`.

---

## Task 16: Component — `checkbox`

**Files:** `src/components/checkbox.ts`, `tests/components/checkbox.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/checkbox.test.ts
import { describe, it, expect } from "vitest";
import { CheckboxDef } from "@/components/checkbox";

describe("checkbox", () => {
  it("renders unchecked state", () => {
    const el = CheckboxDef.render({ label: "Agree" }, {});
    expect(el.className).toContain("uis-checkbox");
    expect(el.className).not.toContain("uis-checkbox--checked");
    expect(el.textContent).toContain("Agree");
  });
  it("renders checked state", () => {
    const el = CheckboxDef.render({ label: "Agree", checked: true }, {});
    expect(el.className).toContain("uis-checkbox--checked");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/checkbox.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const CheckboxSchema = BasePropsSchema.extend({
  label: z.string().optional(),
  checked: z.boolean().optional(),
}).passthrough();

export const CheckboxDef: ComponentDef = {
  type: "checkbox",
  schema: CheckboxSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-checkbox";
    if (props.checked === true) el.className += " uis-checkbox--checked";
    const box = document.createElement("span");
    box.className = "uis-checkbox__box";
    box.textContent = props.checked === true ? "✓" : "";
    el.appendChild(box);
    if (typeof props.label === "string") {
      const label = document.createElement("span");
      label.className = "uis-checkbox__label";
      label.textContent = props.label;
      el.appendChild(label);
    }
    return el;
  },
};
```

- [ ] Step 4: pass (2).
- [ ] Step 5: commit `feat(components): add checkbox`.

---

## Task 17: Component — `radio`

**Files:** `src/components/radio.ts`, `tests/components/radio.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/radio.test.ts
import { describe, it, expect } from "vitest";
import { RadioDef } from "@/components/radio";

describe("radio", () => {
  it("renders with label", () => {
    const el = RadioDef.render({ label: "A" }, {});
    expect(el.className).toContain("uis-radio");
    expect(el.textContent).toContain("A");
  });
  it("selected adds modifier class", () => {
    const el = RadioDef.render({ label: "A", selected: true }, {});
    expect(el.className).toContain("uis-radio--selected");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/radio.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const RadioSchema = BasePropsSchema.extend({
  label: z.string().optional(),
  selected: z.boolean().optional(),
}).passthrough();

export const RadioDef: ComponentDef = {
  type: "radio",
  schema: RadioSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-radio";
    if (props.selected === true) el.className += " uis-radio--selected";
    const circle = document.createElement("span");
    circle.className = "uis-radio__circle";
    el.appendChild(circle);
    if (typeof props.label === "string") {
      const label = document.createElement("span");
      label.className = "uis-radio__label";
      label.textContent = props.label;
      el.appendChild(label);
    }
    return el;
  },
};
```

- [ ] Step 4: pass (2).
- [ ] Step 5: commit `feat(components): add radio`.

---

## Task 18: Component — `toggle`

**Files:** `src/components/toggle.ts`, `tests/components/toggle.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/toggle.test.ts
import { describe, it, expect } from "vitest";
import { ToggleDef } from "@/components/toggle";

describe("toggle", () => {
  it("renders off state", () => {
    const el = ToggleDef.render({ label: "Dark mode" }, {});
    expect(el.className).toContain("uis-toggle");
    expect(el.className).not.toContain("uis-toggle--on");
  });
  it("renders on state", () => {
    const el = ToggleDef.render({ on: true }, {});
    expect(el.className).toContain("uis-toggle--on");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/toggle.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ToggleSchema = BasePropsSchema.extend({
  label: z.string().optional(),
  on: z.boolean().optional(),
}).passthrough();

export const ToggleDef: ComponentDef = {
  type: "toggle",
  schema: ToggleSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-toggle";
    if (props.on === true) el.className += " uis-toggle--on";
    const track = document.createElement("span");
    track.className = "uis-toggle__track";
    const thumb = document.createElement("span");
    thumb.className = "uis-toggle__thumb";
    track.appendChild(thumb);
    el.appendChild(track);
    if (typeof props.label === "string") {
      const lbl = document.createElement("span");
      lbl.className = "uis-toggle__label";
      lbl.textContent = props.label;
      el.appendChild(lbl);
    }
    return el;
  },
};
```

- [ ] Step 4: pass (2).
- [ ] Step 5: commit `feat(components): add toggle`.

---

## Task 19: Component — `slider`

**Files:** `src/components/slider.ts`, `tests/components/slider.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/slider.test.ts
import { describe, it, expect } from "vitest";
import { SliderDef } from "@/components/slider";

describe("slider", () => {
  it("renders track with thumb at value percent", () => {
    const el = SliderDef.render({ value: 30, min: 0, max: 100 }, {});
    expect(el.className).toContain("uis-slider");
    const thumb = el.querySelector(".uis-slider__thumb") as HTMLElement;
    expect(thumb.style.left).toBe("30%");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/slider.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const SliderSchema = BasePropsSchema.extend({
  value: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
}).passthrough();

export const SliderDef: ComponentDef = {
  type: "slider",
  schema: SliderSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-slider";
    const min = typeof props.min === "number" ? props.min : 0;
    const max = typeof props.max === "number" ? props.max : 100;
    const value = typeof props.value === "number" ? props.value : min;
    const pct = max === min ? 0 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    const track = document.createElement("span");
    track.className = "uis-slider__track";
    el.appendChild(track);
    const thumb = document.createElement("span");
    thumb.className = "uis-slider__thumb";
    thumb.style.left = `${pct}%`;
    el.appendChild(thumb);
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add slider`.

---

## Task 20: Component — `date-picker`

**Files:** `src/components/date-picker.ts`, `tests/components/date-picker.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/date-picker.test.ts
import { describe, it, expect } from "vitest";
import { DatePickerDef } from "@/components/date-picker";

describe("date-picker", () => {
  it("renders with calendar icon + placeholder", () => {
    const el = DatePickerDef.render({ placeholder: "YYYY-MM-DD" }, {});
    expect(el.className).toContain("uis-date-picker");
    expect(el.querySelector(".uis-date-picker__icon")?.textContent).toBe("📅");
    expect(el.textContent).toContain("YYYY-MM-DD");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/date-picker.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const DatePickerSchema = BasePropsSchema.extend({
  value: z.string().optional(),
  placeholder: z.string().optional(),
}).passthrough();

export const DatePickerDef: ComponentDef = {
  type: "date-picker",
  schema: DatePickerSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-date-picker";
    const icon = document.createElement("span");
    icon.className = "uis-date-picker__icon";
    icon.textContent = "📅";
    el.appendChild(icon);
    const label = document.createElement("span");
    label.className = "uis-date-picker__label";
    if (typeof props.value === "string" && props.value.length > 0) {
      label.textContent = props.value;
    } else if (typeof props.placeholder === "string") {
      label.className += " uis-date-picker__placeholder";
      label.textContent = props.placeholder;
    }
    el.appendChild(label);
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add date-picker`.

---

## Task 21: Component — `file-upload`

**Files:** `src/components/file-upload.ts`, `tests/components/file-upload.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/file-upload.test.ts
import { describe, it, expect } from "vitest";
import { FileUploadDef } from "@/components/file-upload";

describe("file-upload", () => {
  it("renders a dropzone with label", () => {
    const el = FileUploadDef.render({ label: "Drop files here" }, {});
    expect(el.className).toContain("uis-file-upload");
    expect(el.textContent).toContain("Drop files here");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/file-upload.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const FileUploadSchema = BasePropsSchema.extend({
  label: z.string().optional(),
}).passthrough();

export const FileUploadDef: ComponentDef = {
  type: "file-upload",
  schema: FileUploadSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-file-upload";
    const icon = document.createElement("span");
    icon.className = "uis-file-upload__icon";
    icon.textContent = "⬆";
    el.appendChild(icon);
    const label = document.createElement("span");
    label.className = "uis-file-upload__label";
    label.textContent = typeof props.label === "string" ? props.label : "Drop files or click to upload";
    el.appendChild(label);
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add file-upload`.

---

## Task 22: Component — `search`

**Files:** `src/components/search.ts`, `tests/components/search.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/search.test.ts
import { describe, it, expect } from "vitest";
import { SearchDef } from "@/components/search";

describe("search", () => {
  it("renders magnifier + placeholder", () => {
    const el = SearchDef.render({ placeholder: "Search docs..." }, {});
    expect(el.className).toContain("uis-search");
    expect(el.querySelector(".uis-search__icon")?.textContent).toBe("🔍");
    expect(el.textContent).toContain("Search docs...");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/search.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const SearchSchema = BasePropsSchema.extend({
  value: z.string().optional(),
  placeholder: z.string().optional(),
}).passthrough();

export const SearchDef: ComponentDef = {
  type: "search",
  schema: SearchSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-search";
    const icon = document.createElement("span");
    icon.className = "uis-search__icon";
    icon.textContent = "🔍";
    el.appendChild(icon);
    const label = document.createElement("span");
    label.className = "uis-search__label";
    if (typeof props.value === "string" && props.value.length > 0) {
      label.textContent = props.value;
    } else if (typeof props.placeholder === "string") {
      label.className += " uis-search__placeholder";
      label.textContent = props.placeholder;
    }
    el.appendChild(label);
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add search`.

---

## Task 23: Component — `image`

**Files:** `src/components/image.ts`, `tests/components/image.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/image.test.ts
import { describe, it, expect } from "vitest";
import { ImageDef } from "@/components/image";

describe("image", () => {
  it("renders a placeholder with alt text", () => {
    const el = ImageDef.render({ alt: "Hero photo" }, {});
    expect(el.className).toContain("uis-image");
    expect(el.textContent).toContain("Hero photo");
  });
  it("shows IMG label when no alt", () => {
    const el = ImageDef.render({}, {});
    expect(el.textContent).toContain("IMG");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/image.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ImageSchema = BasePropsSchema.extend({
  src: z.string().optional(),
  alt: z.string().optional(),
}).passthrough();

export const ImageDef: ComponentDef = {
  type: "image",
  schema: ImageSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-image";
    const label = document.createElement("span");
    label.className = "uis-image__label";
    label.textContent = typeof props.alt === "string" && props.alt.length > 0 ? props.alt : "IMG";
    el.appendChild(label);
    return el;
  },
};
```

- [ ] Step 4: pass (2).
- [ ] Step 5: commit `feat(components): add image`.

---

## Task 24: Component — `icon`

**Files:** `src/components/icon.ts`, `tests/components/icon.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/icon.test.ts
import { describe, it, expect } from "vitest";
import { IconDef } from "@/components/icon";

describe("icon", () => {
  it("renders name-initial circle when icon name given", () => {
    const el = IconDef.render({ name: "lock", size: 20 }, {}) as HTMLElement;
    expect(el.className).toContain("uis-icon");
    expect(el.textContent).toBe("l");
    expect(el.style.width).toBe("20px");
  });
  it("falls back to ? when no name", () => {
    const el = IconDef.render({}, {});
    expect(el.textContent).toBe("?");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/icon.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const IconSchema = BasePropsSchema.extend({
  name: z.string().optional(),
  size: z.number().optional(),
}).passthrough();

export const IconDef: ComponentDef = {
  type: "icon",
  schema: IconSchema,
  render(props) {
    const el = document.createElement("span");
    el.className = "uis-icon";
    const size = typeof props.size === "number" ? props.size : 16;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.lineHeight = `${size}px`;
    el.textContent = typeof props.name === "string" && props.name.length > 0 ? props.name[0] : "?";
    return el;
  },
};
```

- [ ] Step 4: pass (2).
- [ ] Step 5: commit `feat(components): add icon`.

---

## Task 25: Component — `avatar`

**Files:** `src/components/avatar.ts`, `tests/components/avatar.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/avatar.test.ts
import { describe, it, expect } from "vitest";
import { AvatarDef } from "@/components/avatar";

describe("avatar", () => {
  it("shows initials from name", () => {
    const el = AvatarDef.render({ name: "Ji Kwang" }, {});
    expect(el.className).toContain("uis-avatar");
    expect(el.textContent).toBe("JK");
  });
  it("uses single initial when name is one word", () => {
    const el = AvatarDef.render({ name: "Solo" }, {});
    expect(el.textContent).toBe("S");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/avatar.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const AvatarSchema = BasePropsSchema.extend({
  name: z.string().optional(),
  size: z.number().optional(),
}).passthrough();

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const AvatarDef: ComponentDef = {
  type: "avatar",
  schema: AvatarSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-avatar";
    const size = typeof props.size === "number" ? props.size : 32;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.lineHeight = `${size}px`;
    el.textContent = initials(typeof props.name === "string" ? props.name : "");
    return el;
  },
};
```

- [ ] Step 4: pass (2).
- [ ] Step 5: commit `feat(components): add avatar`.

---

## Task 26: Component — `badge`

**Files:** `src/components/badge.ts`, `tests/components/badge.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/badge.test.ts
import { describe, it, expect } from "vitest";
import { BadgeDef } from "@/components/badge";

describe("badge", () => {
  it("renders label with default variant", () => {
    const el = BadgeDef.render({ label: "NEW" }, {});
    expect(el.className).toContain("uis-badge");
    expect(el.className).toContain("uis-badge--default");
    expect(el.textContent).toBe("NEW");
  });
  it("supports variant", () => {
    const el = BadgeDef.render({ label: "!", variant: "danger" }, {});
    expect(el.className).toContain("uis-badge--danger");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/badge.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const BadgeSchema = BasePropsSchema.extend({
  label: z.string().optional(),
  variant: z.enum(["default", "primary", "success", "warning", "danger"]).optional(),
}).passthrough();

export const BadgeDef: ComponentDef = {
  type: "badge",
  schema: BadgeSchema,
  render(props) {
    const el = document.createElement("span");
    const variant = typeof props.variant === "string" ? props.variant : "default";
    el.className = `uis-badge uis-badge--${variant}`;
    el.textContent = typeof props.label === "string" ? props.label : "";
    return el;
  },
};
```

- [ ] Step 4: pass (2).
- [ ] Step 5: commit `feat(components): add badge`.

---

## Task 27: Component — `tag`

**Files:** `src/components/tag.ts`, `tests/components/tag.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/tag.test.ts
import { describe, it, expect } from "vitest";
import { TagDef } from "@/components/tag";

describe("tag", () => {
  it("renders label", () => {
    const el = TagDef.render({ label: "design" }, {});
    expect(el.className).toContain("uis-tag");
    expect(el.textContent).toBe("design");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/tag.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const TagSchema = BasePropsSchema.extend({
  label: z.string().optional(),
}).passthrough();

export const TagDef: ComponentDef = {
  type: "tag",
  schema: TagSchema,
  render(props) {
    const el = document.createElement("span");
    el.className = "uis-tag";
    el.textContent = typeof props.label === "string" ? props.label : "";
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add tag`.

---

## Task 28: Component — `kbd`

**Files:** `src/components/kbd.ts`, `tests/components/kbd.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/kbd.test.ts
import { describe, it, expect } from "vitest";
import { KbdDef } from "@/components/kbd";

describe("kbd", () => {
  it("renders keycaps joined by +", () => {
    const el = KbdDef.render({ keys: ["Ctrl", "K"] }, {});
    expect(el.className).toContain("uis-kbd");
    const caps = el.querySelectorAll(".uis-kbd__cap");
    expect(caps.length).toBe(2);
    expect(el.textContent).toContain("+");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/kbd.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const KbdSchema = BasePropsSchema.extend({
  keys: z.array(z.string()).optional(),
}).passthrough();

export const KbdDef: ComponentDef = {
  type: "kbd",
  schema: KbdSchema,
  render(props) {
    const el = document.createElement("span");
    el.className = "uis-kbd";
    const keys = Array.isArray(props.keys) ? (props.keys as string[]) : [];
    keys.forEach((k, i) => {
      if (i > 0) {
        const plus = document.createElement("span");
        plus.className = "uis-kbd__plus";
        plus.textContent = "+";
        el.appendChild(plus);
      }
      const cap = document.createElement("span");
      cap.className = "uis-kbd__cap";
      cap.textContent = k;
      el.appendChild(cap);
    });
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add kbd`.

---

## Task 29: Component — `alert`

**Files:** `src/components/alert.ts`, `tests/components/alert.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/alert.test.ts
import { describe, it, expect } from "vitest";
import { AlertDef } from "@/components/alert";

describe("alert", () => {
  it("renders info alert by default with title + message", () => {
    const el = AlertDef.render({ title: "Heads up", message: "Details" }, {});
    expect(el.className).toContain("uis-alert");
    expect(el.className).toContain("uis-alert--info");
    expect(el.querySelector(".uis-alert__title")?.textContent).toBe("Heads up");
    expect(el.querySelector(".uis-alert__message")?.textContent).toBe("Details");
  });
  it("supports severity", () => {
    const el = AlertDef.render({ severity: "error", message: "bad" }, {});
    expect(el.className).toContain("uis-alert--error");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/alert.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const AlertSchema = BasePropsSchema.extend({
  title: z.string().optional(),
  message: z.string().optional(),
  severity: z.enum(["info", "warn", "error", "success"]).optional(),
}).passthrough();

export const AlertDef: ComponentDef = {
  type: "alert",
  schema: AlertSchema,
  render(props) {
    const el = document.createElement("div");
    const severity = typeof props.severity === "string" ? props.severity : "info";
    el.className = `uis-alert uis-alert--${severity}`;
    if (typeof props.title === "string") {
      const t = document.createElement("div");
      t.className = "uis-alert__title";
      t.textContent = props.title;
      el.appendChild(t);
    }
    if (typeof props.message === "string") {
      const m = document.createElement("div");
      m.className = "uis-alert__message";
      m.textContent = props.message;
      el.appendChild(m);
    }
    return el;
  },
};
```

- [ ] Step 4: pass (2).
- [ ] Step 5: commit `feat(components): add alert`.

---

## Task 30: Component — `progress`

**Files:** `src/components/progress.ts`, `tests/components/progress.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/progress.test.ts
import { describe, it, expect } from "vitest";
import { ProgressDef } from "@/components/progress";

describe("progress", () => {
  it("renders a bar with fill width", () => {
    const el = ProgressDef.render({ value: 40 }, {});
    expect(el.className).toContain("uis-progress");
    const fill = el.querySelector(".uis-progress__fill") as HTMLElement;
    expect(fill.style.width).toBe("40%");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/progress.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ProgressSchema = BasePropsSchema.extend({
  value: z.number().optional(),
  label: z.string().optional(),
}).passthrough();

export const ProgressDef: ComponentDef = {
  type: "progress",
  schema: ProgressSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-progress";
    const raw = typeof props.value === "number" ? props.value : 0;
    const pct = Math.max(0, Math.min(100, raw));
    const track = document.createElement("div");
    track.className = "uis-progress__track";
    const fill = document.createElement("div");
    fill.className = "uis-progress__fill";
    fill.style.width = `${pct}%`;
    track.appendChild(fill);
    el.appendChild(track);
    if (typeof props.label === "string") {
      const lbl = document.createElement("div");
      lbl.className = "uis-progress__label";
      lbl.textContent = props.label;
      el.appendChild(lbl);
    }
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add progress`.

---

## Task 31: Component — `toast`

**Files:** `src/components/toast.ts`, `tests/components/toast.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/toast.test.ts
import { describe, it, expect } from "vitest";
import { ToastDef } from "@/components/toast";

describe("toast", () => {
  it("renders message with severity class", () => {
    const el = ToastDef.render({ message: "Saved", severity: "success" }, {});
    expect(el.className).toContain("uis-toast");
    expect(el.className).toContain("uis-toast--success");
    expect(el.textContent).toContain("Saved");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/toast.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ToastSchema = BasePropsSchema.extend({
  message: z.string().optional(),
  severity: z.enum(["info", "warn", "error", "success"]).optional(),
}).passthrough();

export const ToastDef: ComponentDef = {
  type: "toast",
  schema: ToastSchema,
  render(props) {
    const el = document.createElement("div");
    const severity = typeof props.severity === "string" ? props.severity : "info";
    el.className = `uis-toast uis-toast--${severity}`;
    const msg = document.createElement("span");
    msg.className = "uis-toast__message";
    msg.textContent = typeof props.message === "string" ? props.message : "";
    el.appendChild(msg);
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add toast`.

---

## Task 32: Component — `modal`

**Files:** `src/components/modal.ts`, `tests/components/modal.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/modal.test.ts
import { describe, it, expect } from "vitest";
import { ModalDef } from "@/components/modal";

describe("modal", () => {
  it("renders title and body in a framed box", () => {
    const el = ModalDef.render({ title: "Confirm", body: "Proceed?" }, {});
    expect(el.className).toContain("uis-modal");
    expect(el.querySelector(".uis-modal__title")?.textContent).toBe("Confirm");
    expect(el.querySelector(".uis-modal__body")?.textContent).toBe("Proceed?");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/modal.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ModalSchema = BasePropsSchema.extend({
  title: z.string().optional(),
  body: z.string().optional(),
}).passthrough();

export const ModalDef: ComponentDef = {
  type: "modal",
  schema: ModalSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-modal";
    if (typeof props.title === "string") {
      const t = document.createElement("div");
      t.className = "uis-modal__title";
      t.textContent = props.title;
      el.appendChild(t);
    }
    if (typeof props.body === "string") {
      const b = document.createElement("div");
      b.className = "uis-modal__body";
      b.textContent = props.body;
      el.appendChild(b);
    }
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add modal`.

---

## Task 33: Component — `skeleton`

**Files:** `src/components/skeleton.ts`, `tests/components/skeleton.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/skeleton.test.ts
import { describe, it, expect } from "vitest";
import { SkeletonDef } from "@/components/skeleton";

describe("skeleton", () => {
  it("renders with explicit sizes", () => {
    const el = SkeletonDef.render({ width: 120, height: 24 }, {}) as HTMLElement;
    expect(el.className).toContain("uis-skeleton");
    expect(el.style.width).toBe("120px");
    expect(el.style.height).toBe("24px");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/skeleton.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const SkeletonSchema = BasePropsSchema.extend({
  width: z.union([z.string(), z.number()]).optional(),
  height: z.union([z.string(), z.number()]).optional(),
}).passthrough();

export const SkeletonDef: ComponentDef = {
  type: "skeleton",
  schema: SkeletonSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-skeleton";
    const w = props.width;
    const h = props.height;
    if (typeof w === "number") el.style.width = `${w}px`;
    else if (typeof w === "string") el.style.width = w;
    if (typeof h === "number") el.style.height = `${h}px`;
    else if (typeof h === "string") el.style.height = h;
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add skeleton`.

---

## Task 34: Component — `table`

**Files:** `src/components/table.ts`, `tests/components/table.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/table.test.ts
import { describe, it, expect } from "vitest";
import { TableDef } from "@/components/table";

describe("table", () => {
  it("renders columns as thead and rows as tbody", () => {
    const el = TableDef.render({ columns: ["A", "B"], rows: [["1", "2"], ["3", "4"]] }, {});
    expect(el.className).toContain("uis-table");
    expect(el.querySelectorAll("th").length).toBe(2);
    expect(el.querySelectorAll("tbody tr").length).toBe(2);
    expect(el.querySelectorAll("tbody td").length).toBe(4);
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/table.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const TableSchema = BasePropsSchema.extend({
  columns: z.array(z.string()).optional(),
  rows: z.array(z.array(z.string())).optional(),
}).passthrough();

export const TableDef: ComponentDef = {
  type: "table",
  schema: TableSchema,
  render(props) {
    const el = document.createElement("table");
    el.className = "uis-table";
    const columns = Array.isArray(props.columns) ? (props.columns as string[]) : [];
    const rows = Array.isArray(props.rows) ? (props.rows as string[][]) : [];
    if (columns.length > 0) {
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      for (const c of columns) {
        const th = document.createElement("th");
        th.textContent = c;
        tr.appendChild(th);
      }
      thead.appendChild(tr);
      el.appendChild(thead);
    }
    const tbody = document.createElement("tbody");
    for (const row of rows) {
      const tr = document.createElement("tr");
      for (const cell of row) {
        const td = document.createElement("td");
        td.textContent = String(cell);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    el.appendChild(tbody);
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add table`.

---

## Task 35: Component — `list`

**Files:** `src/components/list.ts`, `tests/components/list.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/list.test.ts
import { describe, it, expect } from "vitest";
import { ListDef } from "@/components/list";

describe("list", () => {
  it("renders an unordered list by default", () => {
    const el = ListDef.render({ items: ["A", "B", "C"] }, {});
    expect(el.tagName).toBe("UL");
    expect(el.className).toContain("uis-list");
    expect(el.querySelectorAll("li").length).toBe(3);
  });
  it("renders an ordered list when ordered=true", () => {
    const el = ListDef.render({ items: ["X"], ordered: true }, {});
    expect(el.tagName).toBe("OL");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/list.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ListSchema = BasePropsSchema.extend({
  items: z.array(z.string()).optional(),
  ordered: z.boolean().optional(),
}).passthrough();

export const ListDef: ComponentDef = {
  type: "list",
  render(props) {
    const ordered = props.ordered === true;
    const el = document.createElement(ordered ? "ol" : "ul");
    el.className = "uis-list";
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    for (const raw of items) {
      const li = document.createElement("li");
      li.textContent = String(raw);
      el.appendChild(li);
    }
    return el;
  },
  schema: ListSchema,
};
```

- [ ] Step 4: pass (2).
- [ ] Step 5: commit `feat(components): add list`.

---

## Task 36: Component — `tree`

**Files:** `src/components/tree.ts`, `tests/components/tree.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/tree.test.ts
import { describe, it, expect } from "vitest";
import { TreeDef } from "@/components/tree";

describe("tree", () => {
  it("renders a nested tree with labels and children", () => {
    const el = TreeDef.render({
      items: [
        { label: "src", children: [ { label: "main.ts" }, { label: "types.ts" } ] },
        { label: "docs" },
      ],
    }, {});
    expect(el.className).toContain("uis-tree");
    expect(el.querySelectorAll(".uis-tree__node").length).toBeGreaterThanOrEqual(4);
    expect(el.querySelectorAll(".uis-tree__children").length).toBe(1);
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/tree.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

type TreeItem = { label?: string; children?: TreeItem[] };

const TreeItemSchema: z.ZodType<TreeItem> = z.lazy(() =>
  z
    .object({
      label: z.string().optional(),
      children: z.array(TreeItemSchema).optional(),
    })
    .passthrough(),
);

export const TreeSchema = BasePropsSchema.extend({
  items: z.array(TreeItemSchema).optional(),
}).passthrough();

function renderItem(item: TreeItem): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-tree__node";
  const label = document.createElement("span");
  label.className = "uis-tree__label";
  label.textContent = item.label ?? "";
  el.appendChild(label);
  if (Array.isArray(item.children) && item.children.length > 0) {
    const children = document.createElement("div");
    children.className = "uis-tree__children";
    for (const child of item.children) children.appendChild(renderItem(child));
    el.appendChild(children);
  }
  return el;
}

export const TreeDef: ComponentDef = {
  type: "tree",
  schema: TreeSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-tree";
    const items = Array.isArray(props.items) ? (props.items as TreeItem[]) : [];
    for (const item of items) el.appendChild(renderItem(item));
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add tree`.

---

## Task 37: Component — `kv-list`

**Files:** `src/components/kv-list.ts`, `tests/components/kv-list.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/kv-list.test.ts
import { describe, it, expect } from "vitest";
import { KvListDef } from "@/components/kv-list";

describe("kv-list", () => {
  it("renders key-value pairs", () => {
    const el = KvListDef.render({ items: [["Name", "Ada"], ["Role", "Engineer"]] }, {});
    expect(el.className).toContain("uis-kv");
    const rows = el.querySelectorAll(".uis-kv__row");
    expect(rows.length).toBe(2);
    expect(el.querySelector(".uis-kv__key")?.textContent).toBe("Name");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/kv-list.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const KvListSchema = BasePropsSchema.extend({
  items: z.array(z.tuple([z.string(), z.string()])).optional(),
}).passthrough();

export const KvListDef: ComponentDef = {
  type: "kv-list",
  schema: KvListSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-kv";
    const items = Array.isArray(props.items) ? (props.items as [string, string][]) : [];
    for (const [k, v] of items) {
      const row = document.createElement("div");
      row.className = "uis-kv__row";
      const key = document.createElement("span");
      key.className = "uis-kv__key";
      key.textContent = k;
      row.appendChild(key);
      const val = document.createElement("span");
      val.className = "uis-kv__val";
      val.textContent = v;
      row.appendChild(val);
      el.appendChild(row);
    }
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add kv-list`.

---

## Task 38: Component — `chart`

**Files:** `src/components/chart.ts`, `tests/components/chart.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/chart.test.ts
import { describe, it, expect } from "vitest";
import { ChartDef } from "@/components/chart";

describe("chart", () => {
  it("renders placeholder with chart kind label", () => {
    const el = ChartDef.render({ kind: "bar", label: "Sales" }, {});
    expect(el.className).toContain("uis-chart");
    expect(el.className).toContain("uis-chart--bar");
    expect(el.textContent).toContain("BAR CHART");
    expect(el.textContent).toContain("Sales");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/chart.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ChartSchema = BasePropsSchema.extend({
  kind: z.enum(["bar", "line", "pie"]).optional(),
  label: z.string().optional(),
}).passthrough();

export const ChartDef: ComponentDef = {
  type: "chart",
  schema: ChartSchema,
  render(props) {
    const kind = typeof props.kind === "string" ? props.kind : "bar";
    const el = document.createElement("div");
    el.className = `uis-chart uis-chart--${kind}`;
    const badge = document.createElement("div");
    badge.className = "uis-chart__badge";
    badge.textContent = `${kind.toUpperCase()} CHART`;
    el.appendChild(badge);
    if (typeof props.label === "string") {
      const lbl = document.createElement("div");
      lbl.className = "uis-chart__label";
      lbl.textContent = props.label;
      el.appendChild(lbl);
    }
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add chart`.

---

## Task 39: Component — `map`

**Files:** `src/components/map.ts`, `tests/components/map.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/map.test.ts
import { describe, it, expect } from "vitest";
import { MapDef } from "@/components/map";

describe("map", () => {
  it("renders a MAP placeholder", () => {
    const el = MapDef.render({}, {});
    expect(el.className).toContain("uis-map");
    expect(el.textContent).toContain("MAP");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/map.ts
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const MapSchema = BasePropsSchema.passthrough();

export const MapDef: ComponentDef = {
  type: "map",
  schema: MapSchema,
  render() {
    const el = document.createElement("div");
    el.className = "uis-map";
    const badge = document.createElement("div");
    badge.className = "uis-map__badge";
    badge.textContent = "MAP";
    el.appendChild(badge);
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add map`.

---

## Task 40: Component — `video`

**Files:** `src/components/video.ts`, `tests/components/video.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/video.test.ts
import { describe, it, expect } from "vitest";
import { VideoDef } from "@/components/video";

describe("video", () => {
  it("renders a VIDEO placeholder with play icon", () => {
    const el = VideoDef.render({}, {});
    expect(el.className).toContain("uis-video");
    expect(el.textContent).toContain("VIDEO");
    expect(el.querySelector(".uis-video__play")).not.toBeNull();
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/video.ts
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const VideoSchema = BasePropsSchema.passthrough();

export const VideoDef: ComponentDef = {
  type: "video",
  schema: VideoSchema,
  render() {
    const el = document.createElement("div");
    el.className = "uis-video";
    const play = document.createElement("span");
    play.className = "uis-video__play";
    play.textContent = "▶";
    el.appendChild(play);
    const badge = document.createElement("span");
    badge.className = "uis-video__badge";
    badge.textContent = "VIDEO";
    el.appendChild(badge);
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add video`.

---

## Task 41: Component — `placeholder`

**Files:** `src/components/placeholder.ts`, `tests/components/placeholder.test.ts`.

- [ ] Step 1 (test):
```ts
// tests/components/placeholder.test.ts
import { describe, it, expect } from "vitest";
import { PlaceholderDef } from "@/components/placeholder";

describe("placeholder", () => {
  it("renders a dashed box with custom label", () => {
    const el = PlaceholderDef.render({ label: "TBD" }, {});
    expect(el.className).toContain("uis-placeholder");
    expect(el.textContent).toBe("TBD");
  });
});
```

- [ ] Step 2: fail.
- [ ] Step 3 (impl):
```ts
// src/components/placeholder.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const PlaceholderSchema = BasePropsSchema.extend({
  label: z.string().optional(),
}).passthrough();

export const PlaceholderDef: ComponentDef = {
  type: "placeholder",
  schema: PlaceholderSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-placeholder";
    el.textContent = typeof props.label === "string" ? props.label : "";
    return el;
  },
};
```

- [ ] Step 4: pass (1).
- [ ] Step 5: commit `feat(components): add placeholder`.

---

## Task 42: Install sanitize-html + `raw` component

**Files:**
- Modify `package.json` (add `sanitize-html` dep + `@types/sanitize-html` devDep).
- Create `src/components/raw.ts`, `tests/components/raw.test.ts`.

- [ ] **Step 1: Add dependencies**

Run:
```bash
yarn add sanitize-html
yarn add -D @types/sanitize-html
```

- [ ] **Step 2: Write failing test**

```ts
// tests/components/raw.test.ts
import { describe, it, expect } from "vitest";
import { RawDef } from "@/components/raw";

describe("raw", () => {
  it("renders sanitized html", () => {
    const el = RawDef.render({ html: "<b>bold</b><script>alert(1)</script>" }, {});
    expect(el.className).toContain("uis-raw");
    expect(el.innerHTML).toContain("<b>bold</b>");
    expect(el.innerHTML).not.toContain("<script>");
  });
  it("renders plain text when no html", () => {
    const el = RawDef.render({ text: "hello" }, {});
    expect(el.textContent).toBe("hello");
  });
});
```

- [ ] **Step 3: Run — expect fail.**

- [ ] **Step 4: Implement**

```ts
// src/components/raw.ts
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const RawSchema = BasePropsSchema.extend({
  html: z.string().optional(),
  text: z.string().optional(),
}).passthrough();

const ALLOWED_TAGS = [
  "b", "i", "em", "strong", "a", "p", "br",
  "span", "div", "ul", "ol", "li", "code", "pre",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote",
];

const ALLOWED_ATTRS = {
  a: ["href"],
  "*": ["class", "style"],
};

const ALLOWED_STYLES: Record<string, Record<string, RegExp[]>> = {
  "*": {
    "color": [/^.*$/],
    "background": [/^.*$/],
    "font-weight": [/^.*$/],
    "text-align": [/^.*$/],
    "padding": [/^.*$/],
    "margin": [/^.*$/],
  },
};

export const RawDef: ComponentDef = {
  type: "raw",
  schema: RawSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-raw";
    if (typeof props.html === "string") {
      el.innerHTML = sanitizeHtml(props.html, {
        allowedTags: ALLOWED_TAGS,
        allowedAttributes: ALLOWED_ATTRS,
        allowedStyles: ALLOWED_STYLES,
      });
    } else if (typeof props.text === "string") {
      el.textContent = props.text;
    }
    return el;
  },
};
```

- [ ] **Step 5: Run — expect pass (2).**

Run: `yarn test tests/components/raw.test.ts`

- [ ] **Step 6: Commit**

```bash
git add package.json yarn.lock src/components/raw.ts tests/components/raw.test.ts
git commit -m "feat(components): add raw (sanitized HTML) escape hatch"
```

---

## Task 43: Retrofit Plan 1's 10 components with zod schemas

**Files:** Modify these 10 files:
- `src/components/container.ts`
- `src/components/card.ts`
- `src/components/panel.ts`
- `src/components/divider.ts`
- `src/components/spacer.ts`
- `src/components/button.ts`
- `src/components/input.ts`
- `src/components/heading.ts`
- `src/components/text.ts`
- `src/components/navbar.ts`

For each file, add an `export const <Name>Schema = BasePropsSchema.extend(...)` and wire it into the ComponentDef (`schema: <Name>Schema`). The render body stays identical (zod validates; render uses the parsed props the same way).

- [ ] **Step 1: Apply these 10 edits**

#### 1. `container.ts`
Add at top after the existing imports:
```ts
import { z } from "zod";
import { BasePropsSchema } from "@/schema/base";

export const ContainerSchema = BasePropsSchema.passthrough();
```
And add `schema: ContainerSchema,` into `ContainerDef` (before `type:` or after, wherever looks consistent with the other components you've written).

#### 2. `card.ts`
```ts
import { z } from "zod";
import { BasePropsSchema } from "@/schema/base";

export const CardSchema = BasePropsSchema.extend({
  title: z.string().optional(),
  body: z.string().optional(),
}).passthrough();
```
Add `schema: CardSchema,` to `CardDef`.

#### 3. `panel.ts`
```ts
import { z } from "zod";
import { BasePropsSchema } from "@/schema/base";

export const PanelSchema = BasePropsSchema.extend({
  header: z.string().optional(),
}).passthrough();
```
Add `schema: PanelSchema,` to `PanelDef`.

#### 4. `divider.ts`
```ts
import { z } from "zod";
import { BasePropsSchema } from "@/schema/base";

export const DividerSchema = BasePropsSchema.extend({
  orientation: z.enum(["horizontal", "vertical"]).optional(),
}).passthrough();
```
Add `schema: DividerSchema,` to `DividerDef`.

#### 5. `spacer.ts`
```ts
import { z } from "zod";
import { BasePropsSchema } from "@/schema/base";

export const SpacerSchema = BasePropsSchema.extend({
  size: z.number().optional(),
}).passthrough();
```
Add `schema: SpacerSchema,` to `SpacerDef`.

#### 6. `button.ts`
```ts
import { z } from "zod";
import { BasePropsSchema } from "@/schema/base";

export const ButtonSchema = BasePropsSchema.extend({
  label: z.string().optional(),
  variant: z.enum(["primary", "secondary", "ghost", "danger"]).optional(),
  icon: z.string().optional(),
}).passthrough();
```
Add `schema: ButtonSchema,` to `ButtonDef`.

#### 7. `input.ts`
```ts
import { z } from "zod";
import { BasePropsSchema } from "@/schema/base";

export const InputSchema = BasePropsSchema.extend({
  placeholder: z.string().optional(),
  value: z.string().optional(),
}).passthrough();
```
Add `schema: InputSchema,` to `InputDef`.

#### 8. `heading.ts`
```ts
import { z } from "zod";
import { BasePropsSchema } from "@/schema/base";

export const HeadingSchema = BasePropsSchema.extend({
  text: z.string().optional(),
  level: z.number().optional(),
}).passthrough();
```
Add `schema: HeadingSchema,` to `HeadingDef`.

#### 9. `text.ts`
```ts
import { z } from "zod";
import { BasePropsSchema } from "@/schema/base";

export const TextSchema = BasePropsSchema.extend({
  value: z.string().optional(),
  tone: z.enum(["muted", "strong", "accent"]).optional(),
}).passthrough();
```
Add `schema: TextSchema,` to `TextDef`.

#### 10. `navbar.ts`
```ts
import { z } from "zod";
import { BasePropsSchema } from "@/schema/base";

export const NavbarSchema = BasePropsSchema.extend({
  brand: z.string().optional(),
  items: z.array(z.string()).optional(),
}).passthrough();
```
Add `schema: NavbarSchema,` to `NavbarDef`.

- [ ] **Step 2: Run all tests**

Run: `yarn test`
Expected: existing component tests still pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/container.ts src/components/card.ts src/components/panel.ts src/components/divider.ts src/components/spacer.ts src/components/button.ts src/components/input.ts src/components/heading.ts src/components/text.ts src/components/navbar.ts
git commit -m "feat(components): add zod schemas to Plan 1 components"
```

---

## Task 44: Register all 44 components

**Files:** Modify `src/components/index.ts`.

- [ ] **Step 1: Replace the file**

```ts
// src/components/index.ts
import { register } from "./registry";
import { ContainerDef } from "./container";
import { CardDef } from "./card";
import { PanelDef } from "./panel";
import { DividerDef } from "./divider";
import { SpacerDef } from "./spacer";
import { ButtonDef } from "./button";
import { InputDef } from "./input";
import { HeadingDef } from "./heading";
import { TextDef } from "./text";
import { NavbarDef } from "./navbar";
import { SidebarDef } from "./sidebar";
import { TabsDef } from "./tabs";
import { BreadcrumbDef } from "./breadcrumb";
import { PaginationDef } from "./pagination";
import { StepperDef } from "./stepper";
import { TextareaDef } from "./textarea";
import { SelectDef } from "./select";
import { CheckboxDef } from "./checkbox";
import { RadioDef } from "./radio";
import { ToggleDef } from "./toggle";
import { SliderDef } from "./slider";
import { DatePickerDef } from "./date-picker";
import { FileUploadDef } from "./file-upload";
import { SearchDef } from "./search";
import { ImageDef } from "./image";
import { IconDef } from "./icon";
import { AvatarDef } from "./avatar";
import { BadgeDef } from "./badge";
import { TagDef } from "./tag";
import { KbdDef } from "./kbd";
import { AlertDef } from "./alert";
import { ProgressDef } from "./progress";
import { ToastDef } from "./toast";
import { ModalDef } from "./modal";
import { SkeletonDef } from "./skeleton";
import { TableDef } from "./table";
import { ListDef } from "./list";
import { TreeDef } from "./tree";
import { KvListDef } from "./kv-list";
import { ChartDef } from "./chart";
import { MapDef } from "./map";
import { VideoDef } from "./video";
import { PlaceholderDef } from "./placeholder";
import { RawDef } from "./raw";

let installed = false;
export function installBuiltinComponents(): void {
  if (installed) return;
  installed = true;
  for (const def of [
    ContainerDef, CardDef, PanelDef, DividerDef, SpacerDef,
    ButtonDef, InputDef, HeadingDef, TextDef, NavbarDef,
    SidebarDef, TabsDef, BreadcrumbDef, PaginationDef, StepperDef,
    TextareaDef, SelectDef, CheckboxDef, RadioDef,
    ToggleDef, SliderDef, DatePickerDef, FileUploadDef, SearchDef,
    ImageDef, IconDef, AvatarDef, BadgeDef, TagDef, KbdDef,
    AlertDef, ProgressDef, ToastDef, ModalDef, SkeletonDef,
    TableDef, ListDef, TreeDef, KvListDef,
    ChartDef, MapDef, VideoDef, PlaceholderDef,
    RawDef,
  ]) {
    register(def);
  }
}

export { lookup, registeredTypes } from "./registry";
```

- [ ] **Step 2: Run tests**

Run: `yarn test`
Expected: all tests still pass. Note the `l3.test.ts` may need updating — the typo suggestion test previously asserted "buton" → "button" worked because button was the closest registered type. With 44 components registered, "buton" is still closest to "button" (edit distance 1). If the test fails, check the snapshot for the actually-closest type.

- [ ] **Step 3: Commit**

```bash
git add src/components/index.ts
git commit -m "feat(components): register all 44 builtin components"
```

---

## Task 45: Styles for new components

**Files:** Modify `styles.css`.

- [ ] **Step 1: Append the following to `styles.css`** (do NOT replace the existing content — append after the existing rules):

```css
/* ===== Sidebar ===== */
.uis-sidebar { display: flex; flex-direction: column; gap: 4px; padding: 8px; background: var(--background-secondary); border-right: 1px solid var(--background-modifier-border); min-width: 140px; }
.uis-sidebar__item { padding: 6px 10px; border-radius: var(--radius-s, 6px); color: var(--text-muted); font-size: 0.95em; cursor: default; }
.uis-sidebar__item--active { background: var(--background-modifier-hover); color: var(--text-normal); font-weight: 500; }

/* ===== Tabs ===== */
.uis-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--background-modifier-border); }
.uis-tabs__item { padding: 8px 14px; color: var(--text-muted); font-size: 0.95em; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.uis-tabs__item--active { color: var(--interactive-accent); border-bottom-color: var(--interactive-accent); font-weight: 500; }

/* ===== Breadcrumb ===== */
.uis-breadcrumb { display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 0.9em; }
.uis-breadcrumb__item { color: var(--text-muted); }
.uis-breadcrumb__sep { color: var(--text-faint, var(--text-muted)); opacity: 0.6; }

/* ===== Pagination ===== */
.uis-pagination { display: inline-flex; align-items: center; gap: 10px; font-size: 0.9em; }
.uis-pagination__prev, .uis-pagination__next { padding: 4px 10px; border: 1px solid var(--background-modifier-border); border-radius: var(--radius-s, 6px); color: var(--text-normal); cursor: default; }
.uis-pagination__label { color: var(--text-muted); }

/* ===== Stepper ===== */
.uis-stepper { display: flex; gap: 12px; align-items: center; }
.uis-stepper__step { display: inline-flex; gap: 6px; align-items: center; color: var(--text-muted); font-size: 0.95em; }
.uis-stepper__num { width: 22px; height: 22px; border-radius: 50%; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); display: inline-flex; align-items: center; justify-content: center; font-size: 0.85em; }
.uis-stepper__step--active .uis-stepper__num { background: var(--interactive-accent); color: var(--text-on-accent, white); border-color: transparent; }
.uis-stepper__step--active .uis-stepper__label { color: var(--text-normal); font-weight: 500; }

/* ===== Textarea ===== */
.uis-textarea { padding: 8px 10px; background: var(--background-primary); border: 1px solid var(--background-modifier-border); border-radius: var(--radius-s, 6px); white-space: pre-wrap; }
.uis-textarea__placeholder { color: var(--text-muted); }
.uis-textarea__value { color: var(--text-normal); }

/* ===== Select ===== */
.uis-select { display: flex; justify-content: space-between; align-items: center; min-height: 32px; padding: 4px 10px; background: var(--background-primary); border: 1px solid var(--background-modifier-border); border-radius: var(--radius-s, 6px); }
.uis-select__label { color: var(--text-normal); }
.uis-select__placeholder { color: var(--text-muted); }
.uis-select__chevron { color: var(--text-muted); font-size: 0.75em; }

/* ===== Checkbox / Radio ===== */
.uis-checkbox, .uis-radio { display: inline-flex; align-items: center; gap: 6px; font-size: 0.95em; }
.uis-checkbox__box { width: 16px; height: 16px; border: 1px solid var(--background-modifier-border); border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; background: var(--background-primary); font-size: 12px; line-height: 1; }
.uis-checkbox--checked .uis-checkbox__box { background: var(--interactive-accent); color: var(--text-on-accent, white); border-color: transparent; }
.uis-radio__circle { width: 14px; height: 14px; border: 1px solid var(--background-modifier-border); border-radius: 50%; display: inline-block; background: var(--background-primary); }
.uis-radio--selected .uis-radio__circle { background: var(--interactive-accent); border-color: transparent; box-shadow: inset 0 0 0 3px var(--background-primary); }

/* ===== Toggle ===== */
.uis-toggle { display: inline-flex; align-items: center; gap: 8px; font-size: 0.95em; }
.uis-toggle__track { width: 28px; height: 16px; border-radius: 999px; background: var(--background-modifier-border); display: inline-flex; align-items: center; padding: 2px; }
.uis-toggle__thumb { width: 12px; height: 12px; border-radius: 50%; background: var(--background-primary); transition: transform 0s; }
.uis-toggle--on .uis-toggle__track { background: var(--interactive-accent); }
.uis-toggle--on .uis-toggle__thumb { transform: translateX(12px); }

/* ===== Slider ===== */
.uis-slider { position: relative; width: 140px; height: 16px; }
.uis-slider__track { position: absolute; left: 0; right: 0; top: 50%; height: 4px; margin-top: -2px; background: var(--background-modifier-border); border-radius: 2px; }
.uis-slider__thumb { position: absolute; top: 50%; width: 14px; height: 14px; margin-top: -7px; margin-left: -7px; border-radius: 50%; background: var(--interactive-accent); }

/* ===== Date picker / Search / File upload ===== */
.uis-date-picker, .uis-search { display: inline-flex; align-items: center; gap: 6px; min-height: 32px; padding: 4px 10px; background: var(--background-primary); border: 1px solid var(--background-modifier-border); border-radius: var(--radius-s, 6px); }
.uis-date-picker__placeholder, .uis-search__placeholder { color: var(--text-muted); }
.uis-file-upload { padding: 16px; text-align: center; border: 2px dashed var(--background-modifier-border); border-radius: var(--radius-m, 8px); color: var(--text-muted); }
.uis-file-upload__icon { display: block; font-size: 1.5em; margin-bottom: 4px; }

/* ===== Image ===== */
.uis-image { width: 120px; height: 80px; background: var(--background-secondary); display: flex; align-items: center; justify-content: center; color: var(--text-muted); border: 1px solid var(--background-modifier-border); border-radius: var(--radius-s, 6px); font-size: 0.85em; }

/* ===== Icon ===== */
.uis-icon { display: inline-flex; align-items: center; justify-content: center; background: var(--background-modifier-hover); color: var(--text-muted); border-radius: 4px; font-family: var(--font-monospace); font-size: 0.75em; }

/* ===== Avatar ===== */
.uis-avatar { display: inline-flex; align-items: center; justify-content: center; background: var(--interactive-accent); color: var(--text-on-accent, white); border-radius: 50%; font-weight: 600; font-size: 0.85em; }

/* ===== Badge ===== */
.uis-badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.75em; font-weight: 600; line-height: 1.4; }
.uis-badge--default { background: var(--background-secondary); color: var(--text-muted); }
.uis-badge--primary { background: var(--interactive-accent); color: var(--text-on-accent, white); }
.uis-badge--success { background: rgba(40, 170, 80, 0.15); color: rgb(40, 170, 80); }
.uis-badge--warning { background: rgba(220, 160, 0, 0.15); color: rgb(220, 160, 0); }
.uis-badge--danger  { background: rgba(220, 60, 60, 0.15); color: rgb(220, 60, 60); }

/* ===== Tag ===== */
.uis-tag { display: inline-block; padding: 2px 8px; background: var(--background-secondary); color: var(--text-muted); border-radius: var(--radius-s, 4px); font-size: 0.8em; }

/* ===== Kbd ===== */
.uis-kbd { display: inline-flex; gap: 3px; align-items: center; }
.uis-kbd__cap { display: inline-block; padding: 2px 6px; background: var(--background-secondary); color: var(--text-normal); border: 1px solid var(--background-modifier-border); border-bottom-width: 2px; border-radius: 4px; font-family: var(--font-monospace); font-size: 0.85em; }
.uis-kbd__plus { color: var(--text-muted); font-size: 0.85em; }

/* ===== Alert ===== */
.uis-alert { padding: 10px 12px; border-left: 3px solid var(--interactive-accent); background: var(--background-secondary); border-radius: var(--radius-s, 4px); }
.uis-alert--info    { border-left-color: var(--interactive-accent); }
.uis-alert--success { border-left-color: rgb(40, 170, 80); }
.uis-alert--warn    { border-left-color: rgb(220, 160, 0); }
.uis-alert--error   { border-left-color: rgb(220, 60, 60); }
.uis-alert__title   { font-weight: 600; margin-bottom: 2px; }
.uis-alert__message { color: var(--text-muted); font-size: 0.9em; }

/* ===== Progress ===== */
.uis-progress { display: flex; flex-direction: column; gap: 4px; }
.uis-progress__track { height: 6px; background: var(--background-modifier-border); border-radius: 3px; overflow: hidden; }
.uis-progress__fill { height: 100%; background: var(--interactive-accent); }
.uis-progress__label { font-size: 0.85em; color: var(--text-muted); }

/* ===== Toast ===== */
.uis-toast { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--background-primary); border-radius: var(--radius-m, 8px); box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 280px; }
.uis-toast--info    { border-left: 3px solid var(--interactive-accent); }
.uis-toast--success { border-left: 3px solid rgb(40, 170, 80); }
.uis-toast--warn    { border-left: 3px solid rgb(220, 160, 0); }
.uis-toast--error   { border-left: 3px solid rgb(220, 60, 60); }

/* ===== Modal ===== */
.uis-modal { padding: 16px; background: var(--background-primary); border: 1px solid var(--background-modifier-border); border-radius: var(--radius-m, 8px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
.uis-modal__title { font-size: 1.1em; font-weight: 600; margin-bottom: 8px; }
.uis-modal__body { color: var(--text-muted); font-size: 0.95em; }

/* ===== Skeleton ===== */
.uis-skeleton { display: inline-block; width: 80px; height: 14px; background: linear-gradient(90deg, var(--background-modifier-hover) 0%, var(--background-secondary) 50%, var(--background-modifier-hover) 100%); border-radius: 4px; }

/* ===== Table ===== */
.uis-table { border-collapse: collapse; width: 100%; font-size: 0.9em; }
.uis-table th, .uis-table td { padding: 6px 10px; text-align: left; border-bottom: 1px solid var(--background-modifier-border); }
.uis-table th { background: var(--background-secondary); color: var(--text-muted); font-weight: 600; font-size: 0.85em; text-transform: uppercase; }

/* ===== List ===== */
.uis-list { padding-left: 20px; margin: 0; color: var(--text-normal); }
.uis-list li { margin: 2px 0; }

/* ===== Tree ===== */
.uis-tree { display: flex; flex-direction: column; gap: 2px; font-size: 0.95em; }
.uis-tree__node { padding: 2px 0; }
.uis-tree__label { color: var(--text-normal); }
.uis-tree__children { padding-left: 18px; border-left: 1px dashed var(--background-modifier-border); margin-left: 6px; display: flex; flex-direction: column; gap: 2px; }

/* ===== Kv-list ===== */
.uis-kv { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 0.9em; }
.uis-kv__row { display: contents; }
.uis-kv__key { color: var(--text-muted); }
.uis-kv__val { color: var(--text-normal); }

/* ===== Chart / Map / Video / Placeholder ===== */
.uis-chart, .uis-map, .uis-video, .uis-placeholder {
  display: flex; align-items: center; justify-content: center;
  min-height: 100px; border: 2px dashed var(--background-modifier-border); border-radius: var(--radius-m, 8px);
  background: var(--background-secondary); color: var(--text-muted); gap: 8px;
}
.uis-chart__badge, .uis-map__badge, .uis-video__badge { font-family: var(--font-monospace); font-size: 0.85em; letter-spacing: 0.05em; }
.uis-chart__label { font-size: 0.85em; opacity: 0.8; }
.uis-video__play { font-size: 1.5em; color: var(--interactive-accent); }

/* ===== Raw ===== */
.uis-raw { color: var(--text-normal); }

/* ===== Inline L3 error ===== */
.uis-error--inline { padding: 8px 10px; font-size: 0.9em; border-radius: var(--radius-s, 6px); display: inline-block; }
.uis-error__hint { font-style: italic; color: var(--text-muted); font-size: 0.9em; margin: 2px 0; }
```

- [ ] **Step 2: Rebuild**

Run: `yarn build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat(styles): add CSS for 34 new components + inline L3 error"
```

---

## Task 46: Full suite + build verification

**Files:** none.

- [ ] **Step 1: Run the full suite**

Run: `yarn test`
Expected: all tests pass. New tests added in Plan 2:
- errors/inline.test.ts (2)
- schema/suggestions.test.ts (6)
- renderer/safety.test.ts (3)
- renderer/l3.test.ts (3)
- 34 new component tests (38-45 new tests total, depending on count per component)
Total expected: ~98–110 tests passing.

- [ ] **Step 2: Typecheck**

Run: `yarn typecheck`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `yarn build`
Expected: `main.js` produced; no TS errors.

- [ ] **Step 4: Confirm no uncommitted changes**

Run: `git status`
Expected: clean tree.

- [ ] **Step 5: Tag and push (optional at plan author's discretion)**

If the v0.2 milestone feels complete, tag:
```bash
git push origin main
git tag -a v0.2.0 -m "v0.2 Catalog & L3 — 44 components, inline errors, typo hints, safety guards"
git push origin v0.2.0
```

---

## Self-Review (author's check against spec)

**Spec coverage:**
- §6 Component Catalog (~44 components across 8 categories + raw) → Tasks 9–42 implement the 34 that were out of scope for Plan 1. ✔
- §8 L3 per-component errors → Tasks 1, 2, 7. ✔
- §8 Typo suggestions (Levenshtein ≤ 2) → Tasks 3, 7. ✔
- §8 Safety guards (maxAliasCount, MAX_DEPTH=32, MAX_NODES=5000) → Tasks 4, 5, 8. ✔
- §6 `raw:` with sanitize-html → Task 42. ✔
- §5 per-component zod schema → Task 6 (infra) + 9–42 (all use BasePropsSchema.extend) + 43 (retrofit). ✔
- §3 Settings/§7 Settings defaults → not touched in this plan (Plan 1 already shipped them). ✔
- §9 Testing strategy → every new component has a smoke test; L3/suggestions/safety each have dedicated tests. ✔
- §10 Release stages → deferred to Plan 3. ✔

**Placeholder scan:** No TBD/TODO/"similar to task N" references. Each component task has full test + impl code.

**Type consistency:**
- `ComponentDef` signature change in Task 6 (`schema?` added) is optional, so existing 10 components keep compiling without modification — until Task 43 retrofits them.
- `ComponentError` shape in Task 1 matches what Tasks 2 and 7 consume.
- `BasePropsSchema.extend(...).passthrough()` used uniformly in every component schema.
- `ListDef` in Task 35 has the `schema:` field placed after `render` to illustrate order flexibility (zod `ComponentDef` accepts either order).

No gaps found.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-24-ui-sketch-plan-2-catalog-and-l3.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Tasks 9-42 are highly repetitive and independent (one component = one file + one test); grouping by category (as in Plan 1 execution) is straightforward.

**2. Inline Execution** — Execute tasks in this session using executing-plans with batch checkpoints.

**Which approach?**
