import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const VideoSchema = BasePropsSchema.passthrough();

export const VideoDef: ComponentDef = {
  type: "video",
  schema: VideoSchema,
  render() {
    const el = createDiv({ cls: "uis-video" });
    el.createSpan({ cls: "uis-video__play", text: "▶" });
    el.createSpan({ cls: "uis-video__badge", text: "VIDEO" });
    return el;
  },
};
