import type { WeatherCondition } from "@/types/weather";

const WEATHER_CODES: Record<number, WeatherCondition> = {
  0: { description: "Clear sky", icon: "clear-day" },
  1: { description: "Mainly clear", icon: "clear-day" },
  2: { description: "Partly cloudy", icon: "partly-cloudy-day" },
  3: { description: "Overcast", icon: "overcast" },

  45: { description: "Fog", icon: "fog" },
  48: { description: "Depositing rime fog", icon: "fog" },

  51: { description: "Light drizzle", icon: "drizzle" },
  53: { description: "Moderate drizzle", icon: "drizzle" },
  55: { description: "Dense drizzle", icon: "drizzle" },
  56: { description: "Light freezing drizzle", icon: "sleet" },
  57: { description: "Dense freezing drizzle", icon: "sleet" },

  61: { description: "Slight rain", icon: "rain" },
  63: { description: "Moderate rain", icon: "rain" },
  65: { description: "Heavy rain", icon: "rain" },
  66: { description: "Light freezing rain", icon: "sleet" },
  67: { description: "Heavy freezing rain", icon: "sleet" },

  71: { description: "Slight snowfall", icon: "snow" },
  73: { description: "Moderate snowfall", icon: "snow" },
  75: { description: "Heavy snowfall", icon: "snow" },
  77: { description: "Snow grains", icon: "snow" },

  80: { description: "Slight rain showers", icon: "rain" },
  81: { description: "Moderate rain showers", icon: "rain" },
  82: { description: "Violent rain showers", icon: "rain" },

  85: { description: "Slight snow showers", icon: "snow" },
  86: { description: "Heavy snow showers", icon: "snow" },

  95: { description: "Thunderstorm", icon: "thunderstorms" },
  96: {
    description: "Thunderstorm with slight hail",
    icon: "thunderstorms-hail",
  },
  99: {
    description: "Thunderstorm with heavy hail",
    icon: "thunderstorms-hail",
  },
};

export function getWeatherCondition(
  code: number,
  isDay = true,
): WeatherCondition {
  const condition = WEATHER_CODES[code];

  if (!condition) {
    return {
      description: "Unknown conditions",
      icon: "not-available",
    };
  }

  if (!isDay && condition.icon === "clear-day") {
    return { ...condition, icon: "clear-night" };
  }

  if (!isDay && condition.icon === "partly-cloudy-day") {
    return { ...condition, icon: "partly-cloudy-night" };
  }

  return condition;
}
