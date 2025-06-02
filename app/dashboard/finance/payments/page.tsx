"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MainNav } from '@/components/layout/main-nav';
import { DashboardNav } from '@/components/layout/dashboard-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { supabase } from '@/lib/supabase';
import { Download, Search, Filter, Plus } from 'lucide-react';

interface Payment {
  id: string;
  intern_id: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  payment_date?: string;
  created_at: string;
  intern?: {
    user?: {
      full_name: string;
      email: string;
    };
  };
}

export default function FinancePaymentsPage() {
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          intern:interns(
            user:users(full_name, email)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: newStatus,
          payment_date: newStatus === 'paid' ? new Date().toISOString() : null
        })
        .eq('id', paymentId);

      if (error) throw error;

      setPayments(payments.map(p => 
        p.id === paymentId 
          ? { ...p, status: newStatus as Payment['status'], payment_date: newStatus === 'paid' ? new Date().toISOString() : p.payment_date }
          : p
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  const filteredPayments = payments.filter(payment => {
    const internName = payment.intern?.user?.full_name || '';
    const internEmail = payment.intern?.user?.email || '';
    const matchesSearch = internName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  if (!user || (user.role !== 'finance' && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertDescription>
            Accès non autorisé. Seuls les membres de l'équipe finance peuvent accéder à cette page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <DashboardNav role="finance" />
        </aside>

        <main className="flex w-full flex-col overflow-hidden py-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestion des paiements</h1>
              <p className="text-muted-foreground">
                Gérez les paiements et indemnités des stagiaires
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total des paiements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAmount.toFixed(2)} €</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredPayments.filter(p => p.status === 'pending').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredPayments.filter(p => p.status === 'approved').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Payés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredPayments.filter(p => p.status === 'paid').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtres et recherche */}
            <Card>
              <CardHeader>
                <CardTitle>Filtres et recherche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher par stagiaire ou description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvé</option>
                    <option value="paid">Payé</option>
                    <option value="rejected">Rejeté</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Liste des paiements */}
            <Card>
              <CardHeader>
                <CardTitle>Paiements ({filteredPayments.length})</CardTitle>
                <CardDescription>
                  Liste de tous les paiements enregistrés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : filteredPayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun paiement trouvé
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{payment.intern?.user?.full_name || 'Stagiaire inconnu'}</h3>
                            <Badge className={getStatusBadgeColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{payment.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Montant: {payment.amount.toFixed(2)} €</span>
                            <span>Créé le {new Date(payment.created_at).toLocaleDateString('fr-FR')}</span>
                            {payment.payment_date && (
                              <span>Payé le {new Date(payment.payment_date).toLocaleDateString('fr-FR')}</span>
                            )}
                          </div>
                        </div>
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
                                variant="destructive"
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}