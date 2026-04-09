// app/_components/CertificatesSection.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Certificate } from "../_lib/types";
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

export default function Certificates({
  certificates,
}: {
  certificates: Certificate[];
}) {
  if (certificates.length === 0) {
    return (
      <section className="py-20 text-center text-gray-500">
        No certificates available
      </section>
    );
  }

  return (
    <section id="certificates" className="mx-auto max-w-6xl px-4">
      <div className="mb-10 space-y-3">
        <Badge variant="outline" className="w-fit">
          Certificates
        </Badge>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Continuous learning backed by recognized coursework and credentials.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {certificates.map((cert) => (
          <Card
            key={cert.id}
            className="surface-glow overflow-hidden border-white/40 bg-white/70 dark:bg-slate-950/45"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={cert.image_url}
                alt={cert.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
                className="object-cover"
              />
            </div>

            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">{cert.title.trim()}</CardTitle>
              <CardDescription className="text-base">{cert.issuer}</CardDescription>
            </CardHeader>

            <CardContent>
              <Badge variant="secondary">
                Issued{" "}
                {new Date(cert.issue_date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </Badge>
            </CardContent>

            <CardFooter className="pt-0">
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                  View Certificate
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
