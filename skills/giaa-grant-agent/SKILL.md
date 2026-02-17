---
name: giaa-grant-agent
description: >
  Development skill for the GIAA AI Grant Agent — a React + TypeScript + Vite dashboard
  for Glisten International Academy (Abuja, Nigeria). Use this skill when building features,
  debugging, or making changes to the Grant AI Agent project. It covers the project's tech stack,
  architecture, conventions, file structure, and common workflows.
metadata:
  author: giaa
  version: "1.0"
---

# GIAA AI Grant Agent — Development Skill

## Project Overview

This is an AI-powered grant discovery and management dashboard for **Glisten International Academy (GIAA)**, a private school in Abuja, Nigeria. The app helps the school discover, track, and apply for educational grants through an AI agent.

## Tech Stack

- **Framework**: React 19 + TypeScript 5.9
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 3.4 with a custom sci-fi/cyberpunk theme
- **UI Library**: shadcn/ui (40+ components based on Radix primitives)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State**: Custom React hooks using `useState` (no external state library)

## Project Structure

```
AI Agent/
├── src/
│   ├── App.tsx                  # Root component — view routing, dashboard rendering
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Global styles + Tailwind + CSS variables
│   ├── App.css                  # App-specific styles
│   ├── components/
│   │   ├── ui/                  # 53 shadcn/ui components (DO NOT edit directly)
│   │   ├── HoloCard.tsx         # Glowing card wrapper with neon borders
│   │   ├── NeonButton.tsx       # Themed button with shimmer effect
│   │   ├── StatusIndicator.tsx  # Status dot indicator
│   │   ├── DataStream.tsx       # Animated data stream effect
│   │   ├── CircularProgress.tsx # Circular progress bar
│   │   └── HexagonStat.tsx      # Hexagonal stat display
│   ├── sections/                # Page-level view components
│   │   ├── Header.tsx           # Top navigation bar
│   │   ├── Sidebar.tsx          # Left navigation sidebar
│   │   ├── StatsOverview.tsx    # Dashboard stats grid
│   │   ├── GrantList.tsx        # Grant opportunities listing with search/filter
│   │   ├── AIAgentPanel.tsx     # AI agent control panel
│   │   ├── ProposalAssistant.tsx # AI proposal editor
│   │   ├── DeadlineAlerts.tsx   # Deadline tracking alerts
│   │   └── SchoolProfile.tsx    # School profile management
│   ├── data/mockData.ts         # All mock data (grants, profile, agent, etc.)
│   ├── hooks/
│   │   ├── useStore.ts          # 6 state management hooks
│   │   └── use-mobile.ts       # Mobile detection hook
│   ├── types/index.ts           # All TypeScript interfaces
│   └── lib/utils.ts             # Utility functions (cn helper for classnames)
├── tailwind.config.js           # Custom theme: neon colors, fonts, animations
├── vite.config.ts               # Vite config with @/ path alias
├── package.json                 # Dependencies
└── index.html                   # HTML entry point
```

## Architecture & Conventions

### Navigation
- Views are managed via `useState<ViewType>` in `App.tsx` (no router library)
- ViewType: `'dashboard' | 'grants' | 'ai-agent' | 'proposals' | 'alerts' | 'profile' | 'settings'`
- `Sidebar.tsx` triggers navigation; `App.tsx.renderContent()` renders the correct section

### State Management
- All state lives in `src/hooks/useStore.ts` as custom hooks
- 6 stores: `useGrantsStore`, `useDashboardStore`, `useAIAgentStore`, `useNotificationsStore`, `useSchoolProfileStore`, `useProposalStore`
- **Important**: State is initialized ONCE in `App.tsx` and passed down as props. Do NOT call store hooks in child components — they would create independent state copies.
- All stores use mock data from `src/data/mockData.ts` as initial state

### Design System
- **Colors**: Use Tailwind classes: `neon-cyan`, `neon-green`, `neon-purple`, `neon-pink`, `dark-bg`, `dark-panel`, `dark-card`
- **Fonts**: `font-orbitron` (headings), `font-rajdhani` (UI text/nav), `font-mono` (code/data)
- **Components**: Always wrap content cards in `<HoloCard>` with a `glowColor` prop. Use `<NeonButton>` for actions.
- **Animations**: Available: `animate-pulse-glow`, `animate-float`, `animate-scan`, `animate-data-stream`, `animate-glitch`, `animate-shimmer`
- **Shadows**: `shadow-neon-cyan`, `shadow-neon-green`, `shadow-neon-purple`, `shadow-holo-panel`

### Type System
- All types are in `src/types/index.ts`
- Key types: `Grant`, `SchoolProfile`, `AIAgent`, `Proposal`, `Notification`, `DashboardStats`, `DeadlineAlert`
- Grant categories: `STEM`, `AI_EDUCATION`, `ROBOTICS`, `EDUCATION_INNOVATION`, `INCLUSIVE_EDUCATION`, `AGRICULTURE`, `SUSTAINABILITY`, `ENTREPRENEURSHIP`, `INFRASTRUCTURE`, `YOUTH_DEVELOPMENT`, `TECHNOLOGY`, `GENERAL`
- Grant statuses: `NEW` → `REVIEWING` → `APPLYING` → `SUBMITTED` → `FUNDED` / `REJECTED`

### Import Conventions
- Use `@/` path alias for all imports (resolves to `src/`)
- Example: `import { Button } from '@/components/ui/button'`
- Example: `import type { Grant } from '@/types'`
- Use `import type` for type-only imports

## Common Workflows

### Adding a New View/Page
1. Create a new section component in `src/sections/NewSection.tsx`
2. Add the view name to the `ViewType` union in `App.tsx` AND `Sidebar.tsx`
3. Add a navigation entry in `Sidebar.tsx`'s `navItems` array
4. Add a `case` in `App.tsx`'s `renderContent()` switch statement
5. If new state is needed, add a store hook in `useStore.ts` and initialize in `App.tsx`

### Adding a New Grant
1. Add grant data to the `mockGrants` array in `src/data/mockData.ts`
2. Follow the `Grant` interface from `src/types/index.ts`
3. Include `applicationReadiness` with score, strengths, and recommendations

### Creating a Custom Component
1. Place in `src/components/` (not in `ui/` — that's for shadcn)
2. Use the `cn()` helper from `@/lib/utils` for conditional classnames
3. Follow the neon color scheme and dark background convention
4. Export both as named export and default export

### Running the Project
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Known Limitations
- **No backend** — all data is mock; AI agent "runs" are simulated with setTimeout
- **No URL routing** — view state is lost on refresh
- **No persistence** — all changes reset on reload
- **No authentication** — logout button is non-functional
- **Settings page** — placeholder only, not implemented
- **State sharing** — hooks use `useState`, not Context/Zustand, so state is not shared across independent consumers
