
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { ProductionService, DashboardStats } from '@/lib/production-service';
import { MainNav } from '@/components/layout/main-nav';
import { DashboardNav } from '@/components/layout/dashboard-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  UserCheck, 
  UserX, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Calendar,
  Award,
  Bell
} from 'lucide-react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const roleNames = {
  admin: 'Administrateur',
  hr: 'Ressources Humaines',
  tutor: 'Tuteur',
  intern: 'Stagiaire',
  finance: 'Finance'
};

const roleDescriptions = {
  admin: 'Gérez l\'ensemble de la plateforme et des utilisateurs',
  hr: 'Gérez les stagiaires et les processus RH',
  tutor: 'Suivez vos stagiaires et leurs demandes',
  intern: 'Gérez votre stage et vos demandes',
  finance: 'Gérez les aspects financiers des stages'
};

export default function RoleDashboard() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = params.role as string;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user && user.role !== role) {
      router.push(`/dashboard/${user.role}`);
      return;
    }

    if (user && isAuthenticated) {
      loadDashboardData();
    }
  }, [user, isAuthenticated, authLoading, role, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardStats = await ProductionService.getDashboardStats(user?.id, user?.role);
      setStats(dashboardStats);
    } catch (err: any) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600">{error}</p>
          <Button onClick={loadDashboardData} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  const getMainCards = () => {
    switch (role) {
      case 'admin':
      case 'hr':
        return (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stagiaires</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInterns}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeInterns} actifs
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demandes en attente</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">
                  Sur {stats.totalRequests} demandes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.tutorCount} tuteurs
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageEvaluationScore || 0}/5</div>
                <p className="text-xs text-muted-foreground">
                  Évaluations stagiaires
                </p>
              </CardContent>
            </Card>
          </>
        );
      case 'tutor':
        return (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mes Stagiaires</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInterns}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeInterns} en cours
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demandes à traiter</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">
                  En attente de validation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stagiaires terminés</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedInterns}</div>
                <p className="text-xs text-muted-foreground">
                  Stages achevés
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageEvaluationScore || 0}/5</div>
                <p className="text-xs text-muted-foreground">
                  Mes évaluations
                </p>
              </CardContent>
            </Card>
          </>
        );
      case 'intern':
        return (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mon Stage</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.activeInterns > 0 ? 'En cours' : 'Inactif'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Statut actuel
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mes Demandes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRequests}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingRequests} en attente
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demandes approuvées</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.approvedRequests}</div>
                <p className="text-xs text-muted-foreground">
                  Validées
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ma Note</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageEvaluationScore || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">
                  Évaluation actuelle
                </p>
              </CardContent>
            </Card>
          </>
        );
      case 'finance':
        return (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stagiaires actifs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeInterns}</div>
                <p className="text-xs text-muted-foreground">
                  À rémunérer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demandes finance</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">
                  À traiter
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Durée moyenne</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageInternDuration || 0}j</div>
                <p className="text-xs text-muted-foreground">
                  Durée des stages
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total stages</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInterns}</div>
                <p className="text-xs text-muted-foreground">
                  Cette année
                </p>
              </CardContent>
            </Card>
          </>
        );
      default:
        return null;
    }
  };

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
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Tableau de bord - {roleNames[role as keyof typeof roleNames]}
              </h1>
              <p className="text-muted-foreground">
                {roleDescriptions[role as keyof typeof roleDescriptions]}
              </p>
            </div>

            {/* Main Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {getMainCards()}
            </div>

            {/* Charts and Details */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="analytics">Analyses</TabsTrigger>
                <TabsTrigger value="activity">Activité récente</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Évolution mensuelle</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={stats.monthlyInternships}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Répartition par département</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.departmentStats.slice(0, 5).map((dept) => (
                          <div key={dept.department} className="flex items-center">
                            <div className="w-32 text-sm">{dept.department}</div>
                            <div className="flex-1 mx-4">
                              <Progress 
                                value={(dept.count / stats.totalInterns) * 100} 
                                className="h-2" 
                              />
                            </div>
                            <div className="text-sm font-medium">{dept.count}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Types de demandes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.requestsByType.map((req) => (
                          <div key={req.type} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{req.type}</span>
                            <Badge variant="secondary">{req.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Statistiques clés</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Durée moyenne des stages</span>
                        <span className="font-medium">{stats.averageInternDuration} jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Note d'évaluation moyenne</span>
                        <span className="font-medium">{stats.averageEvaluationScore || 'N/A'}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taux d'approbation</span>
                        <span className="font-medium">
                          {stats.totalRequests > 0 
                            ? Math.round((stats.approvedRequests / stats.totalRequests) * 100)
                            : 0}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activité récente</CardTitle>
                    <CardDescription>
                      Les dernières actions sur la plateforme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentActivity.length > 0 ? (
                        stats.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <Bell className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm">{activity.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(activity.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Aucune activité récente
                        </p>
                      )}
                    </div>
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
