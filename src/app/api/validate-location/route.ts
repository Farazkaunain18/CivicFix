import { NextRequest, NextResponse } from 'next/server';
import { isWithinIndia, validateIndianPincode, formatIndianAddress } from '@/lib/indiaGeo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lat, lng, street, city, district, state, pincode } = body;

    // Check GPS coordinates if provided
    if (typeof lat === 'number' && typeof lng === 'number') {
      const insideIndia = isWithinIndia(lat, lng);
      if (!insideIndia) {
        return NextResponse.json(
          {
            valid: false,
            error: 'LOCATION_OUTSIDE_INDIA',
            message: `CivicFix currently operates exclusively within India. Detected coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)}) are outside India's geographic boundary.`,
          },
          { status: 400 }
        );
      }
    }

    // Check PIN code if provided
    if (pincode && !validateIndianPincode(pincode)) {
      return NextResponse.json(
        {
          valid: false,
          error: 'INVALID_INDIAN_PINCODE',
          message: 'Invalid Indian Postal PIN Code. Must be exactly 6 numeric digits starting with 1-9.',
        },
        { status: 400 }
      );
    }

    // Format normalized address if fields provided
    let normalized = null;
    if (street && city && district && state && pincode) {
      normalized = formatIndianAddress({ street, city, district, state, pincode });
    }

    return NextResponse.json({
      valid: true,
      country: 'India',
      normalized,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        valid: false,
        error: 'VALIDATION_FAILED',
        message: err.message || 'Internal error validating Indian location',
      },
      { status: 500 }
    );
  }
}
