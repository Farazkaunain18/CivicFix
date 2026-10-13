import { NextRequest, NextResponse } from "next/server";
import { TriageInput, TriageResponse } from "@/lib/types";
import { checkRedFlags } from "@/lib/redFlags";
import { triageWithGemini } from "@/lib/gemini";
import { saveCase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const input: TriageInput = {
      age: Number(body.age) || 25,
      sex: body.sex || "other",
      forWhom: body.forWhom || "myself",
      isPregnant: Boolean(body.isPregnant),
      symptoms: (body.symptoms || "").trim(),
      duration: body.duration || "1-3 days",
      severity: body.severity || "moderate",
      preferredLanguage: body.preferredLanguage || "pa",
      village: body.village || "Sahnewal",
    };

    if (!input.symptoms) {
      return NextResponse.json(
        { error: "Please provide symptoms to evaluate" },
        { status: 400 }
      );
    }

    // 1. RULE-BASED RED-FLAG CHECK FIRST
    const redFlagResult = checkRedFlags(input);
    let finalResult: TriageResponse;

    if (redFlagResult) {
      finalResult = redFlagResult;
    } else {
      // 2. CALL GEMINI API WITH SYSTEM PROMPT
      finalResult = await triageWithGemini(input);
    }

    // 3. Persist case telemetry for ASHA dashboard
    try {
      let ageGroup = "19-45";
      if (input.age <= 5) ageGroup = "0-5";
      else if (input.age <= 18) ageGroup = "6-18";
      else if (input.age <= 60) ageGroup = "46-60";
      else ageGroup = "60+";

      // Fire and forget or await without blocking on failure
      await saveCase({
        village: input.village || "Punjab Rural",
        age_group: ageGroup,
        urgency: finalResult.urgency,
        symptoms: input.symptoms,
        gender: input.sex,
      });
    } catch (saveErr) {
      console.warn("Could not save case record:", saveErr);
    }

    return NextResponse.json(finalResult);
  } catch (error: any) {
    console.error("Error in /api/triage:", error);
    return NextResponse.json(
      {
        error: "Internal triage error",
        message: error?.message || "Failed to complete clinical evaluation",
      },
      { status: 500 }
    );
  }
}
