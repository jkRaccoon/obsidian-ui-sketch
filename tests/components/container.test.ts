import { describe, it, expect } from "vitest";
import { ContainerDef } from "@/components/container";

describe("container", () => {
  it("renders a div with the correct class", () => {
    const el = ContainerDef.render({}, {});
    expect(el.tagName).toBe("DIV");
    expect(el.className).toContain("uis-container");
  });
  it("applies padding when pad is given", () => {
    const el = ContainerDef.render({ pad: 16 }, {});
    expect((el as HTMLElement).style.padding).toBe("16px");
  });
});
