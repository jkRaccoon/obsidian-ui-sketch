import { parse, YAMLParseError } from "yaml";
import type { Loc } from "@/types";

export interface ParseError {
  kind: "yaml";
  message: string;
  loc?: Loc;
}

export type ParseResult =
  | { ok: true; doc: Record<string, unknown> }
  | { ok: false; error: ParseError };

export function parseDocument(source: string): ParseResult {
  const trimmed = source.trim();
  if (trimmed === "") return { ok: true, doc: {} };

  let doc: unknown;
  try {
    // version "1.1" keeps js-yaml-compatible scalar handling (e.g. yes/no/on/off
    // booleans). maxAliasCount caps alias expansion at the parser level — the
    // primary alias-bomb defense; renderer/safety.ts (MAX_NODES) backstops the
    // built tree.
    doc = parse(source, { version: "1.1", maxAliasCount: 100 });
  } catch (e) {
    if (e instanceof YAMLParseError) {
      const pos = e.linePos?.[0];
      return {
        ok: false,
        error: {
          kind: "yaml",
          message: e.message,
          loc: pos ? { line: pos.line, col: pos.col } : undefined,
        },
      };
    }
    return {
      ok: false,
      error: { kind: "yaml", message: e instanceof Error ? e.message : String(e) },
    };
  }

  if (doc === null || doc === undefined) return { ok: true, doc: {} };
  if (typeof doc !== "object" || Array.isArray(doc)) {
    return {
      ok: false,
      error: { kind: "yaml", message: "Top-level must be a mapping", loc: { line: 1, col: 1 } },
    };
  }
  return { ok: true, doc: doc as Record<string, unknown> };
}
