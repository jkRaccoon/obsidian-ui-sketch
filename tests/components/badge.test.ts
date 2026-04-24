import { describe, it, expect } from "vitest";
import { BadgeDef } from "@/components/badge";

describe("badge", () => {
  it("renders label with default variant", () => {
    const el = BadgeDef.render({ label: "NEW" }, {});
    expect(el.className).toContain("uis-badge");
    expect(el.className).toContain("uis-badge--default");
    expect(el.textContent).toBe("NEW");
  });
  it("supports variant", () => {
    const el = BadgeDef.render({ label: "!", variant: "danger" }, {});
    expect(el.className).toContain("uis-badge--danger");
  });
});
