export interface Loc { line: number; col: number; }

export interface ComponentNode {
  kind: "component";
  type: string;
  props: Record<string, unknown>;
  loc?: Loc;
}

export interface RowNode {
  kind: "row";
  gap?: number;
  items: LayoutNode[];
  loc?: Loc;
}

export interface ColNode {
  kind: "col";
  flex?: number;
  items: LayoutNode[];
  loc?: Loc;
}

export interface GridNode {
  kind: "grid";
  areas: string[];
  cols?: string;
  rows?: string;
  map: Record<string, ComponentNode>;
  loc?: Loc;
}

export type LayoutNode = RowNode | ColNode | GridNode | ComponentNode;

export type ViewportKind = "desktop" | "tablet" | "mobile" | "custom";

export interface ValidatedDoc {
  viewport: ViewportKind;
  width?: number;
  height?: number;
  theme: "adaptive";
  background: "default" | "muted" | "transparent";
  screen: LayoutNode[] | GridNode;
}

export interface BaseProps {
  id?: string;
  w?: number | string;
  h?: number | string;
  align?: "start" | "center" | "end";
  pad?: number | string;
  note?: string;
  muted?: boolean;
}
