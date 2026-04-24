# Design Brief

## Direction

NeuroWeb — interactive force-directed graph visualization of thought connections with glowing sci-fi aesthetic on dark canvas.

## Tone

Sci-fi minimalism: dark, sophisticated, electrically lit nodes that feel alive and responsive; tech-forward with neural network references without being overwrought.

## Differentiation

Glowing cyan nodes that pulse on interaction, flowing purple connections, and minimal UI chrome maximize graph visibility and create an immersive "explore your mind" experience.

## Color Palette

| Token       | OKLCH          | Role                          |
| ----------- | -------------- | ----------------------------- |
| background  | 0.12 0 0       | Deep charcoal canvas          |
| foreground  | 0.92 0 0       | High-contrast text            |
| card        | 0.16 0 0       | Elevated UI surfaces          |
| primary     | 0.65 0.22 190  | Cyan nodes, active highlights |
| secondary   | 0.2 0 0        | Muted UI backgrounds          |
| accent      | 0.55 0.18 280  | Purple connections, secondary |
| destructive | 0.55 0.22 25   | Delete/clear actions          |
| border      | 0.24 0 0       | Subtle UI dividers            |

## Typography

- Display: Space Grotesk — geometric, futuristic headings and labels; tech-forward personality
- Body: DM Sans — clean, readable UI text and descriptions
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight`, h2 `text-2xl font-bold tracking-tight`, label `text-sm font-semibold`, body `text-base leading-relaxed`

## Elevation & Depth

Dark layering with subtle lift: cards are `0.16L` on `0.12L` background; glowing effects (cyan and purple) create perceived depth on flat canvas; no heavy shadows—soft glow-box-shadows instead.

## Structural Zones

| Zone    | Background      | Border         | Notes                              |
| ------- | --------------- | -------------- | ---------------------------------- |
| Header  | card (0.16L)    | border (0.24L) | Title + mode toggle               |
| Canvas  | background      | —              | Force-directed graph, full width   |
| Control | card (0.16L)    | border (0.24L) | Buttons bottom-right, fixed float |
| Modal   | popover (0.2L)  | border (0.24L) | Create/inspect thought overlays    |

## Spacing & Rhythm

Generous breathing room for graph clarity: 24px section padding, 16px internal card gaps, 8px micro-spacing on buttons; graph occupies 100% canvas with 16px margins for UI float.

## Component Patterns

- Buttons: `rounded-md`, primary cyan `bg-primary`, hover `ring-2 ring-primary ring-offset-2 ring-offset-background`, transitions smooth 0.3s
- Cards: `rounded-lg`, `bg-card border border-border`, subtle lift on hover
- Node glow: `node-glow` utility with dual-layer cyan box-shadow (0.5α inner, 0.2α outer)
- Connections: purple `accent` color with `connection-pulse` animation

## Motion

- Entrance: nodes fade in staggered over 300–600ms as graph initializes
- Hover: node pulses cyan glow, title label fades in; connection highlights secondary accent
- Interactive: smooth force simulation, pan/zoom inertia, 60fps canvas animation

## Constraints

- Dark mode only; cyan and purple glows must pop against deep black background
- Nodes scale by connection count but maintain clickability; minimum size 16px, maximum 48px
- Graph canvas never shows scrollbars; constrain to viewport minus 32px padding
- No generic gradients or blur effects; pure solid colors with glow utilities

## Signature Detail

Dual-layer glowing cyan nodes that pulse on interaction and cast soft light onto background—creates the illusion of an active neural network that responds to your touch.

