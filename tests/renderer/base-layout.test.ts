import { describe, it, expect } from "vitest";
import { installBuiltinComponents } from "@/components";
import { renderLayoutNodes } from "@/renderer/layout";
import type { LayoutNode } from "@/types";

installBuiltinComponents();

function render(node: LayoutNode): HTMLElement {
  const host = document.createElement("div");
  host.appendChild(renderLayoutNodes([node]));
  return host;
}

/** The element a parent flex container actually lays out — annotated or not. */
function flexItem(host: HTMLElement): HTMLElement {
  return host.querySelector<HTMLElement>(".uis-flow > *")!;
}

describe("base layout props land on the flex item", () => {
  // Regression: applyBaseLayout used to run before wrapWithAnnotation, so
  // `mark`/`note` moved the styled element inside a wrapper. The wrapper became
  // the flex item and `align-self` had no effect — the component drifted to the
  // cross-axis start while an un-annotated sibling with the same props centered.
  it("applies align to the annotated wrapper, not the inner element", () => {
    const host = render({
      kind: "component",
      type: "button",
      props: { label: "Save", align: "center", mark: 1 },
    });
    const item = flexItem(host);
    expect(item.className).toContain("uis-annotated");
    expect(item.style.alignSelf).toBe("center");
  });

  it("applies width to the annotated wrapper so the pin tracks the real box", () => {
    const host = render({
      kind: "component",
      type: "input",
      props: { placeholder: "ID", w: 360, note: "required" },
    });
    const item = flexItem(host);
    expect(item.className).toContain("uis-annotated");
    expect(item.style.width).toBe("360px");
  });

  it("keeps applying base layout to the element itself when not annotated", () => {
    const host = render({
      kind: "component",
      type: "button",
      props: { label: "Save", align: "center", w: 360 },
    });
    const item = flexItem(host);
    expect(item.className).toContain("uis-button");
    expect(item.style.alignSelf).toBe("center");
    expect(item.style.width).toBe("360px");
  });

  it("annotated and plain siblings resolve to the same layout styles", () => {
    const props = { label: "Go", align: "end" as const, w: 120 };
    const plain = flexItem(render({ kind: "component", type: "button", props }));
    const marked = flexItem(render({ kind: "component", type: "button", props: { ...props, mark: 2 } }));
    expect(marked.style.alignSelf).toBe(plain.style.alignSelf);
    expect(marked.style.width).toBe(plain.style.width);
  });

  it("makes the component fill a wrapper that carries its size", () => {
    const host = render({
      kind: "component",
      type: "button",
      props: { label: "Save", w: 360, h: 48, mark: 1 },
    });
    const inner = host.querySelector<HTMLElement>(".uis-button")!;
    expect(inner.style.width).toBe("100%");
    expect(inner.style.height).toBe("100%");
  });

  it("fills only the axis that was actually sized", () => {
    const host = render({ kind: "component", type: "button", props: { label: "Save", w: 360, mark: 1 } });
    const inner = host.querySelector<HTMLElement>(".uis-button")!;
    expect(inner.style.width).toBe("100%");
    expect(inner.style.height).toBe("");
  });

  // A percentage must keep resolving against the original parent: the wrapper is
  // 50% of the parent, and the component is 100% of the wrapper — not 25%.
  it("fills with 100% rather than copying a percentage width", () => {
    const host = render({ kind: "component", type: "card", props: { title: "A", w: "50%", mark: 1 } });
    expect(flexItem(host).style.width).toBe("50%");
    expect(host.querySelector<HTMLElement>(".uis-card")!.style.width).toBe("100%");
  });

  it("leaves intrinsically-sized components alone when unsized", () => {
    const host = render({ kind: "component", type: "badge", props: { label: "new", mark: 1 } });
    const inner = host.querySelector<HTMLElement>(".uis-badge")!;
    expect(inner.style.width).toBe("");
    expect(inner.style.height).toBe("");
  });

  it("still muted-styles the inner component, not the wrapper", () => {
    const host = render({
      kind: "component",
      type: "card",
      props: { title: "Draft", muted: true, mark: 3 },
    });
    expect(host.querySelector(".uis-card")?.className).toContain("uis-muted");
  });
});

describe("pad base prop", () => {
  // `pad` is documented as a base prop on every component (README, yaml-reference)
  // but only `container` implemented it locally, so it was silently dropped
  // everywhere else.
  it("applies numeric pad as px on any component", () => {
    const host = render({ kind: "component", type: "card", props: { title: "A", pad: 16 } });
    expect(host.querySelector<HTMLElement>(".uis-card")!.style.padding).toBe("16px");
  });

  it("applies string pad as raw CSS", () => {
    const host = render({ kind: "component", type: "card", props: { title: "A", pad: "8px 12px" } });
    expect(host.querySelector<HTMLElement>(".uis-card")!.style.padding).toBe("8px 12px");
  });

  it("still applies pad on container", () => {
    const host = render({ kind: "component", type: "container", props: { pad: 20 } });
    expect(host.querySelector<HTMLElement>(".uis-container")!.style.padding).toBe("20px");
  });

  // pad is inner padding (inside the component's own border), so it stays on the
  // component even when a wrapper takes over the flex-item role. Putting it on
  // the wrapper would push the card's border outward and no longer match the
  // un-annotated render.
  it("keeps pad on the component, not the annotated wrapper", () => {
    const host = render({ kind: "component", type: "card", props: { title: "A", pad: 16, mark: 1 } });
    expect(flexItem(host).className).toContain("uis-annotated");
    expect(flexItem(host).style.padding).toBe("");
    expect(host.querySelector<HTMLElement>(".uis-card")!.style.padding).toBe("16px");
  });
});
