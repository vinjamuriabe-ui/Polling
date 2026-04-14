"use client";

import { useState } from "react";
import type { NHCounty } from "@/types/location";
import { getCountyNames, getTownsForCounty } from "@/lib/data/districts";
import { Button } from "@/components/ui/Button";

interface LocationPickerProps {
  onSelect: (
    county: NHCounty,
    town: string,
    senateDist: number,
    houseDist: string
  ) => void;
}

export function LocationPicker({ onSelect }: LocationPickerProps) {
  const [county, setCounty] = useState<NHCounty | "">("");
  const [town, setTown] = useState("");
  const [error, setError] = useState("");

  const counties = getCountyNames();
  const towns = county ? getTownsForCounty(county) : [];
  const selectedTown = towns.find((t) => t.name === town);

  function handleSubmit() {
    if (!county) {
      setError("Please select your county.");
      return;
    }
    if (!selectedTown) {
      setError("Please select your town or city.");
      return;
    }
    setError("");
    onSelect(county, selectedTown.name, selectedTown.senateDist, selectedTown.houseDist);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-granite-800">
          Where do you vote in New Hampshire?
        </h2>
        <p className="text-granite-500">
          We&apos;ll show you the candidates on your specific ballot.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="county-select"
            className="block text-sm font-medium text-granite-700 mb-1"
          >
            County
          </label>
          <select
            id="county-select"
            value={county}
            onChange={(e) => {
              setCounty(e.target.value as NHCounty);
              setTown("");
            }}
            className="w-full rounded-lg border border-granite-300 bg-white px-4 py-3 text-granite-800 focus:border-mountain-pine focus:outline-none focus:ring-2 focus:ring-mountain-pine/30"
          >
            <option value="">Select a county…</option>
            {counties.map((c) => (
              <option key={c} value={c}>
                {c} County
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="town-select"
            className="block text-sm font-medium text-granite-700 mb-1"
          >
            Town or City
          </label>
          <select
            id="town-select"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            disabled={!county}
            className="w-full rounded-lg border border-granite-300 bg-white px-4 py-3 text-granite-800 focus:border-mountain-pine focus:outline-none focus:ring-2 focus:ring-mountain-pine/30 disabled:opacity-50"
          >
            <option value="">
              {county ? "Select a town or city…" : "Select a county first"}
            </option>
            {towns.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {selectedTown && (
          <div className="rounded-lg bg-granite-50 border border-granite-200 px-4 py-3 text-sm text-granite-600 space-y-0.5">
            <p>
              <span className="font-medium text-granite-800">Senate District:</span>{" "}
              NH Senate District {selectedTown.senateDist}
            </p>
            <p>
              <span className="font-medium text-granite-800">House District:</span>{" "}
              {selectedTown.houseDist}
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={!county || !town}
      >
        Start the quiz →
      </Button>
    </div>
  );
}
