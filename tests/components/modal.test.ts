import { describe, it, expect } from "vitest";
import { ModalDef } from "@/components/modal";

describe("modal", () => {
  it("renders title and body in a framed box", () => {
    const el = ModalDef.render({ title: "Confirm", body: "Proceed?" }, {});
    expect(el.className).toContain("uis-modal");
    expect(el.querySelector(".uis-modal__title")?.textContent).toBe("Confirm");
    expect(el.querySelector(".uis-modal__body")?.textContent).toBe("Proceed?");
  });
});
