
"use client";

import { useState, useEffect } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/string-utils";
import { Filter, Search, Check, X, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { useRequests } from "@/hooks/use-requests";

export default function TutorRequestsPage() {
  const { user } = useAuthStore();
  const { requests, loading, error, updateStatus } = useRequests(user?.id, user?.role);
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [reviewComments, setReviewComments] = useState("");

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.intern.user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      in_review: "bg-blue-100 text-blue-800",
    };
    
    const labels = {
      pending: "En attente",
      approved: "Approuvée",
      rejected: "Rejetée",
      in_review: "En cours d'examen",
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTypeName = (type: string) => {
    const types = {
      convention: "Convention de stage",
      prolongation: "Prolongation",
      conge: "Demande de congé",
      attestation: "Attestation",
      evaluation: "Évaluation",
    };
    return types[type as keyof typeof types] || type;
  };

  const handleUpdateRequest = async (requestId: string, newStatus: string) => {
    if (!user) return;

    setProcessing(true);
    try {
      await updateStatus(requestId, newStatus, user.id);
      toast({
        title: "Demande mise à jour",
        description: `La demande a été ${newStatus === 'approved' ? 'approuvée' : 'rejetée'} avec succès`,
      });
      setSelectedRequest(null);
      setReviewComments("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la demande",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav role="tutor" />
          </div>
        </header>
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
            <DashboardNav role="tutor" />
          </aside>
          <main className="flex w-full flex-col overflow-hidden py-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Chargement des demandes...</p>
              </div>
            </div>
          </main>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav role="tutor" />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <DashboardNav role="tutor" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <div className="flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Demandes à examiner</h2>
                <p className="text-muted-foreground">
                  Examinez et validez les demandes de vos stagiaires ({requests.length} demandes)
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une demande..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="convention">Convention</SelectItem>
                    <SelectItem value="prolongation">Prolongation</SelectItem>
                    <SelectItem value="conge">Congé</SelectItem>
                    <SelectItem value="attestation">Attestation</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="in_review">En cours</SelectItem>
                    <SelectItem value="approved">Approuvée</SelectItem>
                    <SelectItem value="rejected">Rejetée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stagiaire</TableHead>
                    <TableHead>Demande</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {requests.length === 0 
                          ? "Aucune demande à examiner"
                          : "Aucune demande trouvée avec ces critères"
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={request.intern.user.avatar_url} alt={request.intern.user.full_name} />
                              <AvatarFallback>
                                {getInitials(request.intern.user.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{request.intern.user.full_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {request.intern.department}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {request.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                            {getTypeName(request.type)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {new Date(request.submitted_at).toLocaleDateString("fr-FR")}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {request.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleUpdateRequest(request.id, 'approved')}
                                  disabled={processing}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleUpdateRequest(request.id, 'rejected')}
                                  disabled={processing}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedRequest(request)}
                                >
                                  Détails
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Détails de la demande</DialogTitle>
                                  <DialogDescription>
                                    Examinez et traitez cette demande de stagiaire
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                      <Avatar className="h-12 w-12">
                                        <AvatarImage src={selectedRequest.intern.user.avatar_url} />
                                        <AvatarFallback>
                                          {getInitials(selectedRequest.intern.user.full_name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h3 className="font-semibold">{selectedRequest.intern.user.full_name}</h3>
                                        <p className="text-sm text-muted-foreground">{selectedRequest.intern.department}</p>
                                      </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                      <div>
                                        <Label>Type</Label>
                                        <p className="mt-1">{getTypeName(selectedRequest.type)}</p>
                                      </div>
                                      <div>
                                        <Label>Statut</Label>
                                        <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                                      </div>
                                      <div>
                                        <Label>Date de soumission</Label>
                                        <p className="mt-1">{new Date(selectedRequest.submitted_at).toLocaleDateString("fr-FR")}</p>
                                      </div>
                                      {selectedRequest.reviewed_at && (
                                        <div>
                                          <Label>Date d'examen</Label>
                                          <p className="mt-1">{new Date(selectedRequest.reviewed_at).toLocaleDateString("fr-FR")}</p>
                                        </div>
                                      )}
                                    </div>

                                    <div>
                                      <Label>Titre</Label>
                                      <p className="mt-1 font-medium">{selectedRequest.title}</p>
                                    </div>

                                    <div>
                                      <Label>Description</Label>
                                      <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {selectedRequest.description}
                                      </p>
                                    </div>

                                    {selectedRequest.reviewer_comments && (
                                      <div>
                                        <Label>Commentaires de l'examinateur</Label>
                                        <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                                          {selectedRequest.reviewer_comments}
                                        </p>
                                      </div>
                                    )}

                                    {selectedRequest.status === 'pending' && (
                                      <div className="flex items-center gap-2 pt-4 border-t">
                                        <Button
                                          onClick={() => handleUpdateRequest(selectedRequest.id, 'approved')}
                                          disabled={processing}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <Check className="h-4 w-4 mr-2" />
                                          {processing ? "Traitement..." : "Approuver"}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => handleUpdateRequest(selectedRequest.id, 'rejected')}
                                          disabled={processing}
                                          className="text-red-600 border-red-600 hover:bg-red-50"
                                        >
                                          <X className="h-4 w-4 mr-2" />
                                          {processing ? "Traitement..." : "Rejeter"}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
