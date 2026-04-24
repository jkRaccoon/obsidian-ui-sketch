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
    const el = document.createElement("div");
    el.className = "uis-stepper";
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    const active = typeof props.active === "number" ? props.active : -1;
    items.forEach((label, i) => {
      const step = document.createElement("div");
      step.className = "uis-stepper__step";
      if (i === active) step.className += " uis-stepper__step--active";
      const circle = document.createElement("span");
      circle.className = "uis-stepper__num";
      circle.textContent = String(i + 1);
      step.appendChild(circle);
      const text = document.createElement("span");
      text.className = "uis-stepper__label";
      text.textContent = label;
      step.appendChild(text);
      el.appendChild(step);
    });
    return el;
  },
};
