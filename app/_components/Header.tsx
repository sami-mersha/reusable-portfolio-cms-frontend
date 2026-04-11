// The header provides in-page navigation for the homepage sections and a theme switcher.
import Link from "next/link";
import { Profile } from "../_lib/types";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/#experiences", label: "Experience" },
  { href: "/blogs", label: "Blogs" },
  { href: "/#skills", label: "Skills" },
  { href: "/#certificates", label: "Certificates" },
  { href: "/#resumes", label: "Resume" },
];

export default function Header({ profile }: { profile: Profile }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-border/60 bg-background/45 px-4 shadow-[0_18px_64px_-42px_rgba(15,23,42,0.55)] backdrop-blur-xl">
        <div className="flex items-center gap-4 py-4">
          <Link href="/" className="min-w-0">
            <div className="flex flex-col">
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {profile.title || "Portfolio"}
              </span>
              <span className="truncate text-lg font-semibold tracking-tight">
                {profile.name}
              </span>
            </div>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 rounded-full border border-border/60 bg-background/60 p-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto lg:ml-3">
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-4 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-border/60 bg-background/65 px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
