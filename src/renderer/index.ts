import { parseDocument } from "@/parser";
import { validate } from "@/schema";
import { renderLayoutNodes, renderGrid } from "./layout";
import { applyFrame } from "@/styler";
import { renderErrorBox, renderEmptyPlaceholder } from "@/errors/render";
import type { ValidatedDoc } from "@/types";

export function renderSource(source: string): HTMLElement {
  const trimmed = source.trim();
  if (trimmed === "") return renderEmptyPlaceholder();

  const parsed = parseDocument(source);
  if (!parsed.ok) return renderErrorBox(parsed.error);

  const validated = validate(parsed.doc);
  if (!validated.ok) return renderErrorBox(validated.error);

  const doc: ValidatedDoc = validated.doc;
  if (Array.isArray(doc.screen) && doc.screen.length === 0) return renderEmptyPlaceholder();

  const inner = Array.isArray(doc.screen)
    ? renderLayoutNodes(doc.screen)
    : renderGrid(doc.screen);
  return applyFrame(inner, doc);
}
