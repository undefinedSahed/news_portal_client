"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGetAdminNews, useDeleteNews, useUpdateNews } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { LogOut, Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminDashboard() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: newsData, isLoading } = useGetAdminNews(currentPage, 10);
  const { mutate: deleteNews } = useDeleteNews();
  const { mutate: updateNews } = useUpdateNews();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const handleDelete = (id: string) => {
    deleteNews(id);
    setDeleteId(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTogglePublish = (news: any) => {
    const formData = new FormData();
    formData.append("isPublished", String(!news.isPublished));
    updateNews({ id: news._id, formData });
  };

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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link href="/admin/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create News
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : newsData?.data && newsData.data.length > 0 ? (
          <>
            <div className="space-y-4">
              {newsData.data.map((news) => (
                <Card key={news._id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={news.imageUrl || "/placeholder.svg"}
                        alt={news.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-lg line-clamp-1">
                            {news.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {news.description}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Badge
                            variant={news.isPublished ? "default" : "secondary"}
                          >
                            {news.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Badge variant="outline">{news.category}</Badge>
                        <span>
                          {format(new Date(news.createdAt), "MMM dd, yyyy")}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTogglePublish(news)}
                        >
                          {news.isPublished ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Publish
                            </>
                          )}
                        </Button>
                        <Link href={`/admin/edit/${news._id}`}>
                          <Button size="sm" variant="outline">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteId(news._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {newsData.pagination && newsData.pagination.total > 10 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {currentPage}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage * 10 >= newsData.pagination.total}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No news found</p>
            <Link href="/admin/create">
              <Button>Create your first news</Button>
            </Link>
          </div>
        )}
      </main>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open: boolean) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete news?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              news article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
