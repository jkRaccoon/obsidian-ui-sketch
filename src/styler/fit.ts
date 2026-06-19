// src/styler/fit.ts

// 컨테이너 폭 대비 frame 자연 폭으로 적용할 배율을 계산한다.
// 축소만 한다(1을 초과하지 않음). 비정상 입력은 1(그대로)로 방어한다.
export function computeScale(containerWidth: number, frameWidth: number): number {
  if (frameWidth <= 0 || containerWidth <= 0) return 1;
  return Math.min(1, containerWidth / frameWidth);
}
