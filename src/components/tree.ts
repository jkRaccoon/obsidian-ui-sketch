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
  const el = document.createElement("div");
  el.className = "uis-tree__node";
  const label = document.createElement("span");
  label.className = "uis-tree__label";
  label.textContent = item.label ?? "";
  el.appendChild(label);
  if (Array.isArray(item.children) && item.children.length > 0) {
    const children = document.createElement("div");
    children.className = "uis-tree__children";
    for (const child of item.children) children.appendChild(renderItem(child));
    el.appendChild(children);
  }
  return el;
}

export const TreeDef: ComponentDef = {
  type: "tree",
  schema: TreeSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-tree";
    const items = Array.isArray(props.items) ? (props.items as TreeItem[]) : [];
    for (const item of items) el.appendChild(renderItem(item));
    return el;
  },
};
