// app/_components/Hero.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Layers3, MapPin } from "lucide-react";

import { Profile } from "../_lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type HeroProps = {
  profile: Profile;
  featuredProjectsCount: number;
  totalSkillsCount: number;
  careerChaptersCount: number;
  currentRole: string;
};

export default function Hero({
  profile,
  featuredProjectsCount,
  totalSkillsCount,
  careerChaptersCount,
  currentRole,
}: HeroProps) {

  return (
    <section id="hero" className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:pt-10 md:pt-14">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-8">
          <Badge
            variant="outline"
            className="w-fit border-primary/25 bg-primary/10 text-primary"
          >
            Software Engineer / Portfolio
          </Badge>

          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
              Addis Ababa, Ethiopia
            </p>
            <h1 className="text-shadow-soft max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-7xl">
              Building dependable digital products with clarity, craft, and calm
              execution.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {profile.bio}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="#projects">
                Explore Featured Work
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
              <Link href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild className="w-full sm:w-auto">
              <Link href={profile.github_url} target="_blank" rel="noopener noreferrer">
                GitHub
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
              <CardContent className="p-5">
                <p className="text-3xl font-semibold tracking-tight">
                  {featuredProjectsCount}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Featured builds delivered
                </p>
              </CardContent>
            </Card>
            <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
              <CardContent className="p-5">
                <p className="text-3xl font-semibold tracking-tight">{totalSkillsCount}</p>
                <p className="mt-2 text-sm text-muted-foreground">Tools and platforms</p>
              </CardContent>
            </Card>
            <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
              <CardContent className="p-5">
                <p className="text-3xl font-semibold tracking-tight">
                  {careerChaptersCount}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Career chapters so far
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="surface-glow overflow-hidden border-white/40 bg-white/70 p-3 dark:bg-slate-950/45">
          <CardContent className="grid gap-6 rounded-[1.4rem] border border-border/60 bg-background/75 p-4 md:p-5">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-amber-100 via-white to-sky-100 dark:from-amber-400/15 dark:via-slate-950 dark:to-sky-400/15">
              <Image
                src={profile.image_url}
                alt={profile.name}
                width={900}
                height={1100}
                preload
                unoptimized
                className="h-auto w-full object-cover object-top"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 text-primary" />
                  Location
                </div>
                <p className="font-medium">{profile.location}</p>
              </div>

              <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <BriefcaseBusiness className="size-4 text-primary" />
                  Current Focus
                </div>
                <p className="font-medium">{currentRole}</p>
              </div>

              <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4 sm:col-span-2">
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Layers3 className="size-4 text-primary" />
                  Short Positioning
                </div>
                <p className="leading-7 text-muted-foreground">{profile.tagline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
