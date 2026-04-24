# 표시 컴포넌트

텍스트와 작은 시각 요소. 모두 아래 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

> 프롭 표는 `yarn gen:docs`로 zod 스키마에서 자동 생성됩니다.

## `heading`

레벨에 따른 섹션 헤딩.

<!-- gen:props type=heading -->
| Prop | Type | Description |
|---|---|---|
| `text` | string | Heading text |
| `level` | number | 1–6, matching HTML h1–h6 |
<!-- /gen:props -->

```yaml
heading:
  level: 1
  text: "Welcome back"
```

## `text`

옵션 강조 tone이 있는 인라인 또는 블록 텍스트.

<!-- gen:props type=text -->
| Prop | Type | Description |
|---|---|---|
| `value` | string | Text content |
| `tone` | `"muted"` \| `"strong"` \| `"accent"` | Emphasis style |
<!-- /gen:props -->

```yaml
text:
  value: "Last synced 2 minutes ago"
  tone: muted
```

## `image`

이미지 플레이스홀더. `src`/`alt`를 받지만 실제 이미지는 가져오지 않습니다 — mid-fi 스케치 도구라서 렌더러가 아닙니다.

<!-- gen:props type=image -->
| Prop | Type | Description |
|---|---|---|
| `src` | string | Image URL (shown in hover/title only) |
| `alt` | string | Alt text |
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
| Prop | Type | Description |
|---|---|---|
| `name` | string | Icon identifier text |
| `size` | number | Box size in pixels |
<!-- /gen:props -->

```yaml
icon:
  name: "settings"
  size: 20
```

## `avatar`

`name`에서 이니셜을 도출한 원형 아바타.

<!-- gen:props type=avatar -->
| Prop | Type | Description |
|---|---|---|
| `name` | string | Display name — initials are derived from it |
| `size` | number | Diameter in pixels |
<!-- /gen:props -->

```yaml
avatar:
  name: "Ada Lovelace"
  size: 40
```

## `badge`

variant가 있는 작은 상태 뱃지.

<!-- gen:props type=badge -->
| Prop | Type | Description |
|---|---|---|
| `label` | string | Badge text |
| `variant` | `"default"` \| `"primary"` \| `"success"` \| `"warning"` \| `"danger"` | Visual style |
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
| Prop | Type | Description |
|---|---|---|
| `label` | string | Tag text |
<!-- /gen:props -->

```yaml
row:
  gap: 6
  items:
    - tag: { label: "react" }
    - tag: { label: "typescript" }
    - tag: { label: "obsidian" }
```

## `kbd`

키보드 단축키 표시. 각 키를 `<kbd>` 스타일 박스에 넣고 `+`로 연결.

<!-- gen:props type=kbd -->
| Prop | Type | Description |
|---|---|---|
| `keys` | string[] | Keys in the shortcut |
<!-- /gen:props -->

```yaml
kbd:
  keys: ["Ctrl", "K"]

kbd:
  keys: ["Cmd", "Shift", "P"]
```
