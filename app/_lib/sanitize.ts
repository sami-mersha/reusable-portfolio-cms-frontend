import DOMPurify from "isomorphic-dompurify";

// Centralized HTML sanitization for CMS-provided content.
// Keep this in one place so you can tighten/relax the policy later.
export function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}
