// tests/sanity.test.ts
import { describe, it, expect } from "vitest";

describe("sanity", () => {
  it("has a working DOM", () => {
    const div = document.createElement("div");
    div.textContent = "hi";
    expect(div.textContent).toBe("hi");
  });
});

describe("polyfill", () => {
  it("createDiv works as HTMLElement method", () => {
    const parent = document.createElement("div");
    const child = parent.createDiv({ cls: "child", text: "hello" });
    expect(child.className).toBe("child");
    expect(child.textContent).toBe("hello");
    expect(parent.contains(child)).toBe(true);
  });
  it("createDiv works as global", () => {
    const el = createDiv({ cls: "free" });
    expect(el.className).toBe("free");
    expect(el.parentElement).toBeNull();
  });
  it("setCssStyles applies styles", () => {
    const el = document.createElement("div");
    el.setCssStyles({ width: "10px", height: "20px" });
    expect(el.style.width).toBe("10px");
    expect(el.style.height).toBe("20px");
  });
  it("activeDocument is defined", () => {
    expect(activeDocument).toBe(document);
  });
});
