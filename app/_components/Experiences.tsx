// app/_components/ExperiencesSection.tsx
// This section renders the career timeline on the homepage.
import { Experience } from "../_lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Experiences({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) {
    return (
      <section className="py-20 text-center text-gray-500">
        No experiences available
      </section>
    );
  }

  const sortedExperiences = [...experiences].sort((a, b) =>
    b.start_date.localeCompare(a.start_date)
  );

  return (
    <section id="experiences" className="mx-auto max-w-6xl px-4">
      <div className="mb-10 space-y-3">
        <Badge variant="outline" className="w-fit">
          Experience
        </Badge>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Professional experience with a strong bias toward steady delivery.
        </h2>
      </div>

      <div className="relative ml-2 border-l border-border/70 pl-5 md:ml-6 md:pl-10">
        {sortedExperiences.map((exp) => (
          <div key={exp.id} className="relative pb-8 last:pb-0">
            <span className="absolute -left-[1.62rem] top-8 size-3.5 rounded-full border-4 border-background bg-primary shadow-md md:-left-[2.45rem] md:size-4" />

            <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
              <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <CardTitle className="text-2xl">{exp.role}</CardTitle>
                    <Badge variant={exp.is_current ? "default" : "secondary"}>
                      {exp.is_current ? "Current" : "Previous"}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {exp.organization} - {exp.location}
                  </CardDescription>
                </div>

                <Badge variant="outline" className="w-fit">
                  {new Date(exp.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {exp.is_current
                    ? "Present"
                    : exp.end_date
                      ? new Date(exp.end_date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="leading-7 text-muted-foreground">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.highlights.map((highlight) => (
                    <Badge key={highlight} variant="secondary">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
