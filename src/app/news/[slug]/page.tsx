"use client";

import { useGetNewsBySlug } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function NewsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: news, isLoading } = useGetNewsBySlug(slug);

  if (isLoading) {
    return (
      <>
        {" "}
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
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to news
          </Button>
        </Link>

        <article>
          {/* Image */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
            <Image
              src={news.imageUrl}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge>
              {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
            </Badge>
            <time className="text-sm text-muted-foreground">
              {format(new Date(news.createdAt), "MMMM dd, yyyy")}
            </time>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
            {news.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-8">
            {news.description}
          </p>

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <div className="whitespace-pre-wrap leading-relaxed text-base">
              {news.content}
            </div>
          </div>

          {/* Last updated */}
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
