# 고급 입력 컴포넌트

더 특수한 폼 컨트롤. 모두 아래 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

> 프롭 표는 `yarn gen:docs`로 zod 스키마에서 자동 생성됩니다.

## `toggle`

라벨이 있는 ON/OFF 스위치.

<!-- gen:props type=toggle -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `label` | string | 라벨 텍스트 |
| `on` | boolean | 스위치가 켜져 있는지 |
<!-- /gen:props -->

```yaml
toggle:
  label: "Enable notifications"
  on: true
```

## `slider`

`min`과 `max` 사이의 값을 보여주는 슬라이더.

<!-- gen:props type=slider -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `value` | number | 현재 값 |
| `min` | number | 최소값 (기본 0) |
| `max` | number | 최대값 (기본 100) |
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
| 프롭 | 타입 | 설명 |
|---|---|---|
| `value` | string | 미리 설정된 날짜 (자유 형식 문자열 — 파싱 안 함) |
| `placeholder` | string | 비었을 때 표시 |
<!-- /gen:props -->

```yaml
date-picker:
  placeholder: "YYYY-MM-DD"
  value: "2026-04-24"
```

## `file-upload`

라벨이 있는 파일 선택 영역.

<!-- gen:props type=file-upload -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `label` | string | 드롭존 안 텍스트 |
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
| 프롭 | 타입 | 설명 |
|---|---|---|
| `value` | string | 미리 채운 쿼리 |
| `placeholder` | string | 비었을 때 표시 |
<!-- /gen:props -->

```yaml
search:
  placeholder: "Search docs..."
  w: 320
```
