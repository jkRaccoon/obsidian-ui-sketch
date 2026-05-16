import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ContainerSchema = BasePropsSchema.passthrough();

export const ContainerDef: ComponentDef = {
  type: "container",
  schema: ContainerSchema,
  render(props) {
    const el = createDiv({ cls: "uis-container" });
    const pad = props.pad;
    if (typeof pad === "number") el.style.padding = `${pad}px`;
    else if (typeof pad === "string") el.style.padding = pad;
    return el;
  },
};
