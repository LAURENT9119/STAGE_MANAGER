
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Activity,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  description: string;
  level: 'info' | 'warning' | 'error' | 'success';
  ip_address: string;
  user_agent: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("today");
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, [levelFilter, actionFilter, dateRange]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          users(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      // Filtrer par niveau
      if (levelFilter !== "all") {
        query = query.eq('level', levelFilter);
      }

      // Filtrer par action
      if (actionFilter !== "all") {
        query = query.eq('action', actionFilter);
      }

      // Filtrer par date
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0);
      }

      if (dateRange !== "all") {
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transformer les données pour inclure le nom d'utilisateur
      const transformedData = (data || []).map(log => ({
        ...log,
        user_name: log.users?.full_name || 'Utilisateur inconnu'
      }));

      setLogs(transformedData);
    } catch (error) {
      console.error('Erreur lors du chargement des journaux:', error);
      
      // Données de démonstration en cas d'erreur
      const demoLogs: ActivityLog[] = [
        {
          id: '1',
          user_id: '1',
          user_name: 'Admin User',
          action: 'LOGIN',
          description: 'Connexion réussie à la plateforme',
          level: 'success',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: '2',
          user_name: 'Marie Dubois',
          action: 'REQUEST_CREATED',
          description: 'Nouvelle demande de convention créée',
          level: 'info',
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          user_id: '3',
          user_name: 'Jean Martin',
          action: 'REQUEST_APPROVED',
          description: 'Demande de prolongation approuvée',
          level: 'success',
          ip_address: '192.168.1.102',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: '4',
          user_id: '4',
          user_name: 'Sophie Bernard',
          action: 'LOGIN_FAILED',
          description: 'Tentative de connexion échouée - mot de passe incorrect',
          level: 'warning',
          ip_address: '192.168.1.103',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
          created_at: new Date(Date.now() - 10800000).toISOString(),
        },
        {
          id: '5',
          user_id: '5',
          user_name: 'Système',
          action: 'SYSTEM_ERROR',
          description: 'Erreur lors de la génération du rapport mensuel',
          level: 'error',
          ip_address: 'localhost',
          user_agent: 'System Process',
          created_at: new Date(Date.now() - 14400000).toISOString(),
        }
      ];

      setLogs(demoLogs);
      
      toast({
        title: "Information",
        description: "Affichage des données de démonstration",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Date', 'Utilisateur', 'Action', 'Description', 'Niveau', 'IP', 'User Agent'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.created_at).toLocaleString('fr-FR'),
        log.user_name,
        log.action,
        `"${log.description}"`,
        log.level,
        log.ip_address,
        `"${log.user_agent}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getActionLabel = (action: string) => {
    const actionLabels: Record<string, string> = {
      'LOGIN': 'Connexion',
      'LOGOUT': 'Déconnexion',
      'LOGIN_FAILED': 'Échec de connexion',
      'REQUEST_CREATED': 'Demande créée',
      'REQUEST_APPROVED': 'Demande approuvée',
      'REQUEST_REJECTED': 'Demande rejetée',
      'USER_CREATED': 'Utilisateur créé',
      'USER_UPDATED': 'Utilisateur modifié',
      'USER_DELETED': 'Utilisateur supprimé',
      'SYSTEM_ERROR': 'Erreur système',
      'SETTINGS_UPDATED': 'Paramètres mis à jour',
    };
    return actionLabels[action] || action;
  };

  const getLogStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = logs.filter(log => new Date(log.created_at) >= today);
    const errorLogs = logs.filter(log => log.level === 'error');
    const warningLogs = logs.filter(log => log.level === 'warning');
    
    return {
      total: logs.length,
      today: todayLogs.length,
      errors: errorLogs.length,
      warnings: warningLogs.length
    };
  };

  const stats = getLogStats();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav role="admin" />
          </div>
        </header>
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
            <DashboardNav role="admin" />
          </aside>
          <main className="flex w-full flex-col overflow-hidden py-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Chargement des journaux...</p>
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
          <MainNav role="admin" />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <DashboardNav role="admin" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <div className="flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Journaux d&apos;activité
                </h2>
                <p className="text-muted-foreground">
                  Consultez l&apos;historique des activités de la plateforme.
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={loadLogs} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Actualiser
                </Button>
                <Button onClick={exportLogs} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    Entrées au total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aujourd&apos;hui</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.today}</div>
                  <p className="text-xs text-muted-foreground">
                    Activités aujourd&apos;hui
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avertissement<CardTitle className="text-sm font-medium">Avertissements</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
                  <p className="text-xs text-muted-foreground">
                    Événements d&apos;attention
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Erreurs</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                  <p className="text-xs text-muted-foreground">
                    Erreurs détectées
                  </p>
                </CardContent>
              </Card>
              </Card>
            </div>

            {/* Filtres */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les journaux..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={dateRange} onValueChange={(value) => setDateRange(value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Aujourd&apos;hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="all">Tout</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={levelFilter} onValueChange={(value) => setLevelFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous niveaux</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                    <SelectItem value="warning">Avertissement</SelectItem>
                    <SelectItem value="error">Erreur</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={actionFilter} onValueChange={(value) => setActionFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes actions</SelectItem>
                    <SelectItem value="LOGIN">Connexion</SelectItem>
                    <SelectItem value="REQUEST_CREATED">Demande créée</SelectItem>
                    <SelectItem value="REQUEST_APPROVED">Demande approuvée</SelectItem>
                    <SelectItem value="USER_CREATED">Utilisateur créé</SelectItem>
                    <SelectItem value="SYSTEM_ERROR">Erreur système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table des journaux */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Heure</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Aucun journal trouvé avec ces critères
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {new Date(log.created_at).toLocaleString("fr-FR")}
                        </TableCell>
                        <TableCell>{log.user_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getActionLabel(log.action)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {log.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getLevelBadgeVariant(log.level)} className="flex items-center gap-1 w-fit">
                            {getLevelIcon(log.level)}
                            {log.level.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.ip_address}
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
