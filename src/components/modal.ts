import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ModalSchema = BasePropsSchema.extend({
  title: z.string().optional(),
  body: z.string().optional(),
}).passthrough();

export const ModalDef: ComponentDef = {
  type: "modal",
  schema: ModalSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-modal";
    if (typeof props.title === "string") {
      const t = document.createElement("div");
      t.className = "uis-modal__title";
      t.textContent = props.title;
      el.appendChild(t);
    }
    if (typeof props.body === "string") {
      const b = document.createElement("div");
      b.className = "uis-modal__body";
      b.textContent = props.body;
      el.appendChild(b);
    }
    return el;
  },
};
