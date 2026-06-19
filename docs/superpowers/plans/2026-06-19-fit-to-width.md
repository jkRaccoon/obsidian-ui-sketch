# fit-to-width 자동 축소 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 좁은 옵시디언 노트 컬럼에서 넓은 와이어프레임이 짓눌리지(squish) 않고, `transform: scale()`로 비례 축소되어 전체가 한눈에 보이게 한다.

**Architecture:** 문서 레벨 `fit: width|none` 프로퍼티(기본 `width`)를 스키마에 추가한다. `renderSource`는 frame을 `.uis-scaler` wrapper로 감싸 반환한다(순수). 옵시디언 런타임에서 `FitController`(MarkdownRenderChild + ResizeObserver)가 컨테이너 폭을 측정해 scale을 frame에 적용한다. scale 계산은 순수 함수 `computeScale`로 분리해 단위 테스트한다.

**Tech Stack:** TypeScript, esbuild, vitest(happy-dom), zod(컴포넌트 스키마 — 단 document 검증은 수동 화이트리스트), Obsidian Plugin API.

## Global Constraints

- 패키지 매니저: **npm** (yarn 아님 — Node 24 호환성 이슈). Node 18+.
- 색상 하드코딩 금지 — Obsidian CSS 변수만. (이 기능은 새 색상을 도입하지 않는다.)
- `theme`는 `adaptive`만 허용(기존 유지). 이 작업은 theme을 건드리지 않는다.
- 빌드는 `tsc --noEmit`를 먼저 돌린다 — 타입 에러면 빌드 실패.
- 무상태 철학 유지: `renderSource(source)`는 같은 입력 → 같은 DOM. 런타임 측정/스케일은 `main.ts`에서만.
- `fit` 기본값은 `"width"` — 기존 노트도 자동 축소가 적용된다(승인된 동작 변경).

---

### Task 1: computeScale 순수 함수

**Files:**
- Create: `src/styler/fit.ts`
- Test: `tests/styler/fit.test.ts`

**Interfaces:**
- Consumes: (없음)
- Produces: `export function computeScale(containerWidth: number, frameWidth: number): number` — 축소 전용 배율 `(0, 1]`. `frameWidth`/`containerWidth`가 0 이하이면 `1`.

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/styler/fit.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { computeScale } from "@/styler/fit";

describe("computeScale", () => {
  it("shrinks when container is narrower than frame", () => {
    expect(computeScale(600, 1200)).toBe(0.5);
  });
  it("does not upscale when container is wider than frame", () => {
    expect(computeScale(1000, 375)).toBe(1);
  });
  it("returns 1 when widths are equal", () => {
    expect(computeScale(768, 768)).toBe(1);
  });
  it("guards against zero/negative widths", () => {
    expect(computeScale(0, 1200)).toBe(1);
    expect(computeScale(600, 0)).toBe(1);
    expect(computeScale(-50, 1200)).toBe(1);
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test tests/styler/fit.test.ts`
Expected: FAIL — `Failed to resolve import "@/styler/fit"` 또는 `computeScale is not a function`.

- [ ] **Step 3: 최소 구현 작성**

`src/styler/fit.ts`:

```ts
// src/styler/fit.ts

// 컨테이너 폭 대비 frame 자연 폭으로 적용할 배율을 계산한다.
// 축소만 한다(1을 초과하지 않음). 비정상 입력은 1(그대로)로 방어한다.
export function computeScale(containerWidth: number, frameWidth: number): number {
  if (frameWidth <= 0 || containerWidth <= 0) return 1;
  return Math.min(1, containerWidth / frameWidth);
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test tests/styler/fit.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: 커밋**

```bash
git add src/styler/fit.ts tests/styler/fit.test.ts
git commit -m "feat(styler): computeScale 순수 함수 (fit-to-width 배율 계산)"
```

---

### Task 2: 스키마 `fit` 프로퍼티

**Files:**
- Modify: `src/types.ts` (`ValidatedDoc` 인터페이스)
- Modify: `src/schema/document.ts:18-65`
- Modify: `tests/styler/frame.test.ts:5-11` (`baseDoc` 헬퍼에 `fit` 추가 — 타입 컴파일 보전)
- Test: `tests/schema/document.test.ts`

**Interfaces:**
- Consumes: (없음)
- Produces: `ValidatedDoc.fit: "width" | "none"`. `validate()`는 `fit` 누락 시 `"width"`를 채우고, 잘못된 값이면 L2 structure 에러(`path: "fit"`, message `fit must be one of width|none`).

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/schema/document.test.ts`의 `describe("validate", ...)` 블록 안에 추가:

```ts
  it("defaults fit to width", () => {
    const out = validate({ screen: [] });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.doc.fit).toBe("width");
  });

  it("accepts fit: none", () => {
    const out = validate({ fit: "none", screen: [] });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.doc.fit).toBe("none");
  });

  it("rejects unknown fit", () => {
    const out = validate({ fit: "cover", screen: [] });
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.error.kind).toBe("structure");
    expect(out.error.path).toBe("fit");
  });
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test tests/schema/document.test.ts`
Expected: FAIL — `out.doc.fit`가 `undefined` (타입 에러 또는 런타임 assertion 실패). 또한 `tsc`상 `ValidatedDoc`에 `fit`이 없어 컴파일 에러가 날 수 있다.

- [ ] **Step 3: 최소 구현 작성**

(3a) `src/types.ts`의 `ValidatedDoc` 인터페이스에 `fit` 추가:

```ts
export interface ValidatedDoc {
  viewport: ViewportKind;
  width?: number;
  height?: number;
  theme: "adaptive";
  background: "default" | "muted" | "transparent";
  fit: "width" | "none";
  screen: LayoutNode[] | GridNode;
}
```

(3b) `src/schema/document.ts` — `BACKGROUNDS` 상수 아래에 `FITS` 추가:

```ts
const FITS = ["width", "none"] as const;
```

`background` 검증 블록 바로 다음(`if (!("screen" in raw))` 위)에 `fit` 검증을 추가:

```ts
  const fit = raw.fit ?? "width";
  if (typeof fit !== "string" || !(FITS as readonly string[]).includes(fit)) {
    return err("fit must be one of width|none", "fit");
  }
```

두 `ok({...})` 호출(현재 `:50`, `:55`)에 `fit`을 전달. 각각:

```ts
    return ok({ viewport: v, width, height, theme: "adaptive", background: background as ValidatedDoc["background"], fit: fit as ValidatedDoc["fit"], screen: g.grid });
```

```ts
  return ok({ viewport: v, width, height, theme: "adaptive", background: background as ValidatedDoc["background"], fit: fit as ValidatedDoc["fit"], screen: layout.nodes });
```

(3c) `tests/styler/frame.test.ts`의 `baseDoc` 헬퍼에 `fit` 추가 (타입 보전):

```ts
const baseDoc = (override: Partial<ValidatedDoc> = {}): ValidatedDoc => ({
  viewport: "desktop",
  theme: "adaptive",
  background: "default",
  fit: "width",
  screen: [],
  ...override,
});
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test tests/schema/document.test.ts tests/styler/frame.test.ts && npm run typecheck`
Expected: 두 테스트 파일 모두 PASS, typecheck 에러 없음.

- [ ] **Step 5: 커밋**

```bash
git add src/types.ts src/schema/document.ts tests/schema/document.test.ts tests/styler/frame.test.ts
git commit -m "feat(schema): fit 프로퍼티 추가 (width 기본, none 허용)"
```

---

### Task 3: wrapScaler — scaler wrapper + renderSource 연결 + 스타일

**Files:**
- Modify: `src/styler/index.ts` (신규 `wrapScaler` export)
- Modify: `src/renderer/index.ts:36` (반환을 `wrapScaler`로 감쌈)
- Modify: `styles.css:9-19` (`.uis-scaler` 추가, `.uis-frame`의 `max-width: 100%` 제거)
- Test: `tests/styler/fit.test.ts` (wrapScaler DOM 테스트 추가)
- Update: `tests/renderer/__snapshots__/snapshot.test.ts.snap` (scaler wrapper 추가로 갱신)

**Interfaces:**
- Consumes: `applyFrame(inner, doc): HTMLElement` (기존), `ValidatedDoc.fit` (Task 2).
- Produces: `export function wrapScaler(frame: HTMLElement, doc: ValidatedDoc): HTMLElement` — `.uis-scaler[data-fit]` div를 만들어 `frame`을 자식으로 넣고 scaler를 반환한다. `data-fit`은 `doc.fit` 값.

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/styler/fit.test.ts` 상단 import에 추가하고 새 describe 블록 추가:

```ts
import { wrapScaler, computeScale } from "@/styler/fit";
import type { ValidatedDoc } from "@/types";

const doc = (fit: "width" | "none"): ValidatedDoc => ({
  viewport: "desktop",
  theme: "adaptive",
  background: "default",
  fit,
  screen: [],
});

describe("wrapScaler", () => {
  it("wraps the frame in a scaler carrying data-fit", () => {
    const frame = document.createElement("div");
    frame.className = "uis-frame";
    const scaler = wrapScaler(frame, doc("width"));
    expect(scaler.className).toContain("uis-scaler");
    expect(scaler.getAttribute("data-fit")).toBe("width");
    expect(scaler.firstElementChild).toBe(frame);
  });

  it("reflects fit: none in data-fit", () => {
    const scaler = wrapScaler(document.createElement("div"), doc("none"));
    expect(scaler.getAttribute("data-fit")).toBe("none");
  });
});
```

> 기존 `computeScale` import 줄이 이미 있으면 중복되지 않게 한 줄로 합칠 것.

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test tests/styler/fit.test.ts`
Expected: FAIL — `wrapScaler is not exported`.

- [ ] **Step 3: 최소 구현 작성**

(3a) `src/styler/fit.ts`에 `wrapScaler` 추가 (computeScale 아래):

```ts
import type { ValidatedDoc } from "@/types";

// frame을 .uis-scaler 컨테이너로 감싼다. scaler가 노트 컬럼 폭(100%)을
// 차지하고, 내부 frame은 고정 px 너비를 유지한다. data-fit으로 모드를 표시한다.
export function wrapScaler(frame: HTMLElement, doc: ValidatedDoc): HTMLElement {
  const scaler = createDiv({ cls: "uis-scaler" });
  scaler.setAttribute("data-fit", doc.fit);
  scaler.appendChild(frame);
  return scaler;
}
```

> `createDiv`는 Obsidian이 전역에 주입하는 헬퍼로, 테스트에서는 `tests/dom-polyfill.ts`가 제공한다(기존 `applyFrame`도 동일하게 사용). 추가 import 불필요.

(3b) `src/renderer/index.ts` — import와 마지막 반환 수정:

```ts
import { applyFrame } from "@/styler";
import { wrapScaler } from "@/styler/fit";
```

마지막 줄(`return applyFrame(inner, doc);`)을:

```ts
  return wrapScaler(applyFrame(inner, doc), doc);
```

(3c) `styles.css` — `.uis-frame` 블록(`:9-16`)에서 `max-width: 100%;` 줄을 삭제하고, `.uis-frame, .uis-frame *` 규칙(`:7`) **위**에 scaler 규칙 추가:

```css
.uis-scaler { width: 100%; }
.uis-scaler[data-fit="none"] { overflow-x: auto; }
```

`.uis-frame`은 `margin: 0 auto`는 유지하되 `max-width: 100%`만 제거한다.

- [ ] **Step 4: 테스트 통과 + 스냅샷 갱신**

Run: `npm test tests/styler/fit.test.ts`
Expected: PASS (computeScale 4 + wrapScaler 2).

스냅샷 갱신:
Run: `npm test -- -u tests/renderer/snapshot.test.ts`
Expected: PASS. 갱신된 `.snap`에서 두 스냅샷 모두 최상위가 `<div class="uis-scaler" data-fit="width">…<div class="uis-frame" …`로 시작하는지 육안 확인.

전체 회귀:
Run: `npm test && npm run typecheck`
Expected: 전부 PASS, 타입 에러 없음.

- [ ] **Step 5: 커밋**

```bash
git add src/styler/fit.ts src/renderer/index.ts styles.css tests/styler/fit.test.ts tests/renderer/__snapshots__/snapshot.test.ts.snap
git commit -m "feat(styler): .uis-scaler wrapper + squish 제거 (fit-to-width DOM)"
```

---

### Task 4: FitController — 런타임 측정 및 scale 적용

**Files:**
- Modify: `src/main.ts:14-20` (콜백을 `(source, el, ctx)`로 확장, FitController 등록), 파일 내 `FitController` 클래스 추가.

**Interfaces:**
- Consumes: `computeScale` (Task 1), `renderSource`가 반환하는 `.uis-scaler[data-fit]`(Task 3).
- Produces: (런타임 동작만 — 외부에서 import하는 심볼 없음)

> **테스트 노트:** FitController는 `ResizeObserver`·레이아웃 측정(`offsetWidth`/`clientWidth`)에 의존하므로 happy-dom 단위 테스트 대상이 아니다(환경 가드로 no-op). 검증은 typecheck + 빌드 + 옵시디언 수동 확인. 계산 핵심은 Task 1에서 이미 TDD로 커버됨.

- [ ] **Step 1: FitController 구현**

`src/main.ts` — import에 `MarkdownRenderChild`와 `computeScale` 추가:

```ts
import { Plugin, MarkdownRenderChild } from "obsidian";
import { computeScale } from "@/styler/fit";
```

파일 하단(클래스 밖)에 추가:

```ts
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
    // 같은 폭이면 즉시 빠져나가 무한 루프를 막는다.
    if (containerWidth === this.lastWidth) return;
    this.lastWidth = containerWidth;

    // offsetWidth/offsetHeight는 transform의 영향을 받지 않는 자연 크기다.
    const frameWidth = frame.offsetWidth;
    const scale = computeScale(containerWidth, frameWidth);
    if (scale < 1) {
      frame.style.transformOrigin = "top left";
      frame.style.transform = `scale(${scale})`;
      // transform은 레이아웃 박스를 원본 크기로 남기므로, 아래 빈 공간을
      // 없애기 위해 scaler 높이를 축소된 높이로 맞춘다.
      this.scaler.style.height = `${frame.offsetHeight * scale}px`;
    } else {
      frame.style.transform = "";
      frame.style.transformOrigin = "";
      this.scaler.style.height = "";
    }
  }
}
```

- [ ] **Step 2: code block processor에서 등록**

`src/main.ts`의 `registerMarkdownCodeBlockProcessor` 콜백을 `ctx`까지 받도록 수정하고 등록:

```ts
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
```

> 변경점 주의: 기존엔 `renderSource`가 frame을 반환해 `frame.classList.add("uis-compact")`였다. 이제 반환은 scaler이므로 `uis-compact`는 내부 `.uis-frame`에 붙여야 한다(스타일 셀렉터 `.uis-frame.uis-compact` 유지). `ctx.addChild`는 DOM 부착 후 호출한다.

- [ ] **Step 3: 타입체크 + 빌드**

Run: `npm run typecheck && npm run build`
Expected: 에러 없음. `main.js` 생성됨.

- [ ] **Step 4: 전체 테스트 회귀**

Run: `npm test`
Expected: 전부 PASS (FitController는 happy-dom에서 no-op이므로 스냅샷에 transform이 찍히지 않는다).

- [ ] **Step 5: 옵시디언 수동 검증**

옵시디언에서 vault에 플러그인을 로드(또는 `main.js`/`manifest.json`/`styles.css`를 테스트 vault의 플러그인 폴더에 복사)하고:
1. 사이드바를 좁혀 노트 컬럼을 ~600px로 만든 뒤 `viewport: desktop` 블록이 **비례 축소**되어 전체가 보이는지 확인(찌그러짐 없음).
2. 같은 블록에 `fit: none`을 추가하면 원본 크기 + 가로 스크롤로 바뀌는지 확인.
3. 컬럼 폭을 드래그로 바꿀 때 scale이 따라오고, 블록 아래 빈 공간이 없는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add src/main.ts
git commit -m "feat: FitController로 컨테이너 폭 기반 자동 축소 적용"
```

---

### Task 5: 문서 (README 영/한 + yaml-reference)

**Files:**
- Modify: `README.md:217` (영문 프로퍼티 블록), `README.md:545` (한글 프로퍼티 블록)
- Modify: `docs/ko/yaml-reference.md:12` 근처 (프로퍼티 표/예시)

**Interfaces:**
- Consumes: (없음 — 문서)
- Produces: (없음)

- [ ] **Step 1: README 영문 블록에 fit 추가**

`README.md`의 영문 YAML 블록에서 `background: default | muted | transparent` 줄 **다음**에 추가:

```yaml
fit: width | none                               # default: width (auto-shrink to fit note width)
```

- [ ] **Step 2: README 한글 블록에 fit 추가**

`README.md`의 한글 YAML 블록에서 `background: default | muted | transparent` 줄 **다음**에 추가:

```yaml
fit: width | none                               # 기본값: width (노트 폭에 맞춰 자동 축소)
```

- [ ] **Step 3: yaml-reference.md에 fit 추가**

`docs/ko/yaml-reference.md`의 `background: default …` 줄(`:12`) 다음에 추가:

```yaml
fit: width               # width | none — 노트 폭에 맞춰 자동 축소(기본). none이면 원본 크기 + 가로 스크롤
```

그리고 같은 문서에서 theme 설명 문단(`:34`) 근처에 한 줄 설명 추가:

```markdown
`fit: width`(기본)는 frame이 노트 컬럼보다 넓을 때 비례 축소해 전체를 한눈에 보여줍니다(축소만, 확대 안 함). `fit: none`이면 원본 픽셀 크기를 유지하고 넘치는 만큼 가로 스크롤합니다.
```

- [ ] **Step 4: 검증**

Run: `git diff --stat`
Expected: `README.md`, `docs/ko/yaml-reference.md` 변경. 렌더링 깨짐 없는지 육안으로 코드펜스 정합 확인.

- [ ] **Step 5: 커밋**

```bash
git add README.md docs/ko/yaml-reference.md
git commit -m "docs: fit 프로퍼티 문서화 (README 영/한, yaml-reference)"
```

---

## 최종 검증 (모든 Task 후)

- [ ] `npm run typecheck` — 통과
- [ ] `npm test` — 전부 통과
- [ ] `npm run build` — `main.js` 생성, 에러 없음
- [ ] 옵시디언 수동: 좁은 컬럼에서 desktop 블록 비례 축소(Task 4 Step 5) 재확인
- [ ] (선택) PR 생성

## Self-Review 메모 (spec 대비 커버리지)

- 동작 모델(width 기본 / none 가로스크롤) → Task 2(스키마) + Task 3(스타일) + Task 4(런타임).
- `computeScale` 축소 전용 → Task 1.
- DOM 구조 `.uis-scaler > .uis-frame > .uis-root` → Task 3. (spec의 "applyFrame이 scaler까지"는 회귀 방지를 위해 `wrapScaler` 분리로 구체화 — 기존 `frame.test.ts` 무회귀.)
- ResizeObserver 라이프사이클 + 재진입 가드 + 환경 가드 → Task 4.
- squish 제거 → Task 3(styles.css).
- 스냅샷 회귀 → Task 3 Step 4.
- 문서 → Task 5.
