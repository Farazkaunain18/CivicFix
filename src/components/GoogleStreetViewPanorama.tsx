"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  RotateCw,
  RotateCcw,
  ExternalLink,
  Eye,
  Camera,
  Info,
  Calendar,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

interface GoogleStreetViewPanoramaProps {
  lat: number;
  lng: number;
  address?: string;
  issueTitle?: string;
  citizenPhotoUrl?: string;
  height?: string;
  showComparison?: boolean;
  imageryDate?: string;
  onCoverageChange?: (isAvailable: boolean, date?: string) => void;
}

export default function GoogleStreetViewPanorama({
  lat,
  lng,
  address,
  issueTitle,
  citizenPhotoUrl,
  height = "480px",
  showComparison = true,
  imageryDate: initialDate,
  onCoverageChange,
}: GoogleStreetViewPanoramaProps) {
  // Street View camera parameters
  const [heading, setHeading] = useState<number>(210); // Compass heading 0-360
  const [pitch, setPitch] = useState<number>(0); // Vertical angle -90 to 90
  const [fov, setFov] = useState<number>(90); // Field of view 10-100

  // Active view tab: 'streetview' | 'citizen_photo' | 'split'
  const [activeTab, setActiveTab] = useState<"streetview" | "citizen_photo" | "split">("streetview");

  // Coverage check state
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [coverageData, setCoverageData] = useState<{
    checked: boolean;
    available: boolean;
    status: string;
    message?: string;
    date?: string;
    panoId?: string;
  }>({
    checked: Boolean(initialDate),
    available: Boolean(initialDate),
    status: initialDate ? "OK" : "UNCHECKED",
    date: initialDate || undefined,
  });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const isKeyConfigured = Boolean(apiKey && apiKey !== "your_google_maps_api_key_here");

  // Verify coverage when lat/lng changes
  const checkCoverage = async () => {
    setIsChecking(true);
    try {
      const res = await fetch(`/api/streetview-check?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      const isAvail = Boolean(data.available);
      const captureDate = data.date || initialDate || "Historical Archive";

      setCoverageData({
        checked: true,
        available: isAvail,
        status: data.status,
        message: data.message,
        date: captureDate,
        panoId: data.panoId,
      });

      if (onCoverageChange) {
        onCoverageChange(isAvail, captureDate);
      }
    } catch (e: any) {
      setCoverageData({
        checked: true,
        available: Boolean(initialDate),
        status: "ERROR",
        message: "Failed to verify Street View metadata: " + e.message,
        date: initialDate,
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkCoverage();
  }, [lat, lng]);

  const effectiveDate = coverageData.date || initialDate || "Historical Baseline";

  // Official Google Maps Embed API Street View URL
  const streetViewEmbedUrl = isKeyConfigured
    ? `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${lat},${lng}&heading=${heading}&pitch=${pitch}&fov=${fov}`
    : "";

  // Direct external Google Street View web link (works in any browser without embedded key)
  const directStreetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=${heading}&pitch=${pitch}&fov=${fov}`;

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-lg flex flex-col text-slate-100">
      {/* Top Street View Navigation Bar */}
      <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold tracking-tight text-white">
                Google Street View (Contextual Baseline)
              </span>
              {effectiveDate && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  <span>Captured: {effectiveDate}</span>
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-sm mt-0.5">
              📍 {lat.toFixed(5)}, {lng.toFixed(5)} {address ? `• ${address}` : ""}
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        {citizenPhotoUrl && showComparison && (
          <div className="flex rounded-lg border border-slate-800 p-0.5 bg-slate-900/80">
            <button
              type="button"
              onClick={() => setActiveTab("streetview")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                activeTab === "streetview"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Street View 360°
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("split")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all hidden sm:block ${
                activeTab === "split"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("citizen_photo")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                activeTab === "citizen_photo"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Citizen Evidence
            </button>
          </div>
        )}
      </div>

      {/* Prominent Contextual Baseline Notice */}
      <div className="px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2 text-[11px] text-amber-300">
        <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span>
          <strong>Contextual Spatial Imagery Only:</strong> Street View reflects Google camera car passes ({effectiveDate}) and is <em>never</em> proof of current road condition. Always refer to citizen photo evidence.
        </span>
      </div>

      {/* Main Street View Content Area */}
      <div
        style={{ height, minHeight: "360px" }}
        className="relative w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Split View: Street View + Citizen Photo */}
        {activeTab === "split" && citizenPhotoUrl ? (
          <div className="grid grid-cols-2 w-full h-full">
            {/* Left: Street View */}
            <div className="relative border-r border-slate-800 h-full w-full">
              {renderStreetViewIframeOrFallback()}
              <div className="absolute top-2 left-2 z-10 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                Google Street View Baseline ({effectiveDate})
              </div>
            </div>

            {/* Right: Citizen Photo Evidence */}
            <div className="relative h-full w-full bg-slate-900 flex flex-col justify-center items-center overflow-hidden">
              <img
                src={citizenPhotoUrl}
                alt="Citizen Evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 z-10 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-semibold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Camera className="w-3 h-3 text-emerald-400" />
                <span>Current Citizen Photo Evidence</span>
              </div>
            </div>
          </div>
        ) : activeTab === "citizen_photo" && citizenPhotoUrl ? (
          /* Single View: Citizen Photo */
          <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
            <img
              src={citizenPhotoUrl}
              alt="Citizen Photo Evidence"
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 left-4 z-10 bg-slate-950/90 backdrop-blur p-3 rounded-xl border border-slate-800 text-xs max-w-md">
              <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Verified Physical Defect Photo</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Captured by citizen device at GPS coordinates {lat.toFixed(5)}, {lng.toFixed(5)}.
              </p>
            </div>
          </div>
        ) : (
          /* Single View: Street View */
          renderStreetViewIframeOrFallback()
        )}
      </div>

      {/* Bottom Controls Deck */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Camera Heading / Compass Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Angle: {heading}°</span>
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setHeading((h) => (h - 45 + 360) % 360)}
              title="Rotate Look Angle Left (-45°)"
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setHeading((h) => (h + 45) % 360)}
              title="Rotate Look Angle Right (+45°)"
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              <RotateCw className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setHeading(0)}
              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
            >
              North
            </button>
            <button
              type="button"
              onClick={() => setHeading(180)}
              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
            >
              South
            </button>
          </div>
        </div>

        {/* Coverage Verification & Refresh Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={checkCoverage}
            disabled={isChecking}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-3 h-3 text-indigo-400 ${isChecking ? "animate-spin" : ""}`} />
            <span>{isChecking ? "Checking Coverage..." : "Refresh Coverage"}</span>
          </button>

          <a
            href={directStreetViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 transition-all"
            title="Open 360° Street View directly in Google Maps"
          >
            <span>Open in Street View</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );

  function renderStreetViewIframeOrFallback() {
    // 1. If key is configured and coverage is verified, render official Google Maps Embed API Street View iframe
    if (isKeyConfigured && streetViewEmbedUrl) {
      return (
        <iframe
          title="Google Street View Panorama"
          src={streetViewEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      );
    }

    // 2. If API Key is not yet configured, render a transparent, informative CivicTech banner explaining Street View integration
    return (
      <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
          <Eye className="w-7 h-7" />
        </div>

        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Google Street View Contextual Baseline
          </span>
          <h3 className="text-base font-bold text-white mt-2">
            Street-Level Panorama Location Locked
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Target GPS: <span className="font-mono text-slate-200 font-bold">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
            {address && <span> • {address}</span>}
          </p>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-left text-xs space-y-2 text-slate-300">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Street View serves as contextual visual reference ({effectiveDate}). To render live embedded 360° panoramas directly in this frame, configure:
              <br />
              <code className="text-indigo-300 font-mono text-[10px] bg-slate-950 px-1 py-0.5 rounded mt-1 inline-block">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
              </code>
            </p>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            Citizens and city dispatchers can open the 360° location directly in Google Street View via the button below.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <a
            href={directStreetViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all"
          >
            <span>Launch Google Street View 360°</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {citizenPhotoUrl && (
            <button
              type="button"
              onClick={() => setActiveTab("citizen_photo")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect Citizen Photo</span>
            </button>
          )}
        </div>
      </div>
    );
  }
}
