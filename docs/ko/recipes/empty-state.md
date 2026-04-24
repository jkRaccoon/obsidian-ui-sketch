# 레시피 — 빈 상태

목록, 받은 편지함, 폴더에 아직 콘텐츠가 없을 때 보이는 플레이스홀더. 친근하고 설명적이고 다음 액션을 제시해야 함.

```ui-sketch
viewport: desktop
screen:
  - spacer: { size: 100 }
  - row:
      items:
        - col: { flex: 1, items: [] }
        - icon: { name: "inbox", size: 64 }
        - col: { flex: 1, items: [] }
  - spacer: { size: 20 }
  - heading:
      level: 2
      text: "No messages yet"
      align: center
  - spacer: { size: 8 }
  - text:
      value: "When someone sends you a message, it will show up here."
      tone: muted
      align: center
  - spacer: { size: 24 }
  - row:
      gap: 8
      items:
        - col: { flex: 1, items: [] }
        - button: { label: "Invite teammates", variant: primary }
        - button: { label: "Learn more", variant: ghost }
        - col: { flex: 1, items: [] }
```

![빈 상태](../../img/recipes/empty-state.png)

## 패턴 메모

- 큰 상단 spacer(100px)가 콘텐츠를 뷰포트 상단에서 밀어내 "균형잡힌" 빈 상태를 연출.
- 아이콘은 자체 flex-centered row 로 감쌈 — 단독 아이콘에 `align: center` 는 바로 위 flex 부모의 교차축만 영향을 주기 때문.
- 두 버튼 클러스터는 [YAML 레퍼런스의 정렬 관용구](../yaml-reference.md#정렬-관용구) 에서 소개한 "flex 스페이서로 중앙 정렬" 패턴을 사용.
