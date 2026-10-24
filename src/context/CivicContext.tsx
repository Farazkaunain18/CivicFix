"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  CivicReport,
  CivicStats,
  IssueStatus,
  AiValidationResult,
  PriorityScoreBreakdown,
  DuplicateSuggestion,
} from "@/types/civic";
import { INITIAL_REPORTS } from "@/data/mockReports";
import { calculateSafetyPriority } from "@/lib/priorityScoring";
import { validateReportAi } from "@/lib/aiValidator";
import { findDuplicateSuggestions } from "@/lib/duplicateDetection";
import { anonymizeCitizenName, sanitizePublicDescription } from "@/lib/privacy";
import { detectRecurringIssues } from "@/lib/recurringDetection";
import { recordSubmission, checkRateLimit } from "@/lib/rateLimitAndDrafts";
import { isWithinIndia } from "@/lib/indiaGeo";

interface ToastNotification {
  id: string;
  type: "success" | "info" | "warning";
  title: string;
  message: string;
}

interface CivicContextType {
  reports: CivicReport[];
  stats: CivicStats;
  addReport: (newReport: {
    title: string;
    description: string;
    category: CivicReport["category"];
    severity: CivicReport["severity"];
    department: CivicReport["department"];
    address: string;
    lat: number;
    lng: number;
    imageUrl: string;
    reportedBy?: string;
    userId?: string;
    userRole?: 'citizen' | 'admin';
    indianAddressDetails?: {
      street: string;
      city: string;
      district: string;
      state: string;
      pincode: string;
    };
    gpsAccuracy?: number;
    capturedTimestamp?: string;
    confirmedByCitizen?: boolean;
    streetViewAvailable?: boolean;
    streetViewPanoId?: string;
    streetViewDate?: string;
    aiValidation?: AiValidationResult;
  }) => Promise<CivicReport>;
  supportExistingReport: (id: string, note?: string) => void;
  updateReportStatus: (
    id: string,
    status: IssueStatus,
    crew?: string,
    resolutionNote?: string,
    resolutionProofImageUrl?: string
  ) => void;
  verifyOrDisputeResolution: (id: string, isDispute: boolean, note?: string) => void;
  approveReviewTicket: (id: string) => void;
  upvoteReport: (id: string) => void;
  checkDuplicates: (
    lat: number,
    lng: number,
    category: CivicReport["category"],
    title: string,
    description: string,
    imageUrl?: string
  ) => DuplicateSuggestion[];
  resetToMockData: () => void;
  toast: ToastNotification | null;
  clearToast: () => void;
  showToast: (title: string, message: string, type?: "success" | "info" | "warning") => void;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

const STORAGE_KEY = "civicfix_reports_data_v2";

export function CivicProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<CivicReport[]>(INITIAL_REPORTS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReports(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load reports from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
      } catch (e) {
        console.warn("Failed to save reports to localStorage", e);
      }
    }
  }, [reports, isLoaded]);

  const showToast = (
    title: string,
    message: string,
    type: "success" | "info" | "warning" = "success"
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, type, title, message });

    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4500);
  };

  const clearToast = () => setToast(null);

  const checkDuplicates = (
    lat: number,
    lng: number,
    category: CivicReport["category"],
    title: string,
    description: string,
    imageUrl?: string
  ): DuplicateSuggestion[] => {
    return findDuplicateSuggestions(
      { lat, lng, category, title, description, imageUrl },
      reports
    );
  };

  const addReport = async (newReportData: {
    title: string;
    description: string;
    category: CivicReport["category"];
    severity: CivicReport["severity"];
    department: CivicReport["department"];
    address: string;
    lat: number;
    lng: number;
    imageUrl: string;
    reportedBy?: string;
    userId?: string;
    userRole?: 'citizen' | 'admin';
    indianAddressDetails?: {
      street: string;
      city: string;
      district: string;
      state: string;
      pincode: string;
    };
    gpsAccuracy?: number;
    capturedTimestamp?: string;
    confirmedByCitizen?: boolean;
    streetViewAvailable?: boolean;
    streetViewPanoId?: string;
    streetViewDate?: string;
    aiValidation?: AiValidationResult;
  }): Promise<CivicReport> => {
    // Validate India Geographic Boundary
    if (!isWithinIndia(newReportData.lat, newReportData.lng)) {
      showToast(
        "Location Outside India",
        `CivicFix operates exclusively within India. Detected coordinates (${newReportData.lat.toFixed(4)}, ${newReportData.lng.toFixed(4)}) are outside India's geographic boundary.`,
        "warning"
      );
      throw new Error(`Coordinates (${newReportData.lat.toFixed(4)}, ${newReportData.lng.toFixed(4)}) are outside the sovereign territory of India.`);
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `CF-2026-${randomSuffix}`;
    const nowIso = new Date().toISOString();
    const rawReporter = newReportData.reportedBy || "Local Resident";
    const publicName = anonymizeCitizenName(rawReporter);
    const sanitizedDescription = sanitizePublicDescription(newReportData.description);

    // Recurring Issue Detection
    const recurrence = detectRecurringIssues(
      {
        lat: newReportData.lat,
        lng: newReportData.lng,
        category: newReportData.category,
      },
      reports
    );

    // AI-Assisted Validation
    const validationResult =
      newReportData.aiValidation ||
      (await validateReportAi({
        imageUrl: newReportData.imageUrl,
        category: newReportData.category,
        title: newReportData.title,
        description: sanitizedDescription,
      }));

    // Explainable Safety-Priority Score
    const priority = calculateSafetyPriority({
      category: newReportData.category,
      severity: newReportData.severity,
      createdAt: nowIso,
      upvotes: 1,
      title: newReportData.title,
      description: sanitizedDescription,
      address: newReportData.address,
      isRecurring: recurrence.isRecurring,
    });

    const slaHours =
      priority.tier === "P1_CRITICAL"
        ? 6
        : priority.tier === "P2_URGENT"
        ? 14
        : priority.tier === "P3_STANDARD"
        ? 28
        : 48;

    // Route to human review if validation confidence is low or flagged
    const initialStatus: IssueStatus = validationResult.needsHumanReview
      ? "review_needed"
      : "pending";

    const fullReport: CivicReport = {
      ...newReportData,
      description: sanitizedDescription,
      id: newId,
      status: initialStatus,
      upvotes: 1,
      hasUpvoted: true,
      reportedBy: rawReporter,
      publicReporterName: publicName,
      createdAt: nowIso,
      updatedAt: nowIso,
      capturedTimestamp: newReportData.capturedTimestamp || nowIso,
      confirmedByCitizen: newReportData.confirmedByCitizen ?? true,
      slaHoursRemaining: slaHours,
      isRecurring: recurrence.isRecurring,
      recurrenceCount: recurrence.recurrenceCount,
      recurrenceNotes: recurrence.recurrenceNotes,
      recurrenceHistory: recurrence.recurrenceHistory,
      priorityScore: priority,
      aiValidation: validationResult,
      aiTriageNotes: validationResult.feedbackNotes,
      timeline: [
        {
          status: initialStatus,
          label: "Incident Registered & GPS Locked",
          timestamp: "Just now",
          actor: publicName,
          note: `Device GPS accuracy ${newReportData.gpsAccuracy ? `±${newReportData.gpsAccuracy}m` : 'confirmed'}.`,
        },
        ...(recurrence.isRecurring
          ? [
              {
                status: initialStatus,
                label: `Chronic Defect Flagged (Occurrence #${recurrence.recurrenceCount})`,
                timestamp: "Just now",
                actor: "CivicFix Recurrence Engine",
                note: recurrence.recurrenceNotes || "Chronic failure detected within 80m radius.",
              },
            ]
          : []),
        {
          status: initialStatus,
          label: validationResult.needsHumanReview
            ? "AI Flagged for Human Supervisor Review"
            : `AI Validated & Priority Scored: ${priority.tier}`,
          timestamp: "Just now",
          actor: "CivicFix AI Validation Engine",
          note: validationResult.needsHumanReview
            ? validationResult.reviewReason || "Confidence below 70% threshold. Routed to Supervisor queue."
            : `Safety Priority Score: ${priority.totalScore}/100 (${priority.tier.replace('_', ' ')}). Auto-routed to ${newReportData.department}.`,
        },
      ],
    };

    setReports((prev) => [fullReport, ...prev]);

    // Record rate limit timestamp
    recordSubmission();

    if (validationResult.needsHumanReview) {
      showToast(
        "Report Logged for Review",
        `Ticket #${fullReport.id} flagged for supervisor intake review (${Math.round(validationResult.overallConfidence * 100)}% AI confidence).`,
        "warning"
      );
    } else {
      showToast(
        recurrence.isRecurring ? "Chronic Recurrence Triaged!" : "Report Submitted & Triaged!",
        `Ticket #${fullReport.id} routed to ${fullReport.department} with ${priority.tier.replace('_', ' ')} priority.${recurrence.isRecurring ? ' (Recurring Defect Escalation applied)' : ''}`,
        recurrence.isRecurring ? "warning" : "success"
      );
    }

    return fullReport;

    return fullReport;
  };

  const supportExistingReport = (id: string, note?: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        const newUpvotes = r.upvotes + 1;
        const now = new Date().toISOString();

        // Recalculate priority with new corroboration
        const updatedPriority = calculateSafetyPriority({
          category: r.category,
          severity: r.severity,
          createdAt: r.createdAt,
          upvotes: newUpvotes,
          title: r.title,
          description: r.description,
          address: r.address,
        });

        const updatedTimeline = [
          ...(r.timeline || []),
          {
            status: r.status,
            label: "Additional Citizen Corroboration (+1 Confirmed)",
            timestamp: "Just now",
            actor: "Community Resident",
            note: note || "Resident corroborated existing open defect instead of creating duplicate ticket.",
          },
        ];

        return {
          ...r,
          upvotes: newUpvotes,
          hasUpvoted: true,
          updatedAt: now,
          priorityScore: updatedPriority,
          timeline: updatedTimeline,
        };
      })
    );

    showToast(
      "Existing Incident Corroborated!",
      `Added your support to Ticket #${id}. Municipal priority escalated!`,
      "success"
    );
  };

  const updateReportStatus = (
    id: string,
    newStatus: IssueStatus,
    crew?: string,
    resolutionNote?: string,
    resolutionProofImageUrl?: string
  ) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        const now = new Date().toISOString();
        const updatedTimeline = [...(r.timeline || [])];

        let eventLabel = "Status Updated";
        if (newStatus === "in_progress") {
          eventLabel = `Maintenance Crew Dispatched: ${crew || "Rapid Response Team"}`;
        } else if (newStatus === "resolved") {
          eventLabel = "Repair Completed with Resolution Proof";
        } else if (newStatus === "reopened") {
          eventLabel = "Resolution Disputed & Reopened";
        } else if (newStatus === "pending") {
          eventLabel = "Approved from Review to Dispatch Queue";
        }

        updatedTimeline.push({
          status: newStatus,
          label: eventLabel,
          timestamp: "Just now",
          actor: crew || "Municipal Dispatch Operations",
          note: resolutionNote || (crew ? `Assigned to ${crew}` : undefined),
        });

        const createdMs = new Date(r.createdAt).getTime();
        const repairHours = Math.max(1, Math.round((Date.now() - createdMs) / (1000 * 3600)));

        const resolutionDetails =
          newStatus === "resolved"
            ? {
                resolvedAt: now,
                resolvedByCrew: crew || r.assignedCrew || "Municipal Field Unit",
                resolutionNote: resolutionNote || "Field repair verified completed according to city infrastructure standards.",
                resolutionProofImageUrl:
                  resolutionProofImageUrl ||
                  r.resolutionDetails?.resolutionProofImageUrl ||
                  "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
                repairDurationHours: repairHours,
                citizenFeedback: r.resolutionDetails?.citizenFeedback || {
                  verifiedFixedCount: 1,
                  disputedCount: 0,
                  hasUserVerified: false,
                  hasUserDisputed: false,
                  disputeItems: [],
                },
              }
            : r.resolutionDetails;

        return {
          ...r,
          status: newStatus,
          updatedAt: now,
          assignedCrew: crew || r.assignedCrew,
          slaHoursRemaining: newStatus === "resolved" ? 0 : r.slaHoursRemaining,
          resolutionDetails,
          timeline: updatedTimeline,
        };
      })
    );

    showToast(
      "Ticket Status Updated",
      `Ticket #${id} moved to ${newStatus.replace("_", " ").toUpperCase()}`,
      "info"
    );
  };

  const verifyOrDisputeResolution = (id: string, isDispute: boolean, note?: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        const currentFb = r.resolutionDetails?.citizenFeedback || {
          verifiedFixedCount: 0,
          disputedCount: 0,
          hasUserVerified: false,
          hasUserDisputed: false,
          disputeItems: [],
        };

        const now = new Date().toISOString();
        const updatedTimeline = [...(r.timeline || [])];

        if (isDispute) {
          // Citizen is disputing the fix
          const newDisputeCount = currentFb.disputedCount + 1;
          const disputeItem = {
            id: `disp-${Date.now()}`,
            timestamp: "Just now",
            author: "Local Citizen (Verified)",
            isDispute: true,
            note: note || "Citizen reported repair failed or incomplete.",
          };

          updatedTimeline.push({
            status: "reopened",
            label: "Resolution Disputed by Community",
            timestamp: "Just now",
            actor: "Community Resident",
            note: disputeItem.note,
            isDispute: true,
          });

          // Recalculate priority to elevated P1/P2 because of resolution failure
          const escalatedPriority = calculateSafetyPriority({
            category: r.category,
            severity: "high", // Escalate
            createdAt: r.createdAt,
            upvotes: r.upvotes + 5,
            title: r.title,
            description: `${r.description} [REOPENED DISPUTE: ${note || 'Repair failure'}]`,
            address: r.address,
          });

          return {
            ...r,
            status: "reopened",
            updatedAt: now,
            priorityScore: escalatedPriority,
            slaHoursRemaining: 8, // Urgent SLA for reopened issues
            resolutionDetails: {
              ...(r.resolutionDetails || { resolvedAt: now }),
              citizenFeedback: {
                ...currentFb,
                disputedCount: newDisputeCount,
                hasUserDisputed: true,
                disputeItems: [disputeItem, ...(currentFb.disputeItems || [])],
              },
            },
            timeline: updatedTimeline,
          };
        } else {
          // Citizen verified fix is successful
          updatedTimeline.push({
            status: "resolved",
            label: "Citizen Community Verification",
            timestamp: "Just now",
            actor: "Neighborhood Resident",
            note: "Confirmed physical repair successfully verified on-site.",
          });

          return {
            ...r,
            updatedAt: now,
            resolutionDetails: {
              ...(r.resolutionDetails || { resolvedAt: now }),
              citizenFeedback: {
                ...currentFb,
                verifiedFixedCount: currentFb.verifiedFixedCount + 1,
                hasUserVerified: true,
              },
            },
            timeline: updatedTimeline,
          };
        }
      })
    );

    if (isDispute) {
      showToast(
        "Resolution Disputed",
        `Ticket #${id} reopened for municipal reinspection.`,
        "warning"
      );
    } else {
      showToast(
        "Verification Recorded",
        `Thank you for confirming the repair for Ticket #${id}!`,
        "success"
      );
    }
  };

  const approveReviewTicket = (id: string) => {
    updateReportStatus(id, "pending", undefined, "Supervisor approved AI-flagged ticket for dispatch.");
  };

  const upvoteReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const willBeUpvoted = !r.hasUpvoted;
        const newUpvotes = willBeUpvoted ? r.upvotes + 1 : Math.max(0, r.upvotes - 1);

        const updatedPriority = calculateSafetyPriority({
          category: r.category,
          severity: r.severity,
          createdAt: r.createdAt,
          upvotes: newUpvotes,
          title: r.title,
          description: r.description,
          address: r.address,
        });

        return {
          ...r,
          hasUpvoted: willBeUpvoted,
          upvotes: newUpvotes,
          priorityScore: updatedPriority,
        };
      })
    );
  };

  const resetToMockData = () => {
    setReports(INITIAL_REPORTS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
    } catch (e) {}
    showToast("Data Reset", "Reset reports to initial showcase state", "info");
  };

  const stats = useMemo<CivicStats>(() => {
    const total = reports.length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const inProgress = reports.filter((r) => r.status === "in_progress").length;
    const pending = reports.filter((r) => r.status === "pending").length;
    const reviewNeeded = reports.filter((r) => r.status === "review_needed").length;
    const reopened = reports.filter((r) => r.status === "reopened").length;

    return {
      totalReports: total + 1480,
      resolvedReports: resolved + 1285,
      inProgressReports: inProgress + 140,
      pendingReports: pending + 55,
      reviewNeededReports: reviewNeeded,
      reopenedReports: reopened,
      activeCitizens: 8642 + total * 3,
      avgResolutionHours: 4.2,
    };
  }, [reports]);

  return (
    <CivicContext.Provider
      value={{
        reports,
        stats,
        addReport,
        supportExistingReport,
        updateReportStatus,
        verifyOrDisputeResolution,
        approveReviewTicket,
        upvoteReport,
        checkDuplicates,
        resetToMockData,
        toast,
        clearToast,
        showToast,
      }}
    >
      {children}
    </CivicContext.Provider>
  );
}

export function useCivic() {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error("useCivic must be used within a CivicProvider");
  }
  return context;
}
