import type { LayoutNode, ComponentNode, RowNode, ColNode, GridNode } from "@/types";

export interface LayoutParseError {
  message: string;
  path: string;
}

export type LayoutParseResult =
  | { ok: true; nodes: LayoutNode[] }
  | { ok: false; error: LayoutParseError };

export function parseLayoutArray(raw: unknown, path = "screen"): LayoutParseResult {
  if (!Array.isArray(raw)) {
    return { ok: false, error: { message: "expected an array", path } };
  }
  const nodes: LayoutNode[] = [];
  for (let i = 0; i < raw.length; i++) {
    const entry = raw[i];
    const subPath = `${path}[${i}]`;
    if (!isPlainObject(entry)) {
      return { ok: false, error: { message: "entry must be an object", path: subPath } };
    }
    const keys = Object.keys(entry);
    if (keys.length !== 1) {
      return {
        ok: false,
        error: { message: `entry must have exactly one key, got ${keys.length}`, path: subPath },
      };
    }
    const key = keys[0];
    const value = (entry as Record<string, unknown>)[key];
    const child = parseEntry(key, value, subPath);
    if (!child.ok) return child;
    nodes.push(child.node);
  }
  return { ok: true, nodes };
}

export function parseGrid(raw: unknown, path = "screen"): { ok: true; grid: GridNode } | { ok: false; error: LayoutParseError } {
  if (!isPlainObject(raw)) return { ok: false, error: { message: "grid must be an object", path } };
  const { areas, cols, rows, map } = raw as Record<string, unknown>;
  if (!Array.isArray(areas) || !areas.every((a) => typeof a === "string")) {
    return { ok: false, error: { message: "grid.areas must be a string array", path: `${path}.areas` } };
  }
  if (!isPlainObject(map)) {
    return { ok: false, error: { message: "grid.map must be an object", path: `${path}.map` } };
  }
  const cMap: Record<string, ComponentNode> = {};
  for (const [name, entry] of Object.entries(map)) {
    if (!isPlainObject(entry)) {
      return { ok: false, error: { message: "map value must be an object", path: `${path}.map.${name}` } };
    }
    const keys = Object.keys(entry);
    if (keys.length !== 1) {
      return { ok: false, error: { message: "map entry must have one key", path: `${path}.map.${name}` } };
    }
    const type = keys[0];
    cMap[name] = { kind: "component", type, props: ((entry as Record<string, unknown>)[type] ?? {}) as Record<string, unknown> };
  }
  return {
    ok: true,
    grid: {
      kind: "grid",
      areas: areas as string[],
      cols: typeof cols === "string" ? cols : undefined,
      rows: typeof rows === "string" ? rows : undefined,
      map: cMap,
    },
  };
}

function parseEntry(key: string, value: unknown, path: string): { ok: true; node: LayoutNode } | { ok: false; error: LayoutParseError } {
  if (key === "row" || key === "col") {
    if (!isPlainObject(value)) {
      return { ok: false, error: { message: `${key} must be an object`, path } };
    }
    const v = value as Record<string, unknown>;
    const items = parseLayoutArray(v.items ?? [], `${path}.items`);
    if (!items.ok) return items;
    const node = key === "row"
      ? ({ kind: "row", gap: typeof v.gap === "number" ? v.gap : undefined, items: items.nodes } as RowNode)
      : ({ kind: "col", flex: typeof v.flex === "number" ? v.flex : undefined, items: items.nodes } as ColNode);
    return { ok: true, node };
  }
  // anything else is a component entry
  const props = isPlainObject(value) ? (value as Record<string, unknown>) : {};
  const node: ComponentNode = { kind: "component", type: key, props };
  return { ok: true, node };
}

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
