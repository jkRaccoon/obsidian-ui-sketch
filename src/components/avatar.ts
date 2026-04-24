import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const AvatarSchema = BasePropsSchema.extend({
  name: z.string().optional(),
  size: z.number().optional(),
}).passthrough();

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const AvatarDef: ComponentDef = {
  type: "avatar",
  schema: AvatarSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-avatar";
    const size = typeof props.size === "number" ? props.size : 32;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.lineHeight = `${size}px`;
    el.textContent = initials(typeof props.name === "string" ? props.name : "");
    return el;
  },
};
