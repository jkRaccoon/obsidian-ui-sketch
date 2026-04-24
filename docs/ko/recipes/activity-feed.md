# 레시피 — 활동 피드

이벤트(커밋, PR, 코멘트, 인시던트) 타임라인을 수직 카드 목록으로 렌더. 소셜 피드, 감사 로그, 프로젝트 활동 스트림에 적합.

```ui-sketch
viewport: desktop
screen:
  - heading: { level: 1, text: "Activity" }
  - spacer: { size: 8 }
  - row:
      gap: 8
      align: center
      items:
        - tabs:
            items: ["All", "Commits", "PRs", "Comments", "Incidents"]
            active: 0
        - col: { flex: 1, items: [] }
        - search: { placeholder: "Filter events...", w: 240 }
  - spacer: { size: 20 }
  - col:
      items:
        - row:
            gap: 12
            align: start
            items:
              - avatar: { name: "Ada Lovelace", size: 40 }
              - col:
                  flex: 1
                  items:
                    - row:
                        gap: 8
                        align: center
                        items:
                          - text: { value: "Ada Lovelace", tone: strong }
                          - text: { value: "pushed 3 commits to main", tone: muted }
                          - col: { flex: 1, items: [] }
                          - text: { value: "2 min ago", tone: muted }
                    - spacer: { size: 4 }
                    - list:
                        items:
                          - "fix: handle edge case in parser (a3f8c1d)"
                          - "test: add coverage for alias bomb (88b2e0a)"
                          - "docs: update YAML reference (c5d9f12)"
        - spacer: { size: 20 }
        - row:
            gap: 12
            align: start
            items:
              - avatar: { name: "Ben Tanner", size: 40 }
              - col:
                  flex: 1
                  items:
                    - row:
                        gap: 8
                        align: center
                        items:
                          - text: { value: "Ben Tanner", tone: strong }
                          - text: { value: "opened PR #42 — Add dark mode", tone: muted }
                          - col: { flex: 1, items: [] }
                          - text: { value: "1 hour ago", tone: muted }
                    - spacer: { size: 6 }
                    - text:
                        value: "Adds a dark-mode toggle wired to prefers-color-scheme. Tested on macOS Safari and Chrome."
                    - spacer: { size: 8 }
                    - row:
                        gap: 6
                        items:
                          - badge: { label: "Pending review", variant: warning }
                          - badge: { label: "enhancement", variant: primary }
                          - tag: { label: "dark-mode" }
                          - tag: { label: "a11y" }
        - spacer: { size: 20 }
        - row:
            gap: 12
            align: start
            items:
              - avatar: { name: "Clara Kim", size: 40 }
              - col:
                  flex: 1
                  items:
                    - row:
                        gap: 8
                        align: center
                        items:
                          - text: { value: "Clara Kim", tone: strong }
                          - text: { value: "commented on issue #478", tone: muted }
                          - col: { flex: 1, items: [] }
                          - text: { value: "3 hours ago", tone: muted }
                    - spacer: { size: 6 }
                    - panel: { header: "Reply" }
                    - container: { pad: 12 }
                    - text:
                        value: "I can reproduce on Linux too. Turning off the safety cap does work around it, but that's not a fix — let's investigate the alias resolution instead."
        - spacer: { size: 20 }
        - row:
            gap: 12
            align: start
            items:
              - avatar: { name: "Dan Rivera", size: 40 }
              - col:
                  flex: 1
                  items:
                    - row:
                        gap: 8
                        align: center
                        items:
                          - text: { value: "Dan Rivera", tone: strong }
                          - text: { value: "opened incident INC-04", tone: muted }
                          - col: { flex: 1, items: [] }
                          - text: { value: "yesterday", tone: muted }
                    - spacer: { size: 6 }
                    - alert:
                        severity: error
                        title: "Elevated error rate on /api/v2/search"
                        message: "p99 latency up 4x since 14:30 UTC. Mitigation in progress."
```

![활동 피드](../../img/recipes/activity-feed.png)

## 패턴 메모

- **이벤트 row 골격** — 왼쪽 아바타, 나머지 flex-grow 컬럼. 헤더 row 안에는 이름 + 동사 + 타임스탬프를 flex 스페이서로 좌우 분리.
- **항목마다 콘텐츠 다양** — 커밋 목록, 뱃지 있는 text blurb, 코멘트 내장 panel, 인시던트 alert 등. 바깥 row-col 형태는 동일.
- **타임스탬프 우측 정렬**은 `col { flex: 1, items: [] }` 스페이서 — 스캔 편의.
- 실제 앱에서는 이벤트 타입 기준 컴포넌트 맵으로 렌더. mid-fi 수준에선 각 이벤트를 타이핑하는 것도 대표 화면으로 충분.
