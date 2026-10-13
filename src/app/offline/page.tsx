"use client";

import React from "react";
import Link from "next/link";
import { WifiOff, PhoneCall, RefreshCw, Home, ShieldAlert } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
      <div className="w-20 h-20 bg-teal-100 dark:bg-slate-800 text-primary dark:text-teal-400 rounded-3xl flex items-center justify-center mx-auto shadow-soft">
        <WifiOff className="w-10 h-10 animate-pulse" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          ਇੰਟਰਨੈੱਟ ਕੁਨੈਕਸ਼ਨ ਉਪਲਬਧ ਨਹੀਂ ਹੈ
        </h1>
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300">
          इंटरनेट कनेक्शन उपलब्ध नहीं है / You Are Offline
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Organigen Health caches critical triage tools and Punjab facility contacts offline. Emergency phone calls do not require internet.
        </p>
      </div>

      {/* Emergency Call Box */}
      <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/40 border-2 border-urgency-emergency text-left space-y-3">
        <div className="flex items-center gap-2 text-urgency-emergency font-bold text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>ਐਮਰਜੈਂਸੀ ਹੈ? ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ 108 'ਤੇ ਕਾਲ ਕਰੋ</span>
        </div>
        <p className="text-xs text-red-900 dark:text-red-300 font-medium">
          If someone is in danger, phone calls work without any mobile data or Wi-Fi.
        </p>
        <a
          href="tel:108"
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-urgency-emergency hover:bg-red-700 text-white font-bold rounded-2xl text-base shadow-md active:scale-95 transition-all min-h-touch"
        >
          <PhoneCall className="w-5 h-5" />
          <span>Call 108 Ambulance Now</span>
        </a>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-800 text-white rounded-2xl font-bold text-sm shadow-soft min-h-touch"
        >
          <RefreshCw className="w-4 h-4" />
          <span>ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ (Retry)</span>
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-light dark:bg-slate-800 border border-teal-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-sm min-h-touch"
        >
          <Home className="w-4 h-4" />
          <span>ਮੁੱਖ ਪੰਨਾ (Go Home)</span>
        </Link>
      </div>
    </div>
  );
}
