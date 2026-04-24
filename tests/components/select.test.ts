import { describe, it, expect } from "vitest";
import { SelectDef } from "@/components/select";

describe("select", () => {
  it("renders a chevron + placeholder", () => {
    const el = SelectDef.render({ placeholder: "Choose one" }, {});
    expect(el.className).toContain("uis-select");
    expect(el.querySelector(".uis-select__chevron")?.textContent).toBe("▼");
    expect(el.textContent).toContain("Choose one");
  });
});
