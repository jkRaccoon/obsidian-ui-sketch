import { describe, it, expect } from "vitest";
import { NavbarDef } from "@/components/navbar";

describe("navbar", () => {
  it("renders brand and item list", () => {
    const el = NavbarDef.render({ brand: "MyApp", items: ["Home", "Docs"] }, {});
    expect(el.className).toContain("uis-navbar");
    expect(el.querySelector(".uis-navbar__brand")?.textContent).toBe("MyApp");
    const items = el.querySelectorAll(".uis-navbar__item");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toBe("Home");
  });

  it("highlights an active object item and adds a caret for children", () => {
    const el = NavbarDef.render({
      items: [{ label: "Home", active: true }, { label: "Docs", children: ["API", "FAQ"] }],
    }, {});
    const items = el.querySelectorAll(".uis-navbar__item");
    expect((items[0] as HTMLElement).className).toContain("uis-navbar__item--active");
    expect(el.querySelector(".uis-navbar__caret")).not.toBeNull();
  });

  it("renders an open dropdown panel with child entries", () => {
    const el = NavbarDef.render({
      items: [{ label: "Docs", open: true, children: ["API", "FAQ"] }],
    }, {});
    const dropdown = el.querySelector(".uis-navbar__dropdown");
    expect(dropdown).not.toBeNull();
    expect(dropdown?.querySelectorAll(".uis-navbar__dropdown-item").length).toBe(2);
  });

  it("omits the dropdown panel when an item is not open", () => {
    const el = NavbarDef.render({ items: [{ label: "Docs", children: ["API"] }] }, {});
    expect(el.querySelector(".uis-navbar__dropdown")).toBeNull();
    expect(el.querySelector(".uis-navbar__caret")).not.toBeNull();
  });

  it("renders action slots: icon, avatar initials, and label", () => {
    const el = NavbarDef.render({
      brand: "MyApp",
      actions: [{ icon: "search" }, { avatar: "Kim Jane" }, { label: "Log in" }],
    }, {});
    expect(el.querySelector(".uis-navbar__actions")).not.toBeNull();
    expect(el.querySelector(".uis-navbar__action-icon")?.textContent).toBe("s");
    expect(el.querySelector(".uis-navbar__action-avatar")?.textContent).toBe("KJ");
    expect(el.querySelector(".uis-navbar__action-label")?.textContent).toBe("Log in");
  });

  it("adds the --has-actions modifier only when actions exist", () => {
    const withActions = NavbarDef.render({ actions: [{ label: "X" }] }, {});
    expect(withActions.className).toContain("uis-navbar--has-actions");
    const without = NavbarDef.render({ items: ["Home"] }, {});
    expect(without.className).not.toContain("uis-navbar--has-actions");
  });
});
