"use client";

import React from "react";
import { PhoneCall, AlertOctagon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function EmergencyBar() {
  const { t } = useI18n();

  return (
    <div
      role="region"
      aria-label="Emergency Assistance"
      className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md pointer-events-auto"
    >
      <a
        href="tel:108"
        aria-label="Call Emergency 108 Ambulance"
        className="group flex items-center justify-between w-full px-5 py-3.5 bg-urgency-emergency hover:bg-red-700 text-white rounded-2xl shadow-floating font-semibold transition-all transform active:scale-95 border-2 border-white/20 focus:outline-none focus:ring-4 focus:ring-red-400/50"
      >
        <div className="flex items-center space-x-3">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white text-urgency-emergency items-center justify-center font-bold text-[10px]">
              !
            </span>
          </span>
          <div className="text-left">
            <div className="text-sm font-bold tracking-wide uppercase flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>{t("app.emergencyBtn")}</span>
            </div>
            <div className="text-xs text-red-100 font-normal hidden xs:block">
              {t("app.emergencyBanner")}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
          <PhoneCall className="w-4 h-4 text-white animate-bounce shrink-0" />
          <span className="text-sm font-bold tracking-wider">108</span>
        </div>
      </a>
    </div>
  );
}
