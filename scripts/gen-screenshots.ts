// scripts/gen-screenshots.ts
//
// Renders every ```ui-sketch YAML block from docs/recipes/*.md inside a
// headless Chromium page, then writes the resulting DOM as a PNG to
// docs/img/recipes/. Uses esbuild programmatically to bundle the
// browser-loadable entry so no intermediate build artifacts need to be
// committed.
//
// Run with: yarn gen:screenshots

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";
import { chromium, type Page } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const entryPoint = path.join(__dirname, "screenshot-entry.ts");
const recipesDir = path.join(repoRoot, "docs", "recipes");
const outDir = path.join(repoRoot, "docs", "img", "recipes");
const pluginStyles = fs.readFileSync(path.join(repoRoot, "styles.css"), "utf8");

/**
 * Obsidian CSS variables baseline. The plugin inherits Obsidian's theme
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

async function bundleEntry(): Promise<string> {
  const result = await esbuild.build({
    entryPoints: [entryPoint],
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

function extractUiSketchBlocks(mdPath: string): string[] {
  const content = fs.readFileSync(mdPath, "utf8");
  const blocks: string[] = [];
  const re = /```ui-sketch\s*\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) blocks.push(m[1]);
  return blocks;
}

async function renderAndShoot(page: Page, yaml: string, outPath: string): Promise<void> {
  await page.evaluate((src: string) => {
    const out = document.getElementById("out")!;
    out.replaceChildren(window.UiSketch.renderSource(src));
  }, yaml);

  // Give fonts/CSS a tick to settle.
  await page.waitForTimeout(50);

  const target = await page.$("#out");
  if (!target) throw new Error("no #out element to screenshot");
  await target.screenshot({ path: outPath, omitBackground: false });
  console.log(`  wrote  ${path.relative(repoRoot, outPath)}`);
}

async function main(): Promise<void> {
  fs.mkdirSync(outDir, { recursive: true });
  console.log("bundling renderer for browser...");
  const bundledJs = await bundleEntry();

  console.log("launching chromium...");
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 2, // retina-quality PNGs
  });
  const page = await context.newPage();

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${OBSIDIAN_VARS}\n${pluginStyles}</style>
</head>
<body>
<div id="out"></div>
<script>${bundledJs}</script>
</body>
</html>`;
  await page.setContent(html, { waitUntil: "load" });

  const recipes = fs.readdirSync(recipesDir).filter((f) => f.endsWith(".md")).sort();
  for (const recipeFile of recipes) {
    const base = path.basename(recipeFile, ".md");
    const blocks = extractUiSketchBlocks(path.join(recipesDir, recipeFile));
    if (blocks.length === 0) continue;
    console.log(`${recipeFile}  (${blocks.length} block${blocks.length === 1 ? "" : "s"})`);
    for (let i = 0; i < blocks.length; i++) {
      const suffix = blocks.length === 1 ? "" : `-${i + 1}`;
      const outPath = path.join(outDir, `${base}${suffix}.png`);
      await renderAndShoot(page, blocks[i], outPath);
    }
  }

  await browser.close();
  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
