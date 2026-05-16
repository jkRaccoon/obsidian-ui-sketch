import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const ContainerSchema = BasePropsSchema.passthrough();

export const ContainerDef: ComponentDef = {
  type: "container",
  schema: ContainerSchema,
  render(props) {
    const el = createDiv({ cls: "uis-container" });
    const pad = props.pad;
    const styles: Partial<CSSStyleDeclaration> = {};
    if (typeof pad === "number") styles.padding = `${pad}px`;
    else if (typeof pad === "string") styles.padding = pad;
    if (Object.keys(styles).length > 0) el.setCssStyles(styles);
    return el;
  },
};
