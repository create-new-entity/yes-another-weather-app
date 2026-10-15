export type LocationResult = {
  id?: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  countryCode: string;
  region?: string;
  featureCode?: string;
};

export type LocationSearchProps = {
  error: string | null;
  setError: (error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  hasResults: boolean;
  hasSearched: boolean;
  selectedLocation: LocationResult | null;
  setSelectedLocation: (location: LocationResult | null) => void;
};

type OpenMeteoLocation = {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
  country_code?: string;
  admin1?: string;
};

export type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoLocation[] | null;
};
