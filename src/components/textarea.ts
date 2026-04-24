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
    const el = document.createElement("div");
    el.className = "uis-textarea";
    const rows = typeof props.rows === "number" ? props.rows : 3;
    el.style.minHeight = `${rows * 18 + 16}px`;
    if (typeof props.value === "string" && props.value.length > 0) {
      const v = document.createElement("div");
      v.className = "uis-textarea__value";
      v.textContent = props.value;
      el.appendChild(v);
    } else if (typeof props.placeholder === "string") {
      const p = document.createElement("div");
      p.className = "uis-textarea__placeholder";
      p.textContent = props.placeholder;
      el.appendChild(p);
    }
    return el;
  },
};
