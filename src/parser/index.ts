import yaml from "js-yaml";
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

  try {
    // Note: js-yaml 4.x does not implement maxAliasCount. Alias-bomb defense is
    // enforced downstream by renderer/safety.ts (MAX_NODES=5000).
    const doc = yaml.load(source, { schema: yaml.DEFAULT_SCHEMA });
    if (doc === null || doc === undefined) return { ok: true, doc: {} };
    if (typeof doc !== "object" || Array.isArray(doc)) {
      return {
        ok: false,
        error: { kind: "yaml", message: "Top-level must be a mapping", loc: { line: 1, col: 1 } },
      };
    }
    return { ok: true, doc: doc as Record<string, unknown> };
  } catch (e) {
    const err = e as yaml.YAMLException;
    return {
      ok: false,
      error: {
        kind: "yaml",
        message: err.reason || err.message,
        loc: err.mark ? { line: err.mark.line + 1, col: err.mark.column + 1 } : undefined,
      },
    };
  }
}
