# 플레이스홀더 컴포넌트

콘텐츠를 확정하지 않고 *"여기에 뭔가 들어갑니다"*만 표시. 모두 아래 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

내재된 크기가 없으므로 `w`/`h`로 크기 지정 권장.

> 프롭 표는 `yarn gen:docs`로 zod 스키마에서 자동 생성됩니다.

## `chart`

러프한 실루엣 힌트가 있는 데이터 시각화 플레이스홀더.

<!-- gen:props type=chart -->
| Prop | Type | Description |
|---|---|---|
| `kind` | `"bar"` \| `"line"` \| `"pie"` | Shape to suggest |
| `label` | string | Caption shown on or below the chart |
<!-- /gen:props -->

```yaml
chart:
  kind: bar
  label: "Monthly revenue"
  w: 400
  h: 220
```

## `map`

지도 플레이스홀더 — "MAP" 뱃지가 있는 음영 사각형.

<!-- gen:props type=map -->
_No component-specific props — accepts [base props](../yaml-reference.md#base-props) only._
<!-- /gen:props -->

```yaml
map:
  w: 320
  h: 200
  note: "Shows pickup location"
```

## `video`

비디오 플레이스홀더 — ▶ 재생 아이콘과 "VIDEO" 뱃지가 있는 음영 사각형.

<!-- gen:props type=video -->
_No component-specific props — accepts [base props](../yaml-reference.md#base-props) only._
<!-- /gen:props -->

```yaml
video:
  w: 480
  h: 270
  note: "Onboarding intro, 90s"
```

## `placeholder`

일반적인 라벨 박스 — 특정 카테고리에 안 맞는 뭐든 넣을 수 있습니다.

<!-- gen:props type=placeholder -->
| Prop | Type | Description |
|---|---|---|
| `label` | string | Caption text shown centered |
<!-- /gen:props -->

```yaml
placeholder:
  label: "Activity feed (TODO)"
  w: 300
  h: 180
```
