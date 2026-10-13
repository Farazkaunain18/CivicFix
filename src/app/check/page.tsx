"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Users,
  Calendar,
  AlertCircle,
  Activity,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Bot,
  HelpCircle,
  Check,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import VoiceMicButton from "@/components/VoiceMicButton";
import { TriageInput, TriageResponse } from "@/lib/types";

export default function SymptomCheckPage() {
  const router = useRouter();
  const { language, t } = useI18n();

  // Form state
  const [step, setStep] = useState<number>(1);
  const [forWhom, setForWhom] = useState<"myself" | "child" | "parent" | "other">("myself");
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<"male" | "female" | "other">("female");
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [village, setVillage] = useState<string>("Sahnewal");
  const [symptoms, setSymptoms] = useState<string>("");
  const [duration, setDuration] = useState<string>("1 - 3 days");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("moderate");
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Common quick symptoms
  const quickSymptoms = [
    { key: "fever", label: t("check.symptoms.fever") },
    { key: "cough", label: t("check.symptoms.cough") },
    { key: "chestPain", label: t("check.symptoms.chestPain") },
    { key: "breathing", label: t("check.symptoms.breathing") },
    { key: "headache", label: t("check.symptoms.headache") },
    { key: "vomiting", label: t("check.symptoms.vomiting") },
    { key: "stomachPain", label: t("check.symptoms.stomachPain") },
    { key: "wound", label: t("check.symptoms.wound") },
    { key: "dizziness", label: t("check.symptoms.dizziness") },
    { key: "jointPain", label: t("check.symptoms.jointPain") },
  ];

  // Adaptive follow-up questions generator
  const getAdaptiveQuestions = () => {
    const text = (symptoms || "").toLowerCase();
    const qList: { id: string; question: string; options: string[] }[] = [];

    // General high-priority questions
    qList.push({
      id: "q_fluids",
      question:
        language === "pa"
          ? "ਕੀ ਮਰੀਜ਼ ਸਾਫ਼ ਪਾਣੀ ਜਾਂ ਤਰਲ ਪਦਾਰਥ ਆਸਾਨੀ ਨਾਲ ਪੀ ਰਿਹਾ ਹੈ?"
          : language === "hi"
          ? "क्या मरीज पानी या तरल पदार्थ आसानी से पी पा रहा है?"
          : "Can the patient drink liquids and keep them down?",
      options: [
        language === "pa" ? "ਹਾਂ, ਆਸਾਨੀ ਨਾਲ" : language === "hi" ? "हाँ, आसानी से" : "Yes, easily",
        language === "pa" ? "ਕੁਝ ਮੁਸ਼ਕਿਲ ਨਾਲ" : language === "hi" ? "थोड़ी कठिनाई से" : "With difficulty",
        language === "pa" ? "ਬਿਲਕੁਲ ਨਹੀਂ / ਉਲਟੀ ਆ ਜਾਂਦੀ ਹੈ" : language === "hi" ? "बिल्कुल नहीं / उल्टी हो जाती है" : "Cannot drink / Vomits immediately",
      ],
    });

    if (text.includes("fever") || text.includes("ਬੁਖਾਰ") || text.includes("बुखार")) {
      qList.push({
        id: "q_fever_chills",
        question:
          language === "pa"
            ? "ਕੀ ਬੁਖ਼ਾਰ ਦੇ ਨਾਲ ਕਾਂਬਾ ਛਿੜ ਰਿਹਾ ਹੈ ਜਾਂ ਪਿੰਡੇ 'ਤੇ ਦਾਣੇ ਨਿਕਲੇ ਹਨ?"
            : language === "hi"
            ? "क्या बुखार के साथ कंपकंपी या शरीर पर दाने हैं?"
            : "Is there shaking chills or skin rashes?",
        options: [
          language === "pa" ? "ਕਾਂਬਾ ਤੇ ਕੰਬਣੀ ਹੈ" : language === "hi" ? "कंपकंपी है" : "Yes, intense chills",
          language === "pa" ? "ਚਮੜੀ 'ਤੇ ਦਾਣੇ ਹਨ" : language === "hi" ? "शरीर पर दाने हैं" : "Skin rashes noticed",
          language === "pa" ? "ਨਹੀਂ, ਸਿਰਫ਼ ਬੁਖ਼ਾਰ ਹੈ" : language === "hi" ? "नहीं, सिर्फ बुखार है" : "No, only fever",
        ],
      });
    }

    if (text.includes("chest") || text.includes("breath") || text.includes("ਛਾਤੀ") || text.includes("ਸਾਹ") || text.includes("सांस")) {
      qList.push({
        id: "q_chest_exertion",
        question:
          language === "pa"
            ? "ਕੀ ਸਾਹ ਲੈਣ ਜਾਂ ਚੱਲਣ-ਫਿਰਨ ਵੇਲੇ ਦਰਦ ਹੋਰ ਵਧ ਜਾਂਦਾ ਹੈ?"
            : language === "hi"
            ? "क्या चलने या गहरी सांस लेने पर दर्द बढ़ जाता है?"
            : "Does chest pain worsen when walking or taking a deep breath?",
        options: [
          language === "pa" ? "ਹਾਂ, ਚੱਲਣ 'ਤੇ ਬਹੁਤ ਵਧਦਾ ਹੈ" : language === "hi" ? "हाँ, चलने पर बहुत बढ़ता है" : "Yes, severe on exertion",
          language === "pa" ? "ਸਿਰਫ਼ ਬੈਠਣ 'ਤੇ ਵੀ ਦਬਾਅ ਹੈ" : language === "hi" ? "बैठे रहने पर भी भारीपन है" : "Constant tight pressure",
          language === "pa" ? "ਨਹੀਂ" : language === "hi" ? "नहीं" : "No",
        ],
      });
    }

    if (text.includes("stomach") || text.includes("vomit") || text.includes("ਢਿੱਡ") || text.includes("ਉਲਟੀ") || text.includes("पेट")) {
      qList.push({
        id: "q_stomach_blood",
        question:
          language === "pa"
            ? "ਕੀ ਉਲਟੀ ਜਾਂ ਟੱਟੀ ਵਿੱਚ ਖੂਨ ਜਾਂ ਕਾਲਾ ਰੰਗ ਦੇਖਿਆ ਹੈ?"
            : language === "hi"
            ? "क्या उल्टी या दस्त में खून या काला रंग दिखा है?"
            : "Have you seen blood or black color in vomit or stool?",
        options: [
          language === "pa" ? "ਨਹੀਂ, ਆਮ ਪਾਣੀ ਵਰਗਾ ਹੈ" : language === "hi" ? "नहीं, सामान्य है" : "No, watery/normal",
          language === "pa" ? "ਹਾਂ, ਖੂਨ ਦੇ ਨਿਸ਼ਾਨ ਹਨ" : language === "hi" ? "हाँ, खून के निशान हैं" : "Yes, blood observed",
          language === "pa" ? "ਪਤਾ ਨਹੀਂ" : language === "hi" ? "पता नहीं" : "Not sure",
        ],
      });
    }

    // Mental alertness question
    qList.push({
      id: "q_alertness",
      question:
        language === "pa"
          ? "ਮਰੀਜ਼ ਦੀ ਹੋਸ਼ ਅਤੇ ਚੌਕਸੀ ਕਿਹੋ ਜਿਹੀ ਹੈ?"
          : language === "hi"
          ? "मरीज की मानसिक सतर्कता कैसी है?"
          : "How is the patient's consciousness and mental alertness?",
      options: [
        language === "pa" ? "ਬਿਲਕੁਲ ਸੁਚੇਤ ਅਤੇ ਗੱਲਬਾਤ ਕਰ ਰਹੇ ਹਨ" : language === "hi" ? "पूरी तरह होश में और बात कर रहे हैं" : "Alert and talking normally",
        language === "pa" ? "ਸੁਸਤ ਅਤੇ ਬਹੁਤ ਨੀਂਦਰ ਆ ਰਹੀ ਹੈ" : language === "hi" ? "सुस्त और बहुत नींद आ रही है" : "Drowsy and lethargic",
        language === "pa" ? "ਭੰਬਲਭੂਸਾ ਜਾਂ ਉਲਝਣ ਵਿੱਚ ਹਨ" : language === "hi" ? "उलझन या भ्रम में हैं" : "Confused / Disoriented",
      ],
    });

    // Duration progression question
    qList.push({
      id: "q_progression",
      question:
        language === "pa"
          ? "ਕੀ ਸਮੱਸਿਆ ਸਮੇਂ ਦੇ ਨਾਲ ਤੇਜ਼ੀ ਨਾਲ ਵਿਗੜ ਰਹੀ ਹੈ?"
          : language === "hi"
          ? "क्या बीमारी समय के साथ तेजी से बिगड़ रही है?"
          : "Is the illness worsening rapidly over hours?",
      options: [
        language === "pa" ? "ਹਾਂ, ਤੇਜ਼ੀ ਨਾਲ ਵਿਗੜ ਰਹੀ ਹੈ" : language === "hi" ? "हाँ, तेजी से बिगड़ रही है" : "Yes, getting worse rapidly",
        language === "pa" ? "ਇੱਕੋ ਜਿਹੀ ਹੈ" : language === "hi" ? "वैसी ही है" : "About the same",
        language === "pa" ? "ਹੌਲੀ-ਹੌਲੀ ਸੁਧਾਰ ਹੋ ਰਿਹਾ ਹੈ" : language === "hi" ? "थोड़ा सुधार दिख रहा है" : "Slowly improving",
      ],
    });

    return qList;
  };

  const handleAppendSymptom = (text: string) => {
    if (!symptoms) {
      setSymptoms(text);
    } else if (!symptoms.includes(text)) {
      setSymptoms(`${symptoms}, ${text}`);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    handleAppendSymptom(text);
  };

  const handleSubmit = async () => {
    if (!symptoms.trim()) {
      setErrorMessage(
        language === "pa"
          ? "ਕਿਰਪਾ ਕਰਕੇ ਲੱਛਣ ਦੱਸੋ ਜਾਂ ਮਾਈਕ ਰਾਹੀਂ ਬੋਲੋ।"
          : language === "hi"
          ? "कृपया लक्षण दर्ज करें या माइक दबाकर बोलें।"
          : "Please specify symptoms or use the microphone to speak."
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // Build extended symptom payload with adaptive answers
    const answersSummary = Object.entries(followUpAnswers)
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");

    const combinedSymptoms = answersSummary
      ? `${symptoms}. Clinical questions answered: ${answersSummary}`
      : symptoms;

    const payload: TriageInput = {
      age: Number(age),
      sex: gender,
      forWhom,
      isPregnant,
      symptoms: combinedSymptoms,
      duration,
      severity,
      preferredLanguage: language,
      village,
    };

    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Triage API error");
      }

      const data: TriageResponse = await res.json();

      // Store in sessionStorage for results page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("organigen_last_result", JSON.stringify(data));
        sessionStorage.setItem("organigen_last_input", JSON.stringify(payload));
      }

      router.push("/result");
    } catch (err: any) {
      console.error("Evaluation failed:", err);
      setErrorMessage(
        language === "pa"
          ? "ਮੁਲਾਂਕਣ ਦੌਰਾਨ ਗਲਤੀ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
          : language === "hi"
          ? "मूल्यांकन में समस्या आई। कृपया पुनः प्रयास करें।"
          : "Assessment failed. Please try again."
      );
      setLoading(false);
    }
  };

  const adaptiveQuestions = getAdaptiveQuestions();

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 pb-20">
      {/* Step Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-teal-100 dark:border-slate-800 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-primary dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4 shrink-0" />
            <span>
              {language === "pa" ? "ਪੜਾਅ" : language === "hi" ? "चरण" : "Step"} {step} of 4
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step
                    ? "w-8 bg-primary"
                    : s < step
                    ? "w-3 bg-teal-300 dark:bg-teal-700"
                    : "w-3 bg-slate-200 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t("check.title")}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
          {t("check.subtitle")}
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Wizard Steps */}
      <AnimatePresence mode="wait">
        {/* STEP 1: Who is it for & Basic Demographics */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-teal-100 dark:border-slate-800 shadow-card space-y-6"
          >
            {/* Question bubble */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-primary dark:text-teal-300 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-teal-50 dark:bg-slate-800/80 p-4 rounded-2xl text-slate-800 dark:text-slate-100 text-sm sm:text-base font-semibold">
                {t("check.step1")}
              </div>
            </div>

            {/* Who is this for selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "myself", label: t("check.forMyself"), icon: User },
                { id: "child", label: t("check.forChild"), icon: Users },
                { id: "parent", label: t("check.forParent"), icon: Users },
                { id: "other", label: t("check.forOther"), icon: User },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = forWhom === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setForWhom(item.id as any);
                      if (item.id === "child") setAge(4);
                      else if (item.id === "parent") setAge(65);
                    }}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all min-h-touch ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-soft"
                        : "bg-surface-light dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-teal-100 dark:border-slate-700 hover:border-primary"
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-center">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Age Input */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {t("check.ageLabel")}: <span className="text-primary font-extrabold text-lg">{age}</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-20 p-2.5 rounded-xl border border-teal-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold text-base"
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {t("check.genderLabel")}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "male", label: t("check.genderMale") },
                  { id: "female", label: t("check.genderFemale") },
                  { id: "other", label: t("check.genderOther") },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGender(g.id as any)}
                    className={`py-3 px-4 rounded-xl border-2 font-bold text-sm min-h-touch ${
                      gender === g.id
                        ? "bg-teal-700 text-white border-teal-700"
                        : "bg-surface-light dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-teal-100 dark:border-slate-700"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pregnancy Check (if female and childbearing age) */}
            {gender === "female" && age >= 14 && age <= 52 && (
              <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/50 space-y-2">
                <label className="block text-sm font-bold text-pink-900 dark:text-pink-300">
                  {t("check.pregnantLabel")}
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsPregnant(true)}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm min-h-touch ${
                      isPregnant
                        ? "bg-pink-600 text-white"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-pink-300"
                    }`}
                  >
                    {t("check.yes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPregnant(false)}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm min-h-touch ${
                      !isPregnant
                        ? "bg-pink-600 text-white"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-pink-300"
                    }`}
                  >
                    {t("check.no")}
                  </button>
                </div>
              </div>
            )}

            {/* Village selector */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {language === "pa" ? "ਪਿੰਡ / ਸ਼ਹਿਰ (ਪੰਜਾਬ)" : language === "hi" ? "गांव / शहर (पंजाब)" : "Village / Town (Punjab)"}
              </label>
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-teal-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm"
              >
                <option value="Sahnewal">Sahnewal (Ludhiana)</option>
                <option value="Kartarpur">Kartarpur (Jalandhar)</option>
                <option value="Verka">Verka (Amritsar)</option>
                <option value="Nabha">Nabha (Patiala)</option>
                <option value="Goniana">Goniana (Bathinda)</option>
                <option value="Kharar">Kharar (Mohali)</option>
                <option value="Mahilpur">Mahilpur (Hoshiarpur)</option>
                <option value="Dhuri">Dhuri (Sangrur)</option>
                <option value="Moga Rural">Moga Rural</option>
                <option value="Firozpur Rural">Firozpur Rural</option>
                <option value="Other Punjab Village">Other Punjab Village</option>
              </select>
            </div>

            {/* Next Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-800 text-white rounded-2xl font-bold text-base shadow-soft min-h-touch active:scale-95"
              >
                <span>{t("check.nextBtn")}</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Voice & Symptom description */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-teal-100 dark:border-slate-800 shadow-card space-y-6"
          >
            {/* Question bubble */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-primary dark:text-teal-300 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-teal-50 dark:bg-slate-800/80 p-4 rounded-2xl text-slate-800 dark:text-slate-100 text-sm sm:text-base font-semibold">
                {t("check.step2")}
              </div>
            </div>

            {/* Voice Input Section */}
            <div className="p-5 rounded-2xl bg-mint/40 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 flex flex-col items-center text-center space-y-3">
              <span className="text-xs uppercase font-bold text-teal-800 dark:text-teal-300 tracking-wider">
                {language === "pa"
                  ? "ਬੋਲ ਕੇ ਲੱਛਣ ਦੱਸੋ (ਪੰਜਾਬੀ / ਹਿੰਦੀ / ਅੰਗਰੇਜ਼ੀ)"
                  : language === "hi"
                  ? "बोलकर लक्षण बताएं (हिंदी / पंजाबी / अंग्रेजी)"
                  : "Speak symptoms in Punjabi / Hindi / English"}
              </span>
              <VoiceMicButton onTranscript={handleVoiceTranscript} />
            </div>

            {/* Symptom Input Textarea */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {language === "pa"
                  ? "ਦੱਸੇ ਗਏ ਲੱਛਣ (ਤੁਸੀਂ ਲਿਖ ਵੀ ਸਕਦੇ ਹੋ):"
                  : language === "hi"
                  ? "दर्ज किए गए लक्षण (आप लिख भी सकते हैं):"
                  : "Recorded symptoms (you can also edit or type):"}
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={t("check.symptomPlaceholder")}
                className="w-full p-4 rounded-2xl border border-teal-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-base focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Quick Tap Chips */}
            <div>
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {t("check.quickSymptomHeading")}
              </span>
              <div className="flex flex-wrap gap-2">
                {quickSymptoms.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => handleAppendSymptom(chip.label)}
                    className="px-3.5 py-2 rounded-xl bg-surface-light dark:bg-slate-800 border border-teal-200 dark:border-slate-700 hover:border-primary text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all hover:bg-teal-50 min-h-[38px] active:scale-95"
                  >
                    + {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nav buttons */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm min-h-touch"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>{t("check.backBtn")}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!symptoms.trim()) {
                    setErrorMessage(
                      language === "pa"
                        ? "ਕਿਰਪਾ ਕਰਕੇ ਲੱਛਣ ਚੁਣੋ ਜਾਂ ਬੋਲੋ।"
                        : language === "hi"
                        ? "कृपया लक्षण दर्ज करें या माइक दबाएं।"
                        : "Please provide symptoms before proceeding."
                    );
                    return;
                  }
                  setErrorMessage(null);
                  setStep(3);
                }}
                className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-800 text-white rounded-2xl font-bold text-base shadow-soft min-h-touch active:scale-95"
              >
                <span>{t("check.nextBtn")}</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Duration & Severity */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-teal-100 dark:border-slate-800 shadow-card space-y-6"
          >
            {/* Question bubble */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-primary dark:text-teal-300 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-teal-50 dark:bg-slate-800/80 p-4 rounded-2xl text-slate-800 dark:text-slate-100 text-sm sm:text-base font-semibold">
                {t("check.step3")}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {t("check.durationLabel")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "< 24 hours", label: t("check.duration1Day") },
                  { id: "1 - 3 days", label: t("check.durationFewDays") },
                  { id: "4 - 7 days", label: t("check.durationWeek") },
                  { id: "> 1 week", label: t("check.durationLong") },
                ].map((dur) => (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setDuration(dur.label)}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-sm min-h-touch transition-all ${
                      duration === dur.label
                        ? "bg-teal-700 text-white border-teal-700 shadow-sm"
                        : "bg-surface-light dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-teal-100 dark:border-slate-700"
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {t("check.severityLabel")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "mild",
                    label: t("check.severityMild"),
                    color: "border-emerald-300 text-emerald-800 dark:text-emerald-300",
                    selectedBg: "bg-emerald-600 text-white border-emerald-600",
                  },
                  {
                    id: "moderate",
                    label: t("check.severityModerate"),
                    color: "border-amber-300 text-amber-800 dark:text-amber-300",
                    selectedBg: "bg-amber-600 text-white border-amber-600",
                  },
                  {
                    id: "severe",
                    label: t("check.severitySevere"),
                    color: "border-red-300 text-red-800 dark:text-red-300",
                    selectedBg: "bg-red-600 text-white border-red-600",
                  },
                ].map((sev) => (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setSeverity(sev.id as any)}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-sm min-h-touch transition-all ${
                      severity === sev.id
                        ? sev.selectedBg
                        : `bg-surface-light dark:bg-slate-800 ${sev.color}`
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nav buttons */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm min-h-touch"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>{t("check.backBtn")}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-800 text-white rounded-2xl font-bold text-base shadow-soft min-h-touch active:scale-95"
              >
                <span>{t("check.nextBtn")}</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Adaptive 4-6 Follow-up questions & Submit */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-teal-100 dark:border-slate-800 shadow-card space-y-6"
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-primary dark:text-teal-300 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {t("check.step4")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {t("check.followUpHint")}
                </p>
              </div>
            </div>

            {/* Adaptive questions list */}
            <div className="space-y-4">
              {adaptiveQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-2xl bg-surface-light dark:bg-slate-800/80 border border-teal-100 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-200 dark:bg-teal-900 text-teal-800 dark:text-teal-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                      {q.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {q.options.map((opt) => {
                      const isSelected = followUpAnswers[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setFollowUpAnswers((prev) => ({
                              ...prev,
                              [q.id]: opt,
                            }))
                          }
                          className={`p-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-left flex items-center justify-between min-h-[42px] ${
                            isSelected
                              ? "bg-teal-700 text-white border-teal-700 shadow-sm"
                              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-teal-200/60 dark:border-slate-700 hover:border-primary"
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <Check className="w-4 h-4 shrink-0 ml-1 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Nav and Final Submit */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={loading}
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm min-h-touch"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>{t("check.backBtn")}</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary-800 disabled:opacity-70 text-white rounded-2xl font-extrabold text-base sm:text-lg shadow-floating min-h-touch active:scale-95 transition-all"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>{t("check.submitting")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("check.submitBtn")}</span>
                    <Sparkles className="w-5 h-5 shrink-0" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
