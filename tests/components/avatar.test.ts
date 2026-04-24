import { describe, it, expect } from "vitest";
import { AvatarDef } from "@/components/avatar";

describe("avatar", () => {
  it("shows initials from name", () => {
    const el = AvatarDef.render({ name: "Ji Kwang" }, {});
    expect(el.className).toContain("uis-avatar");
    expect(el.textContent).toBe("JK");
  });
  it("uses single initial when name is one word", () => {
    const el = AvatarDef.render({ name: "Solo" }, {});
    expect(el.textContent).toBe("S");
  });
});
