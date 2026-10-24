export type IssueCategory =
  | 'pothole'
  | 'streetlight'
  | 'garbage'
  | 'water_leak'
  | 'road_hazard'
  | 'other';

export type IssueSeverity = 'high' | 'medium' | 'low';

export type IssueStatus =
  | 'pending'
  | 'in_progress'
  | 'resolved'
  | 'review_needed'
  | 'reopened';

export type CivicDepartment =
  | 'Roads & Transportation'
  | 'Sanitation & Waste'
  | 'Electrical & Lighting'
  | 'Water & Sewerage'
  | 'Public Safety';

export type PriorityTier =
  | 'P1_CRITICAL'
  | 'P2_URGENT'
  | 'P3_STANDARD'
  | 'P4_ROUTINE';

export interface PriorityScoreBreakdown {
  totalScore: number; // 1-100
  tier: PriorityTier;
  hazardScore: number; // Base structural hazard (max 35)
  publicExposureScore: number; // School zone, arterial road, pedestrian traffic (max 20)
  vulnerableRoadUserScore: number; // Pedestrians, cyclists, wheelchairs, blind corners (max 15)
  durationScore: number; // Escalation as days go unresolved (max 20)
  communityScore: number; // Corroboration points with log curve (max 10)
  recurrenceScore?: number; // Chronic recurring defect penalty (max 10)
  factors: string[];
}

export interface AiValidationResult {
  isValid: boolean;
  overallConfidence: number; // 0.0 to 1.0
  categoryConfidence?: number; // 0.0 to 1.0
  severityConfidence?: number; // 0.0 to 1.0
  suggestedCategory?: IssueCategory;
  suggestedSeverity?: IssueSeverity;
  imageQualityScore: number; // 0.0 to 1.0
  categoryAlignmentScore: number; // 0.0 to 1.0
  authenticityScore: number; // 0.0 to 1.0
  needsHumanReview: boolean;
  reviewReason?: string;
  analysisMode: 'GEMINI_MULTIMODAL' | 'DETERMINISTIC_HEURISTIC_DEMO';
  detectedFeatures: string[];
  feedbackNotes: string;
}

export interface ResolutionFeedbackItem {
  id: string;
  timestamp: string;
  author: string;
  isDispute: boolean;
  note: string;
}

export interface ResolutionDetails {
  resolvedAt: string;
  resolvedByCrew?: string;
  resolutionProofImageUrl?: string; // After photo
  resolutionNote?: string;
  repairDurationHours?: number;
  citizenFeedback?: {
    verifiedFixedCount: number;
    disputedCount: number;
    hasUserVerified?: boolean;
    hasUserDisputed?: boolean;
    disputeItems?: ResolutionFeedbackItem[];
  };
}

export interface CivicTimelineItem {
  status: IssueStatus;
  label: string;
  timestamp: string;
  actor?: string; // e.g. "Citizen Alex C.", "Municipal Dispatch", "Field Crew Alpha"
  note?: string;
  isDispute?: boolean;
}

export interface CivicReport {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  department: CivicDepartment;
  address: string;
  lat: number;
  lng: number;
  gpsAccuracy?: number; // GPS accuracy in meters
  capturedTimestamp?: string; // ISO string when photo & coordinates were captured
  confirmedByCitizen?: boolean;
  streetViewAvailable?: boolean;
  streetViewPanoId?: string;
  streetViewDate?: string; // Captured date of Street View imagery
  imageUrl: string; // Citizen-uploaded / camera-captured photo (Before Photo)
  upvotes: number;
  hasUpvoted?: boolean;
  reportedBy: string; // Internal name
  userId?: string; // Authenticated user ID
  userRole?: 'citizen' | 'admin';
  indianAddressDetails?: {
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  publicReporterName: string; // Privacy-anonymized name e.g. "Alex C. (Resident)"
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  slaHoursRemaining: number;
  assignedCrew?: string;
  isRecurring?: boolean;
  recurrenceCount?: number;
  recurrenceNotes?: string;
  recurrenceHistory?: {
    id: string;
    resolvedDate: string;
    category: IssueCategory;
    summary: string;
    daysSince: number;
  }[];
  resolutionDetails?: ResolutionDetails;
  priorityScore: PriorityScoreBreakdown;
  aiValidation: AiValidationResult;
  aiTriageNotes: string;
  timeline: CivicTimelineItem[];
}

export interface DuplicateSuggestion {
  existingReport: CivicReport;
  distanceMeters: number;
  similarityScore: number; // 0.0 to 1.0
  imageSimilarityScore?: number; // 0.0 to 1.0
  reasons: string[];
}

export interface OfflineDraftReport {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  lat: number;
  lng: number;
  address: string;
  imageUrl: string;
  savedAt: string;
  voiceTranscript?: string;
}

export interface RateLimitStatus {
  allowed: boolean;
  reportsSubmittedInWindow: number;
  maxReportsAllowed: number;
  windowMinutes: number;
  secondsRemaining: number;
}

export interface DepartmentMetric {
  department: CivicDepartment;
  openCount: number;
  resolvedCount: number;
  mttrHours: number;
  slaAdherencePercent: number;
}

export interface MunicipalPerformanceData {
  mttrHours: number;
  resolutionRatePercent: number;
  slaCompliancePercent: number;
  recurringDefectRatePercent: number;
  disputeRatePercent: number;
  departmentMetrics: DepartmentMetric[];
  trendByDay: {
    day: string;
    opened: number;
    resolved: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
    recurring: number;
  }[];
}

export interface CivicStats {
  totalReports: number;
  resolvedReports: number;
  inProgressReports: number;
  pendingReports: number;
  reviewNeededReports: number;
  reopenedReports: number;
  activeCitizens: number;
  avgResolutionHours: number;
  recurringCount?: number;
}
