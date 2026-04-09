import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CodeXml,
  Globe,
  Layers3,
  Lightbulb,
  ListChecks,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPortfolio, getProjectBySlug } from "@/app/_lib/portfolio";
import {
  buildProjectJsonLd,
  buildProjectKeywords,
  getCanonicalUrl,
  serializeJsonLd,
} from "@/app/_lib/seo";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPortfolio();
  const project = data.projects.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = getCanonicalUrl(`/projects/${project.slug}`);
  const description = project.description.trim() || project.problem || project.solution;

  return {
    title: `${project.title} | ${data.profile.name}`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: buildProjectKeywords(project, data.profile.name),
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: project.title,
      description,
      siteName: data.profile.name,
      images: project.image_url
        ? [
            {
              url: project.image_url,
              alt: project.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: project.image_url ? [project.image_url] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [data, project] = await Promise.all([getPortfolio(), getProjectBySlug(slug)]);

  if (!project) {
    notFound();
  }

  const techStack = project.tech_stack.filter((tech) => tech.trim());
  const features = project.features.filter((feature) => feature.trim());
  const jsonLd = buildProjectJsonLd(data, project);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Button variant="ghost" asChild className="pl-0">
            <Link href="/#projects">
              <ArrowLeft className="size-4" />
              Back to projects
            </Link>
          </Button>
          <Badge variant="outline">{project.status}</Badge>
          {project.is_featured === 1 && <Badge>Featured</Badge>}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {project.title}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                {project.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {project.live_url && (
                <Button asChild className="w-full sm:w-auto">
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    <Globe className="size-4" />
                    Visit Live Project
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <CodeXml className="size-4" />
                    View Source
                  </a>
                </Button>
              )}
            </div>

            <Card className="surface-glow overflow-hidden border-white/40 bg-white/70 dark:bg-slate-950/45">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  unoptimized
                  className="object-cover"
                />
              </div>
            </Card>
          </div>

          <div className="grid gap-6">
            <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
              <CardContent className="grid gap-5 p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Lightbulb className="size-4 text-primary" />
                    Problem
                  </div>
                  <p className="leading-7 text-muted-foreground">{project.problem}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Layers3 className="size-4 text-primary" />
                    Solution
                  </div>
                  <p className="leading-7 text-muted-foreground">{project.solution}</p>
                </div>
              </CardContent>
            </Card>

            {techStack.length > 0 && (
              <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CodeXml className="size-4 text-primary" />
                    Tech Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {features.length > 0 && (
              <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <ListChecks className="size-4 text-primary" />
                    Key Features
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {features.map((feature) => (
                      <div
                        key={feature}
                        className="rounded-2xl border border-border/60 bg-background/65 px-4 py-3 text-sm text-muted-foreground"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
              <CardContent className="grid gap-3 p-6 text-sm text-muted-foreground">
                <div className="flex items-center justify-between gap-4">
                  <span>Published</span>
                  <span className="font-medium text-foreground">{project.status}</span>
                </div>
                
                <div className="flex flex-wrap gap-3 pt-2">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition hover:text-foreground"
                    >
                      Live project
                      <ArrowUpRight className="size-4" />
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition hover:text-foreground"
                    >
                      Source code
                      <ArrowUpRight className="size-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
