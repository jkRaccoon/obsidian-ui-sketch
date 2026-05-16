import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const SearchSchema = BasePropsSchema.extend({
  value: z.string().optional(),
  placeholder: z.string().optional(),
}).passthrough();

export const SearchDef: ComponentDef = {
  type: "search",
  schema: SearchSchema,
  render(props) {
    const el = createDiv({ cls: "uis-search" });
    el.createSpan({ cls: "uis-search__icon", text: "🔍" });
    const label = el.createSpan({ cls: "uis-search__label" });
    if (typeof props.value === "string" && props.value.length > 0) {
      label.textContent = props.value;
    } else if (typeof props.placeholder === "string") {
      label.className += " uis-search__placeholder";
      label.textContent = props.placeholder;
    }
    return el;
  },
};
