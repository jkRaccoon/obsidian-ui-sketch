# eslint-plugin-obsidianmd Adoption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adopt the official `eslint-plugin-obsidianmd` recommended ruleset, clear all errors and warnings reported by the new Obsidian Community Portal scan that still apply to current `main`, and ship `0.2.5`.

**Architecture:** Add an `eslint.config.mjs` using `obsidianmd/recommended` ruleset. Migrate all `document.createElement(...)` → `createDiv/createSpan/createEl` helpers (~130 occurrences, 40+ files). Migrate all 31 direct `element.style.X = ...` assignments to `setCssStyles({...})`. Add a vitest setup file that polyfills the Obsidian DOM helpers onto `HTMLElement.prototype` so existing tests keep passing under happy-dom.

**Tech Stack:** ESLint v9 flat config, `eslint-plugin-obsidianmd`, `@typescript-eslint/parser`, vitest + happy-dom.

**Non-goals:**
- `@typescript-eslint/no-unsafe-*` warnings from the portal scan are NOT enforced by `obsidianmd/recommended` — they come from a broader TS-strict config. Out of scope here.
- `js-yaml` / `builtin-modules` replacement recommendations from `module-replacements`: out of scope (no migration target chosen; would break parser/security architecture).
- Adding TS strict mode beyond what `tsconfig.json` already specifies.

---

## File Structure

**New files:**
- `eslint.config.mjs` — flat config, extends `obsidianmd/recommended`
- `tests/setup.ts` — polyfills `createDiv/createSpan/createEl`, `setCssStyles/setCssProps`, `activeDocument` for happy-dom

**Modified files:**
- `package.json` — add devDependencies (`eslint`, `eslint-plugin-obsidianmd`, `@typescript-eslint/parser`), add `lint` script
- `vitest.config.mts` — add `setupFiles: ["./tests/setup.ts"]`
- All `src/components/*.ts` (~30 files): `document.createElement` → helpers
- `src/errors/render.ts`: `document.createElement` → helpers
- `src/renderer/{annotation.ts, layout.ts}`: `document.createElement` → helpers, `el.style.X = ` → `setCssStyles`
- `src/styler/index.ts`: same as above
- `src/components/{progress, container, slider, spacer, skeleton, avatar, icon}.ts`: `el.style.X = ` → `setCssStyles`

**Untouched:**
- `src/components/raw.ts` — `DOMParser` usage is unavoidable and the rule allows it (only `innerHTML` is flagged)
- `src/parser/index.ts` — `js-yaml` usage stays
- `src/main.ts`, `src/settings.ts` — already correct after 5963ca4

---

## Migration patterns

**Pattern A — `document.createElement` with className + parent append:**

Before:
```ts
const el = document.createElement("div");
el.className = "uis-alert";
parent.appendChild(el);
```

After (when parent is in scope):
```ts
const el = parent.createDiv({ cls: "uis-alert" });
```

After (when no parent yet — return value used elsewhere):
```ts
const el = createDiv({ cls: "uis-alert" });
```

**Pattern B — `createElement` + textContent + parent append:**

Before:
```ts
const label = document.createElement("span");
label.className = "uis-badge__label";
label.textContent = text;
el.appendChild(label);
```

After:
```ts
el.createSpan({ cls: "uis-badge__label", text });
```

**Pattern C — non-div/span tags:**

Before:
```ts
const tr = document.createElement("tr");
table.appendChild(tr);
```

After:
```ts
const tr = table.createEl("tr");
```

**Pattern D — direct style assignment:**

Before:
```ts
el.style.width = `${w}px`;
el.style.height = `${h}px`;
```

After:
```ts
el.setCssStyles({ width: `${w}px`, height: `${h}px` });
```

For conditional style sets, group what's known:
```ts
const styles: Partial<CSSStyleDeclaration> = {};
if (typeof n.gap === "number") styles.gap = `${n.gap}px`;
if (Object.keys(styles).length > 0) el.setCssStyles(styles);
```

---

## Phase 1 — Lint infrastructure

### Task 1: Install ESLint and obsidianmd plugin

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install deps**

```bash
npm install --save-dev eslint@^9 eslint-plugin-obsidianmd @typescript-eslint/parser
```

Expected: clean install, no peerDependency warnings (or only minor ones).

- [ ] **Step 2: Verify versions in package.json**

```bash
node -p "Object.fromEntries(Object.entries(require('./package.json').devDependencies).filter(([k]) => k.includes('eslint') || k.includes('typescript-eslint')))"
```

Expected: keys for `eslint`, `eslint-plugin-obsidianmd`, `@typescript-eslint/parser`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install eslint + eslint-plugin-obsidianmd"
```

---

### Task 2: Create eslint.config.mjs

**Files:**
- Create: `eslint.config.mjs`

- [ ] **Step 1: Write config**

```js
// eslint.config.mjs
import tsparser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
  ...obsidianmd.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: { project: "./tsconfig.json" },
    },
  },
  {
    ignores: [
      "main.js",
      "node_modules/",
      "tests/**/__snapshots__/**",
      "scripts/**",
      "esbuild.config.mjs",
      "*.config.mjs",
      "*.config.mts",
    ],
  },
]);
```

- [ ] **Step 2: Sanity check — run lint**

```bash
npx eslint src/ 2>&1 | tail -5
```

Expected: lint runs (errors are fine; we'll fix them in later tasks). Should NOT crash with config-parse errors.

- [ ] **Step 3: Add npm script**

In `package.json` `"scripts"`:
```json
"lint": "eslint src/",
"lint:fix": "eslint src/ --fix",
```

- [ ] **Step 4: Verify script**

```bash
npm run lint 2>&1 | tail -3
```

Expected: same output as Step 2.

- [ ] **Step 5: Commit**

```bash
git add eslint.config.mjs package.json
git commit -m "chore: add eslint flat config with obsidianmd/recommended"
```

---

### Task 3: Test polyfill for happy-dom

**Files:**
- Create: `tests/setup.ts`
- Modify: `vitest.config.mts`

- [ ] **Step 1: Write polyfill**

`tests/setup.ts`:
```ts
// Polyfills Obsidian's HTMLElement augmentations and globals onto happy-dom
// so production code that uses createDiv/createSpan/createEl/setCssStyles
// runs under the test runner without Obsidian being present.

interface DomElementInfo {
  cls?: string | string[];
  text?: string;
  attr?: Record<string, string | number | boolean | null>;
  title?: string;
  parent?: Node;
}

declare global {
  interface HTMLElement {
    createDiv(opts?: DomElementInfo | string, callback?: (el: HTMLDivElement) => void): HTMLDivElement;
    createSpan(opts?: DomElementInfo | string, callback?: (el: HTMLSpanElement) => void): HTMLSpanElement;
    createEl<K extends keyof HTMLElementTagNameMap>(tag: K, opts?: DomElementInfo | string, callback?: (el: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
    setCssStyles(styles: Partial<CSSStyleDeclaration>): void;
    setCssProps(props: Record<string, string>): void;
  }
  // eslint-disable-next-line no-var
  var activeDocument: Document;
  function createDiv(opts?: DomElementInfo | string, callback?: (el: HTMLDivElement) => void): HTMLDivElement;
  function createSpan(opts?: DomElementInfo | string, callback?: (el: HTMLSpanElement) => void): HTMLSpanElement;
  function createEl<K extends keyof HTMLElementTagNameMap>(tag: K, opts?: DomElementInfo | string, callback?: (el: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
}

function applyOpts(el: HTMLElement, opts?: DomElementInfo | string): void {
  if (!opts) return;
  if (typeof opts === "string") {
    el.className = opts;
    return;
  }
  if (opts.cls) el.className = Array.isArray(opts.cls) ? opts.cls.join(" ") : opts.cls;
  if (opts.text !== undefined) el.textContent = opts.text;
  if (opts.attr) {
    for (const [k, v] of Object.entries(opts.attr)) {
      if (v === null || v === false) continue;
      el.setAttribute(k, String(v));
    }
  }
  if (opts.title !== undefined) el.title = opts.title;
}

function makeCreateEl(this: HTMLElement | null, tag: string, opts?: DomElementInfo | string, callback?: (el: HTMLElement) => void): HTMLElement {
  const child = document.createElement(tag);
  applyOpts(child, opts);
  const parent = typeof opts === "object" && opts?.parent ? opts.parent : this;
  if (parent instanceof Node) parent.appendChild(child);
  callback?.(child);
  return child;
}

HTMLElement.prototype.createDiv = function (opts, callback) {
  return makeCreateEl.call(this, "div", opts, callback as never) as HTMLDivElement;
};
HTMLElement.prototype.createSpan = function (opts, callback) {
  return makeCreateEl.call(this, "span", opts, callback as never) as HTMLSpanElement;
};
HTMLElement.prototype.createEl = function (tag, opts, callback) {
  return makeCreateEl.call(this, tag, opts, callback as never) as never;
};
HTMLElement.prototype.setCssStyles = function (styles) {
  Object.assign(this.style, styles);
};
HTMLElement.prototype.setCssProps = function (props) {
  for (const [k, v] of Object.entries(props)) this.style.setProperty(k, v);
};

(globalThis as { createDiv?: typeof createDiv }).createDiv = function (opts, callback) {
  return makeCreateEl.call(null, "div", opts, callback as never) as HTMLDivElement;
};
(globalThis as { createSpan?: typeof createSpan }).createSpan = function (opts, callback) {
  return makeCreateEl.call(null, "span", opts, callback as never) as HTMLSpanElement;
};
(globalThis as { createEl?: typeof createEl }).createEl = function (tag, opts, callback) {
  return makeCreateEl.call(null, tag as string, opts, callback as never) as never;
};
(globalThis as { activeDocument?: Document }).activeDocument = document;
```

- [ ] **Step 2: Wire into vitest config**

Edit `vitest.config.mts` — add `setupFiles` key:

```ts
export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts"],
    globals: false,
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

- [ ] **Step 3: Add sanity test for polyfill**

Append to `tests/sanity.test.ts`:
```ts
describe("polyfill", () => {
  it("createDiv works as HTMLElement method", () => {
    const parent = document.createElement("div");
    const child = parent.createDiv({ cls: "child", text: "hello" });
    expect(child.className).toBe("child");
    expect(child.textContent).toBe("hello");
    expect(parent.contains(child)).toBe(true);
  });
  it("createDiv works as global", () => {
    const el = createDiv({ cls: "free" });
    expect(el.className).toBe("free");
    expect(el.parentElement).toBeNull();
  });
  it("setCssStyles applies styles", () => {
    const el = document.createElement("div");
    el.setCssStyles({ width: "10px", height: "20px" });
    expect(el.style.width).toBe("10px");
    expect(el.style.height).toBe("20px");
  });
  it("activeDocument is defined", () => {
    expect(activeDocument).toBe(document);
  });
});
```

- [ ] **Step 4: Verify tests pass**

```bash
npm test 2>&1 | tail -10
```

Expected: 112 + 4 = 116 tests passing.

- [ ] **Step 5: Commit**

```bash
git add tests/setup.ts vitest.config.mts tests/sanity.test.ts
git commit -m "test: polyfill Obsidian DOM helpers in happy-dom"
```

---

## Phase 2 — Auto-fixable rules

### Task 4: Run eslint --fix

**Files:**
- Modify: any `src/**/*.ts` flagged by auto-fixable rules

- [ ] **Step 1: Snapshot current lint output**

```bash
npm run lint 2>&1 | tee /tmp/lint-before.txt | tail -10
```

Note the error/warning count.

- [ ] **Step 2: Apply auto-fixes**

```bash
npm run lint:fix 2>&1 | tail -5
```

- [ ] **Step 3: Check what changed**

```bash
git diff --stat src/
```

Expected: a handful of files touched by auto-fixable rules (`detach-leaves`, `no-global-this`, `no-sample-code`, `prefer-instanceof`, `prefer-window-timers` per the obsidianmd README — but UI Sketch likely only hits 0–2 of these).

- [ ] **Step 4: Verify tests still green**

```bash
npm test 2>&1 | tail -3
```

Expected: all tests pass.

- [ ] **Step 5: Verify typecheck**

```bash
npm run typecheck
```

Expected: clean.

- [ ] **Step 6: Commit (only if anything changed)**

```bash
git add src/
git commit -m "refactor: apply eslint --fix for auto-fixable obsidianmd rules"
```

If `git diff --cached` is empty (auto-fix found nothing), skip the commit.

---

## Phase 3 — `createDiv` / `createSpan` / `createEl` migration

### Task 5: Migrate `src/errors/render.ts`

**Files:**
- Modify: `src/errors/render.ts`

- [ ] **Step 1: Lint that file**

```bash
npx eslint src/errors/render.ts 2>&1 | head -30
```

Note all violations.

- [ ] **Step 2: Read the file and identify each `document.createElement` call**

```bash
grep -n "document.createElement" src/errors/render.ts
```

- [ ] **Step 3: Apply pattern A/B/C as appropriate**

For each occurrence:
- If the element is appended to a parent already in scope (e.g., `parent.appendChild(el)` follows), use `parent.createDiv({cls, text})`.
- If the element is the return value or root, use the global `createDiv({cls})`.
- For tags other than div/span, use `createEl("tag", {...})`.

The file has these elements (from grep above): a root `pre`, error `divs`, inline error `divs`. Convert each.

- [ ] **Step 4: Lint clean for the file**

```bash
npx eslint src/errors/render.ts
```

Expected: no `no-forbidden-elements` or createDiv-related violations.

- [ ] **Step 5: Run targeted tests**

```bash
npm test tests/errors/ 2>&1 | tail -5
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/errors/render.ts
git commit -m "refactor(errors): use createDiv/createEl helpers"
```

---

### Task 6: Migrate `src/renderer/annotation.ts`

**Files:**
- Modify: `src/renderer/annotation.ts`

Repeat Task 5 procedure for this file (smaller — only 2 occurrences).

- [ ] **Step 1: Lint**: `npx eslint src/renderer/annotation.ts`
- [ ] **Step 2: Convert** — both `document.createElement` calls become `createDiv`/`createSpan` helpers.
- [ ] **Step 3: Lint clean** for this file.
- [ ] **Step 4: Test**: `npm test tests/renderer/annotation.test.ts`
- [ ] **Step 5: Commit**

```bash
git add src/renderer/annotation.ts
git commit -m "refactor(renderer): use helpers in annotation"
```

---

### Task 7: Migrate `src/renderer/layout.ts`

**Files:**
- Modify: `src/renderer/layout.ts`

This file has both helper-conversion AND `setCssStyles` migration. Handle helpers here; styles in Task 13.

- [ ] **Step 1: Lint**: `npx eslint src/renderer/layout.ts`
- [ ] **Step 2: Convert all `document.createElement` calls** (6 occurrences). Keep `style.X = ` lines untouched for now.
- [ ] **Step 3: Verify createDiv/createEl rule passes**: `npx eslint --rule '{ "obsidianmd/no-forbidden-elements": "error" }' src/renderer/layout.ts`
- [ ] **Step 4: Test**: `npm test tests/renderer/`
- [ ] **Step 5: Commit**

```bash
git add src/renderer/layout.ts
git commit -m "refactor(renderer): use createDiv/createEl helpers in layout"
```

---

### Task 8: Migrate `src/styler/index.ts`

**Files:**
- Modify: `src/styler/index.ts`

Same pattern. 2 `document.createElement` calls + 3 style lines (styles in Task 13).

- [ ] **Step 1: Lint**: `npx eslint src/styler/index.ts`
- [ ] **Step 2: Convert createElement calls only.**
- [ ] **Step 3: Lint helpers clean.**
- [ ] **Step 4: Test**: `npm test tests/styler/ tests/renderer/snapshot.test.ts`
- [ ] **Step 5: Commit**

```bash
git add src/styler/index.ts
git commit -m "refactor(styler): use createDiv helper in applyFrame"
```

---

### Task 9: Migrate `src/components/` group A (simple, no children)

**Files:**
- Modify: `src/components/{alert,avatar,badge,breadcrumb,button,divider,heading,icon,placeholder,skeleton,spacer,tag,text,toggle,kbd,container}.ts`

These are components where the render function creates a small fixed structure.

- [ ] **Step 1: For each file in the group:**

  - Lint: `npx eslint src/components/<name>.ts`
  - Read file
  - Convert all `document.createElement` calls to `createDiv/createSpan/createEl`
  - Save

- [ ] **Step 2: Run all component tests**

```bash
npm test tests/components/ 2>&1 | tail -10
```

Expected: all pass.

- [ ] **Step 3: Run snapshot test (renderer-level)**

```bash
npm test tests/renderer/snapshot.test.ts 2>&1 | tail -10
```

Expected: pass (no snapshot diffs — the DOM output should be byte-identical because the helpers produce the same structure).

If snapshot diffs appear, the helpers produced different attribute order or whitespace — that's a real change and requires investigation before updating the snapshot.

- [ ] **Step 4: Commit**

```bash
git add src/components/
git commit -m "refactor(components): use createDiv/createSpan/createEl helpers (group A)"
```

---

### Task 10: Migrate `src/components/` group B (form inputs)

**Files:**
- Modify: `src/components/{input,textarea,select,checkbox,radio,slider,search,date-picker,file-upload,toggle}.ts`

Same procedure as Task 9. These have label + control + helper-text structures.

- [ ] **Step 1: Per file: convert createElement → createDiv/createEl.**
- [ ] **Step 2: Tests**: `npm test tests/components/`
- [ ] **Step 3: Snapshots**: `npm test tests/renderer/snapshot.test.ts`
- [ ] **Step 4: Commit**

```bash
git add src/components/
git commit -m "refactor(components): use helpers in form inputs (group B)"
```

---

### Task 11: Migrate `src/components/` group C (complex containers)

**Files:**
- Modify: `src/components/{card,modal,navbar,sidebar,tabs,stepper,panel,list,tree,table,toast,pagination,kv-list,progress,chart,image,video,map,raw}.ts`

These have more children and require care with nesting.

- [ ] **Step 1: Per file: convert createElement → helpers.**

Pay special attention to:
- `table.ts` — uses table/thead/tr/th/tbody/td. Each becomes `createEl("table"|"thead"|...)`.
- `list.ts` — uses `ul`/`ol`/`li`. Use `createEl("ul"|"ol"|"li", {cls, text})`.
- `tree.ts` — nested structure, multiple createElement calls per node.
- `raw.ts` — only the outer `<div>` wrapping. The DOMParser + appendChild loop stays as-is (the rule allows DOMParser, only flags innerHTML).

- [ ] **Step 2: Tests**: `npm test tests/components/`
- [ ] **Step 3: Snapshots**: `npm test tests/renderer/snapshot.test.ts`
- [ ] **Step 4: Commit**

```bash
git add src/components/
git commit -m "refactor(components): use helpers in complex containers (group C)"
```

---

### Task 12: Verify all createElement gone

**Files:**
- Inspect only

- [ ] **Step 1: Grep**

```bash
grep -rn "document.createElement" src/
```

Expected: empty output OR only intentional exceptions (e.g., dynamic tag selection that helpers can't express — should be zero in our codebase).

- [ ] **Step 2: Lint full**

```bash
npm run lint 2>&1 | tail -5
```

Expected: no `obsidianmd/no-forbidden-elements` errors. May still have `no-static-styles-assignment` errors (handled in Task 13).

---

## Phase 4 — Style assignment migration

### Task 13: Migrate `el.style.X = ...` to `setCssStyles`

**Files:**
- Modify: `src/renderer/layout.ts` (11 occurrences)
- Modify: `src/styler/index.ts` (3 occurrences)
- Modify: `src/components/progress.ts` (1 occurrence)
- Modify: `src/components/container.ts` (2 occurrences)
- Modify: `src/components/slider.ts` (1 occurrence)
- Modify: `src/components/spacer.ts` (2 occurrences)
- Modify: `src/components/skeleton.ts` (4 occurrences)
- Modify: `src/components/avatar.ts` (3 occurrences)
- Modify: `src/components/icon.ts` (3 occurrences)

Total: 30 lines across 9 files.

- [ ] **Step 1: For each file, list violations**

```bash
for f in src/renderer/layout.ts src/styler/index.ts src/components/{progress,container,slider,spacer,skeleton,avatar,icon}.ts; do
  echo "=== $f ==="
  grep -n "\.style\." $f
done
```

- [ ] **Step 2: Apply Pattern D (group conditional assignments)**

Example for `src/components/avatar.ts`:

Before:
```ts
el.style.width = `${size}px`;
el.style.height = `${size}px`;
el.style.lineHeight = `${size}px`;
```

After:
```ts
el.setCssStyles({
  width: `${size}px`,
  height: `${size}px`,
  lineHeight: `${size}px`,
});
```

Example for conditional (renderer/layout.ts `applyBaseLayout`):

Before:
```ts
if (typeof props.w === "number") el.style.width = `${props.w}px`;
else if (typeof props.w === "string") el.style.width = props.w;
if (typeof props.h === "number") el.style.height = `${props.h}px`;
else if (typeof props.h === "string") el.style.height = props.h;
if (typeof props.align === "string") el.style.alignSelf = props.align;
```

After:
```ts
const styles: Partial<CSSStyleDeclaration> = {};
if (typeof props.w === "number") styles.width = `${props.w}px`;
else if (typeof props.w === "string") styles.width = props.w;
if (typeof props.h === "number") styles.height = `${props.h}px`;
else if (typeof props.h === "string") styles.height = props.h;
if (typeof props.align === "string") styles.alignSelf = props.align;
if (Object.keys(styles).length > 0) el.setCssStyles(styles);
```

- [ ] **Step 3: Lint clean**

```bash
npx eslint src/renderer/layout.ts src/styler/index.ts src/components/
```

Expected: no `obsidianmd/no-static-styles-assignment` errors.

- [ ] **Step 4: Tests**

```bash
npm test 2>&1 | tail -5
```

Expected: 116/116 passing.

- [ ] **Step 5: Snapshot tests**

```bash
npm test tests/renderer/snapshot.test.ts 2>&1 | tail -5
```

Expected: pass (rendered HTML output is identical).

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "refactor: use setCssStyles for dynamic CSS"
```

---

## Phase 5 — Verification and release

### Task 14: Full clean check

**Files:**
- Inspect only

- [ ] **Step 1: Full lint**

```bash
npm run lint
```

Expected: exit 0 OR only `prefer-active-doc` warnings (this rule is in `recommended` as a warn, not error; addressing requires the polyfill to expose `activeDocument` everywhere — which it does, but production code still uses `document` directly in a few places). Note count.

- [ ] **Step 2: Tests**

```bash
npm test
```

Expected: 116/116 pass.

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: clean.

- [ ] **Step 4: Production build**

```bash
npm run build
```

Expected: `main.js` produced, size similar to 0.2.4 (377KB ± 5KB — helpers compile to ~same output).

- [ ] **Step 5: Docs regen sanity**

```bash
npm run gen:docs
git diff --stat docs/
```

Expected: empty or noise-level (helpers don't change zod schemas).

- [ ] **Step 6: Screenshots regen** (optional, may take time)

```bash
npm run gen:screenshots 2>&1 | tail -3
```

Expected: completes without error. File list shouldn't change (we didn't add/remove recipes).

---

### Task 15: Bump version to 0.2.5

**Files:**
- Modify: `manifest.json`, `package.json`, `versions.json`

- [ ] **Step 1: Edit manifest.json**

Change `"version": "0.2.4"` → `"version": "0.2.5"`.

- [ ] **Step 2: Edit package.json**

Change `"version": "0.2.4"` → `"version": "0.2.5"`.

- [ ] **Step 3: Edit versions.json**

Add `"0.2.5": "1.5.0"` after the 0.2.4 entry.

- [ ] **Step 4: Commit**

```bash
git add manifest.json package.json versions.json
git commit -m "chore: release 0.2.5"
```

- [ ] **Step 5: Push to main**

```bash
git push origin main
```

---

### Task 16: Tag and trigger release workflow

**Files:**
- None (git ops + GHA)

- [ ] **Step 1: Tag**

```bash
git tag 0.2.5
git push origin 0.2.5
```

- [ ] **Step 2: Watch the run**

```bash
gh run list --workflow=release.yml --limit 1
# then
gh run watch <run-id> --exit-status
```

Expected: workflow succeeds in ~30s. Build, attest, release upload all green.

- [ ] **Step 3: Verify release**

```bash
gh release view 0.2.5 --json tagName,assets
```

Expected: 3 assets (`main.js`, `manifest.json`, `styles.css`).

- [ ] **Step 4: Verify attestation**

```bash
curl -sL https://github.com/jkRaccoon/obsidian-ui-sketch/releases/download/0.2.5/main.js -o /tmp/main.js
gh attestation verify /tmp/main.js --repo jkRaccoon/obsidian-ui-sketch
```

Expected: verification passes.

---

## Self-Review checklist

- **Spec coverage**: All Required Errors + obsidianmd-actionable Warnings from the portal scan that still apply on `main` are addressed. `no-static-styles-assignment` (Task 13), `no-forbidden-elements` (Tasks 5–11). Out-of-scope items (TS no-unsafe-*, js-yaml replacement, builtin-modules) explicitly listed in **Non-goals**.
- **Placeholders**: none (all code blocks complete; all file lists exact).
- **Type consistency**: `DomElementInfo` interface in `tests/setup.ts` matches Obsidian's actual signature. `setCssStyles` and `setCssProps` signatures match `obsidian.d.ts`. Migration patterns A/B/C/D show exact before/after.
- **Risk callouts**:
  - Snapshot tests (`tests/renderer/snapshot.test.ts`) will catch any DOM-output regression. If they break, the polyfill's attribute ordering differs from happy-dom's native order — investigate before snapshot update.
  - Build size: helpers compile to similar output (object literal vs setter chain). Should stay within 5KB of 0.2.4.
