type WeatherIconProps = {
  icon: string;
  description: string;
  size?: number;
  className?: string;
};

const ICON_ALIASES: Record<string, string> = {
  "clear-day": "clear-day",
  "clear-night": "clear-night",
  "partly-cloudy-day": "partly-cloudy-day",
  "partly-cloudy-night": "partly-cloudy-night",
  overcast: "overcast",
  fog: "fog",
  drizzle: "drizzle",
  sleet: "sleet",
  rain: "rain",
  snow: "snow",
  thunderstorms: "thunderstorms",
  "thunderstorms-hail": "thunderstorms",
  "not-available": "not-available",
};

export default function WeatherIcon({
  icon,
  description,
  size = 64,
  className,
}: WeatherIconProps) {
  const slug = ICON_ALIASES[icon] ?? "not-available";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.meteocons.com/3.0.0-next.10/svg/fill/${slug}.svg`}
      alt={description}
      width={size}
      height={size}
      className={className}
      loading="lazy"
      draggable={false}
    />
  );
}
