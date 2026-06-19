// src/styler/fit.ts
import type { ValidatedDoc } from "@/types";

// 컨테이너 폭 대비 frame 자연 폭으로 적용할 배율을 계산한다.
// 축소만 한다(1을 초과하지 않음). 비정상 입력은 1(그대로)로 방어한다.
export function computeScale(containerWidth: number, frameWidth: number): number {
  if (frameWidth <= 0 || containerWidth <= 0) return 1;
  return Math.min(1, containerWidth / frameWidth);
}

// frame을 .uis-scaler 컨테이너로 감싼다. scaler가 노트 컬럼 폭(100%)을
// 차지하고, 내부 frame은 고정 px 너비를 유지한다. data-fit으로 모드를 표시한다.
export function wrapScaler(frame: HTMLElement, doc: ValidatedDoc): HTMLElement {
  const scaler = createDiv({ cls: "uis-scaler" });
  scaler.setAttribute("data-fit", doc.fit);
  scaler.appendChild(frame);
  return scaler;
}
