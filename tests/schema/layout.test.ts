import { describe, it, expect } from "vitest";
import { parseLayoutArray } from "@/schema/layout";

describe("parseLayoutArray", () => {
  it("accepts a single component entry", () => {
    const out = parseLayoutArray([{ card: { title: "Hi" } }]);
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.nodes).toHaveLength(1);
    expect(out.nodes[0]).toMatchObject({ kind: "component", type: "card" });
  });

  it("accepts a row with two cols", () => {
    const out = parseLayoutArray([
      { row: { items: [ { col: { items: [ { card: { title: "A" } } ] } }, { col: { items: [ { card: { title: "B" } } ] } } ] } },
    ]);
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.nodes[0]).toMatchObject({ kind: "row" });
  });

  it("rejects an entry with multiple keys", () => {
    const out = parseLayoutArray([{ row: { items: [] }, col: { items: [] } }]);
    expect(out.ok).toBe(false);
  });

  it("rejects an entry with no keys", () => {
    const out = parseLayoutArray([{}]);
    expect(out.ok).toBe(false);
  });
});
