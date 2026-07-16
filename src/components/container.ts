import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ContainerSchema = BasePropsSchema.passthrough();

export const ContainerDef: ComponentDef = {
  type: "container",
  // `pad` is a base prop applied for every component by the renderer, so there
  // is nothing container-specific left to do here.
  schema: ContainerSchema,
  render() {
    return createDiv({ cls: "uis-container" });
  },
};
