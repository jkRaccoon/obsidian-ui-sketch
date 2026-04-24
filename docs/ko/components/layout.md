# 레이아웃 컴포넌트

표면(surface)과 간격 프리미티브. 콘텐츠를 그룹화하거나 분리할 때 사용. 가로/세로 배치는 컴포넌트가 아니라 [`row`/`col` 레이아웃 프리미티브](../yaml-reference.md#레이아웃-프리미티브)를 쓰세요.

모든 컴포넌트는 아래 나열된 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

> 이 파일의 프롭 표는 `yarn gen:docs`로 zod 스키마에서 자동 생성됩니다. `<!-- gen:props -->` 블록 안의 수동 편집은 덮어씌워집니다.

## `container`

옵션 패딩이 있는 중립적인 사각 표면. 경계가 보이는 래퍼가 필요할 때.

<!-- gen:props type=container -->
_No component-specific props — accepts [base props](../yaml-reference.md#base-props) only._
<!-- /gen:props -->

```yaml
container:
  pad: 16
  w: 300
  h: 120
```

## `card`

제목과 옵션 본문이 있는 표면 — 기본 "콘텐츠 카드" 모양.

<!-- gen:props type=card -->
| Prop | Type | Description |
|---|---|---|
| `title` | string | Card heading |
| `body` | string | Card body text |
<!-- /gen:props -->

```yaml
card:
  title: "Revenue"
  body: "$12,400 this quarter"
```

## `panel`

뚜렷한 헤더 바가 있는 카드 스타일 표면 — 헤딩과 임의 콘텐츠를 묶을 때 card보다 좋습니다.

<!-- gen:props type=panel -->
| Prop | Type | Description |
|---|---|---|
| `header` | string | Panel header text |
<!-- /gen:props -->

```yaml
panel:
  header: "Account settings"
  w: 420
  h: 240
```

## `divider`

가늘고 가로 또는 세로인 구분선. 섹션 시각적 분리에 유용.

<!-- gen:props type=divider -->
| Prop | Type | Description |
|---|---|---|
| `orientation` | `"horizontal"` \| `"vertical"` | Direction of the rule |
<!-- /gen:props -->

```yaml
screen:
  - heading: { text: "Profile" }
  - divider: {}
  - heading: { text: "Preferences" }
```

## `spacer`

보이지 않는 간격 — 부모 `row`/`col`의 `gap:`으로 부족할 때 강제로 공간을 줍니다.

<!-- gen:props type=spacer -->
| Prop | Type | Description |
|---|---|---|
| `size` | number | Gap size in pixels |
<!-- /gen:props -->

```yaml
col:
  items:
    - button: { label: "Save" }
    - spacer: { size: 24 }
    - button: { label: "Delete", variant: danger }
```
