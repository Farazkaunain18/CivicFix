"use client";

import React, { useState } from "react";
import { CivicReport } from "@/types/civic";
import { useCivic } from "@/context/CivicContext";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  ThumbsUp,
  RotateCcw,
  Camera,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

interface ResolutionVerificationCardProps {
  report: CivicReport;
}

export default function ResolutionVerificationCard({ report }: ResolutionVerificationCardProps) {
  const { verifyOrDisputeResolution } = useCivic();
  const [showDisputeInput, setShowDisputeInput] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  const details = report.resolutionDetails;
  if (!details && report.status !== "resolved" && report.status !== "reopened") {
    return null;
  }

  const feedback = details?.citizenFeedback || {
    verifiedFixedCount: 0,
    disputedCount: 0,
    hasUserVerified: false,
    hasUserDisputed: false,
    disputeItems: [],
  };

  const handleConfirmDispute = () => {
    if (!disputeReason.trim()) return;
    verifyOrDisputeResolution(report.id, true, disputeReason.trim());
    setDisputeReason("");
    setShowDisputeInput(false);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Municipal Resolution & Quality Verification
            </h4>
            <p className="text-[11px] text-slate-500">
              Field crew proof photos, completion audit, and community dispute review
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            report.status === "reopened"
              ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
              : "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
          }`}
        >
          {report.status === "reopened" ? "Resolution Disputed" : "Work Order Completed"}
        </span>
      </div>

      {/* Before / After Photo Comparison Cards */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
          Before vs After Visual Proof
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Before Photo */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 h-44">
            <img
              src={report.imageUrl}
              alt="Before Repair"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-rose-400 border border-rose-500/30 flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>BEFORE: Citizen Reported Defect</span>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded font-mono">
              Reported: {new Date(report.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* After Photo */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 h-44">
            <img
              src={details?.resolutionProofImageUrl || report.imageUrl}
              alt="After Repair"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>AFTER: Municipal Repair Proof</span>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded font-mono">
              Signed off by: {details?.resolvedByCrew || report.assignedCrew || "City Field Crew"}
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Details Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Resolved Date</span>
          <p className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
            {details?.resolvedAt ? new Date(details.resolvedAt).toLocaleDateString() : "Pending"}
          </p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Turnaround Time</span>
          <p className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
            {details?.repairDurationHours ? `${details.repairDurationHours} hrs elapsed` : "Under 24h SLA"}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Field Unit Sign-Off</span>
          <p className="font-semibold text-indigo-500 mt-0.5 truncate">
            {details?.resolvedByCrew || "Municipal Supervisor"}
          </p>
        </div>
      </div>

      {details?.resolutionNote && (
        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Wrench className="w-3 h-3" />
            <span>Field Supervisor Sign-Off Certification</span>
          </span>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
            {details.resolutionNote}
          </p>
        </div>
      )}

      {/* Community Review & Dispute Action Workflow */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white">
              Community Quality Feedback
            </h5>
            <p className="text-[11px] text-slate-500">
              Was this repair executed thoroughly and safely?
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={feedback.hasUserVerified}
              onClick={() => verifyOrDisputeResolution(report.id, false)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                feedback.hasUserVerified
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Verified Fixed ({feedback.verifiedFixedCount})</span>
            </button>

            <button
              type="button"
              disabled={feedback.hasUserDisputed}
              onClick={() => setShowDisputeInput(!showDisputeInput)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                feedback.hasUserDisputed
                  ? "bg-amber-500 text-white"
                  : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Dispute Repair ({feedback.disputedCount})</span>
            </button>
          </div>
        </div>

        {/* Dispute Input Drawer */}
        {showDisputeInput && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2.5 animate-fade-in text-xs">
            <div className="flex items-center gap-1.5 font-bold text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Reopen & Dispute Municipal Resolution</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Explain why this defect is not resolved (e.g. cold patch washed away, water pipe still leaking, debris left behind). The ticket will immediately be reopened with elevated priority.
            </p>
            <textarea
              rows={2}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="e.g. The cold patch broke open after heavy rain and is now 8 inches deep again..."
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDisputeInput(false)}
                className="px-3 py-1 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!disputeReason.trim()}
                onClick={handleConfirmDispute}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold disabled:opacity-50"
              >
                Submit Dispute & Reopen Ticket
              </button>
            </div>
          </div>
        )}

        {/* Dispute History List if any exist */}
        {feedback.disputeItems && feedback.disputeItems.length > 0 && (
          <div className="pt-2 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
              Citizen Dispute Audit Log:
            </span>
            {feedback.disputeItems.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950/60 border border-amber-500/20 text-[11px] space-y-1"
              >
                <div className="flex justify-between text-slate-400">
                  <span className="font-semibold text-amber-400">{item.author}</span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="text-slate-300 italic">&ldquo;{item.note}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
