import type { ValidatedDoc, ViewportKind } from "@/types";

const PRESET_WIDTH: Record<Exclude<ViewportKind, "custom">, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 375,
};

export function applyFrame(inner: HTMLElement, doc: ValidatedDoc): HTMLElement {
  const frame = createDiv({ cls: "uis-frame" });
  frame.setAttribute("data-viewport", doc.viewport);
  frame.setAttribute("data-theme", doc.theme);
  frame.setAttribute("data-background", doc.background);
  if (doc.viewport === "custom") {
    const styles: Partial<CSSStyleDeclaration> = {};
    if (typeof doc.width === "number") styles.width = `${doc.width}px`;
    if (typeof doc.height === "number") styles.height = `${doc.height}px`;
    if (Object.keys(styles).length > 0) frame.setCssStyles(styles);
  } else {
    frame.setCssStyles({ width: `${PRESET_WIDTH[doc.viewport]}px` });
  }
  const rootBox = frame.createDiv({ cls: "uis-root" });
  rootBox.appendChild(inner);
  return frame;
}
