"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-semibold text-foreground"
          >
            <ClipboardList className="size-5 text-primary" />
            <span>Zelthy EMR</span>
          </Link>
          {!pathname.includes("create-new-user") &&
            !pathname.includes("patients") && (
              <nav className="ml-6 flex items-center gap-4">
                <Button asChild variant="outline" className="w-full">
                  <Link
                    href="/admin/create-new-user"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Create New User
                  </Link>
                </Button>
              </nav>
            )}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
