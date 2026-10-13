"use client";

import React, { useEffect, useRef } from "react";
import { Facility } from "@/lib/types";

interface LeafletMapProps {
  facilities: Facility[];
  userLocation: { lat: number; lng: number } | null;
  selectedFacility: Facility | null;
  onSelectFacility: (fac: Facility) => void;
}

export default function LeafletMap({
  facilities,
  userLocation,
  selectedFacility,
  onSelectFacility,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const centerLat = userLocation?.lat || (facilities[0]?.lat ?? 30.9084);
      const centerLng = userLocation?.lng || (facilities[0]?.lng ?? 75.8573);

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 10,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add User Location Marker if available
      if (userLocation) {
        const userIcon = L.divIcon({
          className: "custom-user-marker",
          html: `
            <div style="background-color: #0284C7; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(2, 132, 199, 0.7); animation: pulse 2s infinite;"></div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup("<b>Your Current Location</b><br/>ਤੁਹਾਡਾ ਮੌਜੂਦਾ ਸਥਾਨ");
      }

      // Add markers for all facilities
      markersRef.current = [];

      facilities.forEach((fac) => {
        let pinColor = "#0F766E"; // Teal for clinic
        let pinEmoji = "🏥";
        if (fac.type === "hospital") {
          pinColor = "#DC2626"; // Red for hospital
          pinEmoji = "🚑";
        } else if (fac.type === "pharmacy") {
          pinColor = "#16A34A"; // Green for pharmacy
          pinEmoji = "💊";
        }

        const customIcon = L.divIcon({
          className: `facility-pin-${fac.id}`,
          html: `
            <div style="background-color: ${pinColor}; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); cursor: pointer;">
              ${pinEmoji}
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([fac.lat, fac.lng], { icon: customIcon }).addTo(map);

        const popupContent = document.createElement("div");
        popupContent.style.minWidth = "200px";
        popupContent.style.padding = "4px";
        popupContent.innerHTML = `
          <div style="font-weight: 700; font-size: 14px; color: #0F172A; margin-bottom: 4px;">${fac.name}</div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 6px;">${fac.address}</div>
          ${fac.distanceKm !== undefined ? `<div style="font-size: 12px; font-weight: 600; color: #0F766E; margin-bottom: 8px;">📍 ${fac.distanceKm} km away</div>` : ""}
          <a href="tel:${fac.phone}" style="display: block; text-align: center; background-color: #0F766E; color: white; padding: 6px 12px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700;">
            📞 Call ${fac.phone}
          </a>
        `;

        marker.bindPopup(popupContent);
        marker.on("click", () => {
          onSelectFacility(fac);
        });

        markersRef.current.push({ id: fac.id, marker });
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [facilities, userLocation]);

  // Handle focus when a facility is selected from the list
  useEffect(() => {
    if (!selectedFacility || !mapInstanceRef.current) return;
    mapInstanceRef.current.setView([selectedFacility.lat, selectedFacility.lng], 14, {
      animate: true,
    });
    const found = markersRef.current.find((m) => m.id === selectedFacility.id);
    if (found) {
      found.marker.openPopup();
    }
  }, [selectedFacility]);

  return (
    <div className="relative w-full h-[360px] sm:h-[450px] rounded-2xl overflow-hidden border border-teal-200 dark:border-slate-800 shadow-soft">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
