import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const DatePickerSchema = BasePropsSchema.extend({
  value: z.string().optional(),
  placeholder: z.string().optional(),
}).passthrough();

export const DatePickerDef: ComponentDef = {
  type: "date-picker",
  schema: DatePickerSchema,
  render(props) {
    const el = createDiv({ cls: "uis-date-picker" });
    el.createSpan({ cls: "uis-date-picker__icon", text: "📅" });
    const label = el.createSpan({ cls: "uis-date-picker__label" });
    if (typeof props.value === "string" && props.value.length > 0) {
      label.textContent = props.value;
    } else if (typeof props.placeholder === "string") {
      label.className += " uis-date-picker__placeholder";
      label.textContent = props.placeholder;
    }
    return el;
  },
};
