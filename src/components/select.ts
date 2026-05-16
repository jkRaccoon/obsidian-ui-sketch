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
    const el = createDiv({ cls: "uis-select" });
    const label = el.createDiv({ cls: "uis-select__label" });
    if (typeof props.value === "string" && props.value.length > 0) {
      label.textContent = props.value;
    } else if (typeof props.placeholder === "string") {
      label.className += " uis-select__placeholder";
      label.textContent = props.placeholder;
    }
    el.createSpan({ cls: "uis-select__chevron", text: "▼" });
    return el;
  },
};
