import { describe, it, expect } from "vitest";
import { parseDocument } from "@/parser";

describe("parseDocument edge cases", () => {
  it("handles whitespace-only input", () => {
    const out = parseDocument("   \n\t\n  ");
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.doc).toEqual({});
  });

  it("handles null document", () => {
    const out = parseDocument("null");
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.doc).toEqual({});
  });

  it("rejects array at top level", () => {
    const out = parseDocument("- item1\n- item2");
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.error.message).toContain("mapping");
    expect(out.error.loc).toEqual({ line: 1, col: 1 });
  });

  it("rejects scalar at top level", () => {
    const out = parseDocument("hello world");
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.error.message).toContain("mapping");
  });
});
