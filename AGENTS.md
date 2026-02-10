# Agents Configuration — Folio App

## Project Context

Building a KYC Analytics Dashboard (Folio) using Next.js 16 + PlexUI + Tailwind CSS 4.
Dev server runs on port 3100.

## UI Kit Reference

The PlexUI component library is at `/Users/sergey/github/plexui-docs/packages/ui/src/components/`.
Documentation site: `/Users/sergey/github/plexui-docs/content/docs/`.
Online docs: https://plexui.com/docs

---

## PlexUI Complete Reference

### Installation & Setup

```bash
npm install @plexui/ui
```

**CSS imports in globals.css — import token files + tailwind utilities, NOT the full bundle:**
```css
@import "../../node_modules/@plexui/ui/dist/es/styles/variables-primitive.css";
@import "../../node_modules/@plexui/ui/dist/es/styles/variables-semantic.css";
@import "../../node_modules/@plexui/ui/dist/es/styles/variables-components.css";
@import "../../node_modules/@plexui/ui/dist/es/styles/tailwind-utilities.css";
```
Do NOT use `@import "@plexui/ui/css"` — it conflicts with Tailwind's theme setup.

**CRITICAL:** `tailwind-utilities.css` is required for PlexUI typography classes (`heading-sm`, `text-md`, etc.). Without it, `@utility` definitions are missing and classes render with no styles.

Use `@source "../../node_modules/@plexui/ui"` in CSS for Tailwind class scanning.

**Component imports — use deep path imports:**
```tsx
import { Button } from "@plexui/ui/components/Button";
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { Input } from "@plexui/ui/components/Input";
```

**Provider setup:**
```tsx
import { PlexUIProvider } from "@plexui/ui/components/PlexUIProvider";
// Wrap app with <PlexUIProvider> at root layout
```

### Theme System

- PlexUI uses `data-theme="light|dark"` attribute on `<html>`
- next-themes uses `attribute="class"` → adds `light`/`dark` class to `<html>`
- `ThemeSync` component bridges next-themes (class-based) ↔ PlexUI (data-theme)
- CSS uses `light-dark()` function for automatic light/dark switching
- Theme can be scoped to nested elements: `<div data-theme="light">`

**Theme utilities from `@plexui/ui/theme`:**
- `applyDocumentTheme()` — sets current theme
- `getDocumentTheme()` — returns "light" | "dark"
- `useDocumentTheme()` — React hook for live theme values

---

### Typography

PlexUI provides utility classes for typography. **Always use these instead of arbitrary Tailwind text classes.**

**Heading classes** (all weight 600 / semibold):

| Class | Size | Line-height | Tracking |
|-------|------|-------------|----------|
| `heading-5xl` | 4.5rem (72px) | 5rem (80px) | tight (-0.02em) |
| `heading-4xl` | 3.75rem (60px) | 4rem (64px) | tight |
| `heading-3xl` | 3rem (48px) | 3.25rem (52px) | tight |
| `heading-2xl` | 2.25rem (36px) | 2.5rem (40px) | tight |
| `heading-xl` | 1.75rem (28px) | 2rem (32px) | tight |
| `heading-lg` | 1.375rem (22px) | 1.75rem (28px) | normal (-0.01em) |
| `heading-md` | 1.125rem (18px) | 1.625rem (26px) | normal |
| `heading-sm` | 1rem (16px) | 1.5rem (24px) | normal |
| `heading-xs` | 0.875rem (14px) | 1.25rem (20px) | wide (0em) |

**Text classes** (all weight 400 / regular):

| Class | Size | Line-height | Tracking |
|-------|------|-------------|----------|
| `text-lg` | 1.125rem (18px) | 1.625rem (26px) | normal |
| `text-md` | 1rem (16px) | 1.5rem (24px) | normal |
| `text-sm` | 0.875rem (14px) | 1.25rem (20px) | wide |
| `text-xs` | 0.75rem (12px) | 1rem (16px) | wide |
| `text-2xs` | 0.6875rem (11px) | 0.875rem (14px) | wide |
| `text-3xs` | 0.625rem (10px) | 0.875rem (14px) | wide |

**Usage:** Apply directly as className: `<h2 className="heading-sm">Title</h2>`

---

### Colors

**Text colors:**
- `color-text` — primary text
- `color-text-secondary` — secondary text
- `color-text-tertiary` — tertiary text
- `color-text-inverse` — inverse text (white)

**Surface/background:**
- `color-surface` — main surface background
- `color-border` — borders

**8 semantic colors:** primary, secondary, danger, success, warning, caution, discovery, info

Each semantic color has 5 variant sets:
- **-soft**: `{color}-soft-bg`, `{color}-soft-text`, `{color}-soft-border`
- **-solid**: `{color}-solid-bg`, `{color}-solid-text`, `{color}-solid-border`
- **-outline**: `{color}-outline-bg`, `{color}-outline-text`, `{color}-outline-border`
- **-ghost**: `{color}-ghost-bg`, `{color}-ghost-text`, `{color}-ghost-border`
- **-surface**: `{color}-surface-bg`, `{color}-surface-text`, `{color}-surface-border`

**Usage in Tailwind:**
```tsx
<div className="text-[var(--color-text)] bg-[var(--color-surface)]">
  <span className="text-[var(--color-text-secondary)]">Label</span>
  <div className="border border-[var(--color-border)]">Card</div>
</div>
```

---

### Design Tokens

**Radius scale:** 2xs (2px), xs (4px), sm (6px), md (8px), lg (10px), xl (12px), 2xl (16px), full (9999px)

**Shadows:** hairline, 100, 200, 300, 400 (each with `-strong` and `-stronger` variants)

**Breakpoints:** xs (380px), sm (576px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

**Motion:** cubic-bezier functions (enter, exit, snappy-exit, move), 150ms default transition duration

**Font families:** `font-sans`, `font-mono`

**Font weights:** normal (400), medium (500), semibold (600), bold (700)

---

### 9-Step Size Scale

Shared across Button, Input, Select, SegmentedControl, SelectControl:

| Size | Height |
|------|--------|
| `3xs` | 22px |
| `2xs` | 26px |
| `xs` | 28px |
| `sm` | 30px |
| `md` | 32px (default) |
| `lg` | 36px |
| `xl` | 40px |
| `2xl` | 44px |
| `3xl` | 48px |

---

## Components Reference

### Button
**Import:** `@plexui/ui/components/Button`

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `color` | `"primary" \| "secondary" \| "danger" \| "success" \| "info" \| "discovery" \| "caution" \| "warning"` | — | **YES** |
| `variant` | `"solid" \| "soft" \| "outline" \| "ghost"` | `"solid"` | no |
| `size` | 9-step scale | `"md"` | no |
| `pill` | `boolean` | `false` | no |
| `block` | `boolean` | `false` | no |
| `uniform` | `boolean` | `false` | no |
| `loading` | `boolean` | `false` | no |
| `disabled` | `boolean` | `false` | no |
| `StartIcon` | `Component` | — | no |
| `EndIcon` | `Component` | — | no |

**`color` is REQUIRED.** Always provide it.

```tsx
<Button color="primary">Save</Button>
<Button color="secondary" variant="ghost">Cancel</Button>
<Button color="danger" variant="outline" size="sm">Delete</Button>
<Button color="primary" loading>Saving...</Button>
```

### ButtonLink
**Import:** `@plexui/ui/components/ButtonLink`

Same props as Button plus `href`. Renders as an anchor tag styled like a button.

```tsx
<ButtonLink href="/docs" color="primary">View Docs</ButtonLink>
```

### Input
**Import:** `@plexui/ui/components/Input`

| Prop | Type | Default |
|------|------|---------|
| `size` | 9-step scale | `"md"` |
| `variant` | `"outline" \| "soft" \| "ghost"` | `"outline"` |
| `pill` | `boolean` | `false` |
| `block` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `StartIcon` | `Component` | — |
| `EndIcon` | `Component` | — |
| `startAdornment` | `ReactNode` | — |
| `endAdornment` | `ReactNode` | — |

```tsx
<Input placeholder="Search..." StartIcon={Search} size="md" block />
```

### FloatingLabelInput
**Import:** `@plexui/ui/components/FloatingLabelInput`

Same as Input but with a floating label that animates on focus/fill.

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | — |
| `size` | 9-step scale | `"md"` |
| `variant` | `"outline" \| "soft"` | `"outline"` |

### Textarea
**Import:** `@plexui/ui/components/Textarea`

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"outline" \| "soft" \| "ghost"` | `"outline"` |
| `resize` | `"none" \| "vertical" \| "horizontal" \| "both"` | `"none"` |
| `autoGrow` | `boolean` | `false` |
| `block` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `rows` | `number` | — |

### Select
**Import:** `@plexui/ui/components/Select`

| Prop | Type | Default |
|------|------|---------|
| `options` | `Array<{ value: string; label: string }>` | — |
| `value` | `string` | — |
| `onChange` | `(value: string) => void` | — |
| `placeholder` | `string` | — |
| `size` | 9-step scale | `"md"` |
| `variant` | `"outline" \| "soft" \| "ghost"` | `"outline"` |
| `pill` | `boolean` | `false` |
| `block` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |

```tsx
<Select
  options={[{ value: "us", label: "United States" }, { value: "uk", label: "UK" }]}
  value={country}
  onChange={setCountry}
  placeholder="Select country"
  block
/>
```

### SelectControl
**Import:** `@plexui/ui/components/SelectControl`

Headless trigger component for custom dropdowns (use with Menu or Popover).

| Prop | Type | Default |
|------|------|---------|
| `selected` | `boolean` | — |
| `variant` | `"soft" \| "outline" \| "ghost"` | `"outline"` |
| `size` | 9-step scale | — |
| `pill` | `boolean` | — |
| `block` | `boolean` | — |
| `onClearClick` | `() => void` | — |
| `dropdownIconType` | `"chevronDown" \| "dropdown" \| "none"` | — |

### Badge
**Import:** `@plexui/ui/components/Badge`

| Prop | Type | Default |
|------|------|---------|
| `color` | `"secondary" \| "success" \| "danger" \| "warning" \| "info" \| "discovery" \| "caution"` | `"secondary"` |
| `variant` | `"solid" \| "soft" \| "outline"` | `"soft"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `pill` | `boolean` | `false` |
| `StartIcon` | `Component` | — |
| `EndIcon` | `Component` | — |

```tsx
<Badge color="success">Approved</Badge>
<Badge color="danger" variant="solid" size="sm">Failed</Badge>
```

### Alert
**Import:** `@plexui/ui/components/Alert`

| Prop | Type | Default |
|------|------|---------|
| `color` | `"primary" \| "secondary" \| "danger" \| "success" \| "info" \| "warning" \| "caution" \| "discovery"` | — |
| `variant` | `"solid" \| "soft" \| "outline"` | `"soft"` |
| `title` | `string` | — |
| `description` | `string` | — |
| `Icon` | `Component` | — |
| `dismissible` | `boolean` | `false` |
| `onDismiss` | `() => void` | — |
| `actions` | `ReactNode` | — |

### Avatar
**Import:** `@plexui/ui/components/Avatar`

| Prop | Type | Default |
|------|------|---------|
| `name` | `string` | — |
| `imageUrl` | `string` | — |
| `Icon` | `Component` | — |
| `size` | `number` (px) | — |
| `color` | semantic color | — |
| `variant` | `"soft" \| "solid"` | — |
| `overflowCount` | `number` | — |
| `onClick` | `() => void` | — |

### AvatarGroup
**Import:** `@plexui/ui/components/Avatar`

| Prop | Type | Default |
|------|------|---------|
| `size` | `number` (px) | — |
| `stack` | `"start" \| "end"` | `"start"` |

```tsx
<AvatarGroup size={42}>
  <Avatar name="Tyler" imageUrl="..." />
  <Avatar name="Jane" color="primary" variant="solid" />
  <Avatar overflowCount={5} />
</AvatarGroup>
```

### Checkbox
**Import:** `@plexui/ui/components/Checkbox`

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean \| "indeterminate"` | — |
| `defaultChecked` | `boolean \| "indeterminate"` | — |
| `onCheckedChange` | `(next: boolean) => void` | — |
| `label` | `ReactNode` | — |
| `disabled` | `boolean` | `false` |
| `orientation` | `"left" \| "right"` | `"left"` |

### Switch
**Import:** `@plexui/ui/components/Switch`

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | — |
| `onCheckedChange` | `(checked: boolean) => void` | — |
| `label` | `ReactNode` | — |
| `disabled` | `boolean` | `false` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |

### RadioGroup
**Import:** `@plexui/ui/components/RadioGroup`

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | — |
| `onValueChange` | `(value: string) => void` | — |
| `options` | `Array<{ value: string; label: string; description?: string }>` | — |
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` |
| `disabled` | `boolean` | `false` |

### Slider
**Import:** `@plexui/ui/components/Slider`

| Prop | Type | Default |
|------|------|---------|
| `value` | `number[]` | — |
| `onValueChange` | `(value: number[]) => void` | — |
| `min` | `number` | `0` |
| `max` | `number` | `100` |
| `step` | `number` | `1` |
| `disabled` | `boolean` | `false` |

### SegmentedControl
**Import:** `@plexui/ui/components/SegmentedControl`

| Prop | Type | Default |
|------|------|---------|
| `options` | `Array<{ value: string; label: string; Icon?: Component }>` | — |
| `value` | `string` | — |
| `onChange` | `(value: string) => void` | — |
| `size` | 9-step scale | `"md"` |
| `block` | `boolean` | `false` |
| `pill` | `boolean` | `false` |

```tsx
<SegmentedControl
  options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }]}
  value={view}
  onChange={setView}
/>
```

### DatePicker
**Import:** `@plexui/ui/components/DatePicker`

| Prop | Type | Default |
|------|------|---------|
| `value` | `DateTime \| null` | — |
| `onChange` | `(value: DateTime \| null) => void` | — |
| `min` | `DateTime` | — |
| `max` | `DateTime` | — |
| `size` | 9-step scale | `"md"` |
| `pill` | `boolean` | `false` |
| `triggerDateFormat` | `string` (Luxon format) | — |
| `placeholder` | `string` | — |

Uses **Luxon DateTime** objects (not JS Date).

### DateRangePicker
**Import:** `@plexui/ui/components/DateRangePicker`

| Prop | Type | Default |
|------|------|---------|
| `value` | `[DateTime, DateTime] \| null` | — |
| `onChange` | `(range: [DateTime, DateTime] \| null, shortcut?: Shortcut) => void` | — |
| `shortcuts` | `Array<{ label: string; getDateRange: () => [DateTime, DateTime] }>` | — |
| `min` | `DateTime` | — |
| `max` | `DateTime` | — |
| `size` | 9-step scale | `"md"` |
| `pill` | `boolean` | `false` |
| `triggerDateFormat` | `string` | — |

```tsx
<DateRangePicker
  value={dateRange}
  onChange={handleRangeChange}
  shortcuts={shortcuts}
  max={DateTime.local().endOf("day")}
  triggerDateFormat="MM/dd/yy"
/>
```

### Menu
**Import:** `@plexui/ui/components/Menu`

Compound component: `Menu`, `Menu.Trigger`, `Menu.Content`, `Menu.Item`, `Menu.Separator`, `Menu.Group`, `Menu.Label`

| Prop (Menu.Item) | Type | Default |
|-------------------|------|---------|
| `onSelect` | `() => void` | — |
| `disabled` | `boolean` | `false` |
| `StartIcon` | `Component` | — |
| `EndIcon` | `Component` | — |
| `destructive` | `boolean` | `false` |

```tsx
<Menu>
  <Menu.Trigger asChild>
    <Button color="secondary">Options</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item onSelect={handleEdit} StartIcon={Edit}>Edit</Menu.Item>
    <Menu.Separator />
    <Menu.Item onSelect={handleDelete} destructive StartIcon={Trash}>Delete</Menu.Item>
  </Menu.Content>
</Menu>
```

### Popover
**Import:** `@plexui/ui/components/Popover`

Compound component: `Popover`, `Popover.Trigger`, `Popover.Content`

| Prop (root) | Type | Default |
|-------------|------|---------|
| `showOnHover` | `boolean` | `false` |

| Prop (Content) | Type | Default |
|----------------|------|---------|
| `width` | `number \| string` | — |
| `minWidth` | `number \| string` | `300` |
| `maxWidth` | `number \| string` | — |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | — |
| `align` | `"start" \| "center" \| "end"` | — |
| `sideOffset` | `number` | — |

Hook: `usePopoverController()` returns `{ close, shake }`

### Tooltip
**Import:** `@plexui/ui/components/Tooltip`

Compound component: `Tooltip`, `Tooltip.Trigger`, `Tooltip.Content`

| Prop (Content) | Type | Default |
|----------------|------|---------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` |
| `sideOffset` | `number` | — |

```tsx
<Tooltip>
  <Tooltip.Trigger asChild><Button color="secondary">Hover me</Button></Tooltip.Trigger>
  <Tooltip.Content>Tooltip text</Tooltip.Content>
</Tooltip>
```

### CopyTooltip
**Import:** `@plexui/ui/components/CopyTooltip`

| Prop | Type | Default |
|------|------|---------|
| `text` | `string` | — |
| `children` | `ReactNode` | — |

Wraps content; copies `text` to clipboard on click with tooltip feedback.

### Sidebar
**Import:** `@plexui/ui/components/Sidebar`

Full compound component system:

- **SidebarProvider** — wraps entire layout, manages collapse state
  - `collapsible`: `"none" | "icon" | "full"` — collapse behavior
- **SidebarLayout** — flex container for sidebar + content
- **Sidebar** — the sidebar itself
  - `collapsible`, `side` ("left" | "right")
- **SidebarInset** — renders `<main>` with proper overflow/layout
- **SidebarContent** — scrollable content area
- **SidebarGroup** — groups menu items
- **SidebarGroupLabel** — section label
- **SidebarMenu** — `<ul>` wrapper
- **SidebarMenuItem** — `<li>` wrapper
- **SidebarMenuButton** — interactive button item
  - `isActive`, `tooltip`, `size`
- **SidebarHeader** / **SidebarFooter** — top/bottom sections
- **SidebarSeparator** — divider
- **SidebarTrigger** — toggle button

```tsx
<SidebarProvider collapsible="none">
  <SidebarLayout>
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={pathname === "/"}>
                <Home /> Overview
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <SidebarInset>{children}</SidebarInset>
  </SidebarLayout>
</SidebarProvider>
```

**IMPORTANT:** SidebarInset renders `<main>` with `overflow: auto; flex: 1;`. Do NOT nest another `<main>` inside it.

### Skeleton
**Import:** `@plexui/ui/components/Skeleton`

| Prop | Type | Default |
|------|------|---------|
| `width` | `string \| number` | — |
| `height` | `string \| number` | — |
| `variant` | `"text" \| "circular" \| "rectangular"` | `"text"` |

### EmptyMessage
**Import:** `@plexui/ui/components/EmptyMessage`

| Prop | Type | Default |
|------|------|---------|
| `title` | `string` | — |
| `description` | `string` | — |
| `Icon` | `Component` | — |
| `actions` | `ReactNode` | — |

### FieldError
**Import:** `@plexui/ui/components/FieldError`

| Prop | Type | Default |
|------|------|---------|
| `message` | `string` | — |

### ProgressSteps
**Import:** `@plexui/ui/components/ProgressSteps`

| Prop | Type | Default |
|------|------|---------|
| `steps` | `Array<{ label: string; description?: string }>` | — |
| `currentStep` | `number` | — |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |

### TagInput
**Import:** `@plexui/ui/components/TagInput`

| Prop | Type | Default |
|------|------|---------|
| `value` | `string[]` | — |
| `onChange` | `(tags: string[]) => void` | — |
| `placeholder` | `string` | — |
| `size` | 9-step scale | `"md"` |
| `block` | `boolean` | `false` |

### TextLink
**Import:** `@plexui/ui/components/TextLink`

| Prop | Type | Default |
|------|------|---------|
| `href` | `string` | — |
| `color` | semantic color | — |
| `underline` | `"always" \| "hover" \| "none"` | — |

### Icon
**Import:** `@plexui/ui/components/Icon`

800+ icons imported by PascalCase name:
```tsx
import { ArrowRight, Search, Mail, Settings } from "@plexui/ui/components/Icon";
```

Icons render as inline SVG with `fill="currentColor"` and `width="1em" height="1em"`.
They inherit text color and scale with parent font size.

### Image
**Import:** `@plexui/ui/components/Image`

Enhanced img component with loading states and error handling.

### CodeBlock
**Import:** `@plexui/ui/components/CodeBlock`

| Prop | Type | Default |
|------|------|---------|
| `children` | `string` | — |
| `language` | `string` | — |

Also exports `CollapsibleCodeBlock` with `defaultExpanded`, `collapsedHeight`, `maxExpandedHeight`, `copyable`.

### Markdown
**Import:** `@plexui/ui/components/Markdown`

Renders markdown content with PlexUI styling.

### ShimmerText
**Import:** `@plexui/ui/components/ShimmerText`

Animated shimmer effect for streaming text.

### Indicators
**Import:** `@plexui/ui/components/Indicators`

Status dot indicators for visual state.

### Transition
**Import:** `@plexui/ui/components/Transition`

Animation wrapper component for enter/exit transitions.

---

## PlexUI Hooks

All hooks imported from `@plexui/ui/hooks/{hookName}`:

| Hook | Signature | Purpose |
|------|-----------|---------|
| `useBreakpoint` | `useBreakpoint("lg"): boolean` | Viewport breakpoint check |
| `useDocumentVisible` | `useDocumentVisible(): boolean` | Tab/page visibility |
| `useEscCloseStack` | `useEscCloseStack(isOpen, onClose)` | Escape key handler stack |
| `useIsMounted` | `useIsMounted(): boolean` | Client-side mount check |
| `usePrevious` | `usePrevious(value): T` | Previous render value |
| `useScrollable` | `useScrollable(ref): { isScrollable, isAtStart, isAtEnd }` | Scroll state |
| `useStableCallback` | `useStableCallback(fn): fn` | Stable callback identity |
| `useLatestValue` | `useLatestValue(value): Ref<T>` | Latest value ref |
| `useAutoGrowTextarea` | `useAutoGrowTextarea(ref, value)` | Auto-resize textarea |
| `useAnimatedScrollTo` | `useAnimatedScrollTo(ref): scrollTo` | Smooth scroll |
| `useSimulatedProgress` | `useSimulatedProgress(start, duration, done): number` | Fake progress bar |
| `useTrailingValue` | `useTrailingValue(value, delay): T` | Delayed trailing value |
| `useCharactersPerSecond` | `useCharactersPerSecond(text, streaming): getCps` | Streaming speed |
| `useTextSelection` | `useTextSelection(enabled, callback)` | Text selection monitor |

---

## Domain Knowledge

### Persona Data Model
Read `reference/persona/data-model.md` for full entity reference.
Core entities: Inquiry (inq_), Verification (ver_), Report (rep_), Account (act_), Transaction (txn_).

### Dashboard Sections
Read `reference/persona/dashboard-sections.md` for navigation structure and view patterns.

### UI Patterns
Read `reference/design/ui-patterns.md` for layout patterns, component patterns, colors, typography.

### Technical Architecture
Read `reference/tech/architecture.md` for project structure, tech stack decisions, API contract.

### Implementation Plan
Read `reference/tech/implementation-plan.md` for phased implementation plan.

### OpenAI Design Reference
Read `reference/openai-design-reference.md` for OpenAI design system reference.

---

## Coding Conventions

### File Naming
- Components: PascalCase (e.g., `MetricCard.tsx`, `DataTable.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useInquiries.ts`)
- Types: PascalCase in `types/` folder (e.g., `inquiry.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)

### Component Pattern
```tsx
"use client"; // only if needed (state, effects, event handlers)

import { Badge } from "@plexui/ui/components/Badge";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; direction: "up" | "down" };
}

export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</p>
      <p className="mt-2 heading-2xl text-[var(--color-text)]">{value}</p>
    </div>
  );
}
```

### TypeScript Types
All API entities must have TypeScript interfaces in `src/lib/types/`.

### Styling
- Use Tailwind CSS utility classes
- Use PlexUI design tokens via CSS custom properties: `var(--color-*)`
- Use PlexUI typography classes (heading-*, text-*) instead of arbitrary Tailwind text sizes
- No inline styles except for dynamic values
- Responsive: mobile-first approach

### Layout Pattern
- SidebarInset provides the scroll container (overflow: auto)
- TopBar uses `sticky top-0 z-10 shrink-0` to stick on scroll
- Table pages use flex column layout with pinned pagination footer
- Never nest `<main>` inside SidebarInset (it already renders `<main>`)

## Key Decisions

1. **Server Components by default** — Use Client Components only when needed for interactivity
2. **PlexUI for all standard UI** — Buttons, badges, inputs, sidebar, etc.
3. **Custom components for domain-specific** — MetricCard, DataTable, ChartCard
4. **TanStack Table for data tables** — Headless, with custom PlexUI-style rendering
5. **Recharts for charts** — Wrapped in custom ChartCard components
6. **Mock data first** — Build UI with JSON fixtures, swap for API later
7. **Feature-based organization** — Components grouped by feature (inquiry/, verification/, etc.)
8. **Providers hierarchy** — ThemeProvider → ThemeSync → PlexUIProvider → QueryProvider
9. **No Table component in PlexUI** — use TanStack Table v8 with custom styling
10. **Luxon for dates** — PlexUI DatePicker/DateRangePicker use Luxon DateTime objects
