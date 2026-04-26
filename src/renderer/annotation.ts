export function wrapWithAnnotation(el: HTMLElement, note: string | undefined): HTMLElement {
  if (!note) return el;
  const wrapper = document.createElement("div");
  wrapper.className = "uis-annotated";
  wrapper.setAttribute("title", note);
  wrapper.appendChild(el);
  const dot = document.createElement("span");
  dot.className = "uis-note-dot";
  dot.textContent = "ℹ";
  dot.setAttribute("aria-hidden", "true");
  wrapper.appendChild(dot);
  return wrapper;
}
