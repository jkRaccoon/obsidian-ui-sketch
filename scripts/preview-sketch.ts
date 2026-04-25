// scripts/preview-sketch.ts
//
// Render a single UI Sketch YAML to a PNG for fast local preview without
// opening Obsidian. Useful when iterating on layout or alignment.
//
// Usage:
//   npm run preview <yaml-file> [out-png]
//   npm run preview - [out-png]           # read YAML from stdin
//
// Default output path is ./preview.png in the repo root.

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { openSession } from "./render-shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function usage(): never {
  console.error("Usage: npm run preview <yaml-file | -> [out-png]");
  console.error("  '-' as <yaml-file> reads YAML from stdin");
  console.error("  default out-png is ./preview.png");
  process.exit(1);
}

async function main(): Promise<void> {
  const [yamlArg, outArg] = process.argv.slice(2);
  if (!yamlArg) usage();

  const yaml = yamlArg === "-"
    ? fs.readFileSync(0, "utf8")
    : fs.readFileSync(path.resolve(yamlArg), "utf8");
  const outPath = path.resolve(outArg ?? path.join(repoRoot, "preview.png"));

  console.log("bundling renderer...");
  console.log("launching chromium...");
  // Taller viewport than the default so complex forms don't get clipped.
  const session = await openSession(repoRoot, { width: 1400, height: 2000 });

  await session.shoot(yaml, outPath);
  await session.close();

  console.log(`wrote  ${path.relative(process.cwd(), outPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
