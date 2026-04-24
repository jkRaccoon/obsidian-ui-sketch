import { describe, it, expect } from "vitest";
import { HeadingDef } from "@/components/heading";

describe("heading", () => {
  it("renders heading with level 1 by default", () => {
    const el = HeadingDef.render({ text: "Title" }, {});
    expect(el.className).toContain("uis-heading");
    expect(el.className).toContain("uis-heading--h1");
    expect(el.textContent).toBe("Title");
  });
  it("clamps level to 1..6", () => {
    const el = HeadingDef.render({ text: "x", level: 9 }, {});
    expect(el.className).toContain("uis-heading--h6");
  });
});
