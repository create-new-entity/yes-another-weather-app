"use client";

import { useEffect, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isDismissed, setIsDismissed] = useState(false);

  const isOpen =
    !selectedLocation &&
    !isDismissed &&
    query.trim().length >= 2 &&
    !isLoading &&
    results.length > 0;

  useEffect(() => {
    setActiveIndex(-1);
    setIsDismissed(false);
  }, [query, results]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      if (!isOpen) return;

      event.preventDefault();
      setActiveIndex((index) => (index >= results.length - 1 ? 0 : index + 1));
    }

    if (event.key === "ArrowUp") {
      if (!isOpen) return;

      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    }

    if (event.key === "Enter" && isOpen && activeIndex >= 0) {
      event.preventDefault();
      onSelect(results[activeIndex]);
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsDismissed(true);
      setActiveIndex(-1);
    }
  }

  function handleSelect(location: LocationResult) {
    setActiveIndex(-1);
    setIsDismissed(true);
    onSelect(location);
  }

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
          onKeyDown={handleKeyDown}
          aria-label="Search for a city or country"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="location-search-results"
          aria-activedescendant={
            isOpen && activeIndex >= 0
              ? `location-option-${activeIndex}`
              : undefined
          }
          aria-haspopup="listbox"
          placeholder="Search cities or countries (2+ characters)..."
          autoComplete="off"
          className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
        />
      </div>

      {isOpen && (
        <ul
          id="location-search-results"
          role="listbox"
          aria-label="Location search results"
          className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg"
        >
          {results.map((location, index) => (
            <li
              key={
                location.id ??
                `${location.countryCode}-${location.latitude}-${location.longitude}`
              }
              role="presentation"
            >
              <button
                id={`location-option-${index}`}
                type="button"
                role="option"
                aria-selected={activeIndex === index}
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleSelect(location)}
                className={`flex w-full min-w-0 items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-foreground ${
                  activeIndex === index
                    ? "bg-background"
                    : "hover:bg-background"
                }`}
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
