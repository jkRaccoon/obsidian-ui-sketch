export const MAX_DEPTH = 32;
export const MAX_NODES = 5000;

export type SafetyResult =
  | { ok: true; count: number }
  | { ok: false; reason: "depth" | "count" };

export function countAndCheckDepth(root: unknown): SafetyResult {
  const counter = { n: 0 };
  return walk(root, 0, counter);
}

function walk(node: unknown, depth: number, counter: { n: number }): SafetyResult {
  if (depth > MAX_DEPTH) return { ok: false, reason: "depth" };
  counter.n++;
  if (counter.n > MAX_NODES) return { ok: false, reason: "count" };

  if (Array.isArray(node)) {
    for (const item of node) {
      const r = walk(item, depth + 1, counter);
      if (!r.ok) return r;
    }
  } else if (typeof node === "object" && node !== null) {
    for (const v of Object.values(node as Record<string, unknown>)) {
      const r = walk(v, depth + 1, counter);
      if (!r.ok) return r;
    }
  }
  return { ok: true, count: counter.n };
}
