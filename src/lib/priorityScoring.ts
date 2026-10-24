import { IssueCategory, IssueSeverity, PriorityScoreBreakdown, PriorityTier } from '../types/civic';

export function calculateSafetyPriority(params: {
  category: IssueCategory;
  severity: IssueSeverity;
  createdAt: string;
  upvotes: number;
  title: string;
  description: string;
  address: string;
  isRecurring?: boolean;
}): PriorityScoreBreakdown {
  const { category, severity, createdAt, upvotes, title, description, address, isRecurring } = params;
  const factors: string[] = [];

  // 1. Hazard Score (max 35)
  const categoryBase: Record<IssueCategory, number> = {
    water_leak: 32,
    road_hazard: 30,
    pothole: 26,
    streetlight: 20,
    garbage: 16,
    other: 14,
  };

  const severityMultiplier: Record<IssueSeverity, number> = {
    high: 1.0,
    medium: 0.75,
    low: 0.5,
  };

  const baseHazard = categoryBase[category] || 20;
  const multiplier = severityMultiplier[severity] || 0.75;
  const hazardScore = Math.min(35, Math.max(5, Math.round(baseHazard * multiplier)));
  factors.push(`${category.replace('_', ' ').toUpperCase()} base defect with ${severity.toUpperCase()} severity (+${hazardScore} pts)`);

  // 2. Public Exposure Score (max 20)
  const textCorpus = `${title} ${description} ${address}`.toLowerCase();
  let exposureScore = 4; // Baseline exposure

  if (textCorpus.includes('hospital') || textCorpus.includes('ambulance') || textCorpus.includes('emergency')) {
    exposureScore += 10;
    factors.push('Emergency hospital transit corridor (+10 pts)');
  }
  if (textCorpus.includes('arterial') || textCorpus.includes('highway') || textCorpus.includes('market st') || textCorpus.includes('van ness') || textCorpus.includes('bus') || textCorpus.includes('transit')) {
    exposureScore += 8;
    factors.push('High-volume arterial roadway / transit line (+8 pts)');
  }
  if (textCorpus.includes('downtown') || textCorpus.includes('commercial') || textCorpus.includes('plaza')) {
    exposureScore += 5;
    factors.push('High-density urban commercial area (+5 pts)');
  }

  const publicExposureScore = Math.min(20, exposureScore);

  // 3. Vulnerable Road Users (VRUs) Protection Score (max 15)
  let vruScore = 0;
  if (textCorpus.includes('school') || textCorpus.includes('elementary') || textCorpus.includes('kindergarten') || textCorpus.includes('playground') || textCorpus.includes('children')) {
    vruScore += 8;
    factors.push('VRU: School / playground zone protecting children (+8 pts)');
  }
  if (textCorpus.includes('crosswalk') || textCorpus.includes('zebra') || textCorpus.includes('pedestrian')) {
    vruScore += 5;
    factors.push('VRU: Pedestrian designated crossing (+5 pts)');
  }
  if (textCorpus.includes('bike') || textCorpus.includes('cyclist') || textCorpus.includes('cycle lane')) {
    vruScore += 5;
    factors.push('VRU: Active bicycle transit lane (+5 pts)');
  }
  if (textCorpus.includes('wheelchair') || textCorpus.includes('ramp') || textCorpus.includes('ada') || textCorpus.includes('curb cut') || textCorpus.includes('senior')) {
    vruScore += 6;
    factors.push('VRU: Wheelchair ramp / senior accessibility route (+6 pts)');
  }

  const vulnerableRoadUserScore = Math.min(15, vruScore);

  // 4. Duration Score (max 20) - Escalates automatically over time
  const elapsedMs = Math.max(0, Date.now() - new Date(createdAt).getTime());
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  let durationScore = 3;

  if (elapsedHours > 96) {
    durationScore = 20;
    factors.push('Neglected incident > 96 hours (+20 pts escalation)');
  } else if (elapsedHours > 48) {
    durationScore = 15;
    factors.push('Unaddressed for > 48 hours (+15 pts escalation)');
  } else if (elapsedHours > 24) {
    durationScore = 10;
    factors.push('Unaddressed for > 24 hours (+10 pts)');
  } else if (elapsedHours > 6) {
    durationScore = 6;
    factors.push('Active queue duration 6-24 hours (+6 pts)');
  } else {
    durationScore = 3;
    factors.push('Recently logged (< 6 hours, +3 pts)');
  }

  // 5. Community Corroboration Score (max 10) - Logarithmic curve prevents viral vote takeover
  const safeUpvotes = Math.max(0, upvotes);
  const communityScore = Math.min(10, Math.round(Math.log2(safeUpvotes + 1) * 2));
  factors.push(`Community corroboration (${safeUpvotes} confirms, +${communityScore} pts)`);

  // 6. Recurrence Penalty (max 10) - Repeated failures indicate structural breakdown
  let recurrenceScore = 0;
  if (isRecurring) {
    recurrenceScore = 10;
    factors.push('⚠️ Chronic infrastructure recurrence (+10 pts structural escalation)');
  }

  const totalScore = Math.min(100, Math.max(1, hazardScore + publicExposureScore + vulnerableRoadUserScore + durationScore + communityScore + recurrenceScore));

  let tier: PriorityTier = 'P3_STANDARD';
  if (totalScore >= 80) tier = 'P1_CRITICAL';
  else if (totalScore >= 60) tier = 'P2_URGENT';
  else if (totalScore >= 40) tier = 'P3_STANDARD';
  else tier = 'P4_ROUTINE';

  return {
    totalScore,
    tier,
    hazardScore,
    publicExposureScore,
    vulnerableRoadUserScore,
    durationScore,
    communityScore,
    recurrenceScore,
    factors,
  };
}
