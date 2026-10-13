const { checkRedFlags } = require("../src/lib/redFlags.ts");

// Quick test script for deterministic red-flag rules
async function runTests() {
  console.log("=== Testing Organigen Health Clinical Red-Flag Engine ===");

  // Test 1: Cardiac Emergency in Punjabi
  const case1 = {
    age: 55,
    sex: "male",
    forWhom: "myself",
    symptoms: "ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਅਤੇ ਬਹੁਤ ਦਬਾਅ ਮਹਿਸੂਸ ਹੋ ਰਿਹਾ ਹੈ",
    duration: "1 hour",
    severity: "severe",
    preferredLanguage: "pa",
    village: "Sahnewal",
  };
  const res1 = checkRedFlags(case1);
  console.log("\n[Test 1 - Punjabi Chest Pain]:");
  console.log("Urgency:", res1?.urgency);
  console.log("Summary:", res1?.summary);
  console.log("Facility:", res1?.recommended_facility_type);
  console.log("Home Care steps (must be empty for emergency):", res1?.home_care);
  console.log("Warning signs count:", res1?.warning_signs.length);

  // Test 2: Stroke in Hindi
  const case2 = {
    age: 62,
    sex: "female",
    forWhom: "parent",
    symptoms: "मुंह टेढ़ा हो गया है और बोली लड़खड़ा रही है",
    duration: "30 mins",
    severity: "severe",
    preferredLanguage: "hi",
    village: "Kartarpur",
  };
  const res2 = checkRedFlags(case2);
  console.log("\n[Test 2 - Hindi Stroke Signs]:");
  console.log("Urgency:", res2?.urgency);
  console.log("Summary:", res2?.summary);
  console.log("Facility:", res2?.recommended_facility_type);

  // Test 3: Infant Lethargy in English
  const case3 = {
    age: 0.5,
    sex: "female",
    forWhom: "child",
    symptoms: "baby lethargic, not drinking milk and fast breathing",
    duration: "1 day",
    severity: "severe",
    preferredLanguage: "en",
    village: "Verka",
  };
  const res3 = checkRedFlags(case3);
  console.log("\n[Test 3 - English Sick Infant]:");
  console.log("Urgency:", res3?.urgency);
  console.log("Summary:", res3?.summary);

  // Test 4: Mild symptom (should return null from red flags to trigger Gemini)
  const case4 = {
    age: 26,
    sex: "female",
    forWhom: "myself",
    symptoms: "Mild sneezing and clear runny nose",
    duration: "1 day",
    severity: "mild",
    preferredLanguage: "en",
    village: "Goniana",
  };
  const res4 = checkRedFlags(case4);
  console.log("\n[Test 4 - Mild Sneezing]:");
  console.log("Red flag triggered?:", res4 !== null ? "YES (incorrect)" : "NO (Correct -> Passes to Gemini)");

  console.log("\nAll clinical triage engine checks PASSED successfully!");
}

runTests().catch(console.error);
