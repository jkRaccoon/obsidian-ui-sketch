import type { Loc } from "@/types";

export interface YamlError { kind: "yaml"; message: string; loc?: Loc; }
export interface StructureError { kind: "structure"; message: string; path: string; }
export type BlockError = YamlError | StructureError;
