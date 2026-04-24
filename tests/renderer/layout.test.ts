import { describe, it, expect } from "vitest";
import { installBuiltinComponents } from "@/components";
import { renderLayoutNodes, renderGrid } from "@/renderer/layout";
import type { GridNode } from "@/types";

installBuiltinComponents();

describe("renderLayoutNodes", () => {
  it("renders a single card", () => {
    const host = document.createElement("div");
    host.appendChild(renderLayoutNodes([{ kind: "component", type: "card", props: { title: "A" } }]));
    expect(host.querySelector(".uis-card")).not.toBeNull();
  });

  it("lays out a row with flex cols", () => {
    const host = document.createElement("div");
    host.appendChild(
      renderLayoutNodes([
        {
          kind: "row",
          items: [
            { kind: "col", flex: 1, items: [{ kind: "component", type: "card", props: { title: "L" } }] },
            { kind: "col", flex: 3, items: [{ kind: "component", type: "card", props: { title: "R" } }] },
          ],
        },
      ]),
    );
    const row = host.querySelector(".uis-row") as HTMLElement;
    expect(row).not.toBeNull();
    const cols = row.querySelectorAll(".uis-col");
    expect(cols.length).toBe(2);
    expect((cols[1] as HTMLElement).style.flex).toContain("3");
  });

  it("renders an unknown component as an inline L3 error", () => {
    const host = document.createElement("div");
    host.appendChild(renderLayoutNodes([{ kind: "component", type: "mystery", props: {} }]));
    expect(host.querySelector(".uis-error--inline")).not.toBeNull();
  });

  it("applies note annotation", () => {
    const host = document.createElement("div");
    host.appendChild(
      renderLayoutNodes([{ kind: "component", type: "button", props: { label: "X", note: "why?" } }]),
    );
    expect(host.querySelector(".uis-annotated")?.getAttribute("title")).toBe("why?");
  });
});

describe("renderGrid", () => {
  it("lays out a named-area grid", () => {
    const grid: GridNode = {
      kind: "grid",
      areas: ["a b"],
      cols: "1fr 1fr",
      map: {
        a: { kind: "component", type: "card", props: { title: "A" } },
        b: { kind: "component", type: "card", props: { title: "B" } },
      },
    };
    const el = renderGrid(grid);
    expect(el.className).toContain("uis-grid");
    expect((el.style.gridTemplateAreas ?? "").includes("a b")).toBe(true);
    expect(el.querySelectorAll(".uis-card").length).toBe(2);
  });
});
