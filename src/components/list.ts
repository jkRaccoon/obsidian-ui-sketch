import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ListSchema = BasePropsSchema.extend({
  items: z.array(z.string()).optional(),
  ordered: z.boolean().optional(),
}).passthrough();

export const ListDef: ComponentDef = {
  type: "list",
  schema: ListSchema,
  render(props) {
    const ordered = props.ordered === true;
    const el = createEl(ordered ? "ol" : "ul", { cls: "uis-list" });
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    for (const raw of items) {
      el.createEl("li", { text: String(raw) });
    }
    return el;
  },
};
