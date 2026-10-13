import { NextRequest, NextResponse } from "next/server";
import { getCases, saveCase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const village = searchParams.get("village") || undefined;
    const cases = await getCases(village);
    return NextResponse.json({ cases });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCase = await saveCase({
      village: body.village || "Ludhiana Rural",
      age_group: body.age_group || "19-45",
      urgency: body.urgency || "see_clinic_soon",
      symptoms: body.symptoms || "Unspecified",
      gender: body.gender || "other",
    });
    return NextResponse.json({ success: true, case: newCase });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
