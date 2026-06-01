import { describe, it, expect } from "vitest";
import { KvListDef } from "@/components/kv-list";

describe("kv-list", () => {
  it("renders key-value pairs as direct grid cells (no display:contents wrapper)", () => {
    const el = KvListDef.render({ items: [["Name", "Ada"], ["Role", "Engineer"]] }, {});
    expect(el.className).toContain("uis-kv");
    expect(el.querySelector(".uis-kv__row")).toBeNull();
    const keys = el.querySelectorAll(".uis-kv__key");
    const vals = el.querySelectorAll(".uis-kv__val");
    expect(keys.length).toBe(2);
    expect(vals.length).toBe(2);
    expect(keys[0].textContent).toBe("Name");
    expect(vals[1].textContent).toBe("Engineer");
  });
});
