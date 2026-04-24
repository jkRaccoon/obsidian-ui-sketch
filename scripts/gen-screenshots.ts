// scripts/gen-screenshots.ts
//
// Renders every ```ui-sketch YAML block from docs/recipes/*.md plus the
// first ```yaml block of the main README (the hero example) inside a
// headless Chromium page, then writes each result as a PNG under docs/img/.
// The actual bundling + headless page harness lives in render-shared.ts.
//
// Run with: yarn gen:screenshots

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { openSession } from "./render-shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const recipesDir = path.join(repoRoot, "docs", "recipes");
const recipesOutDir = path.join(repoRoot, "docs", "img", "recipes");
const heroOutDir = path.join(repoRoot, "docs", "img");
const readmePath = path.join(repoRoot, "README.md");

function extractUiSketchBlocks(mdPath: string): string[] {
  const content = fs.readFileSync(mdPath, "utf8");
  const blocks: string[] = [];
  const re = /```ui-sketch\s*\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) blocks.push(m[1]);
  return blocks;
}

// The README showcases the intro YAML inside a ```yaml block (to get syntax
// highlighting on GitHub) rather than a ```ui-sketch block (what users
// actually type). For the hero image we want that first yaml block — it's
// the example readers see immediately above the screenshot.
function extractFirstYamlBlock(mdPath: string): string | undefined {
  const content = fs.readFileSync(mdPath, "utf8");
  const m = /```yaml\s*\n([\s\S]*?)```/.exec(content);
  return m?.[1];
}

async function main(): Promise<void> {
  fs.mkdirSync(recipesOutDir, { recursive: true });
  fs.mkdirSync(heroOutDir, { recursive: true });

  console.log("bundling renderer for browser...");
  console.log("launching chromium...");
  const session = await openSession(repoRoot);

  const recipes = fs.readdirSync(recipesDir).filter((f) => f.endsWith(".md")).sort();
  for (const recipeFile of recipes) {
    const base = path.basename(recipeFile, ".md");
    const blocks = extractUiSketchBlocks(path.join(recipesDir, recipeFile));
    if (blocks.length === 0) continue;
    console.log(`${recipeFile}  (${blocks.length} block${blocks.length === 1 ? "" : "s"})`);
    for (let i = 0; i < blocks.length; i++) {
      const suffix = blocks.length === 1 ? "" : `-${i + 1}`;
      const outPath = path.join(recipesOutDir, `${base}${suffix}.png`);
      await session.shoot(blocks[i], outPath);
      console.log(`  wrote  ${path.relative(repoRoot, outPath)}`);
    }
  }

  // Hero image: first ```yaml block in the README (the intro example).
  const hero = extractFirstYamlBlock(readmePath);
  if (hero) {
    console.log("README.md  (hero)");
    const outPath = path.join(heroOutDir, "hero.png");
    await session.shoot(hero, outPath);
    console.log(`  wrote  ${path.relative(repoRoot, outPath)}`);
  }

  await session.close();
  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
