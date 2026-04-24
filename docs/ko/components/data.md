# 데이터 컴포넌트

표, 리스트, 트리, 키-값 표시. 모두 아래 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

> 프롭 표는 `yarn gen:docs`로 zod 스키마에서 자동 생성됩니다.

## `table`

헤더와 행이 있는 단순 데이터 표. 모든 값은 텍스트로 렌더링.

<!-- gen:props type=table -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `columns` | string[] | 컬럼 헤더 라벨 |
| `rows` | string[][] | 각 행은 columns와 1:1 정렬된 문자열 배열 |
<!-- /gen:props -->

```yaml
table:
  columns: ["Name", "Role", "Status"]
  rows:
    - ["Ada",    "PM",  "✓"]
    - ["Ben",    "ENG", "…"]
    - ["Clara",  "ENG", "✗"]
```

## `list`

글머리 또는 번호 리스트.

<!-- gen:props type=list -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `items` | string[] | 리스트 항목 |
| `ordered` | boolean | true면 번호 (ol), false면 글머리 (ul) |
<!-- /gen:props -->

```yaml
list:
  ordered: true
  items:
    - "Write the spec"
    - "Ship the MVP"
    - "Gather feedback"
```

## `tree`

중첩 계층 리스트. 각 항목은 `label`과 옵션 `children` (재귀적).

<!-- gen:props type=tree -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `items` | object[] | 최상위 트리 항목; 각각 label과 옵션 children |
<!-- /gen:props -->

```yaml
tree:
  items:
    - label: "src"
      children:
        - label: "components"
          children:
            - { label: "button.ts" }
            - { label: "card.ts" }
        - { label: "main.ts" }
    - label: "tests"
      children:
        - { label: "sanity.test.ts" }
    - { label: "README.md" }
```

리프 노드는 `children` 없이 `{ label: "..." }`로 작성 가능.

## `kv-list`

키-값 쌍 리스트 — 설정 요약이나 객체 인스펙션에 좋습니다.

<!-- gen:props type=kv-list -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `items` | [string, string][] | [키, 값] 쌍 배열 |
<!-- /gen:props -->

```yaml
kv-list:
  items:
    - ["Plan",          "Pro"]
    - ["Billing cycle", "Monthly"]
    - ["Next charge",   "2026-05-01"]
    - ["Amount",        "$19.00"]
```

각 항목은 정확히 문자열 2개의 YAML flow-sequence.
