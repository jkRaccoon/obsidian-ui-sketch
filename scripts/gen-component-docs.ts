// scripts/gen-component-docs.ts
//
// Regenerates the prop tables in docs/components/*.md from the live zod
// schemas. Run with:  yarn gen:docs
//
// Each component-specific prop is read from the ComponentDef's zod schema.
// Descriptions come from either a zod .describe() on the field, or the
// DESCRIPTIONS fallback table below. Only fields registered here show up
// in the generated table — base props (id/w/h/align/pad/note/muted) are
// filtered out because they live in the shared yaml-reference.md.
//
// Each docs/components/*.md file declares where its prop tables go with
// markers like:
//
//   <!-- gen:props type=button -->
//   ...table content is regenerated here...
//   <!-- /gen:props -->

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { ZodTypeAny } from "zod";

import { installBuiltinComponents, lookup, registeredTypes } from "../src/components";
import { BasePropsSchema } from "../src/schema/base";

installBuiltinComponents();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsComponentDirs = [
  path.resolve(__dirname, "..", "docs", "components"),
  path.resolve(__dirname, "..", "docs", "ko", "components"),
];

/**
 * Central description table. Prefer adding `.describe("...")` to the zod
 * field directly — this dict is a fallback for schemas that haven't been
 * annotated yet.
 */
const DESCRIPTIONS: Record<string, Record<string, string>> = {
  card:        { title: "Card heading", body: "Card body text" },
  panel:       { header: "Panel header text" },
  divider:     { orientation: "Direction of the rule" },
  spacer:      { size: "Gap size in pixels" },
  navbar:      { brand: "Brand/logo text (left side)", items: "Menu items (right side)" },
  sidebar:     { items: "Menu entries", active: "Active entry — label or zero-based index" },
  tabs:        { items: "Tab labels", active: "Active tab — label or zero-based index" },
  breadcrumb:  { items: "Segments from root to current" },
  pagination:  { current: "Current page (1-based)", total: "Total page count" },
  stepper:     { items: "Step labels", active: "Zero-based index of the active step" },
  button:      { label: "Button text", variant: "Visual style", icon: "Icon label (text only in v0.2)" },
  input:       { placeholder: "Shown when empty", value: "Pre-filled value" },
  textarea:    { placeholder: "Shown when empty", value: "Pre-filled value", rows: "Visible rows (affects height)" },
  select:      { placeholder: "Shown when no value selected", value: "Selected value", options: "Available options" },
  checkbox:    { label: "Label next to the box", checked: "Whether the box is ticked" },
  radio:       { label: "Label text", selected: "Whether this radio is selected" },
  toggle:      { label: "Label text", on: "Whether the switch is on" },
  slider:      { value: "Current value", min: "Minimum (default 0)", max: "Maximum (default 100)" },
  "date-picker": { value: "Preset date (free-form string — not parsed)", placeholder: "Shown when empty" },
  "file-upload": { label: "Text shown inside the dropzone" },
  search:      { value: "Pre-filled query", placeholder: "Shown when empty" },
  heading:     { text: "Heading text", level: "1–6, matching HTML h1–h6" },
  text:        { value: "Text content", tone: "Emphasis style" },
  image:       { src: "Image URL (shown in hover/title only)", alt: "Alt text" },
  icon:        { name: "Icon identifier text", size: "Box size in pixels" },
  avatar:      { name: "Display name — initials are derived from it", size: "Diameter in pixels" },
  badge:       { label: "Badge text", variant: "Visual style" },
  tag:         { label: "Tag text" },
  kbd:         { keys: "Keys in the shortcut" },
  alert:       { title: "Alert title", message: "Alert body text", severity: "Color/icon style" },
  progress:    { value: "Percentage 0–100", label: "Optional label shown alongside" },
  toast:       { message: "Toast body", severity: "Color style" },
  modal:       { title: "Dialog title", body: "Dialog body text" },
  skeleton:    { width: "Width of the shimmer area", height: "Height of the shimmer area" },
  table:       { columns: "Column header labels", rows: "Each row is an array of strings aligned 1:1 with columns" },
  list:        { items: "List entries", ordered: "true for numbered (ol), otherwise bulleted (ul)" },
  tree:        { items: "Top-level tree entries; each has label and optional children" },
  "kv-list":   { items: "Array of [key, value] pairs" },
  chart:       { kind: "Shape to suggest", label: "Caption shown on or below the chart" },
  placeholder: { label: "Caption text shown centered" },
  raw:         { html: "Sanitized HTML (piped through sanitize-html)", text: "Plain text — textContent only" },
};

interface FieldInfo {
  name: string;
  type: string;
  description: string;
}

function getZodDescription(t: ZodTypeAny): string | undefined {
  let current: any = t;
  while (current?._def) {
    if (current._def.description) return current._def.description;
    if (current._def.typeName === "ZodOptional" || current._def.typeName === "ZodDefault") {
      current = current._def.innerType;
    } else {
      break;
    }
  }
  return undefined;
}

function zodTypeToString(t: ZodTypeAny): string {
  const def: any = (t as any)._def;
  if (!def) return "unknown";
  switch (def.typeName) {
    case "ZodOptional":
    case "ZodDefault":
    case "ZodNullable":
      return zodTypeToString(def.innerType);
    case "ZodString":  return "string";
    case "ZodNumber":  return "number";
    case "ZodBoolean": return "boolean";
    case "ZodEnum":
      return (def.values as string[]).map((v) => `\`"${v}"\``).join(" \\| ");
    case "ZodArray":
      return `${zodTypeToString(def.type)}[]`;
    case "ZodUnion":
      return (def.options as ZodTypeAny[]).map(zodTypeToString).join(" \\| ");
    case "ZodTuple":
      return `[${(def.items as ZodTypeAny[]).map(zodTypeToString).join(", ")}]`;
    case "ZodObject":  return "object";
    case "ZodLazy":    return zodTypeToString(def.getter());
    case "ZodAny":     return "any";
    default:           return String(def.typeName ?? "unknown");
  }
}

function extractFields(type: string, schema: ZodTypeAny, baseFieldNames: Set<string>): FieldInfo[] {
  const shape = (schema as any)._def?.shape?.();
  if (!shape) return [];
  const descMap = DESCRIPTIONS[type] ?? {};
  const fields: FieldInfo[] = [];
  for (const [name, field] of Object.entries(shape)) {
    if (baseFieldNames.has(name)) continue;
    const typed = field as ZodTypeAny;
    const description = getZodDescription(typed) ?? descMap[name] ?? "";
    fields.push({ name, type: zodTypeToString(typed), description });
  }
  return fields;
}

function renderTable(fields: FieldInfo[]): string {
  if (fields.length === 0) {
    return "_No component-specific props — accepts [base props](../yaml-reference.md#base-props) only._";
  }
  const rows = fields.map((f) => `| \`${f.name}\` | ${f.type} | ${f.description} |`);
  return [
    "| Prop | Type | Description |",
    "|---|---|---|",
    ...rows,
  ].join("\n");
}

function replaceMarkedBlock(content: string, type: string, body: string): string {
  const startMarker = `<!-- gen:props type=${type} -->`;
  const endMarker = `<!-- /gen:props -->`;
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker, startIdx + startMarker.length);
  if (startIdx < 0 || endIdx < 0) return content;
  const head = content.slice(0, startIdx + startMarker.length);
  const tail = content.slice(endIdx);
  return `${head}\n${body}\n${tail}`;
}

function main(): void {
  const baseShape = (BasePropsSchema as any)._def?.shape?.();
  const baseFieldNames = new Set(baseShape ? Object.keys(baseShape) : []);

  const summary: { type: string; file: string; fields: number }[] = [];

  for (const docsRoot of docsComponentDirs) {
    if (!fs.existsSync(docsRoot)) continue;
    const files = fs.readdirSync(docsRoot).filter((f) => f.endsWith(".md") && f !== "README.md");
    const rel = path.relative(path.resolve(__dirname, ".."), docsRoot);

    for (const fileName of files) {
      const filePath = path.join(docsRoot, fileName);
      let content = fs.readFileSync(filePath, "utf8");
      let changed = false;

      for (const type of registeredTypes()) {
        const startMarker = `<!-- gen:props type=${type} -->`;
        if (!content.includes(startMarker)) continue;

        const def = lookup(type);
        if (!def || !def.schema) continue;

        const fields = extractFields(type, def.schema as ZodTypeAny, baseFieldNames);
        const table = renderTable(fields);
        const updated = replaceMarkedBlock(content, type, table);
        if (updated !== content) {
          content = updated;
          changed = true;
        }
        summary.push({ type, file: `${rel}/${fileName}`, fields: fields.length });
      }

      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`updated  ${rel}/${fileName}`);
      } else {
        console.log(`up-to-date  ${rel}/${fileName}`);
      }
    }
  }

  // Flag any registered components that have no doc block yet — useful when
  // someone adds a new component and forgets to add docs.
  const covered = new Set(summary.map((s) => s.type));
  const orphans = registeredTypes().filter((t) => !covered.has(t));
  if (orphans.length > 0) {
    console.log(`\nNo docs marker for these types: ${orphans.join(", ")}`);
    process.exitCode = 1;
  }

  console.log(`\nGenerated tables for ${summary.length} components`);
}

main();
