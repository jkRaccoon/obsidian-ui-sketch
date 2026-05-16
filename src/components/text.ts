import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const TextSchema = BasePropsSchema.extend({
  value: z.string().optional(),
  tone: z.enum(["muted", "strong", "accent"]).optional(),
}).passthrough();

const TONES = new Set(["muted", "strong", "accent"]);

export const TextDef: ComponentDef = {
  type: "text",
  schema: TextSchema,
  render(props) {
    const el = createDiv({
      cls: "uis-text",
      text: typeof props.value === "string" ? props.value : "",
    });
    if (typeof props.tone === "string" && TONES.has(props.tone)) {
      el.className += ` uis-text--${props.tone}`;
    }
    return el;
  },
};
