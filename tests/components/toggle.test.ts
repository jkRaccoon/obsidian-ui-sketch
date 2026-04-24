import { describe, it, expect } from "vitest";
import { ToggleDef } from "@/components/toggle";

describe("toggle", () => {
  it("renders off state", () => {
    const el = ToggleDef.render({ label: "Dark mode" }, {});
    expect(el.className).toContain("uis-toggle");
    expect(el.className).not.toContain("uis-toggle--on");
  });
  it("renders on state", () => {
    const el = ToggleDef.render({ on: true }, {});
    expect(el.className).toContain("uis-toggle--on");
  });
});
