import { describe, it, expect } from "vitest";
import { DividerDef } from "@/components/divider";

describe("divider", () => {
  it("renders an hr-equivalent div", () => {
    const el = DividerDef.render({}, {});
    expect(el.className).toContain("uis-divider");
  });
  it("supports vertical orientation", () => {
    const el = DividerDef.render({ orientation: "vertical" }, {});
    expect(el.className).toContain("uis-divider--vertical");
  });
});
