import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Profile } from "../_lib/types";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="mt-20 px-4 pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[2rem] border border-border/60 bg-background/55 p-6 shadow-[0_18px_64px_-42px_rgba(15,23,42,0.55)] backdrop-blur-xl md:flex-row md:items-end md:justify-between md:p-8">
        <div className="space-y-3">
          <p className="text-lg font-semibold tracking-tight">{profile.name}</p>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Built with Next.js and a cleaner editorial design system for a more
            modern portfolio experience.
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" asChild>
            <Link href={profile.github_url} target="_blank" rel="noopener noreferrer">
              GitHub
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
              LinkedIn
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
