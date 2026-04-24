# 레시피 — 설정 패널

2컬럼 설정 화면: 좌측에 카테고리 sidebar, 우측에 설정 패널. 그룹화된 컨트롤이 있는 `panel` 사용.

```ui-sketch
viewport: desktop
screen:
  - row:
      gap: 0
      items:
        - col:
            flex: 0
            items:
              - sidebar:
                  w: 220
                  items: ["Account", "Notifications", "Billing", "API Tokens", "Danger Zone"]
                  active: "Notifications"
        - col:
            flex: 1
            items:
              - heading: { level: 1, text: "Notifications", pad: 24 }
              - panel:
                  header: "Email"
                  pad: 24
              - row:
                  gap: 24
                  pad: 24
                  items:
                    - col:
                        flex: 1
                        items:
                          - toggle: { label: "Weekly digest",     on: true }
                          - toggle: { label: "Product updates",   on: true }
                          - toggle: { label: "Security alerts",   on: true }
                          - toggle: { label: "Marketing emails",  on: false }
              - panel:
                  header: "Push (mobile)"
                  pad: 24
              - row:
                  gap: 24
                  pad: 24
                  items:
                    - col:
                        flex: 1
                        items:
                          - toggle: { label: "Mentions",          on: true }
                          - toggle: { label: "Direct messages",   on: true }
                          - toggle: { label: "Task assignments",  on: false }
              - divider: {}
              - row:
                  gap: 12
                  pad: 24
                  items:
                    - button: { label: "Cancel",      variant: ghost }
                    - button: { label: "Save changes", variant: primary, note: "Writes to settings.json" }
```

![설정 패널](../../img/recipes/settings-panel.png)

## 패턴 메모

- **중첩 컨테이너의 `pad:`** 는 너비를 하드코딩하지 않고 24px 페이지 gutter를 일관되게 줍니다.
- **`flex: 0`인 `col`** 으로 sidebar가 고정 220px 너비 유지 — flex가 늘리지 않음.
- **`note:`** 로 사양 독자에게 시각적 노이즈 없이 Save 버튼 동작을 기록.

## 변형: 요약 + 액션 버튼

상단에 현재 플랜 요약 `kv-list` 추가:

```yaml
- panel:
    header: "Current plan"
- kv-list:
    pad: 24
    items:
      - ["Plan",          "Pro"]
      - ["Billing cycle", "Monthly"]
      - ["Next charge",   "2026-05-01"]
      - ["Amount",        "$19.00"]
- row:
    gap: 12
    pad: 24
    items:
      - button: { label: "Change plan",    variant: secondary }
      - button: { label: "Cancel subscription", variant: danger, note: "Irreversible" }
```
