// tests/sanity.test.ts
import { describe, it, expect } from "vitest";

describe("sanity", () => {
  it("has a working DOM", () => {
    const div = document.createElement("div");
    div.textContent = "hi";
    expect(div.textContent).toBe("hi");
  });
});
