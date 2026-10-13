"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { TriageResponse } from "@/lib/types";

interface SpeechSpeakerProps {
  triage: TriageResponse;
}

export default function SpeechSpeaker({ triage }: SpeechSpeakerProps) {
  const { language, t } = useI18n();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setIsSupported(false);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    // Build readout text
    const parts: string[] = [
      triage.summary,
      ...triage.reasons,
      ...(triage.home_care.length > 0 ? [t("result.homeCareHeading"), ...triage.home_care] : []),
      ...(triage.warning_signs.length > 0 ? [t("result.warningSignsHeading"), ...triage.warning_signs] : []),
      triage.disclaimer,
    ];

    const fullText = parts.join(". ");
    const utterance = new SpeechSynthesisUtterance(fullText);

    const langCodes: Record<string, string> = {
      pa: "pa-IN",
      hi: "hi-IN",
      en: "en-IN",
    };
    utterance.lang = langCodes[language] || "pa-IN";
    utterance.rate = 0.95; // Slightly slower for clarity in rural health contexts

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={isSpeaking ? t("result.stopSpeechBtn") : t("result.listenBtn")}
      className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold transition-all shadow-md active:scale-95 border min-h-touch ${
        isSpeaking
          ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600 animate-pulse"
          : "bg-white dark:bg-slate-800 hover:bg-mint/40 text-primary-900 dark:text-teal-300 border-teal-200 dark:border-slate-700"
      }`}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-5 h-5 shrink-0" />
          <span>{t("result.stopSpeechBtn")}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>{t("result.listenBtn")}</span>
        </>
      )}
    </button>
  );
}
