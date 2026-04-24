# UI Sketch — Demo

읽기 뷰(`Cmd+E`)로 전환하면 아래 블록들이 와이어프레임으로 렌더링됩니다.

## 1. 기본 대시보드 (flex)

```ui-sketch
viewport: desktop
screen:
  - navbar: { brand: "DocHub", items: ["Home", "Docs", "Pricing"] }
  - row:
      gap: 16
      items:
        - col:
            flex: 1
            items:
              - sidebar: { items: ["Getting Started", "API", "FAQ"] }
        - col:
            flex: 3
            items:
              - heading: { level: 1, text: "Welcome back" }
              - row:
                  gap: 12
                  items:
                    - card: { title: "Tasks", body: "12 open" }
                    - card: { title: "Docs",  body: "3 drafts" }
              - button:
                  label: "New document"
                  variant: primary
                  note: "Navigates to /documents/new"
```

## 2. 모바일 로그인

```ui-sketch
viewport: mobile
screen:
  - heading: { level: 1, text: "Sign in" }
  - input: { label: "Email", placeholder: "you@example.com" }
  - input: { label: "Password", type: password }
  - button: { label: "Continue", variant: primary }
  - text: { value: "Forgot password?", muted: true }
```

## 3. Named-area 그리드

```ui-sketch
screen:
  grid:
    areas:
      - "nav  nav  nav"
      - "side main main"
      - "side foot foot"
    cols: "180px 1fr 1fr"
    rows: "56px 1fr 48px"
    map:
      nav:  { navbar: { brand: "MyApp" } }
      side: { sidebar: { items: ["Home", "Docs"] } }
      main: { card:    { title: "Welcome" } }
      foot: { text:    { value: "© 2026" } }
```

## 4. 에러 확인용 — L3 인라인 에러 + 오타 제안

```ui-sketch
screen:
  - navbar: { brand: "Still renders" }
  - butn: { label: "typo" }
  - card: { title: "And this too" }
```

위 블록은 `butn`을 `button`으로 제안하는 인라인 에러가 표시되면서, 주변 `navbar`/`card`는 정상 렌더링되어야 합니다.
