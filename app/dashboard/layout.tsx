'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { DashboardNav } from '@/components/layout/dashboard-nav';
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isLoading, isAuthenticated, initializeAuth } = useAuthStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initializeAuth();
      setIsInitialized(true);
    };
    initialize();
  }, [initializeAuth]);

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, isInitialized, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {profile?.full_name || user.email} ({(profile?.role || 'intern').toUpperCase()})
            </span>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/10">
          <DashboardNav userRole={profile?.role || 'intern'} />
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}