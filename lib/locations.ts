import type { LocationResult } from "@/types/location";

type OpenMeteoLocation = {
  id: number;
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
  country_code?: string;
  feature_code?: string;
  admin1?: string;
};

type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoLocation[] | null;
};

export function transformLocations(
  response: OpenMeteoGeocodingResponse,
): LocationResult[] {
  return (response.results ?? []).map((location) => ({
    id: location.id,
    name: location.name,
    country: location.country ?? "",
    latitude: location.latitude,
    longitude: location.longitude,
    countryCode: location.country_code ?? "",
    region: location.admin1,
    featureCode: location.feature_code,
  }));
}

export async function searchLocations(
  query: string,
): Promise<LocationResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: "10",
    language: "en",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch locations.");
  }

  const data: OpenMeteoGeocodingResponse = await response.json();

  return deduplicateLocations(transformLocations(data));
}

export function isCountry(location: LocationResult): boolean {
  // PCLI is Open-Meteo's feature code for a country-level result.
  return location.featureCode === "PCLI";
}

export function isCity(location: LocationResult): boolean {
  // PPL* feature codes identify populated places, including cities and towns.
  return location.featureCode?.startsWith("PPL") ?? false;
}

export function selectBestLocation(
  query: string,
  locations: LocationResult[],
): LocationResult | null {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const countryMatch = locations.find(
    (location) =>
      isCountry(location) &&
      location.name.trim().toLocaleLowerCase() === normalizedQuery &&
      location.country.trim().toLocaleLowerCase() === normalizedQuery,
  );

  if (countryMatch) {
    return countryMatch;
  }

  return locations[0] ?? null;
}

export function getCountryFlag(countryCode: string): string {
  const code = countryCode.toUpperCase();

  if (!/^[A-Z]{2}$/.test(code)) {
    return "🌐";
  }

  return String.fromCodePoint(
    ...[...code].map((char) => 127397 + char.charCodeAt(0)),
  );
}

export function deduplicateLocations(
  locations: LocationResult[],
): LocationResult[] {
  const uniqueLocations: LocationResult[] = [];

  for (const location of locations) {
    const normalizedName = location.name.trim().toLowerCase();
    const normalizedCountry = location.country.trim().toLowerCase();
    const normalizedRegion = location.region?.trim().toLowerCase() ?? "";

    const duplicateIndex = uniqueLocations.findIndex((existing) => {
      const sameName = existing.name.trim().toLowerCase() === normalizedName;

      const sameCountry =
        existing.country.trim().toLowerCase() === normalizedCountry;

      if (!sameName || !sameCountry) {
        return false;
      }

      const existingRegion = existing.region?.trim().toLowerCase() ?? "";

      // Different known regions identify distinct locations.
      if (
        existingRegion &&
        normalizedRegion &&
        existingRegion !== normalizedRegion
      ) {
        return false;
      }

      // Missing region information can make two results duplicates.
      return true;
    });

    if (duplicateIndex === -1) {
      uniqueLocations.push(location);
      continue;
    }

    const existing = uniqueLocations[duplicateIndex];

    const existingHasRegion = Boolean(existing.region?.trim());
    const currentHasRegion = Boolean(location.region?.trim());

    // Prefer the result with more identifying information.
    if (!existingHasRegion && currentHasRegion) {
      uniqueLocations[duplicateIndex] = location;
    }
  }

  return uniqueLocations;
}
