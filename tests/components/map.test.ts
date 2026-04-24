import { describe, it, expect } from "vitest";
import { MapDef } from "@/components/map";

describe("map", () => {
  it("renders a MAP placeholder", () => {
    const el = MapDef.render({}, {});
    expect(el.className).toContain("uis-map");
    expect(el.textContent).toContain("MAP");
  });
});
