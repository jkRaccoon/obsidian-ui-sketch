# 내비게이션 컴포넌트

사이트 chrome과 길찾기용 프리미티브.

모든 컴포넌트는 아래 나열된 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

> 프롭 표는 `yarn gen:docs`로 zod 스키마에서 자동 생성됩니다.

## `navbar`

브랜드와 메뉴 항목이 있는 상단 내비게이션 바.

<!-- gen:props type=navbar -->
| Prop | Type | Description |
|---|---|---|
| `brand` | string | Brand/logo text (left side) |
| `items` | string[] | Menu items (right side) |
<!-- /gen:props -->

```yaml
navbar:
  brand: "DocHub"
  items: ["Home", "Docs", "Pricing", "Blog"]
```

## `sidebar`

세로 내비게이션 목록. 대시보드 레이아웃의 왼쪽 컬럼으로 자주 사용.

<!-- gen:props type=sidebar -->
| Prop | Type | Description |
|---|---|---|
| `items` | string[] | Menu entries |
| `active` | string \| number | Active entry — label or zero-based index |
<!-- /gen:props -->

```yaml
sidebar:
  items: ["Getting Started", "API", "FAQ"]
  active: "API"
```

## `tabs`

가로 탭 내비게이션.

<!-- gen:props type=tabs -->
| Prop | Type | Description |
|---|---|---|
| `items` | string[] | Tab labels |
| `active` | string \| number | Active tab — label or zero-based index |
<!-- /gen:props -->

```yaml
tabs:
  items: ["Overview", "Billing", "Team"]
  active: 0
```

## `breadcrumb`

사용자 경로를 보여주는 계층적 브레드크럼.

<!-- gen:props type=breadcrumb -->
| Prop | Type | Description |
|---|---|---|
| `items` | string[] | Segments from root to current |
<!-- /gen:props -->

```yaml
breadcrumb:
  items: ["Projects", "Dashboard", "Settings"]
```

## `pagination`

현재/전체를 보여주는 페이지 내비게이션 컨트롤.

<!-- gen:props type=pagination -->
| Prop | Type | Description |
|---|---|---|
| `current` | number | Current page (1-based) |
| `total` | number | Total page count |
<!-- /gen:props -->

```yaml
pagination:
  current: 3
  total: 12
```

## `stepper`

여러 단계 진행 표시기. 온보딩이나 결제 플로우에 유용.

<!-- gen:props type=stepper -->
| Prop | Type | Description |
|---|---|---|
| `items` | string[] | Step labels |
| `active` | number | Zero-based index of the active step |
<!-- /gen:props -->

```yaml
stepper:
  items: ["Account", "Plan", "Payment", "Confirm"]
  active: 2
```
