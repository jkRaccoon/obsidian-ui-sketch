# 표시 컴포넌트

텍스트와 작은 시각 요소. 모두 아래 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

> 프롭 표는 `npm run gen:docs`로 zod 스키마에서 자동 생성됩니다.

## `heading`

레벨에 따른 섹션 헤딩.

<!-- gen:props type=heading -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `text` | string | 헤딩 텍스트 |
| `level` | number | 1–6, HTML h1–h6과 매칭 |
<!-- /gen:props -->

```yaml
heading:
  level: 1
  text: "Welcome back"
```

## `text`

옵션 강조 tone이 있는 인라인 또는 블록 텍스트.

<!-- gen:props type=text -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `value` | string | 텍스트 내용 |
| `tone` | `"muted"` \| `"strong"` \| `"accent"` | 강조 스타일 |
<!-- /gen:props -->

```yaml
text:
  value: "Last synced 2 minutes ago"
  tone: muted
```

## `image`

이미지 플레이스홀더. `src`/`alt`를 받지만 실제 이미지는 가져오지 않습니다 — mid-fi 스케치 도구라서 렌더러가 아닙니다.

<!-- gen:props type=image -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `src` | string | 이미지 URL (호버/title에만 표시) |
| `alt` | string | Alt 텍스트 |
<!-- /gen:props -->

```yaml
image:
  src: "https://example.com/hero.jpg"
  alt: "Product hero image"
  w: 400
  h: 240
```

## `icon`

작은 아이콘 마커. v0.2에서는 아이콘 크기 박스 안의 텍스트 라벨 (Obsidian의 Lucide 아이콘은 아직 직접 연결 안 됨).

<!-- gen:props type=icon -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `name` | string | 아이콘 식별자 텍스트 |
| `size` | number | 박스 크기 (픽셀) |
<!-- /gen:props -->

```yaml
icon:
  name: "settings"
  size: 20
```

## `avatar`

`name`에서 이니셜을 도출한 원형 아바타.

<!-- gen:props type=avatar -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `name` | string | 표시 이름 — 이니셜이 여기서 도출됨 |
| `size` | number | 지름 (픽셀) |
<!-- /gen:props -->

```yaml
avatar:
  name: "Ada Lovelace"
  size: 40
```

## `badge`

variant가 있는 작은 상태 뱃지.

<!-- gen:props type=badge -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `label` | string | 뱃지 텍스트 |
| `variant` | `"default"` \| `"primary"` \| `"success"` \| `"warning"` \| `"danger"` | 시각 스타일 |
<!-- /gen:props -->

```yaml
badge:
  label: "Beta"
  variant: primary

badge:
  label: "Failed"
  variant: danger
```

## `tag`

태그 모양 라벨 (주제나 키워드). `badge`보다 단순함 — variant 없고 중립적.

<!-- gen:props type=tag -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `label` | string | 태그 텍스트 |
<!-- /gen:props -->

```yaml
row:
  gap: 6
  items:
    - tag: { label: "react" }
    - tag: { label: "typescript" }
    - tag: { label: "obsidian" }
```

## `marker`

번호가 붙은 설명 뱃지. 설명이 필요한 부분 옆에 두고 번호를 부여한 뒤, 그 번호를 스케치
**바깥**(일반 마크다운)에서 설명하면 긴 텍스트가 레이아웃을 깨지 않습니다. 설명을 인라인
(`text`)으로 넣을 수도 있으며, 이때는 호버 시 나타납니다.

<!-- gen:props type=marker -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `num` | number \| string | 뱃지 라벨 — 외부 설명 리스트와 매칭되는 번호(또는 짧은 문자열) |
| `text` | string | 호버 시 나타나는 설명 |
| `variant` | `"default"` \| `"primary"` \| `"success"` \| `"warning"` \| `"danger"` | 색상 스타일 |
<!-- /gen:props -->

> 라벨 프롭은 `n`이 아니라 `num`입니다: YAML 파서가 1.1 모드라 맨 `n` 스칼라는 불리언 `false`로 해석되어 `n:` 키는 조용히 사라집니다.

```yaml
row:
  gap: 8
  items:
    - button: { label: "저장" }
    - marker: { num: 1, text: "자동 저장됨 — 별도 저장 불필요" }
    - marker: { num: 2, variant: danger, text: "위험: 확인 모달이 뜸" }
```

아무 컴포넌트나 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props) `mark` / `markText`로 핀 형태의 마커를 달 수 있습니다. 블록 모서리에 오버레이되어 레이아웃 공간을 차지하지 않습니다:

```yaml
button: { label: "삭제", mark: 3, markText: "소프트 삭제 — 30일간 복구 가능" }
```

> 호버 툴팁은 순수 CSS라서 `panel`(overflow 숨김) 안에서는 잘릴 수 있습니다. panel 내부 마커는 외부 번호 리스트 방식을 권장합니다.

## `kbd`

키보드 단축키 표시. 각 키를 `<kbd>` 스타일 박스에 넣고 `+`로 연결.

<!-- gen:props type=kbd -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `keys` | string[] | 단축키의 키들 |
<!-- /gen:props -->

```yaml
kbd:
  keys: ["Ctrl", "K"]

kbd:
  keys: ["Cmd", "Shift", "P"]
```
