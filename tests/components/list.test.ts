import { describe, it, expect } from "vitest";
import { ListDef } from "@/components/list";

describe("list", () => {
  it("renders an unordered list by default", () => {
    const el = ListDef.render({ items: ["A", "B", "C"] }, {});
    expect(el.tagName).toBe("UL");
    expect(el.className).toContain("uis-list");
    expect(el.querySelectorAll("li").length).toBe(3);
  });
  it("renders an ordered list when ordered=true", () => {
    const el = ListDef.render({ items: ["X"], ordered: true }, {});
    expect(el.tagName).toBe("OL");
  });
});
