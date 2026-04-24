import { describe, it, expect } from "vitest";
import { TextDef } from "@/components/text";

describe("text", () => {
  it("renders body text", () => {
    const el = TextDef.render({ value: "Paragraph" }, {});
    expect(el.className).toContain("uis-text");
    expect(el.textContent).toBe("Paragraph");
  });
  it("supports muted variant via tone prop", () => {
    const el = TextDef.render({ value: "x", tone: "muted" }, {});
    expect(el.className).toContain("uis-text--muted");
  });
});
