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
      // key/val sit directly in the 2-col grid — no wrapper row, so we avoid
      // `display: contents` (only partially supported on older Obsidian/Electron).
      el.createSpan({ cls: "uis-kv__key", text: k });
      el.createSpan({ cls: "uis-kv__val", text: v });
    }
    return el;
  },
};
