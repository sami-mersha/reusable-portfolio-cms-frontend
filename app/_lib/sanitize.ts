// Centralized HTML sanitization for CMS-provided content.
// This avoids the server-side jsdom dependency that caused production crashes.
const BLOCKED_TAGS = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "applet",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "option",
  "meta",
  "base",
  "link",
];

const blockedTagPattern = new RegExp(
  `<(?:${BLOCKED_TAGS.join("|")})\\b[^>]*>[\\s\\S]*?<\\/(?:${BLOCKED_TAGS.join("|")})>|<(?:${BLOCKED_TAGS.join("|")})\\b[^>]*\\/?>`,
  "gi",
);

const eventHandlerPattern = /\s+on[a-z-]+\s*=\s*(['"]).*?\1/gi;
const unquotedEventHandlerPattern = /\s+on[a-z-]+\s*=\s*[^\s>]+/gi;
const dangerousUrlPattern =
  /\s+(href|src|xlink:href|formaction)\s*=\s*(['"])\s*(?:javascript|vbscript|data:text\/html)[^'"]*\2/gi;
const dangerousUnquotedUrlPattern =
  /\s+(href|src|xlink:href|formaction)\s*=\s*(?:javascript|vbscript|data:text\/html)[^\s>]*/gi;
const srcDocPattern = /\s+srcdoc\s*=\s*(['"]).*?\1/gi;
const unquotedSrcDocPattern = /\s+srcdoc\s*=\s*[^\s>]+/gi;

export function sanitizeHtml(html: string) {
  return html
    .replace(blockedTagPattern, "")
    .replace(eventHandlerPattern, "")
    .replace(unquotedEventHandlerPattern, "")
    .replace(dangerousUrlPattern, "")
    .replace(dangerousUnquotedUrlPattern, "")
    .replace(srcDocPattern, "")
    .replace(unquotedSrcDocPattern, "");
}
