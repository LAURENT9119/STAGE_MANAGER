'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useInterns } from '@/hooks/use-interns';
import { useRequests } from '@/hooks/use-requests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserWelcome } from '@/components/dashboard/user-welcome';

export default function RoleDashboard({ params }: { params: { role: string } }) {
  const { user } = useAuthStore();
  const { interns, loading: internsLoading, error: internsError } = useInterns();
  const { requests, loading: requestsLoading, error: requestsError } = useRequests();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <UserWelcome user={{...user, name: user.full_name}} />

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user.role === 'intern' ? 'Mon statut' : 'Stagiaires actifs'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {internsLoading ? '...' : interns.filter(i => i.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user.role === 'intern' ? 'Mes demandes' : 'Demandes en attente'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requestsLoading ? '...' : requests.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total stagiaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {internsLoading ? '...' : interns.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total demandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requestsLoading ? '...' : requests.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Affichage des erreurs */}
      {(internsError || requestsError) && (
        <Alert variant="destructive">
          <AlertDescription>
            {internsError || requestsError}
          </AlertDescription>
        </Alert>
      )}

      {/* Stagiaires récents */}
      <Card>
        <CardHeader>
          <CardTitle>
            {user.role === 'intern' ? 'Mon profil de stage' : 'Stagiaires récents'}
          </CardTitle>
          <CardDescription>
            {user.role === 'intern' 
              ? 'Informations sur votre stage actuel'
              : 'Liste des stagiaires les plus récents'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {internsLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : interns.length > 0 ? (
            <div className="space-y-4">
              {interns.slice(0, 5).map((intern) => (
                <div key={intern.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{intern.user?.full_name}</h3>
                    <p className="text-sm text-gray-500">{intern.department}</p>
                    <p className="text-sm text-gray-500">{intern.university}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(intern.status)}>
                      {intern.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(intern.start_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Aucun stagiaire trouvé
            </p>
          )}
        </CardContent>
      </Card>

      {/* Demandes récentes */}
      <Card>
        <CardHeader>
          <CardTitle>
            {user.role === 'intern' ? 'Mes demandes' : 'Demandes récentes'}
          </CardTitle>
          <CardDescription>
            {user.role === 'intern' 
              ? 'Suivi de vos demandes'
              : 'Dernières demandes soumises'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requestsLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-4">
              {requests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{request.title}</h3>
                    <p className="text-sm text-gray-500">{request.type}</p>
                    {request.intern?.user && (
                      <p className="text-sm text-gray-500">{request.intern.user.full_name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(request.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Aucune demande trouvée
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}