import { describe, it, expect } from "vitest";
import { parseDocument, ParseError } from "@/parser";

describe("parseDocument", () => {
  it("parses a minimal doc", () => {
    const out = parseDocument("viewport: desktop\nscreen:\n  - card: { title: Hi }\n");
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.doc.viewport).toBe("desktop");
    expect(Array.isArray(out.doc.screen)).toBe(true);
  });

  it("returns a parse error with line/col on malformed YAML", () => {
    const out = parseDocument("screen:\n  - button: label: Bad\n");
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.error.kind).toBe("yaml");
    expect(out.error.loc?.line).toBeGreaterThanOrEqual(1);
    expect(out.error.message.length).toBeGreaterThan(0);
  });

  it("treats empty input as empty doc", () => {
    const out = parseDocument("");
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.doc).toEqual({});
  });
});
