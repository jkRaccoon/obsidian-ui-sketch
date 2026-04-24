// src/settings.ts
import { App, PluginSettingTab, Setting, Plugin } from "obsidian";
import type { ViewportKind } from "@/types";

export interface UiSketchSettings {
  defaultViewport: ViewportKind;
  defaultTheme: "adaptive";
  compact: boolean;
  verbose: boolean;
}

export const DEFAULT_SETTINGS: UiSketchSettings = {
  defaultViewport: "desktop",
  defaultTheme: "adaptive",
  compact: false,
  verbose: false,
};

export interface SettingsHost extends Plugin {
  settings: UiSketchSettings;
  saveSettings(): Promise<void>;
}

export class UiSketchSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly host: SettingsHost) {
    super(app, host);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "UI Sketch" });

    new Setting(containerEl)
      .setName("Default viewport")
      .setDesc("Used when a block omits the viewport key.")
      .addDropdown((d) => {
        d.addOption("desktop", "Desktop")
          .addOption("tablet", "Tablet")
          .addOption("mobile", "Mobile")
          .addOption("custom", "Custom")
          .setValue(this.host.settings.defaultViewport)
          .onChange(async (v) => {
            this.host.settings.defaultViewport = v as ViewportKind;
            await this.host.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Default theme")
      .setDesc("v0.1 only supports 'adaptive'.")
      .addText((t) => {
        t.setDisabled(true).setValue(this.host.settings.defaultTheme);
      });

    new Setting(containerEl)
      .setName("Compact mode")
      .setDesc("Scale spacing and fonts down ×0.875.")
      .addToggle((tog) =>
        tog.setValue(this.host.settings.compact).onChange(async (v) => {
          this.host.settings.compact = v;
          await this.host.saveSettings();
        }),
      );

    new Setting(containerEl)
      .setName("Verbose logging")
      .setDesc("Print debug traces to developer console.")
      .addToggle((tog) =>
        tog.setValue(this.host.settings.verbose).onChange(async (v) => {
          this.host.settings.verbose = v;
          await this.host.saveSettings();
        }),
      );
  }
}
