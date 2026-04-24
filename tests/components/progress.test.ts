import { describe, it, expect } from "vitest";
import { ProgressDef } from "@/components/progress";

describe("progress", () => {
  it("renders a bar with fill width", () => {
    const el = ProgressDef.render({ value: 40 }, {});
    expect(el.className).toContain("uis-progress");
    const fill = el.querySelector(".uis-progress__fill") as HTMLElement;
    expect(fill.style.width).toBe("40%");
  });
});
