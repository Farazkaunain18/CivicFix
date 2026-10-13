"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  AlertOctagon,
  AlertTriangle,
  HeartPulse,
  Filter,
  RefreshCw,
  Building,
  Activity,
  Calendar,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CaseRecord, UrgencyLevel } from "@/lib/types";
import { getCases, SEED_SAMPLE_CASES } from "@/lib/supabase";
import UrgencyBadge from "@/components/UrgencyBadge";

export default function AshaDashboardPage() {
  const { language, t } = useI18n();

  const [selectedVillage, setSelectedVillage] = useState<string>("all");
  const [cases, setCases] = useState<CaseRecord[]>(SEED_SAMPLE_CASES);
  const [loading, setLoading] = useState<boolean>(false);

  // Load cases
  const loadData = async (villageFilter?: string) => {
    setLoading(true);
    try {
      const data = await getCases(villageFilter === "all" ? undefined : villageFilter);
      setCases(data);
    } catch (err) {
      console.error("Failed to load cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedVillage);
  }, [selectedVillage]);

  // Aggregate stats
  const totalCases = cases.length;
  const emergencies = cases.filter((c) => c.urgency === "emergency").length;
  const urgentCases = cases.filter((c) => c.urgency === "urgent_today").length;
  const soonCases = cases.filter((c) => c.urgency === "see_clinic_soon").length;
  const homeCareCases = cases.filter((c) => c.urgency === "home_care").length;

  // Chart 1: Urgency Split
  const urgencyPieData = [
    { name: "Emergency", value: emergencies, color: "#DC2626" },
    { name: "Urgent Today", value: urgentCases, color: "#F97316" },
    { name: "See Clinic Soon", value: soonCases, color: "#EAB308" },
    { name: "Home Care", value: homeCareCases, color: "#16A34A" },
  ].filter((d) => d.value > 0);

  // Chart 2: Cases by Village
  const villageCounts: Record<string, number> = {};
  cases.forEach((c) => {
    villageCounts[c.village] = (villageCounts[c.village] || 0) + 1;
  });
  const villageBarData = Object.entries(villageCounts).map(([name, count]) => ({
    name,
    count,
  }));

  // Chart 3: Top Symptoms extraction
  const symptomKeywords = [
    { label: "Fever", match: ["fever", "ਬੁਖਾਰ", "बुखार"] },
    { label: "Chest Pain", match: ["chest", "ਛਾਤੀ", "सीने"] },
    { label: "Cough/Cold", match: ["cough", "cold", "ਖੰਘ", "खांसी"] },
    { label: "Breathing", match: ["breath", "ਸਾਹ", "सांस"] },
    { label: "Vomiting", match: ["vomit", "ਉਲਟੀ", "उल्टी", "stools", "ਦਸਤ"] },
    { label: "Injury/Trauma", match: ["wound", "cut", "ਸੱਟ", "घाव", "burn", "ਸੜ"] },
    { label: "Headache", match: ["headache", "ਸਿਰ", "सिर"] },
  ];

  const symptomBarData = symptomKeywords.map((sk) => {
    const count = cases.filter((c) => {
      const sym = (c.symptoms || "").toLowerCase();
      return sk.match.some((m) => sym.includes(m.toLowerCase()));
    }).length;
    return { name: sk.label, count };
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-teal-100 dark:border-slate-800 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-primary dark:text-teal-300 text-xs font-bold mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>Punjab Frontline Health Surveillance</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t("dashboard.title")}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
              {t("dashboard.subtitle")}
            </p>
          </div>

          {/* Village Filter dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="p-3 rounded-2xl border border-teal-200 dark:border-slate-700 bg-surface-light dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="all">{t("dashboard.allVillages")}</option>
              <option value="Sahnewal">Sahnewal (Ludhiana)</option>
              <option value="Verka">Verka (Amritsar)</option>
              <option value="Kartarpur">Kartarpur (Jalandhar)</option>
              <option value="Nabha">Nabha (Patiala)</option>
              <option value="Goniana">Goniana (Bathinda)</option>
              <option value="Kharar">Kharar (Mohali)</option>
              <option value="Mahilpur">Mahilpur (Hoshiarpur)</option>
              <option value="Dhuri">Dhuri (Sangrur)</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Cases */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-500">{t("dashboard.totalCases")}</span>
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-primary dark:text-teal-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalCases}
          </div>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-1 block">
            Screened in Community
          </span>
        </div>

        {/* Emergencies */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-950 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-urgency-emergency">{t("dashboard.emergencies")}</span>
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950 text-urgency-emergency">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-urgency-emergency">
            {emergencies}
          </div>
          <span className="text-[11px] text-red-600 font-semibold mt-1 block">
            Triggered 108 Alert
          </span>
        </div>

        {/* Urgent Today */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-orange-200 dark:border-orange-950 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-urgency-urgent">{t("dashboard.urgentCases")}</span>
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950 text-urgency-urgent">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-urgency-urgent">
            {urgentCases}
          </div>
          <span className="text-[11px] text-orange-600 font-semibold mt-1 block">
            Referred to CHC / PHC
          </span>
        </div>

        {/* Home Care */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-950 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-urgency-homecare">{t("dashboard.homeCareCases")}</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-urgency-homecare">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-urgency-homecare">
            {homeCareCases}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            ORS & Recovery Followup
          </span>
        </div>
      </div>

      {/* Visual Analytics with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgency Split PieChart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 shadow-card">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">
            {t("dashboard.urgencySplit")}
          </h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={urgencyPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {urgencyPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} cases`, name]}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cases by Village BarChart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 shadow-card">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">
            {t("dashboard.casesByVillage")}
          </h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={villageBarData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} cases`, "Screenings"]}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                />
                <Bar dataKey="count" fill="#0F766E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Symptoms BarChart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 shadow-card lg:col-span-2">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">
            {t("dashboard.topSymptoms")}
          </h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomBarData} layout="vertical">
                <XAxis type="number" stroke="#64748B" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={12} width={100} />
                <Tooltip
                  formatter={(val: any) => [`${val} patients`, "Reported"]}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Screenings Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-teal-100 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            {t("dashboard.recentCases")}
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            {t("dashboard.seedDataNotice")}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-teal-100 dark:border-slate-800 text-xs font-bold uppercase text-slate-500">
                <th className="py-3 px-3">{t("dashboard.time")}</th>
                <th className="py-3 px-3">{t("dashboard.village")}</th>
                <th className="py-3 px-3">{t("dashboard.age")}</th>
                <th className="py-3 px-3">{t("dashboard.urgency")}</th>
                <th className="py-3 px-3">{t("dashboard.symptomsCol")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-50 dark:divide-slate-800 text-sm">
              {cases.slice(0, 10).map((c) => (
                <tr key={c.id} className="hover:bg-mint/20 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-3 font-medium text-slate-500 text-xs whitespace-nowrap">
                    {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                    {c.village}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-medium">
                    {c.age_group} yrs ({c.gender || "N/A"})
                  </td>
                  <td className="py-3.5 px-3">
                    <UrgencyBadge urgency={c.urgency} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate font-medium">
                    {c.symptoms}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
