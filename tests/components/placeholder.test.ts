import { describe, it, expect } from "vitest";
import { PlaceholderDef } from "@/components/placeholder";

describe("placeholder", () => {
  it("renders a dashed box with custom label", () => {
    const el = PlaceholderDef.render({ label: "TBD" }, {});
    expect(el.className).toContain("uis-placeholder");
    expect(el.textContent).toBe("TBD");
  });
});
