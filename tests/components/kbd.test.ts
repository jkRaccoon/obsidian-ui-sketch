import { describe, it, expect } from "vitest";
import { KbdDef } from "@/components/kbd";

describe("kbd", () => {
  it("renders keycaps joined by +", () => {
    const el = KbdDef.render({ keys: ["Ctrl", "K"] }, {});
    expect(el.className).toContain("uis-kbd");
    const caps = el.querySelectorAll(".uis-kbd__cap");
    expect(caps.length).toBe(2);
    expect(el.textContent).toContain("+");
  });
});
