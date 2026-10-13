"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Mic,
  Clock,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function LandingPage() {
  const { t } = useI18n();

  const stepCards = [
    {
      num: "01",
      icon: Mic,
      title: t("hero.step1Title"),
      desc: t("hero.step1Desc"),
      color: "bg-teal-50 dark:bg-teal-950/40 text-primary dark:text-teal-400 border-teal-200 dark:border-teal-800",
    },
    {
      num: "02",
      icon: Activity,
      title: t("hero.step2Title"),
      desc: t("hero.step2Desc"),
      color: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    },
    {
      num: "03",
      icon: MapPin,
      title: t("hero.step3Title"),
      desc: t("hero.step3Desc"),
      color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mint/60 via-surface-light to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-teal-100 dark:border-slate-800 p-6 sm:p-12 lg:p-16 shadow-card">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/90 dark:bg-teal-900/50 border border-teal-300 dark:border-teal-700 text-primary-900 dark:text-teal-200 text-xs sm:text-sm font-bold mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span>{t("hero.badge")}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6"
          >
            {t("hero.title")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <Link
              href="/check"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary-800 text-white rounded-2xl font-bold text-base sm:text-lg shadow-floating hover:shadow-lg transition-all transform active:scale-95 min-h-touch"
            >
              <span>{t("hero.cta")}</span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </Link>

            <Link
              href="/facilities"
              className="flex items-center justify-center gap-2.5 px-6 py-4 bg-white dark:bg-slate-800 hover:bg-mint/40 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-base border border-teal-200 dark:border-slate-700 transition-all min-h-touch"
            >
              <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>{t("hero.ctaFind")}</span>
            </Link>
          </motion.div>

          {/* Rapid highlights */}
          <div className="mt-10 pt-8 border-t border-teal-200/50 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Free & Anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Voice Recognition (ਮਾਈਕ)</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Works Offline (PWA)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step "How It Works" */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("hero.stepsTitle")}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Designed specifically for villagers and rural community health workers in Punjab.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stepCards.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className={`p-6 sm:p-8 rounded-3xl border-2 ${step.color} shadow-card relative flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
                      <Icon className="w-7 h-7 shrink-0" />
                    </div>
                    <span className="text-2xl font-black text-slate-400/70 dark:text-slate-600">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 flex items-center text-xs font-bold text-primary dark:text-teal-400">
                  <span>Step {step.num} Details</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Clinical Safety & Red-Flag Guarantee */}
      <section className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-card border border-slate-800 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{t("hero.safetyHeading")}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Deterministic Safety Protocols Before Any AI
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {t("hero.safetyBody")}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 bg-slate-800 text-teal-300 rounded-lg text-xs font-semibold">
                ✓ No Prescription Meds
              </span>
              <span className="px-3 py-1 bg-slate-800 text-teal-300 rounded-lg text-xs font-semibold">
                ✓ No Drug Dosages
              </span>
              <span className="px-3 py-1 bg-slate-800 text-amber-300 rounded-lg text-xs font-semibold">
                ✓ Automatic 108 Emergency Trigger
              </span>
            </div>
          </div>

          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 flex flex-col justify-center text-center space-y-4">
            <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Punjab Emergency Dispatch</div>
              <div className="text-3xl font-black text-white">Call 108</div>
              <div className="text-xs text-slate-400 mt-1">Free 24/7 Government Ambulance</div>
            </div>
            <a
              href="tel:108"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all"
            >
              Dial 108 Directly
            </a>
          </div>
        </div>
      </section>

      {/* ASHA Telemetry Preview Card */}
      <section className="rounded-3xl bg-teal-900/10 dark:bg-slate-800/50 border border-teal-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Are you an ASHA, ANM, or Village Health Worker?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Access real-time disease surveillance telemetry and village triage splits on the ASHA dashboard.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="shrink-0 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-teal-50 border border-teal-300 dark:border-slate-600 text-primary dark:text-teal-300 rounded-2xl font-bold text-sm transition-all min-h-touch flex items-center gap-2"
        >
          <span>Open ASHA Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
