import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const CheckboxSchema = BasePropsSchema.extend({
  label: z.string().optional(),
  checked: z.boolean().optional(),
}).passthrough();

export const CheckboxDef: ComponentDef = {
  type: "checkbox",
  schema: CheckboxSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-checkbox";
    if (props.checked === true) el.className += " uis-checkbox--checked";
    const box = document.createElement("span");
    box.className = "uis-checkbox__box";
    box.textContent = props.checked === true ? "✓" : "";
    el.appendChild(box);
    if (typeof props.label === "string") {
      const label = document.createElement("span");
      label.className = "uis-checkbox__label";
      label.textContent = props.label;
      el.appendChild(label);
    }
    return el;
  },
};
