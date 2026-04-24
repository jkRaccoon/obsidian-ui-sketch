import { describe, it, expect } from "vitest";
import { installBuiltinComponents } from "@/components";
import { renderLayoutNodes } from "@/renderer/layout";
import { register } from "@/components/registry";
import { z } from "zod";

installBuiltinComponents();

register({
  type: "strict-demo",
  schema: z.object({ label: z.string() }).passthrough(),
  render(props) {
    const el = document.createElement("div");
    el.className = "uis-demo";
    el.textContent = String(props.label);
    return el;
  },
});

describe("L3 inline errors", () => {
  it("renders schema failure as inline error with component name and message", () => {
    const host = document.createElement("div");
    host.appendChild(
      renderLayoutNodes([{ kind: "component", type: "strict-demo", props: {} }]),
    );
    const err = host.querySelector(".uis-error--inline");
    expect(err).not.toBeNull();
    expect(err?.textContent).toContain("strict-demo");
  });

  it("renders unknown type with suggestion when close to a registered type", () => {
    const host = document.createElement("div");
    host.appendChild(
      renderLayoutNodes([{ kind: "component", type: "buton", props: {} }]),
    );
    const err = host.querySelector(".uis-error--inline");
    expect(err).not.toBeNull();
    expect(err?.textContent).toContain("buton");
    expect(err?.textContent).toContain("button");
    expect(err?.textContent).toContain("Did you mean");
  });

  it("renders unknown type without suggestion when far from any registered type", () => {
    const host = document.createElement("div");
    host.appendChild(
      renderLayoutNodes([{ kind: "component", type: "zzzzzzzz", props: {} }]),
    );
    const err = host.querySelector(".uis-error--inline");
    expect(err).not.toBeNull();
    expect(err?.textContent).not.toContain("Did you mean");
  });
});
