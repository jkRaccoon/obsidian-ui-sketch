import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";
import { initials } from "./avatar";

const NavChildSchema = z.union([
  z.string(),
  z
    .object({
      label: z.string().optional(),
      icon: z.string().optional(),
      active: z.boolean().optional(),
    })
    .passthrough(),
]);

const NavItemSchema = z.union([
  z.string(),
  z
    .object({
      label: z.string().optional(),
      icon: z.string().optional(),
      active: z.boolean().optional(),
      open: z.boolean().optional(),
      children: z.array(NavChildSchema).optional(),
    })
    .passthrough(),
]);

const NavActionSchema = z
  .object({
    icon: z.string().optional(),
    avatar: z.string().optional(),
    label: z.string().optional(),
  })
  .passthrough();

export const NavbarSchema = BasePropsSchema.extend({
  brand: z.string().optional(),
  items: z.array(NavItemSchema).optional(),
  actions: z.array(NavActionSchema).optional(),
}).passthrough();

type NavChild = string | { label?: string; icon?: string; active?: boolean };
type NavItem =
  | string
  | { label?: string; icon?: string; active?: boolean; open?: boolean; children?: NavChild[] };
type NavAction = { icon?: string; avatar?: string; label?: string };

function renderIcon(parent: HTMLElement, name: string, cls: string): void {
  parent.createSpan({ cls, text: name.length > 0 ? name[0] : "?" });
}

export const NavbarDef: ComponentDef = {
  type: "navbar",
  schema: NavbarSchema,
  render(props) {
    const actions = Array.isArray(props.actions) ? (props.actions as NavAction[]) : [];
    const hasActions = actions.length > 0;
    const el = createDiv({
      cls: hasActions ? "uis-navbar uis-navbar--has-actions" : "uis-navbar",
    });

    if (typeof props.brand === "string") {
      el.createDiv({ cls: "uis-navbar__brand", text: props.brand });
    }

    const items = Array.isArray(props.items) ? (props.items as NavItem[]) : [];
    const list = el.createDiv({ cls: "uis-navbar__items" });
    for (const item of items) {
      const label = typeof item === "string" ? item : (item.label ?? "");
      const isActive = typeof item === "object" && item.active === true;
      const hasChildren =
        typeof item === "object" && Array.isArray(item.children) && item.children.length > 0;
      const entry = list.createDiv({
        cls: isActive ? "uis-navbar__item uis-navbar__item--active" : "uis-navbar__item",
      });
      if (typeof item === "object" && typeof item.icon === "string") {
        renderIcon(entry, item.icon, "uis-navbar__icon");
      }
      entry.createSpan({ cls: "uis-navbar__label", text: label });
      if (hasChildren) {
        entry.createSpan({ cls: "uis-navbar__caret", text: "▾" });
      }
      // Statically render the expanded menu only when the author marks it open.
      if (hasChildren && typeof item === "object" && item.open === true) {
        const dropdown = entry.createDiv({ cls: "uis-navbar__dropdown" });
        for (const child of item.children as NavChild[]) {
          const childLabel = typeof child === "string" ? child : (child.label ?? "");
          const ddItem = dropdown.createDiv({ cls: "uis-navbar__dropdown-item" });
          if (typeof child === "object" && typeof child.icon === "string") {
            renderIcon(ddItem, child.icon, "uis-navbar__icon");
          }
          ddItem.createSpan({ cls: "uis-navbar__label", text: childLabel });
        }
      }
    }

    if (hasActions) {
      const actionsEl = el.createDiv({ cls: "uis-navbar__actions" });
      for (const action of actions) {
        if (typeof action.avatar === "string") {
          actionsEl.createDiv({
            cls: "uis-navbar__action-avatar",
            text: initials(action.avatar),
          });
        } else if (typeof action.icon === "string") {
          renderIcon(actionsEl, action.icon, "uis-navbar__action-icon");
        } else if (typeof action.label === "string") {
          actionsEl.createDiv({ cls: "uis-navbar__action-label", text: action.label });
        }
      }
    }

    return el;
  },
};
