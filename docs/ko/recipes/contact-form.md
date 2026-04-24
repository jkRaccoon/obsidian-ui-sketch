# 레시피 — 연락처 폼

라벨 컬럼 정렬, select 드롭다운, 여러 줄 메시지 필드가 있는 폼. 표준 `text { w: N }` + input 패턴 시연.

```ui-sketch
viewport: desktop
screen:
  - heading: { level: 1, text: "Contact us" }
  - spacer: { size: 4 }
  - text:
      value: "We usually respond within one business day."
      tone: muted
  - spacer: { size: 28 }
  - row:
      gap: 8
      align: center
      items:
        - text: { value: "Name *", w: 100 }
        - input: { placeholder: "Jane Doe", w: 360 }
  - spacer: { size: 12 }
  - row:
      gap: 8
      align: center
      items:
        - text: { value: "Email *", w: 100 }
        - input: { placeholder: "jane@example.com", w: 360 }
  - spacer: { size: 12 }
  - row:
      gap: 8
      align: center
      items:
        - text: { value: "Topic", w: 100 }
        - select:
            placeholder: "Select a topic"
            options: ["General question", "Billing issue", "Bug report", "Feature request"]
            w: 360
  - spacer: { size: 12 }
  - row:
      gap: 8
      align: start
      items:
        - text: { value: "Message *", w: 100 }
        - textarea:
            placeholder: "How can we help?"
            rows: 6
            w: 480
  - spacer: { size: 16 }
  - row:
      gap: 8
      align: center
      items:
        - text: { value: "", w: 100 }
        - checkbox:
            label: "Subscribe to the monthly newsletter"
            checked: false
  - spacer: { size: 20 }
  - row:
      gap: 8
      items:
        - col: { flex: 1, items: [] }
        - button: { label: "Cancel", variant: ghost }
        - button: { label: "Send message", variant: primary }
```

![연락처 폼](../../img/recipes/contact-form.png)

## 패턴 메모

- 모든 라벨이 `w: 100` — 가장 긴 라벨("Message *")에 맞춘 너비를 전부 재사용.
- 체크박스 row 에도 더미 `text { value: "", w: 100 }` 를 넣어 위 입력들과 정렬 유지.
- 대부분의 row 에 `align: center` 로 단일 라인 입력과 라벨을 수직 중앙 정렬; textarea row 만 `align: start` 로 라벨을 상단 정렬.
- 필수 필드는 라벨에 `*` 로 표시 — 기본 제공 "required 아스타리스크" 스타일 없음.
