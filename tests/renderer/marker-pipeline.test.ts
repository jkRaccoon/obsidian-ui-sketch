import { describe, it, expect } from "vitest";
import { renderSource } from "@/renderer";
import { installBuiltinComponents } from "@/components";

installBuiltinComponents();

// Regression: the parser runs YAML 1.1, where the plain scalar `n` resolves to
// boolean `false`. The label prop is therefore `num`, and these end-to-end
// renders guard the full parse → schema → render path (a unit test on
// MarkerDef.render alone would not catch a YAML-keyword collision).
describe("marker through renderSource", () => {
  function markers(src: string): HTMLElement[] {
    const root = renderSource(src);
    return Array.from(root.querySelectorAll<HTMLElement>(".uis-marker"));
  }

  it("keeps a numeric label through the YAML 1.1 parse", () => {
    const [m] = markers(`viewport: desktop
screen:
  - marker: { num: 1, text: "auto-saves", variant: danger }`);
    expect(m.querySelector(".uis-marker__label")?.textContent).toBe("1");
    expect(m.className).toContain("uis-marker--danger");
    expect(m.querySelector(".uis-marker__tip")?.textContent).toBe("auto-saves");
  });

  it("keeps a string label", () => {
    const [m] = markers(`viewport: desktop
screen:
  - marker: { num: "A" }`);
    expect(m.querySelector(".uis-marker__label")?.textContent).toBe("A");
  });

  it("pins a mark overlay from the base prop onto any component", () => {
    const root = renderSource(`viewport: desktop
screen:
  - button: { label: "Delete", mark: 3, markText: "soft-delete" }`);
    const pin = root.querySelector<HTMLElement>(".uis-marker--pin");
    expect(pin).not.toBeNull();
    expect(pin?.querySelector(".uis-marker__label")?.textContent).toBe("3");
    expect(pin?.querySelector(".uis-marker__tip")?.textContent).toBe("soft-delete");
  });
});
