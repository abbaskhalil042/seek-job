/** Convert an arbitrary string into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

/** Append a short random suffix to guarantee uniqueness. */
export function uniqueSlug(input: string): string {
  const base = slugify(input) || 'job';
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}
