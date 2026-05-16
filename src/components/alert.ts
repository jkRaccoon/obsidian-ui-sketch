import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const AlertSchema = BasePropsSchema.extend({
  title: z.string().optional(),
  message: z.string().optional(),
  severity: z.enum(["info", "warn", "error", "success"]).optional(),
}).passthrough();

export const AlertDef: ComponentDef = {
  type: "alert",
  schema: AlertSchema,
  render(props) {
    const severity = typeof props.severity === "string" ? props.severity : "info";
    const el = createDiv({ cls: `uis-alert uis-alert--${severity}` });
    if (typeof props.title === "string") {
      el.createDiv({ cls: "uis-alert__title", text: props.title });
    }
    if (typeof props.message === "string") {
      el.createDiv({ cls: "uis-alert__message", text: props.message });
    }
    return el;
  },
};
