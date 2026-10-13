"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface VoiceMicButtonProps {
  onTranscript: (text: string) => void;
}

export default function VoiceMicButton({ onTranscript }: VoiceMicButtonProps) {
  const { language, t } = useI18n();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    setErrorMessage(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Map language code
      const langCodes: Record<string, string> = {
        pa: "pa-IN",
        hi: "hi-IN",
        en: "en-IN",
      };
      recognition.lang = langCodes[language] || "pa-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");

        if (transcript) {
          onTranscript(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setErrorMessage("Microphone permission denied. Please allow microphone in browser.");
        } else if (event.error !== "no-speech") {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error("Speech Recognition initialization error:", err);
      setErrorMessage("Could not start microphone.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  if (!isSupported) {
    return (
      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        <span>{t("check.micNotSupported")}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        aria-label={isListening ? t("check.micStop") : t("check.micStart")}
        className={`relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-md active:scale-95 min-h-touch ${
          isListening
            ? "bg-urgency-emergency text-white animate-pulse"
            : "bg-teal-700 hover:bg-teal-800 text-white"
        }`}
      >
        {isListening ? (
          <>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <MicOff className="w-5 h-5 shrink-0" />
            <span>{t("check.micStop")}</span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5 shrink-0" />
            <span>{t("check.micStart")}</span>
          </>
        )}
      </button>

      {isListening && (
        <div className="mt-2 text-xs font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-1 animate-pulse">
          <Volume2 className="w-4 h-4" />
          <span>{t("check.micListening")}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 p-2 rounded-lg">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
