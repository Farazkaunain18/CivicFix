"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Search,
  Phone,
  Clock,
  Filter,
  Navigation,
  Crosshair,
  Building2,
  Stethoscope,
  Pill,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Facility } from "@/lib/types";
import rawFacilities from "@/data/facilities.json";
import { sortFacilitiesByDistance, DEFAULT_PUNJAB_COORDS } from "@/lib/geo";

// Dynamically import Leaflet Map to avoid SSR errors
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] sm:h-[450px] rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-teal-200 dark:border-slate-700 animate-pulse">
      <div className="flex flex-col items-center gap-2 text-slate-500">
        <MapPin className="w-8 h-8 text-primary animate-bounce" />
        <span className="text-sm font-semibold">Loading Punjab Healthcare Map...</span>
      </div>
    </div>
  ),
});

export default function FacilitiesPage() {
  const { language, t } = useI18n();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("");
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  // Initialize facilities sorted by default or GPS
  useEffect(() => {
    const lat = userLocation ? userLocation.lat : DEFAULT_PUNJAB_COORDS.lat;
    const lng = userLocation ? userLocation.lng : DEFAULT_PUNJAB_COORDS.lng;

    const sorted = sortFacilitiesByDistance(rawFacilities as Facility[], lat, lng);
    setFacilities(sorted);
  }, [userLocation]);

  // Request browser geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation not supported by this browser.");
      return;
    }

    setLocationStatus("Locating...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus("GPS Location updated!");
      },
      (err) => {
        console.warn("Geolocation denied or unavailable:", err.message);
        setLocationStatus(t("facilities.gpsError"));
        // Keep default Punjab location
        setUserLocation({
          lat: DEFAULT_PUNJAB_COORDS.lat,
          lng: DEFAULT_PUNJAB_COORDS.lng,
        });
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  // Filter & search facilities
  const filteredFacilities = facilities.filter((fac) => {
    const matchesType = filterType === "all" || fac.type === filterType;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      fac.name.toLowerCase().includes(query) ||
      fac.district.toLowerCase().includes(query) ||
      fac.address.toLowerCase().includes(query) ||
      fac.services.some((s) => s.toLowerCase().includes(query));

    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-teal-100 dark:border-slate-800 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-primary dark:text-teal-300 text-xs font-bold mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>25 Punjab Facilities Geocoded</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t("facilities.title")}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
              {t("facilities.subtitle")}
            </p>
          </div>

          {/* GPS Button */}
          <button
            type="button"
            onClick={handleGetLocation}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-surface-light dark:bg-slate-800 border border-teal-200 dark:border-slate-700 hover:border-primary text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm shadow-sm transition-all min-h-touch active:scale-95 shrink-0"
          >
            <Crosshair className="w-4 h-4 text-primary" />
            <span>{t("facilities.useMyLocation")}</span>
          </button>
        </div>

        {locationStatus && (
          <div className="mt-3 text-xs font-semibold text-teal-800 dark:text-teal-300">
            {locationStatus}
          </div>
        )}
      </div>

      {/* Interactive Leaflet Map */}
      <div>
        <LeafletMap
          facilities={filteredFacilities}
          userLocation={userLocation}
          selectedFacility={selectedFacility}
          onSelectFacility={(fac) => setSelectedFacility(fac)}
        />
      </div>

      {/* Controls: Search & Category Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-teal-100 dark:border-slate-800 shadow-card space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("facilities.searchPlaceholder")}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-teal-200 dark:border-slate-700 bg-surface-light dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: t("facilities.filterAll"), icon: Building2 },
            { id: "hospital", label: t("facilities.filterHospital"), icon: Building2 },
            { id: "clinic", label: t("facilities.filterClinic"), icon: Stethoscope },
            { id: "pharmacy", label: t("facilities.filterPharmacy"), icon: Pill },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = filterType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all min-h-[40px] ${
                  isSelected
                    ? "bg-primary text-white shadow-soft"
                    : "bg-surface-light dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-teal-100 dark:border-slate-700 hover:border-primary"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Facilities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          <span>Showing {filteredFacilities.length} Facilities in Punjab</span>
          <span>Sorted by Distance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFacilities.map((fac) => {
            const isSelected = selectedFacility?.id === fac.id;
            return (
              <div
                key={fac.id}
                onClick={() => setSelectedFacility(fac)}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer shadow-card flex flex-col justify-between ${
                  isSelected
                    ? "border-primary bg-mint/20 dark:bg-slate-800 ring-2 ring-primary"
                    : "border-teal-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-300"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
                      {fac.name}
                    </h3>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0 ${
                        fac.type === "hospital"
                          ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                          : fac.type === "pharmacy"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                      }`}
                    >
                      {fac.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    {fac.address}, {fac.district} - {fac.pincode}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mb-4 font-semibold">
                    <div className="flex items-center gap-1 text-primary dark:text-teal-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{fac.distanceKm} km away</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{fac.timing}</span>
                    </div>
                  </div>

                  {/* Services tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {fac.services.map((svc, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-surface-light dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-teal-100 dark:border-slate-700"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Tap-to-Call Button */}
                <div className="pt-3 border-t border-teal-100 dark:border-slate-800 flex items-center gap-3">
                  <a
                    href={`tel:${fac.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Call ${fac.name} at ${fac.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm active:scale-95 min-h-touch"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t("facilities.call")} ({fac.phone})</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
