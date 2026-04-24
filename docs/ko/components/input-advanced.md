# 고급 입력 컴포넌트

더 특수한 폼 컨트롤. 모두 아래 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

> 프롭 표는 `yarn gen:docs`로 zod 스키마에서 자동 생성됩니다.

## `toggle`

라벨이 있는 ON/OFF 스위치.

<!-- gen:props type=toggle -->
| Prop | Type | Description |
|---|---|---|
| `label` | string | Label text |
| `on` | boolean | Whether the switch is on |
<!-- /gen:props -->

```yaml
toggle:
  label: "Enable notifications"
  on: true
```

## `slider`

`min`과 `max` 사이의 값을 보여주는 슬라이더.

<!-- gen:props type=slider -->
| Prop | Type | Description |
|---|---|---|
| `value` | number | Current value |
| `min` | number | Minimum (default 0) |
| `max` | number | Maximum (default 100) |
<!-- /gen:props -->

```yaml
slider:
  value: 35
  min: 0
  max: 100
  w: 240
```

## `date-picker`

플레이스홀더와 옵션 초기값이 있는 날짜 입력.

<!-- gen:props type=date-picker -->
| Prop | Type | Description |
|---|---|---|
| `value` | string | Preset date (free-form string — not parsed) |
| `placeholder` | string | Shown when empty |
<!-- /gen:props -->

```yaml
date-picker:
  placeholder: "YYYY-MM-DD"
  value: "2026-04-24"
```

## `file-upload`

라벨이 있는 파일 선택 영역.

<!-- gen:props type=file-upload -->
| Prop | Type | Description |
|---|---|---|
| `label` | string | Text shown inside the dropzone |
<!-- /gen:props -->

```yaml
file-upload:
  label: "Drop CSV or click to browse"
  w: 320
  h: 120
```

## `search`

플레이스홀더와 옵션 초기값이 있는 검색 입력. `input`과 시각적으로 구분됨 (보통 검색 아이콘 표시).

<!-- gen:props type=search -->
| Prop | Type | Description |
|---|---|---|
| `value` | string | Pre-filled query |
| `placeholder` | string | Shown when empty |
<!-- /gen:props -->

```yaml
search:
  placeholder: "Search docs..."
  w: 320
```
