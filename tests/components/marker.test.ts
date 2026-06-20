import { describe, it, expect } from "vitest";
import { MarkerDef, createMarkerBadge } from "@/components/marker";

describe("marker", () => {
  it("renders the number label", () => {
    const el = MarkerDef.render({ num: 1 }, {});
    expect(el.className).toContain("uis-marker");
    expect(el.querySelector(".uis-marker__label")?.textContent).toBe("1");
  });

  it("accepts a string label", () => {
    const el = MarkerDef.render({ num: "A" }, {});
    expect(el.querySelector(".uis-marker__label")?.textContent).toBe("A");
  });

  it("falls back to an info glyph when no label", () => {
    const el = MarkerDef.render({}, {});
    expect(el.querySelector(".uis-marker__label")?.textContent).toBe("ℹ");
  });

  it("renders the hover tooltip when text is given", () => {
    const el = MarkerDef.render({ num: 1, text: "auto-saves" }, {});
    const tip = el.querySelector(".uis-marker__tip");
    expect(tip).not.toBeNull();
    expect(tip?.textContent).toBe("auto-saves");
  });

  it("omits the tooltip when there is no text", () => {
    const el = MarkerDef.render({ num: 1 }, {});
    expect(el.querySelector(".uis-marker__tip")).toBeNull();
  });

  it("defaults to the primary variant", () => {
    const el = MarkerDef.render({ num: 1 }, {});
    expect(el.className).toContain("uis-marker--primary");
  });

  it("supports a variant", () => {
    const el = MarkerDef.render({ num: 1, variant: "danger" }, {});
    expect(el.className).toContain("uis-marker--danger");
  });
});

describe("createMarkerBadge", () => {
  it("adds the pin modifier for overlay use", () => {
    const el = createMarkerBadge("2", "watch out", "warning", { pin: true });
    expect(el.className).toContain("uis-marker--pin");
    expect(el.className).toContain("uis-marker--warning");
    expect(el.querySelector(".uis-marker__label")?.textContent).toBe("2");
    expect(el.querySelector(".uis-marker__tip")?.textContent).toBe("watch out");
  });

  it("is not pinned by default", () => {
    const el = createMarkerBadge("1");
    expect(el.className).not.toContain("uis-marker--pin");
  });
});
