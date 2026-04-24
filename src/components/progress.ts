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
    const el = document.createElement("div");
    el.className = "uis-progress";
    const raw = typeof props.value === "number" ? props.value : 0;
    const pct = Math.max(0, Math.min(100, raw));
    const track = document.createElement("div");
    track.className = "uis-progress__track";
    const fill = document.createElement("div");
    fill.className = "uis-progress__fill";
    fill.style.width = `${pct}%`;
    track.appendChild(fill);
    el.appendChild(track);
    if (typeof props.label === "string") {
      const lbl = document.createElement("div");
      lbl.className = "uis-progress__label";
      lbl.textContent = props.label;
      el.appendChild(lbl);
    }
    return el;
  },
};
