// src/schema/document.ts
import type { ValidatedDoc, ViewportKind } from "@/types";
import { parseLayoutArray, parseGrid } from "./layout";

export interface StructureError {
  kind: "structure";
  message: string;
  path: string;
}

export type ValidateResult =
  | { ok: true; doc: ValidatedDoc }
  | { ok: false; error: StructureError };

const VIEWPORTS: ViewportKind[] = ["desktop", "tablet", "mobile", "custom"];
const BACKGROUNDS = ["default", "muted", "transparent"] as const;

export function validateDocument(raw: Record<string, unknown>): ValidateResult {
  const viewport = raw.viewport ?? "desktop";
  if (typeof viewport !== "string" || !VIEWPORTS.includes(viewport as ViewportKind)) {
    return err("viewport must be one of desktop|tablet|mobile|custom", "viewport");
  }
  const v = viewport as ViewportKind;
  let width: number | undefined;
  let height: number | undefined;
  if (v === "custom") {
    if (typeof raw.width !== "number" || typeof raw.height !== "number") {
      return err("viewport=custom requires numeric width and height", "width");
    }
    width = raw.width;
    height = raw.height;
  }

  const theme = raw.theme ?? "adaptive";
  if (theme !== "adaptive") return err("theme must be 'adaptive' in v0.1", "theme");

  const background = raw.background ?? "default";
  if (typeof background !== "string" || !(BACKGROUNDS as readonly string[]).includes(background)) {
    return err("background must be one of default|muted|transparent", "background");
  }

  if (!("screen" in raw)) {
    return err("screen is required", "screen");
  }
  const screenRaw = raw.screen;

  if (isGridShape(screenRaw)) {
    const g = parseGrid((screenRaw as Record<string, unknown>).grid, "screen");
    if (!g.ok) return err(g.error.message, g.error.path);
    return ok({ viewport: v, width, height, theme: "adaptive", background: background as ValidatedDoc["background"], screen: g.grid });
  }

  const layout = parseLayoutArray(screenRaw, "screen");
  if (!layout.ok) return err(layout.error.message, layout.error.path);
  return ok({ viewport: v, width, height, theme: "adaptive", background: background as ValidatedDoc["background"], screen: layout.nodes });
}

function isGridShape(x: unknown): boolean {
  return typeof x === "object" && x !== null && !Array.isArray(x) && "grid" in (x as Record<string, unknown>);
}

function ok(doc: ValidatedDoc): ValidateResult { return { ok: true, doc }; }
function err(message: string, path: string): ValidateResult {
  return { ok: false, error: { kind: "structure", message, path } };
}
