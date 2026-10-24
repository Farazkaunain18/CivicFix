"use client";

import React, { useEffect, useState } from "react";
import { CivicReport } from "@/types/civic";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Building2,
  Cpu,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface AiTriageModalProps {
  isOpen: boolean;
  reportData: Partial<CivicReport> | null;
  onClose: () => void;
}

export default function AiTriageModal({
  isOpen,
  reportData,
  onClose,
}: AiTriageModalProps) {
  const [step, setStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setIsCompleted(false);
      return;
    }

    // Step 1 -> 2
    const timer1 = setTimeout(() => setStep(2), 700);
    // Step 2 -> 3
    const timer2 = setTimeout(() => setStep(3), 1500);
    // Step 3 -> 4
    const timer3 = setTimeout(() => setStep(4), 2200);
    // Complete
    const timer4 = setTimeout(() => setIsCompleted(true), 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isOpen]);

  if (!isOpen || !reportData) return null;

  const severityColor =
    reportData.severity === "high"
      ? "text-rose-500 bg-rose-500/10 border-rose-500/20"
      : reportData.severity === "medium"
      ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
      : "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {!isCompleted ? (
          /* Processing State */
          <div className="space-y-6 text-center py-4">
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-inner">
              <Cpu className="w-8 h-8 animate-pulse text-indigo-500" />
              <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500/40 animate-ping opacity-30" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulated Multimodal AI Triage</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                Triaging Civic Infrastructure Defect
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Automated computer vision classification & municipal routing...
              </p>
            </div>

            {/* Step list */}
            <div className="space-y-3 text-left bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    step >= 1
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  ✓
                </span>
                <span className={step >= 1 ? "font-semibold text-slate-900 dark:text-white" : "text-slate-400"}>
                  Analyzing visual structural defect & depth profile
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    step >= 2
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {step >= 2 ? "✓" : "2"}
                </span>
                <span className={step >= 2 ? "font-semibold text-slate-900 dark:text-white" : "text-slate-400"}>
                  Calculating citizen hazard index & pedestrian proximity
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    step >= 3
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {step >= 3 ? "✓" : "3"}
                </span>
                <span className={step >= 3 ? "font-semibold text-slate-900 dark:text-white" : "text-slate-400"}>
                  Assigning AI Severity Level:{" "}
                  <span className="uppercase font-bold text-indigo-500">
                    {reportData.severity || "HIGH"}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    step >= 4
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {step >= 4 ? "✓" : "4"}
                </span>
                <span className={step >= 4 ? "font-semibold text-slate-900 dark:text-white" : "text-slate-400"}>
                  Dispatching to {reportData.department || "Municipal Queue"}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          /* Finished State */
          <div className="space-y-6 animate-fade-in text-center py-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 mb-2">
                <span>Ticket Registered #{reportData.id}</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Issue Triaged & Dispatched!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Thank you! Your report has been tagged with AI priority and entered into the municipal response queue.
              </p>
            </div>

            {/* AI Summary Card */}
            <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Assigned Severity:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px] border ${severityColor}`}
                >
                  {reportData.severity} Priority
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Routed Department:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  {reportData.department}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Target SLA Response:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {reportData.severity === "high"
                    ? "Under 8 Hours"
                    : reportData.severity === "medium"
                    ? "Under 24 Hours"
                    : "Under 48 Hours"}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
                🤖 AI Confidence: {Math.round((reportData.aiValidation?.overallConfidence || 0.95) * 100)}% • Visual defect match confirmed.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-sm"
              >
                <span>View On Citizen Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all"
              >
                <span>Municipal Kanban Board</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
