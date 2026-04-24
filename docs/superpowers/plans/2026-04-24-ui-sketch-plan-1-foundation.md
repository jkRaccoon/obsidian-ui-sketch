# UI Sketch — Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship v0.1 of the Obsidian `ui-sketch` plugin: a working code-block processor that renders row/col/grid layouts with 10 core components, handles top-level errors and empty blocks, and has a full test harness. Installable into a dev vault and visible in Reading view + Live Preview.

**Architecture:** Pure pipeline (`parser → schema → renderer + components → styler → DOM`). Each module testable in isolation. Components are files under `src/components/` registered via `ComponentRegistry`. All styling via Obsidian CSS variables.

**Tech Stack:** TypeScript, esbuild, `js-yaml`, `zod`, Vitest, happy-dom. Package manager: **yarn**. Obsidian plugin API.

**Scope of this plan (v0.1):**
- Modules: `parser/`, `schema/`, `components/`, `renderer/`, `styler/`, `errors/`, `main.ts`, `settings.ts`
- Components: `container`, `card`, `panel`, `divider`, `spacer`, `button`, `input`, `heading`, `text`, `navbar` (10)
- Errors: L1 (YAML parse), L2 (structure), L4 (empty block). L3 and typo suggestions are in Plan 2.
- Viewports: `desktop`, `tablet`, `mobile`, `custom`.
- Note annotation (`note:` prop).
- Settings tab with: Default viewport, Default theme, Compact mode, Verbose logging.

**Out of scope (Plan 2+):**
- 34 remaining components (advanced input, feedback, data, placeholder, raw).
- L3 inline component errors; typo suggestions; safety guards (max aliases/depth/nodes).
- `raw:` + `sanitize-html`.
- Component docs generator, examples, CI, release automation.

---

## File map (locked in before task decomposition)

```
o_layout/
├── .gitignore
├── manifest.json
├── package.json
├── tsconfig.json
├── esbuild.config.mjs
├── vitest.config.ts
├── styles.css
├── src/
│   ├── main.ts                   plugin entry, registers processor + settings
│   ├── settings.ts               types + SettingsTab UI
│   ├── types.ts                  shared AST & ValidatedDoc types
│   ├── parser/
│   │   └── index.ts              js-yaml wrapper preserving locations
│   ├── schema/
│   │   ├── base.ts               common-prop zod fragment
│   │   ├── document.ts           top-level doc schema
│   │   ├── layout.ts             row/col/grid tree schema
│   │   └── index.ts              validate(rawDoc) → ValidatedDoc
│   ├── components/
│   │   ├── registry.ts           Map<type, {schema, render}>
│   │   ├── container.ts
│   │   ├── card.ts
│   │   ├── panel.ts
│   │   ├── divider.ts
│   │   ├── spacer.ts
│   │   ├── button.ts
│   │   ├── input.ts
│   │   ├── heading.ts
│   │   ├── text.ts
│   │   └── navbar.ts
│   ├── renderer/
│   │   ├── index.ts              buildTree(vdoc) → HTMLElement
│   │   ├── layout.ts             row/col/grid → DOM
│   │   └── annotation.ts         wrap + note tooltip
│   ├── styler/
│   │   └── index.ts              applyFrame(root, viewport) → framed root
│   └── errors/
│       ├── types.ts              L1/L2/L4 discriminated union
│       └── render.ts             DOM for error boxes & empty placeholder
└── tests/
    ├── parser/parse.test.ts
    ├── schema/document.test.ts
    ├── schema/layout.test.ts
    ├── renderer/layout.test.ts
    ├── renderer/annotation.test.ts
    ├── renderer/snapshot.test.ts
    ├── styler/frame.test.ts
    ├── errors/render.test.ts
    ├── components/
    │   ├── container.test.ts
    │   ├── card.test.ts
    │   ├── panel.test.ts
    │   ├── divider.test.ts
    │   ├── spacer.test.ts
    │   ├── button.test.ts
    │   ├── input.test.ts
    │   ├── heading.test.ts
    │   ├── text.test.ts
    │   └── navbar.test.ts
    └── fixtures/
        ├── minimal.yaml
        └── dashboard.yaml
```

---

## Task 1: Bootstrap project (package.json, tsconfig, manifest, build)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `manifest.json`
- Create: `esbuild.config.mjs`
- Create: `.gitignore`
- Create: `src/main.ts` (skeleton)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "obsidian-ui-sketch",
  "version": "0.1.0",
  "private": true,
  "description": "Render mid-fi web UI wireframes inside Obsidian notes from YAML.",
  "scripts": {
    "dev": "node esbuild.config.mjs",
    "build": "tsc --noEmit && node esbuild.config.mjs production",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/js-yaml": "^4.0.9",
    "@types/node": "^20.11.0",
    "builtin-modules": "^3.3.0",
    "esbuild": "^0.20.0",
    "happy-dom": "^13.0.0",
    "obsidian": "^1.5.0",
    "tslib": "^2.6.2",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  },
  "dependencies": {
    "js-yaml": "^4.1.0",
    "zod": "^3.22.4"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["DOM", "ES2020"],
    "strict": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["node"]
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
```

- [ ] **Step 3: Create `manifest.json`**

```json
{
  "id": "ui-sketch",
  "name": "UI Sketch",
  "version": "0.1.0",
  "minAppVersion": "1.5.0",
  "description": "Render mid-fi web UI wireframes in notes from YAML.",
  "author": "jikwangkim",
  "authorUrl": "",
  "isDesktopOnly": false
}
```

- [ ] **Step 4: Create `esbuild.config.mjs`**

```js
import esbuild from "esbuild";
import builtins from "builtin-modules";

const prod = process.argv[2] === "production";

const ctx = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    ...builtins,
  ],
  format: "cjs",
  target: "es2020",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  minify: prod,
  outfile: "main.js",
});

if (prod) {
  await ctx.rebuild();
  process.exit(0);
} else {
  await ctx.watch();
}
```

- [ ] **Step 5: Create `.gitignore`**

```
node_modules/
main.js
main.js.map
*.log
.DS_Store
coverage/

# Local dev vault lives in this directory
.obsidian/
data.json
```

- [ ] **Step 6: Create `src/main.ts` skeleton**

```ts
import { Plugin } from "obsidian";

export default class UiSketchPlugin extends Plugin {
  async onload(): Promise<void> {
    this.registerMarkdownCodeBlockProcessor("ui-sketch", (source, el, _ctx) => {
      el.createDiv({ text: "ui-sketch boot OK" });
    });
  }
}
```

- [ ] **Step 7: Install dependencies**

Run: `yarn install`
Expected: `node_modules/` created, `yarn.lock` appears, no errors.

- [ ] **Step 8: Run production build**

Run: `yarn build`
Expected: `main.js` created at repo root; no TS errors.

- [ ] **Step 9: Commit**

```bash
git add package.json yarn.lock tsconfig.json manifest.json esbuild.config.mjs .gitignore src/main.ts
git commit -m "feat: bootstrap ui-sketch plugin scaffold"
```

---

## Task 2: Test harness (Vitest + happy-dom)

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/sanity.test.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts"],
    globals: false,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

- [ ] **Step 2: Write the failing sanity test**

```ts
// tests/sanity.test.ts
import { describe, it, expect } from "vitest";

describe("sanity", () => {
  it("has a working DOM", () => {
    const div = document.createElement("div");
    div.textContent = "hi";
    expect(div.textContent).toBe("hi");
  });
});
```

- [ ] **Step 3: Run the test**

Run: `yarn test`
Expected: PASS, 1 test.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts tests/sanity.test.ts
git commit -m "test: set up vitest + happy-dom harness"
```

---

## Task 3: Shared types

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Write the types**

```ts
// src/types.ts
export interface Loc { line: number; col: number; }

export interface ComponentNode {
  kind: "component";
  type: string;
  props: Record<string, unknown>;
  loc?: Loc;
}

export interface RowNode {
  kind: "row";
  gap?: number;
  items: LayoutNode[];
  loc?: Loc;
}

export interface ColNode {
  kind: "col";
  flex?: number;
  items: LayoutNode[];
  loc?: Loc;
}

export interface GridNode {
  kind: "grid";
  areas: string[];
  cols?: string;
  rows?: string;
  map: Record<string, ComponentNode>;
  loc?: Loc;
}

export type LayoutNode = RowNode | ColNode | GridNode | ComponentNode;

export type ViewportKind = "desktop" | "tablet" | "mobile" | "custom";

export interface ValidatedDoc {
  viewport: ViewportKind;
  width?: number;
  height?: number;
  theme: "adaptive";
  background: "default" | "muted" | "transparent";
  screen: LayoutNode[] | GridNode;
}

export interface BaseProps {
  id?: string;
  w?: number | string;
  h?: number | string;
  align?: "start" | "center" | "end";
  pad?: number | string;
  note?: string;
  muted?: boolean;
}
```

- [ ] **Step 2: Typecheck**

Run: `yarn typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat(types): define shared AST and ValidatedDoc types"
```

---

## Task 4: Parser — YAML to Document (with location preservation)

**Files:**
- Create: `src/parser/index.ts`
- Create: `tests/parser/parse.test.ts`

- [ ] **Step 1: Write the failing parser tests**

```ts
// tests/parser/parse.test.ts
import { describe, it, expect } from "vitest";
import { parseDocument, ParseError } from "@/parser";

describe("parseDocument", () => {
  it("parses a minimal doc", () => {
    const out = parseDocument("viewport: desktop\nscreen:\n  - card: { title: Hi }\n");
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.doc.viewport).toBe("desktop");
    expect(Array.isArray(out.doc.screen)).toBe(true);
  });

  it("returns a parse error with line/col on malformed YAML", () => {
    const out = parseDocument("screen:\n  - button: label: Bad\n");
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.error.kind).toBe("yaml");
    expect(out.error.loc?.line).toBeGreaterThanOrEqual(1);
    expect(out.error.message.length).toBeGreaterThan(0);
  });

  it("treats empty input as empty doc", () => {
    const out = parseDocument("");
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.doc).toEqual({});
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn test tests/parser/parse.test.ts`
Expected: FAIL with "Cannot find module '@/parser'".

- [ ] **Step 3: Implement the parser**

```ts
// src/parser/index.ts
import yaml from "js-yaml";
import type { Loc } from "@/types";

export interface ParseError {
  kind: "yaml";
  message: string;
  loc?: Loc;
}

export type ParseResult =
  | { ok: true; doc: Record<string, unknown> }
  | { ok: false; error: ParseError };

export function parseDocument(source: string): ParseResult {
  const trimmed = source.trim();
  if (trimmed === "") return { ok: true, doc: {} };

  try {
    const doc = yaml.load(source, { schema: yaml.DEFAULT_SCHEMA });
    if (doc === null || doc === undefined) return { ok: true, doc: {} };
    if (typeof doc !== "object" || Array.isArray(doc)) {
      return {
        ok: false,
        error: { kind: "yaml", message: "Top-level must be a mapping", loc: { line: 1, col: 1 } },
      };
    }
    return { ok: true, doc: doc as Record<string, unknown> };
  } catch (e) {
    const err = e as yaml.YAMLException;
    return {
      ok: false,
      error: {
        kind: "yaml",
        message: err.reason || err.message,
        loc: err.mark ? { line: err.mark.line + 1, col: err.mark.column + 1 } : undefined,
      },
    };
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `yarn test tests/parser/parse.test.ts`
Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add src/parser/index.ts tests/parser/parse.test.ts
git commit -m "feat(parser): parse YAML with line/col on errors"
```

---

## Task 5: Schema — base common props

**Files:**
- Create: `src/schema/base.ts`

- [ ] **Step 1: Write the base schema**

```ts
// src/schema/base.ts
import { z } from "zod";

export const BaseProps = z
  .object({
    id: z.string().optional(),
    w: z.union([z.number(), z.string()]).optional(),
    h: z.union([z.number(), z.string()]).optional(),
    align: z.enum(["start", "center", "end"]).optional(),
    pad: z.union([z.number(), z.string()]).optional(),
    note: z.string().optional(),
    muted: z.boolean().optional(),
  })
  .passthrough();

export type BaseP = z.infer<typeof BaseProps>;
```

- [ ] **Step 2: Typecheck**

Run: `yarn typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/schema/base.ts
git commit -m "feat(schema): define common base props with zod"
```

---

## Task 6: Schema — layout tree (row/col/grid)

**Files:**
- Create: `src/schema/layout.ts`
- Create: `tests/schema/layout.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/schema/layout.test.ts
import { describe, it, expect } from "vitest";
import { parseLayoutArray } from "@/schema/layout";

describe("parseLayoutArray", () => {
  it("accepts a single component entry", () => {
    const out = parseLayoutArray([{ card: { title: "Hi" } }]);
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.nodes).toHaveLength(1);
    expect(out.nodes[0]).toMatchObject({ kind: "component", type: "card" });
  });

  it("accepts a row with two cols", () => {
    const out = parseLayoutArray([
      { row: { items: [ { col: { items: [ { card: { title: "A" } } ] } }, { col: { items: [ { card: { title: "B" } } ] } } ] } },
    ]);
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.nodes[0]).toMatchObject({ kind: "row" });
  });

  it("rejects an entry with multiple keys", () => {
    const out = parseLayoutArray([{ row: { items: [] }, col: { items: [] } }]);
    expect(out.ok).toBe(false);
  });

  it("rejects an entry with no keys", () => {
    const out = parseLayoutArray([{}]);
    expect(out.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test tests/schema/layout.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `parseLayoutArray`**

```ts
// src/schema/layout.ts
import type { LayoutNode, ComponentNode, RowNode, ColNode, GridNode } from "@/types";

export interface LayoutParseError {
  message: string;
  path: string;
}

export type LayoutParseResult =
  | { ok: true; nodes: LayoutNode[] }
  | { ok: false; error: LayoutParseError };

export function parseLayoutArray(raw: unknown, path = "screen"): LayoutParseResult {
  if (!Array.isArray(raw)) {
    return { ok: false, error: { message: "expected an array", path } };
  }
  const nodes: LayoutNode[] = [];
  for (let i = 0; i < raw.length; i++) {
    const entry = raw[i];
    const subPath = `${path}[${i}]`;
    if (!isPlainObject(entry)) {
      return { ok: false, error: { message: "entry must be an object", path: subPath } };
    }
    const keys = Object.keys(entry);
    if (keys.length !== 1) {
      return {
        ok: false,
        error: { message: `entry must have exactly one key, got ${keys.length}`, path: subPath },
      };
    }
    const key = keys[0];
    const value = (entry as Record<string, unknown>)[key];
    const child = parseEntry(key, value, subPath);
    if (!child.ok) return child;
    nodes.push(child.node);
  }
  return { ok: true, nodes };
}

export function parseGrid(raw: unknown, path = "screen"): { ok: true; grid: GridNode } | { ok: false; error: LayoutParseError } {
  if (!isPlainObject(raw)) return { ok: false, error: { message: "grid must be an object", path } };
  const { areas, cols, rows, map } = raw as Record<string, unknown>;
  if (!Array.isArray(areas) || !areas.every((a) => typeof a === "string")) {
    return { ok: false, error: { message: "grid.areas must be a string array", path: `${path}.areas` } };
  }
  if (!isPlainObject(map)) {
    return { ok: false, error: { message: "grid.map must be an object", path: `${path}.map` } };
  }
  const cMap: Record<string, ComponentNode> = {};
  for (const [name, entry] of Object.entries(map)) {
    if (!isPlainObject(entry)) {
      return { ok: false, error: { message: "map value must be an object", path: `${path}.map.${name}` } };
    }
    const keys = Object.keys(entry);
    if (keys.length !== 1) {
      return { ok: false, error: { message: "map entry must have one key", path: `${path}.map.${name}` } };
    }
    const type = keys[0];
    cMap[name] = { kind: "component", type, props: ((entry as Record<string, unknown>)[type] ?? {}) as Record<string, unknown> };
  }
  return {
    ok: true,
    grid: {
      kind: "grid",
      areas: areas as string[],
      cols: typeof cols === "string" ? cols : undefined,
      rows: typeof rows === "string" ? rows : undefined,
      map: cMap,
    },
  };
}

function parseEntry(key: string, value: unknown, path: string): { ok: true; node: LayoutNode } | { ok: false; error: LayoutParseError } {
  if (key === "row" || key === "col") {
    if (!isPlainObject(value)) {
      return { ok: false, error: { message: `${key} must be an object`, path } };
    }
    const v = value as Record<string, unknown>;
    const items = parseLayoutArray(v.items ?? [], `${path}.items`);
    if (!items.ok) return items;
    const node = key === "row"
      ? ({ kind: "row", gap: typeof v.gap === "number" ? v.gap : undefined, items: items.nodes } as RowNode)
      : ({ kind: "col", flex: typeof v.flex === "number" ? v.flex : undefined, items: items.nodes } as ColNode);
    return { ok: true, node };
  }
  // anything else is a component entry
  const props = isPlainObject(value) ? (value as Record<string, unknown>) : {};
  const node: ComponentNode = { kind: "component", type: key, props };
  return { ok: true, node };
}

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `yarn test tests/schema/layout.test.ts`
Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add src/schema/layout.ts tests/schema/layout.test.ts
git commit -m "feat(schema): parse row/col/grid layout tree"
```

---

## Task 7: Schema — top-level document

**Files:**
- Create: `src/schema/document.ts`
- Create: `src/schema/index.ts`
- Create: `tests/schema/document.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/schema/document.test.ts
import { describe, it, expect } from "vitest";
import { validate } from "@/schema";

describe("validate", () => {
  it("fills defaults on minimal input", () => {
    const out = validate({ screen: [] });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.doc.viewport).toBe("desktop");
    expect(out.doc.theme).toBe("adaptive");
    expect(out.doc.background).toBe("default");
  });

  it("rejects missing screen", () => {
    const out = validate({});
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.error.kind).toBe("structure");
  });

  it("rejects unknown viewport", () => {
    const out = validate({ viewport: "wide", screen: [] });
    expect(out.ok).toBe(false);
  });

  it("requires width/height for viewport=custom", () => {
    const out = validate({ viewport: "custom", screen: [] });
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.error.message).toContain("width");
  });

  it("accepts grid at root", () => {
    const out = validate({
      screen: { grid: { areas: ["a b"], map: { a: { card: {} }, b: { text: { value: "hi" } } } } },
    });
    expect(out.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests — expect fail**

Run: `yarn test tests/schema/document.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `schema/document.ts`**

```ts
// src/schema/document.ts
import type { ValidatedDoc, ViewportKind } from "@/types";
import { parseLayoutArray, parseGrid, type LayoutParseError } from "./layout";

export interface StructureError {
  kind: "structure";
  message: string;
  path: string;
}

export type ValidateResult =
  | { ok: true; doc: ValidatedDoc }
  | { ok: false; error: StructureError };

const VIEWPORTS: ViewportKind[] = ["desktop", "tablet", "mobile", "custom"];
const BACKGROUNDS = ["default", "muted", "transparent"] as const;

export function validateDocument(raw: Record<string, unknown>): ValidateResult {
  const viewport = raw.viewport ?? "desktop";
  if (typeof viewport !== "string" || !VIEWPORTS.includes(viewport as ViewportKind)) {
    return err("viewport must be one of desktop|tablet|mobile|custom", "viewport");
  }
  const v = viewport as ViewportKind;
  let width: number | undefined;
  let height: number | undefined;
  if (v === "custom") {
    if (typeof raw.width !== "number" || typeof raw.height !== "number") {
      return err("viewport=custom requires numeric width and height", "width");
    }
    width = raw.width;
    height = raw.height;
  }

  const theme = raw.theme ?? "adaptive";
  if (theme !== "adaptive") return err("theme must be 'adaptive' in v0.1", "theme");

  const background = raw.background ?? "default";
  if (typeof background !== "string" || !(BACKGROUNDS as readonly string[]).includes(background)) {
    return err("background must be one of default|muted|transparent", "background");
  }

  if (!("screen" in raw)) {
    return err("screen is required", "screen");
  }
  const screenRaw = raw.screen;

  if (isGridShape(screenRaw)) {
    const g = parseGrid((screenRaw as Record<string, unknown>).grid, "screen");
    if (!g.ok) return err(g.error.message, g.error.path);
    return ok({ viewport: v, width, height, theme: "adaptive", background: background as ValidatedDoc["background"], screen: g.grid });
  }

  const layout = parseLayoutArray(screenRaw, "screen");
  if (!layout.ok) return err(layout.error.message, layout.error.path);
  return ok({ viewport: v, width, height, theme: "adaptive", background: background as ValidatedDoc["background"], screen: layout.nodes });
}

function isGridShape(x: unknown): boolean {
  return typeof x === "object" && x !== null && !Array.isArray(x) && "grid" in (x as Record<string, unknown>);
}

function ok(doc: ValidatedDoc): ValidateResult { return { ok: true, doc }; }
function err(message: string, path: string): ValidateResult {
  return { ok: false, error: { kind: "structure", message, path } };
}
```

- [ ] **Step 4: Create `src/schema/index.ts` (the public entry)**

```ts
// src/schema/index.ts
export { validateDocument as validate } from "./document";
export type { StructureError, ValidateResult } from "./document";
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `yarn test tests/schema/document.test.ts`
Expected: 5 passing.

- [ ] **Step 6: Commit**

```bash
git add src/schema/document.ts src/schema/index.ts tests/schema/document.test.ts
git commit -m "feat(schema): validate top-level document with defaults"
```

---

## Task 8: Component registry skeleton

**Files:**
- Create: `src/components/registry.ts`

- [ ] **Step 1: Write the registry**

```ts
// src/components/registry.ts
export interface ComponentRenderCtx {
  muted?: boolean;
}

export interface ComponentDef {
  type: string;
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
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/registry.ts
git commit -m "feat(components): add registry for component defs"
```

---

## Task 9: Component — `container`

**Files:**
- Create: `src/components/container.ts`
- Create: `tests/components/container.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/components/container.test.ts
import { describe, it, expect } from "vitest";
import { ContainerDef } from "@/components/container";

describe("container", () => {
  it("renders a div with the correct class", () => {
    const el = ContainerDef.render({}, {});
    expect(el.tagName).toBe("DIV");
    expect(el.className).toContain("uis-container");
  });
  it("applies padding when pad is given", () => {
    const el = ContainerDef.render({ pad: 16 }, {});
    expect((el as HTMLElement).style.padding).toBe("16px");
  });
});
```

- [ ] **Step 2: Run tests — expect fail**

Run: `yarn test tests/components/container.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement container**

```ts
// src/components/container.ts
import type { ComponentDef } from "./registry";

export const ContainerDef: ComponentDef = {
  type: "container",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-container";
    const pad = props.pad;
    if (typeof pad === "number") el.style.padding = `${pad}px`;
    else if (typeof pad === "string") el.style.padding = pad;
    return el;
  },
};
```

- [ ] **Step 4: Run tests**

Run: `yarn test tests/components/container.test.ts`
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/container.ts tests/components/container.test.ts
git commit -m "feat(components): add container"
```

---

## Task 10: Component — `card`

**Files:**
- Create: `src/components/card.ts`
- Create: `tests/components/card.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/components/card.test.ts
import { describe, it, expect } from "vitest";
import { CardDef } from "@/components/card";

describe("card", () => {
  it("renders a card with title and body", () => {
    const el = CardDef.render({ title: "Hello", body: "World" }, {});
    expect(el.className).toContain("uis-card");
    expect(el.querySelector(".uis-card__title")?.textContent).toBe("Hello");
    expect(el.querySelector(".uis-card__body")?.textContent).toBe("World");
  });
  it("omits title/body nodes when props absent", () => {
    const el = CardDef.render({}, {});
    expect(el.querySelector(".uis-card__title")).toBeNull();
    expect(el.querySelector(".uis-card__body")).toBeNull();
  });
});
```

- [ ] **Step 2: Run — expect fail**

Run: `yarn test tests/components/card.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement card**

```ts
// src/components/card.ts
import type { ComponentDef } from "./registry";

export const CardDef: ComponentDef = {
  type: "card",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-card";
    if (typeof props.title === "string") {
      const t = document.createElement("div");
      t.className = "uis-card__title";
      t.textContent = props.title;
      el.appendChild(t);
    }
    if (typeof props.body === "string") {
      const b = document.createElement("div");
      b.className = "uis-card__body";
      b.textContent = props.body;
      el.appendChild(b);
    }
    return el;
  },
};
```

- [ ] **Step 4: Run tests**

Run: `yarn test tests/components/card.test.ts`
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/card.ts tests/components/card.test.ts
git commit -m "feat(components): add card"
```

---

## Task 11: Component — `panel`

**Files:**
- Create: `src/components/panel.ts`
- Create: `tests/components/panel.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/components/panel.test.ts
import { describe, it, expect } from "vitest";
import { PanelDef } from "@/components/panel";

describe("panel", () => {
  it("renders a panel with optional header", () => {
    const el = PanelDef.render({ header: "Settings" }, {});
    expect(el.className).toContain("uis-panel");
    expect(el.querySelector(".uis-panel__header")?.textContent).toBe("Settings");
  });
});
```

- [ ] **Step 2: Run — expect fail**

Run: `yarn test tests/components/panel.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/components/panel.ts
import type { ComponentDef } from "./registry";

export const PanelDef: ComponentDef = {
  type: "panel",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-panel";
    if (typeof props.header === "string") {
      const h = document.createElement("div");
      h.className = "uis-panel__header";
      h.textContent = props.header;
      el.appendChild(h);
    }
    return el;
  },
};
```

- [ ] **Step 4: Run tests — expect pass**

Run: `yarn test tests/components/panel.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/components/panel.ts tests/components/panel.test.ts
git commit -m "feat(components): add panel"
```

---

## Task 12: Component — `divider`

**Files:**
- Create: `src/components/divider.ts`
- Create: `tests/components/divider.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/components/divider.test.ts
import { describe, it, expect } from "vitest";
import { DividerDef } from "@/components/divider";

describe("divider", () => {
  it("renders an hr-equivalent div", () => {
    const el = DividerDef.render({}, {});
    expect(el.className).toContain("uis-divider");
  });
  it("supports vertical orientation", () => {
    const el = DividerDef.render({ orientation: "vertical" }, {});
    expect(el.className).toContain("uis-divider--vertical");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/components/divider.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/components/divider.ts
import type { ComponentDef } from "./registry";

export const DividerDef: ComponentDef = {
  type: "divider",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-divider";
    if (props.orientation === "vertical") el.className += " uis-divider--vertical";
    return el;
  },
};
```

- [ ] **Step 4: Run tests — expect pass.**

Run: `yarn test tests/components/divider.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/components/divider.ts tests/components/divider.test.ts
git commit -m "feat(components): add divider"
```

---

## Task 13: Component — `spacer`

**Files:**
- Create: `src/components/spacer.ts`
- Create: `tests/components/spacer.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/components/spacer.test.ts
import { describe, it, expect } from "vitest";
import { SpacerDef } from "@/components/spacer";

describe("spacer", () => {
  it("renders a div with size style", () => {
    const el = SpacerDef.render({ size: 24 }, {}) as HTMLElement;
    expect(el.className).toContain("uis-spacer");
    expect(el.style.minHeight).toBe("24px");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/components/spacer.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/components/spacer.ts
import type { ComponentDef } from "./registry";

export const SpacerDef: ComponentDef = {
  type: "spacer",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-spacer";
    const size = typeof props.size === "number" ? props.size : 16;
    el.style.minHeight = `${size}px`;
    el.style.minWidth = `${size}px`;
    return el;
  },
};
```

- [ ] **Step 4: Run tests — expect pass.**

Run: `yarn test tests/components/spacer.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/components/spacer.ts tests/components/spacer.test.ts
git commit -m "feat(components): add spacer"
```

---

## Task 14: Component — `button`

**Files:**
- Create: `src/components/button.ts`
- Create: `tests/components/button.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/components/button.test.ts
import { describe, it, expect } from "vitest";
import { ButtonDef } from "@/components/button";

describe("button", () => {
  it("renders a button with label and default variant", () => {
    const el = ButtonDef.render({ label: "Click" }, {});
    expect(el.className).toContain("uis-button");
    expect(el.className).toContain("uis-button--primary");
    expect(el.textContent).toContain("Click");
  });
  it("supports variant prop", () => {
    const el = ButtonDef.render({ label: "X", variant: "danger" }, {});
    expect(el.className).toContain("uis-button--danger");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/components/button.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/components/button.ts
import type { ComponentDef } from "./registry";

const VARIANTS = new Set(["primary", "secondary", "ghost", "danger"]);

export const ButtonDef: ComponentDef = {
  type: "button",
  render(props) {
    const el = document.createElement("div");
    const variant =
      typeof props.variant === "string" && VARIANTS.has(props.variant) ? props.variant : "primary";
    el.className = `uis-button uis-button--${variant}`;
    const label = typeof props.label === "string" ? props.label : "";
    el.textContent = label;
    el.setAttribute("role", "button");
    return el;
  },
};
```

- [ ] **Step 4: Run tests — expect pass.**

Run: `yarn test tests/components/button.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/components/button.ts tests/components/button.test.ts
git commit -m "feat(components): add button"
```

---

## Task 15: Component — `input`

**Files:**
- Create: `src/components/input.ts`
- Create: `tests/components/input.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/components/input.test.ts
import { describe, it, expect } from "vitest";
import { InputDef } from "@/components/input";

describe("input", () => {
  it("renders with placeholder as label", () => {
    const el = InputDef.render({ placeholder: "Email" }, {});
    expect(el.className).toContain("uis-input");
    expect(el.querySelector(".uis-input__placeholder")?.textContent).toBe("Email");
  });
  it("shows value when provided", () => {
    const el = InputDef.render({ value: "hello@x" }, {});
    expect(el.querySelector(".uis-input__value")?.textContent).toBe("hello@x");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/components/input.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/components/input.ts
import type { ComponentDef } from "./registry";

export const InputDef: ComponentDef = {
  type: "input",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-input";
    if (typeof props.value === "string" && props.value.length > 0) {
      const v = document.createElement("div");
      v.className = "uis-input__value";
      v.textContent = props.value;
      el.appendChild(v);
    } else if (typeof props.placeholder === "string") {
      const p = document.createElement("div");
      p.className = "uis-input__placeholder";
      p.textContent = props.placeholder;
      el.appendChild(p);
    }
    return el;
  },
};
```

- [ ] **Step 4: Run tests — expect pass.**

Run: `yarn test tests/components/input.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/components/input.ts tests/components/input.test.ts
git commit -m "feat(components): add input"
```

---

## Task 16: Component — `heading`

**Files:**
- Create: `src/components/heading.ts`
- Create: `tests/components/heading.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/components/heading.test.ts
import { describe, it, expect } from "vitest";
import { HeadingDef } from "@/components/heading";

describe("heading", () => {
  it("renders heading with level 1 by default", () => {
    const el = HeadingDef.render({ text: "Title" }, {});
    expect(el.className).toContain("uis-heading");
    expect(el.className).toContain("uis-heading--h1");
    expect(el.textContent).toBe("Title");
  });
  it("clamps level to 1..6", () => {
    const el = HeadingDef.render({ text: "x", level: 9 }, {});
    expect(el.className).toContain("uis-heading--h6");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/components/heading.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/components/heading.ts
import type { ComponentDef } from "./registry";

export const HeadingDef: ComponentDef = {
  type: "heading",
  render(props) {
    const el = document.createElement("div");
    let level = typeof props.level === "number" ? Math.round(props.level) : 1;
    if (level < 1) level = 1;
    if (level > 6) level = 6;
    el.className = `uis-heading uis-heading--h${level}`;
    el.textContent = typeof props.text === "string" ? props.text : "";
    return el;
  },
};
```

- [ ] **Step 4: Run tests — expect pass.**

Run: `yarn test tests/components/heading.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/components/heading.ts tests/components/heading.test.ts
git commit -m "feat(components): add heading"
```

---

## Task 17: Component — `text`

**Files:**
- Create: `src/components/text.ts`
- Create: `tests/components/text.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/components/text.test.ts
import { describe, it, expect } from "vitest";
import { TextDef } from "@/components/text";

describe("text", () => {
  it("renders body text", () => {
    const el = TextDef.render({ value: "Paragraph" }, {});
    expect(el.className).toContain("uis-text");
    expect(el.textContent).toBe("Paragraph");
  });
  it("supports muted variant via tone prop", () => {
    const el = TextDef.render({ value: "x", tone: "muted" }, {});
    expect(el.className).toContain("uis-text--muted");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/components/text.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/components/text.ts
import type { ComponentDef } from "./registry";

const TONES = new Set(["muted", "strong", "accent"]);

export const TextDef: ComponentDef = {
  type: "text",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-text";
    if (typeof props.tone === "string" && TONES.has(props.tone)) {
      el.className += ` uis-text--${props.tone}`;
    }
    el.textContent = typeof props.value === "string" ? props.value : "";
    return el;
  },
};
```

- [ ] **Step 4: Run tests — expect pass.**

Run: `yarn test tests/components/text.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/components/text.ts tests/components/text.test.ts
git commit -m "feat(components): add text"
```

---

## Task 18: Component — `navbar`

**Files:**
- Create: `src/components/navbar.ts`
- Create: `tests/components/navbar.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/components/navbar.test.ts
import { describe, it, expect } from "vitest";
import { NavbarDef } from "@/components/navbar";

describe("navbar", () => {
  it("renders brand and item list", () => {
    const el = NavbarDef.render({ brand: "MyApp", items: ["Home", "Docs"] }, {});
    expect(el.className).toContain("uis-navbar");
    expect(el.querySelector(".uis-navbar__brand")?.textContent).toBe("MyApp");
    const items = el.querySelectorAll(".uis-navbar__item");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toBe("Home");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/components/navbar.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/components/navbar.ts
import type { ComponentDef } from "./registry";

export const NavbarDef: ComponentDef = {
  type: "navbar",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-navbar";
    if (typeof props.brand === "string") {
      const b = document.createElement("div");
      b.className = "uis-navbar__brand";
      b.textContent = props.brand;
      el.appendChild(b);
    }
    const items = Array.isArray(props.items) ? props.items : [];
    const list = document.createElement("div");
    list.className = "uis-navbar__items";
    for (const raw of items) {
      const label = typeof raw === "string" ? raw : "";
      const item = document.createElement("div");
      item.className = "uis-navbar__item";
      item.textContent = label;
      list.appendChild(item);
    }
    el.appendChild(list);
    return el;
  },
};
```

- [ ] **Step 4: Run tests — expect pass.**

Run: `yarn test tests/components/navbar.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/components/navbar.ts tests/components/navbar.test.ts
git commit -m "feat(components): add navbar"
```

---

## Task 19: Wire all 10 components into the registry

**Files:**
- Create: `src/components/index.ts`

- [ ] **Step 1: Aggregate registrations**

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

let installed = false;
export function installBuiltinComponents(): void {
  if (installed) return;
  installed = true;
  for (const def of [
    ContainerDef, CardDef, PanelDef, DividerDef, SpacerDef,
    ButtonDef, InputDef, HeadingDef, TextDef, NavbarDef,
  ]) {
    register(def);
  }
}

export { lookup, registeredTypes } from "./registry";
```

- [ ] **Step 2: Typecheck**

Run: `yarn typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/index.ts
git commit -m "feat(components): register all 10 builtin components"
```

---

## Task 20: Annotation wrapper (`note:` tooltip)

**Files:**
- Create: `src/renderer/annotation.ts`
- Create: `tests/renderer/annotation.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/renderer/annotation.test.ts
import { describe, it, expect } from "vitest";
import { wrapWithAnnotation } from "@/renderer/annotation";

describe("wrapWithAnnotation", () => {
  it("returns element unchanged when no note", () => {
    const inner = document.createElement("span");
    expect(wrapWithAnnotation(inner, undefined)).toBe(inner);
  });
  it("adds title attribute and info dot", () => {
    const inner = document.createElement("span");
    const wrapped = wrapWithAnnotation(inner, "remember this");
    expect(wrapped).not.toBe(inner);
    expect(wrapped.getAttribute("title")).toBe("remember this");
    expect(wrapped.querySelector(".uis-note-dot")).not.toBeNull();
    expect(wrapped.contains(inner)).toBe(true);
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/renderer/annotation.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/renderer/annotation.ts
export function wrapWithAnnotation(el: HTMLElement, note: string | undefined): HTMLElement {
  if (!note) return el;
  const wrapper = document.createElement("div");
  wrapper.className = "uis-annotated";
  wrapper.setAttribute("title", note);
  wrapper.appendChild(el);
  const dot = document.createElement("span");
  dot.className = "uis-note-dot";
  dot.textContent = "i";
  dot.setAttribute("aria-hidden", "true");
  wrapper.appendChild(dot);
  return wrapper;
}
```

- [ ] **Step 4: Run — expect pass.**

Run: `yarn test tests/renderer/annotation.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/renderer/annotation.ts tests/renderer/annotation.test.ts
git commit -m "feat(renderer): annotation wrapper for note prop"
```

---

## Task 21: Renderer — layout (row/col/grid → DOM)

**Files:**
- Create: `src/renderer/layout.ts`
- Create: `tests/renderer/layout.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/renderer/layout.test.ts
import { describe, it, expect } from "vitest";
import { installBuiltinComponents } from "@/components";
import { renderLayoutNodes, renderGrid } from "@/renderer/layout";
import type { GridNode } from "@/types";

installBuiltinComponents();

describe("renderLayoutNodes", () => {
  it("renders a single card", () => {
    const host = document.createElement("div");
    host.appendChild(renderLayoutNodes([{ kind: "component", type: "card", props: { title: "A" } }]));
    expect(host.querySelector(".uis-card")).not.toBeNull();
  });

  it("lays out a row with flex cols", () => {
    const host = document.createElement("div");
    host.appendChild(
      renderLayoutNodes([
        {
          kind: "row",
          items: [
            { kind: "col", flex: 1, items: [{ kind: "component", type: "card", props: { title: "L" } }] },
            { kind: "col", flex: 3, items: [{ kind: "component", type: "card", props: { title: "R" } }] },
          ],
        },
      ]),
    );
    const row = host.querySelector(".uis-row") as HTMLElement;
    expect(row).not.toBeNull();
    const cols = row.querySelectorAll(".uis-col");
    expect(cols.length).toBe(2);
    expect((cols[1] as HTMLElement).style.flex).toContain("3");
  });

  it("renders an unknown component as a placeholder (L3 deferred; v0.1 shows a stub)", () => {
    const host = document.createElement("div");
    host.appendChild(renderLayoutNodes([{ kind: "component", type: "mystery", props: {} }]));
    expect(host.querySelector(".uis-unknown")).not.toBeNull();
  });

  it("applies note annotation", () => {
    const host = document.createElement("div");
    host.appendChild(
      renderLayoutNodes([{ kind: "component", type: "button", props: { label: "X", note: "why?" } }]),
    );
    expect(host.querySelector(".uis-annotated")?.getAttribute("title")).toBe("why?");
  });
});

describe("renderGrid", () => {
  it("lays out a named-area grid", () => {
    const grid: GridNode = {
      kind: "grid",
      areas: ["a b"],
      cols: "1fr 1fr",
      map: {
        a: { kind: "component", type: "card", props: { title: "A" } },
        b: { kind: "component", type: "card", props: { title: "B" } },
      },
    };
    const el = renderGrid(grid);
    expect(el.className).toContain("uis-grid");
    expect((el.style.gridTemplateAreas ?? "").includes("a b")).toBe(true);
    expect(el.querySelectorAll(".uis-card").length).toBe(2);
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/renderer/layout.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/renderer/layout.ts
import type { LayoutNode, RowNode, ColNode, GridNode, ComponentNode } from "@/types";
import { lookup } from "@/components/registry";
import { wrapWithAnnotation } from "./annotation";

export function renderLayoutNodes(nodes: LayoutNode[]): HTMLElement {
  const root = document.createElement("div");
  root.className = "uis-flow";
  for (const n of nodes) root.appendChild(renderNode(n));
  return root;
}

export function renderNode(n: LayoutNode): HTMLElement {
  if ("kind" in n) {
    if (n.kind === "row") return renderRow(n);
    if (n.kind === "col") return renderCol(n);
    if (n.kind === "grid") return renderGrid(n);
    if (n.kind === "component") return renderComponent(n);
  }
  return placeholder("invalid node");
}

function renderRow(n: RowNode): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-row";
  if (typeof n.gap === "number") el.style.gap = `${n.gap}px`;
  for (const child of n.items) el.appendChild(renderNode(child));
  return el;
}

function renderCol(n: ColNode): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-col";
  if (typeof n.flex === "number") el.style.flex = `${n.flex} 1 0`;
  for (const child of n.items) el.appendChild(renderNode(child));
  return el;
}

export function renderGrid(n: GridNode): HTMLElement {
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
    cell.appendChild(renderComponent(node));
    el.appendChild(cell);
  }
  return el;
}

function renderComponent(n: ComponentNode): HTMLElement {
  const def = lookup(n.type);
  let inner: HTMLElement;
  if (!def) {
    inner = placeholder(`unknown: ${n.type}`);
  } else {
    inner = def.render(n.props, { muted: n.props.muted === true });
  }
  applyBaseLayout(inner, n.props);
  return wrapWithAnnotation(inner, typeof n.props.note === "string" ? n.props.note : undefined);
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

- [ ] **Step 4: Run — expect pass.**

Run: `yarn test tests/renderer/layout.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/renderer/layout.ts tests/renderer/layout.test.ts
git commit -m "feat(renderer): layout tree to DOM, base props, annotations"
```

---

## Task 22: Styler — viewport frame

**Files:**
- Create: `src/styler/index.ts`
- Create: `tests/styler/frame.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/styler/frame.test.ts
import { describe, it, expect } from "vitest";
import { applyFrame } from "@/styler";
import type { ValidatedDoc } from "@/types";

const baseDoc = (override: Partial<ValidatedDoc> = {}): ValidatedDoc => ({
  viewport: "desktop",
  theme: "adaptive",
  background: "default",
  screen: [],
  ...override,
});

describe("applyFrame", () => {
  it("wraps content in a frame with viewport data attribute", () => {
    const inner = document.createElement("div");
    const framed = applyFrame(inner, baseDoc());
    expect(framed.getAttribute("data-viewport")).toBe("desktop");
    expect(framed.contains(inner)).toBe(true);
  });
  it("applies mobile width", () => {
    const framed = applyFrame(document.createElement("div"), baseDoc({ viewport: "mobile" }));
    expect((framed as HTMLElement).style.width).toBe("375px");
  });
  it("applies custom width/height", () => {
    const framed = applyFrame(
      document.createElement("div"),
      baseDoc({ viewport: "custom", width: 420, height: 900 }),
    );
    expect((framed as HTMLElement).style.width).toBe("420px");
    expect((framed as HTMLElement).style.height).toBe("900px");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/styler/frame.test.ts`

- [ ] **Step 3: Implement**

```ts
// src/styler/index.ts
import type { ValidatedDoc, ViewportKind } from "@/types";

const PRESET_WIDTH: Record<Exclude<ViewportKind, "custom">, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 375,
};

export function applyFrame(inner: HTMLElement, doc: ValidatedDoc): HTMLElement {
  const frame = document.createElement("div");
  frame.className = "uis-frame";
  frame.setAttribute("data-viewport", doc.viewport);
  frame.setAttribute("data-theme", doc.theme);
  frame.setAttribute("data-background", doc.background);
  if (doc.viewport === "custom") {
    if (typeof doc.width === "number") frame.style.width = `${doc.width}px`;
    if (typeof doc.height === "number") frame.style.height = `${doc.height}px`;
  } else {
    frame.style.width = `${PRESET_WIDTH[doc.viewport]}px`;
  }
  frame.style.maxWidth = "100%";
  const rootBox = document.createElement("div");
  rootBox.className = "uis-root";
  rootBox.appendChild(inner);
  frame.appendChild(rootBox);
  return frame;
}
```

- [ ] **Step 4: Run — expect pass.**

Run: `yarn test tests/styler/frame.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/styler/index.ts tests/styler/frame.test.ts
git commit -m "feat(styler): viewport frame with preset and custom widths"
```

---

## Task 23: Error rendering (L1/L2 + L4 empty)

**Files:**
- Create: `src/errors/types.ts`
- Create: `src/errors/render.ts`
- Create: `tests/errors/render.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/errors/render.test.ts
import { describe, it, expect } from "vitest";
import { renderErrorBox, renderEmptyPlaceholder } from "@/errors/render";

describe("renderErrorBox", () => {
  it("renders YAML parse error with line/col", () => {
    const el = renderErrorBox({ kind: "yaml", message: "bad", loc: { line: 3, col: 5 } });
    expect(el.className).toContain("uis-error");
    expect(el.textContent).toContain("YAML");
    expect(el.textContent).toContain("line 3");
  });
  it("renders structure error with path", () => {
    const el = renderErrorBox({ kind: "structure", message: "screen required", path: "screen" });
    expect(el.textContent).toContain("screen required");
    expect(el.textContent).toContain("screen");
  });
});

describe("renderEmptyPlaceholder", () => {
  it("renders a hint box", () => {
    const el = renderEmptyPlaceholder();
    expect(el.className).toContain("uis-empty");
    expect(el.textContent).toContain("viewport");
  });
});
```

- [ ] **Step 2: Run — expect fail.**

Run: `yarn test tests/errors/render.test.ts`

- [ ] **Step 3: Implement types**

```ts
// src/errors/types.ts
import type { Loc } from "@/types";

export interface YamlError { kind: "yaml"; message: string; loc?: Loc; }
export interface StructureError { kind: "structure"; message: string; path: string; }
export type BlockError = YamlError | StructureError;
```

- [ ] **Step 4: Implement render**

```ts
// src/errors/render.ts
import type { BlockError } from "./types";

export function renderErrorBox(err: BlockError): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-error";
  const title = document.createElement("div");
  title.className = "uis-error__title";
  title.textContent = err.kind === "yaml" ? "YAML parse error" : "Wireframe structure error";
  el.appendChild(title);
  const body = document.createElement("div");
  body.className = "uis-error__body";
  if (err.kind === "yaml") {
    const loc = err.loc ? ` (line ${err.loc.line}, col ${err.loc.col})` : "";
    body.textContent = `${err.message}${loc}`;
  } else {
    body.textContent = `${err.message} at "${err.path}"`;
  }
  el.appendChild(body);
  return el;
}

export function renderEmptyPlaceholder(): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-empty";
  el.innerHTML = `
    <div class="uis-empty__title">ui-sketch block is empty</div>
    <pre class="uis-empty__example">viewport: desktop
screen:
  - navbar: { brand: "MyApp" }
  - button: { label: "Click" }</pre>
  `.trim();
  return el;
}
```

- [ ] **Step 5: Run — expect pass.**

Run: `yarn test tests/errors/render.test.ts`

- [ ] **Step 6: Commit**

```bash
git add src/errors/types.ts src/errors/render.ts tests/errors/render.test.ts
git commit -m "feat(errors): render boxes for L1/L2 and empty placeholder"
```

---

## Task 24: Renderer entry — tie it all together

**Files:**
- Create: `src/renderer/index.ts`

- [ ] **Step 1: Implement**

```ts
// src/renderer/index.ts
import { parseDocument } from "@/parser";
import { validate } from "@/schema";
import { renderLayoutNodes, renderGrid } from "./layout";
import { applyFrame } from "@/styler";
import { renderErrorBox, renderEmptyPlaceholder } from "@/errors/render";
import type { ValidatedDoc } from "@/types";

export function renderSource(source: string): HTMLElement {
  const trimmed = source.trim();
  if (trimmed === "") return renderEmptyPlaceholder();

  const parsed = parseDocument(source);
  if (!parsed.ok) return renderErrorBox(parsed.error);

  const validated = validate(parsed.doc);
  if (!validated.ok) return renderErrorBox(validated.error);

  const doc: ValidatedDoc = validated.doc;
  if (Array.isArray(doc.screen) && doc.screen.length === 0) return renderEmptyPlaceholder();

  const inner = Array.isArray(doc.screen)
    ? renderLayoutNodes(doc.screen)
    : renderGrid(doc.screen);
  return applyFrame(inner, doc);
}
```

- [ ] **Step 2: Typecheck**

Run: `yarn typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/renderer/index.ts
git commit -m "feat(renderer): end-to-end renderSource entry point"
```

---

## Task 25: End-to-end snapshot test

**Files:**
- Create: `tests/fixtures/minimal.yaml`
- Create: `tests/fixtures/dashboard.yaml`
- Create: `tests/renderer/snapshot.test.ts`

- [ ] **Step 1: Fixtures**

`tests/fixtures/minimal.yaml`:
```yaml
viewport: desktop
screen:
  - navbar: { brand: "MyApp", items: ["Home", "Docs"] }
  - row:
      gap: 12
      items:
        - card: { title: "Hi" }
```

`tests/fixtures/dashboard.yaml`:
```yaml
viewport: tablet
screen:
  grid:
    areas:
      - "nav nav"
      - "side main"
    cols: "180px 1fr"
    rows: "56px 1fr"
    map:
      nav:  { navbar: { brand: "Dash" } }
      side: { card: { title: "Menu" } }
      main: { card: { title: "Main" } }
```

- [ ] **Step 2: Write snapshot test**

```ts
// tests/renderer/snapshot.test.ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { renderSource } from "@/renderer";
import { installBuiltinComponents } from "@/components";

installBuiltinComponents();

function fixture(name: string): string {
  return fs.readFileSync(path.join(__dirname, "..", "fixtures", `${name}.yaml`), "utf8");
}

describe("renderSource snapshots", () => {
  it("matches minimal", () => {
    expect(renderSource(fixture("minimal")).outerHTML).toMatchSnapshot();
  });
  it("matches dashboard grid", () => {
    expect(renderSource(fixture("dashboard")).outerHTML).toMatchSnapshot();
  });
  it("renders empty for empty source", () => {
    const el = renderSource("");
    expect(el.className).toContain("uis-empty");
  });
  it("renders error box for invalid YAML", () => {
    const el = renderSource("screen:\n  - a: b: c\n");
    expect(el.className).toContain("uis-error");
  });
});
```

- [ ] **Step 3: Run — creates snapshots on first run**

Run: `yarn test tests/renderer/snapshot.test.ts`
Expected: all pass; `tests/renderer/__snapshots__/snapshot.test.ts.snap` created.

- [ ] **Step 4: Commit**

```bash
git add tests/fixtures tests/renderer/snapshot.test.ts tests/renderer/__snapshots__
git commit -m "test: end-to-end snapshot fixtures"
```

---

## Task 26: Settings tab (data model + UI)

**Files:**
- Create: `src/settings.ts`

- [ ] **Step 1: Implement settings**

```ts
// src/settings.ts
import { App, PluginSettingTab, Setting, Plugin } from "obsidian";
import type { ViewportKind } from "@/types";

export interface UiSketchSettings {
  defaultViewport: ViewportKind;
  defaultTheme: "adaptive";
  compact: boolean;
  verbose: boolean;
}

export const DEFAULT_SETTINGS: UiSketchSettings = {
  defaultViewport: "desktop",
  defaultTheme: "adaptive",
  compact: false,
  verbose: false,
};

export interface SettingsHost extends Plugin {
  settings: UiSketchSettings;
  saveSettings(): Promise<void>;
}

export class UiSketchSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly host: SettingsHost) {
    super(app, host);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "UI Sketch" });

    new Setting(containerEl)
      .setName("Default viewport")
      .setDesc("Used when a block omits the viewport key.")
      .addDropdown((d) => {
        d.addOption("desktop", "Desktop")
          .addOption("tablet", "Tablet")
          .addOption("mobile", "Mobile")
          .addOption("custom", "Custom")
          .setValue(this.host.settings.defaultViewport)
          .onChange(async (v) => {
            this.host.settings.defaultViewport = v as ViewportKind;
            await this.host.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Default theme")
      .setDesc("v0.1 only supports 'adaptive'.")
      .addText((t) => {
        t.setDisabled(true).setValue(this.host.settings.defaultTheme);
      });

    new Setting(containerEl)
      .setName("Compact mode")
      .setDesc("Scale spacing and fonts down ×0.875.")
      .addToggle((tog) =>
        tog.setValue(this.host.settings.compact).onChange(async (v) => {
          this.host.settings.compact = v;
          await this.host.saveSettings();
        }),
      );

    new Setting(containerEl)
      .setName("Verbose logging")
      .setDesc("Print debug traces to developer console.")
      .addToggle((tog) =>
        tog.setValue(this.host.settings.verbose).onChange(async (v) => {
          this.host.settings.verbose = v;
          await this.host.saveSettings();
        }),
      );
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `yarn typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/settings.ts
git commit -m "feat(settings): data model + settings tab UI"
```

---

## Task 27: Plugin main — wire to Obsidian

**Files:**
- Modify: `src/main.ts` (replace skeleton from Task 1)

- [ ] **Step 1: Replace main.ts**

```ts
// src/main.ts
import { Plugin } from "obsidian";
import { installBuiltinComponents } from "@/components";
import { renderSource } from "@/renderer";
import { DEFAULT_SETTINGS, UiSketchSettingTab, type UiSketchSettings } from "@/settings";

export default class UiSketchPlugin extends Plugin {
  settings: UiSketchSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    installBuiltinComponents();
    await this.loadSettingsData();

    this.registerMarkdownCodeBlockProcessor("ui-sketch", (source, el) => {
      const frame = renderSource(applyDefaults(source, this.settings));
      if (this.settings.compact) frame.classList.add("uis-compact");
      requestAnimationFrame(() => {
        el.replaceChildren(frame);
      });
    });

    this.addSettingTab(new UiSketchSettingTab(this.app, this));
  }

  async loadSettingsData(): Promise<void> {
    const data = (await this.loadData()) as Partial<UiSketchSettings> | undefined;
    this.settings = { ...DEFAULT_SETTINGS, ...(data ?? {}) };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}

function applyDefaults(source: string, settings: UiSketchSettings): string {
  // If the block omits top-level viewport, prepend it from settings.
  // Kept minimal in v0.1 — rich merging is Plan 2 territory.
  if (/^\s*viewport\s*:/m.test(source)) return source;
  if (source.trim() === "") return source;
  return `viewport: ${settings.defaultViewport}\n${source}`;
}
```

- [ ] **Step 2: Build**

Run: `yarn build`
Expected: `main.js` produced, no TS errors.

- [ ] **Step 3: Commit**

```bash
git add src/main.ts
git commit -m "feat(main): wire code block processor, settings, lifecycle"
```

---

## Task 28: Styles (CSS variables, all components)

**Files:**
- Create: `styles.css`

- [ ] **Step 1: Write styles.css**

```css
/* ===== Frame & root ===== */
.uis-frame {
  box-sizing: border-box;
  max-width: 100%;
  margin: 0 auto;
  padding: 8px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m, 8px);
}
.uis-frame[data-background="muted"]  { background: var(--background-secondary-alt); }
.uis-frame[data-background="transparent"] { background: transparent; border-color: transparent; }
.uis-root { background: var(--background-primary); padding: 12px; border-radius: inherit; }

.uis-compact .uis-frame,
.uis-compact .uis-root { font-size: 0.875em; }

/* ===== Flow / row / col / grid ===== */
.uis-flow { display: flex; flex-direction: column; gap: 12px; }
.uis-row  { display: flex; flex-direction: row; gap: 12px; align-items: stretch; }
.uis-col  { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.uis-grid { display: grid; gap: 12px; }
.uis-grid__cell { min-width: 0; }

/* ===== Annotation ===== */
.uis-annotated { position: relative; display: inline-block; }
.uis-note-dot {
  position: absolute; top: -6px; right: -6px;
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--interactive-accent); color: var(--text-on-accent, white);
  font-size: 11px; line-height: 16px; text-align: center; font-family: monospace;
  cursor: help;
}

/* ===== Placeholders ===== */
.uis-unknown {
  padding: 6px 10px;
  border: 1px dashed var(--background-modifier-border);
  color: var(--text-muted);
  border-radius: var(--radius-s, 6px);
  font-family: var(--font-monospace);
}
.uis-empty {
  padding: 12px;
  border: 1px dashed var(--background-modifier-border);
  color: var(--text-muted);
  border-radius: var(--radius-m, 8px);
}
.uis-empty__title { margin-bottom: 8px; }
.uis-empty__example { margin: 0; white-space: pre; font-size: 0.85em; }

/* ===== Errors ===== */
.uis-error {
  padding: 10px 12px;
  border: 1px solid var(--background-modifier-error, #d33);
  background: var(--background-modifier-error-hover, rgba(220,60,60,0.08));
  color: var(--text-error, #d33);
  border-radius: var(--radius-m, 8px);
}
.uis-error__title { font-weight: 600; margin-bottom: 4px; }
.uis-error__body  { font-family: var(--font-monospace); font-size: 0.9em; white-space: pre-wrap; }

/* ===== Muted ===== */
.uis-muted { opacity: 0.6; }

/* ===== Container ===== */
.uis-container { display: block; }

/* ===== Card ===== */
.uis-card {
  padding: 10px 12px;
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m, 8px);
}
.uis-card__title { font-weight: 600; margin-bottom: 4px; }
.uis-card__body  { color: var(--text-muted); }

/* ===== Panel ===== */
.uis-panel {
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m, 8px);
  overflow: hidden;
}
.uis-panel__header {
  padding: 8px 10px;
  background: var(--background-secondary);
  border-bottom: 1px solid var(--background-modifier-border);
  font-weight: 600;
}

/* ===== Divider ===== */
.uis-divider {
  background: var(--background-modifier-border);
  height: 1px; width: 100%;
}
.uis-divider--vertical { height: auto; width: 1px; align-self: stretch; }

/* ===== Spacer ===== */
.uis-spacer { display: block; }

/* ===== Button ===== */
.uis-button {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 6px 12px;
  border-radius: var(--radius-s, 6px);
  font-weight: 500; font-size: 0.9em;
  border: 1px solid transparent;
}
.uis-button--primary  { background: var(--interactive-accent); color: var(--text-on-accent, white); }
.uis-button--secondary{ background: var(--background-secondary); color: var(--text-normal); border-color: var(--background-modifier-border); }
.uis-button--ghost    { background: transparent; color: var(--text-normal); }
.uis-button--danger   { background: var(--background-modifier-error, #d33); color: white; }

/* ===== Input ===== */
.uis-input {
  display: flex; align-items: center;
  min-height: 32px; padding: 4px 10px;
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s, 6px);
}
.uis-input__placeholder { color: var(--text-muted); }
.uis-input__value       { color: var(--text-normal); }

/* ===== Heading ===== */
.uis-heading { font-weight: 700; line-height: 1.2; margin: 0; }
.uis-heading--h1 { font-size: 1.75em; }
.uis-heading--h2 { font-size: 1.5em; }
.uis-heading--h3 { font-size: 1.25em; }
.uis-heading--h4 { font-size: 1.1em; }
.uis-heading--h5 { font-size: 1em; }
.uis-heading--h6 { font-size: 0.9em; color: var(--text-muted); }

/* ===== Text ===== */
.uis-text { line-height: 1.4; }
.uis-text--muted  { color: var(--text-muted); }
.uis-text--strong { font-weight: 600; }
.uis-text--accent { color: var(--interactive-accent); }

/* ===== Navbar ===== */
.uis-navbar {
  display: flex; align-items: center; gap: 16px;
  padding: 8px 12px;
  background: var(--background-secondary);
  border-bottom: 1px solid var(--background-modifier-border);
}
.uis-navbar__brand { font-weight: 700; }
.uis-navbar__items { display: flex; gap: 12px; margin-left: auto; }
.uis-navbar__item  { color: var(--text-muted); font-size: 0.95em; }
```

- [ ] **Step 2: Rebuild**

Run: `yarn build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat(styles): CSS variables baseline + 10 component styles"
```

---

## Task 29: Run the full test suite + build

**Files:** none.

- [ ] **Step 1: Run the full suite**

Run: `yarn test`
Expected: all tests pass (parser 3, schema layout 4, schema doc 5, components 10×2-3, renderer annotation 2, renderer layout 5, renderer snapshot 4, styler 3, errors 3, sanity 1). Total ≥ 40.

- [ ] **Step 2: Run the typecheck**

Run: `yarn typecheck`
Expected: no errors.

- [ ] **Step 3: Run the build**

Run: `yarn build`
Expected: `main.js` output present; no TS errors.

- [ ] **Step 4: Commit state — no-op commit allowed if diff empty**

```bash
git status
# If only untracked build artifacts (main.js) and they're in .gitignore, nothing to do.
```

---

## Task 30: Dev vault install & smoke test (manual)

**Files:** none; validation only.

- [ ] **Step 1: Decide dev vault location**

Two options:

**Option A — install into the same directory** (the existing `.obsidian/` suggests this is the dev vault):
- The plugin source sits alongside the vault. Install as `.obsidian/plugins/ui-sketch/`.
- Already guarded by `.gitignore`.

**Option B — copy to a separate dev vault**:
- `cp main.js styles.css manifest.json /path/to/other-vault/.obsidian/plugins/ui-sketch/`

Choose A or B based on whether this directory is the daily-driver vault. If daily-driver → use B (Don't risk corrupting personal notes).

- [ ] **Step 2: Install (Option A example)**

```bash
mkdir -p .obsidian/plugins/ui-sketch
cp main.js styles.css manifest.json .obsidian/plugins/ui-sketch/
```

- [ ] **Step 3: Enable in Obsidian**

- Open the vault in Obsidian
- Settings → Community plugins → toggle "Safe mode" off if needed
- Installed plugins → enable "UI Sketch"

- [ ] **Step 4: Create a test note**

Paste this into a new note and switch to Reading view:

````
```ui-sketch
viewport: desktop
screen:
  - navbar: { brand: "DocHub", items: ["Home", "Docs", "Pricing"] }
  - row:
      gap: 16
      items:
        - col:
            flex: 1
            items:
              - card: { title: "Menu" }
        - col:
            flex: 3
            items:
              - heading: { level: 1, text: "Welcome back" }
              - text: { value: "You have 12 open tasks." }
              - button:
                  label: "New document"
                  variant: primary
                  note: "Navigates to /documents/new"
```
````

Expected:
- Frame with top navbar
- Two-column row, left narrow card, right heading + text + button
- Hover over the button: tooltip "Navigates to /documents/new"
- The ⓘ info dot is visible on the annotated button

- [ ] **Step 5: Error smoke tests**

Test these blocks and visually confirm the error UI:

- Empty block (just open/close with no content) → L4 placeholder
- Invalid YAML (`screen:\n  - a: b: c`) → L1 error box with line/col
- Missing screen (`viewport: mobile`) → L2 error box

- [ ] **Step 6: Theme adaptation check**

Switch between Obsidian light and dark themes. Confirm the frame/components recolor automatically.

- [ ] **Step 7: Commit notes if anything surprising**

If smoke test surfaced bugs, create follow-up commits fixing them. Otherwise:

```bash
git log --oneline | head -20
# A clean v0.1 history is our output of Plan 1.
```

---

## Self-Review (author's check against spec)

**Spec coverage:**
- §4 Architecture four modules → implemented (parser, schema, renderer, styler, components, errors, main, settings). ✔
- §5 YAML schema (top-level + row/col/grid + base props) → Tasks 5–7, 21. ✔
- §6 Component catalog (10/44 for v0.1) → Tasks 9–18 + registry 8, 19. ✔
- §7 Rendering lifecycle (single rAF commit, pure pipeline) → Task 27. ✔
- §7 Viewport frame → Task 22. ✔
- §7 Settings (4 options) → Task 26. ✔
- §8 L1/L2/L4 error handling → Tasks 23–24. ✔
- §8 L3, typo suggestions, safety guards → **out of scope (Plan 2)** — acknowledged in plan header.
- §9 Testing strategy (Vitest + happy-dom + snapshots) → Tasks 2, 25, per-module tests throughout.
- §10 Release stages → out of scope for this plan (Plan 3). ✔

**Placeholder scan:** none. Every code step contains actual code. No "similar to Task N" references — TDD cycles are written fully per component.

**Type consistency:**
- `ValidatedDoc.screen: LayoutNode[] | GridNode` used consistently in schema/document (Task 7), renderer/index (Task 24), and test fixtures (Task 25).
- `ComponentDef.render(props, ctx)` signature consistent across all 10 components and registry.
- `BlockError = YamlError | StructureError` in `errors/types.ts` matches `renderErrorBox` input (Task 23) and `renderSource` flow (Task 24).

No gaps found.

---

## Execution Handoff

Two execution options when you're ready:

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration. Good for this plan because tasks are highly independent (each component is a file + a test).
2. **Inline Execution** — execute in the current session using `executing-plans` skill, with batch checkpoints.

Tell me which approach and I'll kick off execution.
