import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const KvListSchema = BasePropsSchema.extend({
  items: z.array(z.tuple([z.string(), z.string()])).optional(),
}).passthrough();

export const KvListDef: ComponentDef = {
  type: "kv-list",
  schema: KvListSchema,
  render(props) {
    const el = createDiv({ cls: "uis-kv" });
    const items = Array.isArray(props.items) ? (props.items as [string, string][]) : [];
    for (const [k, v] of items) {
      const row = el.createDiv({ cls: "uis-kv__row" });
      row.createSpan({ cls: "uis-kv__key", text: k });
      row.createSpan({ cls: "uis-kv__val", text: v });
    }
    return el;
  },
};
