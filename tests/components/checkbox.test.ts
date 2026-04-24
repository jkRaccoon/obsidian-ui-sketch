import { describe, it, expect } from "vitest";
import { CheckboxDef } from "@/components/checkbox";

describe("checkbox", () => {
  it("renders unchecked state", () => {
    const el = CheckboxDef.render({ label: "Agree" }, {});
    expect(el.className).toContain("uis-checkbox");
    expect(el.className).not.toContain("uis-checkbox--checked");
    expect(el.textContent).toContain("Agree");
  });
  it("renders checked state", () => {
    const el = CheckboxDef.render({ label: "Agree", checked: true }, {});
    expect(el.className).toContain("uis-checkbox--checked");
  });
});
