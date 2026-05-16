import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const SkeletonSchema = BasePropsSchema.extend({
  width: z.union([z.string(), z.number()]).optional(),
  height: z.union([z.string(), z.number()]).optional(),
}).passthrough();

export const SkeletonDef: ComponentDef = {
  type: "skeleton",
  schema: SkeletonSchema,
  render(props) {
    const el = createDiv({ cls: "uis-skeleton" });
    const w = props.width;
    const h = props.height;
    const styles: Partial<CSSStyleDeclaration> = {};
    if (typeof w === "number") styles.width = `${w}px`;
    else if (typeof w === "string") styles.width = w;
    if (typeof h === "number") styles.height = `${h}px`;
    else if (typeof h === "string") styles.height = h;
    if (Object.keys(styles).length > 0) el.setCssStyles(styles);
    return el;
  },
};
