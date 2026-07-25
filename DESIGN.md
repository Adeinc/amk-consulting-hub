<!-- SEED: established with the user before implementation; re-run /impeccable document once there's code to capture the actual tokens and components. -->

---
name: AMK Consulting Hub
description: A warm, photo-led, alive booking experience — real rooms, real energy, no paperwork metaphor.
colors:
  navy: "#0c2a4e"
  teal: "#0c8496"
  teal-deep: "#086878"
  teal-bright: "#14a3b8"
  soft: "#f2f8f8"
  border: "#d8e2e2"
  confirm: "#16a34a"
  alert: "#dc2626"
typography:
  display:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontWeight: 800
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontWeight: 400
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontWeight: 500
rounded:
  sm: "10px"
  md: "14px"
  lg: "20px"
  pill: "9999px"
---

# Design System: AMK Consulting Hub

## Overview

**Creative North Star: "Open the Door"**

Revision 2 — replaces the "Duplicate Book" paper-ledger world after user feedback that it read as flat, cold, and generic ("like a calculator site"). The new world is photography-led and energetic: every room is a real (currently stock, clearly sample-flagged) photograph, not an abstract index number; color shows up as gradients and glows, not just flat swatches; motion is constant but purposeful — a slow Ken Burns drift on hero imagery, floating ambient glow orbs, a shine/flash sweep across primary buttons on hover, scroll-triggered fade-and-rise reveals, and a satisfying animated checkmark burst on booking confirmation.

Rejected explicitly (carried over, still true): stock photography of generic smiling-people-in-office scenes, and the previous system's flat/sharp/monospace-heavy chrome (buttons, nav, and labels in uppercase mono), which is what made it feel sterile. Mono is now reserved only for genuinely numeric data in the admin/dashboard context (prices, stats) — never for buttons, nav, or headings.

**Key Characteristics:**
- Full-bleed room photography everywhere a room is represented; a photo, not an icon or number, is the primary visual unit.
- Rounded, soft-shadowed surfaces (14–24px radius) — nothing sharp or flat-at-rest.
- Gradients (teal → deep teal, navy → teal) carry primary actions and dark sections; solid flat color is the exception, not the rule.
- Motion is continuous and ambient (drifting hero image, floating glow orbs) plus responsive (shine sweep on button hover, card lift + image zoom on hover, scroll reveals) — the page should never feel static.
- Placeholder/sample content is marked with a small pill badge (soft background + icon), not a bureaucratic stamp.

## Colors

### Primary
- **Registrar Teal** (`#0c8496`) and **Teal Bright** (`#14a3b8`): the gradient pair that carries every primary action, active state, and accent glow.
- **Teal Deep** (`#086878`): gradient endpoint / hover state.

### Neutral
- **Navy** (`#0c2a4e`): primary text; also the base of the navy→teal gradient used for dark sections (footer, dashboard sidebar, combinable-room feature, confirmation CTA).
- **Soft** (`#f2f8f8`): page background and field fill.
- **Border** (`#d8e2e2`): hairline dividers only — most separation now comes from card elevation/shadow, not rules.

### Status
- **Confirm** (`#16a34a`) / **Alert** (`#dc2626`): success/error only, expressed as soft-tinted pill badges and the checkmark-burst confirmation animation, never as a stamp.

### Named Rules
**The Gradient-Carries-Energy Rule.** Primary buttons, active nav/tab states, and every dark section use the teal or navy→teal gradient — flat solid fills read as the old, rejected system.

## Typography

**Display/Body Font:** Public Sans (extrabold for headings, regular for body).
**Data Font:** JetBrains Mono — reserved strictly for admin/dashboard numeric data (stats, per-room price lists). Never used for buttons, navigation, tab labels, or headings; that mono-everywhere treatment was a specific rejected trait of the prior revision.

## Layout

Sections run full-bleed edge to edge for anything photographic (hero, room detail banner, combinable-room feature, final CTA); content-width containers (max-w-6xl) are reserved for text/grid sections. Room grids are 3-up desktop / 2-up tablet / 1-up mobile, each card a photo-topped rounded panel.

## Elevation & Depth

Soft, generous shadows are the default (`--shadow-card` at rest, `--shadow-lift` on hover) — this world is not flat-by-default. Interactive cards lift (-6px translateY) and their photo zooms (scale 1.08) together on hover.

### Named Rules
**The Always-Alive Rule.** Nothing interactive sits perfectly static — every card, button, and image has a hover response (lift, zoom, shine, or glow).

## Shapes

Generously rounded: 14–20px on cards and photo panels, full pill (9999px) on buttons, nav items, and badges. Sharp corners were a rejected trait of the prior revision.

## Components

### Buttons
- **Shape:** full pill.
- **Primary:** teal→teal-deep gradient fill, white text, a diagonal white "shine" sweep animates across on hover (the site's signature micro-interaction).
- **Secondary:** white fill, 2px soft navy border, teal border/text on hover.

### Room Card (signature component)
- Photo fills the top ~190px, gradient-scrimmed for legible white room-name text overlaid at the bottom.
- "Sample photo" pill badge, top-right.
- Hover: card lifts, photo zooms slightly, arrow chip slides right.

### Availability Board (signature component)
- Rounded pill/rounded-xl cells in a day × session grid, flip-reveal on load (kept from the prior revision — this motion tested well). Selected cell gets the full gradient + glow treatment.

### Confirmation moment (signature component)
- An animated SVG checkmark draws in inside a filled confirm-green circle, with an expanding ring pulse behind it — replaces the old rubber-stamp mark.

### Navigation
- Pill-shaped active state on a transparent/blurred white header; dashboard sidebar uses the navy→teal gradient with a solid white pill for the active item.

## Do's and Don'ts

### Do:
- **Do** use a real (stock, sample-flagged) photo for every room representation — card, detail hero, combinable-room feature.
- **Do** give every primary button the shine-sweep hover.
- **Do** use scroll-reveal (fade + rise) once per section on the way down the homepage.
- **Do** keep the "Sample photo" / dental-room-is-real-and-confirmed distinction clear: room *identities* the client has confirmed (e.g. the dental treatment room) are product truth; the *photos and pricing* remain sample until real ones arrive.

### Don't:
- **Don't** revert to uppercase monospace for buttons, nav, or headings — reserve mono strictly for admin numeric data.
- **Don't** flatten cards back to sharp corners or remove hover elevation — flat-and-sharp was the explicitly rejected prior system.
- **Don't** use a generic "smiling people in a bright office" stock photo — every image should look like a specific, plausible real room.
- **Don't** invent a second animated confirmation device — the checkmark-burst is the one closing flourish.
