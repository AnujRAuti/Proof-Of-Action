/**
 * Geo Engine — GPS & Geofence Validation
 *
 * Validates whether evidence GPS coordinates are spatially consistent
 * with the registered project site using Haversine distance calculation.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GeoInput {
  evidenceLat: number | null;
  evidenceLng: number | null;
  gpsAccuracyM: number | null;
  projectCentroidLat: number;
  projectCentroidLng: number;
  geofenceRadiusM: number;
  otherEvidenceLocations?: { lat: number; lng: number; id: string }[];
}

export interface GeoAnomaly {
  type: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface GeoResult {
  score: number;
  distanceFromCentroidM: number | null;
  isInsideGeofence: boolean | null;
  gpsAccuracyOk: boolean | null;
  spatialConsistency: number | null;
  anomalies: GeoAnomaly[];
}

// ─── Haversine ───────────────────────────────────────────────────────────────

const EARTH_RADIUS_M = 6_371_000;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Haversine distance in meters between two lat/lng points. */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Engine ──────────────────────────────────────────────────────────────────

export async function analyzeGeo(params: GeoInput): Promise<GeoResult> {
  const anomalies: GeoAnomaly[] = [];

  // No GPS data at all
  if (params.evidenceLat == null || params.evidenceLng == null) {
    anomalies.push({
      type: 'LOCATION_MISMATCH',
      description: 'Evidence has no GPS coordinates — location cannot be verified.',
      severity: 'HIGH',
    });
    return {
      score: 0,
      distanceFromCentroidM: null,
      isInsideGeofence: null,
      gpsAccuracyOk: null,
      spatialConsistency: null,
      anomalies,
    };
  }

  // Distance from project centroid
  const distanceM = haversineDistance(
    params.evidenceLat,
    params.evidenceLng,
    params.projectCentroidLat,
    params.projectCentroidLng
  );

  const isInsideGeofence = distanceM <= params.geofenceRadiusM;

  // GPS accuracy check
  const gpsAccuracyOk =
    params.gpsAccuracyM != null ? params.gpsAccuracyM <= 500 : null;

  if (params.gpsAccuracyM != null && params.gpsAccuracyM > 500) {
    anomalies.push({
      type: 'METADATA_ANOMALY',
      description: `GPS accuracy is ${Math.round(params.gpsAccuracyM)}m — exceeds 500m threshold, location unreliable.`,
      severity: params.gpsAccuracyM > 2000 ? 'HIGH' : 'MEDIUM',
    });
  }

  // Geofence violation
  if (!isInsideGeofence) {
    const distKm = (distanceM / 1000).toFixed(1);
    const severity: GeoAnomaly['severity'] =
      distanceM > 50_000 ? 'CRITICAL' : distanceM > 10_000 ? 'HIGH' : 'MEDIUM';
    anomalies.push({
      type: 'LOCATION_MISMATCH',
      description: `GPS location is ${distKm} km from registered project site (geofence radius: ${params.geofenceRadiusM}m).`,
      severity,
    });
  }

  // Spatial consistency with other evidence
  let spatialConsistency: number | null = null;
  if (params.otherEvidenceLocations && params.otherEvidenceLocations.length > 0) {
    const distances = params.otherEvidenceLocations.map((loc) =>
      haversineDistance(params.evidenceLat!, params.evidenceLng!, loc.lat, loc.lng)
    );
    const avgDistM = distances.reduce((a, b) => a + b, 0) / distances.length;

    // Within 2km of other evidence = consistent
    if (avgDistM <= 2000) spatialConsistency = 100;
    else if (avgDistM <= 10_000) spatialConsistency = Math.max(0, 100 - ((avgDistM - 2000) / 8000) * 80);
    else spatialConsistency = Math.max(0, 20 - ((avgDistM - 10_000) / 50_000) * 20);

    if (avgDistM > 10_000) {
      anomalies.push({
        type: 'LOCATION_MISMATCH',
        description: `Evidence location is ${(avgDistM / 1000).toFixed(1)} km from other evidence for this project — spatially inconsistent.`,
        severity: 'HIGH',
      });
    }
  }

  // Score calculation
  let score = 100;

  // Distance penalty
  if (!isInsideGeofence) {
    const ratio = distanceM / params.geofenceRadiusM;
    score -= Math.min(60, ratio * 10);
  }

  // GPS accuracy penalty
  if (params.gpsAccuracyM != null && params.gpsAccuracyM > 500) {
    score -= Math.min(20, (params.gpsAccuracyM - 500) / 100);
  }

  // Spatial consistency penalty
  if (spatialConsistency != null && spatialConsistency < 50) {
    score -= 20;
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    distanceFromCentroidM: Math.round(distanceM),
    isInsideGeofence,
    gpsAccuracyOk,
    spatialConsistency: spatialConsistency != null ? Math.round(spatialConsistency) : null,
    anomalies,
  };
}
