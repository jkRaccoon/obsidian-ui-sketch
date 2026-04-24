import { describe, it, expect } from "vitest";
import { RadioDef } from "@/components/radio";

describe("radio", () => {
  it("renders with label", () => {
    const el = RadioDef.render({ label: "A" }, {});
    expect(el.className).toContain("uis-radio");
    expect(el.textContent).toContain("A");
  });
  it("selected adds modifier class", () => {
    const el = RadioDef.render({ label: "A", selected: true }, {});
    expect(el.className).toContain("uis-radio--selected");
  });
});
