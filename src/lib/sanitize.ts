/**
 * Security & Sanitization Utilities for TeleRank
 */

/**
 * Escapes characters for safe embedding inside <script type="application/ld+json">
 * Prevents Stored XSS via closing </script> tag sequences.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/**
 * Strips HTML tags, script fragments, and control characters from user text inputs.
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>?/gm, '') // Remove all HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .trim();
}

/**
 * Validates that a string is a safe HTTPS URL (blocking javascript:, data:, file:, etc.)
 */
export function isValidHttpsUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim();
  if (!trimmed.startsWith('https://')) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Sanitizes search terms before passing to database queries / PostgREST filters.
 */
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') return '';
  return query
    .replace(/[(),:;%'"\\]/g, '') // Remove PostgREST & SQL syntax special characters
    .replace(/<[^>]*>?/gm, '')
    .trim()
    .slice(0, 80);
}
