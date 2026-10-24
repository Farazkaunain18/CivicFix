import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");

  if (!latStr || !lngStr) {
    return NextResponse.json(
      { available: false, error: "Missing latitude or longitude parameter" },
      { status: 400 }
    );
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === "your_google_maps_api_key_here") {
    return NextResponse.json({
      available: false,
      status: "NO_API_KEY",
      message:
        "Google Maps API key is not configured. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local to load live Street View panoramas.",
      lat,
      lng,
    });
  }

  try {
    const metaUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=${apiKey}`;
    const res = await fetch(metaUrl, { cache: "no-store" });
    const data = await res.json();

    if (data.status === "OK") {
      return NextResponse.json({
        available: true,
        status: "OK",
        panoId: data.pano_id,
        date: data.date,
        location: data.location,
        copyright: data.copyright,
      });
    }

    return NextResponse.json({
      available: false,
      status: data.status || "NO_COVERAGE",
      message:
        "No Google Street View panorama coverage was found within 50 meters of these exact coordinates.",
      lat,
      lng,
    });
  } catch (err: any) {
    return NextResponse.json({
      available: false,
      status: "CHECK_FAILED",
      message: "Could not connect to Google Street View metadata endpoint: " + err.message,
      lat,
      lng,
    });
  }
}
