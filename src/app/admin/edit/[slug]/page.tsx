"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NewsForm } from "@/components/news-form";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { SingleNewsResponse } from "@/lib/queries";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const {
    data: news,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-news", slug],
    queryFn: async () => {
      const response = await api.get<SingleNewsResponse>(`/news/${slug}`);
      console.log("[v0] News response:", response.data);
      return response.data.data;
    },
    enabled: !!slug,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-4">Edit News</h1>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="space-y-4 max-w-2xl">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        ) : news ? (
          <NewsForm
            initialData={news}
            isEditing={true}
            onSuccess={() => router.push("/admin/dashboard")}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">News not found</p>
            {error && (
              <p className="text-red-500 mt-2">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                Error: {(error as any)?.message}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">Slug: {slug}</p>
          </div>
        )}
      </main>
    </div>
  );
}
