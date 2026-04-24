import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const SelectSchema = BasePropsSchema.extend({
  placeholder: z.string().optional(),
  value: z.string().optional(),
  options: z.array(z.string()).optional(),
}).passthrough();

export const SelectDef: ComponentDef = {
  type: "select",
  schema: SelectSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-select";
    const label = document.createElement("div");
    label.className = "uis-select__label";
    if (typeof props.value === "string" && props.value.length > 0) {
      label.textContent = props.value;
    } else if (typeof props.placeholder === "string") {
      label.className += " uis-select__placeholder";
      label.textContent = props.placeholder;
    }
    el.appendChild(label);
    const chevron = document.createElement("span");
    chevron.className = "uis-select__chevron";
    chevron.textContent = "▼";
    el.appendChild(chevron);
    return el;
  },
};
