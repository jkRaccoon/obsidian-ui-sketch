import { describe, it, expect } from "vitest";
import { wrapWithAnnotation } from "@/renderer/annotation";

describe("wrapWithAnnotation", () => {
  it("returns element unchanged when no annotations", () => {
    const inner = document.createElement("span");
    expect(wrapWithAnnotation(inner, {})).toBe(inner);
  });

  it("adds title attribute and info dot for note", () => {
    const inner = document.createElement("span");
    const wrapped = wrapWithAnnotation(inner, { note: "remember this" });
    expect(wrapped).not.toBe(inner);
    expect(wrapped.getAttribute("title")).toBe("remember this");
    expect(wrapped.querySelector(".uis-note-dot")).not.toBeNull();
    expect(wrapped.contains(inner)).toBe(true);
  });

  it("pins a numbered marker badge for mark", () => {
    const inner = document.createElement("span");
    const wrapped = wrapWithAnnotation(inner, { mark: 2 });
    expect(wrapped).not.toBe(inner);
    const badge = wrapped.querySelector(".uis-marker--pin");
    expect(badge).not.toBeNull();
    expect(badge?.querySelector(".uis-marker__label")?.textContent).toBe("2");
    expect(wrapped.contains(inner)).toBe(true);
  });

  it("adds the hover tooltip from markText", () => {
    const inner = document.createElement("span");
    const wrapped = wrapWithAnnotation(inner, { mark: 1, markText: "destructive action" });
    expect(wrapped.querySelector(".uis-marker__tip")?.textContent).toBe("destructive action");
  });

  it("supports a string mark label", () => {
    const inner = document.createElement("span");
    const wrapped = wrapWithAnnotation(inner, { mark: "A" });
    expect(wrapped.querySelector(".uis-marker__label")?.textContent).toBe("A");
  });

  it("renders both note and mark together", () => {
    const inner = document.createElement("span");
    const wrapped = wrapWithAnnotation(inner, { note: "info", mark: 3 });
    expect(wrapped.querySelector(".uis-note-dot")).not.toBeNull();
    expect(wrapped.querySelector(".uis-marker--pin")).not.toBeNull();
  });
});
