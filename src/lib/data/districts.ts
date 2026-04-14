import type { CountyData, Town, NHCounty } from "@/types/location";
import { loadCounties } from "./loader";

let _counties: CountyData[] | null = null;

function getCounties(): CountyData[] {
  if (!_counties) _counties = loadCounties();
  return _counties;
}

export function getCountyNames(): NHCounty[] {
  return getCounties().map((c) => c.name as NHCounty);
}

export function getTownsForCounty(county: NHCounty): Town[] {
  return getCounties().find((c) => c.name === county)?.towns ?? [];
}

export function getTownInfo(
  county: NHCounty,
  townName: string
): Town | undefined {
  return getTownsForCounty(county).find(
    (t) => t.name.toLowerCase() === townName.toLowerCase()
  );
}

export function findTownByName(townName: string): (Town & { county: NHCounty }) | undefined {
  for (const county of getCounties()) {
    const town = county.towns.find(
      (t) => t.name.toLowerCase() === townName.toLowerCase()
    );
    if (town) return { ...town, county: county.name as NHCounty };
  }
  return undefined;
}
