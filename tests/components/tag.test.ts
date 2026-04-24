import { describe, it, expect } from "vitest";
import { TagDef } from "@/components/tag";

describe("tag", () => {
  it("renders label", () => {
    const el = TagDef.render({ label: "design" }, {});
    expect(el.className).toContain("uis-tag");
    expect(el.textContent).toBe("design");
  });
});
