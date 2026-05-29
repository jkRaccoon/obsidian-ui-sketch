# 내비게이션 컴포넌트

사이트 chrome과 길찾기용 프리미티브.

모든 컴포넌트는 아래 나열된 프롭 외에 [공통 프롭(base props)](../yaml-reference.md#공통-프롭-base-props)도 받습니다.

> 프롭 표는 `npm run gen:docs`로 zod 스키마에서 자동 생성됩니다.

## `navbar`

브랜드, 메뉴 항목(문자열 또는 `children` 드롭다운을 가진 객체), 오른쪽 정렬 `actions`로 구성된 상단 내비게이션 바.

<!-- gen:props type=navbar -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `brand` | string | 브랜드/로고 텍스트 (왼쪽) |
| `items` | string \| object[] | 메뉴 항목 — 문자열 또는 { label, icon, active, open, children } |
| `actions` | object[] | 오른쪽 정렬 슬롯 — { icon }, { avatar }, { label } |
<!-- /gen:props -->

```yaml
navbar:
  brand: "DocHub"
  items: ["Home", "Docs", "Pricing", "Blog"]
```

드롭다운(`open: true`이면 펼친 상태로 렌더), 활성 항목, 오른쪽 정렬 액션:

```yaml
navbar:
  brand: "DashHub"
  items:
    - { label: "Home", active: true }
    - { label: "Products", children: ["Catalog", "Pricing"], open: true }
    - "Docs"
  actions:
    - { icon: "search" }
    - { label: "Log in" }
    - { avatar: "Kim Jane" }
```

## `sidebar`

세로 내비게이션 목록. 대시보드 레이아웃의 왼쪽 컬럼으로 자주 사용. `{ section }` 헤더, 항목 아이콘, `children`을 통한 1단계 중첩, `collapsed` 아이콘 레일을 지원.

<!-- gen:props type=sidebar -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `items` | string \| object[] | 메뉴 항목 — 문자열, { section } 헤더, 또는 { label, icon, active, children } |
| `active` | string \| number | 활성 항목 — 라벨 또는 0-based 인덱스 |
| `collapsed` | boolean | 아이콘만 있는 레일로 렌더 |
<!-- /gen:props -->

```yaml
sidebar:
  items: ["Getting Started", "API", "FAQ"]
  active: "API"
```

섹션 헤더, 아이콘, 중첩 children:

```yaml
sidebar:
  items:
    - { section: "MAIN" }
    - { label: "Overview", icon: "home", active: true }
    - { label: "Docs", icon: "book", children: ["API", "FAQ"] }
    - { section: "SETTINGS" }
    - { label: "Billing", icon: "card" }
```

## `tabs`

가로 탭 내비게이션.

<!-- gen:props type=tabs -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `items` | string[] | 탭 라벨 |
| `active` | string \| number | 활성 탭 — 라벨 또는 0-based 인덱스 |
<!-- /gen:props -->

```yaml
tabs:
  items: ["Overview", "Billing", "Team"]
  active: 0
```

## `breadcrumb`

사용자 경로를 보여주는 계층적 브레드크럼.

<!-- gen:props type=breadcrumb -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `items` | string[] | 루트에서 현재까지의 세그먼트 |
<!-- /gen:props -->

```yaml
breadcrumb:
  items: ["Projects", "Dashboard", "Settings"]
```

## `pagination`

현재/전체를 보여주는 페이지 내비게이션 컨트롤.

<!-- gen:props type=pagination -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `current` | number | 현재 페이지 (1-based) |
| `total` | number | 전체 페이지 수 |
<!-- /gen:props -->

```yaml
pagination:
  current: 3
  total: 12
```

## `stepper`

여러 단계 진행 표시기. 온보딩이나 결제 플로우에 유용.

<!-- gen:props type=stepper -->
| 프롭 | 타입 | 설명 |
|---|---|---|
| `items` | string[] | 단계 라벨 |
| `active` | number | 활성 단계의 0-based 인덱스 |
<!-- /gen:props -->

```yaml
stepper:
  items: ["Account", "Plan", "Payment", "Confirm"]
  active: 2
```
