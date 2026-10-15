import { Suspense } from "react";
import type { Metadata } from "next";

import WeatherDashboard from "../../components/WeatherDashboard";
import { WeatherLoadingSkeleton } from "../../components/WeatherDashboardStates";

export const metadata: Metadata = {
  title: "Dashboard | Aether",
};

type DashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type DashboardContentProps = {
  searchParams: DashboardPageProps["searchParams"];
};

async function DashboardContent({ searchParams }: DashboardContentProps) {
  const params = await searchParams;

  const getParam = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : "";
  };

  const lat = Number(getParam("lat"));
  const lon = Number(getParam("lon"));

  return (
    <WeatherDashboard
      latitude={getParam("lat") ? lat : null}
      longitude={getParam("lon") ? lon : null}
      region={getParam("region")}
      country={getParam("country")}
    />
  );
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  return (
    <Suspense fallback={<WeatherLoadingSkeleton />}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}
