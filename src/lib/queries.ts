import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "./api";

// Types
export interface News {
  _id: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  imagePublicId: string;
  category: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NewsResponse {
  statusCode: number;
  message: string;
  data: News[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface SingleNewsResponse {
  statusCode: number;
  message: string;
  data: News;
}

export interface CategoriesResponse {
  statusCode: number;
  message: string;
  data: string[];
}

// Queries
export const useGetNews = (
  page: number = 1,
  limit: number = 10,
  category?: string
) => {
  let url = `/news?page=${page}&limit=${limit}`;
  if (category) {
    url += `&category=${category}`;
  }

  return useQuery({
    queryKey: ["news", page, limit, category],
    queryFn: async () => {
      const response = await api.get<NewsResponse>(url);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetNewsPagination = (
  page: number = 1,
  limit: number = 10,
  category?: string
) => {
  let url = `/news?page=${page}&limit=${limit}`;
  if (category !== "all") {
    url += `&category=${category}`;
  }

  return useQuery({
    queryKey: ["news", page, limit, category],
    queryFn: async () => {
      const response = await api.get<NewsResponse>(url);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetNewsBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["news", slug],
    queryFn: async () => {
      const response = await api.get<SingleNewsResponse>(`/news/${slug}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!slug,
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<CategoriesResponse>("/news/categories");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useGetAdminNews = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["admin-news", page, limit],
    queryFn: async () => {
      const response = await api.get<NewsResponse>(
        `/news/admin/all?page=${page}&limit=${limit}`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Mutations
export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/news", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("News created successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create news");
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const response = await api.patch(`/news/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("News updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update news");
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("News deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete news");
    },
  });
};
