import { NextResponse } from "next/server";
import { findTownByName, getCountyNames, getTownsForCounty } from "@/lib/data/districts";
import type { NHCounty } from "@/types/location";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const town = searchParams.get("town");
  const county = searchParams.get("county") as NHCounty | null;

  // If county provided, return all its towns
  if (county && !town) {
    const counties = getCountyNames();
    if (!counties.includes(county)) {
      return NextResponse.json({ error: "Unknown county" }, { status: 400 });
    }
    const towns = getTownsForCounty(county);
    return NextResponse.json({ county, towns });
  }

  // If town provided, look it up
  if (town) {
    const result = findTownByName(town);
    if (!result) {
      return NextResponse.json({ error: "Town not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  }

  // No params — return all county names
  return NextResponse.json({ counties: getCountyNames() });
}
