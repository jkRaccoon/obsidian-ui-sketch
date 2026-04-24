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
    const el = document.createElement("div");
    el.className = "uis-sidebar";
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    const active = props.active;
    items.forEach((label, i) => {
      const item = document.createElement("div");
      item.className = "uis-sidebar__item";
      if (active === label || active === i) item.className += " uis-sidebar__item--active";
      item.textContent = label;
      el.appendChild(item);
    });
    return el;
  },
};
