import { describe, it, expect } from "vitest";
import { VideoDef } from "@/components/video";

describe("video", () => {
  it("renders a VIDEO placeholder with play icon", () => {
    const el = VideoDef.render({}, {});
    expect(el.className).toContain("uis-video");
    expect(el.textContent).toContain("VIDEO");
    expect(el.querySelector(".uis-video__play")).not.toBeNull();
  });
});
