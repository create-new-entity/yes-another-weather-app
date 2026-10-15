import { Droplets, Wind, Sunrise, Sunset, Thermometer } from "lucide-react";

import WeatherIcon from "@/components/WeatherIcon";
import type { CurrentWeather } from "@/types/weather";

type CurrentWeatherCardProps = {
  weather: CurrentWeather;
  locationLabel: string;
};

function formatTime(value?: string): string | null {
  if (!value) return null;

  // Open-Meteo returns local date/time strings for the selected timezone.
  const match = value.match(/(?:T|\s)(\d{2}):(\d{2})/);

  if (!match) return value;

  return `${match[1]}:${match[2]}`;
}

function WeatherDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>

      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function CurrentWeatherCard({
  weather,
  locationLabel,
}: CurrentWeatherCardProps) {
  const localTime = formatTime(weather.localTime);
  const sunrise = formatTime(weather.sunrise);
  const sunset = formatTime(weather.sunset);

  console.log("weather.condition.icon", weather.condition.icon);

  return (
    <section
      aria-label="Current weather"
      className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Current weather</p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            {locationLabel}
          </h2>

          {localTime && (
            <p className="mt-1 text-sm text-muted-foreground">
              Local time · {localTime}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <WeatherIcon
            icon={weather.condition.icon}
            description={weather.condition.description}
            size={88}
            className="shrink-0"
          />

          <div>
            <p className="text-5xl font-semibold tracking-tighter">
              {Math.round(weather.temperature)}°
            </p>
            <p className="mt-1 text-muted-foreground">
              {weather.condition.description}
            </p>

            {weather.feelsLike !== undefined && (
              <p className="mt-1 text-sm text-muted-foreground">
                Feels like {Math.round(weather.feelsLike)}°
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="my-6 border-t border-border" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
        {weather.humidity !== undefined && (
          <WeatherDetail
            icon={<Droplets size={20} />}
            label="Humidity"
            value={`${weather.humidity}%`}
          />
        )}

        {weather.windSpeed !== undefined && (
          <WeatherDetail
            icon={<Wind size={20} />}
            label="Wind speed"
            value={`${weather.windSpeed} km/h`}
          />
        )}

        {weather.rain !== undefined && weather.rain > 0 && (
          <WeatherDetail
            icon={<Droplets size={20} />}
            label="Current rain"
            value={`${weather.rain} mm`}
          />
        )}

        {weather.snowfall !== undefined && weather.snowfall > 0 && (
          <WeatherDetail
            icon={<Thermometer size={20} />}
            label="Current snowfall"
            value={`${weather.snowfall} cm`}
          />
        )}

        {sunrise && (
          <WeatherDetail
            icon={<Sunrise size={20} />}
            label="Sunrise"
            value={sunrise}
          />
        )}

        {sunset && (
          <WeatherDetail
            icon={<Sunset size={20} />}
            label="Sunset"
            value={sunset}
          />
        )}
      </div>
    </section>
  );
}
