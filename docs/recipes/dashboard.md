# Recipe — Admin Dashboard

Classic three-area layout: top navbar, left sidebar, main content with cards and a table. Uses the [`grid` layout](../yaml-reference.md#named-area-grid) for structural clarity.

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
        container:
          pad: 24
```

To actually populate the `main` cell with multiple things, swap `container` for a single component, or fill the `main` area with a nested `col` using the flex model instead of grid.

## Flex variant (more layered content)

When you need real nesting inside the main area, the flex model scales better:

```ui-sketch
viewport: desktop
screen:
  - navbar:
      brand: "Ops Console"
      items: ["Dashboard", "Users", "Billing", "Settings"]
  - row:
      gap: 0
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
              - panel:
                  header: "Recent activity"
                  h: 280
              - row:
                  gap: 12
                  items:
                    - button: { label: "Export CSV", variant: secondary }
                    - button: { label: "New report", variant: primary }
```

## When to use which

- **Grid** — layout is fixed, areas are named, you care about exact columns/rows.
- **Flex (row/col)** — content grows organically, you want ratios like 1:3, easier to nest deeply.

Most dashboards I've seen look cleaner with flex + a top navbar, unless you have a truly grid-shaped data layout (e.g. a 4×3 metric grid).
