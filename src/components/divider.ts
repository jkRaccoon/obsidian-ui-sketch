import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const DividerSchema = BasePropsSchema.extend({
  orientation: z.enum(["horizontal", "vertical"]).optional(),
}).passthrough();

export const DividerDef: ComponentDef = {
  type: "divider",
  schema: DividerSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-divider";
    if (props.orientation === "vertical") el.className += " uis-divider--vertical";
    return el;
  },
};
