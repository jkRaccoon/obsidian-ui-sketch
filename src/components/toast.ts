import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ToastSchema = BasePropsSchema.extend({
  message: z.string().optional(),
  severity: z.enum(["info", "warn", "error", "success"]).optional(),
}).passthrough();

export const ToastDef: ComponentDef = {
  type: "toast",
  schema: ToastSchema,
  render(props) {
    const severity = typeof props.severity === "string" ? props.severity : "info";
    const el = createDiv({ cls: `uis-toast uis-toast--${severity}` });
    el.createSpan({ cls: "uis-toast__message", text: typeof props.message === "string" ? props.message : "" });
    return el;
  },
};
