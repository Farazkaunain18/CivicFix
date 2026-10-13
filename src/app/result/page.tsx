"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Share2,
  Printer,
  RotateCcw,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import UrgencyBadge from "@/components/UrgencyBadge";
import SpeechSpeaker from "@/components/SpeechSpeaker";
import { TriageResponse, Facility, TriageInput } from "@/lib/types";
import rawFacilities from "@/data/facilities.json";
import { sortFacilitiesByDistance, DEFAULT_PUNJAB_COORDS } from "@/lib/geo";

export default function ResultPage() {
  const router = useRouter();
  const { language, t } = useI18n();

  const [triage, setTriage] = useState<TriageResponse | null>(null);
  const [patientInput, setPatientInput] = useState<TriageInput | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [nearestFacilities, setNearestFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    // Read from sessionStorage
    if (typeof window !== "undefined") {
      const storedResult = sessionStorage.getItem("organigen_last_result");
      const storedInput = sessionStorage.getItem("organigen_last_input");

      if (storedResult) {
        try {
          const parsedRes: TriageResponse = JSON.parse(storedResult);
          setTriage(parsedRes);

          if (storedInput) {
            setPatientInput(JSON.parse(storedInput));
          }
        } catch (e) {
          console.error("Failed to parse triage result:", e);
        }
      } else {
        // Fallback demo triage result if landed directly
        setTriage({
          urgency: "urgent_today",
          summary:
            language === "pa"
              ? "ਲੱਛਣਾਂ ਦੀ ਤੀਬਰਤਾ ਨੂੰ ਦੇਖਦੇ ਹੋਏ ਅੱਜ ਹੀ ਸਰਕਾਰੀ ਕਲੀਨਿਕ ਵਿੱਚ ਜਾਂਚ ਕਰਵਾਉਣਾ ਜ਼ਰੂਰੀ ਹੈ।"
              : language === "hi"
              ? "लक्षणों की गंभीरता को देखते हुए आज ही सरकारी क्लीनिक में जांच कराना आवश्यक है।"
              : "Doctor consultation recommended today at a local Community Health Centre.",
          reasons: [
            language === "pa"
              ? "3 ਦਿਨਾਂ ਤੋਂ ਲਗਾਤਾਰ ਬੁਖ਼ਾਰ ਸਰੀਰਕ ਇਨਫੈਕਸ਼ਨ ਦਾ ਸੰਕੇਤ ਹੈ"
              : language === "hi"
              ? "3 दिनों से लगातार बुखार शारीरिक संक्रमण का संकेत है"
              : "Persistent fever for 3 days indicates active infection",
            language === "pa"
              ? "ਕਮਜ਼ੋਰੀ ਅਤੇ ਤਰਲ ਪਦਾਰਥਾਂ ਦੀ ਕਮੀ ਦਾ ਖ਼ਤਰਾ ਹੋ ਸਕਦਾ ਹੈ"
              : language === "hi"
              ? "कमजोरी और डिहाइड्रेशन का खतरा हो सकता है"
              : "Risk of dehydration and fatigue requires clinical evaluation",
          ],
          home_care: [
            language === "pa" ? "ਬਿਸਤਰੇ 'ਤੇ ਪੂਰਾ ਆਰਾਮ ਕਰੋ" : language === "hi" ? "बिस्तर पर आराम करें" : "Rest in bed comfortably",
            language === "pa" ? "ਓ.ਆਰ.ਐਸ ਅਤੇ ਸਾਫ਼ ਉਬਲਿਆ ਪਾਣੀ ਪੀਓ" : language === "hi" ? "ओआरएस और साफ उबला पानी पिएं" : "Drink clean boiled water & ORS fluids",
            language === "pa" ? "ਮੱਥੇ 'ਤੇ ਗਿੱਲੀਆਂ ਪੱਟੀਆਂ ਰੱਖੋ" : language === "hi" ? "माथे पर गीले कपड़े की पट्टी रखें" : "Apply cool compresses to forehead",
          ],
          warning_signs: [
            language === "pa" ? "ਬੁਖ਼ਾਰ 103°F ਤੋਂ ਉੱਪਰ ਜਾਣਾ" : language === "hi" ? "बुखार 103°F से अधिक होना" : "Fever rising above 103°F",
            language === "pa" ? "ਸਾਹ ਲੈਣ ਵਿੱਚ ਔਖ ਹੋਣੀ" : language === "hi" ? "सांस लेने में भारी तकलीफ" : "Shortness of breath or rapid breathing",
            language === "pa" ? "ਬੇਹੋਸ਼ੀ ਜਾਂ ਅਸਾਧਾਰਨ ਸੁਸਤੀ" : language === "hi" ? "बेहोशी या अत्यधिक सुस्ती" : "Lethargy or loss of consciousness",
          ],
          follow_up_questions: [],
          recommended_facility_type: "phc",
          disclaimer: "This is guidance, not a medical diagnosis.",
        });
      }

      // Sort facilities by default Punjab coordinates
      const sorted = sortFacilitiesByDistance(
        rawFacilities as Facility[],
        DEFAULT_PUNJAB_COORDS.lat,
        DEFAULT_PUNJAB_COORDS.lng
      );
      setNearestFacilities(sorted.slice(0, 3));
    }
  }, [language]);

  if (!triage) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Generate WhatsApp Share Link
  const buildWhatsAppShareUrl = () => {
    const text = `*Organigen Health Triage Assessment Summary*%0A` +
      `*Urgency:* ${triage.urgency.toUpperCase()}%0A` +
      `*Summary:* ${triage.summary}%0A` +
      `*Reasons:* ${triage.reasons.join(", ")}%0A` +
      (triage.warning_signs.length > 0 ? `*Warning Signs:* ${triage.warning_signs.join(", ")}%0A` : "") +
      `*Emergency Helpline:* Dial 108%0A` +
      `_Note: Guidance only, not a medical diagnosis._`;
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  const handleCopySummary = () => {
    const text = `Organigen Health Triage Assessment\n` +
      `Urgency: ${triage.urgency.toUpperCase()}\n` +
      `Summary: ${triage.summary}\n` +
      `Reasons: ${triage.reasons.join(", ")}\n` +
      (triage.warning_signs.length > 0 ? `Warning Signs: ${triage.warning_signs.join(", ")}\n` : "") +
      `Notice: Guidance only, not a medical diagnosis. In emergency dial 108.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 pb-20 print:p-0 print:space-y-4">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t("result.title")}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t("result.subtitle")}
          </p>
        </div>

        {/* Listen Button (SpeechSynthesis) */}
        <div className="shrink-0 print:hidden">
          <SpeechSpeaker triage={triage} />
        </div>
      </div>

      {/* Large Color-Coded Urgency Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <UrgencyBadge urgency={triage.urgency} size="lg" showSubtext={true} />
      </motion.div>

      {/* One-Sentence Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-teal-100 dark:border-slate-800 shadow-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 mb-2">
          Clinical Guidance Summary
        </h3>
        <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
          {triage.summary}
        </p>
      </div>

      {/* Clinical Reasons (Max 3) */}
      {triage.reasons.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-teal-100 dark:border-slate-800 shadow-card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary shrink-0" />
            <span>{t("result.reasonsHeading")}</span>
          </h3>
          <ul className="space-y-3">
            {triage.reasons.map((reason, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm sm:text-base text-slate-800 dark:text-slate-200"
              >
                <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="font-medium">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Home Care Steps (Max 4, empty if emergency) */}
      {triage.home_care.length > 0 && triage.urgency !== "emergency" && (
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 rounded-3xl p-6 sm:p-7 border-2 border-emerald-200 dark:border-emerald-800/80 shadow-card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t("result.homeCareHeading")}</span>
          </h3>
          <ul className="space-y-3">
            {triage.home_care.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm sm:text-base text-slate-800 dark:text-slate-100"
              >
                <span className="w-6 h-6 rounded-xl bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="font-semibold">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warning Signs (Danger Signs - Go to hospital now) */}
      {triage.warning_signs.length > 0 && (
        <div className="bg-red-50/80 dark:bg-red-950/40 rounded-3xl p-6 sm:p-7 border-2 border-red-200 dark:border-red-900 shadow-card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-urgency-emergency dark:text-red-300 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-urgency-emergency shrink-0 animate-bounce" />
            <span>{t("result.warningSignsHeading")}</span>
          </h3>
          <p className="text-xs text-red-700 dark:text-red-300 mb-4 font-medium">
            If you notice ANY of these signs, stop waiting and immediately go to the nearest hospital or call 108.
          </p>
          <ul className="space-y-2.5">
            {triage.warning_signs.map((sign, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm sm:text-base text-red-950 dark:text-red-200 font-semibold"
              >
                <span className="text-red-600 font-black">!</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nearest Punjab Facilities Preview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-teal-100 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>{t("result.nearbyFacilitiesHeading")}</span>
          </h3>
          <Link
            href="/facilities"
            className="text-xs font-bold text-primary dark:text-teal-400 hover:underline flex items-center gap-1 print:hidden"
          >
            <span>View All 25 on Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {nearestFacilities.map((fac) => (
            <div
              key={fac.id}
              className="p-4 rounded-2xl bg-surface-light dark:bg-slate-800 border border-teal-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    {fac.name}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-primary dark:text-teal-300 capitalize">
                    {fac.type}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {fac.address} • 📍 {fac.distanceKm} km away
                </div>
              </div>

              <a
                href={`tel:${fac.phone}`}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shrink-0 transition-all min-h-[40px]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {fac.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Share / Save Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-teal-100 dark:border-slate-800 shadow-card print:hidden">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4">
          {t("result.shareHeading")}
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={buildWhatsAppShareUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-sm transition-all active:scale-95 min-h-touch"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span>{t("result.shareWhatsApp")}</span>
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 hover:border-primary text-slate-800 dark:text-slate-200 font-bold text-sm shadow-sm transition-all min-h-touch"
          >
            <Printer className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{t("result.printPdf")}</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 hover:border-primary text-slate-800 dark:text-slate-200 font-bold text-sm shadow-sm transition-all min-h-touch"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-600 font-bold">{t("result.copied")}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recheck CTA */}
      <div className="pt-2 flex justify-center print:hidden">
        <button
          type="button"
          onClick={() => router.push("/check")}
          className="flex items-center gap-2 px-8 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-base transition-all min-h-touch"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t("result.recheck")}</span>
        </button>
      </div>
    </div>
  );
}
