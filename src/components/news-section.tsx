"use client";

import { useState } from "react";
import { NewsCard } from "@/components/news-card";
import { useGetNewsPagination, useGetCategories } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { News } from "@/lib/types";

const ITEMS_PER_PAGE = 9;

export default function NewsSection() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>("all");
  const { data: newsData, isLoading } = useGetNewsPagination(
    page,
    ITEMS_PER_PAGE,
    category || undefined
  );
  const { data: categories } = useGetCategories();

  const totalPages = newsData?.pagination
    ? Math.ceil(newsData.pagination.total / ITEMS_PER_PAGE)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-2 lg:px-4">
      {categories && categories.length > 0 && (
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium">Filter by category:</span>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat: string) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* News Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
      ) : newsData?.data && newsData.data.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {newsData.data.map((news: News) => (
              <NewsCard key={news._id} news={news} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                if (pageNum === 2 || pageNum === totalPages - 1) {
                  return <span key={pageNum}>...</span>;
                }
                return null;
              })}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No news found</p>
        </div>
      )}
    </div>
  );
}
