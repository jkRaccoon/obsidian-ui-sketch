# 레시피 — 관리자 대시보드

클래식한 3영역 레이아웃: 상단 navbar, 좌측 sidebar, 카드와 표가 있는 메인 콘텐츠. 구조적 명확성을 위해 [`grid` 레이아웃](../yaml-reference.md#named-area-grid)을 사용.

```ui-sketch
viewport: desktop
screen:
  grid:
    areas:
      - "nav  nav  nav"
      - "side main main"
      - "side main main"
    cols: "220px 1fr 1fr"
    rows: "56px 1fr 1fr"
    map:
      nav:
        navbar:
          brand: "Ops Console"
          items: ["Dashboard", "Users", "Billing", "Settings"]
      side:
        sidebar:
          items: ["Overview", "Activity", "Reports", "API keys", "Team", "Support"]
          active: "Overview"
      main:
        chart:
          kind: bar
          label: "Active users (last 30 days)"
```

![대시보드 — grid 레이아웃](../../img/recipes/dashboard-1.png)

`grid.map`은 영역당 단일 컴포넌트만 받으므로, 여기서는 `main` 셀에 차트 placeholder 하나만 두었습니다. 메인 영역 안에 여러 컴포넌트(카드 + 차트 + 테이블)를 쌓으려면 아래의 flex 모델을 쓰세요 — `grid.map`에서는 `row`/`col`이 유효하지 않습니다.

## Flex 변형 (더 계층화된 콘텐츠)

메인 영역 안에서 진짜 중첩이 필요하면 flex 모델이 더 잘 확장됩니다:

```ui-sketch
viewport: desktop
screen:
  - navbar:
      brand: "Ops Console"
      items: ["Dashboard", "Users", "Billing", "Settings"]
  - row:
      gap: 24
      items:
        - col:
            flex: 0
            items:
              - sidebar:
                  w: 220
                  items: ["Overview", "Activity", "Reports", "API keys"]
                  active: "Overview"
        - col:
            flex: 1
            items:
              - heading: { level: 1, text: "Overview" }
              - row:
                  gap: 16
                  items:
                    - card: { title: "Revenue",   body: "$12,400" }
                    - card: { title: "New users", body: "342" }
                    - card: { title: "Churn",     body: "0.8%" }
              - panel: { header: "Recent activity" }
              - list:
                  items:
                    - "Ada Lovelace deployed v0.3.1 — 2 min ago"
                    - "Ben Tanner invited 3 users to the Pro workspace — 18 min ago"
                    - "Stripe webhook: invoice paid ($129) — 1 hour ago"
                    - "Clara Kim opened incident INC-04 — 3 hours ago"
              - row:
                  gap: 12
                  items:
                    - col: { flex: 1, items: [] }
                    - button: { label: "Export CSV", variant: secondary }
                    - button: { label: "New report", variant: primary }
```

![대시보드 — flex 레이아웃](../../img/recipes/dashboard-2.png)

## 어느 쪽을 언제 쓸까

- **Grid** — 레이아웃이 고정이고, 영역에 이름이 있고, 정확한 컬럼/행이 중요할 때.
- **Flex (row/col)** — 콘텐츠가 유기적으로 자라고, 1:3 같은 비율을 원하고, 깊게 중첩하기 쉬움.

진짜 grid 모양 데이터 레이아웃(예: 4×3 메트릭 그리드)이 아닌 한, 대부분의 대시보드는 상단 navbar + flex로 더 깔끔하게 나옵니다.
