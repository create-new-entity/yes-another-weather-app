import { getWeatherCondition } from "@/lib/weather-codes";
import type {
  CurrentWeather,
  DailyForecast,
  WeatherData,
} from "@/types/weather";

type OpenMeteoResponse = {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  current?: {
    time?: string;
    temperature_2m?: number;
    weather_code?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    rain?: number;
    snowfall?: number;
    is_day?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    sunrise?: string[];
    sunset?: string[];
  };
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function optionalNumber(value: unknown): number | undefined {
  return isFiniteNumber(value) ? value : undefined;
}

function requiredNumber(value: unknown, field: string): number {
  if (!isFiniteNumber(value)) {
    throw new Error(`Weather data is missing a valid ${field}.`);
  }

  return value;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Weather data is missing a valid ${field}.`);
  }

  return value;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function optionalDailyString(values: string[] | undefined): string | undefined {
  return optionalString(values?.[0]);
}

export async function getWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  if (
    !isFiniteNumber(latitude) ||
    !isFiniteNumber(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Please select a valid location.");
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      "temperature_2m",
      "weather_code",
      "relative_humidity_2m",
      "is_day",
      "wind_speed_10m",
      "apparent_temperature",
      "snowfall",
      "rain",
    ].join(","),
    daily: [
      "sunrise",
      "sunset",
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
    ].join(","),
    timezone: "auto",
    forecast_days: "7",
  });

  let response: Response;

  try {
    response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error(
      "Unable to connect to the weather service. Check your connection and try again.",
    );
  }

  if (!response.ok) {
    throw new Error(
      "The weather service could not provide weather data. Please try again.",
    );
  }

  let data: OpenMeteoResponse;

  try {
    data = (await response.json()) as OpenMeteoResponse;
  } catch {
    throw new Error("The weather service returned an invalid response.");
  }

  const current = data.current;
  const daily = data.daily;

  if (!current || !daily) {
    throw new Error("The weather service returned incomplete data.");
  }

  const temperature = requiredNumber(
    current.temperature_2m,
    "current temperature",
  );

  const currentCode = requiredNumber(
    current.weather_code,
    "current weather code",
  );

  if (!Number.isInteger(currentCode)) {
    throw new Error("The current weather code is invalid.");
  }

  const isDay =
    current.is_day === 0 ? false : current.is_day === 1 ? true : undefined;

  const currentWeather: CurrentWeather = {
    temperature,
    condition: getWeatherCondition(currentCode, isDay ?? true),
    feelsLike: optionalNumber(current.apparent_temperature),
    humidity: optionalNumber(current.relative_humidity_2m),
    windSpeed: optionalNumber(current.wind_speed_10m),
    rain: optionalNumber(current.rain),
    snowfall: optionalNumber(current.snowfall),
    isDay,
    localTime: optionalString(current.time),
    sunrise: optionalDailyString(daily.sunrise),
    sunset: optionalDailyString(daily.sunset),
  };

  const dates = daily.time;
  const codes = daily.weather_code;
  const highs = daily.temperature_2m_max;
  const lows = daily.temperature_2m_min;

  if (
    !dates ||
    !codes ||
    !highs ||
    !lows ||
    dates.length < 7 ||
    codes.length < 7 ||
    highs.length < 7 ||
    lows.length < 7
  ) {
    throw new Error(
      "The weather service did not return a complete seven-day forecast.",
    );
  }

  const forecast: DailyForecast[] = dates.slice(0, 7).map((date, index) => {
    const code = codes[index];
    const high = highs[index];
    const low = lows[index];

    requiredString(date, `forecast date ${index + 1}`);
    requiredNumber(code, `weather code for forecast day ${index + 1}`);
    requiredNumber(high, `high temperature for forecast day ${index + 1}`);
    requiredNumber(low, `low temperature for forecast day ${index + 1}`);

    if (!Number.isInteger(code)) {
      throw new Error(
        `The weather code for forecast day ${index + 1} is invalid.`,
      );
    }

    return {
      date,
      condition: getWeatherCondition(code),
      high,
      low,
    };
  });

  return {
    latitude: isFiniteNumber(data.latitude) ? data.latitude : latitude,
    longitude: isFiniteNumber(data.longitude) ? data.longitude : longitude,
    timezone: optionalString(data.timezone),
    current: currentWeather,
    forecast,
  };
}
