import { z } from "zod";
import type { ComponentDef } from "./registry";
import { BasePropsSchema } from "@/schema/base";

const VARIANTS = ["default", "primary", "success", "warning", "danger"] as const;

// `num` (not `n`) is deliberate: the parser runs YAML 1.1, where the plain
// scalar `n` resolves to the boolean `false`, so a `n:` key would never survive
// parsing. See docs/components/display.md.
export const MarkerSchema = BasePropsSchema.extend({
  num: z.union([z.number(), z.string()]).optional(),
  text: z.string().optional(),
  variant: z.enum(VARIANTS).optional(),
}).passthrough();

/**
 * Shared DOM builder for the numbered description badge. Used both by the
 * standalone `marker` component and by the `mark` base-prop overlay
 * (`renderer/annotation.ts`), so the two stay visually identical.
 *
 * Returns `<span class="uis-marker …">` with a label span and, when `text` is
 * given, an absolutely-positioned `.uis-marker__tip` revealed on hover (pure
 * CSS — no runtime state). Pass `{ pin: true }` for the overlay variant that
 * pins to a host block's corner.
 */
export function createMarkerBadge(
  label: string,
  text?: string,
  variant = "primary",
  opts: { pin?: boolean } = {},
): HTMLSpanElement {
  const cls = `uis-marker uis-marker--${variant}${opts.pin ? " uis-marker--pin" : ""}`;
  const badge = createSpan({ cls });
  badge.createSpan({ cls: "uis-marker__label", text: label });
  if (text) {
    const tip = badge.createSpan({ cls: "uis-marker__tip", text });
    tip.setAttribute("role", "tooltip");
  }
  return badge;
}

function labelText(n: unknown): string {
  if (typeof n === "number") return String(n);
  if (typeof n === "string" && n.length > 0) return n;
  return "ℹ";
}

export const MarkerDef: ComponentDef = {
  type: "marker",
  schema: MarkerSchema,
  render(props) {
    const text = typeof props.text === "string" ? props.text : undefined;
    const variant = typeof props.variant === "string" ? props.variant : "primary";
    return createMarkerBadge(labelText(props.num), text, variant);
  },
};
