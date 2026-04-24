import { describe, it, expect } from "vitest";
import { SearchDef } from "@/components/search";

describe("search", () => {
  it("renders magnifier + placeholder", () => {
    const el = SearchDef.render({ placeholder: "Search docs..." }, {});
    expect(el.className).toContain("uis-search");
    expect(el.querySelector(".uis-search__icon")?.textContent).toBe("🔍");
    expect(el.textContent).toContain("Search docs...");
  });
});
