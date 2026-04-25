# 레시피 — 프로필 페이지

아바타 헤더, 탭, 상세 패널이 있는 사용자 프로필. "계정 설정"이나 소셜 스타일 프로필 뷰의 일반 패턴.

```ui-sketch
viewport: desktop
screen:
  - breadcrumb: { items: ["Team", "People", "Ada Lovelace"] }
  - spacer: { size: 16 }
  - row:
      gap: 20
      align: center
      items:
        - avatar: { name: "Ada Lovelace", size: 80 }
        - col:
            flex: 1
            items:
              - heading: { level: 1, text: "Ada Lovelace" }
              - text: { value: "Engineering Manager · London", tone: muted }
              - spacer: { size: 6 }
              - row:
                  gap: 6
                  items:
                    - badge: { label: "Admin", variant: primary }
                    - tag: { label: "eng" }
                    - tag: { label: "mentor" }
                    - tag: { label: "on-call-lead" }
        - button: { label: "Edit profile", variant: secondary }
  - spacer: { size: 24 }
  - tabs:
      items: ["Overview", "Activity", "Access", "Audit log"]
      active: 0
  - spacer: { size: 16 }
  - row:
      gap: 24
      items:
        - col:
            flex: 1
            items:
              - panel: { header: "About" }
              - kv-list:
                  pad: 12
                  items:
                    - ["Email",        "ada@example.com"]
                    - ["Employee ID",  "E-00128"]
                    - ["Department",   "Engineering"]
                    - ["Manager",      "Charles Babbage"]
                    - ["Joined",       "2022-03-14"]
                    - ["Timezone",     "Europe/London (BST)"]
        - col:
            flex: 1
            items:
              - panel: { header: "Recent activity" }
              - list:
                  pad: 12
                  items:
                    - "Pushed 3 commits to main (2 min ago)"
                    - "Approved PR #124 in platform-api (1 hour ago)"
                    - "Commented on #478 (3 hours ago)"
                    - "Merged PR #123 in ui-sketch (yesterday)"
                    - "Opened incident INC-04 (2 days ago)"
```

![프로필 페이지](../../img/recipes/profile-page.png)

## 패턴 메모

- 아바타 + 신원 클러스터는 `row` + `align: center` 로 80px 아바타와 heading + 부제목 컬럼을 수직 균형.
- 가장 오른쪽 "Edit profile" 버튼이 row 끝에 오는 이유 — 중간 `col { flex: 1 }` 이 공간을 흡수하기 때문. 성장 컬럼이 이미 사이에 있으면 별도 flex 스페이서 불필요.
- 탭 아래 두 개의 `col { flex: 1 }` 이 하단을 50/50 분할 — 병렬 콘텐츠 (About / Recent activity).
