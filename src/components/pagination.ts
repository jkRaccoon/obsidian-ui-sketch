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
    const el = document.createElement("div");
    el.className = "uis-pagination";
    const prev = document.createElement("span");
    prev.className = "uis-pagination__prev";
    prev.textContent = "‹";
    el.appendChild(prev);
    const label = document.createElement("span");
    label.className = "uis-pagination__label";
    const c = typeof props.current === "number" ? props.current : 1;
    const t = typeof props.total === "number" ? props.total : 1;
    label.textContent = `${c} / ${t}`;
    el.appendChild(label);
    const next = document.createElement("span");
    next.className = "uis-pagination__next";
    next.textContent = "›";
    el.appendChild(next);
    return el;
  },
};
