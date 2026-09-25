import "server-only";

import { API_URL, normalizeUploadedMedia } from "./client";

// Server Components can use the private Docker/network address while browsers
// keep using the public same-origin `/api` endpoint.
const SERVER_API_URL = (process.env.API_INTERNAL_URL ?? API_URL).replace(/\/+$/, "");

/**
 * Fetch helper for Server Components: cached with ISR (`revalidate` seconds), returns `null`
 * on 404 and on network errors so a page can decide between notFound() and a fallback
 * instead of crashing the whole render.
 */
export async function serverFetch<T>(
  path: string,
  options: { revalidate?: number; tags?: string[] } = {},
): Promise<T | null> {
  try {
    const response = await fetch(`${SERVER_API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: options.revalidate ?? 60, tags: options.tags },
    });
    if (!response.ok) return null;
    return normalizeUploadedMedia((await response.json()) as T);
  } catch {
    return null;
  }
}
