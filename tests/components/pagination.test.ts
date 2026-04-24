import { describe, it, expect } from "vitest";
import { PaginationDef } from "@/components/pagination";

describe("pagination", () => {
  it("renders prev + current/total + next", () => {
    const el = PaginationDef.render({ current: 3, total: 10 }, {});
    expect(el.className).toContain("uis-pagination");
    expect(el.textContent).toContain("3");
    expect(el.textContent).toContain("10");
    expect(el.querySelector(".uis-pagination__prev")).not.toBeNull();
    expect(el.querySelector(".uis-pagination__next")).not.toBeNull();
  });
});
