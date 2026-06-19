import { describe, it, expect } from "vitest";
import { computeScale } from "@/styler/fit";

describe("computeScale", () => {
  it("shrinks when container is narrower than frame", () => {
    expect(computeScale(600, 1200)).toBe(0.5);
  });
  it("does not upscale when container is wider than frame", () => {
    expect(computeScale(1000, 375)).toBe(1);
  });
  it("returns 1 when widths are equal", () => {
    expect(computeScale(768, 768)).toBe(1);
  });
  it("guards against zero/negative widths", () => {
    expect(computeScale(0, 1200)).toBe(1);
    expect(computeScale(600, 0)).toBe(1);
    expect(computeScale(-50, 1200)).toBe(1);
  });
});
