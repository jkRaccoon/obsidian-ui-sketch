import type { BlockError } from "./types";
import type { ComponentError } from "./types";

export function renderErrorBox(err: BlockError): HTMLElement {
  const el = createDiv({ cls: "uis-error" });
  el.createDiv({
    cls: "uis-error__title",
    text: err.kind === "yaml" ? "YAML parse error" : "Wireframe structure error",
  });
  const body = el.createDiv({ cls: "uis-error__body" });
  if (err.kind === "yaml") {
    const loc = err.loc ? ` (line ${err.loc.line}, col ${err.loc.col})` : "";
    body.textContent = `${err.message}${loc}`;
  } else {
    body.textContent = `${err.message} at "${err.path}"`;
  }
  return el;
}

export function renderInlineError(err: ComponentError): HTMLElement {
  const el = createDiv({ cls: "uis-error uis-error--inline" });

  el.createDiv({
    cls: "uis-error__title",
    text: `⚠ ${err.componentType}: ${err.message}`,
  });

  if (err.suggestion) {
    el.createDiv({
      cls: "uis-error__hint",
      text: `Did you mean "${err.suggestion}"?`,
    });
  }

  el.createDiv({ cls: "uis-error__body", text: `at ${err.path}` });

  return el;
}

export function renderEmptyPlaceholder(): HTMLElement {
  const el = createDiv({ cls: "uis-empty" });

  el.createDiv({ cls: "uis-empty__title", text: "Block is empty" });

  el.createEl("pre", {
    cls: "uis-empty__example",
    text: `viewport: desktop
screen:
  - navbar: { brand: "MyApp" }
  - button: { label: "Click" }`,
  });

  return el;
}
