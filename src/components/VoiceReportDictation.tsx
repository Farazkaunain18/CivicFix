'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Globe2, Sparkles, Check, AlertCircle } from 'lucide-react';

export type VoiceLanguageCode = 'en-IN' | 'hi-IN' | 'pa-IN';

interface VoiceReportDictationProps {
  currentText: string;
  onTranscriptChange: (text: string) => void;
  className?: string;
}

const SUPPORTED_LANGUAGES: {
  code: VoiceLanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
  samplePhrases: { text: string; label: string }[];
}[] = [
  {
    code: 'en-IN',
    label: 'English',
    nativeLabel: 'English (India)',
    flag: '🇮🇳',
    samplePhrases: [
      { text: 'Deep dangerous pothole right after the crosswalk damaging vehicle tires.', label: 'Pothole Defect' },
      { text: 'Streetlight has been out for three nights creating an unsafe pedestrian area.', label: 'Dark Streetlight' },
      { text: 'Severe water pipe leakage gushing onto the sidewalk and road.', label: 'Water Leak' },
    ],
  },
  {
    code: 'hi-IN',
    label: 'Hindi',
    nativeLabel: 'हिन्दी (Hindi)',
    flag: '🇮🇳',
    samplePhrases: [
      { text: 'सड़क पर बहुत गहरा गड्ढा है जिससे गाड़ियां दुर्घटनाग्रस्त हो रही हैं।', label: 'सड़क का गड्ढा' },
      { text: 'स्ट्रीट लाइट तीन दिनों से बंद है, सड़क पर रात में भारी अंधेरा रहता है।', label: 'खराब लाइट' },
      { text: 'कूड़ेदान भर कर सड़क पर फैल रहा है, तुरंत सफाई की आवश्यकता है।', label: 'कचरा फैलाव' },
    ],
  },
  {
    code: 'pa-IN',
    label: 'Punjabi',
    nativeLabel: 'ਪੰਜਾਬੀ (Punjabi)',
    flag: '🇮🇳',
    samplePhrases: [
      { text: 'ਮੁੱਖ ਸੜਕ ਤੇ ਵੱਡਾ ਟੋਆ ਪਿਆ ਹੋਇਆ ਹੈ ਜਿਸ ਨਾਲ ਗੱਡੀਆਂ ਦਾ ਨੁਕਸਾਨ ਹੋ ਰਿਹਾ ਹੈ।', label: 'ਸੜਕ ਤੇ ਟੋਆ' },
      { text: 'ਸਟਰੀਟ ਲਾਈਟ ਕਈ ਦਿਨਾਂ ਤੋਂ ਖਰਾਬ ਹੈ ਅਤੇ ਇਲਾਕੇ ਵਿੱਚ ਹਨੇਰਾ ਹੈ।', label: 'ਬੰਦ ਲਾਈਟ' },
      { text: 'ਪਾਣੀ ਦੀ ਪਾਈਪ ਲੀਕ ਹੋ ਰਹੀ ਹੈ ਅਤੇ ਰਸਤੇ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਾ ਹੈ।', label: 'ਪਾਣੀ ਲੀਕੇਜ' },
    ],
  },
];

export const VoiceReportDictation: React.FC<VoiceReportDictationProps> = ({
  currentText,
  onTranscriptChange,
  className = '',
}) => {
  const [selectedLang, setSelectedLang] = useState<VoiceLanguageCode>('en-IN');
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech Recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup abort
        }
      }
    };
  }, []);

  const startListening = () => {
    setErrorMessage(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setErrorMessage('Voice recognition is not supported in this browser. Please use keyboard or sample phrases below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText('');
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }

        if (finalTrans) {
          const space = currentText.length > 0 && !currentText.endsWith(' ') ? ' ' : '';
          const updated = `${currentText}${space}${finalTrans.trim()}`;
          onTranscriptChange(updated);
          setInterimText('');
        } else {
          setInterimText(interimTrans);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access denied. Please grant microphone permission in your browser address bar.');
        } else if (event.error === 'no-speech') {
          // Quiet timeout, keep listening or gentle notice
        } else {
          setErrorMessage(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setErrorMessage('Could not initialize voice recording. Please verify microphone permissions.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setInterimText('');
  };

  const handleApplyPhrase = (phrase: string) => {
    const space = currentText.length > 0 && !currentText.endsWith(' ') ? ' ' : '';
    const updated = `${currentText}${space}${phrase}`;
    onTranscriptChange(updated);
  };

  const activeLangConfig = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className={`p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs ${className}`}>
      {/* Header with Language Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>Multilingual Voice Dictation</span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                EN • HI • PA
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Speak in your language; transcribed text is directly editable below.
            </p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  if (isListening) stopListening();
                  setSelectedLang(lang.code);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Control Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 mb-3">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
            isListening
              ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>Record Voice in {activeLangConfig.label}</span>
            </>
          )}
        </button>

        {isListening ? (
          <div className="flex items-center gap-2 text-rose-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-xs font-medium">Listening to speech ({activeLangConfig.nativeLabel})...</span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 italic">
            Click to dictate via microphone or choose a quick defect phrase.
          </span>
        )}
      </div>

      {/* Interim live speech feedback */}
      {interimText && (
        <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-800/50 text-indigo-300 text-xs mb-3 italic animate-pulse">
          Transcribing: "{interimText}"
        </div>
      )}

      {/* Error / Fallback alert */}
      {errorMessage && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs mb-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Dictate Phrases in Selected Language */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Quick Dictate Templates ({activeLangConfig.nativeLabel}):
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activeLangConfig.samplePhrases.map((phrase, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPhrase(phrase.text)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] transition-all flex items-center gap-1 text-left"
              title={phrase.text}
            >
              <span>+</span>
              <span className="font-medium text-slate-200">{phrase.label}:</span>
              <span className="truncate max-w-[200px] text-slate-400">"{phrase.text}"</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
