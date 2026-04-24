# UI Sketch

**[English](./README.md) · 한국어** · 📖 [**전체 문서**](https://jkraccoon.github.io/obsidian-ui-sketch/ko/)

> YAML로 Obsidian 노트 안에 중간 충실도 웹 UI 와이어프레임을 그립니다 — ASCII 박스 그만.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Obsidian](https://img.shields.io/badge/Obsidian-1.5%2B-7c3aed)](https://obsidian.md)
[![Sponsor](https://img.shields.io/github/sponsors/jkRaccoon?label=Sponsor&logo=GitHub)](https://github.com/sponsors/jkRaccoon)
[![Tests](https://img.shields.io/badge/tests-115%20passing-brightgreen)](./tests)

---

기획 노트에 ASCII 박스 그리느라 고생하셨나요? **UI Sketch**는 짧고 읽기 쉬운 YAML을 Obsidian 창 안에서 바로 와이어프레임으로 렌더링합니다 — 테마에 자동으로 맞춰지고, 실시간 미리보기 가능하며, 글과 절대 따로 놀지 않습니다.

```yaml
viewport: desktop
screen:
  - navbar: { brand: "DocHub", items: ["Home", "Docs", "Pricing"] }
  - row:
      gap: 16
      items:
        - col:
            flex: 1
            items:
              - sidebar: { items: ["Getting Started", "API", "FAQ"] }
        - col:
            flex: 3
            items:
              - heading: { level: 1, text: "Welcome back" }
              - row:
                  gap: 12
                  items:
                    - card: { title: "Tasks", body: "12 open" }
                    - card: { title: "Docs",  body: "3 drafts" }
              - button:
                  label: "New document"
                  variant: primary
                  note: "Navigates to /documents/new"
```

위 YAML을 ` ```ui-sketch ` 코드 블록 안에 넣고 읽기 뷰로 전환하세요. 바로 와이어프레임이 보입니다.

---

## ✨ 왜 UI Sketch인가

| 고통 | 이전 | 이후 |
|---|---|---|
| 열 맞추기 | `│ Header │ Actions │` ASCII 체조 | `- row: { items: [...] }` |
| 레이아웃 조정 | 다이어그램 전체 재작성 | YAML 한 줄 수정 |
| 다른 사람 스케치 읽기 | 박스가 뭘 의미하는지 해독 | 그냥 렌더링해서 보면 됨 |
| 테마 일관성 유지 | 수동 색상 조정 | Obsidian CSS 변수로 자동 |

- **중간 충실도가 기본.** Figma 대체재가 아니라, 노트 안에서 쓰는 *빠른 스케치 도구*입니다.
- **테마 자동 적용.** 라이트, 다크, 커뮤니티 테마 모두: UI Sketch는 `var(--interactive-accent)` 같은 변수로 자동 상속합니다.
- **친절한 에러.** YAML 오타? 줄 번호와 함께 빨간 박스를 보여줍니다. 컴포넌트 이름 틀림? 가까운 실제 이름을 제안합니다 (Levenshtein 거리 기반).
- **안전함.** 깊이/노드 수 제한으로 폭주 방지. `raw:` 탈출구는 `sanitize-html`을 거치므로 XSS 우려 없음.
- **런타임 상태 없음.** 매 렌더링은 YAML → DOM 순수 함수. 라이브 프리뷰에서 놀랄 일 없습니다.

---

## 🚀 빠른 시작

### 1. 설치

**BRAT 베타 설치 (초기 버전 권장)**:
1. [BRAT](https://github.com/TfTHacker/obsidian42-brat) 커뮤니티 플러그인 설치.
2. BRAT → "Add Beta plugin" → `jkRaccoon/obsidian-ui-sketch`.
3. 커뮤니티 플러그인에서 **UI Sketch** 활성화.

**수동 설치**:
1. [최신 릴리스](https://github.com/jkRaccoon/obsidian-ui-sketch/releases)에서 `main.js`, `manifest.json`, `styles.css` 다운로드.
2. `<your-vault>/.obsidian/plugins/ui-sketch/`에 복사.
3. 설정에서 플러그인 활성화.

### 2. 첫 스케치 작성

아무 노트에 `ui-sketch` 태그 코드 블록을 추가:

````markdown
```ui-sketch
screen:
  - navbar: { brand: "MyApp" }
  - button: { label: "Sign in", variant: primary }
```
````

읽기 뷰로 전환 (`Ctrl/Cmd+E`). 와이어프레임이 보입니다.

### 3. 더 들어가기

전체 문서는 [**`docs/ko/`**](./docs/ko/README.md)에 있습니다:

- [시작하기](./docs/ko/getting-started.md) — 5분 튜토리얼
- [YAML 레퍼런스](./docs/ko/yaml-reference.md) — 전체 문법
- [컴포넌트 레퍼런스](./docs/ko/components/README.md) — 44개 컴포넌트의 프롭 표와 예제
- [레시피](./docs/ko/recipes/dashboard.md) — 자주 쓰는 화면 템플릿
- [문제 해결](./docs/ko/troubleshooting.md) — 에러 레벨과 대응법

---

## 🧩 컴포넌트 카탈로그

**8개 카테고리 44개 컴포넌트 + 탈출구 하나.** 모든 컴포넌트는 타입별 프롭 위에 공통 프롭(`id`, `w`, `h`, `align`, `pad`, `note`, `muted`)을 받습니다. 상세 프롭 표는 [컴포넌트 레퍼런스](./docs/ko/components/README.md) 참고.

| 카테고리 | 컴포넌트 |
|---|---|
| [**레이아웃**](./docs/ko/components/layout.md) | `container` · `card` · `panel` · `divider` · `spacer` |
| [**내비게이션**](./docs/ko/components/navigation.md) | `navbar` · `sidebar` · `tabs` · `breadcrumb` · `pagination` · `stepper` |
| [**기본 입력**](./docs/ko/components/input-basic.md) | `button` · `input` · `textarea` · `select` · `checkbox` · `radio` |
| [**고급 입력**](./docs/ko/components/input-advanced.md) | `toggle` · `slider` · `date-picker` · `file-upload` · `search` |
| [**표시**](./docs/ko/components/display.md) | `heading` · `text` · `image` · `icon` · `avatar` · `badge` · `tag` · `kbd` |
| [**피드백**](./docs/ko/components/feedback.md) | `alert` · `progress` · `toast` · `modal` · `skeleton` |
| [**데이터**](./docs/ko/components/data.md) | `table` · `list` · `tree` · `kv-list` |
| [**플레이스홀더**](./docs/ko/components/placeholder.md) | `chart` · `map` · `video` · `placeholder` |
| [**탈출구**](./docs/ko/components/raw.md) | `raw` (sanitize된 HTML) |

### 예시 몇 가지

```yaml
alert:
  severity: warn
  title: "Heads up"
  message: "Review before committing."

table:
  columns: ["Name", "Role", "Status"]
  rows:
    - ["Ada",  "PM",  "✓"]
    - ["Ben",  "ENG", "…"]

tree:
  items:
    - label: "src"
      children:
        - { label: "main.ts" }
        - { label: "types.ts" }
    - { label: "docs" }

kbd:
  keys: ["Ctrl", "K"]
```

---

## 📐 YAML 구조

전체 문법은 [**YAML 레퍼런스**](./docs/ko/yaml-reference.md) 참고. 간단 개요:

최상위 키:

```yaml
viewport: desktop | tablet | mobile | custom   # 기본값: desktop (1200px)
width: 375                                      # custom일 때만
height: 640                                     # custom일 때만
theme: adaptive                                 # v0.2는 "adaptive"만 지원
background: default | muted | transparent
screen:                                         # 필수: 배열 OR grid
  - ...
```

두 가지 레이아웃 모델 (최상위에서 상호 배타):

**Flex (row/col 중첩)** — 기본 모델, 웹 UI 99% 커버:

```yaml
screen:
  - row:
      gap: 12
      items:
        - col: { flex: 1, items: [ { sidebar: {...} } ] }
        - col: { flex: 3, items: [ ... ] }
```

**Named-area grid** — 대시보드 레이아웃용:

```yaml
screen:
  grid:
    areas:
      - "nav  nav  nav"
      - "side main main"
      - "side foot foot"
    cols: "180px 1fr 1fr"
    rows: "56px 1fr 48px"
    map:
      nav:  { navbar: { brand: "MyApp" } }
      side: { sidebar: { items: ["Home", "Docs"] } }
      main: { card:    { title: "Welcome" } }
      foot: { text:    { value: "© 2026" } }
```

---

## 🛡️ 에러 처리

UI Sketch는 조용히 실패하지 않습니다. 항상 뭔가 대응 가능한 메시지를 보여줍니다.

| 레벨 | 상황 | 결과 |
|---|---|---|
| **L1** YAML 파싱 에러 | 문법 오류 | 블록 전체 에러 박스 + 줄/열 |
| **L2** 구조 에러 | `screen` 누락, 알 수 없는 viewport 등 | 블록 전체 에러 박스 + 경로 |
| **L3** 컴포넌트 에러 | 알 수 없는 컴포넌트 타입 또는 잘못된 프롭 | 해당 위치에 인라인 에러 박스 — 나머지는 정상 렌더링 |
| **L4** 빈 블록 | 내용 없음 | 친절한 플레이스홀더 + 예시 코드 |

**오타 제안** (Levenshtein 거리 ≤ 2):

> ⚠ `butn`: unknown component type · Did you mean "button"?

**안전 제한**:
- 최대 트리 깊이: **32**
- 최대 노드 수: **블록당 5000**
- `raw:` HTML은 항상 `sanitize-html`을 통과 — `<script>` 불가, 인라인 이벤트 핸들러 불가.

자주 마주치는 문제와 해결법은 [**문제 해결**](./docs/ko/troubleshooting.md) 참고.

---

## ⚙️ 설정

설정 → 커뮤니티 플러그인 → **UI Sketch**:

| 항목 | 기본값 | 비고 |
|---|---|---|
| 기본 viewport | `desktop` | `viewport:` 생략한 블록에 적용 |
| 기본 theme | `adaptive` | v0.2에서는 고정 |
| Compact 모드 | 꺼짐 | 간격과 폰트를 ×0.875로 축소 — 한 노트에 블록 여러 개 쌓을 때 유용 |

---

## 🛠️ 개발

```bash
# Node 18+ 와 yarn 필요
yarn install

yarn dev        # esbuild watch 모드
yarn test       # vitest (happy-dom)
yarn typecheck  # tsc --noEmit
yarn build      # 프로덕션 번들 → main.js
```

저장소 루트 플러그인 파일:
- `main.js` — 번들된 플러그인
- `manifest.json` — Obsidian 플러그인 메타데이터
- `styles.css` — 테마 적응형 스타일

책임별로 구성된 소스:

```
src/
├── main.ts                플러그인 생명주기, 코드 블록 프로세서
├── settings.ts            설정 탭 + 데이터 모델
├── types.ts               공용 AST 타입
├── parser/                YAML → document (+ 위치 정보)
├── schema/                구조 검증 + 컴포넌트별 zod
├── components/            내장 컴포넌트 44개, 각각 파일 하나
├── renderer/              레이아웃 트리 → DOM 디스패치
├── styler/                viewport 프레임, 테마 훅
└── errors/                L1/L2/L3 에러 렌더링
```

---

## 🗺️ 로드맵

- **v0.1** (릴리스됨) — 기반: 10개 컴포넌트, L1/L2/L4 에러, viewport 프레임.
- **v0.2** (현재) — 컴포넌트 총 44개, L3 인라인 에러 + 오타 제안, 안전 제한, `raw:` + sanitize-html, 컴포넌트별 zod 스키마.
- **v0.3** (계획) — 자동 생성 컴포넌트 문서, 정규 예제 (`examples/`), README 스크린샷, GitHub Actions CI, 커뮤니티 플러그인 등록.
- **이후 아이디어** — PNG/SVG 내보내기, 커넥터가 있는 다중 화면 스토리보드, 재사용 가능한 컴포넌트 정의 (partial), 브랜드 컬러 테마 프리셋.

전체 설계 스펙은 [`docs/superpowers/specs/`](./docs/superpowers/specs/), 구현 플랜은 [`docs/superpowers/plans/`](./docs/superpowers/plans/) 참고.

---

## 💚 후원

UI Sketch가 와이어프레임 시간을 아껴준다면 **[GitHub 후원](https://github.com/sponsors/jkRaccoon)**을 고려해주세요. 후원은 이 플러그인과 향후 Obsidian 도구 개발 시간으로 쓰입니다.

---

## 🙌 기여

이슈와 PR 환영합니다. 큰 변경은 디자인을 논의할 수 있도록 먼저 이슈를 열어주세요. 작은 수정은 바로 PR 주셔도 됩니다.

- **버그 발견?** 재현 가능한 YAML 블록, 기대한 결과, 실제 결과를 함께 올려주세요.
- **새 컴포넌트 제안?** 먼저 카탈로그를 확인하세요. 정말 없다면 최소 YAML 예시와 함께 이슈 열어주세요.
- **스타일 수정?** 모든 색상/반경/간격은 Obsidian CSS 변수로 유지 — 하드코딩된 색 금지.

---

## 📄 라이선스

[MIT](./LICENSE) © 2026 jikwangkim

TypeScript, [esbuild](https://esbuild.github.io/), [zod](https://zod.dev/), [js-yaml](https://github.com/nodeca/js-yaml), [sanitize-html](https://github.com/apostrophecms/sanitize-html), [Vitest](https://vitest.dev/) · [happy-dom](https://github.com/capricorn86/happy-dom) 로 제작.
