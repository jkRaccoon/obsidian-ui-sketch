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
    const el = document.createElement("div");
    el.className = "uis-tabs";
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    const active = props.active;
    items.forEach((label, i) => {
      const tab = document.createElement("div");
      tab.className = "uis-tabs__item";
      if (active === label || active === i) tab.className += " uis-tabs__item--active";
      tab.textContent = label;
      el.appendChild(tab);
    });
    return el;
  },
};
