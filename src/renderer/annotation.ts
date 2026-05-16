export function wrapWithAnnotation(el: HTMLElement, note: string | undefined): HTMLElement {
  if (!note) return el;
  const wrapper = createDiv({ cls: "uis-annotated" });
  wrapper.setAttribute("title", note);
  wrapper.appendChild(el);
  const dot = wrapper.createSpan({ cls: "uis-note-dot", text: "ℹ" });
  dot.setAttribute("aria-hidden", "true");
  return wrapper;
}
