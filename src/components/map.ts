import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const MapSchema = BasePropsSchema.passthrough();

export const MapDef: ComponentDef = {
  type: "map",
  schema: MapSchema,
  render() {
    const el = document.createElement("div");
    el.className = "uis-map";
    const badge = document.createElement("div");
    badge.className = "uis-map__badge";
    badge.textContent = "MAP";
    el.appendChild(badge);
    return el;
  },
};
