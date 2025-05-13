
"use client";

import { useState } from "react";
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
import { Filter, Search, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Request {
  id: string;
  type: "convention" | "prolongation" | "conge" | "attestation";
  intern: {
    name: string;
    email: string;
    avatar?: string;
    department: string;
  };
  tutor: {
    name: string;
    email: string;
  };
  date: string;
  status: "pending" | "approved" | "rejected" | "processing";
  details: string;
}

const mockRequests: Request[] = [
  {
    id: "REQ001",
    type: "convention",
    intern: {
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      department: "IT"
    },
    tutor: {
      name: "Marie Laurent",
      email: "m.laurent@example.com"
    },
    date: "2025-05-01",
    status: "pending",
    details: "Convention de stage - 6 mois à partir du 01/07/2025"
  },
  {
    id: "REQ002",
    type: "prolongation",
    intern: {
      name: "Sophie Martin",
      email: "sophie.martin@example.com",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      department: "Marketing"
    },
    tutor: {
      name: "Thomas Dubois",
      email: "t.dubois@example.com"
    },
    date: "2025-05-02",
    status: "processing",
    details: "Prolongation de 2 mois - Projet en cours"
  }
];

export default function RequestsPage() {
  const { toast } = useToast();
  const [requests] = useState<Request[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.intern.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tutor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "convention":
        return "Convention";
      case "prolongation":
        return "Prolongation";
      case "conge":
        return "Congé";
      case "attestation":
        return "Attestation";
      default:
        return type;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "processing":
        return "En traitement";
      case "approved":
        return "Approuvée";
      case "rejected":
        return "Refusée";
      default:
        return status;
    }
  };

  const handleProcess = (requestId: string) => {
    toast({
      title: "Demande en traitement",
      description: "La demande a été mise en traitement.",
    });
  };

  const handleValidate = (requestId: string) => {
    toast({
      title: "Demande validée",
      description: "La demande a été validée avec succès.",
    });
  };

  const handleReject = (requestId: string) => {
    toast({
      title: "Demande refusée",
      description: "La demande a été refusée.",
      variant: "destructive",
    });
  };

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
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Demandes</h2>
              <p className="text-muted-foreground">
                Gérez les demandes des stagiaires
              </p>
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
                <Select
                  value={typeFilter}
                  onValueChange={(value) => setTypeFilter(value)}
                >
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
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="processing">En traitement</SelectItem>
                    <SelectItem value="approved">Approuvée</SelectItem>
                    <SelectItem value="rejected">Refusée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="processing">En traitement</TabsTrigger>
                <TabsTrigger value="approved">Validées</TabsTrigger>
                <TabsTrigger value="rejected">Refusées</TabsTrigger>
              </TabsList>

              {["all", "pending", "processing", "approved", "rejected"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Stagiaire</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Tuteur</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests
                          .filter(req => tab === "all" || req.status === tab)
                          .map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage
                                      src={request.intern.avatar}
                                      alt={request.intern.name}
                                    />
                                    <AvatarFallback>
                                      {getInitials(request.intern.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {request.intern.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {request.intern.email}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{request.intern.department}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{request.tutor.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {request.tutor.email}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getTypeLabel(request.type)}</TableCell>
                              <TableCell>
                                {new Date(request.date).toLocaleDateString("fr-FR")}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
                                    request.status
                                  )}`}
                                >
                                  {getStatusLabel(request.status)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      Détails
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Détails de la demande</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="font-medium">Stagiaire</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {request.intern.name} - {request.intern.department}
                                          </p>
                                        </div>
                                        <div>
                                          <h4 className="font-medium">Tuteur</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {request.tutor.name}
                                          </p>
                                        </div>
                                        <div>
                                          <h4 className="font-medium">Type</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {getTypeLabel(request.type)}
                                          </p>
                                        </div>
                                        <div>
                                          <h4 className="font-medium">Date</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {new Date(request.date).toLocaleDateString(
                                              "fr-FR"
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <h4 className="font-medium">Détails</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {request.details}
                                          </p>
                                        </div>
                                        <div>
                                          <h4 className="font-medium">Statut</h4>
                                          <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
                                              request.status
                                            )}`}
                                          >
                                            {getStatusLabel(request.status)}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      {request.status === "pending" && (
                                        <div className="mt-6 flex justify-end gap-2">
                                          <Button
                                            variant="outline"
                                            onClick={() => handleReject(request.id)}
                                          >
                                            Refuser
                                          </Button>
                                          <Button
                                            onClick={() => handleProcess(request.id)}
                                          >
                                            Mettre en traitement
                                          </Button>
                                        </div>
                                      )}
                                      
                                      {request.status === "processing" && (
                                        <div className="mt-6 flex justify-end gap-2">
                                          <Button
                                            variant="outline"
                                            onClick={() => handleReject(request.id)}
                                          >
                                            Refuser
                                          </Button>
                                          <Button
                                            onClick={() => handleValidate(request.id)}
                                          >
                                            Valider
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
