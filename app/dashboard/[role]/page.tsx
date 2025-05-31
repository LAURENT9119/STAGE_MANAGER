
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authService } from '@/lib/auth-service';
import { ProductionService } from '@/lib/production-service';
import { useAppStore } from '@/store/app-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  ClipboardList, 
  AlertCircle,
  TrendingUp,
  Calendar,
  FileText,
  CheckCircle
} from 'lucide-react';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const role = params.role as string;
  
  const { currentUser, setCurrentUser, setAuthenticated } = useAppStore();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [recentData, setRecentData] = useState<any>({});

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user.role !== role) {
      router.push(`/dashboard/${user.role}`);
      return;
    }

    setCurrentUser(user);
    setAuthenticated(true);
    loadDashboardData(user);
  }, [role, router, setCurrentUser, setAuthenticated]);

  const loadDashboardData = async (user: any) => {
    try {
      setLoading(true);
      
      // Charger les statistiques
      const dashboardStats = await ProductionService.getDashboardStats(user.id, user.role);
      setStats(dashboardStats);

      // Charger les données récentes selon le rôle
      let recent: any = {};
      
      if (user.role === 'admin' || user.role === 'hr') {
        const [interns, requests] = await Promise.all([
          ProductionService.getAllInterns(),
          ProductionService.getAllRequests()
        ]);
        recent.interns = interns.slice(0, 5);
        recent.requests = requests.slice(0, 5);
      } else if (user.role === 'tutor') {
        const [interns, requests] = await Promise.all([
          ProductionService.getInternsByTutor(user.id),
          ProductionService.getAllRequests()
        ]);
        recent.interns = interns.slice(0, 5);
        recent.requests = requests.filter(r => 
          interns.some(i => i.id === r.intern_id)
        ).slice(0, 5);
      } else if (user.role === 'intern') {
        const internData = await ProductionService.getInternByUserId(user.id);
        if (internData) {
          const requests = await ProductionService.getRequestsByIntern(internData.id);
          recent.intern = internData;
          recent.requests = requests.slice(0, 5);
        }
      }
      
      setRecentData(recent);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getRoleTitle = () => {
    switch (role) {
      case 'admin': return 'Administration';
      case 'hr': return 'Ressources Humaines';
      case 'tutor': return 'Tuteur';
      case 'intern': return 'Stagiaire';
      case 'finance': return 'Finance';
      default: return 'Tableau de bord';
    }
  };

  const getStatsCards = () => {
    switch (role) {
      case 'admin':
      case 'hr':
        return [
          {
            title: 'Total Stagiaires',
            value: stats.totalInterns || 0,
            icon: Users,
            color: 'text-blue-600'
          },
          {
            title: 'Stagiaires Actifs',
            value: stats.activeInterns || 0,
            icon: UserPlus,
            color: 'text-green-600'
          },
          {
            title: 'Demandes en Attente',
            value: stats.pendingRequests || 0,
            icon: AlertCircle,
            color: 'text-orange-600'
          },
          {
            title: 'Total Utilisateurs',
            value: stats.totalUsers || 0,
            icon: Users,
            color: 'text-purple-600'
          }
        ];
      
      case 'tutor':
        return [
          {
            title: 'Mes Stagiaires',
            value: stats.myInterns || 0,
            icon: Users,
            color: 'text-blue-600'
          },
          {
            title: 'Stagiaires Actifs',
            value: stats.activeInterns || 0,
            icon: UserPlus,
            color: 'text-green-600'
          },
          {
            title: 'Évaluations à faire',
            value: 0,
            icon: ClipboardList,
            color: 'text-orange-600'
          },
          {
            title: 'Réunions Cette Semaine',
            value: 0,
            icon: Calendar,
            color: 'text-purple-600'
          }
        ];
      
      case 'intern':
        return [
          {
            title: 'Progression',
            value: `${stats.progress || 0}%`,
            icon: TrendingUp,
            color: 'text-green-600'
          },
          {
            title: 'Mes Demandes',
            value: stats.myRequests || 0,
            icon: FileText,
            color: 'text-blue-600'
          },
          {
            title: 'En Attente',
            value: stats.pendingRequests || 0,
            icon: AlertCircle,
            color: 'text-orange-600'
          },
          {
            title: 'Validées',
            value: (stats.myRequests || 0) - (stats.pendingRequests || 0),
            icon: CheckCircle,
            color: 'text-purple-600'
          }
        ];
      
      default:
        return [];
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{getRoleTitle()}</h1>
          <p className="text-muted-foreground">
            Bienvenue, {currentUser?.full_name}
          </p>
        </div>
        <Button onClick={handleSignOut} variant="outline">
          Déconnexion
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatsCards().map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Interns */}
        {recentData.interns && (
          <Card>
            <CardHeader>
              <CardTitle>Stagiaires Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentData.interns.map((intern: any) => (
                  <div key={intern.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{intern.user?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{intern.department}</p>
                    </div>
                    <Badge variant={intern.status === 'active' ? 'default' : 'secondary'}>
                      {intern.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Requests */}
        {recentData.requests && (
          <Card>
            <CardHeader>
              <CardTitle>Demandes Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentData.requests.map((request: any) => (
                  <div key={request.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{request.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.intern?.user?.full_name || 'Inconnu'}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        request.status === 'approved' ? 'default' : 
                        request.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {role === 'hr' && (
              <>
                <Button onClick={() => router.push('/dashboard/hr/interns')} className="h-20">
                  Gérer les Stagiaires
                </Button>
                <Button onClick={() => router.push('/dashboard/hr/requests')} className="h-20">
                  Valider les Demandes
                </Button>
              </>
            )}
            {role === 'tutor' && (
              <>
                <Button onClick={() => router.push('/dashboard/tutor/interns')} className="h-20">
                  Mes Stagiaires
                </Button>
                <Button onClick={() => router.push('/dashboard/tutor/requests')} className="h-20">
                  Demandes à Valider
                </Button>
              </>
            )}
            {role === 'intern' && (
              <>
                <Button onClick={() => router.push('/dashboard/intern/requests')} className="h-20">
                  Mes Demandes
                </Button>
                <Button onClick={() => router.push('/dashboard/intern/profile')} className="h-20">
                  Mon Profil
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
