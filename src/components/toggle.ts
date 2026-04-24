import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ToggleSchema = BasePropsSchema.extend({
  label: z.string().optional(),
  on: z.boolean().optional(),
}).passthrough();

export const ToggleDef: ComponentDef = {
  type: "toggle",
  schema: ToggleSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-toggle";
    if (props.on === true) el.className += " uis-toggle--on";
    const track = document.createElement("span");
    track.className = "uis-toggle__track";
    const thumb = document.createElement("span");
    thumb.className = "uis-toggle__thumb";
    track.appendChild(thumb);
    el.appendChild(track);
    if (typeof props.label === "string") {
      const lbl = document.createElement("span");
      lbl.className = "uis-toggle__label";
      lbl.textContent = props.label;
      el.appendChild(lbl);
    }
    return el;
  },
};
