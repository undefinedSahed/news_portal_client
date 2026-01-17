import Link from "next/link";
import { Newspaper } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Newspaper className="h-6 w-6" />
            <span className="hidden sm:inline">News Portal</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition"
            >
              Home
            </Link>
            <Link
              href="/admin/login"
              className="text-sm font-medium hover:text-primary transition"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
