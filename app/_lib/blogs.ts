// Blog data access and small presentation helpers stay here so routes can stay focused on UI.
import { cache } from "react";

import { PortfolioApiError } from "./errors";
import { fetchFromApi, postToApi } from "./api";
import type {
  Blog,
  BlogCommentSubmission,
  BlogCommentSubmissionResponse,
  BlogDetail,
  PaginatedResponse,
} from "./types";

const blogDateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

// Keep page numbers safe for backend pagination endpoints.
function normalizePage(page: number) {
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

// Lightweight HTML stripping for excerpts and read-time calculations.
function stripHtmlTags(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getBlogsEndpoint(page: number) {
  const normalizedPage = normalizePage(page);

  return normalizedPage === 1 ? "/api/blogs" : `/api/blogs?page=${normalizedPage}`;
}

function getSearchEndpoint(query: string, page: number) {
  const normalizedPage = normalizePage(page);
  const encodedQuery = encodeURIComponent(query.trim());
  const pageSuffix = normalizedPage === 1 ? "" : `&page=${normalizedPage}`;

  return `/api/blogs/search?q=${encodedQuery}${pageSuffix}`;
}

// Primary archive fetch (paginated).
export const getBlogsPage = cache(
  async (page = 1): Promise<PaginatedResponse<Blog>> => {
    return fetchFromApi<PaginatedResponse<Blog>>(getBlogsEndpoint(page));
  },
);

export const searchBlogs = cache(
  async (query: string, page = 1): Promise<PaginatedResponse<Blog>> => {
    const trimmed = query.trim();

    // Return an empty pagination shape so pages can render consistently.
    if (!trimmed) {
      return {
        current_page: 1,
        data: [],
        first_page_url: "",
        from: null,
        last_page: 1,
        last_page_url: "",
        links: [],
        next_page_url: null,
        path: "",
        per_page: 10,
        prev_page_url: null,
        to: null,
        total: 0,
      };
    }

    return fetchFromApi<PaginatedResponse<Blog>>(getSearchEndpoint(trimmed, page));
  },
);

// Homepage helper: grab the first two posts from page 1.
export const getFeaturedBlogs = cache(async (): Promise<Blog[]> => {
  const { data } = await getBlogsPage(1);

  return hydrateBlogsWithVerifiedCommentCounts(data.slice(0, 2));
});

// Sitemap helper: load all pages when you need every blog.
export const getAllBlogs = cache(async (): Promise<Blog[]> => {
  const firstPage = await getBlogsPage(1);

  if (firstPage.last_page <= 1) {
    return firstPage.data;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.last_page - 1 }, (_, index) =>
      getBlogsPage(index + 2),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.data);
});

export const getBlogBySlug = cache(async (slug: string): Promise<BlogDetail | null> => {
  try {
    return await fetchFromApi<BlogDetail>(`/api/blogs/${slug}`);
  } catch (error) {
    if (error instanceof PortfolioApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
});

export async function createBlogComment(input: BlogCommentSubmission) {
  return postToApi<BlogCommentSubmissionResponse>("/api/comments", input);
}

// Friendly date formatting with fallback.
export function formatBlogDate(date: string | null) {
  if (!date) {
    return "Recently";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently";
  }

  return blogDateFormatter.format(parsedDate);
}

export function getBlogSummary(blog: Pick<Blog, "excerpt" | "content">) {
  const excerpt = blog.excerpt.trim();

  if (excerpt) {
    return excerpt;
  }

  return stripHtmlTags(blog.content).slice(0, 180);
}

export function getBlogDescription(
  blog: Pick<Blog, "meta_description" | "excerpt" | "content">,
) {
  const metaDescription = blog.meta_description.trim();

  if (metaDescription) {
    return metaDescription;
  }

  return getBlogSummary(blog);
}

export function getBlogReadTime(content: string) {
  const wordCount = stripHtmlTags(content)
    .split(/\s+/)
    .filter(Boolean).length;

  return `${Math.max(1, Math.round(wordCount / 200))} min read`;
}

export function isApprovedComment(isApproved: boolean | number) {
  return isApproved === true || isApproved === 1;
}

export function getVerifiedCommentCount(
  blog: Partial<Pick<Blog, "comments_count">> & Partial<Pick<BlogDetail, "comments">>,
) {
  if (Array.isArray(blog.comments)) {
    return blog.comments.filter((comment) => isApprovedComment(comment.is_approved)).length;
  }

  return blog.comments_count ?? 0;
}

const getVerifiedCommentCountBySlug = cache(async (slug: string) => {
  const blog = await getBlogBySlug(slug);

  return blog ? getVerifiedCommentCount(blog) : 0;
});

export async function hydrateBlogsWithVerifiedCommentCounts(blogs: Blog[]) {
  const commentCounts = await Promise.all(
    blogs.map(async (blog) => {
      try {
        // Archive payloads only expose total comments, so enrich cards from the detail endpoint.
        return await getVerifiedCommentCountBySlug(blog.slug);
      } catch {
        return getVerifiedCommentCount(blog);
      }
    }),
  );

  return blogs.map((blog, index) => ({
    ...blog,
    comments_count: commentCounts[index],
  }));
}
