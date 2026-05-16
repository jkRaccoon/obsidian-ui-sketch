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
    const el = createDiv({ cls: "uis-image" });
    el.createSpan({ cls: "uis-image__label", text: typeof props.alt === "string" && props.alt.length > 0 ? props.alt : "IMG" });
    return el;
  },
};
