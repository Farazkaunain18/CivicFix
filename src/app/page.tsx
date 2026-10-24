"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCivic } from "@/context/CivicContext";
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  Users,
  Building2,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Camera,
} from "lucide-react";

export default function LandingPage() {
  const { stats, reports } = useCivic();
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("pothole");

  // Filter recent reports for public ticker
  const recentReports = reports.slice(0, 5);

  const categoryFeatures = [
    {
      id: "pothole",
      name: "Road Potholes & Cracks",
      icon: "🕳️",
      dept: "Roads & Transportation",
      sla: "8-24 Hours",
      desc: "Camera-assisted depth and perimeter scanning instantly flags asphalt degradation and hazards to cyclist safety.",
      stat: "1,420 repaired this year",
    },
    {
      id: "streetlight",
      name: "Broken & Flickering Streetlights",
      icon: "💡",
      dept: "Electrical & Lighting",
      sla: "12-36 Hours",
      desc: "Pins pole coordinates on the municipal electrical grid and groups clustered outages to dispatch high-lift bucket trucks.",
      stat: "98.2% restored on time",
    },
    {
      id: "garbage",
      name: "Garbage Overflow & Illegal Dumping",
      icon: "🗑️",
      dept: "Sanitation & Waste",
      sla: "4-12 Hours",
      desc: "Identifies debris volume, pedestrian sidewalk blockage, and biological hazards to mobilize sanitation compactor units.",
      stat: "2.8 tons diverted weekly",
    },
    {
      id: "water_leak",
      name: "Water Main Leaks & Flooding",
      icon: "💧",
      dept: "Water Supply & Sewerage",
      sla: "2-6 Hours Emergency",
      desc: "High-priority acoustic and visual detection triggers water department isolation crews to protect pavement integrity.",
      stat: "3.4M gallons conserved",
    },
  ];

  const currentCategory =
    categoryFeatures.find((c) => c.id === activeCategoryTab) || categoryFeatures[0];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>CivicTech Hackathon Edition 2026</span>
            <span className="w-1 h-1 rounded-full bg-indigo-400" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Next-Gen Municipal AI
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Bridging Communities <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 dark:from-indigo-400 dark:via-purple-300 dark:to-cyan-400">
                and Municipal Solutions
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              CivicFix transforms broken sidewalks, hazardous potholes, dark streetlights, and water leaks into rapid municipal action. Snap a photo, let AI triage severity, and track city repairs in real time.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-glow transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Report an Issue Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
            >
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>Live Community Feed</span>
            </Link>

            <Link
              href="/admin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all"
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Municipal Portal</span>
            </Link>
          </div>

          {/* Real-Time Counter Stats */}
          <div className="pt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200/80 dark:border-slate-800 shadow-sm text-left">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">Total Reports</span>
                <Layers className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {stats.totalReports.toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +12% this month
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200/80 dark:border-slate-800 shadow-sm text-left">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">Resolved Issues</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {stats.resolvedReports.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                87% resolution rate
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200/80 dark:border-slate-800 shadow-sm text-left">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">Active Citizens</span>
                <Users className="w-4 h-4 text-cyan-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {stats.activeCitizens.toLocaleString()}
              </p>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
                Across 28 City Wards
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200/80 dark:border-slate-800 shadow-sm text-left">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">Avg SLA Response</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {stats.avgResolutionHours} hrs
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
                Faster than state avg (14h)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Recent Community Reports Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Recent Community Reports Ticker
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore all live issues</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentReports.slice(0, 3).map((rep) => {
              const severityBadge =
                rep.severity === "high"
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  : rep.severity === "medium"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";

              return (
                <Link
                  key={rep.id}
                  href={`/dashboard?id=${rep.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 transition-all group"
                >
                  <img
                    src={rep.imageUrl}
                    alt={rep.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono text-slate-400">
                        #{rep.id}
                      </span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.2 font-bold rounded border ${severityBadge}`}
                      >
                        {rep.severity}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {rep.title}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-slate-400" />
                      {rep.address}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Category Breakdown Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Intelligent Civic Infrastructure Triage
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Specialized AI for Every City Department
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            CivicFix automatically analyzes visual severity, matches municipal GIS boundaries, and routes directly to the specialized dispatch crew.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categoryFeatures.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryTab(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategoryTab === cat.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Category Detail Card */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900">
                  {currentCategory.icon}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {currentCategory.name}
                  </h3>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    Department: {currentCategory.dept}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentCategory.desc}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Target SLA</span>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {currentCategory.sla}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Annual Impact</span>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {currentCategory.stat}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/report?category=${currentCategory.id}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                >
                  <span>Report a {currentCategory.name.toLowerCase()} now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Visual Preview Graphic */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-indigo-400">AI Diagnostic Kernel</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  Model Conf: 97.4%
                </span>
              </div>
              <div className="space-y-3 py-4 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Target Class:</span>
                  <span className="text-slate-200 font-bold">{currentCategory.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Routing Target:</span>
                  <span className="text-indigo-300">{currentCategory.dept}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Priority Tag:</span>
                  <span className="text-amber-400 font-bold">ELEVATED_SLA</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Public Safety Index:</span>
                  <span className="text-rose-400">HIGH_RISK_ROADWAY</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Auto-Dispatched</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready for Field Crew
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How CivicFix Accelerates Solutions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            From the moment a resident spots an issue to the final municipal sign-off.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative group hover:border-indigo-500/50 transition-all">
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              STEP 01
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Live Camera & GPS
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Resident captures live device camera evidence and precision GPS coordinates, instantly checking Google Street View 360° ground-level coverage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative group hover:border-indigo-500/50 transition-all">
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              STEP 02
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Automated AI Triage
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Visual analysis tags defect severity (High, Medium, Low), estimates repair urgency, and generates a structured work order ticket.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative group hover:border-indigo-500/50 transition-all">
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              STEP 03
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Municipal Dispatch
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              City officials triage tickets on an interactive Kanban board, assigning maintenance crews and monitoring SLA resolution timers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative group hover:border-indigo-500/50 transition-all">
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              STEP 04
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Community Verification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Once repaired, tickets are certified with resolution notes. Residents receive live confirmation and upvote the completed fix.
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 border border-indigo-700/50 shadow-2xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-300">
              Take Action In Your Neighborhood
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Spot a hazard? Don&apos;t wait for someone else to report it.
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Every report made on CivicFix helps city engineers prioritize road crews, prevent vehicular damage, and keep community streets safe.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/report"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-white text-indigo-900 hover:bg-indigo-50 transition-all shadow-md"
              >
                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                <span>Submit a Civic Report</span>
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-indigo-800/80 hover:bg-indigo-700 text-white border border-indigo-600/60 transition-all"
              >
                <Building2 className="w-4 h-4 text-indigo-300" />
                <span>Open Municipal Board</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
