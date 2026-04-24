import { describe, it, expect } from "vitest";
import { StepperDef } from "@/components/stepper";

describe("stepper", () => {
  it("renders numbered steps with active marker", () => {
    const el = StepperDef.render({ items: ["Login", "Plan", "Confirm"], active: 1 }, {});
    expect(el.className).toContain("uis-stepper");
    const steps = el.querySelectorAll(".uis-stepper__step");
    expect(steps.length).toBe(3);
    expect((steps[1] as HTMLElement).className).toContain("uis-stepper__step--active");
  });
});
