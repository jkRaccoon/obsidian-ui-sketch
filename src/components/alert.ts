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
    const el = document.createElement("div");
    const severity = typeof props.severity === "string" ? props.severity : "info";
    el.className = `uis-alert uis-alert--${severity}`;
    if (typeof props.title === "string") {
      const t = document.createElement("div");
      t.className = "uis-alert__title";
      t.textContent = props.title;
      el.appendChild(t);
    }
    if (typeof props.message === "string") {
      const m = document.createElement("div");
      m.className = "uis-alert__message";
      m.textContent = props.message;
      el.appendChild(m);
    }
    return el;
  },
};
