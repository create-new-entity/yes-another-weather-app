import type { DailyForecast } from "@/types/weather";
import WeatherIcon from "@/components/WeatherIcon";

type ForecastSectionProps = {
  forecast: DailyForecast[];
};

function formatDate(date: string): { day: string; date: string } {
  // Use UTC to avoid shifting a date because of the browser's timezone.
  const parsedDate = new Date(`${date}T00:00:00Z`);

  return {
    day: new Intl.DateTimeFormat("en", {
      weekday: "short",
      timeZone: "UTC",
    }).format(parsedDate),

    date: new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(parsedDate),
  };
}

export default function ForecastSection({ forecast }: ForecastSectionProps) {
  return (
    <section aria-labelledby="forecast-heading" className="mt-8">
      <div className="mb-4">
        <h2
          id="forecast-heading"
          className="text-xl font-semibold tracking-tight"
        >
          7-day forecast
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Daily conditions and temperatures
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {forecast.map((day, index) => {
          const formattedDate = formatDate(day.date);

          return (
            <article
              key={day.date}
              className="flex min-w-0 flex-col items-center rounded-2xl border border-border bg-card p-4 text-center shadow-sm"
            >
              <p className="font-semibold">
                {index === 0 ? "Today" : formattedDate.day}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {formattedDate.date}
              </p>

              <WeatherIcon
                icon={day.condition.icon}
                description={day.condition.description}
                size={64}
                className="my-3"
              />

              <p className="min-h-10 text-sm text-muted-foreground">
                {day.condition.description}
              </p>

              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="font-semibold">{Math.round(day.high)}°</span>

                <span className="text-muted-foreground">
                  {Math.round(day.low)}°
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
