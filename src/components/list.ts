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
    const el = document.createElement(ordered ? "ol" : "ul");
    el.className = "uis-list";
    const items = Array.isArray(props.items) ? (props.items as string[]) : [];
    for (const raw of items) {
      const li = document.createElement("li");
      li.textContent = String(raw);
      el.appendChild(li);
    }
    return el;
  },
};
