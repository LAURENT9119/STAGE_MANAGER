
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app-store';
import { supabase } from '@/lib/supabase';

const roleLabels = {
  admin: 'Administrateur',
  hr: 'Ressources Humaines', 
  tutor: 'Tuteur',
  intern: 'Stagiaire',
  finance: 'Finance'
};

const roleDescriptions = {
  admin: 'Gestion complète de la plateforme',
  hr: 'Gestion des stagiaires et des demandes',
  tutor: 'Encadrement des stagiaires',
  intern: 'Espace personnel du stagiaire',
  finance: 'Gestion financière et des paiements'
};

export default function RoleDashboard() {
  const params = useParams();
  const router = useRouter();
  const role = params.role as string;
  
  const {
    interns,
    requests,
    users,
    loading,
    errors,
    setInterns,
    setRequests,
    setUsers,
    setInternsLoading,
    setRequestsLoading,
    setUsersLoading,
    setInternsError,
    setRequestsError,
    setUsersError
  } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch interns
        setInternsLoading(true);
        const { data: internsData, error: internsError } = await supabase
          .from('interns')
          .select('*')
          .order('created_at', { ascending: false });

        if (internsError) {
          setInternsError(internsError.message);
        } else {
          setInterns(internsData || []);
          setInternsError(null);
        }

        // Fetch requests
        setRequestsLoading(true);
        const { data: requestsData, error: requestsError } = await supabase
          .from('requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (requestsError) {
          setRequestsError(requestsError.message);
        } else {
          setRequests(requestsData || []);
          setRequestsError(null);
        }

        // Fetch users (for admin)
        if (role === 'admin') {
          setUsersLoading(true);
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

          if (usersError) {
            setUsersError(usersError.message);
          } else {
            setUsers(usersData || []);
            setUsersError(null);
          }
          setUsersLoading(false);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setInternsLoading(false);
        setRequestsLoading(false);
      }
    };

    fetchData();
  }, [role]);

  if (!role || !roleLabels[role as keyof typeof roleLabels]) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Rôle non valide</CardTitle>
            <CardDescription>Le rôle spécifié n'existe pas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard/admin')}>
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    totalInterns: interns.length,
    activeInterns: interns.filter(i => i.status === 'active').length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    totalUsers: users.length
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {roleLabels[role as keyof typeof roleLabels]}
          </h1>
          <p className="text-muted-foreground mt-2">
            {roleDescriptions[role as keyof typeof roleDescriptions]}
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {role.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stagiaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInterns}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.activeInterns} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stagiaires Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeInterns}</div>
            <p className="text-xs text-muted-foreground">
              En cours de stage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes en Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              À traiter
            </p>
          </CardContent>
        </Card>

        {role === 'admin' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Total système
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stagiaires Récents</CardTitle>
            <CardDescription>Les derniers stagiaires ajoutés</CardDescription>
          </CardHeader>
          <CardContent>
            {loading.interns ? (
              <p>Chargement...</p>
            ) : errors.interns ? (
              <p className="text-red-500">Erreur: {errors.interns}</p>
            ) : interns.length === 0 ? (
              <p className="text-muted-foreground">Aucun stagiaire trouvé</p>
            ) : (
              <div className="space-y-2">
                {interns.slice(0, 5).map((intern) => (
                  <div key={intern.id} className="flex items-center justify-between p-2 rounded border">
                    <div>
                      <p className="font-medium">{intern.full_name}</p>
                      <p className="text-sm text-muted-foreground">{intern.email}</p>
                    </div>
                    <Badge variant={intern.status === 'active' ? 'default' : 'secondary'}>
                      {intern.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demandes Récentes</CardTitle>
            <CardDescription>Les dernières demandes soumises</CardDescription>
          </CardHeader>
          <CardContent>
            {loading.requests ? (
              <p>Chargement...</p>
            ) : errors.requests ? (
              <p className="text-red-500">Erreur: {errors.requests}</p>
            ) : requests.length === 0 ? (
              <p className="text-muted-foreground">Aucune demande trouvée</p>
            ) : (
              <div className="space-y-2">
                {requests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-2 rounded border">
                    <div>
                      <p className="font-medium">{request.title}</p>
                      <p className="text-sm text-muted-foreground">{request.type}</p>
                    </div>
                    <Badge variant={request.status === 'pending' ? 'destructive' : 'default'}>
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => router.push(`/dashboard/${role}/interns`)}>
          Gérer les Stagiaires
        </Button>
        <Button variant="outline" onClick={() => router.push(`/dashboard/${role}/requests`)}>
          Voir les Demandes
        </Button>
        {role === 'admin' && (
          <Button variant="outline" onClick={() => router.push(`/dashboard/${role}/users`)}>
            Gérer les Utilisateurs
          </Button>
        )}
      </div>
    </div>
  );
}
