# Proof-of-Action

## Evidence Integrity & Intelligence Layer

Proof-of-Action is a government-grade digital public infrastructure (DPI) interface for reviewing the integrity of public-works evidence. It brings geospatial, temporal, visual, metadata, and cross-project consistency signals into a single reviewer workflow.

This repository currently contains a frontend prototype powered by a local mock dataset. It is intended for demonstrating the review experience, audit workflows, and evidence intelligence UI.

## Features

- Reviewer operations dashboard with integrity and risk summaries
- Evidence review queue with approve, reject, and flag workflows
- Evidence detail pages with anomaly signals, metadata, hashes, and similar matches
- Evidence ingestion sandbox for simulating submission processing
- Project, map, analytics, audit, comparison, and evidence views
- Theme switching with light, dark, and system modes
- English and Urdu language support, including RTL layout handling
- Command palette, keyboard shortcuts, toast notifications, and responsive navigation

## Tech Stack

- Next.js 15 with the App Router
- React 19 and TypeScript
- Tailwind CSS
- Lucide React icons
- PostCSS and Autoprefixer
- Local mock data and React context state

## Getting Started

### Prerequisites

- Node.js 18.18 or newer
- npm

### Installation

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

### Production build

```bash
npm run build
npm run start
```

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run the configured lint command |

## Application Routes

| Route | Description |
| --- | --- |
| `/` | Reviewer operations dashboard |
| `/queue` | Evidence review queue |
| `/evidence/[id]` | Evidence detail and audit view |
| `/ingest` | Evidence ingestion sandbox |
| `/projects/[id]` | Project detail view |
| `/projects` | Project listing |
| `/map` | Geospatial evidence view |
| `/analytics` | Audit analytics |
| `/audit` | Audit activity and decisions |
| `/compare` | Evidence comparison |
| `/field` | Field operations view |
| `/about` | Product information |
| `/settings` | Application settings |
| `/login` | Login screen |

## Project Structure

```text
src/
├── app/                    # App Router pages and global styles
├── components/
│   ├── layout/             # Header and sidebar navigation
│   └── ui/                 # Shared interface components and overlays
└── lib/
    ├── data/               # Mock evidence and project data
    ├── i18n/               # Translation context and language definitions
    ├── store/              # Application state and reviewer actions
    └── theme/              # Theme context and persistence
```

The `@/*` import alias maps to `src/*` and is configured in `tsconfig.json`.

## Data and Scope

The prototype uses the typed mock records in `src/lib/data/mock-dataset.ts`. Reviewer actions are held in client-side context and are not persisted to a database or sent to an external API. Image URLs, evidence records, audit metrics, and anomaly results should be treated as demonstration data.

A production implementation would need authenticated access, durable storage, upload and processing services, geospatial and visual analysis pipelines, audit logging, and role-based permissions.

## Development Notes

Pages are implemented with the Next.js App Router. Shared providers and global overlays are mounted in `src/app/layout.tsx`. Styling is defined in `src/app/globals.css` and Tailwind configuration files at the repository root.
