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
    const el = createDiv({ cls: "uis-file-upload" });
    el.createSpan({ cls: "uis-file-upload__icon", text: "⬆" });
    el.createSpan({ cls: "uis-file-upload__label", text: typeof props.label === "string" ? props.label : "Drop files or click to upload" });
    return el;
  },
};
