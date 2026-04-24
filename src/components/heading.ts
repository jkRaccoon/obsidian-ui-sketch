import type { ComponentDef } from "./registry";

export const HeadingDef: ComponentDef = {
  type: "heading",
  render(props) {
    const el = document.createElement("div");
    let level = typeof props.level === "number" ? Math.round(props.level) : 1;
    if (level < 1) level = 1;
    if (level > 6) level = 6;
    el.className = `uis-heading uis-heading--h${level}`;
    el.textContent = typeof props.text === "string" ? props.text : "";
    return el;
  },
};
