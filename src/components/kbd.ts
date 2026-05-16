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
    const el = createSpan({ cls: "uis-kbd" });
    const keys = Array.isArray(props.keys) ? (props.keys as string[]) : [];
    keys.forEach((k, i) => {
      if (i > 0) {
        el.createSpan({ cls: "uis-kbd__plus", text: "+" });
      }
      el.createSpan({ cls: "uis-kbd__cap", text: k });
    });
    return el;
  },
};
