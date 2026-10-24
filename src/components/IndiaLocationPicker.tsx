'use client';

import React, { useState, useEffect } from 'react';
import {
  INDIAN_STATES_AND_UTS,
  IndianStateUT,
  validateIndianPincode,
  isWithinIndia,
  formatIndianAddress,
  NormalizedIndianAddress,
  INDIAN_PRESET_LOCATIONS,
} from '@/lib/indiaGeo';
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  Building,
  Navigation,
  Globe2,
  Sparkles,
} from 'lucide-react';

interface IndiaLocationPickerProps {
  coords: { lat: number; lng: number };
  onCoordsChange: (coords: { lat: number; lng: number }) => void;
  onAddressChange: (normalized: NormalizedIndianAddress) => void;
  onValidationChange: (isValid: boolean, error?: string) => void;
  className?: string;
}

export const IndiaLocationPicker: React.FC<IndiaLocationPickerProps> = ({
  coords,
  onCoordsChange,
  onAddressChange,
  onValidationChange,
  className = '',
}) => {
  // Default to Delhi (NCT)
  const [selectedState, setSelectedState] = useState<string>('Delhi (NCT)');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('New Delhi');
  const [city, setCity] = useState<string>('New Delhi');
  const [street, setStreet] = useState<string>('Outer Circle, Connaught Place');
  const [pincode, setPincode] = useState<string>('110001');

  // Boundary verification
  const isCoordInsideIndia = isWithinIndia(coords.lat, coords.lng);
  const isPincodeValid = validateIndianPincode(pincode);

  // Available districts for selected state
  const currentStateObj = INDIAN_STATES_AND_UTS.find((s) => s.name === selectedState);
  const districtList = currentStateObj?.districts || [];

  // Update district when state changes
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const found = INDIAN_STATES_AND_UTS.find((s) => s.name === newState);
    if (found && found.districts.length > 0) {
      setSelectedDistrict(found.districts[0]);
    }
  };

  // Sync normalized address and validity upwards
  useEffect(() => {
    const coordOk = isWithinIndia(coords.lat, coords.lng);
    const pinOk = validateIndianPincode(pincode);
    const streetOk = street.trim().length >= 3;
    const cityOk = city.trim().length >= 2;

    if (!coordOk) {
      onValidationChange(
        false,
        `Detected coordinates (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}) are outside India. CivicFix accepts reports only within India.`
      );
      return;
    }

    if (!pinOk) {
      onValidationChange(
        false,
        'Invalid PIN Code. Please enter a valid 6-digit Indian Postal Code.'
      );
      return;
    }

    if (!streetOk || !cityOk) {
      onValidationChange(false, 'Please provide street and city/town.');
      return;
    }

    const normalized = formatIndianAddress({
      street,
      city,
      district: selectedDistrict,
      state: selectedState,
      pincode,
    });

    onAddressChange(normalized);
    onValidationChange(true);
  }, [coords, selectedState, selectedDistrict, city, street, pincode]);

  const handleApplyPreset = (preset: (typeof INDIAN_PRESET_LOCATIONS)[0]) => {
    setSelectedState(preset.state);
    setSelectedDistrict(preset.district);
    setCity(preset.city);
    setStreet(preset.street);
    setPincode(preset.pincode);
    onCoordsChange({ lat: preset.lat, lng: preset.lng });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* India Geographic Boundary Status Alert */}
      <div
        className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
          isCoordInsideIndia
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-950/30 border-rose-500/40 text-rose-300 animate-pulse'
        }`}
      >
        <div className="flex items-center gap-2">
          {isCoordInsideIndia ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <div>
            <span className="font-bold">
              {isCoordInsideIndia
                ? '🇮🇳 Sovereign Territory Verified: Inside India'
                : '🚫 Location Outside India Rejected'}
            </span>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {isCoordInsideIndia
                ? `GPS Telemetry (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}) is verified within Republic of India.`
                : `Coordinates (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}) are outside India. Reports are restricted to Indian territory.`}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-900 border border-slate-700 shrink-0">
          India Only
        </span>
      </div>

      {/* 1-Click Indian City Presets */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Select: Verified Indian Metros</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {INDIAN_PRESET_LOCATIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-2 rounded-lg bg-slate-950 hover:bg-indigo-950/40 text-left border border-slate-800 hover:border-indigo-500/50 transition-all group"
            >
              <div className="font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                {preset.city}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                PIN: {preset.pincode}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Administrative Division Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* State / UT */}
        <div>
          <label className="block font-medium text-slate-300 mb-1">
            Indian State / Union Territory *
          </label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {INDIAN_STATES_AND_UTS.map((s) => (
              <option key={s.code} value={s.name}>
                {s.name} ({s.type === 'ut' ? 'UT' : 'State'})
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block font-medium text-slate-300 mb-1">
            District *
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {districtList.map((d, idx) => (
              <option key={idx} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* City / Town */}
        <div>
          <label className="block font-medium text-slate-300 mb-1">
            City / Town / Tehsil *
          </label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. New Delhi / Bengaluru / Ludhiana"
            className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* 6-Digit PIN Code */}
        <div>
          <label className="block font-medium text-slate-300 mb-1 flex items-center justify-between">
            <span>Postal PIN Code (6 digits) *</span>
            {pincode && (
              <span
                className={`text-[10px] font-bold ${
                  isPincodeValid ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPincodeValid ? '✓ Valid PIN' : '✗ 6 digits (1-9)'}
              </span>
            )}
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="e.g. 110001"
            className={`w-full px-3 py-2 rounded-xl border bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 ${
              isPincodeValid
                ? 'border-slate-700 focus:ring-indigo-500/50'
                : 'border-rose-500/60 focus:ring-rose-500/50'
            }`}
          />
        </div>
      </div>

      {/* Street / Landmark Address */}
      <div className="text-xs">
        <label className="block font-medium text-slate-300 mb-1">
          Street / Crossroad / Ward Landmark *
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="e.g. Outer Circle, Near Metro Gate 2"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Normalized Address Preview */}
      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
          Normalized Indian Postal Address
        </span>
        <p className="font-medium text-slate-200 mt-1 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>
            {street.trim() || '[Street]'}, {city.trim() || '[City]'}, {selectedDistrict},{' '}
            {selectedState} - {pincode.trim() || '[PIN]'}, India
          </span>
        </p>
      </div>
    </div>
  );
};
