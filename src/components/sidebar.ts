// src/components/sidebar.ts
import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

const SidebarChildSchema = z.union([
  z.string(),
  z
    .object({
      label: z.string().optional(),
      icon: z.string().optional(),
      active: z.boolean().optional(),
    })
    .passthrough(),
]);

const SidebarItemSchema = z.union([
  z.string(),
  z
    .object({
      section: z.string().optional(),
      label: z.string().optional(),
      icon: z.string().optional(),
      active: z.boolean().optional(),
      children: z.array(SidebarChildSchema).optional(),
    })
    .passthrough(),
]);

export const SidebarSchema = BasePropsSchema.extend({
  items: z.array(SidebarItemSchema).optional(),
  active: z.union([z.string(), z.number()]).optional(),
  collapsed: z.boolean().optional(),
}).passthrough();

type SidebarChild = string | { label?: string; icon?: string; active?: boolean };
type SidebarItem =
  | string
  | {
      section?: string;
      label?: string;
      icon?: string;
      active?: boolean;
      children?: SidebarChild[];
    };

function renderIcon(parent: HTMLElement, name: string): void {
  parent.createSpan({ cls: "uis-sidebar__icon", text: name.length > 0 ? name[0] : "?" });
}

export const SidebarDef: ComponentDef = {
  type: "sidebar",
  schema: SidebarSchema,
  render(props) {
    const collapsed = props.collapsed === true;
    const el = createDiv({
      cls: collapsed ? "uis-sidebar uis-sidebar--collapsed" : "uis-sidebar",
    });
    const items = Array.isArray(props.items) ? (props.items as SidebarItem[]) : [];
    const active = props.active;

    items.forEach((item, i) => {
      // Section header — a grouping label, not a clickable entry.
      if (item && typeof item === "object" && typeof item.section === "string") {
        el.createDiv({ cls: "uis-sidebar__section", text: item.section });
        return;
      }

      const label = typeof item === "string" ? item : (item.label ?? "");
      const isActive =
        (typeof item === "object" && item.active === true) ||
        active === label ||
        active === i;
      const row = el.createDiv({
        cls: isActive
          ? "uis-sidebar__item uis-sidebar__item--active"
          : "uis-sidebar__item",
      });
      if (typeof item === "object" && typeof item.icon === "string") {
        renderIcon(row, item.icon);
      }
      row.createSpan({ cls: "uis-sidebar__label", text: label });

      // One level of nesting — deeper trees are the `tree` component's job.
      if (typeof item === "object" && Array.isArray(item.children) && item.children.length > 0) {
        const childrenEl = el.createDiv({ cls: "uis-sidebar__children" });
        for (const child of item.children) {
          const childLabel = typeof child === "string" ? child : (child.label ?? "");
          const childActive = typeof child === "object" && child.active === true;
          const childRow = childrenEl.createDiv({
            cls: childActive
              ? "uis-sidebar__child uis-sidebar__child--active"
              : "uis-sidebar__child",
          });
          if (typeof child === "object" && typeof child.icon === "string") {
            renderIcon(childRow, child.icon);
          }
          childRow.createSpan({ cls: "uis-sidebar__label", text: childLabel });
        }
      }
    });
    return el;
  },
};
