// src/components/registry.ts
import type { ZodType } from "zod";

export interface ComponentRenderCtx {
  muted?: boolean;
}

export interface ComponentDef {
  type: string;
  schema?: ZodType<Record<string, unknown>>;
  render(props: Record<string, unknown>, ctx: ComponentRenderCtx): HTMLElement;
}

const defs = new Map<string, ComponentDef>();

export function register(def: ComponentDef): void {
  defs.set(def.type, def);
}

export function lookup(type: string): ComponentDef | undefined {
  return defs.get(type);
}

export function registeredTypes(): string[] {
  return [...defs.keys()].sort();
}
