# YAML 레퍼런스

`ui-sketch` 블록의 전체 문법. 쉬운 입문이 필요하면 [시작하기](./getting-started.md)를 먼저 읽으세요.

## 최상위 키

```yaml
viewport: desktop        # desktop | tablet | mobile | custom  (기본값: desktop)
width: 375               # 숫자(px) — viewport: custom 일 때 필수
height: 640              # 숫자(px) — viewport: custom 일 때 필수
theme: adaptive          # v0.2는 "adaptive"만 지원
background: default      # default | muted | transparent
screen:                  # 필수: 레이아웃 배열 또는 단일 grid 객체
  - ...
```

### Viewport 프리셋

| 값 | 너비 | 용도 |
|---|---|---|
| `desktop` | 1200px | 표준 웹 UI, 기본값 |
| `tablet` | 768px | 반응형 브레이크포인트 스케치 |
| `mobile` | 375px | 아이폰 크기 목업 |
| `custom` | — | 임의 크기; `width:`/`height:` 필수 |

### Background

- `default` — Obsidian의 기본 표면색 (대부분 테마에서 노트 본문 색)
- `muted` — 대비를 위해 약간 어둡거나 밝은 표면색
- `transparent` — 배경 없음 (노트 색이 그대로 비침)

### Theme

`theme: adaptive`는 와이어프레임이 Obsidian의 CSS 변수를 상속한다는 의미 — 라이트/다크/커뮤니티 테마에 자동으로 맞춰집니다. v0.2는 다른 값 미지원.

## `screen` 키 — 두 가지 레이아웃 모델

`screen`은 **레이아웃 배열**(flex 모델) 또는 **단일 grid 객체** 중 하나. 최상위에서 상호 배타.

### Flex 배열 (기본)

최상위는 배열. 각 항목은 키가 하나뿐인 맵으로, 키는 레이아웃 프리미티브(`row`, `col`)이거나 컴포넌트 타입입니다.

```yaml
screen:
  - navbar: { brand: "DocHub" }
  - row:
      gap: 16
      items:
        - card: { title: "Card A" }
        - card: { title: "Card B" }
```

### Named-area grid

최상위가 CSS Grid 템플릿 영역을 가진 단일 `grid:` 객체. `map:` 안에서 각 영역 이름에 컴포넌트 하나씩 할당:

```yaml
screen:
  grid:
    areas:
      - "nav  nav  nav"
      - "side main main"
      - "side foot foot"
    cols: "180px 1fr 1fr"     # 선택; areas의 컬럼 수와 일치
    rows: "56px 1fr 48px"      # 선택; areas의 행 수와 일치
    map:
      nav:  { navbar: { brand: "MyApp" } }
      side: { sidebar: { items: ["Home", "Docs"] } }
      main: { card:    { title: "Welcome" } }
      foot: { text:    { value: "© 2026" } }
```

Grid 셀에는 컴포넌트 하나만 들어갈 수 있음. 합성이 필요하면 `container:`를 중첩하세요.

## 레이아웃 프리미티브

### `row`

`items`를 가로로 배치 (flex row).

| 프롭 | 타입 | 설명 |
|---|---|---|
| `gap` | number | 항목 사이 픽셀 간격 |
| `items` | array | 자식 항목 (컴포넌트 또는 중첩 row/col) |

```yaml
row:
  gap: 12
  items:
    - button: { label: "Cancel", variant: ghost }
    - button: { label: "Save",   variant: primary }
```

### `col`

`items`를 세로로 배치 (flex column). `row` 안에서 컬럼을 그룹화할 때 유용.

| 프롭 | 타입 | 설명 |
|---|---|---|
| `flex` | number | `row` 안에서 flex-grow 비율 (예: `1`, `3`) |
| `items` | array | 자식 항목 |

```yaml
row:
  gap: 16
  items:
    - col: { flex: 1, items: [ { sidebar: { items: ["Home"] } } ] }
    - col: { flex: 3, items: [ { card: { title: "Main" } } ] }
```

## 공통 프롭 (base props)

모든 컴포넌트는 타입별 프롭 위에 아래 공통 프롭을 받습니다:

| 프롭 | 타입 | 설명 |
|---|---|---|
| `id` | string | 선택 식별자 (CSS-safe) |
| `w` | number \| string | 너비: 숫자 = px, 문자열 = CSS 길이 (예: `"50%"`, `"12rem"`) |
| `h` | number \| string | 높이: 동일한 규칙 |
| `align` | `start` \| `center` \| `end` | 교차축 자기 정렬 |
| `pad` | number \| string | 패딩 (숫자 = px, 문자열 = CSS) |
| `note` | string | 호버 툴팁 주석 — ⓘ 마커 표시 |
| `muted` | boolean | 강조 낮춤 (투명도/대비 감소) |

## 정렬 관용구

Flex 프리미티브로 대부분의 레이아웃이 커버되지만, 처음에 틀리기 쉬운 두 가지는 패턴을 외워두면 편합니다: **row 안에서 항목을 오른쪽 정렬**, 그리고 **라벨 없는 row에서도 라벨 컬럼 정렬 유지**.

### row 안에서 오른쪽 정렬

**`align: end`는 여기서 안 먹힙니다.** `align`은 공통 프롭(base props)으로 CSS `alignSelf`에 매핑됩니다 — flex 부모의 *교차축(cross-axis)* 상에서 자기 정렬. `row`(가로 flex)의 교차축은 수직이라서, `align: end`는 요소를 아래로 밀지 오른쪽으로 밀지 않습니다.

항목을 오른쪽 끝으로 밀려면 빈 `col`에 `flex: 1`을 줘서 스페이서로 씁니다. `flex-grow: 1`이 남은 가로 공간을 흡수해서 뒤 항목들이 우측으로 밀려납니다:

```yaml
- row:
    gap: 8
    items:
      - col: { flex: 1, items: [] }          # 남은 공간 흡수
      - button: { label: "취소", variant: ghost }
      - button: { label: "저장", variant: primary }
```

### 라벨 컬럼 정렬 유지

세로로 쌓인 폼에서는 보통 각 row가 라벨로 시작합니다 (예: `text: { value: "이름", w: 120 }`). 이러면 입력 필드들이 전부 `x = 128px`에 정렬됩니다. 그런데 라벨 없이 입력 여러 개를 그룹으로 묶은 row는 `x = 0`에서 시작해서 정렬이 깨집니다:

```yaml
# ✗ 정렬 어긋남 — 입력이 왼쪽 끝에서 시작
- row:
    items:
      - text: { value: "이름", w: 120 }
      - input: { placeholder: "이름", w: 420 }
- row:
    items:
      - input: { placeholder: "용도", w: 200 }        # ← x=0부터
      - input: { placeholder: "사양", w: 200 }
```

빈 값과 같은 너비의 더미 `text`를 추가해서 라벨 컬럼 공간을 보존합니다:

```yaml
# ✓ 정렬 맞음 — 더미 text가 라벨 자리 확보
- row:
    items:
      - text: { value: "", w: 120 }
      - input: { placeholder: "용도", w: 200 }
      - input: { placeholder: "사양", w: 200 }
```

### Space-between: 마지막 항목만 우측으로

두 패턴을 결합 — row 중간에 flex-grow 스페이서를 넣으면 좌우로 분할됩니다:

```yaml
- row:
    gap: 8
    align: center
    items:
      - heading: { level: 3, text: "계정 설정" }
      - col: { flex: 1, items: [] }                       # 버튼을 우측으로
      - button: { label: "계정 삭제", variant: danger }
```

## 안전 제한

폭주 블록으로 Obsidian이 멈추는 걸 방지하기 위해 플러그인이 강제하는 제한:

- **최대 트리 깊이**: 32 (`row`/`col`/`grid`/컴포넌트 중첩 총합)
- **최대 노드 수**: 블록당 5000

두 값 중 하나라도 초과하면 블록 단위 에러가 납니다. 더 필요하면 여러 `ui-sketch` 코드 펜스로 분할.

## `raw:` 탈출구

내장 컴포넌트로 부족할 때 `raw:`는 제한된 HTML 일부를 받습니다 (`sanitize-html` 통과):

```yaml
raw:
  html: "<strong>Beta</strong> — limited rollout"
```

허용 목록과 보안 정책은 [`raw` 컴포넌트 레퍼런스](./components/raw.md) 참고.

## 에러 레벨

| 레벨 | 상황 | 표시 |
|---|---|---|
| **L1** YAML 파싱 | 문법 오류 | 블록 전체 빨간 박스 + 줄/열 |
| **L2** 구조 | `screen` 누락, 잘못된 `viewport` 등 | 블록 전체 빨간 박스 + 경로 |
| **L3** 컴포넌트 | 알 수 없는 타입 또는 잘못된 프롭 | 해당 위치 인라인 빨간 박스 — 나머지는 정상 렌더링 |
| **L4** 빈 블록 | 내용 없음 | 예시 포함 친절한 플레이스홀더 |

알 수 없는 컴포넌트 타입은 Levenshtein 거리 기반 제안 (`butn` → "Did you mean `button`?").

자주 하는 실수와 해결법은 [문제 해결](./troubleshooting.md) 참고.
