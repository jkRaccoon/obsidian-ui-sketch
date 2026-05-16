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
    const el = createDiv({ cls: `uis-chart uis-chart--${kind}` });
    el.createDiv({ cls: "uis-chart__badge", text: `${kind.toUpperCase()} CHART` });
    if (typeof props.label === "string") {
      el.createDiv({ cls: "uis-chart__label", text: props.label });
    }
    return el;
  },
};
