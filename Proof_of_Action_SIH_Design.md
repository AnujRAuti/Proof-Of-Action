# 🇮🇳 Proof-of-Action — Evidence Integrity & Intelligence Layer (EIIL)

<p align="center">
  <img alt="Smart India Hackathon" src="https://img.shields.io/badge/Smart%20India%20Hackathon-2026-FF9933?style=for-the-badge&labelColor=138808">
  <img alt="Status" src="https://img.shields.io/badge/Status-Prototype%20Design-white?style=for-the-badge&labelColor=000080&color=FFFFFF">
  <img alt="Category" src="https://img.shields.io/badge/Category-Software-138808?style=for-the-badge&labelColor=FF9933">
</p>

<p align="center">
  <img alt="Theme" src="https://img.shields.io/badge/Theme-Governance%20%26%20Public%20Service%20Delivery-blue?style=flat-square">
  <img alt="PS" src="https://img.shields.io/badge/Problem%20Statement%20ID-%3CTBD%3E-lightgrey?style=flat-square">
  <img alt="Team" src="https://img.shields.io/badge/Team%20Name-%3CTBD%3E-lightgrey?style=flat-square">
</p>

---

<p align="center"><b>Smart India Hackathon 2026 — Detailed Product &amp; Technical Design Document</b></p>

> ### Core Pitch
> **We don't collect more evidence; we make existing evidence trustworthy.**

<table align="center">
<tr><th>Field</th><th>Detail</th></tr>
<tr><td><b>Problem Statement ID</b></td><td>&lt;to be filled by team&gt;</td></tr>
<tr><td><b>Problem Statement Title</b></td><td>&lt;to be filled by team&gt;</td></tr>
<tr><td><b>Theme</b></td><td>Governance / MeitY / Rural Development &nbsp;(select applicable ministry track)</td></tr>
<tr><td><b>Team Name</b></td><td>&lt;to be filled by team&gt;</td></tr>
<tr><td><b>Team Leader</b></td><td>&lt;to be filled by team&gt;</td></tr>
<tr><td><b>Institution</b></td><td>&lt;to be filled by team&gt;</td></tr>
<tr><td><b>Document Version</b></td><td>v1.0</td></tr>
<tr><td><b>Product Codename</b></td><td>Proof-of-Action (PoA) / Evidence Integrity &amp; Intelligence Layer (EIIL)</td></tr>
</table>

---

## Document Purpose

This document is the **single source of truth** for the Proof-of-Action / Evidence Integrity & Intelligence Layer (EIIL) submission. It captures the product thinking, system architecture, data model, AI pipeline, UX, APIs, security posture, six-week build plan and anticipated judge questions in one place — detailed enough for an engineering team to start building directly from it, and structured enough for a judging panel to evaluate it end-to-end.

**How to use this document**
- Read **Parts I–II** for the pitch, problem framing and system architecture (good for a 5-minute judge briefing).
- Read **Parts III–VIII** for the complete evidence-analysis and scoring pipeline (the technical core).
- Read **Parts IX–XI** for the human review workflow, APIs and data model.
- Read **Parts XII–XV** for AI architecture, security, privacy and analytics.
- Read **Parts XVI–XVIII** for the SIH-specific MVP scope, demo script, anticipated judge Q&A, tech stack, build plan and honest risk assessment.

---

## Table of Contents

**Part I — Problem, Vision & Users**

- **1.** [Executive Summary](#1-executive-summary)
- **2.** [Problem Definition](#2-problem-definition)
- **3.** [What This Product Is Not](#3-what-this-product-is-not)
- **4.** [Product Vision](#4-product-vision)
- **5.** [Target Users](#5-target-users)
- **6.** [Core Domain Objects](#6-core-domain-objects)

**Part II — Architecture & Evidence Lifecycle**

- **7.** [High-Level Architecture](#7-high-level-architecture)
- **8.** [Evidence Lifecycle](#8-evidence-lifecycle)
- **9.** [Evidence Ingestion](#9-evidence-ingestion)

**Part III — Ingestion, Metadata & Cryptographic Integrity**

- **10.** [Upload Validation](#10-upload-validation)
- **11.** [Cryptographic Fingerprinting](#11-cryptographic-fingerprinting)
- **12.** [Metadata Extraction](#12-metadata-extraction)
- **13.** [Metadata Anomaly Detection](#13-metadata-anomaly-detection)

**Part IV — Location & Time Verification**

- **14.** [GPS Verification](#14-gps-verification)
- **15.** [GPS Confidence](#15-gps-confidence)
- **16.** [Impossible Travel Detection](#16-impossible-travel-detection)

**Part V — Duplicate & Similarity Detection**

- **17.** [Exact Duplicate Detection](#17-exact-duplicate-detection)
- **18.** [Perceptual Duplicate Detection](#18-perceptual-duplicate-detection)
- **19.** [Semantic Image Similarity](#19-semantic-image-similarity)
- **20.** [Cross-Project Evidence Search](#20-cross-project-evidence-search)

**Part VI — Visual & Manipulation Analysis**

- **21.** [Image Manipulation Analysis](#21-image-manipulation-analysis)
- **22.** [Image Quality Analysis](#22-image-quality-analysis)
- **23.** [Evidence Relevance](#23-evidence-relevance)
- **24.** [Object Detection](#24-object-detection)
- **25.** [Before/After Comparison](#25-beforeafter-comparison)
- **26.** [Region-Based Change Detection](#26-region-based-change-detection)
- **27.** [Multi-Image Consistency](#27-multi-image-consistency)

**Part VII — Completeness & Claim Matching**

- **28.** [Temporal Consistency](#28-temporal-consistency)
- **29.** [Evidence Completeness](#29-evidence-completeness)
- **30.** [Claim-to-Evidence Matching](#30-claim-to-evidence-matching)
- **31.** [Quantity Verification](#31-quantity-verification)

**Part VIII — Evidence Graph & Scoring Engine**

- **32.** [Evidence Graph](#32-evidence-graph)
- **33.** [Evidence Relationship Types](#33-evidence-relationship-types)
- **34.** [Evidence Fusion](#34-evidence-fusion)
- **35.** [Integrity Score](#35-integrity-score)
- **36.** [Risk Score](#36-risk-score)
- **37.** [Risk Levels](#37-risk-levels)
- **38.** [Explainability](#38-explainability)

**Part IX — Human-in-the-Loop & Reviewer Experience**

- **39.** [Human-in-the-Loop](#39-human-in-the-loop)
- **40.** [Reviewer Dashboard](#40-reviewer-dashboard)
- **41.** [Evidence Viewer](#41-evidence-viewer)
- **42.** [Before/After Viewer](#42-beforeafter-viewer)
- **43.** [Map View](#43-map-view)
- **44.** [Similar Evidence Viewer](#44-similar-evidence-viewer)
- **45.** [Reviewer Actions](#45-reviewer-actions)
- **46.** [Reviewer Override](#46-reviewer-override)
- **47.** [Review Queue](#47-review-queue)
- **48.** [Field Verification](#48-field-verification)
- **49.** [Trusted Capture](#49-trusted-capture)
- **50.** [Evidence Requirements Engine](#50-evidence-requirements-engine)

**Part X — API, Integration & Access Control**

- **51.** [Domain Templates](#51-domain-templates)
- **52.** [API](#52-api)
- **53.** [Webhooks](#53-webhooks)
- **54.** [Integration Model](#54-integration-model)
- **55.** [Authentication](#55-authentication)
- **56.** [Roles](#56-roles)
- **57.** [Authorization](#57-authorization)
- **58.** [Audit Log](#58-audit-log)

**Part XI — Data Model & Reproducibility**

- **59.** [Database Entities](#59-database-entities)
- **60.** [Evidence Schema](#60-evidence-schema)
- **61.** [Analysis Schema](#61-analysis-schema)
- **62.** [Anomaly Schema](#62-anomaly-schema)
- **63.** [Model Versioning](#63-model-versioning)
- **64.** [Reproducibility](#64-reproducibility)

**Part XII — AI / ML Architecture**

- **65.** [AI Architecture](#65-ai-architecture)
- **66.** [Vision Tasks](#66-vision-tasks)
- **67.** [Embedding Search](#67-embedding-search)
- **68.** [Video Analysis](#68-video-analysis)
- **69.** [Claim Parsing](#69-claim-parsing)
- **70.** [LLM Role](#70-llm-role)

**Part XIII — Anomaly Detection Rigor**

- **71.** [Anomaly Taxonomy](#71-anomaly-taxonomy)
- **72.** [Confidence](#72-confidence)
- **73.** [Thresholds](#73-thresholds)
- **74.** [False Positives](#74-false-positives)
- **75.** [False Negatives](#75-false-negatives)

**Part XIV — Security, Privacy & Infrastructure**

- **76.** [Security](#76-security)
- **77.** [Privacy](#77-privacy)
- **78.** [Storage](#78-storage)
- **79.** [Processing Queue](#79-processing-queue)
- **80.** [Scalability](#80-scalability)
- **81.** [Failure Handling](#81-failure-handling)
- **82.** [Cost Optimization](#82-cost-optimization)
- **83.** [Caching](#83-caching)

**Part XV — Provenance, Analytics & Reporting**

- **84.** [Evidence Graph Analytics](#84-evidence-graph-analytics)
- **85.** [Trusted Evidence Provenance](#85-trusted-evidence-provenance)
- **86.** [Evidence Integrity Certificate](#86-evidence-integrity-certificate)
- **87.** [Project-Level Analytics](#87-project-level-analytics)
- **88.** [Geographic Analytics](#88-geographic-analytics)
- **89.** [Project Evidence Health](#89-project-evidence-health)

**Part XVI — SIH MVP, Demo & Judge Readiness**

- **90.** [SIH MVP](#90-sih-mvp)
- **91.** [SIH Demo Dataset](#91-sih-demo-dataset)
- **92.** [Killer SIH Demo](#92-killer-sih-demo)
- **93.** [Best SIH Story](#93-best-sih-story)
- **94.** [Judge Question: "Isn't This Already Available?"](#94-judge-question-isnt-this-already-available)
- **95.** [Judge Question: "Can AI Prove the Work Happened?"](#95-judge-question-can-ai-prove-the-work-happened)
- **96.** [Judge Question: "What's New?"](#96-judge-question-whats-new)
- **97.** [Judge Question: "Why Not Perceptual Hashing?"](#97-judge-question-why-not-perceptual-hashing)
- **98.** [Judge Question: "Why Use AI?"](#98-judge-question-why-use-ai)
- **99.** [Judge Question: "What If AI Is Wrong?"](#99-judge-question-what-if-ai-is-wrong)
- **100.** [Judge Question: "How Does It Scale?"](#100-judge-question-how-does-it-scale)

**Part XVII — Technical Stack & Delivery Plan**

- **101.** [Technical Differentiator](#101-technical-differentiator)
- **102.** [Recommended MVP Stack](#102-recommended-mvp-stack)
- **103.** [Suggested Repository](#103-suggested-repository)
- **104.** [Six-Week Build Plan](#104-six-week-build-plan)
- **105.** [Team Roles](#105-team-roles)

**Part XVIII — Risks, KPIs & Positioning**

- **106.** [Main Risks](#106-main-risks)
- **107.** [Things We Must Never Promise](#107-things-we-must-never-promise)
- **108.** [Product KPIs](#108-product-kpis)
- **109.** [Success Definition](#109-success-definition)
- **110.** [Future Extensions](#110-future-extensions)
- **111.** [Final SIH Positioning](#111-final-sih-positioning)
- **112.** [Final Assessment](#112-final-assessment)
- **113.** [Final Recommendation](#113-final-recommendation)

---

## 1. Executive Summary

Proof-of-Action (PoA), technically called the **Evidence Integrity & Intelligence Layer (EIIL)**, is an API-first platform that audits evidence already generated by field-monitoring systems.

It analyzes:

- photographs
- videos
- GPS coordinates
- timestamps
- project/activity claims
- before/during/after evidence
- documents
- measurements
- optional sensor/API data

The system evaluates whether evidence is:

- spatially consistent
- temporally consistent
- visually consistent
- complete
- relevant to the claim
- duplicated/recycled
- potentially manipulated
- inconsistent with other evidence
- suspicious when compared across projects

It produces an **Evidence Integrity Score**, **Risk Score**, anomaly explanations, and a recommended human-review action.

### Critical positioning

This is **not** an app that claims to prove that physical work happened.

It is an **evidence auditing and investigation-prioritization layer**.

---

## 2. Problem Definition

Existing field-monitoring workflows can collect:

- geo-tagged photos
- time-stamped photos
- before/during/after images
- documents
- inspection records
- project metadata

However, at large scale, manually checking all evidence for consistency is expensive and slow.

Potential problems include:

1. Recycled photographs
2. Duplicate evidence
3. Wrong-location evidence
4. Timestamp inconsistencies
5. Evidence outside the project timeline
6. Image manipulation
7. Irrelevant photographs
8. Weak before/after evidence
9. Claim/evidence mismatch
10. Missing required evidence
11. Suspicious relationships across projects
12. Repeated evidence patterns that humans may not notice

The product therefore asks:

> **Does the submitted evidence consistently support the claim being made?**

---

## 3. What This Product Is Not

Do **not** position it as:

- another GPS photo app
- another project-management dashboard
- another government monitoring app
- an automated fraud judge
- a replacement for field officers
- a perfect AI-generated-image detector
- a system that can prove every physical measurement from a photograph

The system must explicitly acknowledge uncertainty.

---

## 4. Product Vision

The long-term vision is a **trust layer for real-world claims**.

Input:

```text
CLAIM
+
EVIDENCE
```

Output:

```text
PROVENANCE
+
CONSISTENCY
+
CORROBORATION
+
ANOMALIES
+
RISK
+
REVIEW RECOMMENDATION
```

---

## 5. Target Users

### 5.1 Program Administrator

Needs to:

- monitor thousands/millions of submissions
- identify high-risk cases
- prioritize inspections
- review project health
- generate reports

### 5.2 Field Officer

Needs to:

- inspect flagged cases
- capture fresh evidence
- approve/reject evidence
- add observations
- override AI findings with reasons

### 5.3 Auditor

Needs to:

- investigate evidence history
- compare projects
- identify duplicate evidence
- trace evidence relationships
- export audit reports

### 5.4 Implementer / Contractor

Needs to:

- submit evidence
- understand evidence requirements
- correct incomplete evidence
- respond to review requests

---

## 6. Core Domain Objects

### Project

Represents a real-world initiative.

```text
Project
├── ID
├── Name
├── Organization
├── Location
├── Start date
├── End date
└── Activities
```

### Activity

A specific operation within a project.

```text
Project
├── Site preparation
├── Construction
├── Installation
└── Completion
```

### Claim

A statement about what happened.

Example:

> "100 metres of road were resurfaced between 12 and 15 August."

Store claims in structured form whenever possible.

### Evidence

Any artifact supporting a claim.

Types:

- image
- video
- document
- GPS record
- timestamp
- measurement
- sensor record
- inspection record

### Evidence Bundle

All evidence associated with one activity/claim.

```text
Evidence Bundle
├── Before.jpg
├── During.jpg
├── After.jpg
├── GPS
├── timestamps
└── completion document
```

### Evidence Event

Immutable record of an important event.

Examples:

- uploaded
- analyzed
- flagged
- reviewed
- approved
- rejected
- overridden
- exported

---

## 7. High-Level Architecture

```text
Existing Systems
      |
      +---- API
      +---- Mobile App
      +---- File Upload
      |
      v
Evidence Ingestion
      |
      v
Validation
      |
      v
Normalization
      |
      v
Evidence Processing
      |
 +----+----+----+----+----+
 |    |    |    |    |    |
Vision Geo Time Duplicate Metadata
 |    |    |    |    |    |
 +----+----+----+----+----+
             |
             v
      Evidence Fusion
             |
             v
    Integrity / Risk Score
             |
       +-----+-----+
       |           |
       v           v
    Normal      Suspicious
       |           |
       v           v
   Continue    Human Review
                   |
                   v
             Field Verification
```

---

## 8. Evidence Lifecycle

```text
CAPTURE
  ↓
UPLOAD
  ↓
INGEST
  ↓
VALIDATE
  ↓
HASH
  ↓
EXTRACT METADATA
  ↓
ANALYZE
  ↓
CORRELATE
  ↓
SCORE
  ↓
REVIEW
  ↓
DECISION
  ↓
AUDIT
  ↓
ARCHIVE
```

---

## 9. Evidence Ingestion

Supported inputs:

### Images

- JPEG
- PNG
- HEIC
- WebP

### Video

- MP4
- MOV
- WebM

### Documents

- PDF
- scanned images

### Structured Data

- JSON
- CSV
- XML

### External Sources

- REST APIs
- authorized government systems
- enterprise systems

---

## 10. Upload Validation

Check:

- supported format
- MIME type
- maximum size
- corruption
- malware
- invalid encoding
- project ID
- required metadata
- duplicate upload

An invalid file should never enter AI processing.

---

## 11. Cryptographic Fingerprinting

Generate SHA-256 for every received file.

```text
Evidence
   ↓
SHA-256
   ↓
Immutable file identity
```

Important distinction:

> A hash proves that the received file did not change after ingestion. It does **not** prove that the original image was genuine.

---

## 12. Metadata Extraction

Extract where available:

- EXIF
- GPS latitude
- GPS longitude
- altitude
- capture time
- timezone
- camera manufacturer
- camera model
- orientation
- software tag
- dimensions
- compression information

Metadata is treated as evidence, not absolute truth.

---

## 13. Metadata Anomaly Detection

Potential flags:

- missing GPS
- impossible GPS
- future timestamp
- timestamp before project creation
- timestamp after activity completion
- inconsistent timezone
- suspicious software metadata
- editing indicators
- mismatch with other evidence

Output:

```text
Metadata Integrity: 81/100
```

---

## 14. GPS Verification

Each project can define a geofence.

```text
Project:
18.5204, 73.8567

Allowed radius:
100 metres
```

Uploaded evidence:

```text
18.5210, 73.8571
```

Calculate distance using the Haversine formula.

Output:

```text
Distance: 82m
GPS status: CONSISTENT
```

---

## 15. GPS Confidence

Consider:

- reported GPS accuracy
- distance from registered site
- consistency between multiple images
- device source
- movement pattern

Do not treat GPS alone as proof.

---

## 16. Impossible Travel Detection

Example:

```text
10:01
Location A

10:04
Location B

Distance:
48 km
```

If physically implausible:

```text
TEMPORAL-SPATIAL ANOMALY
Severity: HIGH
```

This is an investigation signal, not automatic fraud classification.

---

## 17. Exact Duplicate Detection

Use SHA-256.

If two files have identical hashes:

```text
EXACT DUPLICATE
```

---

## 18. Perceptual Duplicate Detection

Use perceptual hashing to detect:

- resized images
- compressed images
- slightly modified images
- minor crops

Example:

```text
Similarity:
96.2%

Duplicate Risk:
HIGH
```

---

## 19. Semantic Image Similarity

Generate image embeddings.

Store embeddings in:

- PostgreSQL + pgvector
- Qdrant
- Milvus
- another vector database

For the MVP:

> PostgreSQL + pgvector is sufficient.

---

## 20. Cross-Project Evidence Search

This is a major differentiator.

Do not only search:

```text
New evidence
     ↓
Same project
```

Search:

```text
New evidence
     ↓
Authorized historical evidence
     ↓
All relevant projects
```

Example:

```text
New image
94.7% similar
      ↓
Project PRJ-1832
      ↓
Location 31.8 km away
```

Output:

> **Cross-project evidence anomaly**

---

## 21. Image Manipulation Analysis

Potential checks:

- cloned regions
- inconsistent compression
- suspicious editing boundaries
- metadata contradictions
- re-encoding patterns
- AI-generated-image indicators where reliable

Output:

```text
Manipulation Risk: 63/100
```

Never output:

> "This image is definitely fake."

---

## 22. Image Quality Analysis

Detect:

- blur
- darkness
- overexposure
- obstruction
- insufficient resolution
- extreme angle
- irrelevant framing

Example:

```text
Image Quality: 42/100

Action:
Retake image.
```

---

## 23. Evidence Relevance

Compare the image with the claimed activity.

Claim:

> "Water tank installation."

Image:

> close-up of a person

Output:

```text
Evidence Relevance:
LOW
```

---

## 24. Object Detection

Claims can define expected objects.

Example:

```text
Claim:
Solar street lights installed

Expected:
- poles
- lights
- relevant installation
```

Vision model detects:

```text
Pole: YES
Light: YES
Installation context: YES
```

---

## 25. Before/After Comparison

Analyze:

- common scene
- relevant regions
- objects
- structural changes
- textures
- damage state
- construction stage

Example:

```text
BEFORE
Broken window

AFTER
Window appears repaired

Change confidence:
88%
```

---

## 26. Region-Based Change Detection

Compare relevant areas instead of only entire images.

```text
Image
├── Relevant region
├── Background
├── People
└── Vehicles
```

Ignore irrelevant changes such as:

- weather
- people
- vehicles
- lighting

where possible.

---

## 27. Multi-Image Consistency

Compare:

```text
Before
During
After
```

Check:

- same location
- same structure
- plausible progression
- consistent scene
- expected changes

---

## 28. Temporal Consistency

Build:

```text
Project Created
      ↓
Activity Started
      ↓
Before
      ↓
During
      ↓
After
      ↓
Completion
```

Check:

- chronological ordering
- evidence outside activity window
- duplicate timestamps
- impossible sequences
- missing stages

---

## 29. Evidence Completeness

Each activity has an evidence schema.

Example:

```text
Required:

✓ Before photo
✓ During photo
✓ After photo
✓ GPS
✓ Completion document
```

If completion document is missing:

```text
Completeness:
80%

Missing:
Completion document
```

---

## 30. Claim-to-Evidence Matching

Claim:

> "Install 10 solar street lights."

Expected:

- relevant location
- street lights
- approximately 10 instances
- completion evidence

System compares claim requirements with evidence.

---

## 31. Quantity Verification

Possible signals:

- object counting
- uploaded measurements
- multiple viewpoints
- structured documents
- sensors
- field verification

Classification:

```text
VERIFIED
PARTIALLY_SUPPORTED
UNSUPPORTED
REQUIRES_FIELD_VERIFICATION
```

Do not claim exact measurement from arbitrary photos when the image cannot support it.

---

## 32. Evidence Graph

Every artifact becomes a graph node.

```text
                    PROJECT
                       |
                    ACTIVITY
                       |
          +------------+------------+
          |            |            |
        CLAIM        PHOTO       DOCUMENT
                       |
                +------+------+
                |      |      |
               GPS    TIME   VISION
                |      |      |
                +------+------+
                       |
                Similar Evidence
                       |
                  Other Project
```

---

## 33. Evidence Relationship Types

```text
BELONGS_TO
SUPPORTS
CONTRADICTS
SIMILAR_TO
DUPLICATE_OF
CAPTURED_AT
CAPTURED_BEFORE
CAPTURED_AFTER
DERIVED_FROM
REQUIRES
CORROBORATES
```

---

## 34. Evidence Fusion

No single detector makes the final decision.

Possible inputs:

```text
GPS consistency       94
Temporal consistency  91
Duplicate risk         2
Visual consistency    88
Metadata integrity    83
Claim consistency     86
Completeness         100
```

The fusion engine generates overall scores.

---

## 35. Integrity Score

Example:

```text
Evidence Integrity:
89/100
```

Potential configurable weights:

```text
GPS                15%
Temporal            10%
Duplicate           20%
Authenticity        15%
Visual              20%
Claim consistency   15%
Completeness         5%
```

Weights must be validated per domain.

---

## 36. Risk Score

Keep this separate from integrity.

### Integrity

How internally consistent is the evidence?

### Risk

How much attention should it receive?

Example:

```text
Integrity: 76/100
Risk: HIGH
```

Low evidence quality is not automatically fraud.

---

## 37. Risk Levels

```text
LOW
MEDIUM
HIGH
CRITICAL
```

### LOW

No significant anomaly.

### MEDIUM

Minor inconsistency.

### HIGH

Multiple or important anomalies.

### CRITICAL

Strong anomaly requiring urgent human investigation.

---

## 38. Explainability

Every flag must answer:

> Why?

Example:

```text
FLAGGED FOR REVIEW

1. 93% visual similarity with previous evidence.
2. GPS differs from registered site by 420m.
3. Timestamp conflicts with activity timeline.
4. Completion claim is weakly supported.

Recommended action:
Manual verification.
```

---

## 39. Human-in-the-Loop

```text
Evidence
   ↓
AI analysis
   ↓
Risk score
   ↓
+-------------------+
|                   |
LOW               HIGH
|                   |
Continue          Human review
                    |
                    v
              Field inspection
```

AI does not make irreversible decisions.

---

## 40. Reviewer Dashboard

### Project Summary

Show:

- project ID
- name
- location
- status
- evidence count
- integrity score
- risk score

### Evidence Timeline

```text
12 Aug
Before

13 Aug
During

15 Aug
After
```

### Anomaly Panel

```text
2 HIGH
3 MEDIUM
7 LOW
```

---

## 41. Evidence Viewer

Display:

```text
+------------------------------------+
|              IMAGE                 |
+------------------------------------+

GPS:
18.5204, 73.8567

Captured:
15 Aug 2026 14:31

Integrity:
91/100

Duplicate Risk:
LOW

Visual Change:
HIGH

[Metadata]
[Similar Evidence]
[Map]
[Timeline]
[Review]
```

---

## 42. Before/After Viewer

Features:

- side-by-side view
- slider
- zoom
- pan
- difference overlay
- changed-region highlights
- detected objects

---

## 43. Map View

Show:

- project location
- evidence locations
- geofence
- suspicious points
- historical evidence locations
- movement path where appropriate

---

## 44. Similar Evidence Viewer

Example:

```text
1. IMG-44109
   Similarity: 94.7%
   Project: PRJ-1832
   Distance: 31.8km

2. IMG-51221
   Similarity: 89.3%
   Project: PRJ-1921
```

Reviewer can inspect both images.

---

## 45. Reviewer Actions

- approve
- reject
- request resubmission
- request field inspection
- flag
- escalate
- add note
- attach evidence
- override AI

Every action is audited.

---

## 46. Reviewer Override

Example:

```text
AI:
HIGH RISK

Reviewer:
ACCEPT

Reason:
Known project boundary changed.
GPS discrepancy is legitimate.
```

Override requires a reason.

---

## 47. Review Queue

Sort by:

- risk
- anomaly severity
- project value
- deadline
- geography
- reviewer workload

---

## 48. Field Verification

```text
AI flag
 ↓
Assign officer
 ↓
Navigate to site
 ↓
Capture fresh evidence
 ↓
Compare
 ↓
Officer decision
 ↓
Close case
```

---

## 49. Trusted Capture

Future mobile app can:

- capture directly
- record GPS
- record time
- create hash
- bind evidence to project
- support offline capture
- synchronize later

Evidence origin should be marked:

```text
TRUSTED CAPTURE
```

or

```text
IMPORTED EVIDENCE
```

---

## 50. Evidence Requirements Engine

Each domain defines requirements.

Example:

```json
{
  "activity": "road_repair",
  "required_evidence": [
    "before_image",
    "during_image",
    "after_image",
    "gps",
    "completion_document"
  ]
}
```

This makes the engine reusable.

---

## 51. Domain Templates

Possible templates:

- road repair
- public building repair
- water infrastructure
- sanitation
- solar installation
- plantation
- agricultural infrastructure
- school infrastructure
- community assets

---

## 52. API

Core endpoints:

```http
POST /api/projects
GET  /api/projects/{id}

POST /api/evidence
GET  /api/evidence/{id}

POST /api/evidence/{id}/analyze
GET  /api/evidence/{id}/analysis

POST /api/evidence/search-similar

POST /api/reviews
GET  /api/reviews/queue

POST /api/field-inspections
GET  /api/audit/events
```

---

## 53. Webhooks

External systems can subscribe to:

```text
evidence.uploaded
evidence.analysis.completed
evidence.flagged
evidence.reviewed
project.completed
field.inspection.completed
```

---

## 54. Integration Model

The platform should sit beside existing systems.

```text
Existing Monitoring System
          |
         API
          |
          v
Proof-of-Action
          |
   Evidence analysis
          |
          v
Result API
          |
          v
Existing Dashboard
```

No forced replacement.

---

## 55. Authentication

Support:

- OAuth2
- OpenID Connect
- SSO
- JWT
- API keys

---

## 56. Roles

```text
SUPER_ADMIN
PROGRAM_ADMIN
PROJECT_MANAGER
FIELD_OFFICER
REVIEWER
AUDITOR
SUBMITTER
READ_ONLY
API_CLIENT
```

---

## 57. Authorization

Users only access authorized:

- programs
- regions
- projects
- evidence
- reports

Cross-project similarity search must respect access permissions.

---

## 58. Audit Log

Record:

```text
Who
What
When
Previous state
New state
Reason
```

Example:

```text
User:
USR-1028

Action:
Risk override

Old:
HIGH

New:
LOW

Reason:
Physical inspection confirmed work.

Time:
2026-08-15 16:42
```

---

## 59. Database Entities

```text
User
Organization
Program
Project
Activity
Claim
Evidence
EvidenceMetadata
EvidenceAnalysis
EvidenceRelation
EvidenceScore
Anomaly
Review
ReviewDecision
FieldInspection
AuditEvent
Integration
APIKey
ModelVersion
```

---

## 60. Evidence Schema

```text
id
project_id
activity_id
uploaded_by
file_uri
sha256
mime_type
size
captured_at
latitude
longitude
gps_accuracy
source_type
status
created_at
```

---

## 61. Analysis Schema

```text
id
evidence_id
model_version
quality_score
duplicate_score
manipulation_score
visual_consistency_score
geo_score
temporal_score
claim_score
overall_score
created_at
```

---

## 62. Anomaly Schema

```text
id
project_id
evidence_id
type
severity
confidence
description
status
created_at
resolved_at
resolved_by
```

---

## 63. Model Versioning

Store:

- model name
- version
- weights hash
- configuration
- thresholds
- analysis timestamp

This is essential for reproducibility.

---

## 64. Reproducibility

For every AI decision, preserve:

```text
Input
Metadata
Model
Model version
Configuration
Thresholds
Matches
Rules
Output
```

A reviewer should be able to reconstruct why something was flagged.

---

## 65. AI Architecture

Do not use one giant model.

Use specialized components:

```text
Evidence
   |
+--+-----------+-----------+
|              |           |
Vision        Geo       Metadata
|              |           |
Models        Rules       Rules
|              |           |
+--------------+-----------+
               |
         Fusion Engine
```

---

## 66. Vision Tasks

Possible models for:

- object detection
- segmentation
- image embeddings
- scene classification
- similarity
- change detection

Select models based on benchmark performance.

---

## 67. Embedding Search

Pipeline:

```text
Image
 ↓
Embedding model
 ↓
Vector
 ↓
Vector database
 ↓
Nearest-neighbor search
```

---

## 68. Video Analysis

Do not necessarily process every frame.

```text
Video
 ↓
Key-frame extraction
 ↓
Scene segmentation
 ↓
Object tracking
 ↓
GPS/time correlation
 ↓
Evidence summary
```

---

## 69. Claim Parsing

Example:

Input:

> "Damaged school roof repaired and walls painted."

Structured output:

```text
Objects:
school
roof
walls

Expected changes:
roof damage → repaired
walls → painted

Expected state:
completed
```

An LLM may assist with this conversion, but the resulting schema must be validated.

---

## 70. LLM Role

Good uses:

- claim extraction
- report summarization
- reviewer assistance
- natural-language investigation
- explanation generation

Bad use:

> Ask an LLM whether a photograph is real.

The core verification engine should rely on deterministic and vision-based signals.

---

## 71. Anomaly Taxonomy

```text
DUPLICATE_EVIDENCE
CROSS_PROJECT_DUPLICATE
LOCATION_MISMATCH
TEMPORAL_MISMATCH
METADATA_ANOMALY
IMAGE_MANIPULATION_RISK
CLAIM_MISMATCH
INCOMPLETE_EVIDENCE
VISUAL_INCONSISTENCY
QUANTITY_UNSUPPORTED
SEQUENCE_ANOMALY
LOW_IMAGE_QUALITY
IRRELEVANT_EVIDENCE
```

---

## 72. Confidence

Every finding contains:

```text
Finding
Confidence
Severity
Supporting evidence
```

Example:

```text
Cross-project duplicate
Confidence: 96%
Severity: HIGH
```

---

## 73. Thresholds

Example:

```text
Similarity > 95%
→ Strong duplicate signal

85–95%
→ Manual review

< 85%
→ Normally ignored
```

Thresholds must be calibrated using real/representative data.

---

## 74. False Positives

Similar photographs can be legitimate.

Example:

Two projects may photograph the same government building.

Therefore:

```text
Similarity ≠ Fraud
```

Combine:

- similarity
- location
- time
- claim
- project
- asset identity

---

## 75. False Negatives

Sophisticated manipulation can evade detection.

Therefore:

> "No significant anomaly detected"

is acceptable.

> "Guaranteed genuine"

is not.

---

## 76. Security

Required:

- TLS
- encryption at rest
- RBAC
- API authentication
- audit logs
- signed URLs
- malware scanning
- rate limiting
- secrets management
- backups
- disaster recovery

---

## 77. Privacy

Potential sensitive data:

- faces
- personal documents
- exact locations
- device information

Controls:

- configurable face blurring
- access controls
- retention policies
- data minimization
- restricted exports

---

## 78. Storage

```text
Object Storage
├── raw/
├── processed/
├── thumbnails/
├── reports/
└── temporary/

PostgreSQL
├── metadata
├── projects
├── claims
├── reviews
└── audit logs

Vector Store
└── embeddings
```

---

## 79. Processing Queue

Use asynchronous processing.

```text
Upload
 ↓
Queue
 ↓
Worker
 ↓
Analysis
 ↓
Database
 ↓
Notification
```

MVP:

> Redis + worker.

---

## 80. Scalability

Scale workers independently.

```text
API
 |
Queue
 |
+---- Worker
+---- Worker
+---- Worker
```

Vision workers can scale separately from API servers.

---

## 81. Failure Handling

If AI analysis fails:

```text
Evidence remains stored
 ↓
Retry
 ↓
Repeated failure
 ↓
Manual review
```

Never delete evidence because analysis failed.

---

## 82. Cost Optimization

Use staged processing:

```text
Cheap checks
 ↓
Potential issue?
 ↓
Expensive analysis
```

Example:

1. SHA-256
2. metadata
3. quality
4. cheap similarity
5. advanced vision only when useful

---

## 83. Caching

Cache:

- embeddings
- metadata
- exact-hash results
- analysis
- similarity results

Never repeatedly process identical evidence unnecessarily.

---

## 84. Evidence Graph Analytics

Potential analysis:

- repeated images
- repeated devices
- suspicious project relationships
- geographic clusters
- recurring anomalies
- repeated submitter patterns

These are investigation signals, not automatic guilt.

---

## 85. Trusted Evidence Provenance

Future evidence can contain:

```text
Capture
 ↓
Hash
 ↓
Timestamp
 ↓
GPS
 ↓
Upload
 ↓
Analysis
 ↓
Review
```

This creates a chain of custody.

---

## 86. Evidence Integrity Certificate

Example:

```text
EVIDENCE INTEGRITY REPORT

Evidence:
EVD-829291

SHA-256:
...

Captured:
...

Location:
...

Integrity:
91/100

Anomalies:
None significant

Model:
vision-v1.4

Reviewed:
YES

Reviewer:
USR-1028
```

---

## 87. Project-Level Analytics

Dashboard:

```text
Projects
Evidence items
Reviewed
Flagged
High risk
Duplicates
Location anomalies
Average integrity
Review backlog
```

---

## 88. Geographic Analytics

Display:

- project locations
- anomaly density
- evidence quality
- inspection priority

Example:

```text
Region A:
2% anomaly rate

Region B:
7%

Region C:
19%
```

Do not automatically infer wrongdoing from regional patterns.

---

## 89. Project Evidence Health

Aggregate:

- completeness
- anomaly frequency
- unresolved cases
- timeline consistency
- evidence quality

Example:

```text
Project Evidence Health:
82/100
```

---

## 90. SIH MVP

The SIH prototype should NOT attempt every feature.

Build:

### 1. Project creation

### 2. Evidence upload

### 3. Metadata extraction

### 4. GPS validation

### 5. Exact/perceptual duplicate detection

### 6. Image embeddings

### 7. Before/after comparison

### 8. Evidence scoring

### 9. Explainable anomaly dashboard

### 10. Reviewer workflow

### 11. Audit log

### 12. Report generation

---

## 91. SIH Demo Dataset

Build a labeled dataset containing:

```text
VALID
EXACT_DUPLICATE
CROPPED_DUPLICATE
RESIZED_DUPLICATE
REENCODED_DUPLICATE
WRONG_LOCATION
WRONG_TIME
EDITED_IMAGE
IRRELEVANT_IMAGE
INCONSISTENT_BEFORE_AFTER
VALID_SIMILAR_SCENE
```

A synthetic dataset can be used for demonstration, but clearly label it as such.

---

## 92. Killer SIH Demo

### Test 1 — Genuine

Upload:

```text
Before
During
After
```

Result:

```text
Integrity: 92/100
Risk: LOW
```

### Test 2 — Reused Photograph

Upload a previously used image.

Result:

```text
94.7% similarity
Previous project:
PRJ-1832

HIGH DUPLICATE RISK
```

### Test 3 — Wrong Location

Photo is from another site.

Result:

```text
GPS inconsistency
Distance: 31.8 km
```

### Test 4 — Claim Mismatch

Claim:

> Road repaired.

Evidence:

> unrelated building.

Result:

```text
LOW CLAIM-EVIDENCE CONSISTENCY
```

### Test 5 — Explainability

Click:

> Why flagged?

Display all contributing signals.

---

## 93. Best SIH Story

### Existing approach

```text
Collect evidence
        ↓
Store evidence
        ↓
Human checks evidence
```

### Proof-of-Action

```text
Collect evidence
        ↓
Understand evidence
        ↓
Compare evidence
        ↓
Connect evidence
        ↓
Detect anomalies
        ↓
Score risk
        ↓
Explain
        ↓
Prioritize human verification
```

---

## 94. Judge Question: "Isn't This Already Available?"

Recommended answer:

> Existing government and commercial systems already provide parts of evidence collection, geo-tagging, duplicate detection, image analysis and field inspection. We are not claiming to replace them. Our proposal is an evidence intelligence layer that correlates multiple evidence types and historical submissions to produce explainable anomaly signals and prioritize human investigation.

---

## 95. Judge Question: "Can AI Prove the Work Happened?"

Answer:

> No. A photograph cannot prove every physical claim. Our system deliberately avoids that claim. It measures evidence consistency, detects anomalies and identifies cases requiring additional human or field verification.

---

## 96. Judge Question: "What's New?"

Answer:

> The strongest novelty is treating evidence as a connected graph instead of isolated photographs. We correlate visual similarity, GPS, temporal sequences, claims, provenance and historical evidence to identify relationships and anomalies.

---

## 97. Judge Question: "Why Not Perceptual Hashing?"

Answer:

> Perceptual hashing is useful for near-duplicate detection, but it cannot understand project context, geographic relationships, temporal consistency or claim semantics. We combine it with embeddings, geospatial analysis, temporal rules and claim matching.

---

## 98. Judge Question: "Why Use AI?"

Answer:

> The difficult part is not collecting metadata. It is understanding visual evidence and finding relationships across large evidence collections. Computer vision and embeddings make that scalable, while deterministic rules handle the parts that should not depend on probabilistic AI.

---

## 99. Judge Question: "What If AI Is Wrong?"

Answer:

> AI never makes an irreversible fraud determination. High-impact or low-confidence findings go to human review. Every finding contains supporting signals, confidence and model version, and every reviewer override is audited.

---

## 100. Judge Question: "How Does It Scale?"

Answer:

> Analysis is asynchronous. Evidence enters a processing queue and specialized workers perform independent vision, geospatial, metadata and similarity analysis. Vector search enables historical comparison without manually comparing every image.

---

## 101. Technical Differentiator

The strongest architecture is:

```text
                 CLAIM
                   |
           +-------+-------+
           |       |       |
          GPS    PHOTO    TIME
           |       |       |
           |     VISION    |
           |       |       |
           +-------+-------+
                   |
          HISTORICAL MATCHES
                   |
            OTHER PROJECTS
                   |
             EVIDENCE GRAPH
                   |
             FUSION ENGINE
                   |
             RISK / SCORE
                   |
             HUMAN DECISION
```

The individual detectors are replaceable.

The **evidence graph + fusion engine** is the product core.

---

## 102. Recommended MVP Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI

### Database

- PostgreSQL
- PostGIS
- pgvector

### AI

- PyTorch
- OpenCV
- lightweight object detection
- image embedding model

### Queue

- Redis

### Storage

- S3-compatible object storage

### Auth

- OAuth2 / OIDC

---

## 103. Suggested Repository

```text
proof-of-action/
├── apps/
│   ├── web/
│   └── mobile/
├── services/
│   ├── api/
│   ├── analysis/
│   ├── duplicate/
│   ├── vision/
│   ├── geospatial/
│   └── reporting/
├── packages/
│   ├── schemas/
│   ├── rules/
│   └── sdk/
├── infrastructure/
├── datasets/
├── models/
├── docs/
└── tests/
```

---

## 104. Six-Week Build Plan

### Week 1

- requirements
- schema
- authentication
- project API
- evidence upload
- object storage
- initial UI

### Week 2

- metadata
- hashing
- GPS
- evidence timeline
- basic dashboard

### Week 3

- perceptual hashing
- embeddings
- vector search
- duplicate detection

### Week 4

- before/after
- object detection
- anomaly engine
- scoring

### Week 5

- review workflow
- explanations
- reports
- audit logs

### Week 6

- benchmark dataset
- accuracy testing
- optimization
- live demo
- SIH presentation
- documentation

---

## 105. Team Roles

### AI/CV

- embeddings
- object detection
- change detection
- similarity

### Backend

- API
- database
- queues
- storage
- scoring

### Frontend

- dashboard
- map
- evidence viewer
- review workflow

### Mobile / Systems

- trusted capture
- GPS
- offline sync

### Product / Research

- domain selection
- dataset
- validation
- SIH pitch

A 3–4 person team can build a narrower MVP.

---

## 106. Main Risks

### Existing Competition

Individual features already exist.

#### Response
Focus on:

- cross-project intelligence
- evidence graph
- multi-signal correlation
- integration layer
- explainable investigation

### AI Accuracy

#### Response
AI prioritizes rather than decides.

### Data Availability

#### Response
Build transparent benchmark datasets and synthetic perturbations while seeking real pilot data.

### Government Integration

#### Response
Prototype as an independent API.

### Privacy

#### Response
Privacy-by-design and strict permissions.

---

## 107. Things We Must Never Promise

Never say:

> "100% fraud detection."

Never say:

> "AI proves government work."

Never say:

> "We eliminate field officers."

Never say:

> "Our detector cannot be fooled."

Never say:

> "Every image can be authenticated."

Say:

> **"We detect anomalies and prioritize evidence for human verification."**

---

## 108. Product KPIs

### Primary KPI

**Review Efficiency**

How much manual inspection can be reduced while maintaining acceptable detection quality?

### Secondary KPIs

- duplicate precision
- duplicate recall
- anomaly precision
- false positive rate
- reviewer agreement
- average review time
- processing latency
- evidence completeness
- percentage of evidence with provenance

---

## 109. Success Definition

The product succeeds when:

> **A reviewer can identify important evidence anomalies significantly faster than manual inspection alone, without the platform making unjustified accusations.**

---

## 110. Future Extensions

### Satellite Corroboration

Use authorized satellite/aerial imagery as supporting evidence.

### IoT Corroboration

Combine:

```text
Photo:
Pump installed

Sensor:
Pump active

Combined evidence:
Strongly corroborating
```

### QR / NFC Asset Identity

Assign persistent identities to physical assets.

### Digital Asset Passport

```text
Asset
├── Location
├── Project
├── Creation
├── Evidence
├── Inspections
├── Maintenance
└── Current status
```

### Continuous Verification

Monitor evidence throughout the project lifecycle.

### Evidence Network Analysis

Identify suspicious relationships across projects.

---

## 111. Final SIH Positioning

### Problem

Large-scale field programs generate huge volumes of evidence, but manually verifying whether evidence is genuine, consistent, complete and relevant does not scale.

### Solution

An AI-assisted evidence intelligence layer that correlates:

- visual evidence
- metadata
- GPS
- time
- claims
- historical submissions
- project relationships

to generate explainable integrity/risk signals.

### Innovation

> **Treat evidence as a connected, auditable graph rather than isolated photographs.**

### Human Safety

> **AI prioritizes and explains. Humans make consequential decisions.**

### Technical Depth

- computer vision
- image embeddings
- vector search
- geospatial computation
- temporal reasoning
- graph relationships
- deterministic rules
- evidence fusion
- API architecture
- audit trails

---

## 112. Final Assessment

| Dimension | Score |
|---|---:|
| Technical feasibility | 9/10 |
| SIH prototype feasibility | 9/10 |
| Computer vision depth | 8.5/10 |
| Backend complexity | 8/10 |
| Real-world usefulness | 9/10 |
| Existing competition | Significant |
| Broad uniqueness | 4/10 |
| Refined uniqueness | 7.5/10 |
| Demo potential | 9/10 |
| Startup potential | 8.5/10 |
| Government deployment difficulty | High |
| Overall SIH potential | **7.5–8.5/10** |

---

## 113. Final Recommendation

**Do not submit the generic "Proof-of-Action" concept.**

Use the refined product:

> ## Evidence Integrity & Intelligence Layer
>
> **An API-first, domain-agnostic platform that audits existing field evidence by correlating visual similarity, provenance, GPS, time, claims and historical evidence to detect anomalies and prioritize human verification.**

The central product differentiator should remain:

> **Evidence Graph + Cross-Project Correlation + Explainable Multi-Signal Verification**

rather than:

> **AI photo verification.**


---

## Document Control

<table>
<tr><td><b>Prepared for</b></td><td>Smart India Hackathon 2026 submission</td></tr>
<tr><td><b>Document type</b></td><td>Detailed Product &amp; Technical Design</td></tr>
<tr><td><b>Confidentiality</b></td><td>Internal — for team &amp; jury review</td></tr>
<tr><td><b>Total sections</b></td><td>113</td></tr>
</table>

<p align="center">
  <img alt="Jai Hind" src="https://img.shields.io/badge/-Jai%20Hind%20🇮🇳-FF9933?style=flat-square&labelColor=138808">
</p>

<p align="center"><i>Evidence Graph + Cross-Project Correlation + Explainable Multi-Signal Verification.<br>AI prioritizes and explains. Humans make consequential decisions.</i></p>
