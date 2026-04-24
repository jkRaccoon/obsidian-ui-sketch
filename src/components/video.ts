import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const VideoSchema = BasePropsSchema.passthrough();

export const VideoDef: ComponentDef = {
  type: "video",
  schema: VideoSchema,
  render() {
    const el = document.createElement("div");
    el.className = "uis-video";
    const play = document.createElement("span");
    play.className = "uis-video__play";
    play.textContent = "▶";
    el.appendChild(play);
    const badge = document.createElement("span");
    badge.className = "uis-video__badge";
    badge.textContent = "VIDEO";
    el.appendChild(badge);
    return el;
  },
};
