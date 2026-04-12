import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="mb-10 flex flex-col gap-5">
        <div className="loading-sheen h-5 w-28 rounded-full" />
        <div className="space-y-3">
          <div className="loading-sheen h-9 w-full max-w-3xl rounded-full" />
          <div className="loading-sheen h-4 w-full max-w-xl rounded-full" />
        </div>
      </div>

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={`blog-skeleton-${index}`}
            className="surface-glow overflow-hidden border-white/40 bg-white/70 dark:bg-slate-950/45"
          >
            <div className="grid gap-5 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="loading-sheen order-first aspect-[16/10] w-full rounded-[1.25rem] lg:order-none lg:rounded-[1.5rem]" />

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <div className="loading-sheen h-5 w-20 rounded-full" />
                  <div className="loading-sheen h-5 w-24 rounded-full" />
                </div>
                <div className="loading-sheen h-6 w-4/5 rounded-full" />
                <div className="loading-sheen h-4 w-full rounded-full" />
                <div className="loading-sheen h-4 w-11/12 rounded-full" />
                <div className="flex gap-3">
                  <div className="loading-sheen h-4 w-24 rounded-full" />
                  <div className="loading-sheen h-4 w-24 rounded-full" />
                </div>
                <div className="loading-sheen h-9 w-32 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
