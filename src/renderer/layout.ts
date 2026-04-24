import type { LayoutNode, RowNode, ColNode, GridNode, ComponentNode } from "@/types";
import { lookup } from "@/components/registry";
import { wrapWithAnnotation } from "./annotation";

export function renderLayoutNodes(nodes: LayoutNode[]): HTMLElement {
  const root = document.createElement("div");
  root.className = "uis-flow";
  for (const n of nodes) root.appendChild(renderNode(n));
  return root;
}

export function renderNode(n: LayoutNode): HTMLElement {
  if ("kind" in n) {
    if (n.kind === "row") return renderRow(n);
    if (n.kind === "col") return renderCol(n);
    if (n.kind === "grid") return renderGrid(n);
    if (n.kind === "component") return renderComponent(n);
  }
  return placeholder("invalid node");
}

function renderRow(n: RowNode): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-row";
  if (typeof n.gap === "number") el.style.gap = `${n.gap}px`;
  for (const child of n.items) el.appendChild(renderNode(child));
  return el;
}

function renderCol(n: ColNode): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-col";
  if (typeof n.flex === "number") el.style.flex = `${n.flex} 1 0`;
  for (const child of n.items) el.appendChild(renderNode(child));
  return el;
}

export function renderGrid(n: GridNode): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-grid";
  el.style.display = "grid";
  el.style.gridTemplateAreas = n.areas.map((row) => `"${row}"`).join(" ");
  if (n.cols) el.style.gridTemplateColumns = n.cols;
  if (n.rows) el.style.gridTemplateRows = n.rows;
  for (const [name, node] of Object.entries(n.map)) {
    const cell = document.createElement("div");
    cell.className = "uis-grid__cell";
    cell.style.gridArea = name;
    cell.appendChild(renderComponent(node));
    el.appendChild(cell);
  }
  return el;
}

function renderComponent(n: ComponentNode): HTMLElement {
  const def = lookup(n.type);
  let inner: HTMLElement;
  if (!def) {
    inner = placeholder(`unknown: ${n.type}`);
  } else {
    inner = def.render(n.props, { muted: n.props.muted === true });
  }
  applyBaseLayout(inner, n.props);
  return wrapWithAnnotation(inner, typeof n.props.note === "string" ? n.props.note : undefined);
}

function applyBaseLayout(el: HTMLElement, props: Record<string, unknown>): void {
  if (typeof props.w === "number") el.style.width = `${props.w}px`;
  else if (typeof props.w === "string") el.style.width = props.w;
  if (typeof props.h === "number") el.style.height = `${props.h}px`;
  else if (typeof props.h === "string") el.style.height = props.h;
  if (typeof props.align === "string") el.style.alignSelf = props.align;
  if (props.muted === true) el.classList.add("uis-muted");
}

function placeholder(message: string): HTMLElement {
  const el = document.createElement("div");
  el.className = "uis-unknown";
  el.textContent = message;
  return el;
}
