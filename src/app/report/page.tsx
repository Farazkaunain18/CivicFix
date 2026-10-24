"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCivic } from "@/context/CivicContext";
import { useAuth } from "@/context/AuthContext";
import { IndiaLocationPicker } from "@/components/IndiaLocationPicker";
import { isWithinIndia, INDIAN_PRESET_LOCATIONS, NormalizedIndianAddress } from "@/lib/indiaGeo";
import { IssueCategory, IssueSeverity, CivicDepartment, CivicReport, DuplicateSuggestion } from "@/types/civic";
import DeviceCameraCapture from "@/components/DeviceCameraCapture";
import GoogleStreetViewPanorama from "@/components/GoogleStreetViewPanorama";
import DuplicateSuggestionCard from "@/components/DuplicateSuggestionCard";
import PriorityScoreBadge from "@/components/PriorityScoreBadge";
import AiTriageModal from "@/components/AiTriageModal";
import { VoiceReportDictation } from "@/components/VoiceReportDictation";
import { calculateSafetyPriority } from "@/lib/priorityScoring";
import { validateReportAi } from "@/lib/aiValidator";
import {
  checkRateLimit,
  saveDraftReport,
  loadDraftReport,
  clearDraftReport,
} from "@/lib/rateLimitAndDrafts";
import {
  Camera,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  Crosshair,
  Eye,
  Info,
  ShieldCheck,
  Clock,
  ThumbsUp,
  Activity,
} from "lucide-react";

export default function ReportPage() {
  const router = useRouter();
  const { addReport, checkDuplicates, supportExistingReport } = useCivic();

  const { user } = useAuth();

  // Issue Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory>("pothole");
  const [reportedBy, setReportedBy] = useState(user?.fullName || "Priya Sharma");

  // Citizen Evidence Photo (from device camera or file)
  const [photoUrl, setPhotoUrl] = useState<string>(
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
  );

  // GPS Coordinates & Location (Republic of India)
  const [address, setAddress] = useState("Outer Circle, Connaught Place, New Delhi, Delhi (NCT) - 110001, India");
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 28.6315,
    lng: 77.2167,
  });
  const [indianAddressDetails, setIndianAddressDetails] = useState({
    street: "Outer Circle, Near Metro Gate 2",
    city: "New Delhi",
    district: "New Delhi",
    state: "Delhi (NCT)",
    pincode: "110001",
  });
  const [isLocationValidIndia, setIsLocationValidIndia] = useState<boolean>(true);
  const [indiaLocationError, setIndiaLocationError] = useState<string | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(3.8);
  const [capturedTimestamp, setCapturedTimestamp] = useState<string>(
    new Date().toISOString()
  );
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Street View Coverage status
  const [streetViewAvailable, setStreetViewAvailable] = useState<boolean>(false);
  const [streetViewDate, setStreetViewDate] = useState<string | undefined>("Aug 2023");

  // Location Confirmation Checkbox
  const [isLocationConfirmed, setIsLocationConfirmed] = useState<boolean>(false);

  // Duplicate Suggestions Dismissal State
  const [dismissedDuplicates, setDismissedDuplicates] = useState<boolean>(false);

  // Validation Error State
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Network Connectivity & Offline Draft States
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(false);
  const [rateLimitNotice, setRateLimitNotice] = useState<string | null>(null);

  // AI-Assisted Recommendation State
  const [aiSuggestion, setAiSuggestion] = useState<{
    suggestedCategory?: IssueCategory;
    suggestedSeverity?: IssueSeverity;
    categoryConfidence?: number;
    severityConfidence?: number;
    needsHumanReview?: boolean;
    analysisMode?: string;
  } | null>(null);

  // AI Modal & submission states
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<CivicReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Monitor network connectivity & check saved draft
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Check if draft exists
      const saved = loadDraftReport();
      if (saved && saved.title) {
        setTitle(saved.title);
        setDescription(saved.description);
        setCategory(saved.category);
        setAddress(saved.address);
        setCoords({ lat: saved.lat, lng: saved.lng });
        if (saved.imageUrl) setPhotoUrl(saved.imageUrl);
        setHasRestoredDraft(true);
      }

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  // Auto-save draft on input change
  useEffect(() => {
    if (title.trim() || description.trim()) {
      saveDraftReport({
        id: "draft-current",
        title,
        description,
        category,
        severity: "medium",
        lat: coords.lat,
        lng: coords.lng,
        address,
        imageUrl: photoUrl,
        savedAt: new Date().toISOString(),
      });
    }
  }, [title, description, category, coords, address, photoUrl]);

  // Real-time AI recommendation evaluation
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (title.trim().length > 3 || description.trim().length > 5) {
        const res = await validateReportAi({
          imageUrl: photoUrl,
          category,
          title,
          description,
        });
        setAiSuggestion({
          suggestedCategory: res.suggestedCategory,
          suggestedSeverity: res.suggestedSeverity,
          categoryConfidence: res.categoryConfidence,
          severityConfidence: res.severityConfidence,
          needsHumanReview: res.needsHumanReview,
          analysisMode: res.analysisMode,
        });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [title, description, category, photoUrl]);

  // Quick 1-Click Indian City Presets
  const presets = INDIAN_PRESET_LOCATIONS;

  const applyPreset = (preset: (typeof presets)[0]) => {
    setTitle(preset.title);
    setCategory(preset.category as IssueCategory);
    const fullAddr = `${preset.street}, ${preset.city}, ${preset.district}, ${preset.state} - ${preset.pincode}, India`;
    setAddress(fullAddr);
    setIndianAddressDetails({
      street: preset.street,
      city: preset.city,
      district: preset.district,
      state: preset.state,
      pincode: preset.pincode,
    });
    setCoords({ lat: preset.lat, lng: preset.lng });
    setPhotoUrl(preset.photoUrl);
    setDescription(preset.description);
    setGpsAccuracy(3.5);
    setCapturedTimestamp(new Date().toISOString());
    setIsLocationValidIndia(true);
    setIsLocationConfirmed(true);
    setDismissedDuplicates(false);
  };

  // Check for duplicate reports in real-time
  const duplicateSuggestions = useMemo(() => {
    if (dismissedDuplicates) return [];
    return checkDuplicates(coords.lat, coords.lng, category, title, description);
  }, [coords, category, title, description, dismissedDuplicates, checkDuplicates]);

  // Real-time Preview of Safety Priority Scorecard
  const priorityPreview = useMemo(() => {
    const text = (title + " " + description).toLowerCase();
    let initialSeverity: IssueSeverity = "medium";
    if (text.includes("severe") || text.includes("rupture") || text.includes("burst") || category === "water_leak") {
      initialSeverity = "high";
    } else if (text.includes("minor") || text.includes("small")) {
      initialSeverity = "low";
    }

    return calculateSafetyPriority({
      category,
      severity: initialSeverity,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      title: title || "New Incident",
      description: description || "Defect report",
      address,
    });
  }, [category, title, description, address]);

  // Request GPS Permission & capture location
  const handleRequestGps = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser. Please type an address manually.");
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        const timestamp = new Date(position.timestamp).toISOString();

        // Check if detected GPS is within India
        if (!isWithinIndia(lat, lng)) {
          setIsLocating(false);
          setGpsError(
            `CivicFix currently accepts reports exclusively from within India. Your browser GPS (${lat.toFixed(4)}, ${lng.toFixed(4)}) is outside India. Please choose an Indian location from the selector below.`
          );
          setIsLocationValidIndia(false);
          return;
        }

        setCoords({ lat, lng });
        setGpsAccuracy(Math.round(accuracy * 10) / 10);
        setCapturedTimestamp(timestamp);
        setIsLocating(false);
        setIsLocationValidIndia(true);
        setDismissedDuplicates(false);

        setAddress(`GPS Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError("GPS permission denied. You can manually enter an address or choose a preset.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError("GPS position unavailable. Please check device location settings or enter address.");
        } else {
          setGpsError("GPS timeout: " + err.message);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSupportExisting = (existingId: string) => {
    supportExistingReport(existingId, "Corroborated by resident during intake flow.");
    router.push(`/dashboard?id=${existingId}`);
  };

  // Determine category routing and simulated AI severity
  const getAiAttributes = (cat: IssueCategory, desc: string): {
    severity: IssueSeverity;
    department: CivicDepartment;
  } => {
    const text = (desc + " " + title).toLowerCase();
    let severity: IssueSeverity = "medium";

    if (
      text.includes("severe") ||
      text.includes("rupture") ||
      text.includes("burst") ||
      text.includes("crater") ||
      text.includes("flooding") ||
      text.includes("hazard") ||
      cat === "water_leak"
    ) {
      severity = "high";
    } else if (text.includes("minor") || text.includes("small") || text.includes("cosmetic")) {
      severity = "low";
    }

    let department: CivicDepartment = "Roads & Transportation";
    if (cat === "garbage") department = "Sanitation & Waste";
    else if (cat === "streetlight") department = "Electrical & Lighting";
    else if (cat === "water_leak") department = "Water & Sewerage";
    else if (cat === "road_hazard") department = "Roads & Transportation";

    return { severity, department };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationWarning(null);

    if (!title.trim() || !address.trim() || !photoUrl) {
      setValidationWarning("Please provide a title, address, and photo evidence before submitting.");
      return;
    }

    if (!isLocationConfirmed) {
      setValidationWarning("Please confirm the location integrity verification checkbox before submitting.");
      return;
    }

    if (!isLocationValidIndia) {
      setValidationWarning(indiaLocationError || "CivicFix currently operates exclusively within India. Please choose an Indian location.");
      return;
    }

    // Check Report Rate Limit (max 3 reports / 5 min)
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed && !rateLimitNotice?.includes("Bypassed")) {
      setRateLimitNotice(
        `Rate limit active: Maximum ${rateCheck.maxReportsAllowed} reports allowed per ${rateCheck.windowMinutes} minutes. Please wait ${rateCheck.secondsRemaining}s before submitting another report.`
      );
      return;
    }

    setIsSubmitting(true);

    // AI-Assisted Validation
    const aiVal = await validateReportAi({
      imageUrl: photoUrl,
      category,
      title,
      description,
    });

    if (!aiVal.isValid) {
      setIsSubmitting(false);
      setValidationWarning(aiVal.feedbackNotes);
      return;
    }

    const { severity, department } = getAiAttributes(category, description);

    // Add report through context
    const createdReport = await addReport({
      title,
      description: description || "Citizen reported infrastructure defect requiring municipal inspection.",
      category,
      severity,
      department,
      address,
      lat: coords.lat,
      lng: coords.lng,
      imageUrl: photoUrl,
      reportedBy: reportedBy || user?.fullName || "Priya Sharma",
      userId: user?.id,
      userRole: user?.role,
      indianAddressDetails,
      gpsAccuracy: gpsAccuracy || undefined,
      capturedTimestamp,
      confirmedByCitizen: true,
      streetViewAvailable,
      streetViewDate,
      aiValidation: aiVal,
    });

    clearDraftReport();
    setHasRestoredDraft(false);

    setSubmittedReport(createdReport);
    setIsAiModalOpen(true);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Network Connectivity & Offline Mode Banner */}
      {!isOnline && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Offline Mode Active:</strong> You are currently disconnected from internet. All photos, GPS coordinates, and descriptions are auto-saved locally to your browser.
            </span>
          </div>
          <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-semibold text-[11px] shrink-0">
            Local Storage Safe
          </span>
        </div>
      )}

      {/* Restored Draft Alert */}
      {hasRestoredDraft && (
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Draft Restored:</strong> Recovered your previous unsaved report draft from device storage.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              clearDraftReport();
              setHasRestoredDraft(false);
              setTitle("");
              setDescription("");
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold"
          >
            Clear Draft
          </button>
        </div>
      )}

      {/* Rate Limit Notice */}
      {rateLimitNotice && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{rateLimitNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setRateLimitNotice("Bypassed for evaluation")}
            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] shrink-0"
          >
            Bypass Rate Limit (Demo)
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
          <span>Street-Level Citizen Intake & Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Report an Infrastructure Defect
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Capture live photo evidence and GPS telemetry. CivicFix performs AI validation, checks nearby duplicate reports, and cross-references Google Street View contextual panoramas.
        </p>
      </div>

      {/* 1-Click Speed Presets Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Hackathon Speed Test: Select 1-Click Preset with Verified Coordinates</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-left p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-sm transition-all text-xs group"
            >
              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {p.title}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                📍 {p.city}, {p.state} ({p.pincode})
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Duplicate Incident Suggestions Alert Card */}
      {duplicateSuggestions.length > 0 && (
        <DuplicateSuggestionCard
          suggestions={duplicateSuggestions}
          onSupportExisting={handleSupportExisting}
          onDismiss={() => setDismissedDuplicates(true)}
        />
      )}

      {/* Validation Warning Alert */}
      {validationWarning && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
          <div className="flex-1">
            <span className="font-bold">Submission Validation Notice: </span>
            <span>{validationWarning}</span>
          </div>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Photo & Details (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step 1: Category */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Step 1: Defect Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "pothole", label: "Pothole", icon: "🕳️" },
                { id: "garbage", label: "Garbage Overflow", icon: "🗑️" },
                { id: "streetlight", label: "Broken Light", icon: "💡" },
                { id: "water_leak", label: "Water Leakage", icon: "💧" },
                { id: "road_hazard", label: "Road Hazard", icon: "🚧" },
                { id: "other", label: "Other Issue", icon: "⚠️" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id as IssueCategory);
                    setDismissedDuplicates(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    category === cat.id
                      ? "bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* AI Category Recommendation Badge */}
            {aiSuggestion && aiSuggestion.suggestedCategory && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs flex items-center justify-between gap-2 animate-fade-in">
                <div className="flex items-center gap-1.5 text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    AI Suggestion: Detected <strong>{aiSuggestion.suggestedCategory.replace('_', ' ').toUpperCase()}</strong> ({Math.round((aiSuggestion.categoryConfidence || 0.85) * 100)}% match)
                  </span>
                </div>
                {category !== aiSuggestion.suggestedCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      if (aiSuggestion.suggestedCategory) setCategory(aiSuggestion.suggestedCategory);
                    }}
                    className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shrink-0"
                  >
                    Apply Suggestion
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Live Device Camera & Citizen Photo Evidence */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Step 2: Live Camera & Citizen Evidence
              </label>
              <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                <Camera className="w-3 h-3" /> Citizen Photo
              </span>
            </div>

            <DeviceCameraCapture
              currentPhoto={photoUrl}
              onPhotoCaptured={(dataUrl) => {
                setPhotoUrl(dataUrl);
                setCapturedTimestamp(new Date().toISOString());
              }}
            />
          </div>

          {/* Step 3: Issue Description & Title */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Step 3: Defect Details
            </label>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Headline / Problem Summary *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep pothole damaging tires after rainfall"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Observations & Severity Context
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe hazard size, road lane, water pressure, or pedestrian risk..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            </div>

            {/* Multilingual Voice Dictation: Hindi, Punjabi, English */}
            <VoiceReportDictation
              currentText={description}
              onTranscriptChange={setDescription}
            />

            {/* AI Real-Time Severity & Human Review Advisory */}
            {aiSuggestion && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>
                      AI Severity Suggestion: <strong className="text-white uppercase">{aiSuggestion.suggestedSeverity}</strong> ({Math.round((aiSuggestion.severityConfidence || 0.8) * 100)}% confidence)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {aiSuggestion.analysisMode === 'GEMINI_MULTIMODAL' ? 'Gemini 1.5' : 'Deterministic Demo'}
                  </span>
                </div>

                {aiSuggestion.needsHumanReview && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Brief description: Will route to Supervisor Review queue upon submission.</span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Reporting Citizen Name (Optional)
              </label>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                🔒 Privacy Protected: Displayed on public timelines as anonymized initials (e.g. Alex C.).
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: GPS & Google Street View Ground-Level Verification (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step 4: GPS Capture & Location */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Step 4: GPS Coordinates & Street Address
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </span>
            </div>

            {/* GPS Capture Button */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleRequestGps}
                disabled={isLocating}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-sm"
              >
                <Crosshair className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
                <span>{isLocating ? "Acquiring Device GPS..." : "Capture Device GPS Location"}</span>
              </button>
            </div>

            {gpsError && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{gpsError}</span>
              </div>
            )}

            {/* GPS Telemetry Metadata Card */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">GPS Accuracy</span>
                <p className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5">
                  {gpsAccuracy !== null ? `±${gpsAccuracy} meters` : "Manual Entry"}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Captured Timestamp</span>
                <p className="font-mono text-[11px] text-slate-900 dark:text-white mt-0.5 truncate">
                  {new Date(capturedTimestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* India-Only Location Selector: State/UT, District, City, Street, 6-Digit PIN */}
            <IndiaLocationPicker
              coords={coords}
              onCoordsChange={(newCoords) => setCoords(newCoords)}
              onAddressChange={(normalized) => {
                setAddress(normalized.formatted);
                setIndianAddressDetails({
                  street: normalized.street,
                  city: normalized.city,
                  district: normalized.district,
                  state: normalized.state,
                  pincode: normalized.pincode,
                });
              }}
              onValidationChange={(isValid, errMsg) => {
                setIsLocationValidIndia(isValid);
                setIndiaLocationError(errMsg || null);
              }}
            />
          </div>

          {/* Step 5: Google Street View Contextual Baseline */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Step 5: Google Street View Contextual Imagery
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Historical 360° street view panorama for location verification
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                Contextual Only
              </span>
            </div>

            {/* Street View Panorama Component */}
            <GoogleStreetViewPanorama
              lat={coords.lat}
              lng={coords.lng}
              address={address}
              citizenPhotoUrl={photoUrl}
              height="340px"
              showComparison={true}
              imageryDate={streetViewDate}
              onCoverageChange={(avail, date) => {
                setStreetViewAvailable(avail);
                if (date) setStreetViewDate(date);
              }}
            />
          </div>

          {/* Safety Priority Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Calculated Safety Priority
              </span>
              <span className="font-semibold text-white">
                {priorityPreview.tier.replace('_', ' ')} ({priorityPreview.totalScore}/100)
              </span>
            </div>
            <PriorityScoreBadge breakdown={priorityPreview} size="md" />
          </div>

          {/* Location Confirmation & Submission Guarantee */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-slate-900 dark:to-indigo-950/40 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Location Integrity Confirmation</span>
            </div>

            {/* Mandatory User Confirmation Checkbox */}
            <label className="flex items-start gap-3 p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer text-xs">
              <input
                type="checkbox"
                required
                checked={isLocationConfirmed}
                onChange={(e) => setIsLocationConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                I confirm that the captured GPS coordinates (
                <strong className="font-mono text-indigo-600 dark:text-indigo-400">
                  {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </strong>
                ) and street address accurately represent the physical defect location.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !isLocationConfirmed}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-md shadow-indigo-500/20 hover:shadow-glow"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? "Validating & Submitting..." : "Submit & Run AI Triage"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Simulated AI Processing Modal */}
      <AiTriageModal
        isOpen={isAiModalOpen}
        reportData={submittedReport}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
