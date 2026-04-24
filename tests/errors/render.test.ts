import { describe, it, expect } from "vitest";
import { renderErrorBox, renderEmptyPlaceholder } from "@/errors/render";

describe("renderErrorBox", () => {
  it("renders YAML parse error with line/col", () => {
    const el = renderErrorBox({ kind: "yaml", message: "bad", loc: { line: 3, col: 5 } });
    expect(el.className).toContain("uis-error");
    expect(el.textContent).toContain("YAML");
    expect(el.textContent).toContain("line 3");
  });
  it("renders structure error with path", () => {
    const el = renderErrorBox({ kind: "structure", message: "screen required", path: "screen" });
    expect(el.textContent).toContain("screen required");
    expect(el.textContent).toContain("screen");
  });
});

describe("renderEmptyPlaceholder", () => {
  it("renders a hint box", () => {
    const el = renderEmptyPlaceholder();
    expect(el.className).toContain("uis-empty");
    expect(el.textContent).toContain("viewport");
  });
});
