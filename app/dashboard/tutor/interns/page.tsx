
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
import { Filter, Search, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useInterns } from "@/hooks/use-interns";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TutorInternsPage() {
  const { user } = useAuthStore();
  const { interns, loading, error, updateProgress } = useInterns();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIntern, setSelectedIntern] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les stagiaires",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Filter interns assigned to current tutor
  const myInterns = interns.filter(intern => intern.tutor_id === user?.id);

  const filteredInterns = myInterns.filter((intern) => {
    const matchesSearch =
      intern.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || intern.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "En cours";
      case "completed":
        return "Terminé";
      case "upcoming":
        return "À venir";
      default:
        return status;
    }
  };

  const handleUpdateProgress = async (internId: string, newProgress: number) => {
    setUpdating(true);
    try {
      await updateProgress(internId, newProgress);
      toast({
        title: "Progression mise à jour",
        description: "La progression du stagiaire a été mise à jour avec succès.",
      });
      setSelectedIntern(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la progression",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
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
                <p className="mt-4 text-muted-foreground">Chargement de mes stagiaires...</p>
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
                <h2 className="text-2xl font-bold tracking-tight">Mes Stagiaires</h2>
                <p className="text-muted-foreground">
                  Gérez et suivez les stagiaires sous votre tutelle ({myInterns.length} stagiaires)
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un stagiaire..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">En cours</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="upcoming">À venir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stagiaire</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {myInterns.length === 0 
                          ? "Aucun stagiaire sous votre tutelle"
                          : "Aucun stagiaire trouvé avec ces critères"
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInterns.map((intern) => (
                      <TableRow key={intern.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={intern.user.avatar_url} alt={intern.user.full_name} />
                              <AvatarFallback>
                                {getInitials(intern.user.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{intern.user.full_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {intern.user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{intern.department}</TableCell>
                        <TableCell>
                          {new Date(intern.start_date).toLocaleDateString("fr-FR")} -{" "}
                          {new Date(intern.end_date).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={intern.progress} className="w-20" />
                            <span className="text-sm text-muted-foreground">{intern.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
                              intern.status
                            )}`}
                          >
                            {getStatusLabel(intern.status)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedIntern(intern)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Détails
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Détails du stagiaire</DialogTitle>
                              </DialogHeader>
                              {selectedIntern && (
                                <div className="space-y-6">
                                  <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                      <AvatarImage src={selectedIntern.user.avatar_url} />
                                      <AvatarFallback>
                                        {getInitials(selectedIntern.user.full_name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="text-lg font-semibold">{selectedIntern.user.full_name}</h3>
                                      <p className="text-muted-foreground">{selectedIntern.user.email}</p>
                                    </div>
                                  </div>

                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                      <Label>Département</Label>
                                      <p className="mt-1">{selectedIntern.department}</p>
                                    </div>
                                    <div>
                                      <Label>Projet</Label>
                                      <p className="mt-1">{selectedIntern.project || "Non défini"}</p>
                                    </div>
                                    <div>
                                      <Label>Date de début</Label>
                                      <p className="mt-1">{new Date(selectedIntern.start_date).toLocaleDateString("fr-FR")}</p>
                                    </div>
                                    <div>
                                      <Label>Date de fin</Label>
                                      <p className="mt-1">{new Date(selectedIntern.end_date).toLocaleDateString("fr-FR")}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Progression actuelle</Label>
                                    <div className="mt-2 flex items-center gap-2">
                                      <Progress value={selectedIntern.progress} className="flex-1" />
                                      <span className="text-sm font-medium">{selectedIntern.progress}%</span>
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="newProgress">Mettre à jour la progression</Label>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Input
                                        id="newProgress"
                                        type="number"
                                        min="0"
                                        max="100"
                                        defaultValue={selectedIntern.progress}
                                        className="w-20"
                                      />
                                      <span>%</span>
                                      <Button
                                        size="sm"
                                        disabled={updating}
                                        onClick={() => {
                                          const input = document.getElementById('newProgress') as HTMLInputElement;
                                          const newProgress = parseInt(input.value);
                                          if (newProgress >= 0 && newProgress <= 100) {
                                            handleUpdateProgress(selectedIntern.id, newProgress);
                                          }
                                        }}
                                      >
                                        {updating ? "Mise à jour..." : "Mettre à jour"}
                                      </Button>
                                    </div>
                                  </div>

                                  {selectedIntern.notes && (
                                    <div>
                                      <Label>Notes</Label>
                                      <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {selectedIntern.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
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
