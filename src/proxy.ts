import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Always allow login page
        if (pathname.startsWith("/admin/login")) {
          return true;
        }

        // Protect admin routes
        if (pathname.startsWith("/admin")) {
          return Boolean(token?.accessToken);
        }

        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/admin/login"],
};
