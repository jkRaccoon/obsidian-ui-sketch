// src/main.ts
import { Plugin, MarkdownRenderChild } from "obsidian";
import { installBuiltinComponents } from "@/components";
import { renderSource } from "@/renderer";
import { DEFAULT_SETTINGS, UiSketchSettingTab, type UiSketchSettings } from "@/settings";
import { computeScale } from "@/styler/fit";

export default class UiSketchPlugin extends Plugin {
  settings: UiSketchSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    installBuiltinComponents();
    await this.loadSettingsData();

    this.registerMarkdownCodeBlockProcessor("ui-sketch", (source, el, ctx) => {
      const scaler = renderSource(applyDefaults(source, this.settings));
      if (this.settings.compact) {
        scaler.querySelector(".uis-frame")?.classList.add("uis-compact");
      }
      window.requestAnimationFrame(() => {
        el.replaceChildren(scaler);
        ctx.addChild(new FitController(scaler));
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
  if (/^viewport\s*:/m.test(source)) return source;
  if (source.trim() === "") return source;
  return `viewport: ${settings.defaultViewport}\n${source}`;
}

// 컨테이너(노트 컬럼) 폭을 ResizeObserver로 감지해 frame에 transform: scale을
// 적용한다. fit: none이거나 ResizeObserver가 없으면(테스트 환경) no-op.
// MarkdownRenderChild라서 블록이 다시 렌더되면 옵시디언이 onunload로 정리한다.
class FitController extends MarkdownRenderChild {
  private observer?: ResizeObserver;
  private lastWidth = -1;

  constructor(private readonly scaler: HTMLElement) {
    super(scaler);
  }

  onload(): void {
    if (typeof ResizeObserver === "undefined") return;
    if (this.scaler.getAttribute("data-fit") !== "width") return;
    const frame = this.scaler.querySelector<HTMLElement>(".uis-frame");
    if (!frame) return;
    this.observer = new ResizeObserver(() => this.apply(frame));
    this.observer.observe(this.scaler);
  }

  onunload(): void {
    this.observer?.disconnect();
  }

  private apply(frame: HTMLElement): void {
    const containerWidth = this.scaler.clientWidth;
    // height 보정이 scaler 크기를 바꿔 콜백이 재진입해도 폭은 그대로이므로
    // 같은 폭이면 즉시 빠져나가 무한 루프를 막는다. 이 가드는 frame의
    // 자연 폭이 블록 수명 동안 고정(viewport px)이라는 전제에 의존한다 —
    // 컨테이너 폭만 바뀔 때 재계산하면 충분하다.
    if (containerWidth === this.lastWidth) return;
    this.lastWidth = containerWidth;

    // offsetWidth/offsetHeight는 transform의 영향을 받지 않는 자연 크기다.
    // transform을 쓰기 전에 둘 다 미리 읽어 의도를 명확히 한다.
    const frameWidth = frame.offsetWidth;
    const frameHeight = frame.offsetHeight;
    const scale = computeScale(containerWidth, frameWidth);
    if (scale < 1) {
      frame.setCssStyles({ transformOrigin: "top left", transform: `scale(${scale})` });
      // transform은 레이아웃 박스를 원본 크기로 남기므로, 아래 빈 공간을
      // 없애기 위해 scaler 높이를 축소된 높이로 맞춘다.
      this.scaler.setCssStyles({ height: `${frameHeight * scale}px` });
    } else {
      frame.setCssStyles({ transform: "", transformOrigin: "" });
      this.scaler.setCssStyles({ height: "" });
    }
  }
}
