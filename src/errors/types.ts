// src/errors/types.ts
import type { Loc } from "@/types";

export interface YamlError { kind: "yaml"; message: string; loc?: Loc; }
export interface StructureError { kind: "structure"; message: string; path: string; }
export interface ComponentError {
  kind: "component";
  componentType: string;
  message: string;
  path: string;
  suggestion?: string;
}

export type BlockError = YamlError | StructureError;
export type InlineError = ComponentError;
