// src/components/sidebar.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const SidebarSchema = BasePropsSchema.extend({
  items: z.array(z.string()).optional(),
  active: z.union([z.string(), z.number()]).optional(),
}).passthrough();

export const SidebarDef: ComponentDef = {
  type: "sidebar",
  schema: SidebarSchema,
  render(props) {
    const el = createDiv({ cls: "uis-sidebar" });
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    const active = props.active;
    items.forEach((label, i) => {
      const cls = active === label || active === i
        ? "uis-sidebar__item uis-sidebar__item--active"
        : "uis-sidebar__item";
      el.createDiv({ cls, text: label });
    });
    return el;
  },
};
