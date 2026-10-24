"use client";

import React from "react";
import { DuplicateSuggestion } from "@/types/civic";
import { AlertTriangle, ThumbsUp, ArrowRight, MapPin, Clock, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface DuplicateSuggestionCardProps {
  suggestions: DuplicateSuggestion[];
  onSupportExisting: (existingId: string) => void;
  onDismiss: () => void;
}

export default function DuplicateSuggestionCard({
  suggestions,
  onSupportExisting,
  onDismiss,
}: DuplicateSuggestionCardProps) {
  if (!suggestions || suggestions.length === 0) return null;

  const topSuggestion = suggestions[0];
  const { existingReport, distanceMeters, similarityScore, reasons } = topSuggestion;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-slate-900 dark:text-slate-100 space-y-4 animate-fade-in shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
              Potential Duplicate Detected ({Math.round(similarityScore * 100)}% Match)
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              An active incident was already reported nearby ({distanceMeters}m away)
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          title="Dismiss and report as separate defect"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Existing Ticket Card Preview */}
      <div className="p-3 bg-white dark:bg-slate-950/80 rounded-xl border border-amber-500/20 flex gap-3 items-center">
        <img
          src={existingReport.imageUrl}
          alt={existingReport.title}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div className="min-w-0 flex-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-indigo-500 text-[11px]">
              #{existingReport.id}
            </span>
            <span className="px-2 py-0.2 rounded text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-400">
              {existingReport.category}
            </span>
            <span className="text-[10px] text-slate-400">
              {existingReport.status.replace('_', ' ')}
            </span>
          </div>
          <p className="font-semibold text-slate-900 dark:text-white truncate mt-0.5">
            {existingReport.title}
          </p>
          <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span>{existingReport.address}</span>
          </p>
        </div>
      </div>

      {/* Match Reasons */}
      <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 pl-1">
        <p className="font-semibold text-amber-600 dark:text-amber-400">Why CivicFix flagged this:</p>
        <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-500 dark:text-slate-400">
          {reasons.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-amber-500/20">
        <button
          type="button"
          onClick={() => onSupportExisting(existingReport.id)}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Confirm Existing Incident #{existingReport.id} (+1 Corroboration)</span>
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-center"
        >
          Report as Separate New Defect
        </button>
      </div>
    </div>
  );
}
