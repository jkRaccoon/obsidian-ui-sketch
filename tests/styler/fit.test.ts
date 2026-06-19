import { describe, it, expect } from "vitest";
import { wrapScaler, computeScale } from "@/styler/fit";
import type { ValidatedDoc } from "@/types";

const doc = (fit: "width" | "none"): ValidatedDoc => ({
  viewport: "desktop",
  theme: "adaptive",
  background: "default",
  fit,
  screen: [],
});

describe("wrapScaler", () => {
  it("wraps the frame in a scaler carrying data-fit", () => {
    const frame = document.createElement("div");
    frame.className = "uis-frame";
    const scaler = wrapScaler(frame, doc("width"));
    expect(scaler.className).toContain("uis-scaler");
    expect(scaler.getAttribute("data-fit")).toBe("width");
    expect(scaler.firstElementChild).toBe(frame);
  });

  it("reflects fit: none in data-fit", () => {
    const scaler = wrapScaler(document.createElement("div"), doc("none"));
    expect(scaler.getAttribute("data-fit")).toBe("none");
  });
});

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
