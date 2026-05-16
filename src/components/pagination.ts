import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const PaginationSchema = BasePropsSchema.extend({
  current: z.number().optional(),
  total: z.number().optional(),
}).passthrough();

export const PaginationDef: ComponentDef = {
  type: "pagination",
  schema: PaginationSchema,
  render(props) {
    const el = createDiv({ cls: "uis-pagination" });
    el.createSpan({ cls: "uis-pagination__prev", text: "‹" });
    const c = typeof props.current === "number" ? props.current : 1;
    const t = typeof props.total === "number" ? props.total : 1;
    el.createSpan({ cls: "uis-pagination__label", text: `${c} / ${t}` });
    el.createSpan({ cls: "uis-pagination__next", text: "›" });
    return el;
  },
};
