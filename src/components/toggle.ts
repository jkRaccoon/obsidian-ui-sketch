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
    const el = createDiv({ cls: "uis-toggle" });
    if (props.on === true) el.className += " uis-toggle--on";
    const track = el.createSpan({ cls: "uis-toggle__track" });
    track.createSpan({ cls: "uis-toggle__thumb" });
    if (typeof props.label === "string") {
      el.createSpan({ cls: "uis-toggle__label", text: props.label });
    }
    return el;
  },
};
