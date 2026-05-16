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
    const el = createDiv({ cls: "uis-navbar" });
    if (typeof props.brand === "string") {
      el.createDiv({ cls: "uis-navbar__brand", text: props.brand });
    }
    const items = Array.isArray(props.items) ? props.items : [];
    const list = el.createDiv({ cls: "uis-navbar__items" });
    for (const raw of items) {
      const label = typeof raw === "string" ? raw : "";
      list.createDiv({ cls: "uis-navbar__item", text: label });
    }
    return el;
  },
};
