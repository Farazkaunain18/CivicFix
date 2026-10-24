"use client";

import React from "react";
import { CivicReport } from "@/types/civic";
import { useCivic } from "@/context/CivicContext";
import GoogleStreetViewPanorama from "@/components/GoogleStreetViewPanorama";
import PriorityScoreBadge from "@/components/PriorityScoreBadge";
import ResolutionVerificationCard from "@/components/ResolutionVerificationCard";
import ReportTimeline from "@/components/ReportTimeline";
import {
  X,
  MapPin,
  Clock,
  ThumbsUp,
  Building2,
  Wrench,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck,
  UserCheck,
  RotateCcw,
} from "lucide-react";

interface ReportDetailModalProps {
  report: CivicReport | null;
  onClose: () => void;
}

export default function ReportDetailModal({
  report,
  onClose,
}: ReportDetailModalProps) {
  const { upvoteReport, approveReviewTicket } = useCivic();

  if (!report) return null;

  const severityColor =
    report.severity === "high"
      ? "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20"
      : report.severity === "medium"
      ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
      : "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

  const statusColor =
    report.status === "resolved"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      : report.status === "in_progress"
      ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
      : report.status === "review_needed"
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      : report.status === "reopened"
      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      : "bg-slate-500/10 text-slate-400 border-slate-500/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[92vh] overflow-y-auto text-slate-900 dark:text-slate-100">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
              #{report.id}
            </span>
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${statusColor} capitalize`}
            >
              {report.status.replace("_", " ")}
            </span>
            <span
              className={`px-2 py-0.5 text-[11px] font-bold rounded-full border uppercase ${severityColor}`}
            >
              {report.severity}
            </span>
            {report.priorityScore && (
              <PriorityScoreBadge breakdown={report.priorityScore} size="sm" />
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Review Alert if report needs human supervisor review */}
          {report.status === "review_needed" && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-400">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="font-bold">Flagged for Human Review</span>
                  <p className="text-[11px] text-slate-300">
                    {report.aiValidation?.reviewReason || "AI confidence below threshold. Requires municipal supervisor approval."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => approveReviewTicket(report.id)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all text-xs"
              >
                Approve & Move to Dispatch Queue
              </button>
            </div>
          )}

          {/* Street-Level Visual Inspector (Google Street View Context vs Citizen Evidence Photo) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-500" />
                <span>Ground-Level Visual Verification (Google Street View)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                📍 {report.lat.toFixed(5)}, {report.lng.toFixed(5)}
              </span>
            </div>

            <GoogleStreetViewPanorama
              lat={report.lat}
              lng={report.lng}
              address={report.address}
              issueTitle={report.title}
              citizenPhotoUrl={report.imageUrl}
              imageryDate={report.streetViewDate}
              height="380px"
              showComparison={true}
            />
          </div>

          {/* Title & Privacy-Preserved Reporter Meta */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Reported by: {report.publicReporterName}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white pt-1">
              {report.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              {report.description}
            </p>
          </div>

          {/* Resolution & Quality Verification (Before vs After Photos, Dispute Workflow) */}
          {(report.status === "resolved" || report.status === "reopened" || report.resolutionDetails) && (
            <ResolutionVerificationCard report={report} />
          )}

          {/* Telemetry & GPS Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                GPS Precision
              </span>
              <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                {report.gpsAccuracy ? `±${report.gpsAccuracy}m accuracy` : "Verified GPS"}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Routed Department
              </span>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 truncate">
                {report.department}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Assigned Crew
              </span>
              <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                {report.assignedCrew || "Intake Queue"}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                SLA Countdown
              </span>
              <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {report.status === "resolved" ? "Completed" : `${report.slaHoursRemaining}h remaining`}
              </p>
            </div>
          </div>

          {/* Chronic Infrastructure Recurrence Card */}
          {report.isRecurring && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <RotateCcw className="w-4 h-4" />
                  <span>⚠️ Chronic Defect Detected (Occurrence #{report.recurrenceCount})</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  +10 Pts Priority Escalation
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {report.recurrenceNotes || "Multiple failures recorded at this exact coordinate cluster. Indicates structural sub-base deterioration."}
              </p>
              {report.recurrenceHistory && report.recurrenceHistory.length > 0 && (
                <div className="pt-2 border-t border-amber-500/20 space-y-1.5">
                  <span className="text-[10px] text-amber-300 uppercase font-semibold">Prior Recorded Incidents at this Location:</span>
                  {report.recurrenceHistory.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <span>Ticket #{h.id}: {h.summary}</span>
                      <span className="text-slate-400 font-mono">{h.daysSince} days ago</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI Validation & Safety Scorecard Inspector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* AI Diagnostics Box */}
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Defect Validation</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {report.aiValidation ? `${Math.round(report.aiValidation.overallConfidence * 100)}% Conf.` : "Validated"}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                {report.aiTriageNotes}
              </p>
              {report.aiValidation && (
                <div className="flex flex-wrap gap-1 pt-1 text-[9px] font-mono text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                    Mode: {report.aiValidation.analysisMode}
                  </span>
                  {report.aiValidation.detectedFeatures?.slice(0, 3).map((feat, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300">
                      #{feat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Explainable Safety Priority Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Explainable Priority Tier</span>
                </span>
                {report.priorityScore && (
                  <PriorityScoreBadge breakdown={report.priorityScore} size="sm" />
                )}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Prioritization algorithm factors defect hazard severity, school/traffic exposure, and neglected time elapsed.
              </p>
            </div>
          </div>

          {/* Transparent Privacy-Conscious Report Timeline */}
          <ReportTimeline
            timeline={report.timeline}
            publicReporterName={report.publicReporterName}
          />

          {/* Footer Upvote & Action Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => upvoteReport(report.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                report.hasUpvoted
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${report.hasUpvoted ? "fill-white" : ""}`} />
              <span>{report.hasUpvoted ? "Upvoted (+1 Confirmed)" : "Confirm Issue (+1 Me too)"}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black/10 text-[10px]">
                {report.upvotes}
              </span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
