"use client";
 
import { useState } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertCircle,
  CalendarIcon,
  FileText,
  Filter,
  Plus,
  Search
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type RequestType = 
  | "convention"
  | "prolongation"
  | "conge"
  | "changementTuteur"
  | "attestation";

type RequestStatus = 
  | "en_attente"
  | "en_cours"
  | "validee"
  | "refusee";

interface Request {
  id: string;
  type: RequestType;
  title: string;
  status: RequestStatus;
  date: Date;
  details: string;
}

const requestTypeLabels: Record<RequestType, string> = {
  convention: "Convention de stage",
  prolongation: "Prolongation de stage",
  conge: "Demande de congé",
  changementTuteur: "Changement de tuteur",
  attestation: "Attestation de stage"
};

const requestStatusLabels: Record<RequestStatus, string> = {
  en_attente: "En attente",
  en_cours: "En cours",
  validee: "Validée",
  refusee: "Refusée"
};

// Sample data for demonstration
const mockRequests: Request[] = [
  {
    id: "req-001",
    type: "convention",
    title: "Convention de stage initiale",
    status: "validee",
    date: new Date(2025, 3, 15),
    details: "Convention pour stage de 3 mois au service IT"
  },
  {
    id: "req-002",
    type: "conge",
    title: "Congé pour examen universitaire",
    status: "validee",
    date: new Date(2025, 4, 2),
    details: "2 jours de congé pour passer des examens"
  },
  {
    id: "req-003",
    type: "prolongation",
    title: "Prolongation de stage de 1 mois",
    status: "en_cours",
    date: new Date(2025, 4, 20),
    details: "Demande de prolongation pour finaliser le projet en cours"
  },
  {
    id: "req-004",
    type: "attestation",
    title: "Attestation de stage mi-parcours",
    status: "en_attente",
    date: new Date(2025, 4, 25),
    details: "Attestation requise pour l'université"
  }
];

export default function RequestsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [requestTypeFilter, setRequestTypeFilter] = useState<RequestType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // New request form state
  const [requestType, setRequestType] = useState<RequestType | "">("");
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  const filteredRequests = requests.filter(request => {
    const matchesType = requestTypeFilter === "all" || request.type === requestTypeFilter;
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          request.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });
  
  const handleNewRequest = () => {
    if (!requestType || !requestTitle || !requestDetails) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }
    
    // Additional validation for specific request types
    if ((requestType === "conge" || requestType === "prolongation") && (!startDate || !endDate)) {
      toast({
        title: "Dates requises",
        description: "Veuillez sélectionner les dates de début et de fin.",
        variant: "destructive",
      });
      return;
    }
    
    const newRequest: Request = {
      id: `req-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      type: requestType,
      title: requestTitle,
      status: "en_attente",
      date: new Date(),
      details: requestDetails + (startDate && endDate ? 
        ` (Du ${formatDate(startDate)} au ${formatDate(endDate)})` : "")
    };
    
    setRequests([newRequest, ...requests]);
    setNewRequestOpen(false);
    resetForm();
    
    toast({
      title: "Demande créée avec succès",
      description: "Votre demande a été soumise et est en attente de validation.",
    });
  };
  
  const resetForm = () => {
    setRequestType("");
    setRequestTitle("");
    setRequestDetails("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Mes Demandes</h1>
            <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle demande
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Nouvelle demande</DialogTitle>
                  <DialogDescription>
                    Créez une nouvelle demande en remplissant les informations ci-dessous.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="requestType" className="text-right">
                      Type
                    </Label>
                    <Select 
                      value={requestType} 
                      onValueChange={(value) => setRequestType(value as RequestType)}
      
                    >
                      <SelectTrigger id="requestType">
                        <SelectValue placeholder="Sélectionnez un type de demande" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(requestTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="requestTitle" className="text-right">
                      Titre
                    </Label>
                    <Input
                      id="requestTitle"
                      value={requestTitle}
                      onChange={(e) => setRequestTitle(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="requestDetails" className="text-right">
                      Détails
                    </Label>
                    <Textarea
                      id="requestDetails"
                      value={requestDetails}
                      onChange={(e) => setRequestDetails(e.target.value)}
                      className="col-span-3"
                      rows={4}
                    />
                  </div>
                  
                  {(requestType === "conge" || requestType === "prolongation") && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                          Date de début
                        </Label>
                        <div className="col-span-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !startDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? formatDate(startDate) : "Sélectionner une date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                          Date de fin
                        </Label>
                        <div className="col-span-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !endDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? formatDate(endDate) : "Sélectionner une date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                                disabled={(date) => 
                                  startDate ? date < startDate : false
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {requestType === "convention" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="col-span-1"></div>
                      <div className="col-span-3 flex items-center p-4 text-sm text-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <p>N'oubliez pas de télécharger votre convention signée par l'école dans la section Documents.</p>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewRequestOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleNewRequest}>Soumettre la demande</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              <Select value={requestTypeFilter} onValueChange={(v) => setRequestTypeFilter(v as any)}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {Object.entries(requestTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {Object.entries(requestStatusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="en_attente">En attente</TabsTrigger>
              <TabsTrigger value="en_cours">En cours</TabsTrigger>
              <TabsTrigger value="validee">Validées</TabsTrigger>
              <TabsTrigger value="refusee">Refusées</TabsTrigger>
            </TabsList>
            
            {["all", "en_attente", "en_cours", "validee", "refusee"].map((tab) => (
              <TabsContent key={tab} value={tab} className="w-full">
                {filteredRequests.filter(req => tab === "all" || req.status === tab).length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Titre</TableHead>
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
                              <TableCell className="font-medium">{request.title}</TableCell>
                              <TableCell>{requestTypeLabels[request.type]}</TableCell>
                              <TableCell>{formatDate(request.date)}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  request.status === "en_attente" 
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : request.status === "en_cours" 
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    : request.status === "validee" 
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }`}>
                                  {requestStatusLabels[request.status]}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <FileText className="h-4 w-4 mr-2" />
                                      Détails
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>{request.title}</DialogTitle>
                                      <DialogDescription>
                                        {requestTypeLabels[request.type]} - {formatDate(request.date)}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <div className="mb-4">
                                        <p className="text-sm font-medium mb-1">Statut</p>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                          request.status === "en_attente" 
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                            : request.status === "en_cours" 
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                            : request.status === "validee" 
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                        }`}>
                                          {requestStatusLabels[request.status]}
                                        </span>
                                      </div>
                                      <div className="mb-4">
                                        <p className="text-sm font-medium mb-1">Détails</p>
                                        <p className="text-sm">{request.details}</p>
                                      </div>
                                      
                                      {request.status === "en_attente" && (
                                        <div className="flex items-center p-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300">
                                          <AlertCircle className="h-4 w-4 mr-2" />
                                          <p>Votre demande est en attente d'approbation par votre tuteur.</p>
                                        </div>
                                      )}
                                      
                                      {request.status === "en_cours" && (
                                        <div className="flex items-center p-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300">
                                          <AlertCircle className="h-4 w-4 mr-2" />
                                          <p>Votre demande est en cours de traitement par les Ressources Humaines.</p>
                                        </div>
                                      )}
                                      
                                      {request.status === "validee" && (
                                        <div className="flex items-center p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-900/30 dark:text-green-300">
                                          <AlertCircle className="h-4 w-4 mr-2" />
                                          <p>Votre demande a été approuvée. Vous pouvez télécharger les documents associés dans la section Documents.</p>
                                        </div>
                                      )}
                                      
                                      {request.status === "refusee" && (
                                        <div className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-300">
                                          <AlertCircle className="h-4 w-4 mr-2" />
                                          <p>Votre demande a été refusée. Veuillez contacter votre tuteur pour plus d'informations.</p>
                                        </div>
                                      )}
                                    </div>
                                    <DialogFooter>
                                      {request.status === "en_attente" && (
                                        <Button 
                                          variant="destructive"
                                          onClick={() => {
                                            setRequests(requests.filter(r => r.id !== request.id));
                                            toast({
                                              title: "Demande annulée",
                                              description: "Votre demande a été annulée avec succès."
                                            });
                                          }}
                                        >
                                          Annuler la demande
                                        </Button>
                                      )}
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">Aucune demande trouvée</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Vous n&apos;avez pas encore de demande {tab !== "all" && `avec le statut "${requestStatusLabels[tab as RequestStatus]}"`} ou correspondant aux filtres actuels.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setRequestTypeFilter("all");
                        setStatusFilter("all");
                        setSearchTerm("");
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
