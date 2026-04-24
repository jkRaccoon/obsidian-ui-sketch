// Browser-loadable entry for the screenshot harness. Exposes renderSource
// on the window so the playwright script can call it for each YAML sample.
import { renderSource } from "../src/renderer";
import { installBuiltinComponents } from "../src/components";

installBuiltinComponents();

declare global {
  interface Window {
    UiSketch: { renderSource: typeof renderSource };
  }
}

window.UiSketch = { renderSource };
