# fit-to-width 자동 축소 설계

- 날짜: 2026-06-19
- 대상: `src/styler/index.ts`, `src/schema/document.ts`, `src/main.ts`, `styles.css`, `src/types.ts` (신규: `src/styler/fit.ts`)
- 상태: 승인됨 (사용자 설계 승인 완료)

## 배경 / 문제

옵시디언 노트 컬럼은 보통 600~800px로 좁다. 그런데 frame은 viewport에 따라 **고정 너비**를 가진다 — desktop `1200px`, tablet `768px`, mobile `375px` (`src/styler/index.ts:3`), custom은 `width` px.

현재 `styles.css:10`의 `.uis-frame { max-width: 100% }` 때문에, frame이 노트 컬럼보다 넓으면 100%로 강제 축소되고 내부 flex/grid가 콘텐츠를 **짓눌러(squish)** 비례가 깨진다. 즉 "축소"가 아니라 "찌그러짐"이 일어나, desktop 와이어프레임이 좁은 노트에서 의도와 다르게 보인다.

**목표**: 좁은 노트에서도 넓은 디자인을 **비례를 유지한 채** 전체가 한눈에 보이도록 한다. 사용자 조작 없이 기본 동작으로.

## 비목표 (YAGNI)

- **인터랙티브 줌/팬** (마우스 휠 줌, 드래그 팬). `source → HTMLElement` 무상태 철학과 충돌. 도입하지 않는다.
- **업스케일** (`scale > 1`). 작은 mobile(375px)을 노트 폭까지 키우면 흐릿/과대해진다. **축소만**(`scale ≤ 1`) 한다.
- **세로 맞춤** (height 기준 fit). 가로(width) 기준만. 세로는 콘텐츠 길이대로 흐른다.
- **줌 슬라이더/버튼 UI**. 선언적 `fit` 프로퍼티 하나로 충분.

## 설계

### 동작 모델

문서 레벨 프로퍼티 `fit`로 두 모드:

- `fit: width` (**기본값**) — frame 자연 너비가 컨테이너보다 넓으면 `transform: scale()`로 비례 축소해 전체 표시. `scale = min(1, 컨테이너폭 / frame자연폭)`. 컨테이너보다 좁으면 `scale = 1` (그대로).
- `fit: none` (끄기) — 원본 픽셀 크기 유지. 컨테이너보다 넓으면 **가로 스크롤**(`overflow-x: auto`).

기존 `max-width: 100%` squish 동작은 **제거**한다. 두 모드 모두 squish보다 명확하다.

### 스키마 (`src/schema/document.ts`, `src/types.ts`)

`theme`/`background`와 동일한 화이트리스트 패턴으로 검증한다.

```ts
// types.ts: ValidatedDoc에 추가
fit: "width" | "none";

// document.ts
const FITS = ["width", "none"] as const;
const fit = raw.fit ?? "width";
if (typeof fit !== "string" || !(FITS as readonly string[]).includes(fit)) {
  return err("fit must be one of width|none", "fit");
}
// ok(...) 호출에 fit: fit as ValidatedDoc["fit"] 추가
```

기본값이 `"width"`이므로 기존 노트는 프로퍼티 없이도 자동 축소가 적용된다(승인된 동작 변경).

### scale 계산 — 순수 함수 (`src/styler/fit.ts`, 신규)

테스트 가능하도록 계산 로직을 순수 함수로 분리한다.

```ts
// 컨테이너 폭 / frame 자연 폭 → 적용할 scale (축소만, [>0, 1])
export function computeScale(containerWidth: number, frameWidth: number): number {
  if (frameWidth <= 0 || containerWidth <= 0) return 1;
  return Math.min(1, containerWidth / frameWidth);
}
```

### DOM 구조 / styler (`src/styler/index.ts`)

frame을 `.uis-scaler` wrapper로 감싸 반환한다. scaler가 컨테이너 폭(100%)을 차지하고, 내부 frame은 고정 px 너비를 유지한다.

```
.uis-scaler[data-fit="width|none"]
  └ .uis-frame[data-viewport=...]   (고정 px width)
       └ .uis-root
```

- `applyFrame()`이 scaler까지 만들어 반환한다(`renderSource`의 반환 타입은 그대로 `HTMLElement`).
- `data-fit`은 scaler에 부여한다. CSS와 FitController가 이 속성으로 모드를 판별한다.

### FitController (`src/main.ts`)

자동 축소는 **컨테이너 폭을 런타임에 측정**해야 한다(순수 CSS로는 "내용이 컨테이너보다 넓으면 비례 축소"를 깔끔히 표현할 수 없다). 옵시디언 `MarkdownRenderChild`를 상속해 라이프사이클을 위임한다.

- code block processor 콜백 시그니처를 `(source, el, ctx)`로 확장하고, `ctx.addChild(new FitController(scaler))`로 등록한다.
- `onload()`에서 `ResizeObserver`로 scaler 폭을 관찰한다.
- 측정/적용 흐름 (`fit: width`일 때만):
  1. `W_c = scaler.clientWidth` (컨테이너 폭)
  2. `W_f = frame.offsetWidth` (frame 자연 폭 — `offsetWidth`는 transform 영향을 받지 않으므로 안정적)
  3. `s = computeScale(W_c, W_f)`
  4. `frame.style.transformOrigin = "top left"; frame.style.transform = s < 1 ? \`scale(${s})\` : ""`
  5. `scaler.style.height = s < 1 ? \`${frame.offsetHeight * s}px\` : ""` — transform은 레이아웃 박스를 원본 크기로 남기므로, 아래 빈 공간을 없애기 위해 scaler 높이를 보정한다.
- `onunload()`에서 `observer.disconnect()` (누수 방지).
- `fit: none`이면 FitController는 transform을 적용하지 않는다(가로 스크롤은 CSS가 담당). 등록 자체를 건너뛰어도 된다.
- **환경 가드**: `typeof ResizeObserver === "undefined"`면 no-op (happy-dom 테스트 환경 대비).

### 스타일 (`styles.css`)

```css
.uis-scaler { width: 100%; }
.uis-scaler[data-fit="none"] { overflow-x: auto; }
/* squish 제거: .uis-frame 의 max-width:100% 삭제 */
```

`.uis-frame`의 `margin: 0 auto`는 유지하되 `max-width: 100%`는 제거한다. 색상/변수 규칙은 기존과 동일(하드코딩 금지) — 이 기능은 새 색상을 도입하지 않는다.

## 무상태 철학과의 관계

같은 `source → 같은 DOM`은 유지된다. ResizeObserver는 **컴포넌트 상태가 아니라 "컨테이너 크기에 대한 시각적 레이아웃 적응"**일 뿐이다. 마우스 줌/팬과 달리 사용자 인터랙션 상태나 이벤트 핸들러를 도입하지 않으므로 철학을 깨지 않는다. `renderSource`는 여전히 순수하며, 측정/스케일은 옵시디언 런타임(`main.ts`)에서만 일어난다.

## 에러 모델

`fit`는 L2 구조 검증(화이트리스트)으로 처리한다 — 잘못된 값이면 `theme`/`background`처럼 전체 블록 에러 박스. 신규 L3 분기는 없다.

## 테스트 계획

- **`tests/styler/fit.test.ts`** (신규): `computeScale` 순수 함수.
  - 컨테이너 < frame → `< 1` 비례값 (예: `(600, 1200) → 0.5`).
  - 컨테이너 ≥ frame → `1` (업스케일 안 함).
  - 0/음수 방어 → `1`.
- **`tests/schema/document.test.ts`** (보강): `fit` 기본값 `"width"`, 유효값 통과, 잘못된 값 L2 에러.
- **회귀**: 기존 `tests/renderer/snapshot.test.ts` 등은 DOM에 scaler wrapper가 추가되므로 셀렉터/스냅샷 영향 확인 후 갱신. FitController는 happy-dom에서 no-op이라 스냅샷에는 transform이 찍히지 않는다.

## 구현 단계

1. `types.ts`: `ValidatedDoc.fit` 추가.
2. `schema/document.ts`: `fit` 화이트리스트 검증 + `ok()`에 전달.
3. `styler/fit.ts` (신규): `computeScale`.
4. `styler/index.ts`: `.uis-scaler[data-fit]` wrapper 추가, frame을 감싸 반환.
5. `main.ts`: 콜백을 `(source, el, ctx)`로 확장, `FitController`(MarkdownRenderChild + ResizeObserver) 구현·등록.
6. `styles.css`: `.uis-scaler` 스타일, `.uis-frame` 의 `max-width: 100%` 제거.
7. 테스트: `fit.test.ts` 신규, `document.test.ts` 보강, snapshot 회귀 확인.
8. 문서: README의 YAML 프로퍼티 표(viewport/background/theme 근처)에 `fit: width|none` 추가. 한국어/영어 문서 동기화.
9. 검증: `npm run typecheck` / `npm test` / `npm run build`. **주의**: `preview`/`gen:screenshots` 하네스는 `renderSource`만 호출하고 `FitController`(옵시디언 런타임 전용)를 거치지 않으므로 실제 scale은 찍히지 않는다 — frame 자연 크기만 확인된다. 자동 축소 동작은 옵시디언 실제 노트(좁은 컬럼)에서 육안 확인한다.
10. 커밋 / 푸시 / PR.
