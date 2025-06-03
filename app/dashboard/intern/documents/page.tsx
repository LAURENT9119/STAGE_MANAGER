
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
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: 'convention' | 'attestation' | 'rapport' | 'evaluation' | 'autre';
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  size: string;
  url?: string;
}

export default function InternDocumentsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "autre" as Document['type'],
    file: null as File | null
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
          name: 'Convention de stage',
          type: 'convention',
          status: 'approved',
          uploadDate: '2024-01-15T00:00:00Z',
          size: '245 KB',
          url: '#'
        },
        {
          id: '2',
          name: 'Rapport de stage - Janvier',
          type: 'rapport',
          status: 'pending',
          uploadDate: '2024-01-30T00:00:00Z',
          size: '1.2 MB'
        },
        {
          id: '3',
          name: 'Évaluation mi-parcours',
          type: 'evaluation',
          status: 'approved',
          uploadDate: '2024-01-20T00:00:00Z',
          size: '156 KB',
          url: '#'
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

  const handleFileUpload = async () => {
    if (!newDocument.file || !newDocument.name) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs et sélectionner un fichier",
        variant: "destructive",
      });
      return;
    }

    try {
      const document: Document = {
        id: Date.now().toString(),
        name: newDocument.name,
        type: newDocument.type,
        status: 'pending',
        uploadDate: new Date().toISOString(),
        size: `${Math.round(newDocument.file.size / 1024)} KB`
      };

      setDocuments(prev => [document, ...prev]);

      toast({
        title: "Document envoyé",
        description: "Votre document a été envoyé avec succès et est en cours de vérification"
      });

      setUploadOpen(false);
      setNewDocument({ name: "", type: "autre", file: null });
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le document",
        variant: "destructive",
      });
    }
  };

  const downloadDocument = (doc: Document) => {
    if (doc.url) {
      // Simuler le téléchargement
      toast({
        title: "Téléchargement démarré",
        description: `Le document "${doc.name}" est en cours de téléchargement`
      });
    } else {
      toast({
        title: "Document non disponible",
        description: "Ce document n'est pas encore disponible au téléchargement",
        variant: "destructive",
      });
    }
  };

  const generateDocument = (type: string) => {
    toast({
      title: "Génération en cours",
      description: `La génération du document ${type} a été demandée. Vous recevrez une notification quand il sera prêt.`
    });
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: Document['type']) => {
    switch (type) {
      case 'convention': return 'Convention';
      case 'attestation': return 'Attestation';
      case 'rapport': return 'Rapport';
      case 'evaluation': return 'Évaluation';
      case 'autre': return 'Autre';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav role="intern" />
          </div>
        </header>
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
            <DashboardNav role="intern" />
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
          <MainNav role="intern" />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <DashboardNav role="intern" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <div className="flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Mes Documents</h2>
                <p className="text-muted-foreground">
                  Gérez vos documents de stage ({documents.length} documents)
                </p>
              </div>
              <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Envoyer un document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Envoyer un nouveau document</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nom du document
                      </Label>
                      <Input
                        id="name"
                        value={newDocument.name}
                        onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                        className="col-span-3"
                        placeholder="Ex: Rapport de stage - Janvier"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <select
                        id="type"
                        value={newDocument.type}
                        onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value as Document['type'] })}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="rapport">Rapport</option>
                        <option value="evaluation">Évaluation</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="file" className="text-right">
                        Fichier
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => setNewDocument({ ...newDocument, file: e.target.files?.[0] || null })}
                        className="col-span-3"
                        accept=".pdf,.doc,.docx,.txt"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setUploadOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleFileUpload}>
                      Envoyer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Actions rapides */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => generateDocument('attestation')}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base">Demander une attestation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Générer une attestation de stage officielle
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => generateDocument('convention')}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-base">Convention de stage</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Télécharger votre convention de stage signée
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => generateDocument('evaluation')}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-base">Fiche d&apos;évaluation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Accéder à votre fiche d&apos;évaluation
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Liste des documents */}
            <Card>
              <CardHeader>
                <CardTitle>Mes documents</CardTitle>
                <CardDescription>
                  Liste de tous vos documents de stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date d&apos;envoi</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Aucun document enregistré
                        </TableCell>
                      </TableRow>
                    ) : (
                      documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{doc.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getTypeLabel(doc.type)}</TableCell>
                          <TableCell>{getStatusBadge(doc.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}
                            </div>
                          </TableCell>
                          <TableCell>{doc.size}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {doc.url && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => downloadDocument(doc)}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Télécharger
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                Voir
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
