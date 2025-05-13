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
import { Filter, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface Intern {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  project: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "active" | "completed" | "upcoming";
}

const mockInterns: Intern[] = [
  {
    id: "INT001",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    project: "Développement API REST",
    startDate: "2025-01-15",
    endDate: "2025-07-15",
    progress: 45,
    status: "active",
  },
  {
    id: "INT002",
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    project: "Refonte interface utilisateur",
    startDate: "2025-02-01",
    endDate: "2025-08-01",
    progress: 30,
    status: "active",
  },
  {
    id: "INT003",
    name: "Lucas Bernard",
    email: "lucas.bernard@example.com",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    project: "Optimisation base de données",
    startDate: "2025-03-01",
    endDate: "2025-06-01",
    progress: 0,
    status: "upcoming",
  },
  {
    id: "INT004",
    name: "Emma Petit",
    email: "emma.petit@example.com",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
    project: "Migration microservices",
    startDate: "2024-09-01",
    endDate: "2025-03-01",
    progress: 100,
    status: "completed",
  },
];

export default function InternsPage() {
  const [interns] = useState<Intern[]>(mockInterns);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInterns = interns.filter((intern) => {
    const matchesSearch =
      intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.project.toLowerCase().includes(searchTerm.toLowerCase());
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
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Mes Stagiaires</h2>
              <p className="text-muted-foreground">
                Gérez et suivez vos stagiaires
              </p>
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
                    <TableHead>Projet</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterns.map((intern) => (
                    <TableRow key={intern.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={intern.avatar} alt={intern.name} />
                            <AvatarFallback>
                              {getInitials(intern.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{intern.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {intern.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{intern.project}</TableCell>
                      <TableCell>
                        {new Date(intern.startDate).toLocaleDateString("fr-FR")} -{" "}
                        {new Date(intern.endDate).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={intern.progress} className="w-[60px]" />
                          <span className="text-sm">{intern.progress}%</span>
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
                            <Button variant="outline" size="sm">
                              Détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Détails du stagiaire</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage
                                      src={intern.avatar}
                                      alt={intern.name}
                                    />
                                    <AvatarFallback>
                                      {getInitials(intern.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold">{intern.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {intern.email}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium">Projet</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {intern.project}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Période</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(intern.startDate).toLocaleDateString(
                                      "fr-FR"
                                    )}{" "}
                                    -{" "}
                                    {new Date(intern.endDate).toLocaleDateString(
                                      "fr-FR"
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Progression</h4>
                                  <div className="mt-2 flex items-center gap-2">
                                    <Progress
                                      value={intern.progress}
                                      className="w-full"
                                    />
                                    <span className="text-sm">
                                      {intern.progress}%
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium">Statut</h4>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
                                      intern.status
                                    )}`}
                                  >
                                    {getStatusLabel(intern.status)}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-6 flex justify-end gap-2">
                                <Button variant="outline">Évaluer</Button>
                                <Button>Mettre à jour</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
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