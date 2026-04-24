import { describe, it, expect } from "vitest";
import { DatePickerDef } from "@/components/date-picker";

describe("date-picker", () => {
  it("renders with calendar icon + placeholder", () => {
    const el = DatePickerDef.render({ placeholder: "YYYY-MM-DD" }, {});
    expect(el.className).toContain("uis-date-picker");
    expect(el.querySelector(".uis-date-picker__icon")?.textContent).toBe("📅");
    expect(el.textContent).toContain("YYYY-MM-DD");
  });
});
