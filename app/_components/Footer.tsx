// The footer reuses profile fields from the API so each portfolio can show its own contact links.
import type { ReactNode } from "react";
import { ArrowUpRight, Link2, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Profile } from "../_lib/types";

export default function Footer({ profile }: { profile: Profile }) {
  const socialLinks: Array<{
    href: string;
    label: string;
    icon: ReactNode;
  }> = [];

  if (profile.linktree_url) {
    socialLinks.push({
      href: profile.linktree_url,
      label: "Linktree",
      icon: <Link2 className="size-4" />,
    });
  }

  if (profile.github_url) {
    socialLinks.push({
      href: profile.github_url,
      label: "GitHub",
      icon: <ArrowUpRight className="size-4" />,
    });
  }

  if (profile.linkedin_url) {
    socialLinks.push({
      href: profile.linkedin_url,
      label: "LinkedIn",
      icon: <ArrowUpRight className="size-4" />,
    });
  }

  const contactLinks: Array<{
    href: string;
    label: string;
    icon: ReactNode;
  }> = [];

  if (profile.email) {
    contactLinks.push({
      href: `mailto:${profile.email}`,
      label: profile.email,
      icon: <Mail className="size-4" />,
    });
  }

  if (profile.phone) {
    contactLinks.push({
      href: `tel:${profile.phone}`,
      label: profile.phone,
      icon: <Phone className="size-4" />,
    });
  }

  return (
    <footer className="mt-20 px-4 pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[2rem] border border-border/60 bg-background/55 p-6 shadow-[0_18px_64px_-42px_rgba(15,23,42,0.55)] backdrop-blur-xl md:flex-row md:items-end md:justify-between md:p-8">
        <div className="space-y-3">
          <p className="text-lg font-semibold tracking-tight">{profile.name}</p>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            {profile.tagline || profile.bio}
          </p>
          {contactLinks.length > 0 && (
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              {contactLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 transition hover:text-foreground"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {socialLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
                {link.icon}
              </a>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
