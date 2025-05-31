"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole, getRoleName } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { 
  Briefcase, 
  Clipboard, 
  GraduationCap, 
  LayoutDashboard, 
  Settings, 
  Users,
  FileText,
  Activity
} from "lucide-react";

interface DashboardNavProps {
  role: UserRole;
}

export function DashboardNav({ role }: DashboardNavProps) {
  const pathname = usePathname();

  const roleLinks: Record<UserRole, { href: string; label: string; icon: React.ReactNode }[]> = {
    intern: [
      { href: "/dashboard/intern", label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/intern/requests", label: "Mes demandes", icon: <Clipboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/intern/documents", label: "Mes documents", icon: <FileText className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/intern/profile", label: "Mon profil", icon: <Users className="h-4 w-4 mr-2" /> },
    ],
    tutor: [
      { href: "/dashboard/tutor", label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/tutor/interns", label: "Mes stagiaires", icon: <GraduationCap className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/tutor/requests", label: "Demandes", icon: <Clipboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/tutor/profile", label: "Mon profil", icon: <Users className="h-4 w-4 mr-2" /> },
    ],
    hr: [
      { href: "/dashboard/hr", label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/hr/interns", label: "Stagiaires", icon: <GraduationCap className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/hr/requests", label: "Demandes", icon: <Clipboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/hr/documents", label: "Documents", icon: <FileText className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/hr/reports", label: "Rapports", icon: <Briefcase className="h-4 w-4 mr-2" /> },
    ],
    finance: [
      { href: "/dashboard/finance", label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/finance/payments", label: "Gratifications", icon: <Briefcase className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/finance/reports", label: "Rapports", icon: <Activity className="h-4 w-4 mr-2" /> },
    ],
    admin: [
      { href: "/dashboard/admin", label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/admin/users", label: "Utilisateurs", icon: <Users className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/admin/settings", label: "Paramètres", icon: <Settings className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/admin/logs", label: "Journaux", icon: <Activity className="h-4 w-4 mr-2" /> },
    ],
  };

  const links = roleLinks[role] || [];

  return (
    <nav className="grid gap-2 p-4">
      <div className="flex items-center gap-2 px-2 mb-4">
        <GraduationCap className="h-5 w-5" />
        <span className="text-sm font-medium">{getRoleName(role)}</span>
      </div>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
            pathname === link.href || (link.href !== `/dashboard/${role}` && pathname.startsWith(link.href))
              ? "bg-accent text-accent-foreground"
              : "transparent"
          )}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  );
}