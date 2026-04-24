import { describe, it, expect } from "vitest";
import { ButtonDef } from "@/components/button";

describe("button", () => {
  it("renders a button with label and default variant", () => {
    const el = ButtonDef.render({ label: "Click" }, {});
    expect(el.className).toContain("uis-button");
    expect(el.className).toContain("uis-button--primary");
    expect(el.textContent).toContain("Click");
  });
  it("supports variant prop", () => {
    const el = ButtonDef.render({ label: "X", variant: "danger" }, {});
    expect(el.className).toContain("uis-button--danger");
  });
});
