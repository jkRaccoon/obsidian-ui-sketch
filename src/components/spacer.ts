import type { ComponentDef } from "./registry";

export const SpacerDef: ComponentDef = {
  type: "spacer",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-spacer";
    const size = typeof props.size === "number" ? props.size : 16;
    el.style.minHeight = `${size}px`;
    el.style.minWidth = `${size}px`;
    return el;
  },
};
