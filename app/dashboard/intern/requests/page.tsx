"use client";

import { useState } from 'react';
import { useRequests } from '@/hooks/use-requests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreateRequestDialog } from '@/components/requests/create-request-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { SiteFooter } from '@/components/layout/site-footer';
import { Plus, Calendar, FileText, Clock } from 'lucide-react';

export default function InternRequestsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { requests, isLoading, error, refetch } = useRequests();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'convention':
        return <FileText className="h-4 w-4" />;
      case 'prolongation':
        return <Calendar className="h-4 w-4" />;
      case 'conge':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-medium">Erreur de chargement</h3>
              <p className="text-red-600">
                Impossible de charger vos demandes. Veuillez réessayer.
              </p>
              <Button 
                onClick={() => refetch()}
                className="mt-2"
                variant="outline"
              >
                Réessayer
              </Button>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Mes Demandes</h1>
              <p className="text-muted-foreground mt-2">
                Gérez vos demandes de stage et suivez leur statut
              </p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune demande</h3>
                <p className="text-muted-foreground mb-4">
                  Vous n'avez pas encore créé de demande.
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer ma première demande
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {requests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(request.type)}
                        {request.type === 'convention' && 'Convention'}
                        {request.type === 'prolongation' && 'Prolongation'}
                        {request.type === 'conge' && 'Congé'}
                      </CardTitle>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status === 'pending' && 'En attente'}
                        {request.status === 'approved' && 'Approuvé'}
                        {request.status === 'rejected' && 'Rejeté'}
                      </Badge>
                    </div>
                    <CardDescription>
                      Créé le {new Date(request.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {request.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {request.description}
                      </p>
                    )}
                    {request.start_date && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Début :</strong> {new Date(request.start_date).toLocaleDateString()}
                      </div>
                    )}
                    {request.end_date && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Fin :</strong> {new Date(request.end_date).toLocaleDateString()}
                      </div>
                    )}
                    {request.comments && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        <strong>Commentaires :</strong> {request.comments}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <CreateRequestDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onSuccess={() => {
              setIsCreateOpen(false);
              refetch();
            }}
          />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}