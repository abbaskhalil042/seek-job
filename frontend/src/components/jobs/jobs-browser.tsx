"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import {
  JobFilters,
  emptyFilters,
  toQueryParams,
  type JobFilterState,
} from "./job-filters";
import { JobCard } from "./job-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { useJobSearch } from "@/lib/hooks/use-jobs";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { pluralize } from "@/lib/format";

export function JobsBrowser() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [filters, setFilters] = useState<JobFilterState>({
    ...emptyFilters,
    q: initialQ,
  });
  const [page, setPage] = useState(1);

  const debounced = useDebounce(filters, 350);
  const queryParams = useMemo(
    () => ({ ...toQueryParams(debounced), page, limit: 9 }),
    [debounced, page],
  );

  const { data, isLoading, isFetching } = useJobSearch(queryParams);
  const jobs = data?.data ?? [];
  const pagination = data?.meta?.pagination;
  const updateFilters = (next: JobFilterState) => {
    setFilters(next);
    setPage(1);
  };
  const resetFilters = () => {
    setFilters(emptyFilters);
    setPage(1);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[310px_1fr]">
      <div className="lg:sticky lg:top-20 lg:self-start">
        <JobFilters
          value={filters}
          onChange={updateFilters}
          onReset={resetFilters}
        />
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 shadow-card">
          <p className="text-sm font-medium text-foreground">
            {isLoading
              ? "Searching..."
              : pagination
                ? `${pluralize(pagination.total, "job")} found`
                : `${jobs.length} jobs`}
          </p>
          {isFetching && !isLoading && (
            <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
              Updating...
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-5">
                <div className="flex gap-4">
                  <Skeleton className="size-12 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-md" />
                      <Skeleton className="h-6 w-16 rounded-md" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No jobs match your filters"
            description="Try adjusting your search terms or clearing some filters."
            action={
              <Button variant="outline" onClick={resetFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
