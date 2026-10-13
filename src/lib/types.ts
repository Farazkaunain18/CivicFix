export type Language = "en" | "hi" | "pa";

export type UrgencyLevel = "emergency" | "urgent_today" | "see_clinic_soon" | "home_care";

export type FacilityType = "hospital" | "clinic" | "pharmacy" | "phc" | "none";

export interface Facility {
  id: string;
  name: string;
  type: "hospital" | "clinic" | "pharmacy";
  lat: number;
  lng: number;
  phone: string;
  address: string;
  district: string;
  pincode: string;
  timing: string;
  services: string[];
  distanceKm?: number;
}

export interface TriageInput {
  age: number;
  sex: "male" | "female" | "other";
  forWhom?: "myself" | "child" | "parent" | "other";
  isPregnant?: boolean;
  symptoms: string;
  duration: string;
  severity: "mild" | "moderate" | "severe";
  preferredLanguage: Language;
  village?: string;
}

export interface TriageResponse {
  urgency: UrgencyLevel;
  summary: string;
  reasons: string[];
  home_care: string[];
  warning_signs: string[];
  follow_up_questions: string[];
  recommended_facility_type: "hospital" | "phc" | "clinic" | "pharmacy" | "none";
  disclaimer: string;
  isRedFlag?: boolean;
}

export interface CaseRecord {
  id: string;
  created_at: string;
  village: string;
  age_group: string;
  urgency: UrgencyLevel;
  symptoms: string;
  gender?: string;
}
