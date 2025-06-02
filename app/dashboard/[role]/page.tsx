
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { ProductionService, DashboardStats } from '@/lib/production-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserWelcome } from '@/components/dashboard/user-welcome';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Clock, 
  TrendingUp, 
  Award,
  Building,
  Calendar
} from 'lucide-react';

export default function RoleDashboard({ params }: { params: { role: string } }) {
  const { user, initializeAuth } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatsForRole = () => {
    if (!stats) return [];

    const commonStats = [
      {
        title: user?.role === 'intern' ? 'Mon statut' : 'Stagiaires actifs',
        value: stats.activeInterns,
        icon: UserCheck,
        color: 'text-green-600'
      },
      {
        title: user?.role === 'intern' ? 'Mes demandes' : 'Demandes en attente',
        value: stats.pendingRequests,
        icon: Clock,
        color: 'text-yellow-600'
      }
    ];

    switch (user?.role) {
      case 'admin':
      case 'hr':
        return [
          ...commonStats,
          {
            title: 'Total stagiaires',
            value: stats.totalInterns,
            icon: Users,
            color: 'text-blue-600'
          },
          {
            title: 'Total utilisateurs',
            value: stats.totalUsers,
            icon: Users,
            color: 'text-purple-600'
          },
          {
            title: 'Total demandes',
            value: stats.totalRequests,
            icon: FileText,
            color: 'text-gray-600'
          },
          {
            title: 'Note moyenne',
            value: stats.averageEvaluationScore ? `${stats.averageEvaluationScore}/5` : 'N/A',
            icon: Award,
            color: 'text-orange-600'
          }
        ];
      
      case 'tutor':
        return [
          ...commonStats,
          {
            title: 'Mes stagiaires',
            value: stats.totalInterns,
            icon: Users,
            color: 'text-blue-600'
          },
          {
            title: 'Stagiaires terminés',
            value: stats.completedInterns,
            icon: Award,
            color: 'text-green-600'
          }
        ];
      
      case 'intern':
        return [
          {
            title: 'Mon statut',
            value: stats.activeInterns > 0 ? 'Actif' : 'Inactif',
            icon: UserCheck,
            color: stats.activeInterns > 0 ? 'text-green-600' : 'text-gray-600'
          },
          {
            title: 'Mes demandes',
            value: stats.totalRequests,
            icon: FileText,
            color: 'text-blue-600'
          },
          {
            title: 'En attente',
            value: stats.pendingRequests,
            icon: Clock,
            color: 'text-yellow-600'
          },
          {
            title: 'Approuvées',
            value: stats.approvedRequests,
            icon: Award,
            color: 'text-green-600'
          }
        ];
      
      default:
        return commonStats;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserWelcome user={user} />

      {/* Affichage des erreurs */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          getStatsForRole().map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Statistiques détaillées pour admin/hr */}
      {(['admin', 'hr'].includes(user.role)) && stats && (
        <>
          {/* Statistiques par département */}
          {stats.departmentStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Répartition par département
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.departmentStats.map((dept) => (
                    <div key={dept.department} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{dept.department}</span>
                      <Badge variant="secondary">{dept.count} stagiaires</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistiques par type de demande */}
          {stats.requestsByType.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Demandes par type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.requestsByType.map((request) => (
                    <div key={request.type} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium capitalize">{request.type}</span>
                      <Badge variant="outline">{request.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Évolution mensuelle */}
          {stats.monthlyInternships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Évolution mensuelle des stages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.monthlyInternships.map((month) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min((month.count / Math.max(...stats.monthlyInternships.map(m => m.count))) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{month.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Métriques de performance */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Métriques de performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.averageInternDuration > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Durée moyenne des stages</span>
                  <span className="font-medium">{stats.averageInternDuration} jours</span>
                </div>
              )}
              {stats.averageEvaluationScore > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Note d'évaluation moyenne</span>
                  <span className="font-medium">{stats.averageEvaluationScore}/5</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taux d'achèvement</span>
                <span className="font-medium">
                  {stats.totalInterns > 0 
                    ? Math.round((stats.completedInterns / stats.totalInterns) * 100)
                    : 0
                  }%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Résumé des statuts */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé des statuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Actifs', value: stats.activeInterns, status: 'active' },
                { label: 'À venir', value: stats.upcomingInterns, status: 'upcoming' },
                { label: 'Terminés', value: stats.completedInterns, status: 'completed' }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <Badge className={getStatusColor(item.status)}>
                    {item.value}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
