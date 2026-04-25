# 기본 입력 컴포넌트

표준 폼 컨트롤. 모두 아래 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

> 프롭 표는 `npm run gen:docs`로 zod 스키마에서 자동 생성됩니다.

## `button`

variant가 있는 클릭 가능한 버튼.

<!-- gen:props type=button -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `label` | string | 버튼 텍스트 |
| `variant` | `"primary"` \| `"secondary"` \| `"ghost"` \| `"danger"` | 시각 스타일 |
| `icon` | string | 아이콘 라벨 (v0.2는 텍스트만) |
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
| 프롭 | 타입 | 설명 |
|---|---|---|
| `placeholder` | string | 비었을 때 표시 |
| `value` | string | 미리 채운 값 |
<!-- /gen:props -->

```yaml
input:
  placeholder: "you@example.com"
  w: 280
```

## `textarea`

여러 줄 텍스트 입력.

<!-- gen:props type=textarea -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `placeholder` | string | 비었을 때 표시 |
| `value` | string | 미리 채운 값 |
| `rows` | number | 표시할 행 수 (높이에 영향) |
<!-- /gen:props -->

```yaml
textarea:
  placeholder: "Write your feedback..."
  rows: 4
```

## `select`

드롭다운 선택기.

<!-- gen:props type=select -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `placeholder` | string | 값이 선택되지 않았을 때 |
| `value` | string | 선택된 값 |
| `options` | string[] | 선택지 |
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
| 프롭 | 타입 | 설명 |
|---|---|---|
| `label` | string | 박스 옆 라벨 |
| `checked` | boolean | 체크 여부 |
<!-- /gen:props -->

```yaml
checkbox:
  label: "I agree to the terms"
  checked: true
```

## `radio`

라벨이 있는 단일 라디오 버튼. 그룹으로 쓰려면 `col` 안에 여러 개 쌓으세요.

<!-- gen:props type=radio -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `label` | string | 라벨 텍스트 |
| `selected` | boolean | 이 라디오가 선택되었는지 |
<!-- /gen:props -->

```yaml
col:
  items:
    - radio: { label: "Monthly",  selected: true }
    - radio: { label: "Annually", selected: false }
    - radio: { label: "Lifetime", selected: false }
```
