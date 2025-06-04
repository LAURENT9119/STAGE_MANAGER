
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/store/auth-store';
import { useRequests } from '@/hooks/use-requests';
import { useInterns } from '@/hooks/use-interns';
import { UserWelcome } from '@/components/dashboard/user-welcome';

export default function DashboardPage() {
  const params = useParams();
  const role = params.role as string;
  const { user, initialize, initialized } = useAuthStore();
  const { requests, loading: requestsLoading } = useRequests();
  const { interns, loading: internsLoading } = useInterns();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  if (!initialized) {
    return (
      <div className="p-6">
        <div className="text-center">Chargement de l'authentification...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Utilisateur non connecté. Veuillez vous reconnecter.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Vérifier que le rôle correspond
  if (user.role !== role) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Accès non autorisé. Votre rôle est "{user.role}" mais vous tentez d'accéder au dashboard "{role}".
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getStatsForRole = () => {
    switch (role) {
      case 'admin':
      case 'hr':
        return {
          totalInterns: interns.length,
          activeInterns: interns.filter(intern => intern.status === 'active').length,
          pendingRequests: requests.filter(req => req.status === 'submitted').length,
          totalRequests: requests.length
        };
      case 'tutor':
        const tutorInterns = interns.filter(intern => intern.tutor_id === user.id);
        const tutorRequests = requests.filter(req => 
          tutorInterns.some(intern => intern.id === req.intern_id)
        );
        return {
          totalInterns: tutorInterns.length,
          activeInterns: tutorInterns.filter(intern => intern.status === 'active').length,
          pendingRequests: tutorRequests.filter(req => req.status === 'tutor_review').length,
          totalRequests: tutorRequests.length
        };
      case 'intern':
        const userRequests = requests.filter(req => 
          interns.some(intern => intern.user_id === user.id && intern.id === req.intern_id)
        );
        const userIntern = interns.find(intern => intern.user_id === user.id);
        return {
          myRequests: userRequests.length,
          pendingRequests: userRequests.filter(req => req.status !== 'approved' && req.status !== 'rejected').length,
          progress: userIntern?.progress || 0,
          status: userIntern?.status || 'unknown'
        };
      case 'finance':
        return {
          totalRequests: requests.length,
          financeReview: requests.filter(req => req.status === 'finance_review').length,
          approved: requests.filter(req => req.status === 'approved').length,
          pending: requests.filter(req => req.status !== 'approved' && req.status !== 'rejected').length
        };
      default:
        return {};
    }
  };

  const stats = getStatsForRole();

  const renderRoleSpecificContent = () => {
    switch (role) {
      case 'admin':
      case 'hr':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stagiaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInterns}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stagiaires Actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeInterns}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demandes en Attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRequests}</div>
              </CardContent>
            </Card>
          </div>
        );

      case 'tutor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mes Stagiaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInterns}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeInterns}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">À Valider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRequests}</div>
              </CardContent>
            </Card>
          </div>
        );

      case 'intern':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mes Demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.myRequests}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={stats.status === 'active' ? 'default' : 'secondary'}>
                  {stats.status}
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Progression du Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={stats.progress} className="w-full" />
                  <p className="text-sm text-gray-600">{stats.progress}% complété</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'finance':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRequests}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">À Réviser</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.financeReview}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Rôle non reconnu</div>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <UserWelcome user={user} />
      
      {requestsLoading || internsLoading ? (
        <div className="text-center">Chargement des données...</div>
      ) : (
        renderRoleSpecificContent()
      )}
    </div>
  );
}
