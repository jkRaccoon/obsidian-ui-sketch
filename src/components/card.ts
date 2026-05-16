import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const CardSchema = BasePropsSchema.extend({
  title: z.string().optional().describe("Card heading"),
  body: z.string().optional().describe("Card body text"),
}).passthrough();

export const CardDef: ComponentDef = {
  type: "card",
  schema: CardSchema,
  render(props) {
    const el = createDiv({ cls: "uis-card" });
    if (typeof props.title === "string") {
      el.createDiv({ cls: "uis-card__title", text: props.title });
    }
    if (typeof props.body === "string") {
      el.createDiv({ cls: "uis-card__body", text: props.body });
    }
    return el;
  },
};
