// app/_components/ResumesSection.tsx
// This section highlights downloadable resumes pulled from the backend.
import Link from "next/link";
import { Download, FileText } from "lucide-react";

import { Resume } from "../_lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResumesSection({ resumes }: { resumes: Resume[] }) {
  if (resumes.length === 0) {
    return (
      <section className="py-20 text-center text-gray-500">
        No resumes available
      </section>
    );
  }

  return (
    <section id="resumes" className="mx-auto max-w-6xl px-4">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="surface-glow border-primary/20 bg-primary text-primary-foreground">
          <CardHeader className="space-y-4">
            <Badge
              variant="outline"
              className="w-fit border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
            >
              Resume
            </Badge>
            <CardTitle className="text-3xl sm:text-4xl">
              Need the concise version for recruiters or hiring managers?
            </CardTitle>
            <CardDescription className="max-w-xl text-base leading-7 text-primary-foreground/80">
              Download the latest resume for a clean summary of experience,
              projects, and technical strengths.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resumes[0] && (
              <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
                <Link href={resumes[0].file_url} download>
                  <Download className="size-4" />
                  Download Latest Resume
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45"
            >
              <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{resume.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Downloadable document hosted by the portfolio CMS.
                    </p>
                  </div>
                </div>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href={resume.file_url} download>
                    Download
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
