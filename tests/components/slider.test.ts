import { describe, it, expect } from "vitest";
import { SliderDef } from "@/components/slider";

describe("slider", () => {
  it("renders track with thumb at value percent", () => {
    const el = SliderDef.render({ value: 30, min: 0, max: 100 }, {});
    expect(el.className).toContain("uis-slider");
    const thumb = el.querySelector(".uis-slider__thumb") as HTMLElement;
    expect(thumb.style.left).toBe("30%");
  });
});
