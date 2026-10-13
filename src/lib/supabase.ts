import { createClient } from "@supabase/supabase-js";
import { CaseRecord } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://your-project.supabase.co" &&
  supabaseAnonKey !== "your_supabase_anon_key_here"
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Seed sample cases from Punjab villages for immediate realistic ASHA analytics
export const SEED_SAMPLE_CASES: CaseRecord[] = [
  {
    id: "case-01",
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    village: "Sahnewal",
    age_group: "46-60",
    urgency: "emergency",
    symptoms: "Chest pain radiating to left shoulder and cold sweats",
    gender: "male",
  },
  {
    id: "case-02",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    village: "Verka",
    age_group: "0-5",
    urgency: "urgent_today",
    symptoms: "High fever 102°F and loose watery stools for 2 days",
    gender: "female",
  },
  {
    id: "case-03",
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    village: "Kartarpur",
    age_group: "19-45",
    urgency: "home_care",
    symptoms: "Mild runny nose, sneezing and slight body ache",
    gender: "female",
  },
  {
    id: "case-04",
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    village: "Nabha",
    age_group: "60+",
    urgency: "urgent_today",
    symptoms: "Persistent dry cough for 5 days and moderate shortness of breath",
    gender: "male",
  },
  {
    id: "case-05",
    created_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    village: "Goniana",
    age_group: "19-45",
    urgency: "see_clinic_soon",
    symptoms: "Knee joint swelling and pain when walking in farm",
    gender: "male",
  },
  {
    id: "case-06",
    created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    village: "Kharar",
    age_group: "19-45",
    urgency: "emergency",
    symptoms: "Sudden right arm weakness and slurred speech",
    gender: "female",
  },
  {
    id: "case-07",
    created_at: new Date(Date.now() - 1000 * 60 * 750).toISOString(),
    village: "Mahilpur",
    age_group: "6-18",
    urgency: "home_care",
    symptoms: "Mild throat irritation and dry cough after harvesting dust",
    gender: "male",
  },
  {
    id: "case-08",
    created_at: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    village: "Dhuri",
    age_group: "19-45",
    urgency: "urgent_today",
    symptoms: "Severe abdominal cramping and vomiting after dinner",
    gender: "female",
  },
  {
    id: "case-09",
    created_at: new Date(Date.now() - 1000 * 60 * 1100).toISOString(),
    village: "Sahnewal",
    age_group: "0-5",
    urgency: "urgent_today",
    symptoms: "Ear pain, crying continuously and moderate fever",
    gender: "male",
  },
  {
    id: "case-10",
    created_at: new Date(Date.now() - 1000 * 60 * 1300).toISOString(),
    village: "Kartarpur",
    age_group: "60+",
    urgency: "see_clinic_soon",
    symptoms: "Frequent urination at night and unhealing foot scratch",
    gender: "male",
  },
  {
    id: "case-11",
    created_at: new Date(Date.now() - 1000 * 60 * 1500).toISOString(),
    village: "Verka",
    age_group: "19-45",
    urgency: "home_care",
    symptoms: "Headache after long day under hot sun, fatigue",
    gender: "female",
  },
  {
    id: "case-12",
    created_at: new Date(Date.now() - 1000 * 60 * 1800).toISOString(),
    village: "Nabha",
    age_group: "46-60",
    urgency: "emergency",
    symptoms: "Deep cut from wheat thresher machine with heavy bleeding",
    gender: "male",
  },
  {
    id: "case-13",
    created_at: new Date(Date.now() - 1000 * 60 * 2100).toISOString(),
    village: "Goniana",
    age_group: "0-5",
    urgency: "emergency",
    symptoms: "Infant 4 months old refuses breast milk, grunting breathing",
    gender: "female",
  },
  {
    id: "case-14",
    created_at: new Date(Date.now() - 1000 * 60 * 2400).toISOString(),
    village: "Kharar",
    age_group: "19-45",
    urgency: "urgent_today",
    symptoms: "Pregnant 7 months with severe swelling in legs and high BP",
    gender: "female",
  },
  {
    id: "case-15",
    created_at: new Date(Date.now() - 1000 * 60 * 2700).toISOString(),
    village: "Mahilpur",
    age_group: "60+",
    urgency: "see_clinic_soon",
    symptoms: "Vision becoming cloudy, eye redness and itching",
    gender: "male",
  },
  {
    id: "case-16",
    created_at: new Date(Date.now() - 1000 * 60 * 3000).toISOString(),
    village: "Dhuri",
    age_group: "19-45",
    urgency: "home_care",
    symptoms: "Mild indigestion, feeling bloated after wedding feast",
    gender: "male",
  },
  {
    id: "case-17",
    created_at: new Date(Date.now() - 1000 * 60 * 3400).toISOString(),
    village: "Sahnewal",
    age_group: "6-18",
    urgency: "see_clinic_soon",
    symptoms: "Skin rash on hands with intense itching at night",
    gender: "female",
  },
  {
    id: "case-18",
    created_at: new Date(Date.now() - 1000 * 60 * 3800).toISOString(),
    village: "Kartarpur",
    age_group: "46-60",
    urgency: "urgent_today",
    symptoms: "Fever with severe body chills and back pain for 3 days",
    gender: "male",
  },
];

// In-memory / localStorage cache for cases
let localCasesCache: CaseRecord[] = [...SEED_SAMPLE_CASES];

export async function saveCase(
  record: Omit<CaseRecord, "id" | "created_at">
): Promise<CaseRecord> {
  const newRecord: CaseRecord = {
    id: `case-${Date.now()}`,
    created_at: new Date().toISOString(),
    ...record,
  };

  // 1. Try Supabase if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("cases")
        .insert([
          {
            village: newRecord.village,
            age_group: newRecord.age_group,
            urgency: newRecord.urgency,
            symptoms: newRecord.symptoms,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        const saved: CaseRecord = {
          id: data.id || newRecord.id,
          created_at: data.created_at || newRecord.created_at,
          village: data.village,
          age_group: data.age_group,
          urgency: data.urgency,
          symptoms: data.symptoms,
          gender: newRecord.gender,
        };
        localCasesCache.unshift(saved);
        return saved;
      }
    } catch (err) {
      console.warn("Supabase insert error, falling back to local memory:", err);
    }
  }

  // 2. Local fallback
  localCasesCache.unshift(newRecord);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("organigen_cases", JSON.stringify(localCasesCache));
    } catch (e) {
      // Storage quota or private browsing
    }
  }

  return newRecord;
}

export async function getCases(villageFilter?: string): Promise<CaseRecord[]> {
  // If client-side and saved in localStorage, merge
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("organigen_cases");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localCasesCache = parsed;
        }
      }
    } catch (e) {}
  }

  // 1. Try Supabase if configured
  if (supabase) {
    try {
      let query = supabase.from("cases").select("*").order("created_at", { ascending: false });
      if (villageFilter && villageFilter !== "all") {
        query = query.eq("village", villageFilter);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as CaseRecord[];
      }
    } catch (err) {
      console.warn("Supabase fetch error, using cache:", err);
    }
  }

  // 2. Filter local cache
  if (villageFilter && villageFilter !== "all") {
    return localCasesCache.filter((c) => c.village.toLowerCase() === villageFilter.toLowerCase());
  }

  return localCasesCache;
}
