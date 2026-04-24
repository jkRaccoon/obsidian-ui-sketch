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
