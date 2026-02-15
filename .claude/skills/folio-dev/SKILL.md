---
name: folio-dev
description: Develop the Folio KYC/Identity Verification dashboard. Use when building pages, components, or features for the Folio app. Covers PlexUI integration, Persona domain model, OpenAI design patterns, and Chrome-based reference analysis.
argument-hint: [task description]
---

# Folio Development Skill

You are developing **Folio** — a KYC/Identity Verification analytics dashboard inspired by [Persona](https://app.withpersona.com/). Your task: **$ARGUMENTS**

---

## 1. CRITICAL: No Hardcoding — Everything Shared

**Every repeated value, pattern, or UI element MUST use a shared module.** This is the #1 rule.

### Before writing ANY code, check:

- Is this value already in a constant module (`src/lib/constants/`)? → Import it
- Is this pattern already a shared component (`src/components/shared/`)? → Use it
- Will this pattern be used in 2+ places? → Extract it into shared first
- Am I using a raw color/size/font value? → Use a CSS token or PlexUI class
- Am I reimplementing modal/scroll-lock/escape? → Use `<Modal>` or `useScrollLock`

### Shared constants (`src/lib/constants/`)

| Module | Exports |
|--------|---------|
| `status-colors.ts` | `STATUS_COLORS` map → CSS var tokens |
| `report-type-labels.ts` | `REPORT_TYPE_LABELS` |
| `date-shortcuts.ts` | `DASHBOARD_DATE_SHORTCUTS`, `LIST_PAGE_DATE_SHORTCUTS` |
| `nav-config.ts` | `dashboardNavItems`, `settingsNavGroups`, `navSections`, `isRouteActive()`, `isSectionActive()` |
| `mock-user.ts` | `MOCK_USER` (name, email, org, avatarColor) |

### Shared components (`src/components/shared/`)

All exported from `src/components/shared/index.ts`:

`NotFoundPage` · `InlineEmpty` · `StatusBadge` · `DataTable` / `TableSearch` · `MetricCard` · `ChartCard` · `SectionHeading` (with `size="sm"|"xs"`) · `Modal` / `ModalHeader` / `ModalBody` / `ModalFooter` · `DocumentViewer` · `TagEditModal` · `CardHeader` · `KeyValueTable` · `DetailInfoList` · `EntityCard` · `SummaryCard` · `ActivityItem` · `CopyButton` · `EventTimeline` · `SettingsTable` · `ColumnSettings` · `InfoRow`

### Shared hooks (`src/lib/hooks/`)

| Hook | Purpose |
|------|---------|
| `useScrollLock(active)` | Lock body scroll (used by Modal, DocumentViewer) |
| `useIsMobile()` | Detect mobile viewport (<768px) |

### App-level CSS tokens (`globals.css`)

`--navbar-height` · `--color-nav-active-bg` · `--color-nav-hover-bg` (with dark-mode overrides)

---

## 2. Project Overview

| Key | Value |
|-----|-------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI Kit | @plexui/ui (npm) — OpenAI-style component library |
| Styling | Tailwind CSS 4 + PlexUI design tokens |
| Tables | TanStack Table v8 |
| Charts | Recharts |
| Data Fetching | TanStack Query v5 |
| State | Zustand |
| Dates | Luxon |
| Dev server | `npm run dev` → http://localhost:3100 |

### Existing Pages (22)
- `/` — Dashboard home
- `/inquiries` + `/inquiries/[id]` — Inquiry list + detail (5 tabs, decomposed into components)
- `/verifications` + `/verifications/[id]` — Verification list + detail
- `/reports` + `/reports/[id]` — Report list + detail
- `/accounts` + `/accounts/[id]` — Account list + detail
- `/analytics` + `/analytics/inquiries` + `/analytics/verifications` + `/analytics/reports` — Analytics pages
- `/templates` + `/templates/inquiries` + `/templates/verifications` + `/templates/reports` — Template pages
- `/settings` — Your profile
- `/settings/organization` · `/settings/project` · `/settings/team` · `/settings/api-keys` · `/settings/webhooks` · `/settings/notifications` · `/settings/tags`

---

## 3. PlexUI — MANDATORY Rules

### CSS Setup (globals.css — DO NOT change)
```css
@import "../../node_modules/@plexui/ui/dist/es/styles/variables-primitive.css";
@import "../../node_modules/@plexui/ui/dist/es/styles/variables-semantic.css";
@import "../../node_modules/@plexui/ui/dist/es/styles/variables-components.css";
@import "../../node_modules/@plexui/ui/dist/es/styles/tailwind-utilities.css";
```
**NEVER** import `@plexui/ui/css` — it resets Tailwind tokens.

### Component Imports (always deep path)
```tsx
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Input } from "@plexui/ui/components/Input";
import { Field } from "@plexui/ui/components/Field";
import { Avatar } from "@plexui/ui/components/Avatar";
import { EmptyMessage } from "@plexui/ui/components/EmptyMessage";
import { ChevronLeftMd, Plus, Search } from "@plexui/ui/components/Icon";
```

### Critical Rules
- **Button**: `color` prop is REQUIRED. Use `pill={false}` for rectangular corners. Icon-only: `uniform` prop.
- **Typography**: ALWAYS use `heading-xs`..`heading-5xl` and `text-xs`..`text-lg`. NEVER raw Tailwind (`text-sm font-semibold`).
- **Icons**: Use PlexUI Icon set (`@plexui/ui/components/Icon`) first — fill-based SVGs matching OpenAI style. Lucide only for domain-specific icons not in PlexUI.
- **Field**: Wrap label + description + input combos with `<Field label="..." description="...">`.
- **Colors**: Use CSS vars: `var(--color-text)`, `var(--color-text-secondary)`, `var(--color-border)`, `var(--color-surface)`.
- **EmptyMessage**: Use for all empty states and not-found pages. Full-page: default `fill="static"`. Inline: `fill="none" size="sm"`.

### Full API Reference
Read `AGENTS.md` in the project root for complete component quick-reference, size scales, color tokens, hooks, and patterns.

### Online Docs
https://plexui.com/docs — browse for latest component documentation and examples.

---

## 4. Design References — Use Claude in Chrome

**ACTIVELY use browser automation** to analyze reference pages for design decisions.

### OpenAI Platform — Visual Design Reference

| Page | URL | What to study |
|------|-----|---------------|
| Chat UI | `https://platform.openai.com/chat` | Sidebar, navbar, content layout |
| Org settings | `https://platform.openai.com/settings/organization/general` | Settings page layout, form patterns |
| API keys | `https://platform.openai.com/api-keys` | Table layout, action buttons |
| Usage | `https://platform.openai.com/usage` | Charts, metric cards, date filters |

### Persona Dashboard — Domain & Functionality Reference

| Page | URL | What to study |
|------|-----|---------------|
| Inquiries | `https://app.withpersona.com/dashboard/inquiries` | Table columns, filters, status badges |
| Inquiry detail | Click any inquiry row | Tabs, overview sections, info sidebar |
| Verifications | `https://app.withpersona.com/dashboard/verifications` | Verification types, check results |
| Analytics | `https://app.withpersona.com/dashboard/inquiry-analytics` | Charts, funnels, metric cards |

### Chrome Analysis Workflow
```
1. tabs_context_mcp → get tab IDs (or create new tab)
2. navigate → open reference URL
3. computer action=screenshot → capture current state
4. read_page → get accessibility tree (layout structure)
5. Analyze: spacing, colors, component patterns, data layout
6. Apply findings to your implementation
```

---

## 5. Domain Model

### Core Entities
| Entity | ID Prefix | Key Statuses |
|--------|-----------|-------------|
| Inquiry | `inq_` | created → pending → completed → approved / declined / needs_review |
| Verification | `ver_` | initiated → submitted → passed / failed / requires_retry |
| Report | `rep_` | pending → ready (no_matches / match) |
| Account | `act_` | default → custom statuses |

### Relationships
```
Account (act_) → Inquiry (inq_) [1:many] → Verification (ver_) [1:many]
                                          → Report (rep_) [1:many]
```

Full entity reference: `reference/persona/data-model.md`

---

## 6. Architecture Patterns

### Page Layout
```
SidebarProvider → SidebarLayout → Sidebar + SidebarInset(<main>)
  → Navbar (h-[var(--navbar-height)])
  → TopBar (sticky, page title + actions + toolbar)
  → Content area
```

**NEVER** nest `<main>` inside SidebarInset.

### Table Page: `flex h-full flex-col overflow-hidden` → TopBar → DataTable
### Settings Form: `overflow-auto` → TopBar → `max-w-2xl` → SectionHeading + Field + Input
### Detail Page: `overflow-auto` → TopBar(backHref) → flex(content + sidebar)

---

## 7. Execution Checklist

1. **Check shared modules** — constants, components, hooks — import what exists
2. **Read context** — `AGENTS.md` for PlexUI API, `reference/` docs for domain details
3. **Analyze reference** — Use Chrome to screenshot OpenAI/Persona pages for design guidance
4. **Check existing code** — Look at similar pages already built for patterns to follow
5. **Implement** — PlexUI components, design tokens, typography classes, shared components
6. **Extract** — If you created a pattern that could be reused, extract it to shared
7. **Verify build** — `npm run build` — zero TypeScript/build errors
8. **Visual check** — http://localhost:3100 — verify result matches design intent
