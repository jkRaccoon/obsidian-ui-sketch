import { describe, it, expect } from "vitest";
import { PanelDef } from "@/components/panel";

describe("panel", () => {
  it("renders a panel with optional header", () => {
    const el = PanelDef.render({ header: "Settings" }, {});
    expect(el.className).toContain("uis-panel");
    expect(el.querySelector(".uis-panel__header")?.textContent).toBe("Settings");
  });
});
