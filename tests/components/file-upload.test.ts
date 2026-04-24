import { describe, it, expect } from "vitest";
import { FileUploadDef } from "@/components/file-upload";

describe("file-upload", () => {
  it("renders a dropzone with label", () => {
    const el = FileUploadDef.render({ label: "Drop files here" }, {});
    expect(el.className).toContain("uis-file-upload");
    expect(el.textContent).toContain("Drop files here");
  });
});
