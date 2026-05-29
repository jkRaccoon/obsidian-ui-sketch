import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const AvatarSchema = BasePropsSchema.extend({
  name: z.string().optional(),
  size: z.number().optional(),
}).passthrough();

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const AvatarDef: ComponentDef = {
  type: "avatar",
  schema: AvatarSchema,
  render(props) {
    const size = typeof props.size === "number" ? props.size : 32;
    const el = createDiv({
      cls: "uis-avatar",
      text: initials(typeof props.name === "string" ? props.name : ""),
    });
    el.setCssStyles({ width: `${size}px`, height: `${size}px`, lineHeight: `${size}px` });
    return el;
  },
};
