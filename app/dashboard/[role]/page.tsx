import { notFound } from "next/navigation";
import { Metadata } from "next";
import { 
  Clipboard, 
  GraduationCap, 
  ClipboardCheck, 
  FileText, 
  CalendarCheck, 
  Users,
  AlertTriangle
} from "lucide-react";

import { MOCK_USERS, UserRole } from "@/lib/utils";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { UserWelcome } from "@/components/dashboard/user-welcome";
import { CardStats } from "@/components/ui/card-stats";

export const metadata: Metadata = {
  title: "Tableau de bord | Stage+",
  description: "Tableau de bord de gestion des stagiaires",
};

// This is required for static site generation with dynamic routes
export async function generateStaticParams() {
  return [
    { role: 'intern' },
    { role: 'tutor' },
    { role: 'hr' },
    { role: 'finance' },
    { role: 'admin' }
  ];
}

export default function DashboardPage({ params }: { params: { role: string } }) {
  const role = params.role as UserRole;
  
  // Validate that the role is valid
  if (!["intern", "tutor", "hr", "finance", "admin"].includes(role)) {
    return notFound();
  }
  
  // Mock user data based on role
  const mockEmail = `${role}@example.com`;
  const user = MOCK_USERS[mockEmail];
  
  if (!user) {
    return notFound();
  }
  
  // Role-specific dashboard content
  const dashboardContent = getDashboardContent(role);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav role={role} />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <DashboardNav role={role} />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <UserWelcome user={user} />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardContent.stats.map((stat, index) => (
              <CardStats
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                description={stat.description}
              />
            ))}
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Activité récente</h3>
            {dashboardContent.activities.length > 0 ? (
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Statut</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Détails</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardContent.activities.map((activity, index) => (
                        <tr 
                          key={index} 
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{activity.date}</td>
                          <td className="p-4 align-middle">{activity.type}</td>
                          <td className="p-4 align-middle">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(activity.status)}`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="p-4 align-middle">{activity.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-md border p-8">
                <div className="flex flex-col items-center text-center">
                  <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">Aucune activité récente</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Il n&apos;y a pas d&apos;activité récente à afficher pour le moment.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {dashboardContent.alerts && dashboardContent.alerts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Alertes</h3>
              <div className="space-y-4">
                {dashboardContent.alerts.map((alert, index) => (
                  <div key={index} className={`p-4 rounded-md ${getAlertClass(alert.type)}`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium">{alert.title}</h3>
                        <p className="mt-2 text-sm">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}

function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'en attente':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'validé':
    case 'validée':
    case 'complété':
    case 'complétée':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'refusé':
    case 'refusée':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'en cours':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

function getAlertClass(type: string): string {
  switch (type.toLowerCase()) {
    case 'warning':
      return 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'success':
      return 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'error':
      return 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'info':
      return 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    default:
      return 'bg-gray-50 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300';
  }
}

interface DashboardContent {
  stats: {
    title: string;
    value: string | number;
    icon?: any;
    trend?: {
      value: number;
      isPositive: boolean;
    };
    description?: string;
  }[];
  activities: {
    date: string;
    type: string;
    status: string;
    details: string;
  }[];
  alerts?: {
    type: string;
    title: string;
    message: string;
  }[];
}

function getDashboardContent(role: UserRole): DashboardContent {
  switch (role) {
    case 'intern':
      return {
        stats: [
          { 
            title: "Demandes en cours", 
            value: 2, 
            icon: Clipboard,
            description: "Demandes en attente de validation"
          },
          { 
            title: "Demandes validées", 
            value: 5, 
            icon: ClipboardCheck,
            description: "Demandes approuvées"
          },
          { 
            title: "Documents", 
            value: 8, 
            icon: FileText,
            description: "Documents disponibles"
          },
          { 
            title: "Jours restants", 
            value: 45, 
            icon: CalendarCheck,
            description: "Jours restants de stage"
          },
        ],
        activities: [
          {
            date: "06/05/2025",
            type: "Demande de congé",
            status: "En attente",
            details: "2 jours - 15-16 mai 2025"
          },
          {
            date: "01/05/2025",
            type: "Évaluation mi-parcours",
            status: "Complétée",
            details: "Soumise par Marie Laurent"
          },
          {
            date: "28/04/2025",
            type: "Demande de prolongation",
            status: "Validée",
            details: "Prolongation de 2 semaines"
          },
          {
            date: "15/04/2025",
            type: "Convention",
            status: "Validée",
            details: "Convention signée par toutes les parties"
          },
        ],
        alerts: [
          {
            type: "warning",
            title: "Évaluation finale à compléter",
            message: "L'évaluation finale de votre stage doit être complétée avant le 30/05/2025."
          }
        ]
      };
    
    case 'tutor':
      return {
        stats: [
          { 
            title: "Stagiaires actifs", 
            value: 5, 
            icon: GraduationCap,
            description: "Stagiaires sous votre supervision"
          },
          { 
            title: "Demandes à valider", 
            value: 3, 
            icon: Clipboard,
            description: "Demandes en attente de votre validation"
          },
          { 
            title: "Évaluations à faire", 
            value: 2, 
            icon: ClipboardCheck,
            description: "Évaluations en attente"
          },
          { 
            title: "Conventions", 
            value: 7, 
            icon: FileText,
            description: "Conventions actives"
          },
        ],
        activities: [
          {
            date: "06/05/2025",
            type: "Demande de congé",
            status: "En attente",
            details: "Jean Dupont - 2 jours (15-16 mai)"
          },
          {
            date: "05/05/2025",
            type: "Demande de prolongation",
            status: "En attente",
            details: "Lucie Martin - 3 semaines"
          },
          {
            date: "03/05/2025",
            type: "Évaluation à mi-parcours",
            status: "Complétée",
            details: "Alex Petit - Excellente progression"
          },
          {
            date: "02/05/2025",
            type: "Nouvelle convention",
            status: "Validée",
            details: "Thomas Dubois - Stage de 3 mois"
          },
        ],
        alerts: [
          {
            type: "warning",
            title: "Évaluations en retard",
            message: "2 évaluations n'ont pas été complétées dans les délais prévus."
          },
          {
            type: "info",
            title: "Nouveaux stagiaires",
            message: "Un nouveau stagiaire rejoindra votre équipe le 15/05/2025."
          }
        ]
      };
    
    case 'hr':
      return {
        stats: [
          { 
            title: "Stagiaires actifs", 
            value: 24, 
            icon: GraduationCap,
            trend: {
              value: 12,
              isPositive: true
            },
            description: "Total des stagiaires actifs"
          },
          { 
            title: "Demandes en cours", 
            value: 8, 
            icon: Clipboard,
            description: "Demandes nécessitant une action"
          },
          { 
            title: "Conventions ce mois", 
            value: 7, 
            icon: FileText,
            trend: {
              value: 4,
              isPositive: true
            },
            description: "Nouvelles conventions ce mois"
          },
          { 
            title: "Évaluations", 
            value: "92%", 
            icon: ClipboardCheck,
            description: "Taux de complétion des évaluations"
          },
        ],
        activities: [
          {
            date: "06/05/2025",
            type: "Convention",
            status: "En attente",
            details: "Emma Bernard - Service Marketing"
          },
          {
            date: "05/05/2025",
            type: "Prolongation",
            status: "Validée",
            details: "Jean Dupont - Service IT"
          },
          {
            date: "04/05/2025",
            type: "Fin de stage",
            status: "Complétée",
            details: "Sophie Martin - Service Juridique"
          },
          {
            date: "03/05/2025",
            type: "Nouvelle demande",
            status: "En cours",
            details: "Lucas Petit - Service Communication"
          },
        ],
        alerts: [
          {
            type: "warning",
            title: "Conventions à signer",
            message: "3 conventions nécessitent votre signature avant le 10/05/2025."
          },
          {
            type: "info",
            title: "Campagne de recrutement",
            message: "La campagne de recrutement des stagiaires d'été commence le 15/05/2025."
          }
        ]
      };
    
    case 'finance':
      return {
        stats: [
          { 
            title: "Gratifications", 
            value: "26 450 €", 
            icon: FileText,
            trend: {
              value: 5,
              isPositive: false
            },
            description: "Total des gratifications ce mois"
          },
          { 
            title: "Conventions à traiter", 
            value: 5, 
            icon: Clipboard,
            description: "Conventions en attente de validation"
          },
          { 
            title: "Budget stage", 
            value: "68%", 
            icon: GraduationCap,
            description: "Budget annuel consommé"
          },
          { 
            title: "Paiements en attente", 
            value: 3, 
            icon: AlertTriangle,
            description: "Paiements à traiter"
          },
        ],
        activities: [
          {
            date: "06/05/2025",
            type: "Gratification",
            status: "En cours",
            details: "Traitement du lot de mai - 22 stagiaires"
          },
          {
            date: "05/05/2025",
            type: "Convention",
            status: "Validée",
            details: "Thomas Dubois - Gratification 800€/mois"
          },
          {
            date: "03/05/2025",
            type: "Budget",
            status: "Complété",
            details: "Mise à jour du budget stages 2025"
          },
          {
            date: "01/05/2025",
            type: "Paiement",
            status: "Validé",
            details: "Régularisation gratification avril"
          },
        ],
        alerts: [
          {
            type: "warning",
            title: "Fin d'année fiscale",
            message: "Préparation des rapports de fin d'année fiscale à prévoir pour le 30/05/2025."
          }
        ]
      };
    
    case 'admin':
      return {
        stats: [
          { 
            title: "Utilisateurs", 
            value: 87, 
            icon: Users,
            trend: {
              value: 12,
              isPositive: true
            },
            description: "Utilisateurs actifs"
          },
          { 
            title: "Stagiaires", 
            value: 24, 
            icon: GraduationCap,
            description: "Stagiaires actifs"
          },
          { 
            title: "Tuteurs", 
            value: 18, 
            icon: Users,
            description: "Tuteurs actifs"
          },
          { 
            title: "Demandes", 
            value: 156, 
            icon: Clipboard,
            trend: {
              value: 23,
              isPositive: true
            },
            description: "Demandes ce mois"
          },
        ],
        activities: [
          {
            date: "06/05/2025",
            type: "Nouvel utilisateur",
            status: "Complété",
            details: "Création compte RH - Sophie Dubois"
          },
          {
            date: "05/05/2025",
            type: "Mise à jour système",
            status: "Complétée",
            details: "Mise à jour des modèles de documents"
          },
          {
            date: "04/05/2025",
            type: "Backup",
            status: "Complété",
            details: "Sauvegarde mensuelle des données"
          },
          {
            date: "01/05/2025",
            type: "Maintenance",
            status: "Complétée",
            details: "Maintenance planifiée du système"
          },
        ],
        alerts: [
          {
            type: "warning",
            title: "Mises à jour requises",
            message: "Des mises à jour de sécurité sont disponibles pour 2 modules."
          },
          {
            type: "info",
            title: "Nouveaux modèles",
            message: "Les nouveaux modèles de convention sont prêts à être déployés."
          }
        ]
      };
    
    default:
      return {
        stats: [],
        activities: []
      };
  }
}