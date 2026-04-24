import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const FileUploadSchema = BasePropsSchema.extend({
  label: z.string().optional(),
}).passthrough();

export const FileUploadDef: ComponentDef = {
  type: "file-upload",
  schema: FileUploadSchema,
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-file-upload";
    const icon = document.createElement("span");
    icon.className = "uis-file-upload__icon";
    icon.textContent = "⬆";
    el.appendChild(icon);
    const label = document.createElement("span");
    label.className = "uis-file-upload__label";
    label.textContent = typeof props.label === "string" ? props.label : "Drop files or click to upload";
    el.appendChild(label);
    return el;
  },
};
