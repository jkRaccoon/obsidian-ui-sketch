import { describe, it, expect } from "vitest";
import { SkeletonDef } from "@/components/skeleton";

describe("skeleton", () => {
  it("renders with explicit sizes", () => {
    const el = SkeletonDef.render({ width: 120, height: 24 }, {}) as HTMLElement;
    expect(el.className).toContain("uis-skeleton");
    expect(el.style.width).toBe("120px");
    expect(el.style.height).toBe("24px");
  });
});
