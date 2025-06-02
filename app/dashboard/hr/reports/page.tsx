"use client";

import { useState, useEffect } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  Download, 
  TrendingUp, 
  Users, 
  GraduationCap,
  Calendar,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HRReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Mock data for charts
  const internsByDepartment = [
    { name: 'IT', value: 45, color: '#0088FE' },
    { name: 'Marketing', value: 32, color: '#00C49F' },
    { name: 'Finance', value: 28, color: '#FFBB28' },
    { name: 'RH', value: 15, color: '#FF8042' },
    { name: 'Juridique', value: 12, color: '#8884D8' }
  ];

  const monthlyData = [
    { month: 'Jan', interns: 120, completed: 18 },
    { month: 'Fév', interns: 132, completed: 22 },
    { month: 'Mar', interns: 145, completed: 28 },
    { month: 'Avr', interns: 138, completed: 31 },
    { month: 'Mai', interns: 155, completed: 35 },
    { month: 'Jun', interns: 148, completed: 42 }
  ];

  const satisfactionData = [
    { month: 'Jan', satisfaction: 4.2 },
    { month: 'Fév', satisfaction: 4.3 },
    { month: 'Mar', satisfaction: 4.1 },
    { month: 'Avr', satisfaction: 4.4 },
    { month: 'Mai', satisfaction: 4.5 },
    { month: 'Jun', satisfaction: 4.6 }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <DashboardNav role="hr" />
        </aside>

        <main className="relative py-6 lg:gap-10 lg:py-8">
          <div className="mx-auto w-full min-w-0">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Rapports RH</h1>
                  <p className="text-muted-foreground">
                    Analyse et statistiques des stages et stagiaires
                  </p>
                </div>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter PDF
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Stagiaires Actifs
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">132</div>
                    <p className="text-xs text-muted-foreground">
                      +8% par rapport au mois dernier
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Taux de Completion
                    </CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89.2%</div>
                    <p className="text-xs text-muted-foreground">
                      +2.1% par rapport au trimestre précédent
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Durée Moyenne
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.2 mois</div>
                    <p className="text-xs text-muted-foreground">
                      Stable par rapport au trimestre précédent
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Satisfaction Moyenne
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.6/5</div>
                    <p className="text-xs text-muted-foreground">
                      +0.2 par rapport au mois dernier
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs for different reports */}
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="departments">Départements</TabsTrigger>
                  <TabsTrigger value="trends">Tendances</TabsTrigger>
                  <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Évolution Mensuelle</CardTitle>
                        <CardDescription>
                          Nombre de stagiaires actifs et terminés par mois
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="interns" fill="#8884d8" name="Actifs" />
                            <Bar dataKey="completed" fill="#82ca9d" name="Terminés" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Répartition par Département</CardTitle>
                        <CardDescription>
                          Distribution actuelle des stagiaires
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={internsByDepartment}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {internsByDepartment.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="departments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance par Département</CardTitle>
                      <CardDescription>
                        Analyse détaillée de chaque département
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {internsByDepartment.map((dept) => (
                          <div key={dept.name} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-semibold">{dept.name}</h3>
                              <p className="text-sm text-muted-foreground">{dept.value} stagiaires</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold" style={{ color: dept.color }}>
                                {((dept.value / internsByDepartment.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
                              </div>
                              <p className="text-sm text-muted-foreground">du total</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="trends" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tendances Temporelles</CardTitle>
                      <CardDescription>
                        Évolution des métriques clés au fil du temps
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="interns" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                            name="Stagiaires Actifs"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="completed" 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                            name="Stages Terminés"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="satisfaction" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Évolution de la Satisfaction</CardTitle>
                      <CardDescription>
                        Note moyenne de satisfaction des stagiaires
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={satisfactionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[3.5, 5]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="satisfaction" 
                            stroke="#ff7300" 
                            strokeWidth={3}
                            name="Satisfaction"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}