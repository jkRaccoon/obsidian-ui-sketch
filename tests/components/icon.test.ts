import { describe, it, expect } from "vitest";
import { IconDef } from "@/components/icon";

describe("icon", () => {
  it("renders name-initial circle when icon name given", () => {
    const el = IconDef.render({ name: "lock", size: 20 }, {}) as HTMLElement;
    expect(el.className).toContain("uis-icon");
    expect(el.textContent).toBe("l");
    expect(el.style.width).toBe("20px");
  });
  it("falls back to ? when no name", () => {
    const el = IconDef.render({}, {});
    expect(el.textContent).toBe("?");
  });
});
