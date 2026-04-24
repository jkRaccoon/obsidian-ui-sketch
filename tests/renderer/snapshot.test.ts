import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { renderSource } from "@/renderer";
import { installBuiltinComponents } from "@/components";

installBuiltinComponents();

function fixture(name: string): string {
  return fs.readFileSync(path.join(__dirname, "..", "fixtures", `${name}.yaml`), "utf8");
}

describe("renderSource snapshots", () => {
  it("matches minimal", () => {
    expect(renderSource(fixture("minimal")).outerHTML).toMatchSnapshot();
  });
  it("matches dashboard grid", () => {
    expect(renderSource(fixture("dashboard")).outerHTML).toMatchSnapshot();
  });
  it("renders empty for empty source", () => {
    const el = renderSource("");
    expect(el.className).toContain("uis-empty");
  });
  it("renders error box for invalid YAML", () => {
    const el = renderSource("screen:\n  - a: b: c\n");
    expect(el.className).toContain("uis-error");
  });
});
