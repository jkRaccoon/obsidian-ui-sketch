import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const RawSchema = BasePropsSchema.extend({
  html: z.string().optional(),
  text: z.string().optional(),
}).passthrough();

const ALLOWED_TAGS = [
  "b", "i", "em", "strong", "a", "p", "br",
  "span", "div", "ul", "ol", "li", "code", "pre",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote",
];

const ALLOWED_ATTRS = {
  a: ["href"],
  "*": ["class", "style"],
};

const ALLOWED_STYLES: Record<string, Record<string, RegExp[]>> = {
  "*": {
    "color": [/^.*$/],
    "background": [/^.*$/],
    "font-weight": [/^.*$/],
    "text-align": [/^.*$/],
    "padding": [/^.*$/],
    "margin": [/^.*$/],
  },
};

export const RawDef: ComponentDef = {
  type: "raw",
  schema: RawSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-raw";
    if (typeof props.html === "string") {
      // innerHTML is intentional here: the input is always piped through
      // sanitize-html with a strict allow-list (no <script>, no event handlers,
      // no javascript: URLs). This is the plugin's documented escape hatch for
      // authors who need lightweight inline markup inside a wireframe.
      el.innerHTML = sanitizeHtml(props.html, {
        allowedTags: ALLOWED_TAGS,
        allowedAttributes: ALLOWED_ATTRS,
        allowedStyles: ALLOWED_STYLES,
      });
    } else if (typeof props.text === "string") {
      el.textContent = props.text;
    }
    return el;
  },
};
