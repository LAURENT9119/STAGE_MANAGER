"use client";

import { useEffect, useState } from "react";
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
import { UserWelcome } from "@/components/dashboard/user-welcome";
import { CardStats } from "@/components/ui/card-stats";
import { getCurrentUser, getDashboardStats, getRecentActivity, getAlerts } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Tableau de bord | Stage+",
  description: "Tableau de bord de gestion des stagiaires",
};

export async function generateStaticParams() {
  return [
    { role: 'intern' },
    { role: 'tutor' },
    { role: 'hr' },
    { role: 'finance' },
    { role: 'admin' }
  ];
}

export default function DashboardPage({ params }: { params: { role: string } }) {
  const role = params.role as UserRole;
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Validate that the role is valid
  if (!["intern", "tutor", "hr", "finance", "admin"].includes(role)) {
    return notFound();
  }

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          // Handle not authenticated
          return;
        }
        setUser(currentUser);

        const dashboardStats = await getDashboardStats(role);
        setStats(dashboardStats);

        const recentActivity = await getRecentActivity(role);
        setActivities(recentActivity);

        const userAlerts = await getAlerts(role);
        setAlerts(userAlerts);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [role]);

  if (loading) {
    return <div>Chargement...</div>;
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
        <main className="flex w-full flex-col overflow-hidden py-6">
          {user && <UserWelcome user={user} />}
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats && Object.entries(stats).map(([key, value], index) => (
              <CardStats
                key={key}
                title={key}
                value={value}
                icon={getIconForStat(key)}
                trend={getTrendForStat(key, value)}
                description={getDescriptionForStat(key)}
              />
            ))}
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Activité récente</h3>
            {activities.length > 0 ? (
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Statut</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Détails</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity, index) => (
                        <tr 
                          key={index} 
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{activity.date}</td>
                          <td className="p-4 align-middle">{activity.type}</td>
                          <td className="p-4 align-middle">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(activity.status)}`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="p-4 align-middle">{activity.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-md border p-8">
                <div className="flex flex-col items-center text-center">
                  <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">Aucune activité récente</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Il n&apos;y a pas d&apos;activité récente à afficher pour le moment.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {alerts && alerts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Alertes</h3>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className={`p-4 rounded-md ${getAlertClass(alert.type)}`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium">{alert.title}</h3>
                        <p className="mt-2 text-sm">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}

function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'en attente':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'validé':
    case 'validée':
    case 'complété':
    case 'complétée':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'refusé':
    case 'refusée':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'en cours':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

function getAlertClass(type: string): string {
  switch (type.toLowerCase()) {
    case 'warning':
      return 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'success':
      return 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'error':
      return 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'info':
      return 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    default:
      return 'bg-gray-50 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300';
  }
}

function getIconForStat(key: string) {
  const icons = {
    totalInterns: GraduationCap,
    activeInterns: GraduationCap,
    pendingRequests: Clipboard,
    monthlyConventions: FileText,
    evaluationRate: ClipboardCheck,
    totalUsers: Users,
    totalTutors: Users,
    totalAmount: FileText,
    pendingPayments: AlertTriangle
  };
  return icons[key] || FileText;
}

function getTrendForStat(key: string, value: number) {
  // This would ideally be calculated based on historical data
  // For now, returning null to not show trends
  return null;
}

function getDescriptionForStat(key: string) {
  const descriptions = {
    totalInterns: "Total des stagiaires actifs",
    activeInterns: "Stagiaires en cours",
    pendingRequests: "Demandes en attente",
    monthlyConventions: "Nouvelles conventions ce mois",
    evaluationRate: "Taux de complétion des évaluations",
    totalUsers: "Utilisateurs actifs",
    totalTutors: "Tuteurs actifs",
    totalAmount: "Montant total des gratifications",
    pendingPayments: "Paiements en attente"
  };
  return descriptions[key] || "";
}