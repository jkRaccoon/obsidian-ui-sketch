// src/main.ts
import { Plugin } from "obsidian";
import { installBuiltinComponents } from "@/components";
import { renderSource } from "@/renderer";
import { DEFAULT_SETTINGS, UiSketchSettingTab, type UiSketchSettings } from "@/settings";

export default class UiSketchPlugin extends Plugin {
  settings: UiSketchSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    installBuiltinComponents();
    await this.loadSettingsData();

    this.registerMarkdownCodeBlockProcessor("ui-sketch", (source, el) => {
      const frame = renderSource(applyDefaults(source, this.settings));
      if (this.settings.compact) frame.classList.add("uis-compact");
      requestAnimationFrame(() => {
        el.replaceChildren(frame);
      });
    });

    this.addSettingTab(new UiSketchSettingTab(this.app, this));
  }

  async loadSettingsData(): Promise<void> {
    const data = (await this.loadData()) as Partial<UiSketchSettings> | undefined;
    this.settings = { ...DEFAULT_SETTINGS, ...(data ?? {}) };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}

function applyDefaults(source: string, settings: UiSketchSettings): string {
  // If the block omits top-level viewport, prepend it from settings.
  // Kept minimal in v0.1 — rich merging is Plan 2 territory.
  if (/^\s*viewport\s*:/m.test(source)) return source;
  if (source.trim() === "") return source;
  return `viewport: ${settings.defaultViewport}\n${source}`;
}
