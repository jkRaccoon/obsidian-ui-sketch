# Recipe — Email Client

Three-panel inbox: navigation rail on the left, message list in the middle, open message on the right. Demonstrates nested `row` → `col` structure and ratio-based column widths.

```ui-sketch
viewport: desktop
screen:
  - navbar:
      brand: "Inbox"
      items: ["Compose", "Search", "Settings"]
  - row:
      gap: 0
      items:
        - col:
            flex: 0
            items:
              - sidebar:
                  w: 180
                  items:
                    ["Inbox", "Starred", "Sent", "Drafts", "Archive", "Trash", "Spam"]
                  active: "Inbox"
        - col:
            flex: 1
            items:
              - panel: { header: "Inbox · 3 unread" }
              - list:
                  items:
                    - "Ada Lovelace — Weekly report"
                    - "Ben Tanner — Meeting tomorrow?"
                    - "GitHub — PR #124 needs review"
                    - "Clara Kim — Budget proposal v2"
                    - "Slack — Activity digest (weekly)"
                    - "Stripe — Your April invoice is ready"
                    - "Linear — 3 new comments on ENG-478"
        - col:
            flex: 2
            items:
              - panel: { header: "Weekly report" }
              - container:
                  pad: 16
              - kv-list:
                  items:
                    - ["From", "Ada Lovelace <ada@example.com>"]
                    - ["To",   "team@example.com"]
                    - ["Date", "2026-04-24  09:30 BST"]
              - spacer: { size: 14 }
              - text:
                  value: "Hi team,"
              - spacer: { size: 8 }
              - text:
                  value: "Here's the weekly progress report. We shipped 3 features this week and resolved 8 bugs. Next week we're focusing on the v2 migration — see the attached roadmap."
              - spacer: { size: 8 }
              - text:
                  value: "Let me know if you'd like any specific metric broken out."
              - spacer: { size: 14 }
              - text: { value: "— Ada", tone: muted }
              - spacer: { size: 24 }
              - row:
                  gap: 8
                  items:
                    - button: { label: "Reply", variant: primary }
                    - button: { label: "Reply all", variant: secondary }
                    - button: { label: "Forward", variant: secondary }
                    - col: { flex: 1, items: [] }
                    - button: { label: "Archive", variant: ghost }
                    - button: { label: "Delete", variant: danger }
```

![Email client](../img/recipes/email-client.png)

## Pattern notes

- Three columns with `flex: 0 / 1 / 2` → sidebar is fixed 180px, list is 1 share, reading pane is 2 shares of remaining space.
- Action bar at the bottom combines left-grouped (Reply / Reply all / Forward) and right-grouped (Archive / Delete) using a mid-row `col { flex: 1 }` spacer — the space-between idiom.
- `gap: 0` on the outer row removes the gap between columns so panels meet flush — closer to a real multi-pane app.
