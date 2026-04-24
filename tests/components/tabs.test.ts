import { describe, it, expect } from "vitest";
import { TabsDef } from "@/components/tabs";

describe("tabs", () => {
  it("renders tabs horizontally with active marker", () => {
    const el = TabsDef.render({ items: ["One", "Two"], active: 1 }, {});
    expect(el.className).toContain("uis-tabs");
    const tabs = el.querySelectorAll(".uis-tabs__item");
    expect(tabs.length).toBe(2);
    expect((tabs[1] as HTMLElement).className).toContain("uis-tabs__item--active");
  });
});
