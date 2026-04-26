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
  const rootBox = document.createElement("div");
  rootBox.className = "uis-root";
  rootBox.appendChild(inner);
  frame.appendChild(rootBox);
  return frame;
}
