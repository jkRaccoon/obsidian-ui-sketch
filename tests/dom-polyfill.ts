// Polyfills Obsidian's HTMLElement DOM helpers (createDiv/createSpan/createEl/
// setCssStyles) using only standard DOM APIs, so the renderer runs without
// Obsidian present. Shared by the vitest setup (tests/setup.ts) and the
// headless screenshot/preview harness (scripts/screenshot-entry.ts) — the
// latter bundles this for a real Chromium page, the former for happy-dom.

export {};

interface DomElementInfo {
  cls?: string | string[];
  text?: string | DocumentFragment;
  attr?: Record<string, string | number | boolean | null>;
  title?: string;
  parent?: Node;
  value?: string;
  type?: string;
  prepend?: boolean;
  placeholder?: string;
  href?: string;
}

declare global {
  interface HTMLElement {
    createDiv(opts?: DomElementInfo | string, callback?: (el: HTMLDivElement) => void): HTMLDivElement;
    createSpan(opts?: DomElementInfo | string, callback?: (el: HTMLSpanElement) => void): HTMLSpanElement;
    createEl<K extends keyof HTMLElementTagNameMap>(tag: K, opts?: DomElementInfo | string, callback?: (el: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
    setCssStyles(styles: Partial<CSSStyleDeclaration>): void;
    setCssProps(props: Record<string, string>): void;
  }
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
  if (opts.text !== undefined) el.textContent = typeof opts.text === "string" ? opts.text : opts.text.textContent;
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
