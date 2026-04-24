import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ChartSchema = BasePropsSchema.extend({
  kind: z.enum(["bar", "line", "pie"]).optional(),
  label: z.string().optional(),
}).passthrough();

export const ChartDef: ComponentDef = {
  type: "chart",
  schema: ChartSchema,
  render(props) {
    const kind = typeof props.kind === "string" ? props.kind : "bar";
    const el = document.createElement("div");
    el.className = `uis-chart uis-chart--${kind}`;
    const badge = document.createElement("div");
    badge.className = "uis-chart__badge";
    badge.textContent = `${kind.toUpperCase()} CHART`;
    el.appendChild(badge);
    if (typeof props.label === "string") {
      const lbl = document.createElement("div");
      lbl.className = "uis-chart__label";
      lbl.textContent = props.label;
      el.appendChild(lbl);
    }
    return el;
  },
};
