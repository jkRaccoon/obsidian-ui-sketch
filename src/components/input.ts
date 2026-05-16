import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const InputSchema = BasePropsSchema.extend({
  placeholder: z.string().optional(),
  value: z.string().optional(),
}).passthrough();

export const InputDef: ComponentDef = {
  type: "input",
  schema: InputSchema,
  render(props) {
    const el = createDiv({ cls: "uis-input" });
    if (typeof props.value === "string" && props.value.length > 0) {
      el.createDiv({ cls: "uis-input__value", text: props.value });
    } else if (typeof props.placeholder === "string") {
      el.createDiv({ cls: "uis-input__placeholder", text: props.placeholder });
    }
    return el;
  },
};
