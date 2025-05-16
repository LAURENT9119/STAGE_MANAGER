import { notFound } from "next/navigation";
import { Metadata } from "next";
import { 
  Clipboard, 
  GraduationCap, 
  ClipboardCheck, 
  FileText, 
  CalendarCheck, 
  Users,
  AlertTriangle
} from "lucide-react";

import { UserRole } from "@/lib/utils";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Tableau de bord | Stage+",
  description: "Tableau de bord de gestion des stagiaires",
};

export function generateStaticParams() {
  return [
    { role: 'stagiaire' },
    { role: 'tuteur' },
    { role: 'RH' },
    { role: 'finance' },
    { role: 'administrateur' }
  ];
}

export default function DashboardPage({ params }: { params: { role: string } }) {
  const role = params.role as UserRole;

  // Validate that the role is valid
  if (!["intern", "tutor", "hr", "finance", "admin"].includes(role)) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav role={role} />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <DashboardNav role={role} />
        </aside>
        <DashboardContent role={role} />
      </div>
      <SiteFooter />
    </div>
  );
}