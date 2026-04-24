import { describe, it, expect } from "vitest";
import { wrapWithAnnotation } from "@/renderer/annotation";

describe("wrapWithAnnotation", () => {
  it("returns element unchanged when no note", () => {
    const inner = document.createElement("span");
    expect(wrapWithAnnotation(inner, undefined)).toBe(inner);
  });
  it("adds title attribute and info dot", () => {
    const inner = document.createElement("span");
    const wrapped = wrapWithAnnotation(inner, "remember this");
    expect(wrapped).not.toBe(inner);
    expect(wrapped.getAttribute("title")).toBe("remember this");
    expect(wrapped.querySelector(".uis-note-dot")).not.toBeNull();
    expect(wrapped.contains(inner)).toBe(true);
  });
});
