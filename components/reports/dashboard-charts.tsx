
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface DashboardChartsProps {
  data?: {
    totalInterns: number
    activeInterns: number
    completedInterns: number
    pendingRequests: number
    monthlyStats: Array<{ month: string; interns: number; requests: number }>
  }
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  // Mock data if none provided
  const defaultData = {
    totalInterns: 24,
    activeInterns: 18,
    completedInterns: 6,
    pendingRequests: 8,
    monthlyStats: [
      { month: 'Jan', interns: 15, requests: 12 },
      { month: 'Fév', interns: 18, requests: 15 },
      { month: 'Mar', interns: 22, requests: 18 },
      { month: 'Avr', interns: 24, requests: 20 },
    ]
  }

  const stats = data || defaultData

  const cards = [
    {
      title: "Total Stagiaires",
      value: stats.totalInterns,
      description: "Nombre total de stagiaires",
      icon: <Users className="h-4 w-4 text-blue-600" />,
      trend: "+12%",
      trendDirection: "up"
    },
    {
      title: "Stagiaires Actifs",
      value: stats.activeInterns,
      description: "Actuellement en stage",
      icon: <Clock className="h-4 w-4 text-green-600" />,
      trend: "+8%",
      trendDirection: "up"
    },
    {
      title: "Stages Terminés",
      value: stats.completedInterns,
      description: "Ce mois-ci",
      icon: <CheckCircle className="h-4 w-4 text-purple-600" />,
      trend: "+3%",
      trendDirection: "up"
    },
    {
      title: "Demandes en Attente",
      value: stats.pendingRequests,
      description: "Nécessitent une action",
      icon: <AlertCircle className="h-4 w-4 text-orange-600" />,
      trend: "-5%",
      trendDirection: "down"
    }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
              <div className="flex items-center mt-2">
                {card.trendDirection === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={`text-xs ${
                  card.trendDirection === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {card.trend}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  par rapport au mois dernier
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution mensuelle</CardTitle>
            <CardDescription>
              Nombre de stagiaires et demandes par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.monthlyStats.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="font-medium">{month.month}</div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-sm">{month.interns} stagiaires</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-sm">{month.requests} demandes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par statut</CardTitle>
            <CardDescription>
              Distribution des stagiaires par statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="default">En cours</Badge>
                </div>
                <span className="font-medium">{stats.activeInterns}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Terminé</Badge>
                </div>
                <span className="font-medium">{stats.completedInterns}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">À venir</Badge>
                </div>
                <span className="font-medium">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques de performance</CardTitle>
          <CardDescription>
            Indicateurs clés de performance du programme de stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-muted-foreground">Taux de satisfaction</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">4.2j</div>
              <div className="text-sm text-muted-foreground">Temps moyen de traitement</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-sm text-muted-foreground">Taux de conversion emploi</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
