"use client";

import { useState } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, FileText } from "lucide-react";

const monthlyData = [
  { name: "Jan", stagiaires: 15, nouveaux: 5 },
  { name: "Fév", stagiaires: 18, nouveaux: 8 },
  { name: "Mar", stagiaires: 22, nouveaux: 6 },
  { name: "Avr", stagiaires: 20, nouveaux: 4 },
  { name: "Mai", stagiaires: 25, nouveaux: 7 },
];

const departmentData = [
  { name: "IT", value: 30 },
  { name: "Marketing", value: 22 },
  { name: "Finance", value: 15 },
  { name: "RH", value: 18 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ReportsPage() {
  const [year] = useState("2025");
  const [period] = useState("monthly");

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
          <div className="flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Rapports</h2>
                <p className="text-muted-foreground">
                  Analysez les données des stagiaires
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select defaultValue={year}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue={period}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="quarterly">Trimestriel</SelectItem>
                    <SelectItem value="yearly">Annuel</SelectItem>
                  </SelectContent>
                </Select>

                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total stagiaires
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">25</div>
                  <p className="text-xs text-muted-foreground">
                    +12% par rapport à 2024
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Nouveaux stagiaires
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">
                    Ce mois-ci
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taux de conversion
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15%</div>
                  <p className="text-xs text-muted-foreground">
                    Stagiaires embauchés
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Satisfaction
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.5/5</div>
                  <p className="text-xs text-muted-foreground">
                    Note moyenne
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Évolution des stagiaires</CardTitle>
                  <CardDescription>
                    Nombre de stagiaires par mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="stagiaires"
                          stroke="hsl(var(--primary))"
                          name="Total stagiaires"
                        />
                        <Line
                          type="monotone"
                          dataKey="nouveaux"
                          stroke="hsl(var(--destructive))"
                          name="Nouveaux stagiaires"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Répartition par service</CardTitle>
                  <CardDescription>
                    Distribution des stagiaires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  Users, 
  Calendar,
  BarChart3
} from "lucide-react";
import { useInterns } from "@/hooks/use-interns";
import { useRequests } from "@/hooks/use-requests";
import { useToast } from "@/hooks/use-toast";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ReportsPage() {
  const { interns, loading: internsLoading } = useInterns();
  const { requests, loading: requestsLoading } = useRequests();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const generateInternsByDepartmentData = () => {
    const departmentCount = interns.reduce((acc, intern) => {
      acc[intern.department] = (acc[intern.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(departmentCount).map(([department, count]) => ({
      department,
      count
    }));
  };

  const generateRequestsByStatusData = () => {
    const statusCount = requests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([status, count]) => ({
      status: status === 'pending' ? 'En attente' : 
              status === 'approved' ? 'Approuvé' : 
              status === 'rejected' ? 'Rejeté' : 
              status === 'in_review' ? 'En révision' : status,
      count
    }));
  };

  const generateMonthlyData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      
      const monthInterns = interns.filter(intern => {
        const startDate = new Date(intern.start_date);
        return startDate.getMonth() === date.getMonth() && 
               startDate.getFullYear() === date.getFullYear();
      }).length;

      const monthRequests = requests.filter(request => {
        const submitDate = new Date(request.submitted_at);
        return submitDate.getMonth() === date.getMonth() && 
               submitDate.getFullYear() === date.getFullYear();
      }).length;

      months.push({
        month: monthName,
        stagiaires: monthInterns,
        demandes: monthRequests
      });
    }
    
    return months;
  };

  const exportReport = (type: string) => {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'interns':
        data = interns.map(intern => ({
          'Nom': intern.user.full_name,
          'Email': intern.user.email,
          'Département': intern.department,
          'Tuteur': intern.tutor?.full_name || 'Non assigné',
          'Date début': new Date(intern.start_date).toLocaleDateString('fr-FR'),
          'Date fin': new Date(intern.end_date).toLocaleDateString('fr-FR'),
          'Statut': intern.status,
          'Progression': `${intern.progress}%`
        }));
        filename = 'rapport_stagiaires';
        break;
      case 'requests':
        data = requests.map(request => ({
          'Type': request.type,
          'Titre': request.title,
          'Statut': request.status,
          'Date soumission': new Date(request.submitted_at).toLocaleDateString('fr-FR'),
          'Date révision': request.reviewed_at ? new Date(request.reviewed_at).toLocaleDateString('fr-FR') : 'N/A'
        }));
        filename = 'rapport_demandes';
        break;
    }

    const csvContent = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export réussi",
      description: `Le rapport a été exporté avec succès`
    });
  };

  const loading = internsLoading || requestsLoading;

  if (loading) {
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
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Chargement des rapports...</p>
              </div>
            </div>
          </main>
        </div>
        <SiteFooter />
      </div>
    );
  }

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
          <div className="flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Rapports</h2>
                <p className="text-muted-foreground">
                  Analysez les données des stagiaires et des demandes
                </p>
              </div>
              <div className="flex gap-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="quarter">Ce trimestre</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Vue d&apos;ensemble
                </TabsTrigger>
                <TabsTrigger value="interns">
                  <Users className="mr-2 h-4 w-4" />
                  Stagiaires
                </TabsTrigger>
                <TabsTrigger value="requests">
                  <FileText className="mr-2 h-4 w-4" />
                  Demandes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Stagiaires
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{interns.length}</div>
                      <p className="text-xs text-muted-foreground">
                        +20% par rapport au mois dernier
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Stagiaires Actifs
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {interns.filter(i => i.status === 'active').length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +10% cette semaine
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Demandes en Attente
                      </CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {requests.filter(r => r.status === 'pending').length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        -5% depuis hier
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Taux d&apos;Approbation
                      </CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {requests.length > 0 ? 
                          Math.round((requests.filter(r => r.status === 'approved').length / requests.length) * 100) 
                          : 0}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +2% ce mois
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Évolution mensuelle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={generateMonthlyData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="stagiaires" fill="#8884d8" name="Stagiaires" />
                          <Bar dataKey="demandes" fill="#82ca9d" name="Demandes" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition par statut des demandes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={generateRequestsByStatusData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {generateRequestsByStatusData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="interns" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Rapport des Stagiaires</h3>
                  <Button onClick={() => exportReport('interns')}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter CSV
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par département</CardTitle>
                    <CardDescription>
                      Nombre de stagiaires par département
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={generateInternsByDepartmentData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="department" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Stagiaires par statut</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Actifs</span>
                          <span className="font-medium">
                            {interns.filter(i => i.status === 'active').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Terminés</span>
                          <span className="font-medium">
                            {interns.filter(i => i.status === 'completed').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>À venir</span>
                          <span className="font-medium">
                            {interns.filter(i => i.status === 'upcoming').length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Progression moyenne</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {interns.length > 0 
                          ? Math.round(interns.reduce((sum, intern) => sum + intern.progress, 0) / interns.length)
                          : 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Progression moyenne des stages
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Durée moyenne</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {interns.length > 0 
                          ? Math.round(
                              interns.reduce((sum, intern) => {
                                const start = new Date(intern.start_date);
                                const end = new Date(intern.end_date);
                                return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
                              }, 0) / interns.length
                            )
                          : 0} jours
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Durée moyenne des stages
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="requests" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Rapport des Demandes</h3>
                  <Button onClick={() => exportReport('requests')}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter CSV
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Demandes par type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {['convention', 'prolongation', 'conge', 'attestation'].map(type => {
                          const count = requests.filter(r => r.type === type).length;
                          return (
                            <div key={type} className="flex justify-between">
                              <span className="capitalize">{type}</span>
                              <span className="font-medium">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Temps de traitement moyen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">3.2 jours</div>
                      <p className="text-sm text-muted-foreground">
                        Temps moyen de traitement des demandes
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Statut des demandes</CardTitle>
                    <CardDescription>
                      Répartition des demandes par statut
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={generateRequestsByStatusData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ status, count }) => `${status}: ${count}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {generateRequestsByStatusData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
