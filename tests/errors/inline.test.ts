import { describe, it, expect } from "vitest";
import { renderInlineError } from "@/errors/render";

describe("renderInlineError", () => {
  it("renders component name and message", () => {
    const el = renderInlineError({
      kind: "component",
      componentType: "button",
      message: "label is required",
      path: "screen[0]",
    });
    expect(el.className).toContain("uis-error");
    expect(el.className).toContain("uis-error--inline");
    expect(el.textContent).toContain("button");
    expect(el.textContent).toContain("label is required");
  });

  it("includes typo suggestion when provided", () => {
    const el = renderInlineError({
      kind: "component",
      componentType: "butn",
      message: "unknown component",
      path: "screen[0]",
      suggestion: "button",
    });
    expect(el.textContent).toContain("button");
    expect(el.textContent).toContain("Did you mean");
  });
});
