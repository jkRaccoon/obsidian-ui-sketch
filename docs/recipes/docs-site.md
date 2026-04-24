# Recipe — Docs Site

Documentation site layout with breadcrumb, collapsible sidebar, main content, and on-page table of contents. Meta-example — the UI Sketch docs themselves could be sketched this way.

```ui-sketch
viewport: desktop
screen:
  - navbar:
      brand: "UI Sketch Docs"
      items: ["Home", "Reference", "Recipes", "GitHub", "v0.2.2"]
  - row:
      gap: 0
      items:
        - col:
            flex: 0
            items:
              - sidebar:
                  w: 240
                  items:
                    - "Getting Started"
                    - "YAML Reference"
                    - "Components"
                    - "Recipes"
                    - "Troubleshooting"
                    - "Changelog"
                  active: "Recipes"
        - col:
            flex: 3
            items:
              - container:
                  pad: 24
              - breadcrumb: { items: ["Docs", "Recipes", "Dashboard"] }
              - spacer: { size: 12 }
              - heading: { level: 1, text: "Dashboard" }
              - spacer: { size: 8 }
              - text:
                  value: "Classic three-area layout with navbar, sidebar, and main content — grid and flex variants."
                  tone: muted
              - spacer: { size: 20 }
              - panel: { header: "Example" }
              - placeholder: { label: "```ui-sketch code block here...", h: 180 }
              - spacer: { size: 16 }
              - heading: { level: 3, text: "Pattern notes" }
              - list:
                  items:
                    - "Grid is fixed layout — named areas, exact columns/rows"
                    - "Flex scales better for growing content"
                    - "col{flex:0} keeps sidebar width constant"
                    - "note: surfaces design rationale as tooltip"
              - spacer: { size: 16 }
              - heading: { level: 3, text: "When to use which" }
              - text:
                  value: "Grid for dashboards where layout is explicitly mapped. Flex when content grows or shrinks."
        - col:
            flex: 1
            items:
              - container:
                  pad: 16
              - text: { value: "On this page", tone: muted }
              - spacer: { size: 6 }
              - list:
                  items:
                    - "Example"
                    - "Pattern notes"
                    - "When to use which"
                    - "Variations"
```

![Docs site layout](../img/recipes/docs-site.png)

## Pattern notes

- Three columns — sidebar (fixed 240), main content (flex 3), TOC (flex 1). The main:TOC 3:1 ratio keeps content primary while leaving a visible but narrow TOC rail.
- `placeholder` is ideal for representing a dynamic element (code block, chart) you don't want to fully sketch yet.
- Version number in the navbar (`"v0.2.2"`) can be literal text in the items array — handy for doc-site headers.
