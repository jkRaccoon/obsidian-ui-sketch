import { describe, it, expect } from "vitest";
import { countAndCheckDepth, MAX_DEPTH, MAX_NODES } from "@/renderer/safety";

describe("countAndCheckDepth", () => {
  it("passes a shallow tree", () => {
    const r = countAndCheckDepth({ a: [1, 2, 3] });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.count).toBeGreaterThan(0);
  });

  it("rejects a tree exceeding MAX_DEPTH", () => {
    let deep: any = "leaf";
    for (let i = 0; i < MAX_DEPTH + 2; i++) deep = { nested: deep };
    const r = countAndCheckDepth(deep);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toBe("depth");
  });

  it("rejects a tree exceeding MAX_NODES", () => {
    const big: any[] = Array.from({ length: MAX_NODES + 10 }, (_, i) => i);
    const r = countAndCheckDepth(big);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toBe("count");
  });
});
