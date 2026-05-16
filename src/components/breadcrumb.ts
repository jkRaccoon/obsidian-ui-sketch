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
    const el = createDiv({ cls: "uis-breadcrumb" });
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    items.forEach((label, i) => {
      if (i > 0) {
        el.createSpan({ cls: "uis-breadcrumb__sep", text: "›" });
      }
      el.createSpan({ cls: "uis-breadcrumb__item", text: label });
    });
    return el;
  },
};
