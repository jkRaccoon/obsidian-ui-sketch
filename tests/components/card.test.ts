import { describe, it, expect } from "vitest";
import { CardDef } from "@/components/card";

describe("card", () => {
  it("renders a card with title and body", () => {
    const el = CardDef.render({ title: "Hello", body: "World" }, {});
    expect(el.className).toContain("uis-card");
    expect(el.querySelector(".uis-card__title")?.textContent).toBe("Hello");
    expect(el.querySelector(".uis-card__body")?.textContent).toBe("World");
  });
  it("omits title/body nodes when props absent", () => {
    const el = CardDef.render({}, {});
    expect(el.querySelector(".uis-card__title")).toBeNull();
    expect(el.querySelector(".uis-card__body")).toBeNull();
  });
});
