import { describe, it, expect } from "vitest";
import { ChartDef } from "@/components/chart";

describe("chart", () => {
  it("renders placeholder with chart kind label", () => {
    const el = ChartDef.render({ kind: "bar", label: "Sales" }, {});
    expect(el.className).toContain("uis-chart");
    expect(el.className).toContain("uis-chart--bar");
    expect(el.textContent).toContain("BAR CHART");
    expect(el.textContent).toContain("Sales");
  });
});
