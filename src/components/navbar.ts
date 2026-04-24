import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const NavbarSchema = BasePropsSchema.extend({
  brand: z.string().optional(),
  items: z.array(z.string()).optional(),
}).passthrough();

export const NavbarDef: ComponentDef = {
  type: "navbar",
  schema: NavbarSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-navbar";
    if (typeof props.brand === "string") {
      const b = document.createElement("div");
      b.className = "uis-navbar__brand";
      b.textContent = props.brand;
      el.appendChild(b);
    }
    const items = Array.isArray(props.items) ? props.items : [];
    const list = document.createElement("div");
    list.className = "uis-navbar__items";
    for (const raw of items) {
      const label = typeof raw === "string" ? raw : "";
      const item = document.createElement("div");
      item.className = "uis-navbar__item";
      item.textContent = label;
      list.appendChild(item);
    }
    el.appendChild(list);
    return el;
  },
};
