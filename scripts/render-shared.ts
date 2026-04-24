// scripts/render-shared.ts
//
// Shared browser-render helpers used by gen-screenshots.ts and preview-sketch.ts.
// Both scripts run the plugin renderer inside a headless Chromium page,
// so everything from bundling the entry to injecting Obsidian's CSS
// variable defaults lives here once.

import * as fs from "node:fs";
import * as path from "node:path";
import esbuild from "esbuild";
import type { Browser, Page } from "playwright";
import { chromium } from "playwright";

/**
 * Obsidian CSS variable baseline. The plugin inherits Obsidian's theme
 * tokens; in a standalone browser we provide a light-theme default that
 * approximates Obsidian's default UI.
 */
const OBSIDIAN_VARS = `
:root {
  color-scheme: light;
  --background-primary: #ffffff;
  --background-primary-alt: #f7f8fa;
  --background-secondary: #f5f6fa;
  --background-secondary-alt: #ececec;
  --background-modifier-border: #dcdde3;
  --background-modifier-border-hover: #c8cad3;
  --background-modifier-hover: #eef0f5;
  --background-modifier-error: #fbe9e9;
  --background-modifier-success: #e8f6ea;
  --background-modifier-warning: #fff5df;
  --text-normal: #1e1f24;
  --text-muted: #6d7380;
  --text-faint: #9aa0ac;
  --text-accent: #7c3aed;
  --text-on-accent: #ffffff;
  --text-error: #c63f3f;
  --text-success: #2a7a3a;
  --text-warning: #8a5a00;
  --interactive-accent: #7c3aed;
  --interactive-accent-hover: #6b2bd9;
  --interactive-normal: #f1f2f7;
  --interactive-hover: #e7e8f0;
  --font-monospace: ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-interface: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-text: var(--font-interface);
  --radius-s: 4px;
  --radius-m: 6px;
  --radius-l: 8px;
}
body { background: var(--background-primary); color: var(--text-normal); font-family: var(--font-interface); margin: 0; padding: 32px; }
#out { display: inline-block; }
`;

export async function bundleRenderer(repoRoot: string): Promise<string> {
  const result = await esbuild.build({
    entryPoints: [path.join(repoRoot, "scripts", "screenshot-entry.ts")],
    bundle: true,
    format: "iife",
    target: "es2020",
    platform: "browser",
    write: false,
    sourcemap: "inline",
    tsconfig: path.join(repoRoot, "tsconfig.json"),
    logLevel: "error",
  });
  return result.outputFiles[0].text;
}

export function harnessHtml(repoRoot: string, bundledJs: string): string {
  const styles = fs.readFileSync(path.join(repoRoot, "styles.css"), "utf8");
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${OBSIDIAN_VARS}\n${styles}</style>
</head>
<body>
<div id="out"></div>
<script>${bundledJs}</script>
</body>
</html>`;
}

export interface RenderSession {
  browser: Browser;
  page: Page;
  shoot(yaml: string, outPath: string): Promise<void>;
  close(): Promise<void>;
}

export async function openSession(
  repoRoot: string,
  viewport: { width: number; height: number } = { width: 1400, height: 900 },
): Promise<RenderSession> {
  const bundled = await bundleRenderer(repoRoot);
  const html = harnessHtml(repoRoot, bundled);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: "load" });

  const shoot = async (yaml: string, outPath: string): Promise<void> => {
    await page.evaluate((src: string) => {
      const out = document.getElementById("out") as HTMLElement;
      out.replaceChildren((window as { UiSketch?: { renderSource(s: string): HTMLElement } }).UiSketch!.renderSource(src));
    }, yaml);
    await page.waitForTimeout(50); // settle fonts/CSS
    const target = await page.$("#out");
    if (!target) throw new Error("no #out element to screenshot");
    await target.screenshot({ path: outPath, omitBackground: false });
  };

  return { browser, page, shoot, close: () => browser.close() };
}
