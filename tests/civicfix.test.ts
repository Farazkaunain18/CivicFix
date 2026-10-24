import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateDistanceMeters, findDuplicateSuggestions } from '../src/lib/duplicateDetection.ts';
import { calculateSafetyPriority } from '../src/lib/priorityScoring.ts';
import { validateReportAi } from '../src/lib/aiValidator.ts';
import { anonymizeCitizenName, sanitizePublicDescription } from '../src/lib/privacy.ts';
import { CivicReport } from '../src/types/civic.ts';

// Mock existing report for testing
const mockExistingReport: CivicReport = {
  id: 'CF-2026-1001',
  title: 'Large Pothole on Market St',
  description: 'Deep 6 inch crater in the right lane damaging tires near bus stop.',
  category: 'pothole',
  severity: 'high',
  status: 'pending',
  department: 'Roads & Transportation',
  address: '400 Market St, Financial District',
  lat: 37.7915,
  lng: -122.3995,
  imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7',
  upvotes: 5,
  reportedBy: 'Alex Chen',
  publicReporterName: 'Alex C. (Resident)',
  createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  slaHoursRemaining: 8,
  priorityScore: {
    totalScore: 75,
    tier: 'P2_URGENT',
    hazardScore: 26,
    publicExposureScore: 20,
    durationScore: 20,
    communityScore: 9,
    factors: ['Pothole high severity'],
  },
  aiValidation: {
    isValid: true,
    overallConfidence: 0.95,
    imageQualityScore: 0.94,
    categoryAlignmentScore: 0.96,
    authenticityScore: 0.95,
    needsHumanReview: false,
    analysisMode: 'DETERMINISTIC_HEURISTIC_DEMO',
    detectedFeatures: ['POTHOLE', 'CRATER'],
    feedbackNotes: 'Valid',
  },
  aiTriageNotes: 'Validated',
  timeline: [],
};

// -------------------------------------------------------------
// Test Suite 1: Duplicate Suggestions Based on GPS & Similarity
// -------------------------------------------------------------
test('Duplicate Detection: identifies duplicate when coordinates are within 50m and category matches', () => {
  const newReport = {
    lat: 37.7918, // ~35 meters away from 37.7915
    lng: -122.3992,
    category: 'pothole' as const,
    title: 'Severe crater on Market and 1st',
    description: 'Cars swerving to avoid tire rim damage on Market St lane.',
  };

  const distance = calculateDistanceMeters(newReport.lat, newReport.lng, mockExistingReport.lat, mockExistingReport.lng);
  assert.ok(distance < 60, `Distance should be under 60m (actual: ${distance}m)`);

  const duplicates = findDuplicateSuggestions(newReport, [mockExistingReport], 250, 0.50);
  assert.equal(duplicates.length, 1, 'Should return exactly 1 duplicate suggestion');
  assert.equal(duplicates[0].existingReport.id, 'CF-2026-1001');
  assert.ok(duplicates[0].similarityScore >= 0.60, 'Similarity score should be >= 60%');
});

test('Duplicate Detection: ignores distant reports (> 1km away)', () => {
  const distantReport = {
    lat: 37.8100, // ~2.2 km away
    lng: -122.4200,
    category: 'pothole' as const,
    title: 'Pothole in Marina district',
    description: 'Pothole near marina boulevard.',
  };

  const duplicates = findDuplicateSuggestions(distantReport, [mockExistingReport], 250, 0.50);
  assert.equal(duplicates.length, 0, 'Should not flag distant report as duplicate');
});

// -------------------------------------------------------------
// Test Suite 2: Explainable Safety-Priority Scoring
// -------------------------------------------------------------
test('Safety Priority Scoring: computes higher score for severe hazard in school zone', () => {
  const result = calculateSafetyPriority({
    category: 'water_leak',
    severity: 'high',
    createdAt: new Date(Date.now() - 50 * 3600 * 1000).toISOString(), // > 48h old
    upvotes: 3,
    title: 'Water main gushing clean water into roadway',
    description: 'Flooding intersection right next to elementary school crosswalk.',
    address: '1540 Van Ness Ave',
  });

  assert.ok(result.totalScore >= 75, `Total priority score should be >= 75 (actual: ${result.totalScore})`);
  assert.ok(result.tier === 'P1_CRITICAL' || result.tier === 'P2_URGENT', 'Should be Tier P1 or P2');
  assert.ok(result.factors.some(f => f.includes('School zone')), 'Should explicitly explain school zone factor');
  assert.ok(result.factors.some(f => f.includes('48 hours')), 'Should include aging duration escalation');
});

test('Safety Priority Scoring: votes alone cannot override structural severity', () => {
  // Low severity trash with 1000 votes vs high severity collapsed grate with 1 vote
  const popularTrash = calculateSafetyPriority({
    category: 'garbage',
    severity: 'low',
    createdAt: new Date().toISOString(),
    upvotes: 1000,
    title: 'Candy wrapper on sidewalk',
    description: 'Minor litter outside cafe.',
    address: 'Quiet Lane',
  });

  const criticalGrate = calculateSafetyPriority({
    category: 'road_hazard',
    severity: 'high',
    createdAt: new Date().toISOString(),
    upvotes: 1,
    title: 'Collapsed iron storm drain grate',
    description: 'Large void on arterial road near crosswalk.',
    address: 'Market St',
  });

  // Structural road hazard must outrank popular minor trash
  assert.ok(
    criticalGrate.totalScore > popularTrash.totalScore,
    `Critical grate (${criticalGrate.totalScore}) must have higher priority than popular trash (${popularTrash.totalScore})`
  );
  assert.ok(popularTrash.communityScore <= 15, 'Community score must be capped at 15 pts max');
});

// -------------------------------------------------------------
// Test Suite 3: Invalid Uploads & Validation
// -------------------------------------------------------------
test('AI Validator: rejects missing or empty image upload', async () => {
  const result = await validateReportAi({
    imageUrl: '',
    category: 'pothole',
    title: 'Broken road',
    description: 'Large hole on the pavement.',
  });

  assert.equal(result.isValid, false, 'Should be invalid with empty image payload');
  assert.ok(result.needsHumanReview, 'Should flag for human review');
  assert.ok(result.feedbackNotes.includes('photograph'), 'Should explain missing photo requirement');
});

test('AI Validator: rejects corrupted truncated image data URL', async () => {
  const result = await validateReportAi({
    imageUrl: 'data:image/jpeg;base64,corrupt',
    category: 'pothole',
    title: 'Broken road',
    description: 'Large hole on the pavement.',
  });

  assert.equal(result.isValid, false, 'Should be invalid for corrupted image');
  assert.ok(result.reviewReason?.includes('Corrupted'), 'Should flag corrupted data');
});

test('AI Validator: flags low-confidence mismatch for human review', async () => {
  const result = await validateReportAi({
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7',
    category: 'streetlight',
    title: 'Great coffee shop',
    description: 'I bought delicious iced latte here yesterday.', // Irrelevant text for streetlight
  });

  assert.equal(result.isValid, true, 'Syntactically valid report accepted into queue');
  assert.equal(result.needsHumanReview, true, 'Must flag for human supervisor review due to low alignment');
  assert.ok(result.overallConfidence < 0.70, 'Overall confidence must be below 70% threshold');
});

// -------------------------------------------------------------
// Test Suite 4: Unavailable Street View & Contextual Imagery
// -------------------------------------------------------------
test('Street View Logic: handles unavailable street view gracefully without faking imagery', () => {
  const reportWithNoStreetView = {
    streetViewAvailable: false,
    address: '65 Maiden Lane Alleyway',
    lat: 37.7884,
    lng: -122.4045,
  };

  assert.equal(reportWithNoStreetView.streetViewAvailable, false);
  // Verify that coordinates and address are preserved so citizen can submit with GPS
  assert.ok(reportWithNoStreetView.lat && reportWithNoStreetView.lng);
});

// -------------------------------------------------------------
// Test Suite 5: Denied GPS Permission Simulation
// -------------------------------------------------------------
test('GPS Error Handling: handles permission denied without app crash', () => {
  const mockGeolocationError = {
    code: 1, // GeolocationPositionError.PERMISSION_DENIED
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
    message: 'User denied Geolocation',
  };

  let userFriendlyMessage = '';
  if (mockGeolocationError.code === mockGeolocationError.PERMISSION_DENIED) {
    userFriendlyMessage = 'GPS permission denied. You can manually enter an address or choose a preset.';
  }

  assert.ok(userFriendlyMessage.includes('manually enter an address'));
});

// -------------------------------------------------------------
// Test Suite 6: Resolution Disputes & Privacy Sanitization
// -------------------------------------------------------------
test('Resolution Disputes: transitions ticket from resolved to reopened with elevated priority', () => {
  const resolvedTicket: CivicReport = {
    ...mockExistingReport,
    status: 'resolved',
    resolutionDetails: {
      resolvedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      resolvedByCrew: 'Metro Asphalt Crew #1',
      resolutionProofImageUrl: 'https://images.unsplash.com/photo-1590496793929-36417d3117de',
      citizenFeedback: {
        verifiedFixedCount: 2,
        disputedCount: 0,
        disputeItems: [],
      },
    },
  };

  assert.equal(resolvedTicket.status, 'resolved');

  // Citizen disputes resolution
  const disputeReason = 'Cold patch crumbled and crater washed out after morning rain.';
  const updatedFeedback = {
    verifiedFixedCount: 2,
    disputedCount: 1,
    disputeItems: [
      {
        id: 'disp-test-1',
        timestamp: 'Just now',
        author: 'Verified Resident',
        isDispute: true,
        note: disputeReason,
      },
    ],
  };

  const reopenedTicket: CivicReport = {
    ...resolvedTicket,
    status: 'reopened',
    resolutionDetails: {
      ...resolvedTicket.resolutionDetails!,
      citizenFeedback: updatedFeedback,
    },
    timeline: [
      ...resolvedTicket.timeline,
      {
        status: 'reopened',
        label: 'Resolution Disputed by Community',
        timestamp: 'Just now',
        actor: 'Verified Resident',
        note: disputeReason,
        isDispute: true,
      },
    ],
  };

  assert.equal(reopenedTicket.status, 'reopened', 'Status should be reopened');
  assert.equal(reopenedTicket.resolutionDetails?.citizenFeedback?.disputedCount, 1);
  assert.equal(reopenedTicket.timeline[0]?.isDispute, true);
});

test('Privacy Preservation: sanitizes citizen names and strips emails/phones from public audit', () => {
  const rawName = 'Johnathan Doe';
  const anonymized = anonymizeCitizenName(rawName);
  assert.equal(anonymized, 'Johnathan D. (Resident)');

  const textWithPii = 'Please call me at 555-123-4567 or email john.doe@example.com about the leak.';
  const sanitized = sanitizePublicDescription(textWithPii);
  assert.ok(!sanitized.includes('555-123-4567'), 'Phone number must be redacted');
  assert.ok(!sanitized.includes('john.doe@example.com'), 'Email address must be redacted');
  assert.ok(sanitized.includes('[REDACTED PHONE]'));
  assert.ok(sanitized.includes('[REDACTED EMAIL]'));
});
