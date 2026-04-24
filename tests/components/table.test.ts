import { describe, it, expect } from "vitest";
import { TableDef } from "@/components/table";

describe("table", () => {
  it("renders columns as thead and rows as tbody", () => {
    const el = TableDef.render({ columns: ["A", "B"], rows: [["1", "2"], ["3", "4"]] }, {});
    expect(el.className).toContain("uis-table");
    expect(el.querySelectorAll("th").length).toBe(2);
    expect(el.querySelectorAll("tbody tr").length).toBe(2);
    expect(el.querySelectorAll("tbody td").length).toBe(4);
  });
});
