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
    const el = createDiv({ cls: "uis-checkbox" });
    if (props.checked === true) el.className += " uis-checkbox--checked";
    el.createSpan({ cls: "uis-checkbox__box", text: props.checked === true ? "✓" : "" });
    if (typeof props.label === "string") {
      el.createSpan({ cls: "uis-checkbox__label", text: props.label });
    }
    return el;
  },
};
