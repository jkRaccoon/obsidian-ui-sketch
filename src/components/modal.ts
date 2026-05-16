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
    const el = createDiv({ cls: "uis-modal" });
    if (typeof props.title === "string") {
      el.createDiv({ cls: "uis-modal__title", text: props.title });
    }
    if (typeof props.body === "string") {
      el.createDiv({ cls: "uis-modal__body", text: props.body });
    }
    return el;
  },
};
