
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Upload, 
  Filter, 
  Search, 
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck,
  FilePlus
} from "lucide-react";
import { useInterns } from "@/hooks/use-interns";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: 'convention' | 'attestation' | 'rapport' | 'evaluation' | 'contrat' | 'autre';
  status: 'pending' | 'approved' | 'rejected' | 'generated';
  internName: string;
  internId: string;
  createdDate: string;
  reviewedDate?: string;
  size: string;
  notes?: string;
}

export default function HRDocumentsPage() {
  const { interns, loading: internsLoading } = useInterns();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    type: "convention" as Document['type'],
    internId: "",
    notes: ""
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      // Simuler le chargement des documents depuis la base de données
      const mockDocuments: Document[] = [
        {
          id: '1',
          name: 'Convention de stage - Marie Dubois',
          type: 'convention',
          status: 'approved',
          internName: 'Marie Dubois',
          internId: '1',
          createdDate: '2024-01-15T00:00:00Z',
          reviewedDate: '2024-01-16T00:00:00Z',
          size: '245 KB'
        },
        {
          id: '2',
          name: 'Rapport de stage - Pierre Martin',
          type: 'rapport',
          status: 'pending',
          internName: 'Pierre Martin',
          internId: '2',
          createdDate: '2024-01-20T00:00:00Z',
          size: '1.2 MB'
        },
        {
          id: '3',
          name: 'Attestation de stage - Sophie Bernard',
          type: 'attestation',
          status: 'generated',
          internName: 'Sophie Bernard',
          internId: '3',
          createdDate: '2024-01-22T00:00:00Z',
          size: '156 KB'
        }
      ];

      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDocument = async () => {
    if (!newDocument.internId || !newDocument.type) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un stagiaire et un type de document",
        variant: "destructive",
      });
      return;
    }

    try {
      const intern = interns.find(i => i.id === newDocument.internId);
      if (!intern) return;

      const document: Document = {
        id: Date.now().toString(),
        name: `${getTypeLabel(newDocument.type)} - ${intern.user.full_name}`,
        type: newDocument.type,
        status: 'generated',
        internName: intern.user.full_name,
        internId: newDocument.internId,
        createdDate: new Date().toISOString(),
        size: '150 KB',
        notes: newDocument.notes
      };

      setDocuments(prev => [document, ...prev]);

      toast({
        title: "Document généré",
        description: `Le document ${getTypeLabel(newDocument.type)} a été généré avec succès`
      });

      setGenerateOpen(false);
      setNewDocument({ type: "convention", internId: "", notes: "" });
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le document",
        variant: "destructive",
      });
    }
  };

  const reviewDocument = async (documentId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              status, 
              reviewedDate: new Date().toISOString(),
              notes: notes || doc.notes
            }
          : doc
      ));

      toast({
        title: "Document révisé",
        description: `Le document a été ${status === 'approved' ? 'approuvé' : 'rejeté'} avec succès`
      });

      setReviewOpen(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error('Erreur lors de la révision:', error);
      toast({
        title: "Erreur",
        description: "Impossible de réviser le document",
        variant: "destructive",
      });
    }
  };

  const downloadDocument = (doc: Document) => {
    toast({
      title: "Téléchargement démarré",
      description: `Le document "${doc.name}" est en cours de téléchargement`
    });
  };

  const exportDocuments = () => {
    const csvContent = [
      ['Document', 'Type', 'Stagiaire', 'Statut', 'Date création', 'Date révision', 'Taille'].join(','),
      ...filteredDocuments.map(doc => [
        `"${doc.name}"`,
        getTypeLabel(doc.type),
        doc.internName,
        getStatusLabel(doc.status),
        new Date(doc.createdDate).toLocaleDateString('fr-FR'),
        doc.reviewedDate ? new Date(doc.reviewedDate).toLocaleDateString('fr-FR') : 'N/A',
        doc.size
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `documents_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export réussi",
      description: "La liste des documents a été exportée avec succès"
    });
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.internName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      case 'generated':
        return <Badge variant="secondary"><FileCheck className="w-3 h-3 mr-1" />Généré</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusLabel = (status: Document['status']) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejeté';
      case 'generated': return 'Généré';
      default: return status;
    }
  };

  const getTypeLabel = (type: Document['type']) => {
    switch (type) {
      case 'convention': return 'Convention';
      case 'attestation': return 'Attestation';
      case 'rapport': return 'Rapport';
      case 'evaluation': return 'Évaluation';
      case 'contrat': return 'Contrat';
      case 'autre': return 'Autre';
      default: return type;
    }
  };

  const getDocumentStats = () => {
    return {
      total: documents.length,
      pending: documents.filter(d => d.status === 'pending').length,
      approved: documents.filter(d => d.status === 'approved').length,
      generated: documents.filter(d => d.status === 'generated').length
    };
  };

  const stats = getDocumentStats();

  if (loading || internsLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav role="hr" />
          </div>
        </header>
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
            <DashboardNav role="hr" />
          </aside>
          <main className="flex w-full flex-col overflow-hidden py-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Chargement des documents...</p>
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
          <MainNav role="hr" />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <DashboardNav role="hr" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <div className="flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Documents</h2>
                <p className="text-muted-foreground">
                  Gérez les documents des stagiaires ({documents.length} documents)
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={exportDocuments} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
                <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <FilePlus className="mr-2 h-4 w-4" />
                      Générer document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Générer un document</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Type
                        </Label>
                        <Select value={newDocument.type} onValueChange={(value) => setNewDocument({ ...newDocument, type: value as Document['type'] })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="convention">Convention de stage</SelectItem>
                            <SelectItem value="attestation">Attestation</SelectItem>
                            <SelectItem value="contrat">Contrat</SelectItem>
                            <SelectItem value="evaluation">Évaluation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="intern" className="text-right">
                          Stagiaire
                        </Label>
                        <Select value={newDocument.internId} onValueChange={(value) => setNewDocument({ ...newDocument, internId: value })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Sélectionner un stagiaire" />
                          </SelectTrigger>
                          <SelectContent>
                            {interns.map(intern => (
                              <SelectItem key={intern.id} value={intern.id}>
                                {intern.user.full_name} - {intern.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                          Notes
                        </Label>
                        <Textarea
                          id="notes"
                          value={newDocument.notes}
                          onChange={(e) => setNewDocument({ ...newDocument, notes: e.target.value })}
                          className="col-span-3"
                          placeholder="Notes supplémentaires..."
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setGenerateOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={generateDocument}>
                        Générer
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    Documents totaux
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En attente</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <p className="text-xs text-muted-foreground">
                    À réviser
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.approved}</div>
                  <p className="text-xs text-muted-foreground">
                    Validés
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Générés</CardTitle>
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.generated}</div>
                  <p className="text-xs text-muted-foreground">
                    Par le système
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filtres */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un document..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="convention">Convention</SelectItem>
                    <SelectItem value="attestation">Attestation</SelectItem>
                    <SelectItem value="rapport">Rapport</SelectItem>
                    <SelectItem value="evaluation">Évaluation</SelectItem>
                    <SelectItem value="contrat">Contrat</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                    <SelectItem value="generated">Généré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table des documents */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Stagiaire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date création</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Aucun document trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeLabel(doc.type)}</TableCell>
                        <TableCell>{doc.internName}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell>
                          {new Date(doc.createdDate).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => downloadDocument(doc)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Télécharger
                            </Button>
                            {doc.status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setReviewOpen(true);
                                }}
                              >
                                Réviser
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Dialog de révision */}
            <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Réviser le document</DialogTitle>
                </DialogHeader>
                {selectedDocument && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">{selectedDocument.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Stagiaire: {selectedDocument.internName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reviewNotes">Notes de révision</Label>
                      <Textarea
                        id="reviewNotes"
                        placeholder="Ajoutez vos commentaires..."
                        defaultValue={selectedDocument.notes}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          const notes = (document.getElementById('reviewNotes') as HTMLTextAreaElement)?.value;
                          reviewDocument(selectedDocument.id, 'rejected', notes);
                        }}
                      >
                        Rejeter
                      </Button>
                      <Button 
                        onClick={() => {
                          const notes = (document.getElementById('reviewNotes') as HTMLTextAreaElement)?.value;
                          reviewDocument(selectedDocument.id, 'approved', notes);
                        }}
                      >
                        Approuver
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
