// app/page.tsx
export const dynamic = 'force-dynamic';

import Hero from './_components/Hero';
import FeaturedProjects from './_components/Projects';
import Experiences from './_components/Experiences';
import Skills from './_components/Skills';
import Certificates from './_components/Certificates';
import ResumesSection from './_components/Resumes';
import { getPortfolio } from './_lib/portfolio';

export default async function HomePage() {
  try {
    const data = await getPortfolio();
    const currentRole =
      data.experiences.find((experience) => experience.is_current)?.role ??
      "Software Engineer";

    return (
      <div className="space-y-20 pb-16 sm:space-y-24 lg:space-y-28 lg:pb-20">
        <Hero
          profile={data.profile}
          featuredProjectsCount={data.featured_projects.length}
          totalSkillsCount={data.skills.length}
          careerChaptersCount={data.experiences.length}
          currentRole={currentRole}
        />
        <FeaturedProjects projects={data.featured_projects} />
        <Experiences experiences={data.experiences} />
        <Skills skills={data.skills} />
        <Certificates certificates={data.certificates} />
        <ResumesSection resumes={data.resumes} />
      </div>
    );
  } catch (err) {
    console.error("Failed to load homepage portfolio data:", err);

    return (
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="rounded-[2rem] border border-destructive/20 bg-destructive/10 p-8 text-destructive">
          Failed to load portfolio data. Please check the backend API and try again.
        </div>
      </section>
    );
  }
}
