
"use client";

import { useState, useEffect } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  Euro, 
  TrendingUp, 
  Calendar,
  DollarSign,
  CreditCard
} from "lucide-react";
import { useInterns } from "@/hooks/use-interns";
import { useToast } from "@/hooks/use-toast";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface FinancialData {
  month: string;
  gratifications: number;
  budgetUsed: number;
  budgetTotal: number;
}

export default function FinanceReportsPage() {
  const { interns, loading: internsLoading } = useInterns();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const generateFinancialData = (): FinancialData[] => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      
      const monthInterns = interns.filter(intern => {
        const startDate = new Date(intern.start_date);
        const endDate = new Date(intern.end_date);
        return startDate <= date && endDate >= date;
      }).length;

      const gratifications = monthInterns * 800; // 800€ par stagiaire en moyenne
      const budgetTotal = 50000; // Budget mensuel de 50k€
      
      months.push({
        month: monthName,
        gratifications,
        budgetUsed: gratifications,
        budgetTotal
      });
    }
    
    return months;
  };

  const generateDepartmentCosts = () => {
    const departmentCosts = interns.reduce((acc, intern) => {
      const cost = 800; // Coût moyen par stagiaire
      acc[intern.department] = (acc[intern.department] || 0) + cost;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(departmentCosts).map(([department, cost]) => ({
      department,
      cost
    }));
  };

  const exportFinancialReport = (type: string) => {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'monthly':
        data = generateFinancialData().map(item => ({
          'Mois': item.month,
          'Gratifications (€)': item.gratifications,
          'Budget utilisé (€)': item.budgetUsed,
          'Budget total (€)': item.budgetTotal,
          'Taux d\'utilisation (%)': Math.round((item.budgetUsed / item.budgetTotal) * 100)
        }));
        filename = 'rapport_financier_mensuel';
        break;
      case 'departments':
        data = generateDepartmentCosts().map(item => ({
          'Département': item.department,
          'Coût total (€)': item.cost,
          'Nombre stagiaires': interns.filter(i => i.department === item.department).length,
          'Coût moyen par stagiaire (€)': Math.round(item.cost / interns.filter(i => i.department === item.department).length)
        }));
        filename = 'rapport_couts_departements';
        break;
    }

    const csvContent = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export réussi",
      description: `Le rapport ${type} a été exporté avec succès`
    });
  };

  const getTotalGratifications = () => {
    return generateFinancialData().reduce((sum, month) => sum + month.gratifications, 0);
  };

  const getAverageMonthlyCost = () => {
    const data = generateFinancialData();
    return data.length > 0 ? Math.round(data.reduce((sum, month) => sum + month.gratifications, 0) / data.length) : 0;
  };

  const getBudgetUtilization = () => {
    const data = generateFinancialData();
    const currentMonth = data[data.length - 1];
    return currentMonth ? Math.round((currentMonth.budgetUsed / currentMonth.budgetTotal) * 100) : 0;
  };

  if (internsLoading) {
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
                <p className="mt-4 text-muted-foreground">Chargement des rapports financiers...</p>
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
                <h2 className="text-2xl font-bold tracking-tight">Rapports Financiers</h2>
                <p className="text-muted-foreground">
                  Analysez les coûts et budgets liés aux stagiaires
                </p>
              </div>
              <div className="flex gap-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="quarter">Ce trimestre</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Vue d&apos;ensemble
                </TabsTrigger>
                <TabsTrigger value="budget">
                  <Euro className="mr-2 h-4 w-4" />
                  Budget
                </TabsTrigger>
                <TabsTrigger value="departments">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Départements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Gratifications Totales
                      </CardTitle>
                      <Euro className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{getTotalGratifications()}€</div>
                      <p className="text-xs text-muted-foreground">
                        +15% par rapport au semestre dernier
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Coût Mensuel Moyen
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{getAverageMonthlyCost()}€</div>
                      <p className="text-xs text-muted-foreground">
                        Par mois en moyenne
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Utilisation Budget
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{getBudgetUtilization()}%</div>
                      <p className="text-xs text-muted-foreground">
                        Du budget mensuel utilisé
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Coût par Stagiaire
                      </CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">800€</div>
                      <p className="text-xs text-muted-foreground">
                        Gratification moyenne mensuelle
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Évolution des coûts</CardTitle>
                    <CardDescription>
                      Gratifications versées par mois
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={generateFinancialData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [`${value}€`, 'Montant']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="gratifications" 
                          stroke="#8884d8" 
                          name="Gratifications"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="budget" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Gestion du Budget</h3>
                  <Button onClick={() => exportFinancialReport('monthly')}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter Budget
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Utilisation du budget mensuel</CardTitle>
                    <CardDescription>
                      Comparaison budget alloué vs budget utilisé
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={generateFinancialData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [`${value}€`, 'Montant']} />
                        <Legend />
                        <Bar dataKey="budgetTotal" fill="#e0e7ff" name="Budget total" />
                        <Bar dataKey="budgetUsed" fill="#8884d8" name="Budget utilisé" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Budget restant</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {50000 - (generateFinancialData()[generateFinancialData().length - 1]?.budgetUsed || 0)}€
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Disponible ce mois
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Projection fin d&apos;année</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {getAverageMonthlyCost() * 12}€
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Coût annuel estimé
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="departments" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Coûts par Département</h3>
                  <Button onClick={() => exportFinancialReport('departments')}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter Départements
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition des coûts</CardTitle>
                      <CardDescription>
                        Coûts par département
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={generateDepartmentCosts()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ department, cost }) => `${department}: ${cost}€`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="cost"
                          >
                            {generateDepartmentCosts().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => [`${value}€`, 'Coût']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Détail par département</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {generateDepartmentCosts().map((dept) => {
                          const internCount = interns.filter(i => i.department === dept.department).length;
                          const avgCost = Math.round(dept.cost / internCount);
                          return (
                            <div key={dept.department} className="flex justify-between items-center p-3 border rounded">
                              <div>
                                <h4 className="font-medium">{dept.department}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {internCount} stagiaire{internCount > 1 ? 's' : ''}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{dept.cost}€</p>
                                <p className="text-sm text-muted-foreground">
                                  {avgCost}€/stagiaire
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
