"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MainNav } from '@/components/layout/main-nav';
import { DashboardNav } from '@/components/layout/dashboard-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { supabase } from '@/lib/supabase';
import { Trash2, UserPlus, Search, Filter } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string;
}

export default function AdminUsersPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hr': return 'bg-blue-100 text-blue-800';
      case 'tutor': return 'bg-green-100 text-green-800';
      case 'intern': return 'bg-yellow-100 text-yellow-800';
      case 'finance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertDescription>
            Accès non autorisé. Seuls les administrateurs peuvent accéder à cette page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <DashboardNav />
        </aside>

        <main className="flex w-full flex-col overflow-hidden py-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
              <p className="text-muted-foreground">
                Gérez tous les utilisateurs de la plateforme
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Filtres et recherche */}
            <Card>
              <CardHeader>
                <CardTitle>Filtres et recherche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher par email ou nom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">Tous les rôles</option>
                    <option value="admin">Administrateur</option>
                    <option value="hr">RH</option>
                    <option value="tutor">Tuteur</option>
                    <option value="intern">Stagiaire</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Liste des utilisateurs */}
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
                <CardDescription>
                  Liste de tous les utilisateurs enregistrés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun utilisateur trouvé
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((userItem) => (
                      <div key={userItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{userItem.full_name || 'Nom non défini'}</h3>
                            <Badge className={getRoleBadgeColor(userItem.role)}>
                              {userItem.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{userItem.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Créé le {new Date(userItem.created_at).toLocaleDateString('fr-FR')}
                            {userItem.last_sign_in_at && (
                              <>  • Dernière connexion: {new Date(userItem.last_sign_in_at).toLocaleDateString('fr-FR')}</>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteUser(userItem.id)}
                            disabled={userItem.id === user.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}