// tests/schema/document.test.ts
import { describe, it, expect } from "vitest";
import { validate } from "@/schema";

describe("validate", () => {
  it("fills defaults on minimal input", () => {
    const out = validate({ screen: [] });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.doc.viewport).toBe("desktop");
    expect(out.doc.theme).toBe("adaptive");
    expect(out.doc.background).toBe("default");
  });

  it("rejects missing screen", () => {
    const out = validate({});
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.error.kind).toBe("structure");
  });

  it("rejects unknown viewport", () => {
    const out = validate({ viewport: "wide", screen: [] });
    expect(out.ok).toBe(false);
  });

  it("requires width/height for viewport=custom", () => {
    const out = validate({ viewport: "custom", screen: [] });
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.error.message).toContain("width");
  });

  it("accepts grid at root", () => {
    const out = validate({
      screen: { grid: { areas: ["a b"], map: { a: { card: {} }, b: { text: { value: "hi" } } } } },
    });
    expect(out.ok).toBe(true);
  });
});
