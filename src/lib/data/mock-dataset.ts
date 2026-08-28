export interface Anomaly {
  id: string;
  type:
    | 'DUPLICATE_EVIDENCE'
    | 'CROSS_PROJECT_DUPLICATE'
    | 'LOCATION_MISMATCH'
    | 'TEMPORAL_MISMATCH'
    | 'METADATA_ANOMALY'
    | 'IMAGE_MANIPULATION_RISK'
    | 'CLAIM_MISMATCH'
    | 'INCOMPLETE_EVIDENCE'
    | 'VISUAL_INCONSISTENCY'
    | 'QUANTITY_UNSUPPORTED'
    | 'IMPOSSIBLE_TRAVEL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number; // 0-100
  title: string;
  description: string;
  supportingData?: string;
  translatedDescription?: Record<string, string>;
}

export interface SimilarMatch {
  evidenceId: string;
  projectId: string;
  projectName: string;
  scheme: string;
  district: string;
  distanceKm: number;
  similarityPercentage: number;
  matchedFeature: 'pHash' | 'vector_embedding' | 'sha256_exact' | 'keypoint_sift';
  thumbnailUri: string;
}

export interface DetectedObject {
  label: string;
  confidence: number;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] percentage
}

export interface EvidenceItem {
  id: string;
  projectId: string;
  projectName: string;
  scheme: string;
  ministry: string;
  activityName: string;
  stage: 'before' | 'during' | 'after' | 'completion_doc';
  title: string;
  imageUrl: string;
  beforeImageUrl?: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  capturedAt: string;
  uploadedAt: string;
  location: {
    lat: number;
    lng: number;
    accuracyMeters: number;
    geofenceDistanceMeters: number;
    siteCentroid: { lat: number; lng: number };
    status: 'CONSISTENT' | 'DEVIATION' | 'ANOMALOUS';
    state: string;
    district: string;
    block: string;
  };
  camera: {
    make: string;
    model: string;
    software: string;
    focalLength: string;
    iso: string;
    exposure: string;
  };
  integrityScore: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  auditStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'OVERRIDDEN';
  reviewer?: {
    assignedTo: string;
    reviewedBy?: string;
    decisionDate?: string;
    note?: string;
    overrideReason?: string;
  };
  fusionScores: {
    gps: number;
    temporal: number;
    duplicateRisk: number; // lower is better
    manipulationRisk: number; // lower is better
    claimMatch: number;
    metadataIntegrity: number;
    completeness: number;
  };
  detectedAnomalies: Anomaly[];
  similarEvidenceMatches: SimilarMatch[];
  detectedObjects: DetectedObject[];
  structuralChangeConfidence?: number;
  claimText: string;
  modelVersion: string;
}

export interface Project {
  id: string;
  name: string;
  scheme: string;
  ministry: string;
  state: string;
  district: string;
  block: string;
  budgetInr: number;
  contractor: string;
  centroid: { lat: number; lng: number };
  geofenceRadiusMeters: number;
  startDate: string;
  endDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'UNDER_AUDIT' | 'FLAGGED_HOLD';
  evidenceHealthScore: number;
  totalSubmissions: number;
  flaggedCount: number;
  requiredEvidenceList: {
    key: string;
    label: string;
    isMandatory: boolean;
    status: 'FULFILLED' | 'MISSING' | 'PARTIAL';
  }[];
  activities: {
    id: string;
    name: string;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
    evidenceIds: string[];
  }[];
}

export interface AuditEvent {
  id: string;
  evidenceId: string;
  projectId: string;
  actorName: string;
  actorRole: string;
  action: 'UPLOAD' | 'AI_FUSION_ANALYSIS' | 'FLAG_CRITICAL' | 'APPROVE' | 'REJECT' | 'OVERRIDE' | 'INSPECTION_REQUESTED';
  previousState: string;
  newState: string;
  reason: string;
  sha256Hash: string;
  timestamp: string;
}

// 1. Projects Dataset
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'PRJ-PMGSY-MH-401',
    name: 'Purandar Taluka Rural Bitumen Road Reconstruction (Km 0.00 to 4.20)',
    scheme: 'PMGSY (Rural Roads)',
    ministry: 'Ministry of Rural Development',
    state: 'Maharashtra',
    district: 'Pune',
    block: 'Purandar',
    budgetInr: 34500000,
    contractor: 'Sahyadri Infrastructure Ltd.',
    centroid: { lat: 18.2812, lng: 74.0154 },
    geofenceRadiusMeters: 150,
    startDate: '2026-03-01',
    endDate: '2026-08-30',
    status: 'COMPLETED',
    evidenceHealthScore: 94,
    totalSubmissions: 12,
    flaggedCount: 0,
    requiredEvidenceList: [
      { key: 'before_photo', label: 'Before Road Condition Survey', isMandatory: true, status: 'FULFILLED' },
      { key: 'during_photo', label: 'During WBM Subgrade Laying', isMandatory: true, status: 'FULFILLED' },
      { key: 'after_photo', label: 'Final Bituminous Carpet Surface', isMandatory: true, status: 'FULFILLED' },
      { key: 'gps_centroid', label: 'Geo-centroid Waypoint Track', isMandatory: true, status: 'FULFILLED' },
      { key: 'qa_cert', label: 'Stage-3 Quality Inspection Certificate', isMandatory: true, status: 'FULFILLED' },
    ],
    activities: [
      { id: 'ACT-01', name: 'Existing Pavement Scarification', status: 'COMPLETED', evidenceIds: ['EVD-2026-8812-B'] },
      { id: 'ACT-02', name: 'Dense Bituminous Macadam (DBM) Layer', status: 'COMPLETED', evidenceIds: ['EVD-2026-8812-D'] },
      { id: 'ACT-03', name: 'Asphalt Wearing Course & Pavement Markings', status: 'COMPLETED', evidenceIds: ['EVD-2026-8812'] },
    ],
  },
  {
    id: 'PRJ-JJM-RJ-108',
    name: 'Har Ghar Jal Rural Piped Water Scheme with Solar Dual-Pump Well',
    scheme: 'Jal Jeevan Mission',
    ministry: 'Ministry of Jal Shakti',
    state: 'Rajasthan',
    district: 'Jaipur',
    block: 'Chaksu',
    budgetInr: 18200000,
    contractor: 'Marwar Water Engineering Works',
    centroid: { lat: 26.6021, lng: 75.9511 },
    geofenceRadiusMeters: 100,
    startDate: '2026-04-10',
    endDate: '2026-09-15',
    status: 'FLAGGED_HOLD',
    evidenceHealthScore: 28,
    totalSubmissions: 8,
    flaggedCount: 3,
    requiredEvidenceList: [
      { key: 'borewell_photo', label: 'Deep Borewell Drilling Site', isMandatory: true, status: 'FULFILLED' },
      { key: 'pump_install', label: 'Solar Submersible Pump & Panel Array', isMandatory: true, status: 'FULFILLED' },
      { key: 'staging_tank', label: 'Overhead RCC Staging Tank (50kL)', isMandatory: true, status: 'MISSING' },
      { key: 'tap_fhtc', label: 'Household Tap Connection Flow Verification', isMandatory: true, status: 'MISSING' },
    ],
    activities: [
      { id: 'ACT-J1', name: 'Borewell Drilling & Casing', status: 'COMPLETED', evidenceIds: ['EVD-2026-9040'] },
      { id: 'ACT-J2', name: 'Solar Dual-Pump & Control Panel Installation', status: 'IN_PROGRESS', evidenceIds: ['EVD-2026-9041'] },
    ],
  },
  {
    id: 'PRJ-SSA-UP-512',
    name: 'Government Primary & Upper Primary School Structural Roof & Masonry Repair',
    scheme: 'Samagra Shiksha Abhiyan',
    ministry: 'Ministry of Education',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    block: 'Pindra',
    budgetInr: 4600000,
    contractor: 'Kashi Constructions & Allied Services',
    centroid: { lat: 25.3176, lng: 82.9739 },
    geofenceRadiusMeters: 80,
    startDate: '2026-05-01',
    endDate: '2026-08-15',
    status: 'UNDER_AUDIT',
    evidenceHealthScore: 41,
    totalSubmissions: 6,
    flaggedCount: 2,
    requiredEvidenceList: [
      { key: 'roof_damage', label: 'Pre-Repair Roof Spalling & Seepage Photos', isMandatory: true, status: 'FULFILLED' },
      { key: 'waterproofing', label: 'Waterproofing Membrane & Screed Coat', isMandatory: true, status: 'FULFILLED' },
      { key: 'final_classroom', label: 'Refurbished Classroom & Exterior Plaster', isMandatory: true, status: 'FULFILLED' },
    ],
    activities: [
      { id: 'ACT-S1', name: 'Structural Slab Retrofitting', status: 'IN_PROGRESS', evidenceIds: ['EVD-2026-7734'] },
    ],
  },
  {
    id: 'PRJ-KUSUM-KA-204',
    name: 'PM-KUSUM Component-C Feeder Level Solarization (500 kW Plant)',
    scheme: 'PM-KUSUM (Solar)',
    ministry: 'Ministry of New and Renewable Energy',
    state: 'Karnataka',
    district: 'Tumakuru',
    block: 'Tiptur',
    budgetInr: 22000000,
    contractor: 'Cauvery Solar Renewable Infra',
    centroid: { lat: 13.2577, lng: 76.4789 },
    geofenceRadiusMeters: 120,
    startDate: '2026-02-15',
    endDate: '2026-07-31',
    status: 'UNDER_AUDIT',
    evidenceHealthScore: 62,
    totalSubmissions: 14,
    flaggedCount: 1,
    requiredEvidenceList: [
      { key: 'land_level', label: 'Land Grading & Foundation Pier Casts', isMandatory: true, status: 'FULFILLED' },
      { key: 'pv_array', label: 'Ground-Mounted Mono-PERC Solar Arrays', isMandatory: true, status: 'FULFILLED' },
      { key: 'grid_substation', label: 'Inverter Transformer & Discom Interconnection', isMandatory: true, status: 'FULFILLED' },
    ],
    activities: [
      { id: 'ACT-K1', name: 'Module Mounting Structure Installation', status: 'COMPLETED', evidenceIds: ['EVD-2026-6190'] },
    ],
  },
  {
    id: 'PRJ-SSA-OD-309',
    name: 'Model Tribal Residential Ashram School Solar Street Lighting & Campus Security',
    scheme: 'Samagra Shiksha Abhiyan',
    ministry: 'Ministry of Education & Tribal Affairs',
    state: 'Odisha',
    district: 'Mayurbhanj',
    block: 'Baripada',
    budgetInr: 1850000,
    contractor: 'Mayurbhanj Electricals & Infra',
    centroid: { lat: 21.9345, lng: 86.7412 },
    geofenceRadiusMeters: 100,
    startDate: '2026-06-01',
    endDate: '2026-08-20',
    status: 'FLAGGED_HOLD',
    evidenceHealthScore: 34,
    totalSubmissions: 4,
    flaggedCount: 2,
    requiredEvidenceList: [
      { key: 'solar_pole_batch', label: '10x Standalone 40W LED Solar Street Lights Installed', isMandatory: true, status: 'PARTIAL' },
      { key: 'lithium_battery', label: 'Battery Box & MPPT Charge Controller Verification', isMandatory: true, status: 'MISSING' },
    ],
    activities: [
      { id: 'ACT-O1', name: 'Solar Pole Erection & Luminaires Fixture', status: 'IN_PROGRESS', evidenceIds: ['EVD-2026-5509'] },
    ],
  },
  {
    id: 'PRJ-PMGSY-AS-198',
    name: 'Brahmaputra Flood-Resilient Embankment Approach Road (Ch. 12+200)',
    scheme: 'PMGSY (Rural Roads)',
    ministry: 'Ministry of Rural Development',
    state: 'Assam',
    district: 'Kamrup',
    block: 'Hajo',
    budgetInr: 41200000,
    contractor: 'Pragjyotish Civil Works Pvt Ltd',
    centroid: { lat: 26.2483, lng: 91.5218 },
    geofenceRadiusMeters: 200,
    startDate: '2026-01-10',
    endDate: '2026-10-31',
    status: 'IN_PROGRESS',
    evidenceHealthScore: 58,
    totalSubmissions: 7,
    flaggedCount: 1,
    requiredEvidenceList: [
      { key: 'geo_textile', label: 'Geo-textile Reinforcement Slope Protection', isMandatory: true, status: 'FULFILLED' },
      { key: 'stone_pitching', label: 'Boulder Stone Pitching on Toe Wall', isMandatory: true, status: 'MISSING' },
      { key: 'wearing_layer', label: 'Paver Asphalt Top Finish', isMandatory: true, status: 'PARTIAL' },
    ],
    activities: [
      { id: 'ACT-A1', name: 'Slope Embankment Stabilization', status: 'IN_PROGRESS', evidenceIds: ['EVD-2026-4402'] },
    ],
  },
];

// 2. Evidence Items Dataset (The SIH Killer Benchmark Set)
export const MOCK_EVIDENCE_ITEMS: EvidenceItem[] = [
  // Item 1: Genuine Road Repair (High Integrity, Low Risk)
  {
    id: 'EVD-2026-8812',
    projectId: 'PRJ-PMGSY-MH-401',
    projectName: 'Purandar Taluka Rural Bitumen Road Reconstruction (Km 0.00 to 4.20)',
    scheme: 'PMGSY (Rural Roads)',
    ministry: 'Ministry of Rural Development',
    activityName: 'Asphalt Wearing Course & Pavement Markings',
    stage: 'after',
    title: 'Completed 4.2 km Bituminous Surface with White Edge Thermal Markings',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    beforeImageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    mimeType: 'image/jpeg',
    sizeBytes: 3842100,
    sha256: '9f83a48e71b29d8164bc77f202e88a014902cd51772183e89f8a31362e08c491',
    capturedAt: '2026-08-20T14:32:10+05:30',
    uploadedAt: '2026-08-20T14:41:22+05:30',
    location: {
      lat: 18.2814,
      lng: 74.0156,
      accuracyMeters: 4.2,
      geofenceDistanceMeters: 28,
      siteCentroid: { lat: 18.2812, lng: 74.0154 },
      status: 'CONSISTENT',
      state: 'Maharashtra',
      district: 'Pune',
      block: 'Purandar',
    },
    camera: {
      make: 'Samsung',
      model: 'Galaxy A54 5G Enterprise',
      software: 'Govt e-Pramaan Mobile Client v3.1.2',
      focalLength: '5.4mm (f/1.8)',
      iso: '50',
      exposure: '1/850s',
    },
    integrityScore: 94,
    riskLevel: 'LOW',
    auditStatus: 'APPROVED',
    reviewer: {
      assignedTo: 'Rajesh Kulkarni (SE PWD)',
      reviewedBy: 'Rajesh Kulkarni (SE PWD)',
      decisionDate: '2026-08-21T10:15:00+05:30',
      note: 'Verified against Stage-2 subgrade records. Visual smoothness and geofence boundaries perfectly aligned.',
    },
    fusionScores: {
      gps: 98,
      temporal: 96,
      duplicateRisk: 3,
      manipulationRisk: 4,
      claimMatch: 95,
      metadataIntegrity: 96,
      completeness: 100,
    },
    detectedAnomalies: [],
    similarEvidenceMatches: [],
    detectedObjects: [
      { label: 'asphalt_road_surface', confidence: 0.98, box: [0.35, 0.05, 0.95, 0.95] },
      { label: 'road_paint_marking', confidence: 0.93, box: [0.65, 0.45, 0.90, 0.55] },
      { label: 'concrete_kerb', confidence: 0.89, box: [0.45, 0.02, 0.75, 0.20] },
    ],
    structuralChangeConfidence: 91,
    claimText: 'Completed 40mm thick asphalt concrete wearing coat with thermoplastic retroreflective line markers across 4.20 km road stretch.',
    modelVersion: 'eiil-vision-v2.4-pmgsy',
  },

  // Item 2: Recycled Cross-District Water Pump (CRITICAL DUPLICATE)
  {
    id: 'EVD-2026-9041',
    projectId: 'PRJ-JJM-RJ-108',
    projectName: 'Har Ghar Jal Rural Piped Water Scheme with Solar Dual-Pump Well',
    scheme: 'Jal Jeevan Mission',
    ministry: 'Ministry of Jal Shakti',
    activityName: 'Solar Dual-Pump & Control Panel Installation',
    stage: 'after',
    title: 'Installed 5HP DC Submersible Solar Pump with 12-Panel Solar Array',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    mimeType: 'image/jpeg',
    sizeBytes: 4210900,
    sha256: '3c19e59d997a02c841bb28ff8390ab914028ce821102948caef198302bf029aa',
    capturedAt: '2026-08-25T11:20:45+05:30',
    uploadedAt: '2026-08-25T11:45:10+05:30',
    location: {
      lat: 26.6025,
      lng: 75.9515,
      accuracyMeters: 8.5,
      geofenceDistanceMeters: 62,
      siteCentroid: { lat: 26.6021, lng: 75.9511 },
      status: 'CONSISTENT',
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Chaksu',
    },
    camera: {
      make: 'Xiaomi',
      model: 'Redmi Note 12 Pro',
      software: 'MIUI Camera v4.5',
      focalLength: '4.8mm (f/1.9)',
      iso: '100',
      exposure: '1/1200s',
    },
    integrityScore: 28,
    riskLevel: 'CRITICAL',
    auditStatus: 'FLAGGED',
    reviewer: {
      assignedTo: 'Vikram Singh Shekhawat (EE JJM)',
    },
    fusionScores: {
      gps: 88,
      temporal: 45,
      duplicateRisk: 96,
      manipulationRisk: 62,
      claimMatch: 80,
      metadataIntegrity: 40,
      completeness: 50,
    },
    detectedAnomalies: [
      {
        id: 'ANOM-01',
        type: 'CROSS_PROJECT_DUPLICATE',
        severity: 'CRITICAL',
        confidence: 94.7,
        title: 'Cross-Project Recycled Evidence Detected (94.7% Visual Match)',
        description: 'This photograph exhibits 94.7% perceptual & embedding similarity with evidence EVD-2025-1832 uploaded 8 months ago for a distinct scheme in Jodhpur district, located 318.4 km away.',
        supportingData: 'Matched Target: EVD-2025-1832 (PRJ-JJM-RJ-044, Jodhpur). pHash Hamming Distance: 2. Cosine Embedding Similarity: 0.947.',
      },
      {
        id: 'ANOM-02',
        type: 'METADATA_ANOMALY',
        severity: 'HIGH',
        confidence: 88.0,
        title: 'EXIF Timestamp Stripped & Modified by Third-Party Editor',
        description: 'Original EXIF DateTimeOriginal tag was deleted; software tag indicates secondary export via mobile image sharing app prior to upload.',
        supportingData: 'Original DateTime header missing. File header signature: WhatsApp/Lightroom re-encode.',
      },
    ],
    similarEvidenceMatches: [
      {
        evidenceId: 'EVD-2025-1832',
        projectId: 'PRJ-JJM-RJ-044',
        projectName: 'Phalodi Village Solar Piped Water Installation Stage 2',
        scheme: 'Jal Jeevan Mission',
        district: 'Jodhpur (318 km away)',
        distanceKm: 318.4,
        similarityPercentage: 94.7,
        matchedFeature: 'vector_embedding',
        thumbnailUri: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80',
      },
      {
        evidenceId: 'EVD-2025-0914',
        projectId: 'PRJ-KUSUM-RJ-019',
        projectName: 'Bikaner Solar Ag Pump Grid Substation',
        scheme: 'PM-KUSUM',
        district: 'Bikaner (295 km away)',
        distanceKm: 295.1,
        similarityPercentage: 86.2,
        matchedFeature: 'pHash',
        thumbnailUri: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=400&q=80',
      },
    ],
    detectedObjects: [
      { label: 'solar_panel_array', confidence: 0.96, box: [0.10, 0.15, 0.70, 0.85] },
      { label: 'pump_control_kiosk', confidence: 0.91, box: [0.55, 0.60, 0.90, 0.85] },
    ],
    claimText: 'Newly installed 5HP dual solar pumping assembly providing 40,000 litres per day discharge into Chaksu overhead reservoir.',
    modelVersion: 'eiil-vision-v2.4-water',
  },

  // Item 3: Impossible Travel / Temporal-Spatial Teleportation (HIGH RISK)
  {
    id: 'EVD-2026-7734',
    projectId: 'PRJ-SSA-UP-512',
    projectName: 'Government Primary & Upper Primary School Structural Roof & Masonry Repair',
    scheme: 'Samagra Shiksha Abhiyan',
    ministry: 'Ministry of Education',
    activityName: 'Structural Slab Retrofitting',
    stage: 'after',
    title: 'Completed Concrete Polymer Waterproof Screed on 4-Classroom Block',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    beforeImageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
    mimeType: 'image/jpeg',
    sizeBytes: 3120400,
    sha256: '7b80a112cd4e0029b389182390fca8201994821a8bc4710182739481902ebaf1',
    capturedAt: '2026-08-26T10:04:12+05:30',
    uploadedAt: '2026-08-26T10:06:05+05:30',
    location: {
      lat: 25.6891,
      lng: 83.3912,
      accuracyMeters: 12.0,
      geofenceDistanceMeters: 58200, // 58.2 km from registered site
      siteCentroid: { lat: 25.3176, lng: 82.9739 },
      status: 'ANOMALOUS',
      state: 'Uttar Pradesh',
      district: 'Ghazipur (Claimed Varanasi)',
      block: 'Zamania',
    },
    camera: {
      make: 'Vivo',
      model: 'V29 5G',
      software: 'Funtouch OS v13.0',
      focalLength: '5.5mm (f/1.8)',
      iso: '150',
      exposure: '1/600s',
    },
    integrityScore: 41,
    riskLevel: 'HIGH',
    auditStatus: 'FLAGGED',
    reviewer: {
      assignedTo: 'Anand Swaroop (BSA Education Varanasi)',
    },
    fusionScores: {
      gps: 15,
      temporal: 30,
      duplicateRisk: 8,
      manipulationRisk: 12,
      claimMatch: 82,
      metadataIntegrity: 70,
      completeness: 75,
    },
    detectedAnomalies: [
      {
        id: 'ANOM-03',
        type: 'IMPOSSIBLE_TRAVEL',
        severity: 'HIGH',
        confidence: 99.2,
        title: 'Impossible Travel / Temporal-Spatial Teleportation (48.4 km in 3m 12s)',
        description: 'Field inspection device recorded an upload in Varanasi (Lat 25.3176, Lng 82.9739) at 10:01:00 AM, followed by this submission at 10:04:12 AM in Ghazipur (58.2 km away). The implied ground velocity is 907 km/h, which is physically implausible for vehicle transit.',
        supportingData: 'Delta Time: 192 seconds. Delta Distance: 48.4 km. Minimum velocity required: 907.5 km/h.',
      },
      {
        id: 'ANOM-04',
        type: 'LOCATION_MISMATCH',
        severity: 'HIGH',
        confidence: 96.5,
        title: 'Evidence Captured Outside Registered Project Geofence (58.2 km Deviation)',
        description: 'Submission coordinates locate the asset in Zamania Block, Ghazipur District, whereas the sanctioned school is in Pindra Block, Varanasi District.',
        supportingData: 'Site Geofence Radius: 80m. Actual Distance: 58,200m.',
      },
    ],
    similarEvidenceMatches: [],
    detectedObjects: [
      { label: 'roof_concrete_slab', confidence: 0.94, box: [0.30, 0.10, 0.90, 0.90] },
      { label: 'brick_masonry_wall', confidence: 0.91, box: [0.10, 0.05, 0.50, 0.40] },
    ],
    structuralChangeConfidence: 84,
    claimText: 'Completed concrete polymer structural screeding and elastomeric waterproof coating across 480 sq. meters of school building roof.',
    modelVersion: 'eiil-vision-v2.4-school',
  },

  // Item 4: Geofence Deviation (MEDIUM RISK)
  {
    id: 'EVD-2026-6190',
    projectId: 'PRJ-KUSUM-KA-204',
    projectName: 'PM-KUSUM Component-C Feeder Level Solarization (500 kW Plant)',
    scheme: 'PM-KUSUM (Solar)',
    ministry: 'Ministry of New and Renewable Energy',
    activityName: 'Module Mounting Structure Installation',
    stage: 'after',
    title: 'Galvanized Steel Mounting Racks & Solar Inverter Connection Grounding',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    mimeType: 'image/jpeg',
    sizeBytes: 2980100,
    sha256: '44a80291e019280cdb9012a9e8802914109823ae8910012e882910baef091a22',
    capturedAt: '2026-08-24T16:10:30+05:30',
    uploadedAt: '2026-08-24T16:18:40+05:30',
    location: {
      lat: 13.2612,
      lng: 76.4820,
      accuracyMeters: 6.0,
      geofenceDistanceMeters: 485, // 485m from centroid
      siteCentroid: { lat: 13.2577, lng: 76.4789 },
      status: 'DEVIATION',
      state: 'Karnataka',
      district: 'Tumakuru',
      block: 'Tiptur',
    },
    camera: {
      make: 'OnePlus',
      model: 'Nord CE 3 Lite',
      software: 'OxygenOS v14.0',
      focalLength: '5.2mm (f/1.7)',
      iso: '80',
      exposure: '1/1000s',
    },
    integrityScore: 62,
    riskLevel: 'MEDIUM',
    auditStatus: 'PENDING',
    reviewer: {
      assignedTo: 'Nagaraj Swamy (AEE KREDL)',
    },
    fusionScores: {
      gps: 55,
      temporal: 92,
      duplicateRisk: 5,
      manipulationRisk: 8,
      claimMatch: 88,
      metadataIntegrity: 90,
      completeness: 85,
    },
    detectedAnomalies: [
      {
        id: 'ANOM-05',
        type: 'LOCATION_MISMATCH',
        severity: 'MEDIUM',
        confidence: 82.0,
        title: 'Geofence Boundary Deviation (485m Outside Registered Center)',
        description: 'The capture location is 485 metres from the registered survey plot center (sanctioned radius: 120m). May indicate an adjacent agricultural parcel or updated feeder substation alignment.',
        supportingData: 'Target Boundary: 120m radius. Deviation: +365m. Direction: North-East 42°',
      },
    ],
    similarEvidenceMatches: [],
    detectedObjects: [
      { label: 'solar_mounting_structure', confidence: 0.97, box: [0.20, 0.10, 0.85, 0.90] },
      { label: 'grounding_cable_trench', confidence: 0.82, box: [0.75, 0.30, 0.95, 0.70] },
    ],
    claimText: 'Completed mounting of 24 galvanized heavy-gauge mounting tables with hot-dip zinc coating and surge arrestor earthing pit.',
    modelVersion: 'eiil-vision-v2.4-solar',
  },

  // Item 5: Claim Mismatch — Solar Lights Claimed on Empty Field (CRITICAL)
  {
    id: 'EVD-2026-5509',
    projectId: 'PRJ-SSA-OD-309',
    projectName: 'Model Tribal Residential Ashram School Solar Street Lighting & Campus Security',
    scheme: 'Samagra Shiksha Abhiyan',
    ministry: 'Ministry of Education & Tribal Affairs',
    activityName: 'Solar Pole Erection & Luminaires Fixture',
    stage: 'after',
    title: 'Completed Installation of 10 Solar Campus LED Street Luminaires',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    mimeType: 'image/jpeg',
    sizeBytes: 2540000,
    sha256: '55bc9018283901abcf8192019283019283019283019283019283019283019283',
    capturedAt: '2026-08-26T15:40:00+05:30',
    uploadedAt: '2026-08-26T15:52:19+05:30',
    location: {
      lat: 21.9348,
      lng: 86.7416,
      accuracyMeters: 5.0,
      geofenceDistanceMeters: 45,
      siteCentroid: { lat: 21.9345, lng: 86.7412 },
      status: 'CONSISTENT',
      state: 'Odisha',
      district: 'Mayurbhanj',
      block: 'Baripada',
    },
    camera: {
      make: 'Realme',
      model: '11 Pro 5G',
      software: 'Realme UI v4.0',
      focalLength: '4.7mm (f/1.8)',
      iso: '120',
      exposure: '1/750s',
    },
    integrityScore: 34,
    riskLevel: 'CRITICAL',
    auditStatus: 'FLAGGED',
    reviewer: {
      assignedTo: 'Debasish Mohapatra (DEO Mayurbhanj)',
    },
    fusionScores: {
      gps: 94,
      temporal: 90,
      duplicateRisk: 4,
      manipulationRisk: 10,
      claimMatch: 12,
      metadataIntegrity: 88,
      completeness: 30,
    },
    detectedAnomalies: [
      {
        id: 'ANOM-06',
        type: 'CLAIM_MISMATCH',
        severity: 'CRITICAL',
        confidence: 96.8,
        title: 'Severe Claim-to-Evidence Semantic Disconnect (Expected 10 Solar Street Lights, Found 0)',
        description: 'The contractor claimed completion of 10x 40W Solar LED street poles. Vision segmentation identified an open agricultural fallow field containing grass, trees, and empty terrain with zero steel poles, solar PV modules, or luminaire fixtures.',
        supportingData: 'Expected semantic classes: [solar_street_light, pv_module, steel_pole]. Detected classes: [open_grassland, sky, tree_canopy]. Match confidence: 12%.',
      },
      {
        id: 'ANOM-07',
        type: 'QUANTITY_UNSUPPORTED',
        severity: 'CRITICAL',
        confidence: 98.0,
        title: 'Quantity Verification Failure: 0 of 10 Required Assets Detected',
        description: 'Zero verifiable units detected against the sanctioned quantity threshold of 10 units.',
        supportingData: 'Claimed: 10 units. Verified: 0 units.',
      },
    ],
    similarEvidenceMatches: [],
    detectedObjects: [
      { label: 'fallow_land', confidence: 0.98, box: [0.40, 0.05, 0.95, 0.95] },
      { label: 'distant_trees', confidence: 0.91, box: [0.20, 0.40, 0.50, 0.90] },
    ],
    claimText: 'Erected 10 standalone 6-meter galvanized octagonal poles with integrated 40W Lumileds LED and 60Ah LiFePO4 battery pack.',
    modelVersion: 'eiil-vision-v2.4-solar',
  },

  // Item 6: Incomplete Evidence Bundle (MEDIUM RISK)
  {
    id: 'EVD-2026-4402',
    projectId: 'PRJ-PMGSY-AS-198',
    projectName: 'Brahmaputra Flood-Resilient Embankment Approach Road (Ch. 12+200)',
    scheme: 'PMGSY (Rural Roads)',
    ministry: 'Ministry of Rural Development',
    activityName: 'Slope Embankment Stabilization',
    stage: 'during',
    title: 'Geo-synthetic Woven Mattress Laying on River Embankment Slope',
    imageUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80',
    mimeType: 'image/jpeg',
    sizeBytes: 3410200,
    sha256: '2288001199a00cdb019280cdb9012a9e8802914109823ae8910012e882910bb3',
    capturedAt: '2026-08-23T11:15:20+05:30',
    uploadedAt: '2026-08-23T11:30:10+05:30',
    location: {
      lat: 26.2486,
      lng: 91.5222,
      accuracyMeters: 7.2,
      geofenceDistanceMeters: 55,
      siteCentroid: { lat: 26.2483, lng: 91.5218 },
      status: 'CONSISTENT',
      state: 'Assam',
      district: 'Kamrup',
      block: 'Hajo',
    },
    camera: {
      make: 'Motorola',
      model: 'Edge 40 Neo',
      software: 'Android 14 Cam',
      focalLength: '5.0mm (f/1.8)',
      iso: '100',
      exposure: '1/900s',
    },
    integrityScore: 58,
    riskLevel: 'MEDIUM',
    auditStatus: 'PENDING',
    reviewer: {
      assignedTo: 'Bhaskar Jyoti Barua (EE PWD Assam)',
    },
    fusionScores: {
      gps: 92,
      temporal: 85,
      duplicateRisk: 6,
      manipulationRisk: 8,
      claimMatch: 84,
      metadataIntegrity: 92,
      completeness: 40,
    },
    detectedAnomalies: [
      {
        id: 'ANOM-08',
        type: 'INCOMPLETE_EVIDENCE',
        severity: 'MEDIUM',
        confidence: 85.0,
        title: 'Evidence Bundle Incomplete: Missing Mandatory Stage-2 Toe Wall & Lab Test PDF',
        description: 'Under PMGSY Embankment Guideline IRC:SP:20, boulder toe wall cross-section photographs and third-party geotextile tensile lab certificates are mandatory prior to Stage-3 asphalt clearance.',
        supportingData: 'Missing artifacts: [toe_wall_cross_section, tensile_strength_lab_pdf]. Completeness score: 40/100.',
      },
    ],
    similarEvidenceMatches: [],
    detectedObjects: [
      { label: 'geotextile_fabric_slope', confidence: 0.93, box: [0.25, 0.10, 0.90, 0.90] },
      { label: 'embankment_earthwork', confidence: 0.89, box: [0.10, 0.05, 0.70, 0.50] },
    ],
    claimText: 'Laid 3200 sq.m of 400 GSM high-tenacity polypropylene woven geotextile fabric anchored with MS pins.',
    modelVersion: 'eiil-vision-v2.4-pmgsy',
  },
];

// 3. Audit Trail Event Ledger
export const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'AUD-9901',
    evidenceId: 'EVD-2026-9041',
    projectId: 'PRJ-JJM-RJ-108',
    actorName: 'EIIL-Fusion-Engine-v2.4',
    actorRole: 'AI Automated Auditor',
    action: 'FLAG_CRITICAL',
    previousState: 'RAW_INGESTED',
    newState: 'FLAGGED_CRITICAL',
    reason: 'Detected 94.7% perceptual & vector embedding similarity with historical record EVD-2025-1832 (Jodhpur district). High fraud risk.',
    sha256Hash: 'a8910bc47289012a9e8802914109823ae8910012e882910baef091a2244a8029',
    timestamp: '2026-08-25T11:45:12+05:30',
  },
  {
    id: 'AUD-9902',
    evidenceId: 'EVD-2026-7734',
    projectId: 'PRJ-SSA-UP-512',
    actorName: 'EIIL-Geospatial-Worker-v1.8',
    actorRole: 'AI Automated Auditor',
    action: 'FLAG_CRITICAL',
    previousState: 'RAW_INGESTED',
    newState: 'FLAGGED_HIGH',
    reason: 'Impossible travel anomaly: 48.4 km separation from preceding upload within 192 seconds (907 km/h implied speed).',
    sha256Hash: 'bc47289012a9e8802914109823ae8910012e882910baef091a2244a8029a8910',
    timestamp: '2026-08-26T10:06:08+05:30',
  },
  {
    id: 'AUD-9903',
    evidenceId: 'EVD-2026-8812',
    projectId: 'PRJ-PMGSY-MH-401',
    actorName: 'Rajesh Kulkarni (SE PWD)',
    actorRole: 'Evidence Reviewer',
    action: 'APPROVE',
    previousState: 'PENDING_REVIEW',
    newState: 'APPROVED',
    reason: 'Stage-3 physical inspection records and asphalt core compaction test report corroborate visual wearing coat quality. Geofence radius matched.',
    sha256Hash: '1102948caef198302bf029aa3c19e59d997a02c841bb28ff8390ab914028ce82',
    timestamp: '2026-08-21T10:15:00+05:30',
  },
  {
    id: 'AUD-9904',
    evidenceId: 'EVD-2026-5509',
    projectId: 'PRJ-SSA-OD-309',
    actorName: 'EIIL-Vision-Transformer-v2.1',
    actorRole: 'AI Automated Auditor',
    action: 'FLAG_CRITICAL',
    previousState: 'RAW_INGESTED',
    newState: 'FLAGGED_CRITICAL',
    reason: 'Semantic claim contradiction: Claimed 10 solar street light poles; detected fallow grassland with 0 luminaires or poles.',
    sha256Hash: 'cf819201928301928301928301928301928301928301928355bc9018283901ab',
    timestamp: '2026-08-26T15:52:21+05:30',
  },
];

