import { TriageInput, TriageResponse, Language } from "./types";

interface RedFlagRule {
  id: string;
  condition: (input: TriageInput, textLower: string) => boolean;
  messages: {
    en: {
      summary: string;
      reasons: string[];
      warning_signs: string[];
    };
    hi: {
      summary: string;
      reasons: string[];
      warning_signs: string[];
    };
    pa: {
      summary: string;
      reasons: string[];
      warning_signs: string[];
    };
  };
}

const RED_FLAG_RULES: RedFlagRule[] = [
  // 1. Chest Pain / Cardiac
  {
    id: "chest_pain",
    condition: (_, text) =>
      text.includes("chest pain") ||
      text.includes("chest tightness") ||
      text.includes("heart attack") ||
      text.includes("pressure in chest") ||
      text.includes("सीने में दर्द") ||
      text.includes("छाती में दर्द") ||
      text.includes("सीने में भारीपन") ||
      text.includes("ਛਾਤੀ ਵਿੱਚ ਦਰਦ") ||
      text.includes("ਦਿਲ ਦਾ ਦੌਰਾ") ||
      text.includes("ਛਾਤੀ ਵਿੱਚ ਭਾਰਾਪਣ"),
    messages: {
      en: {
        summary: "Severe chest pain or pressure indicates a potential cardiac emergency.",
        reasons: [
          "Chest discomfort or pressure may be related to heart conditions",
          "Risk of cardiac event requiring immediate hospital monitoring",
          "Needs urgent ECG and emergency physician evaluation",
        ],
        warning_signs: [
          "Pain radiating to left arm, neck, or jaw",
          "Cold sweats, dizziness, or fainting",
          "Sudden shortness of breath",
          "Nausea with chest tightness",
        ],
      },
      hi: {
        summary: "सीने में दर्द या भारीपन दिल के दौरे का गंभीर संकेत हो सकता है।",
        reasons: [
          "सीने में दबाव या दर्द हृदय संबंधी आपात स्थिति से जुड़ा हो सकता है",
          "तुरंत ईसीजी और अस्पताल में जांच की आवश्यकता है",
          "समय पर इलाज से जान बचाई जा सकती है",
        ],
        warning_signs: [
          "दर्द का बाएं हाथ, जबड़े या गर्दन तक फैलना",
          "ठंडा पसीना, घबराहट या चक्कर आना",
          "अचानक सांस फूलना",
          "सीने के दबाव के साथ उल्टी का मन होना",
        ],
      },
      pa: {
        summary: "ਛਾਤੀ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ ਜਾਂ ਭਾਰਾਪਣ ਦਿਲ ਦੇ ਦੌਰੇ ਦਾ ਗੰਭੀਰ ਖ਼ਤਰਾ ਹੋ ਸਕਦਾ ਹੈ।",
        reasons: [
          "ਛਾਤੀ ਵਿੱਚ ਦਬਾਅ ਦਿਲ ਦੀ ਗੰਭੀਰ ਸਮੱਸਿਆ ਨਾਲ ਸਬੰਧਤ ਹੋ ਸਕਦਾ ਹੈ",
          "ਤੁਰੰਤ ਈ.ਸੀ.ਜੀ ਅਤੇ ਸਰਕਾਰੀ ਹਸਪਤਾਲ ਦੀ ਜਾਂਚ ਜ਼ਰੂਰੀ ਹੈ",
          "ਦੇਰੀ ਕਰਨ ਨਾਲ ਜਾਨ ਨੂੰ ਖ਼ਤਰਾ ਹੋ ਸਕਦਾ ਹੈ",
        ],
        warning_signs: [
          "ਦਰਦ ਖੱਬੀ ਬਾਂਹ, ਧੌਣ ਜਾਂ ਜਬਾੜੇ ਵੱਲ ਫੈਲਣਾ",
          "ਠੰਢੇ ਮੁੜ੍ਹਕੇ ਆਉਣਾ ਜਾਂ ਚੱਕਰ ਆਉਣੇ",
          "ਅਚਾਨਕ ਸਾਹ ਲੈਣ ਵਿੱਚ ਬਹੁਤ ਤਕਲੀਫ਼ ਹੋਣਾ",
          "ਘਬਰਾਹਟ ਅਤੇ ਉਲਟੀ ਆਉਣਾ",
        ],
      },
    },
  },

  // 2. Severe breathing difficulty
  {
    id: "breathing_difficulty",
    condition: (_, text) =>
      text.includes("can't breathe") ||
      text.includes("cannot breathe") ||
      text.includes("gasping") ||
      text.includes("choking") ||
      text.includes("shortness of breath") ||
      text.includes("blue lips") ||
      text.includes("सांस नहीं") ||
      text.includes("दम घुट") ||
      text.includes("सांस लेने में बहुत तकलीफ") ||
      text.includes("ਹਵਾ ਨਹੀਂ ਆ ਰਹੀ") ||
      text.includes("ਸਾਹ ਨਹੀਂ ਆ ਰਿਹਾ") ||
      text.includes("ਸਾਹ ਘੁੱਟਣਾ") ||
      text.includes("ਨੀਲੇ ਬੁੱਲ੍ਹ"),
    messages: {
      en: {
        summary: "Severe breathing distress requires urgent oxygen support at a hospital.",
        reasons: [
          "Severe shortage of breath can quickly lead to respiratory failure",
          "Requires immediate oxygenation and clinical stabilization",
          "May be acute asthma, lung infection, or cardiac distress",
        ],
        warning_signs: [
          "Bluish tint on lips, face, or fingernails",
          "Inability to speak in full sentences",
          "Chest wall pulling in sharply when breathing",
          "Sudden drowsiness or confusion",
        ],
      },
      hi: {
        summary: "सांस लेने में गंभीर परेशानी के लिए तुरंत अस्पताल में ऑक्सीजन की आवश्यकता है।",
        reasons: [
          "गंभीर सांस की रुकावट फेफड़ों या दिल की गंभीर बीमारी का संकेत है",
          "तुरंत ऑक्सीजन और नेबुलाइजर की जरूरत हो सकती है",
          "बिना देरी अस्पताल ले जाना आवश्यक है",
        ],
        warning_signs: [
          "होंठ या नाखून नीले पड़ना",
          "एक वाक्य भी पूरा न बोल पाना",
          "सांस लेते समय पसलियों का तेजी से अंदर धंसना",
          "बेहोशी या अत्यधिक सुस्ती",
        ],
      },
      pa: {
        summary: "ਸਾਹ ਲੈਣ ਵਿੱਚ ਬਹੁਤ ਜ਼ਿਆਦਾ ਤਕਲੀਫ਼ ਲਈ ਤੁਰੰਤ ਹਸਪਤਾਲ ਆਕਸੀਜਨ ਦੀ ਲੋੜ ਹੈ।",
        reasons: [
          "ਸਾਹ ਦਾ ਤੇਜ਼ੀ ਨਾਲ ਘੁੱਟਣਾ ਫੇਫੜਿਆਂ ਜਾਂ ਦਿਲ ਲਈ ਖ਼ਤਰਨਾਕ ਹੈ",
          "ਹਸਪਤਾਲ ਵਿੱਚ ਤੁਰੰਤ ਆਕਸੀਜਨ ਦੀ ਜ਼ਰੂਰਤ ਹੋ ਸਕਦੀ ਹੈ",
          "ਤੁਰੰਤ 108 ਐਂਬੂਲੈਂਸ ਬੁਲਾਓ",
        ],
        warning_signs: [
          "ਬੁੱਲ੍ਹਾਂ ਜਾਂ ਨਹੁੰਆਂ ਦਾ ਨੀਲਾ ਪੈਣਾ",
          "ਇੱਕ ਵੀ ਪੂਰਾ ਵਾਕ ਨਾ ਬੋਲ ਸਕਣਾ",
          "ਸਾਹ ਲੈਂਦੇ ਸਮੇਂ ਪੱਸਲੀਆਂ ਦਾ ਅੰਦਰ ਧਸਣਾ",
          "ਬੇਹੋਸ਼ੀ ਜਾਂ ਸੁੱਸਤੀ ਛਾਉਣਾ",
        ],
      },
    },
  },

  // 3. Stroke Signs (FAST)
  {
    id: "stroke",
    condition: (_, text) =>
      text.includes("face droop") ||
      text.includes("arm weakness") ||
      text.includes("slurred speech") ||
      text.includes("stroke") ||
      text.includes("paralysis") ||
      text.includes("मुंह टेढ़ा") ||
      text.includes("लकवा") ||
      text.includes("बोली लड़खड़ा") ||
      text.includes("हाथ काम नहीं") ||
      text.includes("ਅਧਰੰਗ") ||
      text.includes("ਮੂੰਹ ਟੇਢਾ") ||
      text.includes("ਬੋਲ ਨਹੀਂ ਸਕਦਾ") ||
      text.includes("ਬਾਂਹ ਸੁੰਨ"),
    messages: {
      en: {
        summary: "Sudden facial drooping, arm weakness, or slurred speech indicates a stroke emergency.",
        reasons: [
          "Signs match clinical FAST stroke criteria",
          "Brain cells need emergency blood flow restoration within golden hour",
          "Hospital CT scan and emergency thrombolytic care needed",
        ],
        warning_signs: [
          "One side of face drooping when smiling",
          "One arm drifting downward when raised",
          "Speech slurred or completely unable to speak",
          "Sudden loss of vision or balance",
        ],
      },
      hi: {
        summary: "चेहरा टेढ़ा होना या हाथ में कमजोरी लकवे (स्ट्रोक) का आपातकालीन संकेत है।",
        reasons: [
          "ये लक्षण स्ट्रोक (लकवा) के तुरंत संकेत हैं",
          "दिमाग की नसों में रुकावट को ठीक करने के लिए तुरंत अस्पताल पहुंचना जरूरी है",
          "पहले कुछ घंटे (गोल्डन आवर) जीवन बचाने के लिए सबसे महत्वपूर्ण हैं",
        ],
        warning_signs: [
          "हंसने पर चेहरे का एक तरफ झुकना",
          "एक हाथ उठाने पर खुद नीचे गिर जाना",
          "बोलने में जबान का लड़खड़ाना",
          "अचानक संतुलन बिगड़ना या आंखों के आगे अंधेरा छाना",
        ],
      },
      pa: {
        summary: "ਮੂੰਹ ਦਾ ਟੇਢਾ ਹੋਣਾ, ਬਾਂਹ ਵਿੱਚ ਕਮਜ਼ੋਰੀ ਜਾਂ ਬੋਲੀ ਲੜਖੜਾਉਣਾ ਅਧਰੰਗ (ਸਟ੍ਰੋਕ) ਦਾ ਸੰਕੇਤ ਹੈ।",
        reasons: [
          "ਇਹ ਲੱਛਣ ਅਧਰੰਗ (ਲਕਵਾ) ਦਾ ਪੱਕਾ ਖ਼ਤਰਾ ਦਰਸਾਉਂਦੇ ਹਨ",
          "ਦਿਮਾਗ਼ ਨੂੰ ਨੁਕਸਾਨ ਤੋਂ ਬਚਾਉਣ ਲਈ ਪਹਿਲੇ ਘੰਟੇ ਵਿੱਚ ਹਸਪਤਾਲ ਪਹੁੰਚਣਾ ਲਾਜ਼ਮੀ ਹੈ",
          "ਤੁਰੰਤ ਸਿਵਲ ਹਸਪਤਾਲ ਵਿੱਚ ਸੀ.ਟੀ. ਸਕੈਨ ਕਰਵਾਉਣਾ ਜ਼ਰੂਰੀ ਹੈ",
        ],
        warning_signs: [
          "ਹੱਸਣ ਵੇਲੇ ਮੂੰਹ ਦਾ ਇੱਕ ਪਾਸੇ ਝੁਕਣਾ",
          "ਇੱਕ ਬਾਂਹ ਉੱਪਰ ਚੁੱਕਣ 'ਤੇ ਹੇਠਾਂ ਡਿੱਗ ਪੈਣਾ",
          "ਜ਼ੁਬਾਨ ਦਾ ਥਥਲਾਉਣਾ ਜਾਂ ਬਿਲਕੁਲ ਬੋਲ ਨਾ ਸਕਣਾ",
          "ਅਚਾਨਕ ਚੱਕਰ ਆਉਣੇ ਜਾਂ ਤੁਰਨ ਵਿੱਚ ਅਸਮਰੱਥ ਹੋਣਾ",
        ],
      },
    },
  },

  // 4. Seizure / Convulsions / Unconsciousness
  {
    id: "seizure_unconscious",
    condition: (_, text) =>
      text.includes("seizure") ||
      text.includes("convulsion") ||
      text.includes("fits") ||
      text.includes("unconscious") ||
      text.includes("passed out") ||
      text.includes("fainted") ||
      text.includes("दौरा") ||
      text.includes("बेहोश") ||
      text.includes("ਮਿਰਗੀ ਦਾ ਦੌਰਾ") ||
      text.includes("ਬੇਹੋਸ਼") ||
      text.includes("ਝਟਕੇ"),
    messages: {
      en: {
        summary: "Loss of consciousness or seizures requires emergency hospital evaluation.",
        reasons: [
          "Seizures or unresponsiveness indicate critical neurological or metabolic distress",
          "Risk of airway blockage and recurrent convulsions",
          "Must be assessed immediately by emergency medical team",
        ],
        warning_signs: [
          "Seizure lasting longer than 3 minutes",
          "Person not waking up after seizure stops",
          "Repeated fits without regaining consciousness",
          "Difficulty breathing or blue discoloration",
        ],
      },
      hi: {
        summary: "बेहोशी या मिर्गी का दौरा पड़ने पर तुरंत अस्पताल में आपातकालीन जांच जरूरी है।",
        reasons: [
          "बेहोशी दिमाग या शरीर में ऑक्सीजन व शुगर की भारी कमी का संकेत है",
          "सांस की नली बंद होने का खतरा हो सकता है",
          "डॉक्टर द्वारा तुरंत जांच जरूरी है",
        ],
        warning_signs: [
          "दौरा 3 मिनट से ज्यादा लंबा चलना",
          "दौरा रुकने के बाद भी होश न आना",
          "लगातार एक के बाद एक दौरे पड़ना",
          "सांस लेने में भारी घरघराहट",
        ],
      },
      pa: {
        summary: "ਬੇਹੋਸ਼ੀ ਜਾਂ ਦੌਰਾ ਪੈਣ 'ਤੇ ਤੁਰੰਤ ਹਸਪਤਾਲ ਲੈ ਕੇ ਜਾਣਾ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ।",
        reasons: [
          "ਬੇਹੋਸ਼ੀ ਦਿਮਾਗ਼ ਜਾਂ ਸਰੀਰ ਵਿੱਚ ਗੰਭੀਰ ਖ਼ਤਰੇ ਦਾ ਸੰਕੇਤ ਹੈ",
          "ਸਾਹ ਦੀ ਨਾਲੀ ਵਿੱਚ ਰੁਕਾਵਟ ਆਉਣ ਦਾ ਖ਼ਤਰਾ ਰਹਿੰਦਾ ਹੈ",
          "ਤੁਰੰਤ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੈ",
        ],
        warning_signs: [
          "ਦੌਰਾ 3 ਮਿੰਟ ਤੋਂ ਵੱਧ ਸਮਾਂ ਚੱਲਣਾ",
          "ਦੌਰਾ ਰੁਕਣ ਤੋਂ ਬਾਅਦ ਵੀ ਹੋਸ਼ ਨਾ ਆਉਣਾ",
          "ਵਾਰ-ਵਾਰ ਝਟਕੇ ਲੱਗਣੇ",
          "ਸਾਹ ਰੁਕਣ ਜਾਂ ਘੁੱਟਣ ਦੇ ਲੱਛਣ",
        ],
      },
    },
  },

  // 5. Heavy Bleeding / Severe Burns / Poisoning / Snakebite
  {
    id: "trauma_poisoning",
    condition: (_, text) =>
      text.includes("heavy bleeding") ||
      text.includes("vomiting blood") ||
      text.includes("coughing blood") ||
      text.includes("severe burn") ||
      text.includes("poison") ||
      text.includes("pesticide") ||
      text.includes("snake bite") ||
      text.includes("snakebite") ||
      text.includes("जहर") ||
      text.includes("कीटनाशक") ||
      text.includes("सांप ने काटा") ||
      text.includes("खून की उल्टी") ||
      text.includes("ज्यादा खून") ||
      text.includes("ਬਹੁਤ ਜ਼ਿਆਦਾ ਖੂਨ") ||
      text.includes("ਜ਼ਹਿਰ") ||
      text.includes("ਕੀਟਨਾਸ਼ਕ") ||
      text.includes("ਸੱਪ ਦਾ ਡੰਗ") ||
      text.includes("ਸੜ ਗਿਆ") ||
      text.includes("ਖੂਨ ਦੀ ਉਲਟੀ"),
    messages: {
      en: {
        summary: "Heavy bleeding, chemical ingestion, snakebite, or severe burns require urgent hospital trauma care.",
        reasons: [
          "Risk of severe blood loss, toxin absorption, or shock",
          "Needs specialized anti-venom, burn dressings, or blood transfusion",
          "Immediate emergency care is critical for survival",
        ],
        warning_signs: [
          "Rapid weak pulse and clammy cold skin",
          "Vomiting black or bright red blood",
          "Swelling spreading rapidly from bite site",
          "Drowsiness and breathing difficulty",
        ],
      },
      hi: {
        summary: "भारी रक्तस्राव, सांप का काटना, जहर या गंभीर जलना आपातकालीन स्थिति है।",
        reasons: [
          "ज्यादा खून बहने या जहर फैलने से जान का खतरा हो सकता है",
          "एंटी-वेनम या खून चढ़ाने की तुरंत जरूरत हो सकती है",
          "घरेलू नुस्खे न आजमाएं, सीधे अस्पताल जाएं",
        ],
        warning_signs: [
          "शरीर का ठंडा पड़ना और नब्ज कमजोर होना",
          "खून की उल्टी आना",
          "सांप के काटने वाली जगह पर तेजी से सूजन बढ़ना",
          "सुस्ती और सांस फूलना",
        ],
      },
      pa: {
        summary: "ਬਹੁਤ ਜ਼ਿਆਦਾ ਖੂਨ ਵਗਣਾ, ਸੱਪ ਦਾ ਡੰਗ, ਜ਼ਹਿਰ ਜਾਂ ਬੁਰੀ ਤਰ੍ਹਾਂ ਸੜਨਾ ਐਮਰਜੈਂਸੀ ਹੈ।",
        reasons: [
          "ਸਰੀਰ ਵਿੱਚੋਂ ਖੂਨ ਦੀ ਕਮੀ ਜਾਂ ਜ਼ਹਿਰ ਫੈਲਣ ਦਾ ਗੰਭੀਰ ਖ਼ਤਰਾ ਹੈ",
          "ਹਸਪਤਾਲ ਵਿੱਚ ਐਂਟੀ-ਵੈਨਮ ਜਾਂ ਖੂਨ ਚੜ੍ਹਾਉਣ ਦੀ ਤੁਰੰਤ ਲੋੜ ਹੈ",
          "ਕੋਈ ਘਰੇਲੂ ਟੂਣਾ ਨਾ ਕਰੋ, ਸਿੱਧਾ ਸਰਕਾਰੀ ਹਸਪਤਾਲ ਜਾਓ",
        ],
        warning_signs: [
          "ਪਿੰਡਾ ਠੰਢਾ ਪੈ ਜਾਣਾ ਅਤੇ ਨਬਜ਼ ਕਮਜ਼ੋਰ ਹੋਣਾ",
          "ਖੂਨ ਦੀ ਉਲਟੀ ਆਉਣਾ",
          "ਸੱਪ ਦੇ ਡੰਗ ਵਾਲੀ ਥਾਂ 'ਤੇ ਸੋਜ ਤੇਜ਼ੀ ਨਾਲ ਵਧਣਾ",
          "ਸਾਹ ਰੁਕਣਾ ਜਾਂ ਅੱਖਾਂ ਅੱਗੇ ਹਨੇਰਾ ਛਾਉਣਾ",
        ],
      },
    },
  },

  // 6. Pregnancy danger signs
  {
    id: "pregnancy_danger",
    condition: (input, text) =>
      Boolean(input.isPregnant) &&
      (text.includes("bleeding") ||
        text.includes("fluid") ||
        text.includes("severe pain") ||
        text.includes("swelling") ||
        text.includes("headache") ||
        text.includes("खून") ||
        text.includes("पेट दर्द") ||
        text.includes("ਦਰਦ") ||
        text.includes("ਖੂਨ") ||
        input.severity === "severe"),
    messages: {
      en: {
        summary: "Pregnancy danger sign detected. Requires immediate maternity hospital evaluation.",
        reasons: [
          "Bleeding or severe pain in pregnancy threatens mother and baby",
          "Risk of preeclampsia or premature complications",
          "Needs immediate obstetrician ultrasound and fetal heart monitoring",
        ],
        warning_signs: [
          "Vaginal bleeding or gush of fluid",
          "Severe persistent headache with blurred vision",
          "Decreased or absent fetal movements",
          "High fever with chills or convulsions",
        ],
      },
      hi: {
        summary: "गर्भावस्था में खतरे का संकेत। तुरंत जच्चा-बच्चा अस्पताल पहुंचें।",
        reasons: [
          "गर्भावस्था में रक्तस्राव या तेज पेट दर्द मां और बच्चे दोनों के लिए खतरनाक है",
          "प्री-एक्लेम्पसिया या जटिलताओं का खतरा हो सकता है",
          "तुरंत अल्ट्रासाउंड और डॉक्टर की जांच जरूरी है",
        ],
        warning_signs: [
          "योनि से रक्तस्राव या पानी का रिसाव",
          "तेज सिरदर्द के साथ आंखों के आगे धुंधलापन",
          "गर्भ में बच्चे की हलचल कम होना",
          "तेज बुखार या दौरे पड़ना",
        ],
      },
      pa: {
        summary: "ਗਰਭ ਅਵਸਥਾ ਵਿੱਚ ਖ਼ਤਰੇ ਦਾ ਨਿਸ਼ਾਨ। ਤੁਰੰਤ ਜਣੇਪਾ ਹਸਪਤਾਲ ਪਹੁੰਚੋ।",
        reasons: [
          "ਗਰਭ ਵਿੱਚ ਖੂਨ ਪੈਣਾ ਜਾਂ ਤੇਜ਼ ਪੇਟ ਦਰਦ ਮਾਂ ਅਤੇ ਬੱਚੇ ਲਈ ਖ਼ਤਰਨਾਕ ਹੈ",
          "ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਵਧਣ ਜਾਂ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਜਣੇਪੇ ਦਾ ਖ਼ਤਰਾ ਹੋ ਸਕਦਾ ਹੈ",
          "ਸਰਕਾਰੀ ਹਸਪਤਾਲ ਵਿੱਚ ਤੁਰੰਤ ਮਾਹਿਰ ਡਾਕਟਰ ਦੀ ਜਾਂਚ ਜ਼ਰੂਰੀ ਹੈ",
        ],
        warning_signs: [
          "ਗਰਭ ਵਿੱਚੋਂ ਖੂਨ ਜਾਂ ਪਾਣੀ ਵਗਣਾ",
          "ਸਿਰ ਦਾ ਤੇਜ਼ ਦਰਦ ਅਤੇ ਅੱਖਾਂ ਅੱਗੇ ਧੁੰਦਲਾਪਣ",
          "ਪੇਟ ਵਿੱਚ ਬੱਚੇ ਦੀ ਹਰਕਤ ਘਟਣੀ",
          "ਤੇਜ਼ ਬੁਖ਼ਾਰ ਜਾਂ ਕਾਂਬਾ ਛਿੜਨਾ",
        ],
      },
    },
  },

  // 7. Sick Infant (< 1 year)
  {
    id: "sick_infant",
    condition: (input, text) =>
      input.age <= 1 &&
      (text.includes("not drinking") ||
        text.includes("not feeding") ||
        text.includes("lethargic") ||
        text.includes("pale") ||
        text.includes("fever") ||
        text.includes("दूध नहीं") ||
        text.includes("सुस्त") ||
        text.includes("ਦੁੱਧ ਨਹੀਂ") ||
        text.includes("ਸੁਸਤ") ||
        text.includes("ਬੁਖਾਰ") ||
        input.severity === "severe"),
    messages: {
      en: {
        summary: "High-risk illness in an infant under 1 year requires urgent pediatric assessment.",
        reasons: [
          "Infants deteriorate rapidly when dehydrated or battling infections",
          "Inability to feed is a clinical marker of serious childhood illness",
          "Requires immediate evaluation at a hospital with pediatric care",
        ],
        warning_signs: [
          "Baby unable to suckle or feed",
          "Very sleepy, limp, or difficult to wake up",
          "Breathing fast with grunting sound or chest indrawing",
          "Fever above 101°F in baby under 3 months",
        ],
      },
      hi: {
        summary: "1 वर्ष से कम उम्र के शिशु में गंभीर बीमारी के संकेत हैं। तुरंत बाल रोग विशेषज्ञ के पास जाएं।",
        reasons: [
          "छोटे बच्चों की तबीयत बहुत तेजी से बिगड़ सकती है",
          "दूध न पीना और सुस्ती गंभीर संक्रमण का संकेत है",
          "अस्पताल में बाल रोग विशेषज्ञ की तुरंत जांच जरूरी है",
        ],
        warning_signs: [
          "बच्चा मां का दूध या पानी बिल्कुल न पी पाए",
          "अत्यधिक सुस्ती या जगाने पर न जागना",
          "सांस लेते समय पसलियां खिंचना या सीने से आवाज आना",
          "शरीर ठंडा पड़ जाना या तेज बुखार",
        ],
      },
      pa: {
        summary: "1 ਸਾਲ ਤੋਂ ਛੋਟੇ ਬੱਚੇ ਵਿੱਚ ਗੰਭੀਰ ਬਿਮਾਰੀ ਦੇ ਲੱਛਣ। ਤੁਰੰਤ ਬੱਚਿਆਂ ਦੇ ਹਸਪਤਾਲ ਜਾਓ।",
        reasons: [
          "ਛੋਟੇ ਬੱਚਿਆਂ ਵਿੱਚ ਇਨਫੈਕਸ਼ਨ ਬਹੁਤ ਤੇਜ਼ੀ ਨਾਲ ਫੈਲ ਸਕਦੀ ਹੈ",
          "ਦੁੱਧ ਨਾ ਚੁੰਘਣਾ ਅਤੇ ਸੁਸਤੀ ਵੱਡੇ ਖ਼ਤਰੇ ਦੀ ਨਿਸ਼ਾਨੀ ਹੈ",
          "ਤੁਰੰਤ ਬੱਚਿਆਂ ਦੇ ਮਾਹਿਰ ਡਾਕਟਰ ਦੀ ਜਾਂਚ ਜ਼ਰੂਰੀ ਹੈ",
        ],
        warning_signs: [
          "ਬੱਚਾ ਦੁੱਧ ਬਿਲਕੁਲ ਨਾ ਪੀ ਰਿਹਾ ਹੋਵੇ",
          "ਬਹੁਤ ਜ਼ਿਆਦਾ ਸੁਸਤ ਹੋਣਾ ਜਾਂ ਜਗਾਉਣ 'ਤੇ ਨਾ ਜਾਗਣਾ",
          "ਤੇਜ਼-ਤੇਜ਼ ਸਾਹ ਲੈਣਾ ਅਤੇ ਪੱਸਲੀਆਂ ਅੰਦਰ ਧਸਣਾ",
          "ਹੱਥ-ਪੈਰ ਠੰਢੇ ਪੈ ਜਾਣਾ ਜਾਂ ਤੇਜ਼ ਬੁਖ਼ਾਰ",
        ],
      },
    },
  },

  // 8. Suicidal thoughts / Self harm
  {
    id: "suicide_risk",
    condition: (_, text) =>
      text.includes("suicide") ||
      text.includes("kill myself") ||
      text.includes("end my life") ||
      text.includes("आत्महत्या") ||
      text.includes("मरना चाहता") ||
      text.includes("ਖੁਦਕੁਸ਼ੀ") ||
      text.includes("ਜਾਨ ਦੇਣੀ"),
    messages: {
      en: {
        summary: "Immediate mental health crisis support needed. You are not alone.",
        reasons: [
          "Severe emotional distress requiring immediate compassionate clinical support",
          "Confidential help is freely available right now",
          "Please connect with Tele-MANAS helpline immediately",
        ],
        warning_signs: [
          "Immediate intent to harm oneself",
          "Feelings of overwhelming hopelessness",
          "Access to harmful substances or means",
        ],
      },
      hi: {
        summary: "तुरंत मानसिक स्वास्थ्य सहायता आवश्यक है। आप अकेले नहीं हैं, मदद उपलब्ध है।",
        reasons: [
          "गंभीर मानसिक तनाव के समय तुरंत पेशेवर सलाह की जरूरत होती है",
          "गोपनीय और मुफ्त सहायता तुरंत उपलब्ध है",
          "कृपया टेली-मानस हेल्पलाइन 14416 पर तुरंत बात करें",
        ],
        warning_signs: [
          "खुद को नुकसान पहुंचाने का विचार",
          "अत्यधिक निराशा या अकेलापन",
          "हानिकारक वस्तुओं की ओर झुकाव",
        ],
      },
      pa: {
        summary: "ਤੁਰੰਤ ਮਾਨਸਿਕ ਸਿਹਤ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੈ। ਤੁਸੀਂ ਇਕੱਲੇ ਨਹੀਂ ਹੋ, ਮਦਦ ਉਪਲਬਧ ਹੈ।",
        reasons: [
          "ਮਾਨਸਿਕ ਪਰੇਸ਼ਾਨੀ ਵੇਲੇ ਤੁਰੰਤ ਡਾਕਟਰੀ ਅਤੇ ਕਾਊਂਸਲਿੰਗ ਸਹਾਇਤਾ ਜ਼ਰੂਰੀ ਹੈ",
          "ਮੁਫ਼ਤ ਅਤੇ ਗੁਪਤ ਮਦਦ 24 ਘੰਟੇ ਉਪਲਬਧ ਹੈ",
          "ਕਿਰਪਾ ਕਰਕੇ ਟੈਲੀ-ਮਾਨਸ ਹੈਲਪਲਾਈਨ 14416 'ਤੇ ਤੁਰੰਤ ਕਾਲ ਕਰੋ",
        ],
        warning_signs: [
          "ਖੁਦ ਨੂੰ ਨੁਕਸਾਨ ਪਹੁੰਚਾਉਣ ਦਾ ਇਰਾਦਾ",
          "ਬੇਹੱਦ ਨਿਰਾਸ਼ਾ ਅਤੇ ਘਬਰਾਹਟ",
          "ਖ਼ਤਰਨਾਕ ਚੀਜ਼ਾਂ ਦੀ ਵਰਤੋਂ ਦਾ ਖ਼ਤਰਾ",
        ],
      },
    },
  },
];

export function checkRedFlags(input: TriageInput): TriageResponse | null {
  const combinedText = `${input.symptoms} ${input.duration || ""} ${input.severity || ""}`.toLowerCase();
  const lang: Language = input.preferredLanguage || "pa";

  for (const rule of RED_FLAG_RULES) {
    if (rule.condition(input, combinedText)) {
      const msg = rule.messages[lang] || rule.messages.en;
      return {
        urgency: "emergency",
        summary: msg.summary,
        reasons: msg.reasons,
        home_care: [], // Empty for emergency as per rules
        warning_signs: msg.warning_signs,
        follow_up_questions: [],
        recommended_facility_type: "hospital",
        disclaimer: "This is guidance, not a medical diagnosis.",
        isRedFlag: true,
      };
    }
  }

  return null;
}
