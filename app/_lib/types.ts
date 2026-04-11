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

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
  id: number;
  blog_id: number;
  first_name: string;
  last_name: string;
  email: string;
  comment: string;
  is_approved: boolean | number;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  is_published: boolean;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  category_id: number | null;
  comments_count?: number;
  category: BlogCategory | null;
}

export interface BlogDetail extends Blog {
  comments: BlogComment[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface BlogCommentSubmission {
  blog_id: number;
  first_name: string;
  last_name: string;
  email: string;
  comment: string;
}

export interface BlogCommentSubmissionResponse {
  message: string;
  data: BlogComment;
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
