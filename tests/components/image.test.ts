import { describe, it, expect } from "vitest";
import { ImageDef } from "@/components/image";

describe("image", () => {
  it("renders a placeholder with alt text", () => {
    const el = ImageDef.render({ alt: "Hero photo" }, {});
    expect(el.className).toContain("uis-image");
    expect(el.textContent).toContain("Hero photo");
  });
  it("shows IMG label when no alt", () => {
    const el = ImageDef.render({}, {});
    expect(el.textContent).toContain("IMG");
  });
});
