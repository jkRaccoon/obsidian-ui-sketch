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
    const el = document.createElement("div");
    el.className = "uis-input";
    if (typeof props.value === "string" && props.value.length > 0) {
      const v = document.createElement("div");
      v.className = "uis-input__value";
      v.textContent = props.value;
      el.appendChild(v);
    } else if (typeof props.placeholder === "string") {
      const p = document.createElement("div");
      p.className = "uis-input__placeholder";
      p.textContent = props.placeholder;
      el.appendChild(p);
    }
    return el;
  },
};
