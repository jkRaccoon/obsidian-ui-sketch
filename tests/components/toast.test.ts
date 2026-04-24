import { describe, it, expect } from "vitest";
import { ToastDef } from "@/components/toast";

describe("toast", () => {
  it("renders message with severity class", () => {
    const el = ToastDef.render({ message: "Saved", severity: "success" }, {});
    expect(el.className).toContain("uis-toast");
    expect(el.className).toContain("uis-toast--success");
    expect(el.textContent).toContain("Saved");
  });
});
