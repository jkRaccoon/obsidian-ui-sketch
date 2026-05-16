import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ProgressSchema = BasePropsSchema.extend({
  value: z.number().optional(),
  label: z.string().optional(),
}).passthrough();

export const ProgressDef: ComponentDef = {
  type: "progress",
  schema: ProgressSchema,
  render(props) {
    const el = createDiv({ cls: "uis-progress" });
    const raw = typeof props.value === "number" ? props.value : 0;
    const pct = Math.max(0, Math.min(100, raw));
    const track = el.createDiv({ cls: "uis-progress__track" });
    const fill = track.createDiv({ cls: "uis-progress__fill" });
    fill.style.width = `${pct}%`;
    if (typeof props.label === "string") {
      el.createDiv({ cls: "uis-progress__label", text: props.label });
    }
    return el;
  },
};
