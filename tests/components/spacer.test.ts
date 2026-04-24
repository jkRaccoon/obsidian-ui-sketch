import { describe, it, expect } from "vitest";
import { SpacerDef } from "@/components/spacer";

describe("spacer", () => {
  it("renders a div with size style", () => {
    const el = SpacerDef.render({ size: 24 }, {}) as HTMLElement;
    expect(el.className).toContain("uis-spacer");
    expect(el.style.minHeight).toBe("24px");
  });
});
