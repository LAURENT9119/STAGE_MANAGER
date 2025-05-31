"use client";

import { useState, useEffect } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";
import { supabase, requestService } from "@/lib/supabase";

export default function InternRequestsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      // Get intern data first, then requests
      const { data: internData } = await supabase
        .from('interns')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (internData) {
        const { data, error } = await requestService.getByIntern(internData.id);
        if (error) {
          toast({
            title: "Erreur",
            description: "Impossible de charger les demandes",
            variant: "destructive",
          });
        } else {
          setRequests(data || []);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get intern data first
      const { data: internData } = await supabase
        .from('interns')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!internData) {
        toast({
          title: "Erreur",
          description: "Profil stagiaire non trouvé",
          variant: "destructive",
        });
        return;
      }

      const requestData = {
        ...formData,
        intern_id: internData.id,
        status: 'pending'
      };

      const { data, error } = await requestService.create(requestData);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de créer la demande",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Demande créée avec succès",
        });
        setIsDialogOpen(false);
        setFormData({
          type: "",
          title: "",
          description: "",
          start_date: "",
          end_date: "",
        });
        loadRequests();
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejetée</Badge>;
      case 'completed':
        return <Badge variant="outline"><CheckCircle className="w-3 h-3 mr-1" />Terminée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'leave':
        return 'Congé';
      case 'extension':
        return 'Prolongation';
      case 'evaluation':
        return 'Évaluation';
      case 'document':
        return 'Document';
      case 'support':
        return 'Support';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />

      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-muted/10">
          <DashboardNav role="intern" />
        </aside>

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Mes Demandes</h1>
                <p className="text-muted-foreground">
                  Gérez vos demandes de congés, prolongations et autres
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle demande
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle demande</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations de votre demande
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type de demande</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leave">Congé</SelectItem>
                          <SelectItem value="extension">Prolongation</SelectItem>
                          <SelectItem value="evaluation">Évaluation</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Titre de la demande"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Décrivez votre demande"
                        required
                      />
                    </div>

                    {(formData.type === 'leave' || formData.type === 'extension') && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="start_date">Date de début</Label>
                          <Input
                            id="start_date"
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="end_date">Date de fin</Label>
                          <Input
                            id="end_date"
                            type="date"
                            value={formData.end_date}
                            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                          />
                        </div>
                      </>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                        Annuler
                      </Button>
                      <Button type="submit" className="flex-1">
                        Créer
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Liste des demandes
                </CardTitle>
                <CardDescription>
                  Historique de toutes vos demandes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-6">Chargement...</div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Aucune demande trouvée
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Titre</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date de création</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request: any) => (
                        <TableRow key={request.id}>
                          <TableCell>{getTypeLabel(request.type)}</TableCell>
                          <TableCell className="font-medium">{request.title}</TableCell>
                          <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>
                            {new Date(request.created_at).toLocaleDateString('fr-FR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <SiteFooter />r />
    </div>
  );
}