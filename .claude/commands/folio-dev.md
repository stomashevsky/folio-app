---
name: folio-dev
description: Develop the Folio KYC/Identity Verification dashboard. Use when building pages, components, or features for the Folio app. Covers PlexUI integration, Persona domain model, OpenAI design patterns, and Chrome-based reference analysis.
argument-hint: [task description]
---

# Folio Development Skill

You are developing **Folio** — a KYC/Identity Verification analytics dashboard inspired by [Persona](https://app.withpersona.com/). Your task: **$ARGUMENTS**

---

## 1. Project Overview

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

### Existing Pages (17)
- `/` — Dashboard home
- `/inquiries` + `/inquiries/[id]` — Inquiry list + detail
- `/verifications` + `/verifications/[id]` — Verification list + detail
- `/reports` + `/reports/[id]` — Report list + detail
- `/accounts` + `/accounts/[id]` — Account list + detail
- `/analytics` — Analytics overview
- `/settings` — Your profile
- `/settings/organization` — Organization settings
- `/settings/project` — Project settings
- `/settings/team` — Team management
- `/settings/api-keys` — API keys
- `/settings/webhooks` — Webhooks
- `/settings/notifications` — Notifications

---

## 2. PlexUI — MANDATORY Rules

### Before starting work, update PlexUI:
```bash
npm install @plexui/ui@latest
```

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
- **Icons**: Use PlexUI Icon set (`@plexui/ui/components/Icon`) first — they are fill-based SVGs matching OpenAI style. Lucide only for domain-specific icons not in PlexUI.
- **Field**: Wrap label + description + input combos with `<Field label="..." description="...">`.
- **Colors**: Use CSS vars: `var(--color-text)`, `var(--color-text-secondary)`, `var(--color-border)`, `var(--color-surface)`.
- **EmptyMessage**: Use for all empty states and not-found pages. Full-page: default `fill="static"`. Inline: `fill="none" size="sm"`.

### Full API Reference
Read `AGENTS.md` in the project root for complete component props, size scales, color tokens, hooks, and patterns.

### Online Docs
https://plexui.com/docs — browse for latest component documentation and examples.

---

## 3. Design References — Use Claude in Chrome

**ACTIVELY use browser automation** to analyze reference pages for design decisions. This is critical for matching the visual style.

### OpenAI Platform — Visual Design Reference
Use these pages to understand layout, spacing, typography, and component patterns:

| Page | URL | What to study |
|------|-----|---------------|
| Chat UI | `https://platform.openai.com/chat` | Sidebar, navbar, content layout |
| Org settings | `https://platform.openai.com/settings/organization/general` | Settings page layout, form patterns |
| User profile | `https://platform.openai.com/settings/profile/user` | Profile page, avatar, field layout |
| API keys | `https://platform.openai.com/api-keys` | Table layout, action buttons |
| Usage | `https://platform.openai.com/usage` | Charts, metric cards, date filters |
| Apps SDK | `https://developers.openai.com/apps-sdk/quickstart` | Documentation layout |

### Persona Dashboard — Domain & Functionality Reference
Use these pages to understand KYC domain, data models, and dashboard features:

| Page | URL | What to study |
|------|-----|---------------|
| Inquiries | `https://app.withpersona.com/dashboard/inquiries` | Table columns, filters, status badges |
| Inquiry detail | Click any inquiry row | Tabs, overview sections, info sidebar |
| Verifications | `https://app.withpersona.com/dashboard/verifications` | Verification types, check results |
| Reports | `https://app.withpersona.com/dashboard/reports` | AML/watchlist report layout |
| Accounts | `https://app.withpersona.com/dashboard/accounts` | Account profile, linked entities |
| Analytics | `https://app.withpersona.com/dashboard/inquiry-analytics` | Charts, funnels, metric cards |

### Chrome Analysis Workflow
```
1. tabs_context_mcp → get tab IDs (or create new tab)
2. navigate → open reference URL
3. computer action=screenshot → capture current state
4. read_page → get accessibility tree (layout structure)
5. get_page_text → extract text content
6. Analyze: spacing, colors, component patterns, data layout
7. Apply findings to your implementation
```

**When to use Chrome:**
- Building a NEW page → screenshot the equivalent OpenAI/Persona page first
- Unsure about layout/spacing → screenshot and measure
- Need to understand table columns or filters → read_page on Persona
- Design decision → compare with OpenAI reference

---

## 4. Domain Model

### Core Entities
| Entity | ID Prefix | Key Statuses |
|--------|-----------|-------------|
| Inquiry | `inq_` | created → pending → completed → approved / declined / needs_review |
| Verification | `ver_` | initiated → submitted → passed / failed / requires_retry |
| Report | `rep_` | pending → ready (no_matches / match) |
| Account | `act_` | default → custom statuses |

### Relationships
```
Account (act_)
├── Inquiry (inq_) [1:many]
│   ├── Verification (ver_) [1:many]
│   │   └── Checks [1:many]
│   ├── Report (rep_) [1:many]
│   ├── Session [1:many]
│   └── Signals [1:many]
```

### Verification Types
- **Government ID** — document scan, OCR, 35+ fraud checks
- **Selfie** — liveness detection, face matching, 12+ checks

### Status Badge Colors
| Status | Color |
|--------|-------|
| Approved / Passed / No Matches | `success` |
| Declined / Failed / Match | `danger` |
| Needs Review / Pending | `warning` |
| Created / Default | `secondary` |

Full entity reference: `reference/persona/data-model.md`

---

## 5. Architecture Patterns

### Page Layout
```
SidebarProvider (collapsible="none")
└── SidebarLayout
    ├── Sidebar (AppSidebar or SettingsSidebar)
    └── SidebarInset (<main> with overflow:auto)
        ├── Navbar (h-[54px], org/project breadcrumb)
        ├── TopBar (sticky top-0 z-10, page title + actions)
        └── Content area
```

**NEVER** nest `<main>` inside SidebarInset — it already renders `<main>`.

### Table Page Pattern
```tsx
<div className="flex h-full flex-col overflow-auto">
  <TopBar title="Inquiries" actions={<Button>...</Button>} />
  <div className="flex flex-1 flex-col overflow-hidden">
    {/* Filters bar */}
    <div className="shrink-0 border-b px-6 py-3">...</div>
    {/* Table */}
    <div className="flex-1 overflow-auto">
      <table>...</table>
    </div>
    {/* Pagination */}
    <div className="shrink-0 border-t px-6 py-3">...</div>
  </div>
</div>
```

### Settings Page Pattern
```tsx
<div className="flex h-full flex-col overflow-auto">
  <TopBar title="Organization settings" />
  <div className="mx-auto w-full max-w-2xl px-6 py-8">
    <h2 className="heading-xs mb-4 text-[var(--color-text)]">Section</h2>
    <Field label="Name" description="Description text">
      <Input defaultValue="Value" />
    </Field>
    <Button color="primary" pill={false}>Save</Button>
  </div>
</div>
```

### Detail Page Pattern (with sidebar)
```tsx
<div className="flex h-full flex-col overflow-auto">
  <TopBar title="Inquiry inq_..." />
  <div className="flex flex-1">
    <div className="flex-1 px-6 py-8">
      {/* Tabs + content */}
    </div>
    <div className="w-80 shrink-0 border-l px-6 py-8">
      {/* Info sidebar */}
    </div>
  </div>
</div>
```

### Shared Components (`src/components/shared/`)
- `NotFoundPage` — standard 404 with EmptyMessage
- `InlineEmpty` — small inline empty state
- `StatusBadge` — maps entity status → Badge color
- Reuse existing components, create new ones for repeated patterns

### Not-Found Page Pattern
```tsx
<NotFoundPage section="Inquiries" backHref="/inquiries" entity="inquiry" />
```

---

## 6. Implementation Progress

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Project setup, reference docs | Done |
| 1 | Core layout, sidebar, navbar | Done |
| 2 | Shared components (MetricCard, DataTable, ChartCard) | Partial |
| 3 | Mock data, TypeScript types, hooks | Partial |
| 4 | Dashboard home (metrics, charts, recent table) | Partial |
| 5 | Inquiries list + detail | Partial |
| 6 | Verifications + Reports list/detail | Partial |
| 7 | Accounts list + detail | Partial |
| 8 | Analytics (funnel, time series, breakdown) | Partial |
| 9 | Settings, polish, loading/error states | Partial |
| 10 | Real API integration | Not started |

Full plan: `reference/tech/implementation-plan.md`

---

## 7. Execution Checklist

When implementing a task:

1. **Read context** — Read `AGENTS.md` for full PlexUI API. Read relevant `reference/` docs for domain details.
2. **Update PlexUI** — Run `npm install @plexui/ui@latest` if starting a new session.
3. **Analyze reference** — Use Claude in Chrome to screenshot relevant OpenAI/Persona pages for design guidance.
4. **Check existing code** — Look at similar pages already built for patterns to follow.
5. **Implement** — Use PlexUI components, design tokens, typography classes. Follow architecture patterns.
6. **Verify build** — Run `npm run build` to ensure no TypeScript or build errors.
7. **Visual check** — Open http://localhost:3100 and verify the result matches design intent.
