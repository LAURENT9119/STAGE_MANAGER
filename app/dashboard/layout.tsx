
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading, getCurrentUser } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await getCurrentUser();
      setIsInitialized(true);
    };
    
    initAuth();
  }, [getCurrentUser]);

  useEffect(() => {
    if (isInitialized && !loading && !user) {
      router.push("/auth/login");
    }
  }, [isInitialized, loading, user, router]);

  if (!isInitialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user.full_name} ({user.role.toUpperCase()})
            </span>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/10">
          <DashboardNav userRole={user.role} />
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
