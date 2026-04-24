import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const TagSchema = BasePropsSchema.extend({
  label: z.string().optional(),
}).passthrough();

export const TagDef: ComponentDef = {
  type: "tag",
  schema: TagSchema,
  render(props) {
    const el = document.createElement("span");
    el.className = "uis-tag";
    el.textContent = typeof props.label === "string" ? props.label : "";
    return el;
  },
};
