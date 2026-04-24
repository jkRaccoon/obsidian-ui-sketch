# 레시피 — 확인 모달

되돌릴 수 없는 액션(삭제, 취소, 권한 해제)은 2단계 확인이 필요. 범위를 명확히 하고 파괴적 버튼을 시각적으로 구별.

```ui-sketch
viewport: desktop
screen:
  - spacer: { size: 40 }
  - row:
      items:
        - col: { flex: 1, items: [] }
        - col:
            flex: 0
            items:
              - panel:
                  header: "Confirm deletion"
                  w: 480
              - container:
                  pad: 20
                  w: 480
                  h: 220
              - text:
                  value: "You're about to delete 3 files. This action can't be undone."
              - spacer: { size: 12 }
              - kv-list:
                  items:
                    - ["File 1", "Q1-report.pdf"]
                    - ["File 2", "budget-draft.xlsx"]
                    - ["File 3", "meeting-notes.md"]
              - spacer: { size: 12 }
              - alert:
                  severity: warn
                  message: "Shared copies will be removed from your team as well."
              - spacer: { size: 16 }
              - row:
                  gap: 8
                  items:
                    - col: { flex: 1, items: [] }
                    - button: { label: "Cancel", variant: ghost }
                    - button: { label: "Delete all", variant: danger }
        - col: { flex: 1, items: [] }
```

![확인 모달](../../img/recipes/confirmation-modal.png)

## 패턴 메모

- `col { flex: 0 }` 에 고정 너비 자식(`w: 480`)을 두면 모달이 viewport 에 관계없이 일관된 480px — 양옆 `flex: 1` gutter 로 가로 중앙 정렬.
- **danger variant** (주 액션) + **ghost variant** (취소)가 관행 — 실수 확정 방지.
- 액션 위의 `alert` 는 제목만으로 분명하지 않은 2차 영향(팀 전체 삭제)을 드러냄.
- 실제 프로덕션에서는 오버레이지만, mid-fi 스케치에서는 인라인 렌더로 충분.
