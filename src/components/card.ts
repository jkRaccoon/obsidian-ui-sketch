import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const CardSchema = BasePropsSchema.extend({
  title: z.string().optional(),
  body: z.string().optional(),
}).passthrough();

export const CardDef: ComponentDef = {
  type: "card",
  schema: CardSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-card";
    if (typeof props.title === "string") {
      const t = document.createElement("div");
      t.className = "uis-card__title";
      t.textContent = props.title;
      el.appendChild(t);
    }
    if (typeof props.body === "string") {
      const b = document.createElement("div");
      b.className = "uis-card__body";
      b.textContent = props.body;
      el.appendChild(b);
    }
    return el;
  },
};
