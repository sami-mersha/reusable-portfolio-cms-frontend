// These interfaces describe the shape of the portfolio API response.
// Keep them in sync with the backend so TypeScript can protect your pages and components.
export interface Profile {
  id: number;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  github_url: string | null;
  linkedin_url: string | null;
  linktree_url: string | null;
  email: string | null;
  phone: string | null;
  image: string;
  favicon: string | null;
  image_url: string;
  favicon_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  problem: string;
  solution: string;
  tech_stack: string[];
  features: string[];
  is_featured: number; // 0 or 1
  status: string;
  image: string;
  image_url: string;
  live_url: string | null;
  github_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  organization: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  employment_type: string;
  location: string;
  highlights: string[];
  order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  image: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: number;
  title: string;
  file: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  featured_projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  certificates: Certificate[];
  resumes: Resume[];
}
