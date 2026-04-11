import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="loading-sheen h-5 w-28 rounded-full" />
        <div className="loading-sheen h-5 w-24 rounded-full" />
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="loading-sheen h-10 w-full max-w-3xl rounded-full" />
          <div className="loading-sheen h-5 w-full max-w-2xl rounded-full" />
        </div>

        <Card className="surface-glow overflow-hidden border-white/40 bg-white/70 dark:bg-slate-950/45">
          <div className="loading-sheen h-72 w-full" />
        </Card>

        <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <div className="loading-sheen h-4 w-full rounded-full" />
            <div className="loading-sheen h-4 w-11/12 rounded-full" />
            <div className="loading-sheen h-4 w-10/12 rounded-full" />
            <div className="loading-sheen h-4 w-9/12 rounded-full" />
          </CardContent>
        </Card>

        <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
          <CardContent className="space-y-4 p-6">
            <div className="loading-sheen h-6 w-40 rounded-full" />
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`comment-skeleton-${index}`}
                  className="rounded-[1.4rem] border border-border/60 bg-background/65 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="loading-sheen h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <div className="loading-sheen h-4 w-1/2 rounded-full" />
                      <div className="loading-sheen h-4 w-full rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
