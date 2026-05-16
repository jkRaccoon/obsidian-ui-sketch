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
    const el = createEl("table", { cls: "uis-table" });
    const columns = Array.isArray(props.columns) ? (props.columns as string[]) : [];
    const rows = Array.isArray(props.rows) ? (props.rows as string[][]) : [];
    if (columns.length > 0) {
      const thead = el.createEl("thead");
      const tr = thead.createEl("tr");
      for (const c of columns) {
        tr.createEl("th", { text: c });
      }
    }
    const tbody = el.createEl("tbody");
    for (const row of rows) {
      const tr = tbody.createEl("tr");
      for (const cell of row) {
        tr.createEl("td", { text: String(cell) });
      }
    }
    return el;
  },
};
