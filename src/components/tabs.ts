import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const TabsSchema = BasePropsSchema.extend({
  items: z.array(z.string()).optional(),
  active: z.union([z.string(), z.number()]).optional(),
}).passthrough();

export const TabsDef: ComponentDef = {
  type: "tabs",
  schema: TabsSchema,
  render(props) {
    const el = createDiv({ cls: "uis-tabs" });
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    const active = props.active;
    items.forEach((label, i) => {
      const cls = active === label || active === i
        ? "uis-tabs__item uis-tabs__item--active"
        : "uis-tabs__item";
      el.createDiv({ cls, text: label });
    });
    return el;
  },
};
