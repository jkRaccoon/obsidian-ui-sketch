import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const SliderSchema = BasePropsSchema.extend({
  value: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
}).passthrough();

export const SliderDef: ComponentDef = {
  type: "slider",
  schema: SliderSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-slider";
    const min = typeof props.min === "number" ? props.min : 0;
    const max = typeof props.max === "number" ? props.max : 100;
    const value = typeof props.value === "number" ? props.value : min;
    const pct = max === min ? 0 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    const track = document.createElement("span");
    track.className = "uis-slider__track";
    el.appendChild(track);
    const thumb = document.createElement("span");
    thumb.className = "uis-slider__thumb";
    thumb.style.left = `${pct}%`;
    el.appendChild(thumb);
    return el;
  },
};
