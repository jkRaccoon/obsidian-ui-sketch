import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const BreadcrumbSchema = BasePropsSchema.extend({
  items: z.array(z.string()).optional(),
}).passthrough();

export const BreadcrumbDef: ComponentDef = {
  type: "breadcrumb",
  schema: BreadcrumbSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-breadcrumb";
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    items.forEach((label, i) => {
      if (i > 0) {
        const sep = document.createElement("span");
        sep.className = "uis-breadcrumb__sep";
        sep.textContent = "›";
        el.appendChild(sep);
      }
      const item = document.createElement("span");
      item.className = "uis-breadcrumb__item";
      item.textContent = label;
      el.appendChild(item);
    });
    return el;
  },
};
