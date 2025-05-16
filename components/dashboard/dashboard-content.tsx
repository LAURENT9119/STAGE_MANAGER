
"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { UserRole } from "@/lib/utils";
import { UserWelcome } from "@/components/dashboard/user-welcome";
import { CardStats } from "@/components/ui/card-stats";
import { getCurrentUser, getDashboardStats, getRecentActivity, getAlerts } from "@/lib/auth";
import { getIconForStat, getTrendForStat, getDescriptionForStat, getStatusClass, getAlertClass } from "@/lib/utils";

export function DashboardContent({ role }: { role: UserRole }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

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
  );
}
