import { describe, it, expect } from "vitest";
import { RawDef } from "@/components/raw";

describe("raw", () => {
  it("renders sanitized html", () => {
    const el = RawDef.render({ html: "<b>bold</b><script>alert(1)</script>" }, {});
    expect(el.className).toContain("uis-raw");
    expect(el.innerHTML).toContain("<b>bold</b>");
    expect(el.innerHTML).not.toContain("<script>");
  });
  it("renders plain text when no html", () => {
    const el = RawDef.render({ text: "hello" }, {});
    expect(el.textContent).toBe("hello");
  });
});
