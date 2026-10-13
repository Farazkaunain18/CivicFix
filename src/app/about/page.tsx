"use client";

import React from "react";
import {
  ShieldAlert,
  PhoneCall,
  Activity,
  Bot,
  AlertTriangle,
  Heart,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { language, t } = useI18n();

  const emergencyHelplines = [
    {
      number: "108",
      label: t("about.dial108"),
      desc: "Punjab State Emergency Ambulance Service with trained Emergency Medical Technicians (EMTs) & GPS dispatch.",
      color: "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-300",
      btnBg: "bg-red-600 hover:bg-red-700",
    },
    {
      number: "102",
      label: t("about.dial102"),
      desc: "Free referral transport service dedicated to pregnant mothers, safe institutional delivery, and sick infants.",
      color: "border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-900 dark:text-pink-300",
      btnBg: "bg-pink-600 hover:bg-pink-700",
    },
    {
      number: "104",
      label: t("about.dial104"),
      desc: "Punjab 24x7 Medical Advice & Healthcare Grievance helpline. Speak directly with a medical counselor.",
      color: "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300",
      btnBg: "bg-amber-600 hover:bg-amber-700",
    },
    {
      number: "112",
      label: t("about.dial112"),
      desc: "Integrated National Emergency Helpline for Police, Fire, and Medical emergencies throughout India.",
      color: "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300",
      btnBg: "bg-blue-600 hover:bg-blue-700",
    },
    {
      number: "1098",
      label: t("about.dial1098"),
      desc: "Childline India toll-free 24-hour service for children in need of medical care or emergency protection.",
      color: "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300",
      btnBg: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      number: "14416",
      label: t("about.dial14416"),
      desc: "Tele-MANAS Government Mental Health & Distress helpline providing free, confidential counseling in Punjabi.",
      color: "border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-300",
      btnBg: "bg-teal-700 hover:bg-teal-800",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 pb-20">
      {/* Page Title */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-teal-100 dark:border-slate-800 shadow-card">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t("about.title")}
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-300">
          {t("about.subtitle")}
        </p>
      </div>

      {/* Mission */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-teal-100 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center gap-2 text-primary dark:text-teal-400 font-bold text-sm uppercase tracking-wider">
          <Heart className="w-5 h-5 text-red-500" />
          <span>{t("about.mission")}</span>
        </div>
        <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
          {t("about.missionText")}
        </p>
      </section>

      {/* How Triage Works (Dual Engine) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t("about.howItWorks")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Engineered with strict clinical safety constraints to protect rural patients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Engine 1: Red Flag Rule Engine */}
          <div className="p-6 sm:p-8 rounded-3xl bg-red-50/50 dark:bg-slate-800 border-2 border-red-200 dark:border-red-900 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-urgency-emergency text-white">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t("about.ruleEngine")}
              </h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {t("about.ruleEngineText")}
            </p>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-red-600" />
                <span>Deterministic FAST Stroke Criteria</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-red-600" />
                <span>Cardiac & Acute Respiratory Distress</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-red-600" />
                <span>Instant 108 Emergency Trigger</span>
              </li>
            </ul>
          </div>

          {/* Engine 2: Gemini AI */}
          <div className="p-6 sm:p-8 rounded-3xl bg-teal-50/50 dark:bg-slate-800 border-2 border-teal-200 dark:border-teal-900 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary text-white">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t("about.aiEngine")}
              </h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {t("about.aiEngineText")}
            </p>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-primary" />
                <span>Simple 6th-Grade Reading Level</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-primary" />
                <span>Zero Drug Prescriptions or Dosages</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-primary" />
                <span>Support for Punjabi, Hindi, and English</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Emergency Helplines Directory */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t("about.emergencyDirectory")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tap any number below to connect immediately from your mobile phone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyHelplines.map((item) => (
            <div
              key={item.number}
              className={`p-6 rounded-3xl border-2 ${item.color} shadow-card flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black">{item.number}</span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                    24/7 Free
                  </span>
                </div>
                <h3 className="font-bold text-base mb-1">{item.label}</h3>
                <p className="text-xs opacity-90 leading-relaxed mb-4">{item.desc}</p>
              </div>

              <a
                href={`tel:${item.number}`}
                className={`flex items-center justify-center gap-2 py-3 px-4 ${item.btnBg} text-white font-bold text-sm rounded-xl transition-all shadow-sm active:scale-95 min-h-touch`}
              >
                <PhoneCall className="w-4 h-4 shrink-0 animate-bounce" />
                <span>Call {item.number} Now</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer Notice */}
      <section className="bg-amber-50 dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 dark:border-amber-700/60 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm uppercase tracking-wider">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{t("about.disclaimerHeading")}</span>
        </div>
        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
          {t("about.disclaimerFull")}
        </p>
      </section>
    </div>
  );
}
