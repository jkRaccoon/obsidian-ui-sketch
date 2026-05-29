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

  it("renders a section header", () => {
    const el = SidebarDef.render({ items: [{ section: "MAIN" }, "Home"] }, {});
    const sections = el.querySelectorAll(".uis-sidebar__section");
    expect(sections.length).toBe(1);
    expect(sections[0].textContent).toBe("MAIN");
    // section is not a clickable item
    expect(el.querySelectorAll(".uis-sidebar__item").length).toBe(1);
  });

  it("renders an item icon from its first character", () => {
    const el = SidebarDef.render({ items: [{ label: "Home", icon: "house" }] }, {});
    const icon = el.querySelector(".uis-sidebar__icon");
    expect(icon).not.toBeNull();
    expect(icon?.textContent).toBe("h");
  });

  it("highlights an object item with active:true", () => {
    const el = SidebarDef.render({ items: [{ label: "Home" }, { label: "Docs", active: true }] }, {});
    const items = el.querySelectorAll(".uis-sidebar__item");
    expect((items[1] as HTMLElement).className).toContain("uis-sidebar__item--active");
  });

  it("renders nested children indented under a parent", () => {
    const el = SidebarDef.render({ items: [{ label: "Docs", children: ["API", "FAQ"] }] }, {});
    const children = el.querySelector(".uis-sidebar__children");
    expect(children).not.toBeNull();
    expect(children?.querySelectorAll(".uis-sidebar__child").length).toBe(2);
    expect(children?.querySelectorAll(".uis-sidebar__child")[0].textContent).toContain("API");
  });

  it("marks the root collapsed when collapsed is true", () => {
    const el = SidebarDef.render({ items: ["Home"], collapsed: true }, {});
    expect(el.className).toContain("uis-sidebar--collapsed");
  });
});
