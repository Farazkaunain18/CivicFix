"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCivic } from "@/context/CivicContext";
import { useAuth } from "@/context/AuthContext";
import { CivicReport, IssueCategory, IssueSeverity, IssueStatus } from "@/types/civic";
import GoogleStreetViewPanorama from "@/components/GoogleStreetViewPanorama";
import ReportDetailModal from "@/components/ReportDetailModal";
import PriorityScoreBadge from "@/components/PriorityScoreBadge";
import Link from "next/link";
import {
  MapPin,
  Search,
  Filter,
  ThumbsUp,
  Clock,
  Sparkles,
  ShieldAlert,
  PlusCircle,
  Eye,
  SlidersHorizontal,
  Compass,
  List as ListIcon,
  CheckCircle2,
  Camera,
  Activity,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");

  const { reports, upvoteReport } = useCivic();
  const { user } = useAuth();

  // Filter & Search states
  const [userScope, setUserScope] = useState<"all" | "mine">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"priority" | "newest" | "upvotes" | "severity">("priority");

  // Selection states
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [detailModalReport, setDetailModalReport] = useState<CivicReport | null>(null);

  // Mobile layout switch: 'feed' or 'streetview'
  const [mobileView, setMobileView] = useState<"streetview" | "feed">("feed");

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = report.title.toLowerCase().includes(q);
          const matchesDesc = report.description.toLowerCase().includes(q);
          const matchesAddr = report.address.toLowerCase().includes(q);
          const matchesId = report.id.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesAddr && !matchesId) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== "all" && report.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (selectedStatus !== "all" && report.status !== selectedStatus) {
          return false;
        }

        // Severity filter
        if (selectedSeverity !== "all" && report.severity !== selectedSeverity) {
          return false;
        }

        // Citizen ownership scope filter ("All Public" vs "My Submissions")
        if (userScope === "mine") {
          const isMine =
            (report.userId && report.userId === user?.id) ||
            (user?.fullName && report.reportedBy.toLowerCase() === user.fullName.toLowerCase()) ||
            (user?.email && report.reportedBy.toLowerCase().includes(user.email.split('@')[0]));
          if (!isMine) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "priority") {
          const scoreA = a.priorityScore?.totalScore || 0;
          const scoreB = b.priorityScore?.totalScore || 0;
          return scoreB - scoreA;
        }
        if (sortBy === "upvotes") {
          return b.upvotes - a.upvotes;
        }
        if (sortBy === "severity") {
          const order = { high: 3, medium: 2, low: 1 };
          return order[b.severity] - order[a.severity];
        }
        // Newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [reports, searchQuery, selectedCategory, selectedStatus, selectedSeverity, sortBy]);

  // Set default selected report
  useEffect(() => {
    if (initialId && reports.length > 0) {
      const match = reports.find((r) => r.id === initialId);
      if (match) {
        setSelectedReport(match);
        return;
      }
    }
    if (!selectedReport && filteredReports.length > 0) {
      setSelectedReport(filteredReports[0]);
    }
  }, [initialId, reports, filteredReports, selectedReport]);

  // Helpers for time elapsed
  const getTimeElapsed = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const activeReport = selectedReport || filteredReports[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Ground-Level Street View Feed
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {filteredReports.length} Active Issues
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time neighborhood defect registry. Inspect 360° Google Street View contextual panoramas, compare live citizen photo evidence, and track municipal repairs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile toggle button between Street View and Feed */}
          <div className="md:hidden flex rounded-xl border border-slate-200 dark:border-slate-800 p-1 bg-white dark:bg-slate-900">
            <button
              onClick={() => setMobileView("feed")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                mobileView === "feed"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setMobileView("streetview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                mobileView === "streetview"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Street View</span>
            </button>
          </div>

          <Link
            href="/report"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Defect</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        {/* Ownership Scope Toggle ("All Public Reports" vs "My Submissions") */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setUserScope("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                userScope === "all"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              🇮🇳 All Public Reports ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setUserScope("mine")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                userScope === "mine"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>
                My Submissions (
                {
                  reports.filter(
                    (r) =>
                      (r.userId && r.userId === user?.id) ||
                      (user?.fullName && r.reportedBy.toLowerCase() === user.fullName.toLowerCase())
                  ).length
                }
                )
              </span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1">
            <span>Viewing:</span>
            <strong className="text-slate-700 dark:text-slate-200">
              {userScope === "all" ? "Republic of India Wards" : `${user?.fullName || "My"} Reported Tickets`}
            </strong>
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by title, keyword, address, or ticket #..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="all">All Categories</option>
              <option value="pothole">🕳️ Potholes</option>
              <option value="streetlight">💡 Streetlights</option>
              <option value="garbage">🗑️ Garbage Overflow</option>
              <option value="water_leak">💧 Water Leaks</option>
              <option value="road_hazard">🚧 Road Hazards</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="all">All Statuses</option>
              <option value="pending">📌 Pending</option>
              <option value="in_progress">🚜 In Progress</option>
              <option value="resolved">✅ Resolved</option>
              <option value="review_needed">⚠️ Needs Review</option>
              <option value="reopened">🔄 Reopened</option>
            </select>

            {/* Severity Dropdown */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="all">All Severities</option>
              <option value="high">🔴 High Severity</option>
              <option value="medium">🟡 Medium Severity</option>
              <option value="low">🟢 Low Severity</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="priority">⚡ Safety Priority (Default)</option>
              <option value="newest">🕒 Most Recent</option>
              <option value="upvotes">👍 Most Upvoted</option>
              <option value="severity">⚠️ Highest Severity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Google Street View Ground-Level Panorama (7 cols on Desktop) */}
        <div
          className={`lg:col-span-7 sticky top-20 space-y-3 ${
            mobileView === "streetview" ? "block" : "hidden lg:block"
          }`}
        >
          {activeReport ? (
            <div className="space-y-3">
              {/* Selected Issue Meta Card */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                      #{activeReport.id}
                    </span>
                    {activeReport.priorityScore && (
                      <PriorityScoreBadge breakdown={activeReport.priorityScore} size="sm" />
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        activeReport.severity === "high"
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          : activeReport.severity === "medium"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      }`}
                    >
                      {activeReport.severity}
                    </span>
                    <span className="text-xs text-slate-500 font-medium truncate">
                      {activeReport.department}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {activeReport.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setDetailModalReport(activeReport)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full Ticket</span>
                </button>
              </div>

              {/* Google Street View Panorama Viewer */}
              <GoogleStreetViewPanorama
                lat={activeReport.lat}
                lng={activeReport.lng}
                address={activeReport.address}
                issueTitle={activeReport.title}
                citizenPhotoUrl={activeReport.imageUrl}
                imageryDate={activeReport.streetViewDate}
                height="500px"
                showComparison={true}
              />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              <Compass className="w-10 h-10 mx-auto mb-2 text-slate-500" />
              <p className="text-xs font-semibold">Select an issue from the feed to view Google Street View panorama</p>
            </div>
          )}
        </div>

        {/* Right Side: Filterable List of Reports (5 cols on Desktop) */}
        <div
          className={`lg:col-span-5 space-y-3.5 ${
            mobileView === "feed" ? "block" : "hidden lg:block"
          }`}
        >
          {filteredReports.length === 0 ? (
            <div className="text-center py-16 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No issues match your current filters
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Try resetting your search query or switching categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                  setSelectedSeverity("all");
                }}
                className="mt-4 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredReports.map((report) => {
              const isSelected = activeReport?.id === report.id;

              const severityBadge =
                report.severity === "high"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                  : report.severity === "medium"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";

              const statusBadge =
                report.status === "resolved"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : report.status === "in_progress"
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                  : report.status === "review_needed"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  : report.status === "reopened"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                  : "bg-slate-500/10 text-slate-400 border-slate-500/20";

              return (
                <div
                  key={report.id}
                  onClick={() => {
                    setSelectedReport(report);
                  }}
                  className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer hover:shadow-md ${
                    isSelected
                      ? "border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-glow"
                      : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex gap-3.5">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-950/80 text-white">
                        #{report.id.replace("CF-2026-", "")}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Badges Bar */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          {report.priorityScore && (
                            <PriorityScoreBadge breakdown={report.priorityScore} size="sm" />
                          )}
                          <span
                            className={`px-2 py-0.2 text-[10px] font-bold rounded border uppercase ${severityBadge}`}
                          >
                            {report.severity}
                          </span>
                          <span
                            className={`px-2 py-0.2 text-[10px] font-semibold rounded border capitalize ${statusBadge}`}
                          >
                            {report.status.replace("_", " ")}
                          </span>
                          {report.isRecurring && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                              <span>⚠️ Chronic (x{report.recurrenceCount})</span>
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {getTimeElapsed(report.createdAt)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {report.title}
                        </h3>

                        {/* Address & Reporter */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <p className="truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span>{report.address}</span>
                          </p>
                          <span className="text-[10px] text-slate-400 ml-1 truncate">
                            by {report.publicReporterName}
                          </span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80">
                        {/* Upvote Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            upvoteReport(report.id);
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                            report.hasUpvoted
                              ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold"
                              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <ThumbsUp
                            className={`w-3.5 h-3.5 ${
                              report.hasUpvoted ? "fill-indigo-600 dark:fill-indigo-400" : ""
                            }`}
                          />
                          <span>{report.upvotes}</span>
                          <span className="text-[10px] hidden sm:inline">
                            {report.hasUpvoted ? "Confirmed" : "Confirm"}
                          </span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReport(report);
                              setMobileView("streetview");
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Street View</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailModalReport(report);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Ticket Details Inspection Modal */}
      <ReportDetailModal
        report={detailModalReport}
        onClose={() => setDetailModalReport(null)}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 mt-3">Loading Community Registry & Street View Panoramas...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
