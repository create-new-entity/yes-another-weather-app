import GlobePicker from "@/components/GlobePicker";

export default function GlobePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-12 pt-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Choose a location
        </h1>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          Rotate the globe and select any point on Earth.
        </p>

        <div className="mt-6 w-full">
          <GlobePicker />
        </div>
      </section>
    </main>
  );
}
