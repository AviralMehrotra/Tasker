---
name: Tasker
description: Minimalist agile task management with razor-sharp structure and high-craft typography
colors:
  primary: "#09090b"
  accent: "#2563eb"
  accent-hover: "#1d4ed8"
  neutral-bg: "#fbfbfa"
  neutral-bg-dark: "#08090d"
  surface: "#ffffff"
  surface-dark: "#10121a"
  border: "#e5e7eb"
  border-dark: "#1d202d"
  text-primary: "#0f172a"
  text-primary-dark: "#f4f4f6"
  text-muted: "#8b90a0"
  status-todo: "#64748b"
  status-progress: "#2563eb"
  status-completed: "#10b981"
  status-danger: "#f43f5e"
typography:
  mono:
    fontFamily: "JetBrains Mono, monospace"
    tabularNums: true
  display:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "{colors.border}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "10px 18px"
  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "20px"
---

# Design System: Tasker

## Overview

**Creative North Star: "The Architect's Ledger"**

Tasker is engineered as a precision instruments ledger for modern product and engineering teams. Rather than burying work under heavyweight enterprise dashboards, Tasker treats every task, stage, and sprint as an architectural blueprint: clear structural lines, high-contrast legibility, and effortless tactical speed. The interface balances technical restraint with tactile satisfaction, giving team members instant clarity over what matters without visual noise.

The aesthetic philosophy centers on crisp geometric order, deliberate typographic hierarchy, and structural planes. Resting surfaces remain grounded and clean, reserving high-energy color solely for informative state indicators (priority status, stage progress, due date alerts). The result is an experience that feels disciplined, swift, and respectful of the user's cognitive bandwidth.

**Key Characteristics:**
- **Hairline Structural Planes:** Deliberate 1px borders define containers and columns rather than diffuse drop shadows.
- **Editorial Type Hierarchy:** Plus Jakarta Sans delivers sharp, modern geometric rhythm with tight display tracking.
- **Intentional Accent Economy:** Vibrant cadmium azure (#2563eb) is reserved strictly for primary interactive actions and focus states.
- **Dual-Mode Fluidity:** Seamless parity between crisp architectural white paper and deep charcoal night slate.

## Colors

The palette combines monochrome technical precision with concentrated functional color hits for status and priority.

### Primary
- **Obsidian Carbon** (#09090b): Grounding primary neutral in light mode, high-emphasis branding elements, and dark mode base structures.
- **Cadmium Azure** (#2563eb): Primary interactive trigger color; applied to active buttons, drag highlights, links, and selected states.

### Secondary
- **Deep Indigo Accent** (#6366f1): Secondary workflow accent; used for "In Progress" task chips, stage indicators, and user avatars.

### Neutral
- **Alabaster Neutral** (#fcfcfc): Light-mode application canvas and card backgrounds; clean, non-sterile architectural off-white.
- **Deep Charcoal Slate** (#0f172a): Dark-mode surface container; offers comfortable depth and contrast against text without pitch-black harshness.
- **Structural Slate Border** (#e2e8f0 in Light, #1e293b in Dark): Exact 1px hairline boundary line separating cards, columns, and navigation.
- **Muted Steel** (#64748b): Tertiary labels, timestamps, counter badges, and secondary caption typography.

### Named Rules
**The Razor Edge Rule.** Interfaces prioritize hairline structural separation (1px borders) and typographic weight over diffuse drop shadows. Surfaces do not float on nebulous clouds; they align with architectural precision.

**The Ink Density Rule.** Status colors (emerald, amber, rose) appear exclusively on compact indicator chips and status pills (≤10% screen density), never as full-card color floodings.

## Typography

**Display Font:** Plus Jakarta Sans (with -apple-system, BlinkMacSystemFont, Segoe UI fallback)
**Body Font:** Plus Jakarta Sans
**Label/Mono Font:** Plus Jakarta Sans (numeric and uppercase tracked variants)

**Character:** Geometric, humanistic, and razor-sharp. Plus Jakarta Sans pairs clean geometric roundness with tall x-height, ensuring exceptional micro-readability at 11px alongside assertive authority at 28px.

### Hierarchy
- **Display** (800 Extrabold, clamp(1.75rem, 3vw, 2.25rem), line-height 1.2, letter-spacing -0.025em): Primary view headings and hero titles.
- **Headline** (700 Bold, 1.5rem (24px), line-height 1.3, letter-spacing -0.02em): Section headers, modal titles, and major card groupings.
- **Title** (600 Semibold, 1.125rem (18px), line-height 1.4, letter-spacing -0.01em): Task card titles, board column headers, and dialog headings.
- **Body** (400 Regular / 500 Medium, 0.875rem (14px), line-height 1.5): Standard task descriptions, checklist titles, user names, and activity logs. Max line length: 65–75ch.
- **Label** (600 Semibold, 0.75rem (12px), letter-spacing 0.05em, uppercase): Field labels, table headers, priority pills, and metadata keys.

### Named Rules
**The Single Family Rule.** All UI roles use Plus Jakarta Sans across varying weights (400 through 800) and optical trackings. Variety is achieved through scale, uppercase tracking, and weight, never font mixing.

## Layout

Tasker adopts an asymmetrical desktop workspace and fluid single-column mobile layout.

- **Workspace Shell:** Fixed left sidebar (width: 256px / 16rem) on desktop with responsive slide-over drawer on viewports < 768px (`md`).
- **Main Container:** Fluid flex column with sticky 64px header/navbar and scrollable content canvas. Padding follows `p-4 sm:p-6 lg:p-8`.
- **Kanban Board Grid:** 3-column responsive layout (`grid-cols-1 md:grid-cols-3 gap-6`), with equal-width structural columns and fixed 48px column headers.
- **Density & Rhythm:** 8px base grid. Spacing steps adhere strictly to 4px (xs), 8px (sm), 12px (md-sm), 16px (md), 24px (lg), 32px (xl).

## Elevation & Depth

Tasker adheres to an Ultra-Minimal & Flat architectural model. Depth is established through subtle tonal shifts, layered backdrop blur, and 1px hairline structural borders rather than heavy atmospheric drop shadows.

### Shadow Vocabulary
- **Resting Surface** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): Subtle anchoring foundation for cards and inputs.
- **Interactive Hover** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.08)`): Applied on card hover and dragged Kanban item lift.
- **Action Button Glow** (`box-shadow: 0 1px 2px 0 rgb(37 99 235 / 0.2)`): Subtlest luminous accent under primary Cadmium Azure CTAs.
- **Modal Depth** (`box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25)`): Grounded elevation for dialogs over a 60% darkened backdrop blur overlay.

### Named Rules
**The Hairline Depth Rule.** Structural separation is achieved via `border-slate-200` in light mode and `border-slate-800` in dark mode. Shadows never substitute for missing structural borders.

## Shapes

The form language is calculated, modern, and disciplined:
- **Card and Modal Containers:** 16px radius (`rounded-2xl`). Soft enough to feel friendly, crisp enough to preserve ledger discipline.
- **Buttons, Inputs, and Tabs:** 12px radius (`rounded-xl`).
- **Checklist & Mini Control Nodes:** 8px radius (`rounded-lg`).
- **Chips, Badges, and User Avatars:** Fully rounded pills (`rounded-full` / 9999px).

## Components

### Buttons
- **Shape:** 12px radius (`rounded-xl`).
- **Primary:** Cadmium Azure background (#2563eb), solid white text, `px-4 py-2.5`, font-weight 600.
- **Hover / Focus:** Hover darkens to `#1d4ed8`; focus state triggers `ring-4 ring-blue-500/10` with outline none.
- **Secondary / Ghost:** Slate neutral (`bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700`), text-slate-700 dark:text-slate-300.

### Chips & Badges
- **Shape:** Fully rounded pill (`rounded-full`).
- **Style:** Compact padding `px-2.5 py-0.5`, font-size 11px-12px, font-weight 700.
- **Priority Variants:**
  - High: Rose background tint (`bg-rose-50 dark:bg-rose-950/40`), rose text (`text-rose-600 dark:text-rose-400`), 1px rose border.
  - Medium: Amber background tint (`bg-amber-50 dark:bg-amber-950/40`), amber text (`text-amber-600 dark:text-amber-400`).
  - Normal / Low: Blue background tint (`bg-blue-50 dark:bg-blue-950/40`), blue text (`text-blue-600 dark:text-blue-400`).

### Cards / Containers
- **Corner Style:** 16px radius (`rounded-2xl`).
- **Background:** `bg-white/80 dark:bg-slate-900/80` with `backdrop-blur-md`.
- **Border:** 1px solid `border-slate-200/80 dark:border-slate-800`.
- **Internal Padding:** 16px to 24px (`p-4 sm:p-6`).

### Inputs / Fields
- **Style:** 12px radius (`rounded-xl`), 1px border (`border-slate-200 dark:border-slate-700`), subtle background (`bg-slate-50/50 dark:bg-slate-800/60`).
- **Focus:** Sharp border shift to Cadmium Azure with `ring-4 ring-blue-500/10`.
- **Error:** Rose border shift (`border-rose-500`) with caption message in `#f43f5e`.

### Navigation
- **Sidebar:** Vertical link stack with 12px radius highlight, active state glows with blue text and subtle light background (`bg-blue-50/70 dark:bg-blue-950/40`).
- **Navbar:** Clean horizontal bar with live search input, theme toggle pill (Sun/Moon), notification bell with unread counter, and user profile avatar.

## Do's and Don'ts

### Do:
- **Do** maintain strict 1px hairline borders (`border-slate-200` in light, `border-slate-800` in dark) on all cards, panels, and dropdowns.
- **Do** preserve 100% theme parity between Light and Dark modes; every text token must have an explicit `dark:text-...` counterpart.
- **Do** limit primary accent color (#2563eb) to ≤10% of any viewport to preserve high visual hierarchy and signal clarity.
- **Do** use uppercase tracked typography (`text-xs font-semibold uppercase tracking-wider`) for form labels and table headers.

### Don't:
- **Don't** use heavy, multi-layered colorful box shadows that blur into the background.
- **Don't** flood entire card backgrounds with saturated alert colors (e.g. solid red card for high priority).
- **Don't** introduce disparate font families; adhere exclusively to Plus Jakarta Sans.
- **Don't** allow dark gray text (`text-gray-700` or `text-gray-900`) on dark backgrounds.
