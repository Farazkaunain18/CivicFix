"use client";

import React from "react";
import { CivicTimelineItem, IssueStatus } from "@/types/civic";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  Eye,
} from "lucide-react";

interface ReportTimelineProps {
  timeline: CivicTimelineItem[];
  publicReporterName?: string;
}

export default function ReportTimeline({ timeline, publicReporterName }: ReportTimelineProps) {
  if (!timeline || timeline.length === 0) return null;

  const getStatusIcon = (status: IssueStatus, isDispute?: boolean) => {
    if (isDispute || status === "reopened") {
      return <RotateCcw className="w-3.5 h-3.5 text-rose-400" />;
    }
    if (status === "resolved") {
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (status === "in_progress") {
      return <Truck className="w-3.5 h-3.5 text-indigo-400" />;
    }
    if (status === "review_needed") {
      return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
  };

  const getStatusBadge = (status: IssueStatus, isDispute?: boolean) => {
    if (isDispute || status === "reopened") {
      return "border-rose-500/30 bg-rose-500/10 text-rose-400";
    }
    if (status === "resolved") {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    }
    if (status === "in_progress") {
      return "border-indigo-500/30 bg-indigo-500/10 text-indigo-400";
    }
    if (status === "review_needed") {
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    }
    return "border-slate-700 bg-slate-800 text-slate-300";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Transparent Public Audit Timeline
          </h4>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Privacy Protected (PII Redacted)</span>
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {timeline.map((item, idx) => {
          return (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center bg-slate-900 shadow-sm`}
              >
                {getStatusIcon(item.status, item.isDispute)}
              </div>

              {/* Event Content */}
              <div className="text-xs space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.label}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold border ${getStatusBadge(
                      item.status,
                      item.isDispute
                    )}`}
                  >
                    {item.isDispute ? "Disputed" : item.status.replace("_", " ")}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-auto">
                    {item.timestamp}
                  </span>
                </div>

                {item.actor && (
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    Actor: {item.actor}
                  </p>
                )}

                {item.note && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 leading-relaxed">
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
