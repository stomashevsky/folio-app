# Folio — KYC Analytics Dashboard

## Project Overview

Folio is a simplified KYC/Identity Verification analytics dashboard inspired by [Persona](https://app.withpersona.com/). It provides a clean interface for monitoring verification flows, reviewing inquiry results, and analyzing compliance data.

## Technology Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI Kit:** @plexui/ui — React 19 component library based on OpenAI's design system (36 components, 9-size scale, Radix primitives)
- **Styling:** Tailwind CSS 4 + PlexUI design tokens (3-tier: primitive → semantic → component)
- **Language:** TypeScript 5
- **React:** React 19
- **Charts:** Recharts
- **Tables:** TanStack Table v8
- **Data Fetching:** TanStack Query v5
- **State:** Zustand
- **Icons:** Lucide React
- **Theme:** next-themes (synced with PlexUI data-theme attribute)

## PlexUI Integration

### CSS Setup (CRITICAL)
- **DO NOT** import `@plexui/ui/css` — it resets Tailwind theme tokens
- Import token CSS files + tailwind utilities in `globals.css`:
  ```css
  @import "../../node_modules/@plexui/ui/dist/es/styles/variables-primitive.css";
  @import "../../node_modules/@plexui/ui/dist/es/styles/variables-semantic.css";
  @import "../../node_modules/@plexui/ui/dist/es/styles/variables-components.css";
  @import "../../node_modules/@plexui/ui/dist/es/styles/tailwind-utilities.css";
  ```
- `tailwind-utilities.css` is **required** for PlexUI typography classes (`heading-sm`, `text-md`, etc.) — without it, `@utility` definitions are missing and classes have no effect
- Use `@source "../../node_modules/@plexui/ui"` for Tailwind class scanning

### Component Imports
```tsx
import { Button } from "@plexui/ui/components/Button";
import { Sidebar } from "@plexui/ui/components/Sidebar";
import { Badge } from "@plexui/ui/components/Badge";
```

### Theme
- PlexUI uses `data-theme="light|dark"` attribute on `<html>`
- `ThemeSync` component bridges next-themes (class-based) ↔ PlexUI (data-theme)
- CSS uses `light-dark()` function for automatic light/dark switching

### Button requires `color` prop
Button component has `color` as required. Always provide: `color="primary"`, `color="secondary"`, etc.

## PlexUI Kit Location

The UI Kit source is at `/Users/sergey/github/plexui-docs/packages/ui/`.
Documentation site at `/Users/sergey/github/plexui-docs/`.
See AGENTS.md for PlexUI reference.

## Key PlexUI Components (36)

Alert, Avatar, AvatarGroup, Badge, Button, ButtonLink, Checkbox, CodeBlock, CopyTooltip, DatePicker, DateRangePicker, EmptyMessage, FieldError, FloatingLabelInput, Icon, Image, Indicators, Input, Markdown, Menu, PlexUIProvider, Popover, ProgressSteps, RadioGroup, SegmentedControl, Select, SelectControl, ShimmerText, Sidebar, Skeleton, Slider, Switch, TagInput, TextLink, Textarea, Tooltip, Transition, UIProvider.

## Project Structure

```
folio-app/
├── reference/                # Reference documentation
│   ├── persona/              # Persona data model, dashboard sections
│   ├── design/               # UI patterns, design tokens
│   ├── tech/                 # Architecture, API specs
│   └── openai-design-reference.md
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout with Providers + Sidebar
│   │   ├── page.tsx          # Dashboard home / Overview
│   │   ├── inquiries/        # Inquiry list + detail
│   │   ├── verifications/    # Verification pages
│   │   ├── reports/          # Report pages
│   │   ├── accounts/         # Account pages
│   │   ├── analytics/        # Analytics overview
│   │   └── settings/         # Settings
│   ├── components/
│   │   ├── layout/           # AppSidebar, TopBar
│   │   ├── providers/        # Providers, ThemeSync, QueryProvider
│   │   ├── shared/           # StatusBadge, DataTable, MetricCard
│   │   └── charts/           # Chart wrapper components
│   └── lib/
│       ├── api/              # API client, endpoints
│       ├── hooks/            # Custom hooks (useInquiries, etc.)
│       ├── stores/           # Zustand stores
│       ├── types/            # TypeScript types/interfaces
│       └── utils/            # Helpers, formatters
├── CLAUDE.md                 # This file
└── AGENTS.md                 # Agent instructions
```

## Domain Model

Core entities (prefix = ID format):
- **Inquiry** (`inq_`) — verification session: created → pending → completed → approved/declined
- **Verification** (`ver_`) — individual check: government_id, selfie — passed/failed
- **Report** (`rep_`) — AML report: watchlist, PEP — no_matches/match
- **Account** (`act_`) — user profile aggregating all data
- **Transaction** (`txn_`) — financial monitoring (API-created)

Relationships: Account 1→N Inquiries 1→N Verifications, Reports

## Reference Files

- `reference/persona/data-model.md` — Full data model with fields, statuses, signals
- `reference/persona/dashboard-sections.md` — Dashboard navigation and view patterns
- `reference/design/ui-patterns.md` — UI layout patterns, colors, typography
- `reference/tech/architecture.md` — Technical architecture, project structure, API contract
- `reference/tech/implementation-plan.md` — Phased implementation plan
- `reference/openai-design-reference.md` — OpenAI design system reference (colors, typography, components)

## Development

```bash
npm run dev      # Start dev server at port 3100
npm run build    # Production build
npm run lint     # Lint
```

## Design Principles

1. **Simplicity** — Simplified version of Persona, not a clone
2. **PlexUI-first** — Use PlexUI components wherever possible
3. **OpenAI aesthetics** — Clean, minimal, professional look inspired by platform.openai.com
4. **Dark mode** — Support light/dark via PlexUI tokens + next-themes
5. **Mock data** — Server provides data; use JSON fixtures for development
6. **Type safety** — Strong TypeScript types for all entities
