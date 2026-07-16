import { describe, it, expect } from "vitest";
import { ContainerDef } from "@/components/container";

describe("container", () => {
  it("renders a div with the correct class", () => {
    const el = ContainerDef.render({}, {});
    expect(el.tagName).toBe("DIV");
    expect(el.className).toContain("uis-container");
  });
  // `pad` is a base prop the renderer applies to every component, so it is
  // covered end-to-end in tests/renderer/base-layout.test.ts rather than here.
});
