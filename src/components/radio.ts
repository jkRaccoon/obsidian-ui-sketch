import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const RadioSchema = BasePropsSchema.extend({
  label: z.string().optional(),
  selected: z.boolean().optional(),
}).passthrough();

export const RadioDef: ComponentDef = {
  type: "radio",
  schema: RadioSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-radio";
    if (props.selected === true) el.className += " uis-radio--selected";
    const circle = document.createElement("span");
    circle.className = "uis-radio__circle";
    el.appendChild(circle);
    if (typeof props.label === "string") {
      const label = document.createElement("span");
      label.className = "uis-radio__label";
      label.textContent = props.label;
      el.appendChild(label);
    }
    return el;
  },
};
