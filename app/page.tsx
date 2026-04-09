// app/page.tsx
// This is the landing page for the template.
// Beginners can swap sections in or out here without changing the shared layout.
export const dynamic = 'force-dynamic';

import Hero from './_components/Hero';
import FeaturedProjects from './_components/Projects';
import Experiences from './_components/Experiences';
import Skills from './_components/Skills';
import Certificates from './_components/Certificates';
import ResumesSection from './_components/Resumes';
import PublicErrorState from './_components/PublicErrorState';
import { buildUserFacingErrorState } from './_lib/errors';
import { getPortfolio } from './_lib/portfolio';
import { buildPortfolioJsonLd, serializeJsonLd } from './_lib/seo';

export default async function HomePage() {
  try {
    const data = await getPortfolio();
    const currentRole =
      data.experiences.find((experience) => experience.is_current)?.role ??
      "Software Engineer";
    const jsonLd = buildPortfolioJsonLd(data);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
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
      </>
    );
  } catch (err) {
    const errorState = buildUserFacingErrorState(err, {
      title: "Portfolio content is temporarily unavailable",
      publicMessage:
        "We couldn't load the homepage content right now. The backend service may be temporarily unavailable. Please try again shortly.",
      debugMessage:
        "The homepage could not load portfolio data. Debug details are shown below.",
      debugHint:
        "Make sure NEXT_PUBLIC_BASE_URL is correct and the backend responds to /api/portfolio.",
    });

    return (
      <PublicErrorState
        title={errorState.title}
        message={errorState.message}
        hint={errorState.hint}
        details={errorState.details}
      />
    );
  }
}
