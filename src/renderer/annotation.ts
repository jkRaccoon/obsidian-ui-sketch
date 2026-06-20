import { createMarkerBadge } from "@/components/marker";

export interface Annotations {
  /** Native-title note — renders an `ℹ` dot pinned top-right. */
  note?: string;
  /** Numbered description marker — pinned top-left, with an optional hover tooltip. */
  mark?: string | number;
  /** Hover description text for `mark`. */
  markText?: string;
}

/**
 * Wraps a rendered component with its corner annotations. The `note` dot (native
 * `title`, top-right) and the numbered `mark` badge (CSS tooltip, top-left) live
 * in different corners so they never collide. Returns `el` untouched when there
 * is nothing to annotate.
 */
export function wrapWithAnnotation(el: HTMLElement, ann: Annotations): HTMLElement {
  const hasNote = typeof ann.note === "string" && ann.note.length > 0;
  const hasMark = ann.mark !== undefined && ann.mark !== null && String(ann.mark).length > 0;
  if (!hasNote && !hasMark) return el;

  const wrapper = createDiv({ cls: "uis-annotated" });
  wrapper.appendChild(el);

  if (hasNote) {
    wrapper.setAttribute("title", ann.note as string);
    const dot = wrapper.createSpan({ cls: "uis-note-dot", text: "ℹ" });
    dot.setAttribute("aria-hidden", "true");
  }

  if (hasMark) {
    const text = typeof ann.markText === "string" ? ann.markText : undefined;
    wrapper.appendChild(createMarkerBadge(String(ann.mark), text, "primary", { pin: true }));
  }

  return wrapper;
}
