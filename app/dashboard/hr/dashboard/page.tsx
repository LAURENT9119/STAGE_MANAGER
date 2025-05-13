
"use client";

import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { UserWelcome } from "@/components/dashboard/user-welcome";
import { CardStats } from "@/components/ui/card-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, FileText, AlertTriangle } from "lucide-react";

export default function HRDashboardPage() {
  const stats = [
    {
      title: "Stagiaires actifs",
      value: 25,
      icon: GraduationCap,
      description: "Stagiaires en cours"
    },
    {
      title: "Tuteurs",
      value: 12,
      icon: Users,
      description: "Tuteurs actifs"
    },
    {
      title: "Demandes",
      value: 8,
      icon: FileText,
      description: "Demandes en attente"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "Convention",
      intern: "Jean Dupont",
      date: "06/05/2025",
      status: "En attente",
      department: "IT"
    },
    {
      id: 2,
      type: "Prolongation",
      intern: "Marie Martin",
      date: "05/05/2025",
      status: "Validée",
      department: "Marketing"
    },
    {
      id: 3,
      type: "Attestation",
      intern: "Lucas Bernard",
      date: "04/05/2025",
      status: "En cours",
      department: "Finance"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav role="hr" />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <DashboardNav role="hr" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <UserWelcome user={{
            id: "hr-manager-001",
            email: "hr.manager@company.com",
            name: "HR Manager",
            avatar: "",
            role: "hr"
          }} />

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <CardStats key={index} {...stat} />
            ))}
          </div>

          <div className="grid gap-4 mt-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activités récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.intern} - {activity.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{activity.date}</p>
                        <p className="text-sm text-muted-foreground">{activity.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Conventions à renouveler</AlertTitle>
                    <AlertDescription>
                      3 conventions arrivent à échéance dans les 30 prochains jours.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Évaluations en retard</AlertTitle>
                    <AlertDescription>
                      5 évaluations de fin de stage sont en attente.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
