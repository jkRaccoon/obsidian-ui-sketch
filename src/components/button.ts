import type { ComponentDef } from "./registry";

const VARIANTS = new Set(["primary", "secondary", "ghost", "danger"]);

export const ButtonDef: ComponentDef = {
  type: "button",
  render(props) {
    const el = document.createElement("div");
    const variant =
      typeof props.variant === "string" && VARIANTS.has(props.variant) ? props.variant : "primary";
    el.className = `uis-button uis-button--${variant}`;
    const label = typeof props.label === "string" ? props.label : "";
    el.textContent = label;
    el.setAttribute("role", "button");
    return el;
  },
};
