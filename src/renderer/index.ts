// src/renderer/index.ts
import { parseDocument } from "@/parser";
import { validate } from "@/schema";
import { renderLayoutNodes, renderGrid } from "./layout";
import { applyFrame } from "@/styler";
import { renderErrorBox, renderEmptyPlaceholder } from "@/errors/render";
import { countAndCheckDepth } from "./safety";
import type { ValidatedDoc } from "@/types";

export function renderSource(source: string): HTMLElement {
  const trimmed = source.trim();
  if (trimmed === "") return renderEmptyPlaceholder();

  const parsed = parseDocument(source);
  if (!parsed.ok) return renderErrorBox(parsed.error);

  const validated = validate(parsed.doc);
  if (!validated.ok) return renderErrorBox(validated.error);

  const doc: ValidatedDoc = validated.doc;

  const safety = countAndCheckDepth(doc.screen);
  if (!safety.ok) {
    return renderErrorBox({
      kind: "structure",
      message: safety.reason === "depth"
        ? "layout depth exceeds 32"
        : "too many nodes (>5000) — split the block",
      path: "screen",
    });
  }

  if (Array.isArray(doc.screen) && doc.screen.length === 0) return renderEmptyPlaceholder();

  const inner = Array.isArray(doc.screen)
    ? renderLayoutNodes(doc.screen)
    : renderGrid(doc.screen);
  return applyFrame(inner, doc);
}
