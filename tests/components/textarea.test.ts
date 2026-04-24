import { describe, it, expect } from "vitest";
import { TextareaDef } from "@/components/textarea";

describe("textarea", () => {
  it("shows placeholder when no value", () => {
    const el = TextareaDef.render({ placeholder: "Notes" }, {});
    expect(el.className).toContain("uis-textarea");
    expect(el.querySelector(".uis-textarea__placeholder")?.textContent).toBe("Notes");
  });
  it("shows value when provided", () => {
    const el = TextareaDef.render({ value: "Hello\nworld" }, {});
    expect(el.querySelector(".uis-textarea__value")?.textContent).toBe("Hello\nworld");
  });
});
