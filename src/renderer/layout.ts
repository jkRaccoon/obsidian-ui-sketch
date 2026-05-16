// src/renderer/layout.ts
import type { LayoutNode, RowNode, ColNode, GridNode, ComponentNode } from "@/types";
import { lookup, registeredTypes } from "@/components/registry";
import { wrapWithAnnotation } from "./annotation";
import { renderInlineError } from "@/errors/render";
import { suggestType } from "@/schema/suggestions";

export function renderLayoutNodes(nodes: LayoutNode[], path = "screen"): HTMLElement {
  const root = createDiv({ cls: "uis-flow" });
  nodes.forEach((n, i) => root.appendChild(renderNode(n, `${path}[${i}]`)));
  return root;
}

export function renderNode(n: LayoutNode, path: string): HTMLElement {
  if ("kind" in n) {
    if (n.kind === "row") return renderRow(n, path);
    if (n.kind === "col") return renderCol(n, path);
    if (n.kind === "grid") return renderGrid(n, path);
    if (n.kind === "component") return renderComponent(n, path);
  }
  return placeholder("invalid node");
}

function renderRow(n: RowNode, path: string): HTMLElement {
  const el = createDiv({ cls: "uis-row" });
  if (typeof n.gap === "number") el.setCssStyles({ gap: `${n.gap}px` });
  n.items.forEach((child, i) => el.appendChild(renderNode(child, `${path}.items[${i}]`)));
  return el;
}

function renderCol(n: ColNode, path: string): HTMLElement {
  const el = createDiv({ cls: "uis-col" });
  if (typeof n.flex === "number") {
    // flex:0 means "size to content" — a fixed-width sidebar shouldn't
    // collapse to 0 or shrink. flex>0 keeps the classic grow/shrink behavior.
    el.setCssStyles({ flex: n.flex === 0 ? "0 0 auto" : `${n.flex} 1 0` });
  }
  n.items.forEach((child, i) => el.appendChild(renderNode(child, `${path}.items[${i}]`)));
  return el;
}

export function renderGrid(n: GridNode, path = "screen"): HTMLElement {
  const el = createDiv({ cls: "uis-grid" });
  const gridStyles: Partial<CSSStyleDeclaration> = {
    gridTemplateAreas: n.areas.map((row) => `"${row}"`).join(" "),
  };
  if (n.cols) gridStyles.gridTemplateColumns = n.cols;
  if (n.rows) gridStyles.gridTemplateRows = n.rows;
  el.setCssStyles(gridStyles);
  for (const [name, node] of Object.entries(n.map)) {
    const cell = el.createDiv({ cls: "uis-grid__cell" });
    cell.setCssStyles({ gridArea: name });
    cell.appendChild(renderComponent(node, `${path}.map.${name}`));
  }
  return el;
}

function renderComponent(n: ComponentNode, path: string): HTMLElement {
  const def = lookup(n.type);
  if (!def) {
    const suggestion = suggestType(n.type, registeredTypes());
    return renderInlineError({
      kind: "component",
      componentType: n.type,
      message: "unknown component type",
      path,
      suggestion,
    });
  }

  let props: Record<string, unknown> = n.props;
  if (def.schema) {
    const result = def.schema.safeParse(n.props);
    if (!result.success) {
      const first = result.error.errors[0];
      const fieldPath = first?.path.join(".") ?? "";
      const message = fieldPath ? `${fieldPath}: ${first.message}` : first?.message ?? "invalid props";
      return renderInlineError({
        kind: "component",
        componentType: n.type,
        message,
        path,
      });
    }
    props = result.data;
  }

  const inner = def.render(props, { muted: props.muted === true });
  applyBaseLayout(inner, props);
  return wrapWithAnnotation(inner, typeof props.note === "string" ? props.note : undefined);
}

function applyBaseLayout(el: HTMLElement, props: Record<string, unknown>): void {
  const styles: Partial<CSSStyleDeclaration> = {};
  if (typeof props.w === "number") styles.width = `${props.w}px`;
  else if (typeof props.w === "string") styles.width = props.w;
  if (typeof props.h === "number") styles.height = `${props.h}px`;
  else if (typeof props.h === "string") styles.height = props.h;
  if (typeof props.align === "string") styles.alignSelf = props.align;
  if (Object.keys(styles).length > 0) el.setCssStyles(styles);
  if (props.muted === true) el.classList.add("uis-muted");
}

function placeholder(message: string): HTMLElement {
  return createDiv({ cls: "uis-unknown", text: message });
}
