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

// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      username: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    accessToken: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    username: string;
  }
}
