import type { BlockError } from "./types";
import type { ComponentError } from "./types";

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

export function renderEmptyPlaceholder(): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-empty";

  const title = document.createElement("div");
  title.className = "uis-empty__title";
  title.textContent = "Block is empty";
  el.appendChild(title);

  const example = document.createElement("pre");
  example.className = "uis-empty__example";
  example.textContent = `viewport: desktop
screen:
  - navbar: { brand: "MyApp" }
  - button: { label: "Click" }`;
  el.appendChild(example);

  return el;
}
