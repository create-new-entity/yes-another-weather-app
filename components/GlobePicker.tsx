"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { GlobeMethods } from "react-globe.gl";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-square w-full items-center justify-center text-sm text-muted-foreground sm:aspect-[16/10]">
      Loading globe...
    </div>
  ),
});

type Coordinates = {
  lat: number;
  lng: number;
};

type PointerStart = {
  x: number;
  y: number;
  pointerId: number;
};

const EARTH_IMAGE =
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

const INITIAL_VIEW = {
  lat: 20,
  lng: 0,
  altitude: 2.2,
};

const DRAG_THRESHOLD = 5;

export default function GlobePicker() {
  const router = useRouter();
  const pathname = usePathname();

  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<PointerStart | null>(null);

  const [selectedPoint, setSelectedPoint] = useState<Coordinates | null>(null);

  const [globeKey, setGlobeKey] = useState(0);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Reset the selection and request a fresh globe when the route changes.
  useEffect(() => {
    setSelectedPoint(null);
    pointerStartRef.current = null;

    if (pathname === "/globe") {
      setDimensions({ width: 0, height: 0 });
      setGlobeKey((key) => key + 1);
    }
  }, [pathname]);

  const measureContainer = useCallback(() => {
    const container = containerRef.current;

    if (!container) return;

    const { width, height } = container.getBoundingClientRect();

    setDimensions({
      width: Math.floor(width),
      height: Math.floor(height),
    });
  }, []);

  // Remeasure after the globe instance changes.
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    measureContainer();

    const observer = new ResizeObserver(() => {
      measureContainer();
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [globeKey, measureContainer]);

  function selectPoint(point: Coordinates) {
    setSelectedPoint({
      lat: point.lat,
      lng: point.lng,
    });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;

    if (!start || start.pointerId !== event.pointerId) return;
    if (event.button !== 0) return;

    const container = containerRef.current;
    const globe = globeRef.current;
    const canvas = container?.querySelector("canvas");

    if (!container || !globe || !canvas) return;

    const bounds = canvas.getBoundingClientRect();

    const point = globe.toGlobeCoords(
      event.clientX - bounds.left,
      event.clientY - bounds.top,
    );

    if (point) {
      selectPoint(point);
    }
  }

  function handleConfirm() {
    if (!selectedPoint) return;

    const params = new URLSearchParams({
      lat: String(selectedPoint.lat),
      lon: String(selectedPoint.lng),
    });

    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
      {/* Selection panel */}
      <div className="rounded-2xl border border-border bg-background p-4 sm:p-5">
        {selectedPoint ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Latitude</p>

                <p className="mt-1 font-medium tabular-nums">
                  {selectedPoint.lat.toFixed(4)}°
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Longitude</p>

                <p className="mt-1 font-medium tabular-nums">
                  {selectedPoint.lng.toFixed(4)}°
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="mt-4 w-full rounded-xl bg-foreground px-4 py-3 font-medium text-background transition-opacity hover:opacity-90"
            >
              Confirm location
            </button>
          </>
        ) : (
          <p className="py-2 text-center text-sm text-muted-foreground">
            Select a point on the globe to see its coordinates.
          </p>
        )}
      </div>

      {/* Globe */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartRef.current = null;
        }}
        className="mt-4 aspect-square w-full overflow-hidden rounded-2xl border border-border sm:aspect-[16/10]"
      >
        {dimensions.width > 0 && dimensions.height > 0 && (
          <Globe
            key={globeKey}
            ref={globeRef}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl={EARTH_IMAGE}
            showAtmosphere
            atmosphereColor="#8bb8d8"
            atmosphereAltitude={0.15}
            pointsData={selectedPoint ? [selectedPoint] : []}
            pointLat="lat"
            pointLng="lng"
            pointColor={() => "#f59e0b"}
            pointRadius={0.45}
            pointAltitude={0.015}
            onGlobeReady={() => {
              globeRef.current?.pointOfView(INITIAL_VIEW, 0);
            }}
          />
        )}
      </div>
    </div>
  );
}
