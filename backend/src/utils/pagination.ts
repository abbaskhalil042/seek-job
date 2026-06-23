import { PaginatedResult, PaginationOptions } from '../types';

/** Parse & clamp pagination params coming from query strings. */
export function getPaginationOptions(query: Record<string, unknown>): PaginationOptions {
  const page = Math.max(1, parseInt(String(query.page ?? '1'), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '10'), 10) || 10));
  const sort = typeof query.sort === 'string' ? query.sort : undefined;
  return { page, limit, sort };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  { page, limit }: PaginationOptions,
): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    items,
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
