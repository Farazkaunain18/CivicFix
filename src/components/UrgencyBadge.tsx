"use client";

import React from "react";
import { AlertOctagon, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { UrgencyLevel } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  size?: "sm" | "md" | "lg";
  showSubtext?: boolean;
}

export default function UrgencyBadge({
  urgency,
  size = "md",
  showSubtext = false,
}: UrgencyBadgeProps) {
  const { t } = useI18n();

  const configs: Record<
    UrgencyLevel,
    {
      label: string;
      subtext: string;
      icon: any;
      bgClass: string;
      textClass: string;
      borderClass: string;
      badgeColor: string;
    }
  > = {
    emergency: {
      label: t("result.urgencyLevels.emergency"),
      subtext: t("result.urgencySubtext.emergency"),
      icon: AlertOctagon,
      bgClass: "bg-red-50 dark:bg-red-950/40",
      textClass: "text-urgency-emergency dark:text-red-400",
      borderClass: "border-urgency-emergency",
      badgeColor: "#DC2626",
    },
    urgent_today: {
      label: t("result.urgencyLevels.urgent_today"),
      subtext: t("result.urgencySubtext.urgent_today"),
      icon: AlertTriangle,
      bgClass: "bg-orange-50 dark:bg-orange-950/40",
      textClass: "text-urgency-urgent dark:text-orange-400",
      borderClass: "border-urgency-urgent",
      badgeColor: "#F97316",
    },
    see_clinic_soon: {
      label: t("result.urgencyLevels.see_clinic_soon"),
      subtext: t("result.urgencySubtext.see_clinic_soon"),
      icon: Clock,
      bgClass: "bg-amber-50 dark:bg-amber-950/40",
      textClass: "text-urgency-soon dark:text-amber-400",
      borderClass: "border-urgency-soon",
      badgeColor: "#EAB308",
    },
    home_care: {
      label: t("result.urgencyLevels.home_care"),
      subtext: t("result.urgencySubtext.home_care"),
      icon: CheckCircle2,
      bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
      textClass: "text-urgency-homecare dark:text-emerald-400",
      borderClass: "border-urgency-homecare",
      badgeColor: "#16A34A",
    },
  };

  const config = configs[urgency] || configs.home_care;
  const Icon = config.icon;

  if (size === "sm") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.bgClass} ${config.textClass} ${config.borderClass}`}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{config.label}</span>
      </span>
    );
  }

  if (size === "lg") {
    return (
      <div
        className={`w-full p-5 sm:p-6 rounded-2xl border-2 ${config.bgClass} ${config.borderClass} transition-all shadow-card`}
        role="alert"
      >
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-2xl text-white shrink-0 shadow-md"
            style={{ backgroundColor: config.badgeColor }}
          >
            <Icon className="w-8 h-8" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Urgency Level / ਤਰਜੀਹ
            </span>
            <h2 className={`text-xl sm:text-2xl font-extrabold ${config.textClass} leading-tight`}>
              {config.label}
            </h2>
            {showSubtext && (
              <p className="mt-2 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium">
                {config.subtext}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold border ${config.bgClass} ${config.textClass} ${config.borderClass}`}
    >
      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{config.label}</span>
    </div>
  );
}
