import { describe, it, expect } from "vitest";
import { BreadcrumbDef } from "@/components/breadcrumb";

describe("breadcrumb", () => {
  it("renders items separated by chevrons", () => {
    const el = BreadcrumbDef.render({ items: ["A", "B", "C"] }, {});
    expect(el.className).toContain("uis-breadcrumb");
    expect(el.querySelectorAll(".uis-breadcrumb__item").length).toBe(3);
    expect(el.querySelectorAll(".uis-breadcrumb__sep").length).toBe(2);
  });
});
