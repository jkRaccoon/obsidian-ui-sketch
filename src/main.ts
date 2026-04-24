import { Plugin } from "obsidian";

export default class UiSketchPlugin extends Plugin {
  async onload(): Promise<void> {
    this.registerMarkdownCodeBlockProcessor("ui-sketch", (source, el, _ctx) => {
      el.createDiv({ text: "ui-sketch boot OK" });
    });
  }
}
