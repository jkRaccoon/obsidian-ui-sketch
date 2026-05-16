import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const MapSchema = BasePropsSchema.passthrough();

export const MapDef: ComponentDef = {
  type: "map",
  schema: MapSchema,
  render() {
    const el = createDiv({ cls: "uis-map" });
    el.createDiv({ cls: "uis-map__badge", text: "MAP" });
    return el;
  },
};
