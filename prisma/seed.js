/**
 * Plain Node.js Prisma seed script for Proof-of-Action (EIIL).
 * Runs natively with `node prisma/seed.js`.
 */

const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Proof-of-Action database seeding (Node.js)...');

  // 1. Clean existing records in reverse dependency order
  await prisma.auditEvent.deleteMany();
  await prisma.reviewDecision.deleteMany();
  await prisma.duplicateMatch.deleteMany();
  await prisma.anomaly.deleteMany();
  await prisma.analysisResult.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Cleaned existing records');

  // 2. Create Users with exact credentials from credentials.md
  const citizenPasswordHash = await bcrypt.hash('Citizen@2026!', 10);
  const reviewerPasswordHash = await bcrypt.hash('Reviewer@2026!', 10);
  const supervisorPasswordHash = await bcrypt.hash('Supervisor@2026!', 10);

  const citizenUser = await prisma.user.create({
    data: {
      id: 'USR-CITIZEN-01',
      name: 'Ramesh Sharma',
      email: 'citizen.demo@example.com',
      phone: '+919823011223',
      passwordHash: citizenPasswordHash,
      role: UserRole.CITIZEN,
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '412301',
      isAadhaarVerified: true,
      isActive: true,
    },
  });

  const supervisorUser = await prisma.user.create({
    data: {
      id: 'USR-SUP-01',
      name: 'Suresh Patil (Junior Engineer)',
      email: 'supervisor.demo@example.com',
      phone: '+919845033441',
      passwordHash: supervisorPasswordHash,
      role: UserRole.SUPERVISOR,
      department: 'PMGSY Rural Roads Division',
      district: 'Pune',
      state: 'Maharashtra',
      isAadhaarVerified: true,
      isActive: true,
    },
  });

  const reviewerUser = await prisma.user.create({
    data: {
      id: 'USR-REV-01',
      name: 'Rajesh Kulkarni (SE & Lead Auditor)',
      email: 'reviewer.demo@example.com',
      phone: '+919811122233',
      passwordHash: reviewerPasswordHash,
      role: UserRole.REVIEWER,
      department: 'State Quality Audit Division',
      district: 'Pune',
      state: 'Maharashtra',
      isAadhaarVerified: true,
      isActive: true,
    },
  });

  console.log('✓ Created demo users (Citizen, Supervisor, Reviewer) matching credentials.md');

  // 3. Create Projects
  const projectsData = [
    {
      id: 'PRJ-PMGSY-MH-401',
      name: 'Purandar Taluka Rural Bitumen Road Reconstruction (Km 0.00 to 4.20)',
      scheme: 'PMGSY (Rural Roads)',
      ministry: 'Ministry of Rural Development',
      state: 'Maharashtra',
      district: 'Pune',
      block: 'Purandar',
      budgetInr: 34500000,
      contractor: 'Sahyadri Infra-Projects Pvt Ltd',
      centroidLat: 18.2812,
      centroidLng: 74.0154,
      geofenceRadiusMeter: 450,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2026-11-30'),
      imageUrl: '/images/projects/road-pothole.jpg',
    },
    {
      id: 'PRJ-JJM-RJ-108',
      name: 'Har Ghar Jal Rural Piped Water Scheme — Chaksu Block (Phase II)',
      scheme: 'Jal Jeevan Mission',
      ministry: 'Ministry of Jal Shakti',
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Chaksu',
      budgetInr: 18200000,
      contractor: 'Marwar HydroTech Consortium',
      centroidLat: 26.6022,
      centroidLng: 75.9512,
      geofenceRadiusMeter: 300,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2026-08-31'),
      imageUrl: '/images/projects/water-pump.jpg',
    },
    {
      id: 'PRJ-SSA-UP-512',
      name: 'Govt Primary School Structural Roof & Masonry Repair (PS-Barabanki)',
      scheme: 'Samagra Shiksha',
      ministry: 'Ministry of Education',
      state: 'Uttar Pradesh',
      district: 'Barabanki',
      block: 'Fatehpur',
      budgetInr: 4200000,
      contractor: 'Awadh Shiksha Nirman Sahakari',
      centroidLat: 26.9275,
      centroidLng: 81.1834,
      geofenceRadiusMeter: 120,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2026-03-31'),
      imageUrl: '/images/projects/school-after.jpg',
    },
    {
      id: 'PRJ-KUSUM-KA-204',
      name: 'PM-KUSUM Component-C Feeder Level Solarization (500 kW Grid-Tied)',
      scheme: 'PM-KUSUM (Solar)',
      ministry: 'Ministry of New & Renewable Energy',
      state: 'Karnataka',
      district: 'Tumakuru',
      block: 'Tiptur',
      budgetInr: 27800000,
      contractor: 'Deccan Surya Urja Ltd',
      centroidLat: 13.2611,
      centroidLng: 76.4819,
      geofenceRadiusMeter: 200,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2026-10-15'),
      imageUrl: '/images/projects/solar-plant.jpg',
    },
    {
      id: 'PRJ-SSA-OD-309',
      name: 'Ashram School Solar Street Lighting & Campus Perimeter Illumination',
      scheme: 'Samagra Shiksha',
      ministry: 'Ministry of Tribal Affairs / MoE',
      state: 'Odisha',
      district: 'Koraput',
      block: 'Semiliguda',
      budgetInr: 3100000,
      contractor: 'Utkal Green Light Enterprises',
      centroidLat: 18.7088,
      centroidLng: 82.8688,
      geofenceRadiusMeter: 150,
      startDate: new Date('2025-08-01'),
      endDate: new Date('2026-06-30'),
      imageUrl: '/images/projects/school-solar-lights.jpg',
    },
    {
      id: 'PRJ-PMGSY-AS-198',
      name: 'Brahmaputra Flood-Resilient Embankment Approach Road (Ch 0+000 to 2+800)',
      scheme: 'PMGSY (Rural Roads)',
      ministry: 'Ministry of Rural Development',
      state: 'Assam',
      district: 'Majuli',
      block: 'Ujani Majuli',
      budgetInr: 49000000,
      contractor: 'Brahmaputra Civil Infrastructure Works',
      centroidLat: 26.9644,
      centroidLng: 94.2188,
      geofenceRadiusMeter: 600,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2026-12-31'),
      imageUrl: '/images/projects/embankment-road.jpg',
    },
  ];

  for (const p of projectsData) {
    await prisma.project.create({ data: p });
  }
  console.log('✓ Created 6 core infrastructure projects');

  // 4. Create Activities & Claims
  const activity1 = await prisma.activity.create({
    data: {
      projectId: 'PRJ-PMGSY-MH-401',
      name: 'Bituminous Wearing Coat Application',
      status: 'IN_PROGRESS',
    },
  });

  const claim1 = await prisma.claim.create({
    data: {
      activityId: activity1.id,
      text: 'Bituminous concrete wearing coat 40mm laid continuously over 1.2km section with compaction test cleared.',
      status: 'UNVERIFIED',
    },
  });

  // 5. Create Evidence Items
  const evidence1 = await prisma.evidence.create({
    data: {
      id: 'EVD-2026-8812',
      projectId: 'PRJ-PMGSY-MH-401',
      activityId: activity1.id,
      claimId: claim1.id,
      uploadedById: supervisorUser.id,
      objectKey: 'projects/road-pothole.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 3412980,
      sha256: 'a7f8c92b4e5d6f1a0c3b8e7d2f4a6c8e1b3d5f7a9c2e4b6d8f0a2c4e6b8d0f2a',
      pHash: 'b4a8e2d1c7f09312',
      stage: 'after',
      capturedAt: new Date('2026-08-28T14:32:11+05:30'),
      latitude: 18.2814,
      longitude: 74.0156,
      gpsAccuracyM: 4.2,
      status: 'FLAGGED',
      riskLevel: 'CRITICAL',
      integrityScore: 31,
      modelVersion: 'eiil-mvp-v1.0',
    },
  });

  // Create Anomalies for Evidence 1
  await prisma.anomaly.createMany({
    data: [
      {
        evidenceId: evidence1.id,
        type: 'CROSS_PROJECT_DUPLICATE',
        severity: 'CRITICAL',
        confidence: 97,
        title: 'Cross-Project Evidence Duplication',
        description: 'Perceptual hash matches evidence EVD-2026-1832 uploaded in another project PRJ-PMGSY-AS-198 with 94.7% confidence.',
        supportingData: 'pHash hamming distance: 2 bits / similarity: 94.7%',
      },
      {
        evidenceId: evidence1.id,
        type: 'CLAIM_MISMATCH',
        severity: 'HIGH',
        confidence: 89,
        title: 'Claim Visual Inconsistency',
        description: 'Visual features show unpaved dirt surface with active erosion, whereas claim certifies completed bituminous wearing coat.',
        supportingData: 'Object detector found: unpaved_surface (94%), pothole (88%)',
      },
    ],
  });

  // Create Analysis Result for Evidence 1
  await prisma.analysisResult.create({
    data: {
      evidenceId: evidence1.id,
      jobId: 'job_seed_001',
      gpsScore: 92,
      temporalScore: 88,
      duplicateRisk: 95,
      visualScore: 30,
      authenticityScore: 85,
      claimMatch: 25,
      metadataScore: 90,
      completeness: 95,
      overallIntegrity: 31,
      riskScore: 31,
      explanations: JSON.stringify({
        summary: 'Evidence integrity score is 31/100 (CRITICAL risk). 2 critical anomalies detected including cross-project image duplication.',
        flagReasons: [
          'Perceptual hash matches evidence EVD-2026-1832 uploaded in project PRJ-PMGSY-AS-198 with 94.7% confidence.',
          'Visual features show unpaved road with pothole instead of claimed completed bitumen surface.',
        ],
        recommendedAction: 'IMMEDIATE_ESCALATION',
        confidence: 94,
      }),
    },
  });

  // Create Evidence 2 (School Before/After)
  const evidence2 = await prisma.evidence.create({
    data: {
      id: 'EVD-2026-7734',
      projectId: 'PRJ-SSA-UP-512',
      uploadedById: supervisorUser.id,
      objectKey: 'projects/school-after.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 2894100,
      sha256: '9f2c7a4b1e3d6f8a0c2b5e8d1f4a7c0e3b6d9f2a5c8e1b4d7f0a3c6e9b2d5f8a',
      pHash: 'a1b2c3d4e5f60718',
      stage: 'after',
      capturedAt: new Date('2026-08-27T10:14:22+05:30'),
      latitude: 26.9274,
      longitude: 81.1835,
      gpsAccuracyM: 3.1,
      status: 'APPROVED',
      riskLevel: 'LOW',
      integrityScore: 94,
      modelVersion: 'eiil-mvp-v1.0',
    },
  });

  await prisma.analysisResult.create({
    data: {
      evidenceId: evidence2.id,
      jobId: 'job_seed_002',
      gpsScore: 98,
      temporalScore: 95,
      duplicateRisk: 0,
      visualScore: 92,
      authenticityScore: 96,
      claimMatch: 95,
      metadataScore: 94,
      completeness: 100,
      overallIntegrity: 94,
      riskScore: 94,
      explanations: JSON.stringify({
        summary: 'Evidence integrity score is 94/100 (LOW risk). Structural repair and roof waterproofing verified consistent with baseline survey.',
        flagReasons: [],
        recommendedAction: 'AUTO_APPROVE',
        confidence: 98,
      }),
    },
  });

  // Create Audit Events
  await prisma.auditEvent.createMany({
    data: [
      {
        evidenceId: evidence1.id,
        actorId: supervisorUser.id,
        action: 'UPLOAD',
        newState: 'PENDING',
        reason: 'Initial site photograph submitted from field Android client.',
      },
      {
        evidenceId: evidence1.id,
        actorId: reviewerUser.id,
        action: 'FLAG_CRITICAL',
        previousState: 'PENDING',
        newState: 'FLAGGED',
        reason: 'Automated fusion detected cross-project visual match with PRJ-PMGSY-AS-198.',
      },
      {
        evidenceId: evidence2.id,
        actorId: reviewerUser.id,
        action: 'APPROVE',
        previousState: 'PENDING',
        newState: 'APPROVED',
        reason: 'All 7 verification signals within threshold; before/after change verified.',
      },
    ],
  });

  console.log('✓ Created evidence, anomalies, analyses, and audit logs');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

