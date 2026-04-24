# 기본 입력 컴포넌트

표준 폼 컨트롤. 모두 아래 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

> 프롭 표는 `yarn gen:docs`로 zod 스키마에서 자동 생성됩니다.

## `button`

variant가 있는 클릭 가능한 버튼.

<!-- gen:props type=button -->
| Prop | Type | Description |
|---|---|---|
| `label` | string | Button text |
| `variant` | `"primary"` \| `"secondary"` \| `"ghost"` \| `"danger"` | Visual style |
| `icon` | string | Icon label (text only in v0.2) |
<!-- /gen:props -->

```yaml
button:
  label: "Save"
  variant: primary

button:
  label: "Delete account"
  variant: danger
  note: "Requires confirmation modal"
```

## `input`

한 줄 텍스트 입력.

<!-- gen:props type=input -->
| Prop | Type | Description |
|---|---|---|
| `placeholder` | string | Shown when empty |
| `value` | string | Pre-filled value |
<!-- /gen:props -->

```yaml
input:
  placeholder: "you@example.com"
  w: 280
```

## `textarea`

여러 줄 텍스트 입력.

<!-- gen:props type=textarea -->
| Prop | Type | Description |
|---|---|---|
| `placeholder` | string | Shown when empty |
| `value` | string | Pre-filled value |
| `rows` | number | Visible rows (affects height) |
<!-- /gen:props -->

```yaml
textarea:
  placeholder: "Write your feedback..."
  rows: 4
```

## `select`

드롭다운 선택기.

<!-- gen:props type=select -->
| Prop | Type | Description |
|---|---|---|
| `placeholder` | string | Shown when no value selected |
| `value` | string | Selected value |
| `options` | string[] | Available options |
<!-- /gen:props -->

```yaml
select:
  placeholder: "Select a country"
  value: "South Korea"
  options: ["United States", "South Korea", "Japan"]
```

## `checkbox`

라벨이 있는 단일 체크박스.

<!-- gen:props type=checkbox -->
| Prop | Type | Description |
|---|---|---|
| `label` | string | Label next to the box |
| `checked` | boolean | Whether the box is ticked |
<!-- /gen:props -->

```yaml
checkbox:
  label: "I agree to the terms"
  checked: true
```

## `radio`

라벨이 있는 단일 라디오 버튼. 그룹으로 쓰려면 `col` 안에 여러 개 쌓으세요.

<!-- gen:props type=radio -->
| Prop | Type | Description |
|---|---|---|
| `label` | string | Label text |
| `selected` | boolean | Whether this radio is selected |
<!-- /gen:props -->

```yaml
col:
  items:
    - radio: { label: "Monthly",  selected: true }
    - radio: { label: "Annually", selected: false }
    - radio: { label: "Lifetime", selected: false }
```
