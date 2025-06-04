
"use client";

import { useState } from 'react';
import { useRequests } from '@/hooks/use-requests';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreateRequestDialog } from '@/components/requests/create-request-dialog';
import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusLabels = {
  'draft': 'Brouillon',
  'submitted': 'Soumise',
  'tutor_review': 'Révision tuteur',
  'hr_review': 'Révision RH',
  'finance_review': 'Révision finance',
  'approved': 'Approuvée',
  'rejected': 'Rejetée'
};

const typeLabels = {
  'convention': 'Convention de stage',
  'prolongation': 'Prolongation',
  'conge': 'Congé',
  'attestation': 'Attestation',
  'evaluation': 'Évaluation',
  'autre': 'Autre'
};

const priorityLabels = {
  'low': 'Faible',
  'medium': 'Moyenne',
  'high': 'Élevée',
  'urgent': 'Urgente'
};

export default function InternRequestsPage() {
  const { requests, loading, error, refetch, createRequest } = useRequests();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'submitted':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleCreateSuccess = async () => {
    setCreateDialogOpen(false);
    await refetch();
    toast({
      title: "Demande créée",
      description: "Votre demande a été soumise avec succès"
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCwIcon className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mes demandes</h1>
          <p className="text-muted-foreground">
            Gérez vos demandes administratives
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch} className="mt-2">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des demandes</CardTitle>
          <CardDescription>
            Suivez l'état de vos demandes administratives
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Aucune demande trouvée
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                Créer votre première demande
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Date limite</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {typeLabels[request.type] || request.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {request.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(request.status)}>
                        {statusLabels[request.status] || request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(request.priority)}>
                        {priorityLabels[request.priority] || request.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {request.due_date 
                        ? new Date(request.due_date).toLocaleDateString('fr-FR')
                        : 'Non définie'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateRequestDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
