import type { ComponentDef } from "./registry";

export const PanelDef: ComponentDef = {
  type: "panel",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-panel";
    if (typeof props.header === "string") {
      const h = document.createElement("div");
      h.className = "uis-panel__header";
      h.textContent = props.header;
      el.appendChild(h);
    }
    return el;
  },
};
