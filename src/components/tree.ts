import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

type TreeItem = { label?: string; children?: TreeItem[] };

const TreeItemSchema: z.ZodType<TreeItem> = z.lazy(() =>
  z
    .object({
      label: z.string().optional(),
      children: z.array(TreeItemSchema).optional(),
    })
    .passthrough(),
);

export const TreeSchema = BasePropsSchema.extend({
  items: z.array(TreeItemSchema).optional(),
}).passthrough();

function renderItem(item: TreeItem): HTMLElement {
  const el = createDiv({ cls: "uis-tree__node" });
  el.createSpan({ cls: "uis-tree__label", text: item.label ?? "" });
  if (Array.isArray(item.children) && item.children.length > 0) {
    const children = el.createDiv({ cls: "uis-tree__children" });
    for (const child of item.children) children.appendChild(renderItem(child));
  }
  return el;
}

export const TreeDef: ComponentDef = {
  type: "tree",
  schema: TreeSchema,
  render(props) {
    const el = createDiv({ cls: "uis-tree" });
    const items = Array.isArray(props.items) ? (props.items as TreeItem[]) : [];
    for (const item of items) el.appendChild(renderItem(item));
    return el;
  },
};
