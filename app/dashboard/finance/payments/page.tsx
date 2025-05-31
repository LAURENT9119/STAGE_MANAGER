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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Download, Filter, Search } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Payment {
  id: string;
  intern: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  date: Date;
  period: string;
}

const mockPayments: Payment[] = [
  {
    id: "PAY001",
    intern: "Jean Dupont",
    amount: 800,
    status: "paid",
    date: new Date(2025, 4, 1),
    period: "Mai 2025",
  },
  {
    id: "PAY002",
    intern: "Marie Martin",
    amount: 700,
    status: "pending",
    date: new Date(2025, 4, 1),
    period: "Mai 2025",
  },
  {
    id: "PAY003",
    intern: "Lucas Bernard",
    amount: 900,
    status: "paid",
    date: new Date(2025, 4, 1),
    period: "Mai 2025",
  },
  {
    id: "PAY004",
    intern: "Sophie Petit",
    amount: 800,
    status: "cancelled",
    date: new Date(2025, 4, 1),
    period: "Mai 2025",
  },
];

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>(mockPayments);
  const [date, setDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.intern
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Payé";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav role="finance" />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <DashboardNav role="finance" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <div className="flex flex-col space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Gratifications</h2>
              <p className="text-muted-foreground">
                Gérez les gratifications des stagiaires.
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
                    <SelectItem value="paid">Payé</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "MMMM yyyy", { locale: fr })
                      ) : (
                        <span>Sélectionner un mois</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Stagiaire</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.intern}</TableCell>
                      <TableCell>{payment.amount} €</TableCell>
                      <TableCell>{payment.period}</TableCell>
                      <TableCell>
                        {format(payment.date, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
                            payment.status
                          )}`}
                        >
                          {getStatusLabel(payment.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Détails
                        </Button>
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/string-utils";
import { 
  Plus, 
  Search, 
  Download, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useInterns } from "@/hooks/use-interns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Payment {
  id: string;
  intern_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  payment_date: string;
  description: string;
  created_at: string;
  intern?: {
    user: {
      full_name: string;
      email: string;
      avatar_url?: string;
    };
    department: string;
  };
}

export default function PaymentsPage() {
  const { interns, loading: internsLoading } = useInterns();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [newPaymentOpen, setNewPaymentOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    intern_id: "",
    amount: 0,
    description: "",
    payment_date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      // Simuler le chargement des paiements depuis la base de données
      const demoPayments: Payment[] = [
        {
          id: '1',
          intern_id: '1',
          amount: 800,
          status: 'paid',
          payment_date: '2024-01-15',
          description: 'Gratification mensuelle - Janvier 2024',
          created_at: '2024-01-01T00:00:00Z',
          intern: {
            user: {
              full_name: 'Marie Dubois',
              email: 'marie.dubois@email.com'
            },
            department: 'Informatique'
          }
        },
        {
          id: '2',
          intern_id: '2',
          amount: 750,
          status: 'approved',
          payment_date: '2024-01-20',
          description: 'Gratification mensuelle - Janvier 2024',
          created_at: '2024-01-05T00:00:00Z',
          intern: {
            user: {
              full_name: 'Pierre Martin',
              email: 'pierre.martin@email.com'
            },
            department: 'Marketing'
          }
        },
        {
          id: '3',
          intern_id: '3',
          amount: 900,
          status: 'pending',
          payment_date: '2024-01-25',
          description: 'Gratification mensuelle - Janvier 2024',
          created_at: '2024-01-10T00:00:00Z',
          intern: {
            user: {
              full_name: 'Sophie Bernard',
              email: 'sophie.bernard@email.com'
            },
            department: 'Finance'
          }
        }
      ];

      setPayments(demoPayments);
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async () => {
    try {
      const payment: Payment = {
        id: Date.now().toString(),
        ...newPayment,
        status: 'pending',
        created_at: new Date().toISOString(),
        intern: interns.find(i => i.id === newPayment.intern_id)
      };

      setPayments(prev => [payment, ...prev]);

      toast({
        title: "Succès",
        description: "Gratification créée avec succès",
      });

      setNewPaymentOpen(false);
      setNewPayment({
        intern_id: "",
        amount: 0,
        description: "",
        payment_date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la gratification",
        variant: "destructive",
      });
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: Payment['status']) => {
    try {
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId ? { ...payment, status } : payment
      ));

      toast({
        title: "Succès",
        description: "Statut mis à jour avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const exportPayments = () => {
    const csvContent = [
      ['Date', 'Stagiaire', 'Département', 'Montant', 'Statut', 'Description'].join(','),
      ...filteredPayments.map(payment => [
        new Date(payment.payment_date).toLocaleDateString('fr-FR'),
        payment.intern?.user.full_name || 'N/A',
        payment.intern?.department || 'N/A',
        `${payment.amount}€`,
        payment.status,
        `"${payment.description}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gratifications_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export réussi",
      description: "Le rapport a été exporté avec succès"
    });
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.intern?.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "approved":
        return "secondary";
      case "pending":
        return "outline";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Payé";
      case "approved":
        return "Approuvé";
      case "pending":
        return "En attente";
      case "rejected":
        return "Rejeté";
      default:
        return status;
    }
  };

  const getTotalAmount = () => {
    return filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getStatusStats = () => {
    return {
      pending: payments.filter(p => p.status === 'pending').length,
      approved: payments.filter(p => p.status === 'approved').length,
      paid: payments.filter(p => p.status === 'paid').length,
      rejected: payments.filter(p => p.status === 'rejected').length
    };
  };

  const stats = getStatusStats();

  if (loading || internsLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav role="finance" />
          </div>
        </header>
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
            <DashboardNav role="finance" />
          </aside>
          <main className="flex w-full flex-col overflow-hidden py-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Chargement des gratifications...</p>
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
          <MainNav role="finance" />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <DashboardNav role="finance" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <div className="flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Gratifications</h2>
                <p className="text-muted-foreground">
                  Gérez les gratifications des stagiaires ({payments.length} gratifications)
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={exportPayments} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
                <Dialog open={newPaymentOpen} onOpenChange={setNewPaymentOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouvelle gratification
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Créer une gratification</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="intern" className="text-right">
                          Stagiaire
                        </Label>
                        <Select value={newPayment.intern_id} onValueChange={(value) => setNewPayment({ ...newPayment, intern_id: value })}>
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
                        <Label htmlFor="amount" className="text-right">
                          Montant (€)
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newPayment.amount}
                          onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Date de paiement
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={newPayment.payment_date}
                          onChange={(e) => setNewPayment({ ...newPayment, payment_date: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="description"
                          value={newPayment.description}
                          onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                          className="col-span-3"
                          placeholder="Ex: Gratification mensuelle - Janvier 2024"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setNewPaymentOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={createPayment}>
                        Créer
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
                  <CardTitle className="text-sm font-medium">Total du mois</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getTotalAmount()}€</div>
                  <p className="text-xs text-muted-foreground">
                    +12% par rapport au mois dernier
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
                    Gratifications en attente
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.approved}</div>
                  <p className="text-xs text-muted-foreground">
                    Prêtes pour paiement
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Payées</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.paid}</div>
                  <p className="text-xs text-muted-foreground">
                    Gratifications versées
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filtres */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une gratification..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table des gratifications */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stagiaire</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date de paiement</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Aucune gratification trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={payment.intern?.user.avatar_url} alt={payment.intern?.user.full_name} />
                              <AvatarFallback>
                                {getInitials(payment.intern?.user.full_name || 'N/A')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{payment.intern?.user.full_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {payment.intern?.user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{payment.intern?.department}</TableCell>
                        <TableCell className="font-medium">{payment.amount}€</TableCell>
                        <TableCell>
                          {new Date(payment.payment_date).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {payment.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(payment.status)}>
                            {getStatusLabel(payment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {payment.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updatePaymentStatus(payment.id, 'approved')}
                                >
                                  Approuver
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updatePaymentStatus(payment.id, 'rejected')}
                                >
                                  Rejeter
                                </Button>
                              </>
                            )}
                            {payment.status === 'approved' && (
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => updatePaymentStatus(payment.id, 'paid')}
                              >
                                Marquer comme payé
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
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  intern: {
    first_name: string;
    last_name: string;
  };
  request?: {
    title: string;
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          intern:interns(first_name, last_name),
          request:requests(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.intern.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.intern.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.amount.toString().includes(searchTerm);
    constmatchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground">
            Gestion des paiements des stagiaires
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher par nom ou montant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="completed">Complété</SelectItem>
            <SelectItem value="failed">Échoué</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stagiaire</TableHead>
                <TableHead>Demande</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {payment.intern.first_name} {payment.intern.last_name}
                  </TableCell>
                  <TableCell>{payment.request?.title || 'N/A'}</TableCell>
                  <TableCell>{payment.amount} €</TableCell>
                  <TableCell>
                    <Badge variant={
                      payment.status === 'completed' ? 'default' :
                      payment.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {payment.status === 'completed' ? 'Complété' :
                       payment.status === 'pending' ? 'En attente' : 'Échoué'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}