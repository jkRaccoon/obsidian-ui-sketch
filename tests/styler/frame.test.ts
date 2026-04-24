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
