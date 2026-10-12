import Link from "next/link";
import { CloudSun, Search, Globe } from "lucide-react";

import ThemeSelector from "./components/ThemeSelector";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
        <header className="flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Aether home"
            className="inline-flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground sm:gap-2.5"
          >
            <CloudSun
              size={30}
              strokeWidth={1.7}
              aria-hidden="true"
              className="shrink-0"
            />

            <span className="truncate text-base font-semibold tracking-tight sm:text-xl">
              Aether
            </span>
          </Link>

          <ThemeSelector />
        </header>

        <section className="mx-auto mt-20 w-full max-w-3xl text-center sm:mt-28">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            The world, at a glance.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Explore any corner of the planet. Discover local weather,
            conditions, and more.
          </p>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Search a city or explore the globe to get started.
          </p>
        </section>

        <section
          aria-label="Find a location"
          className="mx-auto mt-10 w-full max-w-2xl sm:mt-12"
        >
          <div className="flex items-center gap-3">
            {/* Search field */}
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition-colors focus-within:border-foreground">
              <input
                type="text"
                aria-label="Search for a city"
                placeholder="Enter a city..."
                autoComplete="off"
                className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
              />
            </div>

            {/* Search button */}
            <button
              type="button"
              aria-label="Search"
              className="group relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              <Search size={20} strokeWidth={1.8} aria-hidden="true" />

              <span
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                Search
              </span>
            </button>

            {/* Globe button */}
            <button
              type="button"
              aria-label="Explore the globe"
              className="group relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              <Globe size={20} strokeWidth={1.8} aria-hidden="true" />

              <span
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                Explore the globe
              </span>
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground sm:text-sm">
            Discover conditions anywhere in the world.
          </p>
        </section>
      </div>
    </main>
  );
}
