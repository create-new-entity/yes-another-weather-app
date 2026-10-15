import { AlertCircle, RefreshCw, Home } from "lucide-react";

type WeatherLoadingSkeletonProps = {
  locationLabel?: string;
};

type WeatherErrorStateProps = {
  message: string;
  onRetry: () => void;
  onHome: () => void;
};

export function WeatherLoadingSkeleton({
  locationLabel,
}: WeatherLoadingSkeletonProps) {
  return (
    <main
      aria-label="Loading weather dashboard"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mb-6">
        <div className="h-8 w-48 rounded-lg bg-foreground/10" />
        {locationLabel ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Loading weather for {locationLabel}…
          </p>
        ) : (
          <div className="mt-3 h-4 w-64 rounded bg-foreground/10" />
        )}
      </div>

      {/* Current weather card skeleton */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="h-4 w-32 rounded bg-foreground/10" />
            <div className="h-8 w-56 max-w-full rounded bg-foreground/10" />
            <div className="h-4 w-36 rounded bg-foreground/10" />
          </div>

          <div className="flex items-center gap-4">
            <div className="size-20 rounded-full bg-foreground/10" />
            <div className="space-y-3">
              <div className="h-12 w-28 rounded bg-foreground/10" />
              <div className="h-4 w-32 rounded bg-foreground/10" />
              <div className="h-4 w-24 rounded bg-foreground/10" />
            </div>
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="size-5 shrink-0 rounded bg-foreground/10" />
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-foreground/10" />
                <div className="h-4 w-16 rounded bg-foreground/10" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seven-day forecast skeleton */}
      <section className="mt-8">
        <div className="mb-4 space-y-2">
          <div className="h-6 w-40 rounded bg-foreground/10" />
          <div className="h-4 w-52 rounded bg-foreground/10" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {Array.from({ length: 7 }, (_, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-4"
            >
              <div className="h-4 w-12 rounded bg-foreground/10" />
              <div className="mt-2 h-3 w-16 rounded bg-foreground/10" />
              <div className="my-4 size-16 rounded-full bg-foreground/10" />
              <div className="h-8 w-full rounded bg-foreground/10" />
              <div className="mt-4 h-4 w-20 rounded bg-foreground/10" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function WeatherErrorState({
  message,
  onRetry,
  onHome,
}: WeatherErrorStateProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl items-center justify-center px-4 py-12">
      <section
        role="alert"
        className="w-full rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-10"
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-foreground/5">
          <AlertCircle
            size={28}
            aria-hidden="true"
            className="text-muted-foreground"
          />
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          Unable to load weather
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {message}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Try again
          </button>

          <button
            type="button"
            onClick={onHome}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <Home size={16} aria-hidden="true" />
            Back home
          </button>
        </div>
      </section>
    </main>
  );
}
