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
    const el = document.createElement("div");
    el.className = "uis-kv";
    const items = Array.isArray(props.items) ? (props.items as [string, string][]) : [];
    for (const [k, v] of items) {
      const row = document.createElement("div");
      row.className = "uis-kv__row";
      const key = document.createElement("span");
      key.className = "uis-kv__key";
      key.textContent = k;
      row.appendChild(key);
      const val = document.createElement("span");
      val.className = "uis-kv__val";
      val.textContent = v;
      row.appendChild(val);
      el.appendChild(row);
    }
    return el;
  },
};
