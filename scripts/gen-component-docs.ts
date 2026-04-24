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

type Lang = "en" | "ko";

/**
 * Central description tables, keyed by language. Prefer adding `.describe("...")`
 * to the zod field directly — these dicts are a fallback for schemas that
 * haven't been annotated yet. The English table is also what `getZodDescription`
 * falls through to; the Korean table replaces descriptions when the script
 * is regenerating a `docs/ko/**` file.
 */
const DESCRIPTIONS: Record<Lang, Record<string, Record<string, string>>> = {
  en: {
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
  },
  ko: {
    card:        { title: "카드 헤딩", body: "카드 본문 텍스트" },
    panel:       { header: "패널 헤더 텍스트" },
    divider:     { orientation: "구분선 방향" },
    spacer:      { size: "간격 크기 (픽셀)" },
    navbar:      { brand: "브랜드/로고 텍스트 (왼쪽)", items: "메뉴 항목 (오른쪽)" },
    sidebar:     { items: "메뉴 항목", active: "활성 항목 — 라벨 또는 0-based 인덱스" },
    tabs:        { items: "탭 라벨", active: "활성 탭 — 라벨 또는 0-based 인덱스" },
    breadcrumb:  { items: "루트에서 현재까지의 세그먼트" },
    pagination:  { current: "현재 페이지 (1-based)", total: "전체 페이지 수" },
    stepper:     { items: "단계 라벨", active: "활성 단계의 0-based 인덱스" },
    button:      { label: "버튼 텍스트", variant: "시각 스타일", icon: "아이콘 라벨 (v0.2는 텍스트만)" },
    input:       { placeholder: "비었을 때 표시", value: "미리 채운 값" },
    textarea:    { placeholder: "비었을 때 표시", value: "미리 채운 값", rows: "표시할 행 수 (높이에 영향)" },
    select:      { placeholder: "값이 선택되지 않았을 때", value: "선택된 값", options: "선택지" },
    checkbox:    { label: "박스 옆 라벨", checked: "체크 여부" },
    radio:       { label: "라벨 텍스트", selected: "이 라디오가 선택되었는지" },
    toggle:      { label: "라벨 텍스트", on: "스위치가 켜져 있는지" },
    slider:      { value: "현재 값", min: "최소값 (기본 0)", max: "최대값 (기본 100)" },
    "date-picker": { value: "미리 설정된 날짜 (자유 형식 문자열 — 파싱 안 함)", placeholder: "비었을 때 표시" },
    "file-upload": { label: "드롭존 안 텍스트" },
    search:      { value: "미리 채운 쿼리", placeholder: "비었을 때 표시" },
    heading:     { text: "헤딩 텍스트", level: "1–6, HTML h1–h6과 매칭" },
    text:        { value: "텍스트 내용", tone: "강조 스타일" },
    image:       { src: "이미지 URL (호버/title에만 표시)", alt: "Alt 텍스트" },
    icon:        { name: "아이콘 식별자 텍스트", size: "박스 크기 (픽셀)" },
    avatar:      { name: "표시 이름 — 이니셜이 여기서 도출됨", size: "지름 (픽셀)" },
    badge:       { label: "뱃지 텍스트", variant: "시각 스타일" },
    tag:         { label: "태그 텍스트" },
    kbd:         { keys: "단축키의 키들" },
    alert:       { title: "알림 제목", message: "알림 본문", severity: "색상/아이콘 스타일" },
    progress:    { value: "퍼센트 0–100", label: "옆에 표시할 옵션 라벨" },
    toast:       { message: "토스트 본문", severity: "색상 스타일" },
    modal:       { title: "다이얼로그 제목", body: "다이얼로그 본문" },
    skeleton:    { width: "shimmer 영역 너비", height: "shimmer 영역 높이" },
    table:       { columns: "컬럼 헤더 라벨", rows: "각 행은 columns와 1:1 정렬된 문자열 배열" },
    list:        { items: "리스트 항목", ordered: "true면 번호 (ol), false면 글머리 (ul)" },
    tree:        { items: "최상위 트리 항목; 각각 label과 옵션 children" },
    "kv-list":   { items: "[키, 값] 쌍 배열" },
    chart:       { kind: "제안할 모양", label: "차트 위/아래에 표시되는 캡션" },
    placeholder: { label: "중앙에 표시되는 캡션 텍스트" },
    raw:         { html: "sanitize된 HTML (sanitize-html 통과)", text: "순수 텍스트 — textContent만" },
  },
};

const I18N = {
  en: {
    headers: { prop: "Prop", type: "Type", description: "Description" },
    noProps: "_No component-specific props — accepts [base props](../yaml-reference.md#base-props) only._",
  },
  ko: {
    headers: { prop: "프롭", type: "타입", description: "설명" },
    noProps: "_컴포넌트별 프롭 없음 — [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)만 받습니다._",
  },
} as const;

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

function extractFields(type: string, schema: ZodTypeAny, baseFieldNames: Set<string>, lang: Lang): FieldInfo[] {
  const shape = (schema as any)._def?.shape?.();
  if (!shape) return [];
  const langMap = DESCRIPTIONS[lang][type] ?? {};
  const enFallback = DESCRIPTIONS.en[type] ?? {};
  const fields: FieldInfo[] = [];
  for (const [name, field] of Object.entries(shape)) {
    if (baseFieldNames.has(name)) continue;
    const typed = field as ZodTypeAny;
    // zod .describe() wins, then the language-specific dict, then English fallback.
    const description = getZodDescription(typed) ?? langMap[name] ?? enFallback[name] ?? "";
    fields.push({ name, type: zodTypeToString(typed), description });
  }
  return fields;
}

function renderTable(fields: FieldInfo[], lang: Lang): string {
  if (fields.length === 0) return I18N[lang].noProps;
  const h = I18N[lang].headers;
  const rows = fields.map((f) => `| \`${f.name}\` | ${f.type} | ${f.description} |`);
  return [
    `| ${h.prop} | ${h.type} | ${h.description} |`,
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
    const lang: Lang = docsRoot.includes(path.sep + "ko" + path.sep) ? "ko" : "en";

    for (const fileName of files) {
      const filePath = path.join(docsRoot, fileName);
      let content = fs.readFileSync(filePath, "utf8");
      let changed = false;

      for (const type of registeredTypes()) {
        const startMarker = `<!-- gen:props type=${type} -->`;
        if (!content.includes(startMarker)) continue;

        const def = lookup(type);
        if (!def || !def.schema) continue;

        const fields = extractFields(type, def.schema as ZodTypeAny, baseFieldNames, lang);
        const table = renderTable(fields, lang);
        const updated = replaceMarkedBlock(content, type, table);
        if (updated !== content) {
          content = updated;
          changed = true;
        }
        summary.push({ type, file: `${rel}/${fileName}`, fields: fields.length });
      }

      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`updated  ${rel}/${fileName} [${lang}]`);
      } else {
        console.log(`up-to-date  ${rel}/${fileName} [${lang}]`);
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
