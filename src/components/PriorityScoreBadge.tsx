"use client";

import React, { useState } from "react";
import { PriorityScoreBreakdown } from "@/types/civic";
import { ShieldAlert, Info, X, Activity, Clock, Users, AlertTriangle } from "lucide-react";

interface PriorityScoreBadgeProps {
  breakdown: PriorityScoreBreakdown;
  size?: "sm" | "md" | "lg";
  showPopover?: boolean;
}

export default function PriorityScoreBadge({
  breakdown,
  size = "md",
  showPopover = true,
}: PriorityScoreBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tierColors = {
    P1_CRITICAL: {
      badge: "bg-rose-500/15 text-rose-500 border-rose-500/30",
      dot: "bg-rose-500",
      label: "P1 Critical",
    },
    P2_URGENT: {
      badge: "bg-amber-500/15 text-amber-500 border-amber-500/30",
      dot: "bg-amber-500",
      label: "P2 Urgent",
    },
    P3_STANDARD: {
      badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      dot: "bg-indigo-400",
      label: "P3 Standard",
    },
    P4_ROUTINE: {
      badge: "bg-slate-500/15 text-slate-400 border-slate-500/30",
      dot: "bg-slate-400",
      label: "P4 Routine",
    },
  };

  const style = tierColors[breakdown.tier] || tierColors.P3_STANDARD;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          if (showPopover) {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }
        }}
        title="Click to view explainable safety priority scorecard"
        className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${style.badge} ${
          size === "sm"
            ? "px-2 py-0.5 text-[9px]"
            : size === "lg"
            ? "px-3 py-1 text-xs"
            : "px-2.5 py-0.5 text-[10px]"
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${breakdown.tier === 'P1_CRITICAL' ? 'animate-ping' : ''}`} />
        <span>{style.label}</span>
        <span className="font-mono opacity-80">({breakdown.totalScore}/100)</span>
      </button>

      {/* Explainable Popover Card */}
      {isOpen && showPopover && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 mt-2 left-0 w-72 sm:w-80 p-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 text-xs space-y-3 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Safety Priority Scorecard</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400">Composite Priority:</span>
            <span className="font-mono text-sm font-extrabold text-indigo-400">
              {breakdown.totalScore}/100 ({style.label})
            </span>
          </div>

          {/* Factor Breakdown Bars */}
          <div className="space-y-2 text-[11px]">
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Base Defect Hazard:</span>
                <span className="font-mono text-slate-200 font-bold">{breakdown.hazardScore} / 35 pts</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${(breakdown.hazardScore / 35) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Public Safety Exposure:</span>
                <span className="font-mono text-slate-200 font-bold">{breakdown.publicExposureScore} / 25 pts</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(breakdown.publicExposureScore / 25) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Aging Duration Escalation:</span>
                <span className="font-mono text-slate-200 font-bold">{breakdown.durationScore} / 25 pts</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${(breakdown.durationScore / 25) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Community Corroboration:</span>
                <span className="font-mono text-slate-200 font-bold">{breakdown.communityScore} / 15 pts</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${(breakdown.communityScore / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Explainable Factor Details */}
          <div className="pt-2 border-t border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Algorithmic Factors:</span>
            <ul className="list-disc list-inside text-[10px] text-slate-400 space-y-0.5 max-h-24 overflow-y-auto">
              {breakdown.factors.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <p className="text-[9px] text-slate-500 italic pt-1">
            ⚖️ Prioritization is weighted on hazard risk and neglected duration — community votes alone cannot override public safety.
          </p>
        </div>
      )}
    </div>
  );
}
