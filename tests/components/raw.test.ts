import { describe, it, expect } from "vitest";
import { RawDef } from "@/components/raw";

describe("raw", () => {
  it("renders sanitized html", () => {
    const el = RawDef.render({ html: "<b>bold</b><script>alert(1)</script>" }, {});
    expect(el.className).toContain("uis-raw");
    expect(el.innerHTML).toContain("<b>bold</b>");
    expect(el.innerHTML).not.toContain("<script>");
  });
  it("strips xmp-wrapped script (GHSA-rpr9-rxv7-x643)", () => {
    const el = RawDef.render({ html: "<xmp><script>alert(1)</script></xmp>" }, {});
    expect(el.querySelector("script")).toBeNull();
    expect(el.innerHTML).not.toContain("<script");
  });
  it("renders plain text when no html", () => {
    const el = RawDef.render({ text: "hello" }, {});
    expect(el.textContent).toBe("hello");
  });
});
