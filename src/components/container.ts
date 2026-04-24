import type { ComponentDef } from "./registry";

export const ContainerDef: ComponentDef = {
  type: "container",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-container";
    const pad = props.pad;
    if (typeof pad === "number") el.style.padding = `${pad}px`;
    else if (typeof pad === "string") el.style.padding = pad;
    return el;
  },
};
