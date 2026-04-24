import type { ComponentDef } from "./registry";

export const DividerDef: ComponentDef = {
  type: "divider",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-divider";
    if (props.orientation === "vertical") el.className += " uis-divider--vertical";
    return el;
  },
};
