"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserRole, getRoleName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { 
  Briefcase, 
  Clipboard, 
  GraduationCap, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Users
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface MainNavProps {
  role?: UserRole;
}

export function MainNav({ role }: MainNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const roleLinks: Record<UserRole, { href: string; label: string; icon: React.ReactNode }[]> = {
    intern: [
      { href: "/dashboard/intern", label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/intern/requests", label: "Mes demandes", icon: <Clipboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/intern/profile", label: "Mon profil", icon: <Users className="h-4 w-4 mr-2" /> },
    ],
    tutor: [
      { href: "/dashboard/tutor", label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/tutor/interns", label: "Mes stagiaires", icon: <GraduationCap className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/tutor/requests", label: "Demandes", icon: <Clipboard className="h-4 w-4 mr-2" /> },
    ],
    hr: [
      { href: "/dashboard/hr", label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/hr/interns", label: "Stagiaires", icon: <GraduationCap className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/hr/requests", label: "Demandes", icon: <Clipboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/hr/reports", label: "Rapports", icon: <Briefcase className="h-4 w-4 mr-2" /> },
    ],
    finance: [
      { href: "/dashboard/finance", label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/finance/payments", label: "Gratifications", icon: <Briefcase className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/finance/reports", label: "Rapports", icon: <Clipboard className="h-4 w-4 mr-2" /> },
    ],
    admin: [
      { href: "/dashboard/admin", label: "Tableau de bord", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/admin/users", label: "Utilisateurs", icon: <Users className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/admin/settings", label: "Paramètres", icon: <Briefcase className="h-4 w-4 mr-2" /> },
      { href: "/dashboard/admin/logs", label: "Journaux", icon: <Clipboard className="h-4 w-4 mr-2" /> },
    ],
  };

  const links = role ? roleLinks[role] : [];

  return (
    <div className="flex items-center justify-between">
      <div className="hidden md:flex gap-6 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold text-xl">Stage+</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {role ? (
            <>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </>
          ) : (
            <>
              <Link
                href="/"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center",
                  pathname === "/" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Link>
              <Link
                href="/auth/login"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/auth/login" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/auth/register" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="md:hidden flex items-center">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold text-xl">Stage+</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <ModeToggle />
        
        {role && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Link>
          </Button>
        )}
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold text-xl">Stage+</span>
            </Link>
            <nav className="flex flex-col space-y-4">
              {role ? (
                <>
                  <p className="text-muted-foreground text-sm">{getRoleName(role)}</p>
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center text-sm font-medium transition-colors hover:text-primary",
                        pathname === link.href
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                  <Button variant="outline" size="sm" asChild className="mt-4">
                    <Link href="/" onClick={() => setOpen(false)}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className={cn(
                      "flex items-center text-sm font-medium transition-colors hover:text-primary",
                      pathname === "/" ? "text-foreground" : "text-muted-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Accueil
                  </Link>
                  <Link
                    href="/auth/login"
                    className={cn(
                      "flex items-center text-sm font-medium transition-colors hover:text-primary",
                      pathname === "/auth/login" ? "text-foreground" : "text-muted-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    className={cn(
                      "flex items-center text-sm font-medium transition-colors hover:text-primary",
                      pathname === "/auth/register" ? "text-foreground" : "text-muted-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Inscription
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}