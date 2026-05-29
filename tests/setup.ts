// vitest setupFiles entry. The Obsidian DOM polyfill lives in a shared module
// (so the screenshot/preview harness can reuse it); importing it here installs
// the polyfill — and its `declare global` types — before any test runs.
import "./dom-polyfill";
