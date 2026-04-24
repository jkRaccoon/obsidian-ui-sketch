import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const PanelSchema = BasePropsSchema.extend({
  header: z.string().optional(),
}).passthrough();

export const PanelDef: ComponentDef = {
  type: "panel",
  schema: PanelSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-panel";
    if (typeof props.header === "string") {
      const h = document.createElement("div");
      h.className = "uis-panel__header";
      h.textContent = props.header;
      el.appendChild(h);
    }
    return el;
  },
};
