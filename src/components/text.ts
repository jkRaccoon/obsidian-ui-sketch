import type { ComponentDef } from "./registry";

const TONES = new Set(["muted", "strong", "accent"]);

export const TextDef: ComponentDef = {
  type: "text",
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-text";
    if (typeof props.tone === "string" && TONES.has(props.tone)) {
      el.className += ` uis-text--${props.tone}`;
    }
    el.textContent = typeof props.value === "string" ? props.value : "";
    return el;
  },
};
