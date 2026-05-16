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
    const el = createDiv({ cls: "uis-panel" });
    if (typeof props.header === "string") {
      el.createDiv({ cls: "uis-panel__header", text: props.header });
    }
    return el;
  },
};
