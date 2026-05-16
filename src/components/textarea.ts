import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const TextareaSchema = BasePropsSchema.extend({
  placeholder: z.string().optional(),
  value: z.string().optional(),
  rows: z.number().optional(),
}).passthrough();

export const TextareaDef: ComponentDef = {
  type: "textarea",
  schema: TextareaSchema,
  render(props) {
    const el = createDiv({ cls: "uis-textarea" });
    const rows = typeof props.rows === "number" ? props.rows : 3;
    el.style.minHeight = `${rows * 18 + 16}px`;
    if (typeof props.value === "string" && props.value.length > 0) {
      el.createDiv({ cls: "uis-textarea__value", text: props.value });
    } else if (typeof props.placeholder === "string") {
      el.createDiv({ cls: "uis-textarea__placeholder", text: props.placeholder });
    }
    return el;
  },
};
