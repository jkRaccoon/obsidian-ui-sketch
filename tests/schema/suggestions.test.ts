import { describe, it, expect } from "vitest";
import { editDistance, suggestType } from "@/schema/suggestions";

describe("editDistance", () => {
  it("returns 0 for identical strings", () => {
    expect(editDistance("button", "button")).toBe(0);
  });
  it("returns 1 for single-char typo", () => {
    expect(editDistance("butn", "button")).toBe(2);
    expect(editDistance("buton", "button")).toBe(1);
  });
  it("returns length for empty counterpart", () => {
    expect(editDistance("", "abc")).toBe(3);
    expect(editDistance("abc", "")).toBe(3);
  });
});

describe("suggestType", () => {
  it("returns closest match within threshold", () => {
    expect(suggestType("buton", ["button", "input", "card"])).toBe("button");
  });
  it("returns undefined when no match within threshold", () => {
    expect(suggestType("xyz", ["button", "input"])).toBeUndefined();
  });
  it("prefers exact edit-distance winner", () => {
    expect(suggestType("cal", ["card", "avatar"])).toBe("card");
  });
});
