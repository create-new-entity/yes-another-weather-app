export type WeatherCondition = {
  description: string;
  icon: string;
};

export type CurrentWeather = {
  temperature: number;
  condition: WeatherCondition;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
  rain?: number;
  snowfall?: number;
  isDay?: boolean;
  localTime?: string;
  sunrise?: string;
  sunset?: string;
};

export type DailyForecast = {
  date: string;
  condition: WeatherCondition;
  high: number;
  low: number;
};

export type WeatherData = {
  latitude: number;
  longitude: number;
  timezone?: string;
  current: CurrentWeather;
  forecast: DailyForecast[];
};
