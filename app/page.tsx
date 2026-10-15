"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";

import useTabTitle from "./hooks/useTabTitle";
import LocationSearch from "../components/location-search";

import { searchLocations } from "@/lib/locations";
import type { LocationResult } from "@/types/location";

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 6;
const DEBOUNCE_MS = 300;

export default function Home() {
  useTabTitle();

  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult | null>(null);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const normalizedQuery = query.trim();

  useEffect(() => {
    if (selectedLocation || normalizedQuery.length < MIN_QUERY_LENGTH) {
      return;
    }

    let ignore = false;

    const timeoutId = setTimeout(async () => {
      try {
        const locations = await searchLocations(normalizedQuery);

        if (ignore) return;

        setResults(locations.slice(0, MAX_RESULTS));
        setHasSearched(true);
      } catch {
        if (ignore) return;

        setResults([]);
        setError("Couldn't search locations. Please try again.");
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      ignore = true;
      clearTimeout(timeoutId);
    };
  }, [normalizedQuery, selectedLocation]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setSelectedLocation(null);
    setResults([]);
    setError(null);
    setHasSearched(false);
    setIsLoading(value.trim().length >= MIN_QUERY_LENGTH);
  }

  function handleSelect(location: LocationResult) {
    setSelectedLocation(location);
    setQuery("");
    setResults([]);
    setError(null);
    setHasSearched(false);
    setIsLoading(false);

    const params = new URLSearchParams({
      lat: String(location.latitude),
      lon: String(location.longitude),
      region: location.region ?? "",
      country: location.country ?? "",
    });

    router.push(`/dashboard?${params.toString()}`);
  }

  function handleClear() {
    setQuery("");
    setSelectedLocation(null);
    setResults([]);
    setError(null);
    setHasSearched(false);
    setIsLoading(false);
  }

  function handleGlobeNavigation() {
    handleClear();
    router.push("/globe");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-16 pt-16 sm:pt-24">
        <h1 className="text-center text-4xl font-bold tracking-tight sm:text-6xl">
          Aether
        </h1>

        <p className="mt-4 max-w-xl text-center text-muted-foreground sm:text-lg">
          Explore the weather around the world.
        </p>

        <section
          aria-label="Find a location"
          className="mt-12 w-full max-w-2xl"
        >
          <div className="flex items-center gap-3">
            <LocationSearch
              query={query}
              onQueryChange={handleQueryChange}
              results={results}
              selectedLocation={selectedLocation}
              onSelect={handleSelect}
              onClear={handleClear}
              isLoading={isLoading}
            />

            <button
              type="button"
              aria-label="Select location on globe"
              onClick={handleGlobeNavigation}
              className="shrink-0 rounded-2xl border border-border bg-card p-3 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <Globe size={20} aria-hidden="true" />
            </button>
          </div>

          {isLoading && (
            <p className="mt-2 text-xs text-muted-foreground" role="status">
              Searching locations...
            </p>
          )}

          {!isLoading &&
            !error &&
            !selectedLocation &&
            hasSearched &&
            results.length === 0 && (
              <p className="mt-2 text-xs text-muted-foreground" role="status">
                No locations found.
              </p>
            )}

          {error && (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
