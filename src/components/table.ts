import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

export const TableSchema = BasePropsSchema.extend({
  columns: z.array(z.string()).optional(),
  rows: z.array(z.array(z.string())).optional(),
}).passthrough();

export const TableDef: ComponentDef = {
  type: "table",
  schema: TableSchema,
  render(props) {
    const el = document.createElement("table");
    el.className = "uis-table";
    const columns = Array.isArray(props.columns) ? (props.columns as string[]) : [];
    const rows = Array.isArray(props.rows) ? (props.rows as string[][]) : [];
    if (columns.length > 0) {
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      for (const c of columns) {
        const th = document.createElement("th");
        th.textContent = c;
        tr.appendChild(th);
      }
      thead.appendChild(tr);
      el.appendChild(thead);
    }
    const tbody = document.createElement("tbody");
    for (const row of rows) {
      const tr = document.createElement("tr");
      for (const cell of row) {
        const td = document.createElement("td");
        td.textContent = String(cell);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    el.appendChild(tbody);
    return el;
  },
};
