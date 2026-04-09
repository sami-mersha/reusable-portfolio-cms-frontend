import { PortfolioData, Project } from "./types";

const FALLBACK_SITE_URL = "http://localhost:3000";

function normalizeUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

function isLocalUrl(url: string) {
  return /:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(url);
}

function unique(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])
  );
}

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (!configuredUrl) {
    return FALLBACK_SITE_URL;
  }

  const withProtocol = configuredUrl.startsWith("http")
    ? configuredUrl
    : `https://${configuredUrl}`;

  return normalizeUrl(withProtocol);
}

export function getCanonicalUrl(path = "") {
  const siteUrl = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return path ? `${siteUrl}${normalizedPath}` : siteUrl;
}

export function shouldIndexSite() {
  return !isLocalUrl(getSiteUrl());
}

export function buildSeoTitle(name: string, tagline: string) {
  const normalizedName = name.trim();
  const normalizedTagline = tagline.trim();

  if (!normalizedTagline) return normalizedName;

  return normalizedTagline.toLowerCase().includes(normalizedName.toLowerCase())
    ? normalizedTagline
    : `${normalizedName} | ${normalizedTagline}`;
}

export function buildSeoDescription(tagline: string, bio: string) {
  const normalizedTagline = tagline.trim();
  const normalizedBio = bio.trim();

  return normalizedTagline || normalizedBio;
}

export function buildPortfolioKeywords(data: PortfolioData) {
  const { profile, projects, skills, experiences, certificates } = data;

  return unique([
    profile.name,
    profile.title,
    profile.tagline,
    profile.location,
    ...skills.map((skill) => skill.name),
    ...skills.map((skill) => skill.category),
    ...projects.map((project) => project.title),
    ...projects.flatMap((project) => project.tech_stack),
    ...projects.flatMap((project) => project.features),
    ...experiences.map((experience) => experience.organization),
    ...experiences.map((experience) => experience.role),
    ...certificates.map((certificate) => certificate.title),
    ...certificates.map((certificate) => certificate.issuer),
  ]);
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildPortfolioJsonLd(data: PortfolioData) {
  const homepageUrl = getCanonicalUrl("/");
  const { profile, featured_projects, skills, experiences, certificates, resumes } = data;
  const description = buildSeoDescription(profile.tagline, profile.bio);
  const sameAs = unique([
    profile.github_url,
    profile.linkedin_url,
    profile.linktree_url,
  ]);
  const currentExperience = experiences.find((experience) => experience.is_current);

  const graph = [
    {
      "@type": "WebSite",
      "@id": `${homepageUrl}#website`,
      url: homepageUrl,
      name: profile.name,
      headline: buildSeoTitle(profile.name, profile.tagline),
      description,
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": `${homepageUrl}#person`,
      name: profile.name,
      url: homepageUrl,
      image: profile.image_url,
      description: profile.bio,
      jobTitle: currentExperience?.role ?? profile.title,
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.location,
      },
      email: profile.email ?? undefined,
      telephone: profile.phone ?? undefined,
      sameAs: sameAs.length > 0 ? sameAs : undefined,
      knowsAbout: unique([
        ...skills.map((skill) => skill.name),
        ...skills.map((skill) => skill.category),
      ]),
      worksFor: currentExperience
        ? {
            "@type": "Organization",
            name: currentExperience.organization,
          }
        : undefined,
    },
    {
      "@type": "CollectionPage",
      "@id": `${homepageUrl}#portfolio`,
      url: homepageUrl,
      name: buildSeoTitle(profile.name, profile.tagline),
      description,
      isPartOf: {
        "@id": `${homepageUrl}#website`,
      },
      about: {
        "@id": `${homepageUrl}#person`,
      },
    },
    {
      "@type": "ItemList",
      "@id": `${homepageUrl}#featured-projects`,
      name: "Featured Projects",
      itemListElement: featured_projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          image: project.image_url,
          url: getCanonicalUrl(`/projects/${project.slug}`),
          keywords: unique([...project.tech_stack, ...project.features]),
        },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${homepageUrl}#skills`,
      name: "Skills",
      itemListElement: skills.map((skill, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "DefinedTerm",
          name: skill.name,
          inDefinedTermSet: skill.category,
        },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${homepageUrl}#experience`,
      name: "Work Experience",
      itemListElement: experiences.map((experience, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Role",
          roleName: experience.role,
          startDate: experience.start_date,
          endDate: experience.end_date ?? undefined,
          worksFor: {
            "@type": "Organization",
            name: experience.organization,
          },
          description: experience.description,
        },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${homepageUrl}#certificates`,
      name: "Certificates",
      itemListElement: certificates.map((certificate, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "EducationalOccupationalCredential",
          name: certificate.title.trim(),
          credentialCategory: certificate.issuer,
          dateCreated: certificate.issue_date,
          url: certificate.credential_url,
          image: certificate.image_url,
        },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${homepageUrl}#resumes`,
      name: "Resumes",
      itemListElement: resumes.map((resume, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "DigitalDocument",
          name: resume.title,
          url: resume.file_url,
          dateModified: resume.updated_at,
        },
      })),
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildProjectKeywords(project: Project, profileName: string) {
  return unique([
    project.title,
    profileName,
    project.description,
    project.problem,
    project.solution,
    ...project.tech_stack,
    ...project.features,
  ]);
}

export function buildProjectJsonLd(
  data: PortfolioData,
  project: Project
) {
  const { profile } = data;
  const projectUrl = getCanonicalUrl(`/projects/${project.slug}`);
  const sameAs = unique([project.live_url, project.github_url]);
  const description = project.description.trim() || buildSeoDescription(project.problem, project.solution);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${projectUrl}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: profile.name,
            item: getCanonicalUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${getCanonicalUrl("/")}#projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: projectUrl,
          },
        ],
      },
      {
        "@type": "CreativeWork",
        "@id": `${projectUrl}#project`,
        url: projectUrl,
        name: project.title,
        headline: project.title,
        description,
        image: project.image_url,
        creator: {
          "@type": "Person",
          name: profile.name,
          url: getCanonicalUrl("/"),
        },
        about: unique([...project.tech_stack, ...project.features]),
        keywords: buildProjectKeywords(project, profile.name),
        sameAs: sameAs.length > 0 ? sameAs : undefined,
        mainEntityOfPage: projectUrl,
        datePublished: project.created_at,
        dateModified: project.updated_at,
      },
    ],
  };
}
