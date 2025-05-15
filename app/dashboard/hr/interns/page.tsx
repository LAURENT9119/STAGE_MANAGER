
import { InternForm } from "@/components/forms/intern-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

"use client";

import { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Intern {
  id: string;
  user: {
    name: string;
    email: string;
    avatar_url: string | null;
  };
  department: {
    name: string;
  };
  tutor: {
    name: string;
  };
  start_date: string;
  end_date: string;
  status: "active" | "completed" | "upcoming";
}

export default function HRInternsPage() {
  const { toast } = useToast();
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchInterns();
  }, []);

  async function fetchInterns() {
    try {
      const { data, error } = await supabase
        .from('interns')
        .select(`
          id,
          status,
          start_date,
          end_date,
          user:user_id(name, email, avatar_url),
          department:department_id(name),
          tutor:tutor_id(name)
        `);

      if (error) throw error;

      setInterns(data as unknown as Intern[]);
    } catch (error) {
      console.error('Error fetching interns:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des stagiaires.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredInterns = interns.filter((intern) => {
    const matchesSearch =
      intern.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || intern.department.name === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || intern.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
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

  if (loading) {
    return <div>Chargement...</div>;
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
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Stagiaires</h2>
              <p className="text-muted-foreground">
                Gérez les stagiaires de l&apos;entreprise
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
                  value={departmentFilter}
                  onValueChange={(value) => setDepartmentFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les services</SelectItem>
                    {Array.from(new Set(interns.map(i => i.department.name))).map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
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
                    <TableHead>Service</TableHead>
                    <TableHead>Tuteur</TableHead>
                    <TableHead>Période</TableHead>
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
                            <AvatarImage src={intern.user.avatar_url || undefined} alt={intern.user.name} />
                            <AvatarFallback>
                              {getInitials(intern.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{intern.user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {intern.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{intern.department.name}</TableCell>
                      <TableCell>{intern.tutor.name}</TableCell>
                      <TableCell>
                        {new Date(intern.start_date).toLocaleDateString("fr-FR")} -{" "}
                        {new Date(intern.end_date).toLocaleDateString("fr-FR")}
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
                            <InternForm intern={intern} mode="edit" />
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