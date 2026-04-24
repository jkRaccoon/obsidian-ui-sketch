import { describe, it, expect } from "vitest";
import { KvListDef } from "@/components/kv-list";

describe("kv-list", () => {
  it("renders key-value pairs", () => {
    const el = KvListDef.render({ items: [["Name", "Ada"], ["Role", "Engineer"]] }, {});
    expect(el.className).toContain("uis-kv");
    const rows = el.querySelectorAll(".uis-kv__row");
    expect(rows.length).toBe(2);
    expect(el.querySelector(".uis-kv__key")?.textContent).toBe("Name");
  });
});
