"use client";

import { Search } from "lucide-react";

import { getCountryFlag } from "@/lib/locations";
import type { LocationResult } from "@/types/location";

type LocationSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
  results: LocationResult[];
  selectedLocation: LocationResult | null;
  onSelect: (location: LocationResult) => void;
  onClear: () => void;
  isLoading: boolean;
};

export default function LocationSearch({
  query,
  onQueryChange,
  results,
  selectedLocation,
  onSelect,
  isLoading,
}: LocationSearchProps) {
  const isOpen =
    !selectedLocation &&
    query.trim().length >= 2 &&
    !isLoading &&
    results.length > 0;

  return (
    <div className="relative min-w-0 flex-1">
      <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition-colors focus-within:border-foreground">
        <Search
          size={20}
          strokeWidth={1.8}
          aria-hidden="true"
          className="shrink-0 text-muted-foreground"
        />

        <input
          type="text"
          role="combobox"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-label="Search for a city or country"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="location-search-results"
          aria-haspopup="listbox"
          placeholder="Search cities or countries (2+ characters)..."
          autoComplete="off"
          className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
        />
      </div>

      {isOpen && (
        <ul
          id="location-search-results"
          className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg"
        >
          {results.map((location) => (
            <li
              key={
                location.id ??
                `${location.countryCode}-${location.latitude}-${location.longitude}`
              }
            >
              <button
                type="button"
                onClick={() => onSelect(location)}
                className="flex w-full min-w-0 items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-background focus-visible:bg-background focus-visible:outline-2 focus-visible:outline-foreground"
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl leading-none"
                >
                  {getCountryFlag(location.countryCode)}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className="block truncate text-sm font-semibold text-foreground sm:text-base"
                    title={location.name}
                  >
                    {location.name}
                  </span>

                  <span
                    className="block truncate text-xs text-muted-foreground sm:text-sm"
                    title={
                      location.region
                        ? `${location.region}, ${location.country}`
                        : location.country
                    }
                  >
                    {location.region
                      ? `${location.region}, ${location.country}`
                      : location.country}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
