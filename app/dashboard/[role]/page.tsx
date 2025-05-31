"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { 
  Clipboard, 
  GraduationCap, 
  ClipboardCheck, 
  FileText, 
  CalendarCheck, 
  Users,
  AlertTriangle,
  TrendingUp
} from "lucide-react";

import { UserWelcome } from "@/components/dashboard/user-welcome";
import { CardStats } from "@/components/ui/card-stats";
import { useAuthStore } from "@/store/auth-store";
import { useInterns } from "@/hooks/use-interns";
import { useRequests } from "@/hooks/use-requests";

export default function DashboardPage({ params }: { params: { role: string } }) {
  const { user } = useAuthStore();
  const role = params.role;
  const { interns, loading: internsLoading } = useInterns();
  const { requests, loading: requestsLoading } = useRequests(user?.id, user?.role);

  // Validate that the role matches user's actual role
  if (user && user.role !== role) {
    return notFound();
  }

  if (!user) {
    return null;
  }

  // Calculate statistics based on real data
  const totalInterns = interns.length;
  const activeInterns = interns.filter(intern => intern.status === 'active').length;
  const pendingRequests = requests.filter(req => req.status === 'pending').length;
  const approvedRequests = requests.filter(req => req.status === 'approved').length;

  // Role-specific dashboard content
  const getDashboardContent = (userRole: string) => {
    switch (userRole) {
      case "admin":
        return {
          title: "Tableau de bord Administrateur",
          description: "Vue d'ensemble complète de la plateforme",
          stats: [
            {
              title: "Total des stagiaires",
              value: totalInterns.toString(),
              description: "Tous les stagiaires enregistrés",
              icon: <GraduationCap className="h-4 w-4" />,
              trend: "+12% par rapport au mois dernier"
            },
            {
              title: "Stagiaires actifs",
              value: activeInterns.toString(),
              description: "Stagiaires en cours de stage",
              icon: <Users className="h-4 w-4" />,
              trend: "+5% cette semaine"
            },
            {
              title: "Demandes en attente",
              value: pendingRequests.toString(),
              description: "Demandes nécessitant une action",
              icon: <Clipboard className="h-4 w-4" />,
              trend: pendingRequests > 5 ? "Attention requise" : "Situation normale"
            },
            {
              title: "Demandes approuvées",
              value: approvedRequests.toString(),
              description: "Ce mois-ci",
              icon: <ClipboardCheck className="h-4 w-4" />,
              trend: "+23% ce mois"
            }
          ]
        };
      case "hr":
        return {
          title: "Tableau de bord RH",
          description: "Gestion des ressources humaines et des stagiaires",
          stats: [
            {
              title: "Stagiaires sous ma supervision",
              value: totalInterns.toString(),
              description: "Total des stagiaires",
              icon: <GraduationCap className="h-4 w-4" />,
              trend: "+8% ce mois"
            },
            {
              title: "Demandes RH à traiter",
              value: pendingRequests.toString(),
              description: "Nécessitent votre attention",
              icon: <Clipboard className="h-4 w-4" />,
              trend: pendingRequests > 3 ? "Priorité élevée" : "Situation normale"
            },
            {
              title: "Documents générés",
              value: "42",
              description: "Ce mois-ci",
              icon: <FileText className="h-4 w-4" />,
              trend: "+15% vs mois dernier"
            },
            {
              title: "Taux d'approbation",
              value: "94%",
              description: "Demandes approuvées",
              icon: <TrendingUp className="h-4 w-4" />,
              trend: "Excellent niveau"
            }
          ]
        };
      case "finance":
        return {
          title: "Tableau de bord Finance",
          description: "Suivi financier et budgétaire des stages",
          stats: [
            {
              title: "Budget stages",
              value: "€15,420",
              description: "Utilisé ce mois",
              icon: <TrendingUp className="h-4 w-4" />,
              trend: "78% du budget mensuel"
            },
            {
              title: "Demandes financières",
              value: requests.filter(r => r.type === 'prolongation').length.toString(),
              description: "En attente de validation",
              icon: <Clipboard className="h-4 w-4" />,
              trend: "Normal"
            },
            {
              title: "Paiements traités",
              value: "23",
              description: "Cette semaine",
              icon: <ClipboardCheck className="h-4 w-4" />,
              trend: "+12% vs semaine dernière"
            },
            {
              title: "Économies réalisées",
              value: "€2,340",
              description: "Grâce à l'automatisation",
              icon: <FileText className="h-4 w-4" />,
              trend: "+18% d'efficacité"
            }
          ]
        };
      case "tutor":
        const myInterns = interns.filter(intern => intern.tutor_id === user?.id);
        const myRequests = requests.filter(req => 
          myInterns.some(intern => intern.id === req.intern_id)
        );
        return {
          title: "Tableau de bord Tuteur",
          description: "Suivi de vos stagiaires et de leurs demandes",
          stats: [
            {
              title: "Mes stagiaires",
              value: myInterns.length.toString(),
              description: "Stagiaires sous ma tutelle",
              icon: <GraduationCap className="h-4 w-4" />,
              trend: myInterns.length > 0 ? "Actif" : "Aucun stagiaire"
            },
            {
              title: "Demandes à examiner",
              value: myRequests.filter(r => r.status === 'pending').length.toString(),
              description: "Nécessitent votre validation",
              icon: <Clipboard className="h-4 w-4" />,
              trend: "À traiter rapidement"
            },
            {
              title: "Progression moyenne",
              value: myInterns.length > 0 ? 
                Math.round(myInterns.reduce((acc, intern) => acc + intern.progress, 0) / myInterns.length) + "%" : 
                "0%",
              description: "De mes stagiaires",
              icon: <TrendingUp className="h-4 w-4" />,
              trend: "Bon progrès"
            },
            {
              title: "Évaluations complétées",
              value: "5",
              description: "Ce mois-ci",
              icon: <ClipboardCheck className="h-4 w-4" />,
              trend: "À jour"
            }
          ]
        };
      case "intern":
        const myInternRecord = interns.find(intern => intern.user_id === user?.id);
        const myPersonalRequests = requests.filter(req => 
          req.intern_id === myInternRecord?.id
        );
        return {
          title: "Mon espace stagiaire",
          description: "Suivi de votre stage et de vos demandes",
          stats: [
            {
              title: "Progression du stage",
              value: myInternRecord ? myInternRecord.progress + "%" : "0%",
              description: "Objectifs atteints",
              icon: <TrendingUp className="h-4 w-4" />,
              trend: myInternRecord && myInternRecord.progress >= 75 ? "Excellent" : "En cours"
            },
            {
              title: "Mes demandes",
              value: myPersonalRequests.length.toString(),
              description: "Total soumises",
              icon: <Clipboard className="h-4 w-4" />,
              trend: "Suivi actif"
            },
            {
              title: "Demandes approuvées",
              value: myPersonalRequests.filter(r => r.status === 'approved').length.toString(),
              description: "Validées par les tuteurs",
              icon: <ClipboardCheck className="h-4 w-4" />,
              trend: "Bon taux"
            },
            {
              title: "Jours restants",
              value: myInternRecord ? 
                Math.max(0, Math.ceil((new Date(myInternRecord.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))).toString() :
                "N/A",
              description: "Avant la fin du stage",
              icon: <CalendarCheck className="h-4 w-4" />,
              trend: "Planification"
            }
          ]
        };
      default:
        return {
          title: "Tableau de bord",
          description: "Bienvenue sur votre espace",
          stats: []
        };
    }
  };

  const dashboardContent = getDashboardContent(role);

  if (internsLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{dashboardContent.title}</h2>
      </div>

      <UserWelcome user={user} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardContent.stats.map((stat, index) => (
          <CardStats
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {pendingRequests > 0 && (role === 'hr' || role === 'tutor' || role === 'admin') && (
        <div className="mt-8 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Demandes en attente
              </h3>
              <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                Vous avez {pendingRequests} demande(s) qui nécessitent votre attention.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}