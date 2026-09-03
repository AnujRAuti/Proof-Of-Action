# Proof-of-Action (EIIL)

## Evidence Integrity & Intelligence Layer — Smart India Hackathon (SIH) 2026

Proof-of-Action is a government-grade digital public infrastructure (DPI) platform that audits field evidence (photos, timestamps, GPS geofences, EXIF metadata, duplicate perceptual hashing) for public infrastructure schemes (PMGSY, Jal Jeevan Mission, Samagra Shiksha, PM-KUSUM).

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.18+ or Node 20+
- npm

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize & Seed Database
```bash
# Push database schema to SQLite
npx prisma db push

# Seed demo users, 6 infrastructure projects, and sample evidence
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

See [`credentials.md`](./credentials.md) for full details.

| Portal | Email / Identifier | Password | Role |
| :--- | :--- | :--- | :--- |
| **Reviewer Portal** | `reviewer.demo@example.com` | `Reviewer@2026!` | `REVIEWER` |
| **Supervisor Portal** | `supervisor.demo@example.com` | `Supervisor@2026!` | `SUPERVISOR` |
| **Citizen Portal** | `citizen.demo@example.com` | `Citizen@2026!` | `CITIZEN` |

---

## 🧪 Testing & Verification

Run the automated authentication test suite:
```bash
node scripts/test-auth.js
```

Run full Next.js production build:
```bash
npm run build
```

---

## 🏗️ Architecture & Features

- **Database**: Prisma ORM with SQLite local persistence (`dev.db`) and relational schema (Users, Projects, Activities, Claims, Evidence, Analyses, Anomalies, DuplicateMatches, ReviewDecisions, AuditEvents, Complaints).
- **Authentication**: Direct database authentication + NextAuth.js JWT session management with bcrypt password encryption.
- **Role-Based Access Control**: Edge middleware guarding `/reviewer/*`, `/supervisor/*`, and `/citizen/*` portals.
- **Verification Engines**:
  - **Geo Engine**: Haversine distance & geofence validation
  - **Temporal Engine**: Milestone sequence & timeline validation
  - **Duplicate Engine**: SHA-256 exact match & pHash perceptual similarity
  - **Metadata Engine**: EXIF completeness & manipulation detection
  - **Fusion Engine**: 7-signal weighted integrity scoring (0–100) & risk classification
  - **Explainability**: Natural-language anomaly reasoning & recommended auditor actions
