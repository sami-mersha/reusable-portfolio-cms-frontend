// app/_components/FeaturedProjects.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CodeXml, Globe } from "lucide-react";

import { Project } from "../_lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <section className="py-20 text-center text-gray-500">
        No featured projects available
      </section>
    );
  }

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Badge variant="outline" className="w-fit">
            Selected Work
          </Badge>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Projects shaped around outcomes, reliability, and user-facing value.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            A focused selection of real work where product decisions, execution,
            and delivery quality mattered as much as the code itself.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => {
          const techStack = project.tech_stack.filter((tech) => tech.trim());
          const features = project.features.filter((feature) => feature.trim()).slice(0, 4);

          return (
            <Card
              key={project.id}
              className="surface-glow group overflow-hidden border-white/40 bg-white/70 dark:bg-slate-950/45"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
                <div className="absolute left-4 top-4">
                  <Badge className="bg-background/80 text-foreground">Featured</Badge>
                </div>
              </div>

              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <CardDescription className="text-base leading-7">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}

                {features.length > 0 && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {features.map((feature) => (
                      <div
                        key={feature}
                        className="rounded-2xl border border-border/60 bg-background/65 px-4 py-3 text-sm text-muted-foreground"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {project.live_url && (
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={project.live_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="size-4" />
                      Live Project
                    </Link>
                  </Button>
                )}
                {project.github_url && (
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <CodeXml className="size-4" />
                      Source
                    </Link>
                  </Button>
                )}
                {project.live_url && (
                  <Button variant="ghost" asChild className="w-full sm:w-auto">
                    <Link href={project.live_url} target="_blank" rel="noopener noreferrer">
                      Details
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
