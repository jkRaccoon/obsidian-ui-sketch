# Recipes

Copy-paste templates for common UI layouts, organized from simplest to most complex.

## Simple

Quick patterns — usually 10–20 lines of YAML.

- **[Landing hero](./hero.md)** — centered headline + tagline + CTA buttons
- **[Empty state](./empty-state.md)** — placeholder screen with icon + call-to-action
- **[Card grid](./card-grid.md)** — 3-across product/feature card layout
- **[Confirmation modal](./confirmation-modal.md)** — delete-style confirm dialog

## Forms

Form layouts demonstrating label alignment, grouped inputs, and validation states.

- **[Login form](./login-form.md)** — centered mobile-width login + desktop variant with gutters
- **[Contact form](./contact-form.md)** — standard labeled form with select + textarea
- **[Settings panel](./settings-panel.md)** — 2-column settings with grouped toggles
- **[Material registration (자재 등록)](./material-registration.md)** — complex Korean ERP form with sections, badges, and conditional fields

## Layouts

Full-screen compositions — navbar + sidebar + main content patterns.

- **[Dashboard](./dashboard.md)** — classic admin dashboard in both grid and flex variants
- **[Email client](./email-client.md)** — 3-panel inbox + list + reading pane
- **[Docs site](./docs-site.md)** — documentation layout with breadcrumb, sidebar, and content
- **[Pricing page](./pricing-page.md)** — tier comparison cards
- **[Profile page](./profile-page.md)** — user profile with avatar header + tabs + details

## Data

Displays heavy in tables, metrics, lists, and feeds.

- **[Admin table](./admin-table.md)** — user management table with search, tabs, pagination
- **[Analytics dashboard](./analytics-dashboard.md)** — KPI cards + chart placeholders + activity table
- **[Activity feed](./activity-feed.md)** — timeline of events with badges

## About the screenshots

Each recipe's screenshot is auto-generated from its YAML block by `yarn gen:screenshots` (headless Chromium with Obsidian CSS variable defaults). To contribute a new recipe, add a `.md` file here with a single ```ui-sketch fenced block, then run the script — the PNG lands in `docs/img/recipes/`.
