"use client";

import { useGetNewsBySlug } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function NewsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: news, isLoading } = useGetNewsBySlug(slug);

  console.log("Slug:", slug);
  console.log("News data:", news);

  if (isLoading) {
    return (
      <>
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="w-full h-96 rounded-lg mb-8" />
          <Skeleton className="w-full h-8 mb-4" />
          <Skeleton className="w-full h-64" />
        </main>
      </>
    );
  }

  if (!news) {
    return (
      <>
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">News not found</p>
            <Link href="/">
              <Button variant="outline">Back to home</Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to news
          </Button>
        </Link>

        <article>
          <div className="w-full h-96 rounded-lg overflow-hidden mb-8">
            <Image
              width={1000}
              height={1000}
              src={news.imageUrl || "/placeholder.svg"}
              alt={news.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge>
              {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
            </Badge>
            <time className="text-sm text-muted-foreground">
              {format(new Date(news.createdAt), "MMMM dd, yyyy")}
            </time>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold mb-4">{news.title}</h1>

          <p className="text-xl text-muted-foreground mb-8">
            {news.description}
          </p>

          <div className="prose prose-invert max-w-none mb-12">
            <div className="whitespace-pre-wrap leading-relaxed text-base">
              {news.content}
            </div>
          </div>

          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Last updated:{" "}
              {format(new Date(news.updatedAt), "MMMM dd, yyyy HH:mm")}
            </p>
          </div>
        </article>
      </main>
    </>
  );
}
