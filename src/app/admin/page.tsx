"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCivic } from "@/context/CivicContext";
import { useAuth } from "@/context/AuthContext";
import { CivicReport, IssueStatus, CivicDepartment } from "@/types/civic";
import ReportDetailModal from "@/components/ReportDetailModal";
import PriorityScoreBadge from "@/components/PriorityScoreBadge";
import { MunicipalAnalyticsView } from "@/components/MunicipalAnalyticsView";
import {
  Building2,
  KanbanSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Truck,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Eye,
  Plus,
  ShieldAlert,
  UserCheck,
  Camera,
  ThumbsUp,
  Activity,
} from "lucide-react";

export default function AdminKanbanPage() {
  const { reports, updateReportStatus, approveReviewTicket, resetToMockData } = useCivic();

  const { user, isAuthenticated, isAdmin, switchDemoAccount } = useAuth();

  // Mode: Kanban vs Performance Analytics
  const [activeTab, setActiveTab] = useState<"kanban" | "analytics">("kanban");

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<CivicReport | null>(null);

  // Dispatch Assignment Modal state
  const [dispatchModalTicket, setDispatchModalTicket] = useState<CivicReport | null>(null);
  const [selectedCrew, setSelectedCrew] = useState("Rapid Maintenance Team Alpha");
  const [dispatchNote, setDispatchNote] = useState("Dispatched high-priority work order under City SLA.");

  // Resolve Modal state with After Photo Proof
  const [resolveModalTicket, setResolveModalTicket] = useState<CivicReport | null>(null);
  const [resolutionNote, setResolutionNote] = useState("Field crew completed physical repair according to municipal code standards.");
  const [resolutionProofUrl, setResolutionProofUrl] = useState(
    "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80"
  );

  // Filtered reports
  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (selectedDept !== "all" && r.department !== selectedDept) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reports, selectedDept, searchQuery]);

  // Group columns
  const pendingReports = filtered.filter((r) => r.status === "pending" || r.status === "review_needed");
  const inProgressReports = filtered.filter((r) => r.status === "in_progress");
  const resolvedReports = filtered.filter((r) => r.status === "resolved");
  const reopenedReports = filtered.filter((r) => r.status === "reopened");

  // Crew options by department
  const crewOptions = [
    "Rapid Maintenance Team Alpha",
    "Metro Paving & Cold Patch Crew #2",
    "City Light & Grid Operations Tech 4",
    "Sanitation Compactor Truck #9",
    "Hydro-Emergency Water Isolation Unit 1",
    "Public Safety Barricade Squad",
  ];

  const handleConfirmDispatch = () => {
    if (!dispatchModalTicket) return;
    updateReportStatus(
      dispatchModalTicket.id,
      "in_progress",
      selectedCrew,
      dispatchNote
    );
    setDispatchModalTicket(null);
  };

  const handleConfirmResolve = () => {
    if (!resolveModalTicket) return;
    updateReportStatus(
      resolveModalTicket.id,
      "resolved",
      resolveModalTicket.assignedCrew,
      resolutionNote,
      resolutionProofUrl
    );
    setResolveModalTicket(null);
  };

  // Helper to render each Kanban Card
  const renderKanbanCard = (report: CivicReport, col: IssueStatus) => {
    const isNeedsReview = report.status === "review_needed";
    const isReopened = report.status === "reopened";

    return (
      <div
        key={report.id}
        onClick={() => setSelectedCard(report)}
        className={`p-4 rounded-xl bg-white dark:bg-slate-900 border shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer space-y-3 ${
          isReopened
            ? "border-rose-500/60 ring-1 ring-rose-500/30"
            : isNeedsReview
            ? "border-amber-500/60 ring-1 ring-amber-500/30"
            : "border-slate-200/90 dark:border-slate-800"
        }`}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <span className="font-mono text-[10px] font-bold text-slate-400">
            #{report.id}
          </span>
          {report.priorityScore && (
            <PriorityScoreBadge breakdown={report.priorityScore} size="sm" />
          )}
          {isNeedsReview && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Needs Review
            </span>
          )}
          {isReopened && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Disputed
            </span>
          )}
          {report.isRecurring && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Chronic (x{report.recurrenceCount})</span>
            </span>
          )}
        </div>

        {/* Thumbnail and Title */}
        <div className="flex gap-3">
          <img
            src={report.imageUrl}
            alt={report.title}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
              {report.title}
            </h3>
            <p className="text-[10px] text-slate-400 truncate mt-1">
              📍 {report.address}
            </p>
          </div>
        </div>

        {/* Meta Tags Bar */}
        <div className="text-[10px] space-y-1 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between text-slate-500">
            <span>Dept:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
              {report.department}
            </span>
          </div>
          {report.assignedCrew && (
            <div className="flex items-center justify-between text-slate-500">
              <span>Crew:</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate max-w-[140px]">
                {report.assignedCrew}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-slate-500">
            <span>Target SLA:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {report.status === "resolved" ? "Completed" : `${report.slaHoursRemaining}h remaining`}
            </span>
          </div>
        </div>

        {/* Card Action Controls */}
        <div
          className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setSelectedCard(report)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <Eye className="w-3 h-3" />
            <span>Details</span>
          </button>

          <div className="flex items-center gap-1.5">
            {isNeedsReview && (
              <button
                type="button"
                onClick={() => approveReviewTicket(report.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-sm"
              >
                <span>Approve Triage</span>
              </button>
            )}

            {(col === "pending" || isReopened) && !isNeedsReview && (
              <button
                type="button"
                onClick={() => setDispatchModalTicket(report)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm"
              >
                <Truck className="w-3 h-3" />
                <span>{isReopened ? "Re-dispatch" : "Dispatch"}</span>
              </button>
            )}

            {col === "in_progress" && (
              <>
                <button
                  type="button"
                  onClick={() => updateReportStatus(report.id, "pending")}
                  title="Revert to Intake Queue"
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setResolveModalTicket(report)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Resolve & Certify</span>
                </button>
              </>
            )}

            {col === "resolved" && (
              <button
                type="button"
                onClick={() => updateReportStatus(report.id, "in_progress")}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-amber-500"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reopen</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Municipal Admin Access Required
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAuthenticated
              ? `You are currently signed in as Citizen (${user?.fullName}). Municipal work order dispatch, SLA triage, and defect resolution certification require verified administrator credentials.`
              : "Access to the municipal dispatch portal requires an authorized administrator session."}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-left space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Role-Based Access Control (RBAC) Policy
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Citizens can report hazards, corroborate existing tickets, and verify repairs on the public feed. Only authorized city officials can change ticket statuses and dispatch field units.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
          <button
            type="button"
            onClick={() => switchDemoAccount("admin")}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            <span>Switch to Municipal Admin Demo</span>
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <span>Return to Citizen Feed</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Top Banner & Control Deck */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                City Operations Dispatch Hub
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Syncing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Municipal Kanban Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Triage AI-validated civic defect reports, review low-confidence submissions, assign maintenance crews, and attach resolution proof photos for public verification.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Intake Queue
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-amber-400 mt-0.5">
                {pendingReports.length}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Dispatched
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-indigo-400 mt-0.5">
                {inProgressReports.length}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Resolved
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-emerald-400 mt-0.5">
                {resolvedReports.length}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Disputed
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-rose-400 mt-0.5">
                {reopenedReports.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Command Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "kanban"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <KanbanSquare className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "analytics"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Municipal Analytics</span>
            </button>
          </div>

          {/* Department Filter (Visible when on Kanban) */}
          {activeTab === "kanban" && (
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="all">🏢 All Departments</option>
              <option value="Roads & Transportation">🛣️ Roads & Transportation</option>
              <option value="Sanitation & Waste">🗑️ Sanitation & Waste</option>
              <option value="Electrical & Lighting">💡 Electrical & Lighting</option>
              <option value="Water & Sewerage">💧 Water & Sewerage</option>
            </select>
          )}

          {/* Quick Search */}
          {activeTab === "kanban" && (
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tickets or address..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          )}
        </div>

        <button
          onClick={resetToMockData}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Kanban Mock Data</span>
        </button>
      </div>

      {/* Main View: Kanban vs Analytics */}
      {activeTab === "analytics" ? (
        <MunicipalAnalyticsView reports={reports} />
      ) : (
        /* 4-Column Enhanced Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Column 1: New & Review Intake */}
        <div className="space-y-4 bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 min-h-[560px] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                1. Intake & Review
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {pendingReports.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {pendingReports.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Intake queue clear
              </div>
            ) : (
              pendingReports.map((report) => renderKanbanCard(report, "pending"))
            )}
          </div>
        </div>

        {/* Column 2: Dispatched / In Progress */}
        <div className="space-y-4 bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 min-h-[560px] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                2. Dispatched
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {inProgressReports.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {inProgressReports.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No active crews dispatched
              </div>
            ) : (
              inProgressReports.map((report) => renderKanbanCard(report, "in_progress"))
            )}
          </div>
        </div>

        {/* Column 3: Resolved & Verified */}
        <div className="space-y-4 bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 min-h-[560px] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                3. Resolved Proof
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {resolvedReports.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {resolvedReports.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No resolved tickets
              </div>
            ) : (
              resolvedReports.map((report) => renderKanbanCard(report, "resolved"))
            )}
          </div>
        </div>

        {/* Column 4: Disputed & Reopened */}
        <div className="space-y-4 bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 min-h-[560px] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                4. Disputed Reopened
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {reopenedReports.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {reopenedReports.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Zero active citizen disputes
              </div>
            ) : (
              reopenedReports.map((report) => renderKanbanCard(report, "reopened"))
            )}
          </div>
        </div>
      </div>
      )}

      {/* Modal: Dispatch Crew */}
      {dispatchModalTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">
                  Dispatch Maintenance Crew
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                #{dispatchModalTicket.id}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assign a certified city maintenance unit to repair:{" "}
              <strong className="text-slate-900 dark:text-white">
                {dispatchModalTicket.title}
              </strong>
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Select Municipal Crew Unit
                </label>
                <select
                  value={selectedCrew}
                  onChange={(e) => setSelectedCrew(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {crewOptions.map((crew, idx) => (
                    <option key={idx} value={crew}>
                      {crew}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Dispatch Work Order Instructions
                </label>
                <textarea
                  rows={2}
                  value={dispatchNote}
                  onChange={(e) => setDispatchNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDispatchModalTicket(null)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Mark Resolved & Certified with After Photo Proof */}
      {resolveModalTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold">
                  Certify Repair & Upload After-Photo Proof
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                #{resolveModalTicket.id}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Attach on-site physical repair proof photo and supervisor certification notes for public verification:
            </p>

            {/* After Photo Proof Input */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Resolution Proof Image (After Photo URL)
              </label>
              <input
                type="text"
                value={resolutionProofUrl}
                onChange={(e) => setResolutionProofUrl(e.target.value)}
                placeholder="https://... photo of completed repair"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              {resolutionProofUrl && (
                <div className="mt-2 h-28 w-full rounded-lg overflow-hidden border border-slate-700 bg-black">
                  <img
                    src={resolutionProofUrl}
                    alt="After Photo Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Municipal Resolution Audit Note
              </label>
              <textarea
                rows={2}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setResolveModalTicket(null)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResolve}
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
              >
                Certify & Close Work Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Inspector */}
      <ReportDetailModal
        report={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
}
