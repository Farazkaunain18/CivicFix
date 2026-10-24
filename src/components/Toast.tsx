"use client";

import React from "react";
import { useCivic } from "@/context/CivicContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast() {
  const { toast, clearToast } = useCivic();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-fade-in pointer-events-auto">
      <div className="flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
        <div className="flex-shrink-0 mt-0.5">
          {toast.type === "success" && (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          )}
          {toast.type === "warning" && (
            <AlertCircle className="w-5 h-5 text-amber-500" />
          )}
          {toast.type === "info" && (
            <Info className="w-5 h-5 text-indigo-500" />
          )}
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-sm font-semibold tracking-tight">{toast.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        </div>
        <button
          onClick={clearToast}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1 rounded-lg"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
