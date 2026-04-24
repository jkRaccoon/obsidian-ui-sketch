import { describe, it, expect } from "vitest";
import { TreeDef } from "@/components/tree";

describe("tree", () => {
  it("renders a nested tree with labels and children", () => {
    const el = TreeDef.render({
      items: [
        { label: "src", children: [ { label: "main.ts" }, { label: "types.ts" } ] },
        { label: "docs" },
      ],
    }, {});
    expect(el.className).toContain("uis-tree");
    expect(el.querySelectorAll(".uis-tree__node").length).toBeGreaterThanOrEqual(4);
    expect(el.querySelectorAll(".uis-tree__children").length).toBe(1);
  });
});
