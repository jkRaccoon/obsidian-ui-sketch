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
    const el = document.createElement("div");
    const severity = typeof props.severity === "string" ? props.severity : "info";
    el.className = `uis-toast uis-toast--${severity}`;
    const msg = document.createElement("span");
    msg.className = "uis-toast__message";
    msg.textContent = typeof props.message === "string" ? props.message : "";
    el.appendChild(msg);
    return el;
  },
};
