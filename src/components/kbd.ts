import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const KbdSchema = BasePropsSchema.extend({
  keys: z.array(z.string()).optional(),
}).passthrough();

export const KbdDef: ComponentDef = {
  type: "kbd",
  schema: KbdSchema,
  render(props) {
    const el = document.createElement("span");
    el.className = "uis-kbd";
    const keys = Array.isArray(props.keys) ? (props.keys as string[]) : [];
    keys.forEach((k, i) => {
      if (i > 0) {
        const plus = document.createElement("span");
        plus.className = "uis-kbd__plus";
        plus.textContent = "+";
        el.appendChild(plus);
      }
      const cap = document.createElement("span");
      cap.className = "uis-kbd__cap";
      cap.textContent = k;
      el.appendChild(cap);
    });
    return el;
  },
};
