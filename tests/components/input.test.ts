import { describe, it, expect } from "vitest";
import { InputDef } from "@/components/input";

describe("input", () => {
  it("renders with placeholder as label", () => {
    const el = InputDef.render({ placeholder: "Email" }, {});
    expect(el.className).toContain("uis-input");
    expect(el.querySelector(".uis-input__placeholder")?.textContent).toBe("Email");
  });
  it("shows value when provided", () => {
    const el = InputDef.render({ value: "hello@x" }, {});
    expect(el.querySelector(".uis-input__value")?.textContent).toBe("hello@x");
  });
});
