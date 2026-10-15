"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CurrentWeatherCard from "@/app/components/CurrentWeatherCard";
import ForecastSection from "@/app/components/ForecastSection";
import {
  WeatherErrorState,
  WeatherLoadingSkeleton,
} from "@/app/components/WeatherDashboardStates";
import { getWeather } from "@/lib/weather";
import type { WeatherData } from "@/types/weather";

type WeatherDashboardProps = {
  latitude: number | null;
  longitude: number | null;
  region: string;
  country: string;
};

export default function WeatherDashboard({
  latitude,
  longitude,
  region,
  country,
}: WeatherDashboardProps) {
  const router = useRouter();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const hasValidCoordinates =
    latitude !== null &&
    longitude !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  const locationLabel =
    [region, country].filter(Boolean).join(", ") ||
    (hasValidCoordinates
      ? `${latitude!.toFixed(2)}°, ${longitude!.toFixed(2)}°`
      : "Selected location");

  const loadWeather = useCallback(async () => {
    if (!hasValidCoordinates) {
      setWeather(null);
      setError(
        "The location coordinates are missing or invalid. Return home and select a location again.",
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setWeather(null);

    try {
      const result = await getWeather(latitude!, longitude!);
      setWeather(result);
    } catch {
      setError(
        "We couldn't retrieve the weather right now. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [hasValidCoordinates, latitude, longitude]);

  useEffect(() => {
    void loadWeather();
  }, [loadWeather, retryCount]);

  const handleRetry = () => {
    setRetryCount((count) => count + 1);
  };

  const handleHome = () => {
    router.push("/");
  };

  if (isLoading) {
    return <WeatherLoadingSkeleton locationLabel={locationLabel} />;
  }

  if (error || !weather) {
    return (
      <WeatherErrorState
        message={error ?? "Weather data is unavailable."}
        onRetry={handleRetry}
        onHome={handleHome}
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Weather dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Weather conditions for {locationLabel}
        </p>
      </div>

      <CurrentWeatherCard
        weather={weather.current}
        locationLabel={locationLabel}
      />

      <ForecastSection forecast={weather.forecast} />
    </main>
  );
}
