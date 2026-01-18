/**
 * API Response Types
 * These types correspond to the backend API responses
 */

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

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  pagination?: Pagination;
}

export interface AuthResponse {
  username: string;
  access_token: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

export interface NewsFormData {
  title: string;
  description: string;
  content: string;
  category: string;
  image?: File;
}
