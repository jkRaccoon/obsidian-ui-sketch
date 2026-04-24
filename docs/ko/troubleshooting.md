# 문제 해결

플러그인은 조용히 실패하지 않습니다 — 뭔가 잘못되면 명시적 에러를 렌더링합니다. 이 페이지는 각 에러 레벨과 가장 자주 하는 실수를 설명합니다.

## 에러 레벨 한눈에 보기

| 레벨 | 상황 | 표시 |
|---|---|---|
| **L1** YAML 파싱 | 잘못된 YAML 문법 | 블록 전체 빨간 박스 + 줄/열 |
| **L2** 구조 | `screen` 누락, 잘못된 `viewport` 등 | 블록 전체 빨간 박스 + 경로 |
| **L3** 컴포넌트 | 알 수 없는 타입 또는 잘못된 프롭 | 인라인 빨간 박스 — 나머지는 정상 렌더링 |
| **L4** 빈 블록 | 내용 없음 | 예시 포함 친절한 플레이스홀더 |

## L1 — YAML 파싱 에러

이유와 줄/열을 보여줍니다.

### 자주 하는 실수

**콜론 뒤에 공백 빠짐:**

```yaml
# ✗ 잘못
viewport:desktop
screen:
  - button: { label:"Save" }

# ✓ 올바름
viewport: desktop
screen:
  - button: { label: "Save" }
```

**들여쓰기 불일치:**

```yaml
# ✗ 잘못 — "items"가 "row" 기준 3 들여쓰기, 형제는 4
screen:
  - row:
      items:
       - button: { label: "X" }

# ✓ 올바름 — 일관된 2칸 들여쓰기
screen:
  - row:
      items:
        - button: { label: "X" }
```

**특수 문자 따옴표 없음:**

```yaml
# ✗ 잘못 — 콜론이 파싱을 깹니다
text: { value: Time: 3:42 PM }

# ✓ 올바름
text: { value: "Time: 3:42 PM" }
```

## L2 — 구조 에러

YAML은 파싱됐지만 예상된 모양과 다름.

### "screen is required"

최상위 맵에 `screen:` 키가 필요합니다.

```yaml
# ✗ 잘못
viewport: desktop

# ✓ 올바름
viewport: desktop
screen:
  - button: { label: "Hello" }
```

### "viewport=custom requires numeric width and height"

`viewport: custom` 쓸 때는 둘 다 제공:

```yaml
viewport: custom
width: 500
height: 800
screen: [...]
```

### `screen`에서 "expected an array"

`screen`은 배열이거나 `grid:` 객체, 단일 컴포넌트는 불가:

```yaml
# ✗ 잘못
screen:
  button: { label: "X" }

# ✓ 올바름
screen:
  - button: { label: "X" }
```

### "entry must have exactly one key"

`screen`(또는 `row.items`/`col.items`) 안 각 항목은 키가 하나뿐인 맵이어야 함:

```yaml
# ✗ 잘못 — 한 항목에 키 두 개
screen:
  - button: { label: "A" }
    card:   { title: "B" }

# ✓ 올바름 — 두 항목
screen:
  - button: { label: "A" }
  - card:   { title: "B" }
```

## L3 — 컴포넌트 에러

L1/L2와 달리 L3 에러는 인라인으로 렌더링되고 **나머지 와이어프레임을 깨지 않습니다** — 정확한 위치에 빨간 박스와 메시지가 표시됩니다.

### 알 수 없는 컴포넌트 타입

```
⚠ butn: unknown component type
Did you mean "button"?
at screen[1]
```

제안은 Levenshtein 거리 ≤ 2. 철자 수정 또는 [컴포넌트 레퍼런스](./components/README.md)의 유효 타입으로 교체.

### 잘못된 열거형 값

스키마 에러는 첫 번째 실패 필드를 보여줍니다:

```
⚠ alert: severity: Invalid enum value. Expected 'info' | 'warn' | 'error' | 'success', received 'warning'
at screen[0]
```

열거형은 보통 짧은 형태 — 컴포넌트 페이지에서 정확한 값 확인. 자주 하는 실수:

| 컴포넌트 | 프롭 | 유효 값 |
|---|---|---|
| `alert`, `toast` | `severity` | `info`, `warn`, `error`, `success` (not `warning`) |
| `button` | `variant` | `primary`, `secondary`, `ghost`, `danger` |
| `badge` | `variant` | `default`, `primary`, `success`, `warning`, `danger` |
| `divider` | `orientation` | `horizontal`, `vertical` |
| `chart` | `kind` | `bar`, `line`, `pie` |
| `text` | `tone` | `muted`, `strong`, `accent` |

### 잘못된 타입

zod는 타입 불일치를 거부:

```
⚠ table: rows: Expected array, received string
```

기대하는 프롭 타입은 [컴포넌트 레퍼런스](./components/README.md)에서 확인.

## L4 — 빈 블록

`ui-sketch` 블록이 비어있거나 공백뿐이면 시작 예시가 있는 친절한 플레이스홀더가 보입니다. 플레이스홀더 내용을 YAML로 교체하세요.

## 안전 제한 에러

다음 메시지의 블록 레벨 에러:

- **"layout depth exceeds 32"** — 중첩이 32 레벨 초과. 거의 항상 YAML 앵커/별칭 루프. 풀거나 여러 블록으로 분할.
- **"too many nodes (>5000) — split the block"** — 트리가 폭발. 역시 별칭이 곱해지거나, 진짜로 거대한 스케치. 섹션별로 나눠서 각각 `ui-sketch` 블록으로.

## FAQ

**Q: 와이어프레임은 렌더링되는데 다크 모드에서 색이 이상해요.**
A: UI Sketch는 Obsidian CSS 변수 (`--interactive-accent` 등)를 씁니다. 커뮤니티 테마가 이걸 이상하게 오버라이드하면 와이어프레임도 따라갑니다. 기본 Obsidian 테마로 격리해보고, 플러그인 버그면 제보해주세요.

**Q: vault의 이미지를 임베드할 수 있나요?**
A: v0.2에서는 불가. `image:`는 `alt`/`src`를 메타데이터로 보여주는 플레이스홀더, 실제 fetcher가 아닙니다. v0.3+에서 검토 중.

**Q: `text:`나 `card:` 안에서 Obsidian wikilink를 쓸 수 있나요?**
A: 없습니다 — 텍스트는 Obsidian 마크다운 파이프라인이 아닌 `textContent`로 렌더링됩니다. 인라인 마크업이 필요하면 sanitize된 HTML을 쓰는 `raw:`.

**Q: YAML 편집할 때 Live Preview가 재렌더링 안 돼요.**
A: Live Preview는 blur 시 재렌더링되어야 합니다. 안 되면 읽기 뷰 (`Cmd/Ctrl+E`)로 토글 후 돌아오세요. 이건 Obsidian 파이프라인 특성이지 플러그인 버그가 아닙니다.

**Q: 버그 신고는 어떻게?**
A: [GitHub](https://github.com/jkRaccoon/obsidian-ui-sketch/issues)에 이슈 열기:
1. 재현 가능한 최소 YAML 블록
2. 기대한 렌더링
3. 실제 렌더링 (가능하면 스크린샷)
4. Obsidian 버전과 OS
