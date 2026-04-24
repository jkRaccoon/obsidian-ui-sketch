// tests/components/sidebar.test.ts
import { describe, it, expect } from "vitest";
import { SidebarDef } from "@/components/sidebar";

describe("sidebar", () => {
  it("renders a list of items", () => {
    const el = SidebarDef.render({ items: ["Home", "Docs"] }, {});
    expect(el.className).toContain("uis-sidebar");
    expect(el.querySelectorAll(".uis-sidebar__item").length).toBe(2);
  });
  it("highlights active by string match", () => {
    const el = SidebarDef.render({ items: ["Home", "Docs"], active: "Docs" }, {});
    const items = el.querySelectorAll(".uis-sidebar__item");
    expect((items[1] as HTMLElement).className).toContain("uis-sidebar__item--active");
  });
});
