import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ImageSchema = BasePropsSchema.extend({
  src: z.string().optional(),
  alt: z.string().optional(),
}).passthrough();

export const ImageDef: ComponentDef = {
  type: "image",
  schema: ImageSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-image";
    const label = document.createElement("span");
    label.className = "uis-image__label";
    label.textContent = typeof props.alt === "string" && props.alt.length > 0 ? props.alt : "IMG";
    el.appendChild(label);
    return el;
  },
};
