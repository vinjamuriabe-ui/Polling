export type NHCounty =
  | "Belknap"
  | "Carroll"
  | "Cheshire"
  | "Coos"
  | "Grafton"
  | "Hillsborough"
  | "Merrimack"
  | "Rockingham"
  | "Strafford"
  | "Sullivan";

export interface Town {
  name: string;
  senateDist: number;
  houseDist: string;
}

export interface CountyData {
  name: NHCounty;
  towns: Town[];
}

export interface LocationState {
  county: NHCounty | null;
  town: Town | null;
  detectionMethod: "auto" | "manual" | null;
}
