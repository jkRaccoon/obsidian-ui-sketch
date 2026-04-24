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
});
