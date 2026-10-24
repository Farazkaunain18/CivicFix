"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  RotateCcw,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  FlipHorizontal,
  Sparkles,
} from "lucide-react";

interface DeviceCameraCaptureProps {
  currentPhoto: string | null;
  onPhotoCaptured: (photoDataUrl: string) => void;
  onClearPhoto?: () => void;
}

export default function DeviceCameraCapture({
  currentPhoto,
  onPhotoCaptured,
  onClearPhoto,
}: DeviceCameraCaptureProps) {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera stream when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async (mode: "environment" | "user" = facingMode) => {
    setCameraError(null);
    stopCamera();

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not supported by your browser. Please use file upload.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn("Camera start failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission was denied. You can still upload a photo from your files.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera device was found on this system. Please upload a photo instead.");
      } else {
        setCameraError("Unable to access device camera: " + (err.message || "Unknown error"));
      }
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    stopCamera();
    onPhotoCaptured(dataUrl);
  };

  const toggleFacingMode = () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startCamera(next);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        onPhotoCaptured(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {/* Active Camera Viewfinder */}
      {isCameraActive ? (
        <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-2xl">
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="w-full h-64 sm:h-80 object-cover"
          />

          {/* Camera Viewfinder Overlay Grid */}
          <div className="absolute inset-0 pointer-events-none border-2 border-indigo-400/40 m-4 rounded-xl flex items-center justify-center">
            <div className="w-12 h-12 border border-white/40 rounded-full" />
          </div>

          {/* Live Badge */}
          <div className="absolute top-3 left-3 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>LIVE CAMERA</span>
          </div>

          {/* Top Controls */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFacingMode}
              title="Flip Camera (Front/Rear)"
              className="p-2 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur transition-all"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Shutter Action Bar */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={captureSnapshot}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-indigo-900 border-4 border-indigo-500/80 shadow-2xl active:scale-90 transition-transform"
              title="Take Photo"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <Camera className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>
      ) : currentPhoto ? (
        /* Captured Photo Preview */
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm">
          <div className="relative w-full h-56 sm:h-64">
            <img
              src={currentPhoto}
              alt="Citizen Evidence"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Evidence Photo Attached</span>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-950 flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-[11px] text-slate-500 truncate">
              Stored as citizen photo evidence
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => startCamera()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Change File</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Prompt State */
        <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <Camera className="w-6 h-6" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Capture or Upload Physical Defect Photo
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Use your device camera to take a live photo of the pothole, streetlight, or leak, or upload from your files.
            </p>
          </div>

          {cameraError && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => startCamera()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-500/20 transition-all hover:scale-105"
            >
              <Camera className="w-4 h-4" />
              <span>Open Device Camera</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Upload Photo File</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
