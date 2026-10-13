import { GoogleGenerativeAI } from "@google/generative-ai";
import { TriageInput, TriageResponse, Language, UrgencyLevel } from "./types";
import { TRIAGE_SYSTEM_PROMPT, buildTriageUserPrompt } from "./triagePrompt";

// Intelligent clinical offline fallback when Gemini API key is missing or quota is exhausted
function getClinicalFallbackTriage(input: TriageInput): TriageResponse {
  const lang: Language = input.preferredLanguage || "pa";
  const sym = (input.symptoms || "").toLowerCase();
  const severity = input.severity;
  const isHighSeverity = severity === "severe";
  const isModerate = severity === "moderate";

  let urgency: UrgencyLevel = "home_care";
  let recFacility: "hospital" | "phc" | "clinic" | "pharmacy" | "none" = "none";

  if (isHighSeverity || input.duration.includes("week") || sym.includes("vomit") || sym.includes("blood") || sym.includes("fever")) {
    if (isHighSeverity) {
      urgency = "urgent_today";
      recFacility = "phc";
    } else if (isModerate) {
      urgency = "see_clinic_soon";
      recFacility = "clinic";
    } else {
      urgency = "home_care";
      recFacility = "pharmacy";
    }
  }

  const fallbacks: Record<Language, Record<UrgencyLevel, { summary: string; reasons: string[]; home_care: string[]; warning_signs: string[]; follow_up: string[] }>> = {
    pa: {
      emergency: {
        summary: "ਤੁਰੰਤ ਸਿਵਲ ਹਸਪਤਾਲ ਜਾਣਾ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ।",
        reasons: ["ਗੰਭੀਰ ਲੱਛਣ ਤੁਰੰਤ ਡਾਕਟਰੀ ਨਿਗਰਾਨੀ ਦੀ ਮੰਗ ਕਰਦੇ ਹਨ", "ਹਸਪਤਾਲ ਵਿੱਚ ਤੁਰੰਤ ਜਾਂਚ ਨਾਲ ਸਮੱਸਿਆ ਵਧਣ ਤੋਂ ਬਚ ਸਕਦੀ ਹੈ"],
        home_care: [],
        warning_signs: ["ਸਾਹ ਰੁਕਣਾ ਜਾਂ ਘੁੱਟਣਾ", "ਬੇਹੋਸ਼ੀ ਜਾਂ ਚੱਕਰ ਆਉਣਾ", "ਦਰਦ ਬਹੁਤ ਜ਼ਿਆਦਾ ਵਧ ਜਾਣਾ"],
        follow_up: [],
      },
      urgent_today: {
        summary: "ਸਥਿਤੀ ਨੂੰ ਵਿਗੜਨ ਤੋਂ ਬਚਾਉਣ ਲਈ ਅੱਜ ਹੀ ਨੇੜਲੇ ਸਰਕਾਰੀ ਕਲੀਨਿਕ ਜਾਂ ਪੀਐਚਸੀ ਦਿਖਾਓ।",
        reasons: [
          "ਲੱਛਣਾਂ ਦੀ ਤੀਬਰਤਾ ਡਾਕਟਰ ਦੁਆਰਾ ਸਰੀਰਕ ਜਾਂਚ ਦੀ ਮੰਗ ਕਰਦੀ ਹੈ",
          "ਸਮੇਂ ਸਿਰ ਜਾਂਚ ਨਾਲ ਬਿਮਾਰੀ ਵਧਣ ਤੋਂ ਰੋਕੀ ਜਾ ਸਕਦੀ ਹੈ",
        ],
        home_care: [
          "ਪੂਰਾ ਆਰਾਮ ਕਰੋ ਅਤੇ ਭਾਰੀ ਕੰਮ ਨਾ ਕਰੋ",
          "ਸਾਫ਼ ਉਬਲਿਆ ਪਾਣੀ ਅਤੇ ਓ.ਆਰ.ਐਸ (ਲੂਣ-ਖੰਡ ਘੋਲ) ਪੀਓ",
          "ਹਲਕਾ, ਤਾਜ਼ਾ ਅਤੇ ਪਚਣਯੋਗ ਖਾਣਾ ਖਾਓ",
        ],
        warning_signs: [
          "ਬੁਖ਼ਾਰ 103°F ਤੋਂ ਵੱਧ ਹੋਣਾ",
          "ਸਾਹ ਲੈਣ ਵਿੱਚ ਔਖ ਮਹਿਸੂਸ ਹੋਣਾ",
          "ਲਗਾਤਾਰ ਉਲਟੀਆਂ ਆਉਣੀਆਂ",
        ],
        follow_up: ["ਕੀ ਬੁਖ਼ਾਰ ਨਾਲ ਕਾਂਬਾ ਛਿੜ ਰਿਹਾ ਹੈ?", "ਕੀ ਪਿਸ਼ਾਬ ਦੀ ਮਾਤਰਾ ਘਟ ਗਈ ਹੈ?"],
      },
      see_clinic_soon: {
        summary: "ਅਗਲੇ 1-2 ਦਿਨਾਂ ਵਿੱਚ ਨੇੜਲੇ ਆਮ ਆਦਮੀ ਕਲੀਨਿਕ ਜਾਂ ਪੀਐਚਸੀ ਜਾ ਕੇ ਜਾਂਚ ਕਰਵਾਓ।",
        reasons: [
          "ਲੱਛਣ ਦਰਮਿਆਨੇ ਹਨ ਪਰ ਡਾਕਟਰੀ ਸਲਾਹ ਦੀ ਲੋੜ ਹੈ",
          "ਜੇਕਰ ਕੁਝ ਦਿਨਾਂ ਵਿੱਚ ਸੁਧਾਰ ਨਾ ਹੋਵੇ ਤਾਂ ਲੈਬ ਟੈਸਟ ਜ਼ਰੂਰੀ ਹੋ ਸਕਦੇ ਹਨ",
        ],
        home_care: [
          "ਗਰਮ ਪਾਣੀ ਅਤੇ ਤਰਲ ਪਦਾਰਥ ਵੱਧ ਪੀਓ",
          "ਚੰਗੀ ਨੀਂਦ ਲਓ ਅਤੇ ਆਰਾਮ ਕਰੋ",
          "ਧੂੜ, ਧੂੰਏਂ ਅਤੇ ਠੰਢੀਆਂ ਚੀਜ਼ਾਂ ਤੋਂ ਪਰਹੇਜ਼ ਰੱਖੋ",
        ],
        warning_signs: [
          "ਲੱਛਣਾਂ ਦਾ ਅਚਾਨਕ ਤੇਜ਼ੀ ਨਾਲ ਵਧਣਾ",
          "ਖੰਘ ਵਿੱਚ ਖੂਨ ਆਉਣਾ ਜਾਂ ਤੇਜ਼ ਛਾਤੀ ਦਰਦ",
          "ਬਹੁਤ ਜ਼ਿਆਦਾ ਕਮਜ਼ੋਰੀ ਮਹਿਸੂਸ ਹੋਣੀ",
        ],
        follow_up: ["ਕੀ ਪਰਿਵਾਰ ਵਿੱਚ ਕਿਸੇ ਹੋਰ ਨੂੰ ਵੀ ਇਹ ਸਮੱਸਿਆ ਹੈ?"],
      },
      home_care: {
        summary: "ਲੱਛਣ ਹਲਕੇ ਲੱਗਦੇ ਹਨ। ਘਰੇਲੂ ਦੇਖਭਾਲ, ਆਰਾਮ ਅਤੇ ਨਿਗਰਾਨੀ ਨਾਲ ਠੀਕ ਹੋ ਸਕਦੇ ਹਨ।",
        reasons: [
          "ਲੱਛਣ ਗੰਭੀਰ ਖ਼ਤਰੇ ਵੱਲ ਇਸ਼ਾਰਾ ਨਹੀਂ ਕਰਦੇ",
          "ਆਰਾਮ ਅਤੇ ਤਰਲ ਪਦਾਰਥਾਂ ਨਾਲ ਸਰੀਰ ਕੁਦਰਤੀ ਤੌਰ 'ਤੇ ਰਿਕਵਰ ਕਰਦਾ ਹੈ",
        ],
        home_care: [
          "ਖੁੱਲ੍ਹਾ ਸਾਫ਼ ਪਾਣੀ, ਨਿੰਬੂ ਪਾਣੀ ਜਾਂ ਓ.ਆਰ.ਐਸ ਪੀਓ",
          "ਪੂਰਾ ਆਰਾਮ ਕਰੋ ਅਤੇ ਤਣਾਅ ਨਾ ਲਓ",
          "ਤਾਜ਼ਾ ਫਲ ਅਤੇ ਦਲੀਆ ਵਰਗਾ ਹਲਕਾ ਭੋਜਨ ਲਓ",
          "ਸਰੀਰ ਨੂੰ ਗਰਮ ਅਤੇ ਆਰਾਮਦਾਇਕ ਰੱਖੋ",
        ],
        warning_signs: [
          "ਬੁਖ਼ਾਰ 3 ਦਿਨਾਂ ਤੋਂ ਵੱਧ ਸਮਾਂ ਰਹਿਣਾ",
          "ਸਾਹ ਚੜ੍ਹਨਾ ਜਾਂ ਗਲੇ ਵਿੱਚ ਸੋਜ ਵਧਣੀ",
          "ਕੁਝ ਵੀ ਖਾਣ-ਪੀਣ ਵਿੱਚ ਅਸਮਰੱਥ ਹੋਣਾ",
        ],
        follow_up: [],
      },
    },
    hi: {
      emergency: {
        summary: "तुरंत सिविल अस्पताल पहुंचना बहुत जरूरी है।",
        reasons: ["गंभीर लक्षण तुरंत डॉक्टरी निगरानी की मांग करते हैं", "अस्पताल में आपातकालीन जांच आवश्यक है"],
        home_care: [],
        warning_signs: ["सांस लेने में भारी तकलीफ", "बेहोशी या चक्कर आना", "दर्द असहनीय होना"],
        follow_up: [],
      },
      urgent_today: {
        summary: "समस्या को बढ़ने से रोकने के लिए आज ही नजदीकी सरकारी पीएचसी या क्लीनिक जाएं।",
        reasons: [
          "लक्षणों की गंभीरता डॉक्टर द्वारा जांच की मांग करती है",
          "सही समय पर जांच से बड़ी बीमारी से बचा जा सकता है",
        ],
        home_care: [
          "बिस्तर पर पूरा आराम करें",
          "उबला पानी और ओआरएस का घोल पिएं",
          "हल्का और सुपाच्य भोजन लें",
        ],
        warning_signs: [
          "तेज बुखार (103°F से अधिक)",
          "सांस फूलना या घबराहट",
          "लगातार उल्टी होना",
        ],
        follow_up: ["क्या बुखार के साथ कंपकंपी हो रही है?", "क्या पेशाब कम आ रहा है?"],
      },
      see_clinic_soon: {
        summary: "अगले 1-2 दिनों में नजदीकी स्वास्थ्य केंद्र जाकर डॉक्टर को दिखाएं।",
        reasons: [
          "लक्षण मध्यम हैं, सामान्य जांच की आवश्यकता है",
          "सुधार न होने पर बुनियादी खून या पेशाब की जांच जरूरी हो सकती है",
        ],
        home_care: [
          "पर्याप्त मात्रा में पानी व तरल पदार्थ पिएं",
          "धूल और धुएं से बचें",
          "पूरा आराम करें",
        ],
        warning_signs: [
          "लक्षणों का अचानक बहुत तेज होना",
          "खांसी में खून आना या सीने में जकड़न",
          "अत्यधिक कमजोरी",
        ],
        follow_up: ["क्या परिवार में किसी अन्य को भी ऐसे लक्षण हैं?"],
      },
      home_care: {
        summary: "लक्षण सामान्य हैं। घर पर आराम, तरल पदार्थ और निगरानी से सुधार संभव है।",
        reasons: [
          "गंभीर खतरे के संकेत नहीं हैं",
          "आराम और पर्याप्त पोषण से शरीर ठीक हो सकता है",
        ],
        home_care: [
          "स्वच्छ पानी, सूप और ओआरएस पिएं",
          "भरपूर नींद लें और आराम करें",
          "हल्का और ताजा भोजन करें",
          "शरीर का तापमान सामान्य रखें",
        ],
        warning_signs: [
          "बुखार 3 दिन से अधिक टिकना",
          "सांस लेने में कठिनाई शुरू होना",
          "पानी भी न पच पाना",
        ],
        follow_up: [],
      },
    },
    en: {
      emergency: {
        summary: "Immediate emergency hospital care is required.",
        reasons: ["Critical symptoms requiring hospital stabilization", "Risk of rapid clinical deterioration"],
        home_care: [],
        warning_signs: ["Severe breathing difficulty", "Loss of consciousness", "Uncontrolled symptoms"],
        follow_up: [],
      },
      urgent_today: {
        summary: "Visit a doctor or Community Health Centre today for clinical evaluation.",
        reasons: [
          "Symptom intensity warrants same-day medical assessment",
          "Early intervention prevents further complications",
        ],
        home_care: [
          "Rest comfortably in bed",
          "Sip clean boiled water and Oral Rehydration Salts (ORS)",
          "Eat light, easy-to-digest nutritious foods",
        ],
        warning_signs: [
          "Fever above 103°F (39.5°C)",
          "Shortness of breath or rapid breathing",
          "Inability to keep liquids down",
        ],
        follow_up: ["Are you experiencing severe chills?", "Has urine output significantly decreased?"],
      },
      see_clinic_soon: {
        summary: "Schedule a visit to your local clinic or Primary Health Centre in the next 1-2 days.",
        reasons: [
          "Symptoms are moderate and require routine clinical inspection",
          "Basic laboratory tests may be indicated if not resolving",
        ],
        home_care: [
          "Stay well hydrated with warm liquids",
          "Rest adequately and avoid strenuous physical labor",
          "Protect against environmental smoke and dust",
        ],
        warning_signs: [
          "Sudden worsening of symptoms",
          "Coughing up blood or intense localized pain",
          "Extreme fatigue or dizziness",
        ],
        follow_up: ["Is anyone else in your household experiencing similar symptoms?"],
      },
      home_care: {
        summary: "Symptoms appear mild. Focus on rest, hydration, and monitoring at home.",
        reasons: [
          "No emergency danger flags present",
          "Body recovery is supported by simple fluids and rest",
        ],
        home_care: [
          "Drink plenty of fluids (ORS, clean water, warm broth)",
          "Get restful sleep and avoid physical strain",
          "Eat small, nutritious, freshly prepared meals",
          "Keep warm and observe how you feel over 24-48 hours",
        ],
        warning_signs: [
          "Fever lasting more than 3 consecutive days",
          "Developing difficulty breathing or swallowing",
          "Inability to stay hydrated",
        ],
        follow_up: [],
      },
    },
  };

  const selected = fallbacks[lang]?.[urgency] || fallbacks.en[urgency];

  return {
    urgency,
    summary: selected.summary,
    reasons: selected.reasons,
    home_care: (urgency as string) === "emergency" ? [] : selected.home_care,
    warning_signs: selected.warning_signs,
    follow_up_questions: selected.follow_up,
    recommended_facility_type: recFacility,
    disclaimer: "This is guidance, not a medical diagnosis.",
  };
}

export async function triageWithGemini(input: TriageInput): Promise<TriageResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    // Graceful offline fallback
    return getClinicalFallbackTriage(input);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash which is fast and reliable for JSON schema responses
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: TRIAGE_SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const userPrompt = buildTriageUserPrompt(input);
    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    if (!responseText) {
      return getClinicalFallbackTriage(input);
    }

    // Clean any accidental markdown wrappers
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const parsed = JSON.parse(cleanJson) as TriageResponse;

    // Validate required fields
    const validUrgencies: UrgencyLevel[] = ["emergency", "urgent_today", "see_clinic_soon", "home_care"];
    if (!validUrgencies.includes(parsed.urgency)) {
      parsed.urgency = "see_clinic_soon";
    }

    if (!Array.isArray(parsed.reasons)) parsed.reasons = [];
    if (!Array.isArray(parsed.home_care)) parsed.home_care = [];
    if (!Array.isArray(parsed.warning_signs)) parsed.warning_signs = [];
    if (!Array.isArray(parsed.follow_up_questions)) parsed.follow_up_questions = [];

    // Rule 4 & 5: emergency must have empty home_care
    if (parsed.urgency === "emergency") {
      parsed.home_care = [];
    }

    parsed.disclaimer = "This is guidance, not a medical diagnosis.";

    return parsed;
  } catch (error) {
    console.warn("Gemini API call encountered an issue, falling back to clinical rule engine:", error);
    return getClinicalFallbackTriage(input);
  }
}
