import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const StepperSchema = BasePropsSchema.extend({
  items: z.array(z.string()).optional(),
  active: z.number().optional(),
}).passthrough();

export const StepperDef: ComponentDef = {
  type: "stepper",
  schema: StepperSchema,
  render(props) {
    const el = createDiv({ cls: "uis-stepper" });
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    const active = typeof props.active === "number" ? props.active : -1;
    items.forEach((label, i) => {
      const cls = i === active
        ? "uis-stepper__step uis-stepper__step--active"
        : "uis-stepper__step";
      const step = el.createDiv({ cls });
      step.createSpan({ cls: "uis-stepper__num", text: String(i + 1) });
      step.createSpan({ cls: "uis-stepper__label", text: label });
    });
    return el;
  },
};
