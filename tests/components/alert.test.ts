import { describe, it, expect } from "vitest";
import { AlertDef } from "@/components/alert";

describe("alert", () => {
  it("renders info alert by default with title + message", () => {
    const el = AlertDef.render({ title: "Heads up", message: "Details" }, {});
    expect(el.className).toContain("uis-alert");
    expect(el.className).toContain("uis-alert--info");
    expect(el.querySelector(".uis-alert__title")?.textContent).toBe("Heads up");
    expect(el.querySelector(".uis-alert__message")?.textContent).toBe("Details");
  });
  it("supports severity", () => {
    const el = AlertDef.render({ severity: "error", message: "bad" }, {});
    expect(el.className).toContain("uis-alert--error");
  });
});
