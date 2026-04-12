import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="loading-sheen h-5 w-32 rounded-full" />
        <div className="loading-sheen h-5 w-24 rounded-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="loading-sheen h-10 w-full max-w-3xl rounded-full" />
            <div className="loading-sheen h-5 w-full max-w-2xl rounded-full" />
            <div className="loading-sheen h-5 w-11/12 max-w-2xl rounded-full" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <div className="loading-sheen h-11 w-full rounded-full sm:w-48" />
            <div className="loading-sheen h-11 w-full rounded-full sm:w-40" />
          </div>

          <Card className="surface-glow overflow-hidden border-white/40 bg-white/70 dark:bg-slate-950/45">
            <div className="loading-sheen aspect-[16/10] w-full" />
          </Card>
        </div>

        <div className="grid gap-6">
          <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
            <CardContent className="space-y-5 p-6">
              <div className="space-y-3">
                <div className="loading-sheen h-4 w-24 rounded-full" />
                <div className="loading-sheen h-4 w-full rounded-full" />
                <div className="loading-sheen h-4 w-11/12 rounded-full" />
              </div>

              <div className="space-y-3">
                <div className="loading-sheen h-4 w-24 rounded-full" />
                <div className="loading-sheen h-4 w-full rounded-full" />
                <div className="loading-sheen h-4 w-10/12 rounded-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
            <CardContent className="p-6">
              <div className="mb-4 loading-sheen h-4 w-28 rounded-full" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`tech-skeleton-${index}`}
                    className="loading-sheen h-8 w-24 rounded-full"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
            <CardContent className="p-6">
              <div className="mb-4 loading-sheen h-4 w-32 rounded-full" />
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`feature-skeleton-${index}`}
                    className="loading-sheen h-16 rounded-2xl"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
            <CardContent className="space-y-4 p-6">
              <div className="loading-sheen h-4 w-full rounded-full" />
              <div className="loading-sheen h-4 w-5/6 rounded-full" />
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="loading-sheen h-4 w-24 rounded-full" />
                <div className="loading-sheen h-4 w-24 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
