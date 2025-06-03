
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

interface EvaluationFormProps {
  internId: string
  onSubmit?: (evaluation: any) => void
}

export function EvaluationForm({ internId, onSubmit }: EvaluationFormProps) {
  const [evaluation, setEvaluation] = useState({
    technical_skills: [3],
    communication: [3],
    initiative: [3],
    punctuality: [3],
    team_work: [3],
    overall_rating: [3],
    strengths: "",
    improvements: "",
    comments: "",
    recommendation: "continue"
  })

  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const evaluationData = {
      intern_id: internId,
      ...evaluation,
      technical_skills: evaluation.technical_skills[0],
      communication: evaluation.communication[0],
      initiative: evaluation.initiative[0],
      punctuality: evaluation.punctuality[0],
      team_work: evaluation.team_work[0],
      overall_rating: evaluation.overall_rating[0],
      created_at: new Date().toISOString()
    }

    onSubmit?.(evaluationData)
    
    toast({
      title: "Évaluation soumise",
      description: "L'évaluation a été enregistrée avec succès",
    })
  }

  const criteriaLabels = {
    technical_skills: "Compétences techniques",
    communication: "Communication",
    initiative: "Initiative",
    punctuality: "Ponctualité",
    team_work: "Travail d'équipe",
    overall_rating: "Note globale"
  }

  const getRatingLabel = (value: number) => {
    const labels = ["Très insuffisant", "Insuffisant", "Satisfaisant", "Bien", "Excellent"]
    return labels[value - 1] || "Non évalué"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Évaluation du stagiaire</CardTitle>
          <CardDescription>
            Évaluez les différents aspects de la performance du stagiaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(criteriaLabels).map(([key, label]) => (
            <div key={key} className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor={key}>{label}</Label>
                <span className="text-sm font-medium">
                  {getRatingLabel(evaluation[key as keyof typeof evaluation][0])}
                </span>
              </div>
              <Slider
                id={key}
                min={1}
                max={5}
                step={1}
                value={evaluation[key as keyof typeof evaluation]}
                onValueChange={(value) =>
                  setEvaluation(prev => ({ ...prev, [key]: value }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 - Très insuffisant</span>
                <span>5 - Excellent</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commentaires détaillés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strengths">Points forts</Label>
            <Textarea
              id="strengths"
              placeholder="Décrivez les points forts du stagiaire..."
              value={evaluation.strengths}
              onChange={(e) =>
                setEvaluation(prev => ({ ...prev, strengths: e.target.value }))
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="improvements">Axes d'amélioration</Label>
            <Textarea
              id="improvements"
              placeholder="Suggestions pour améliorer les performances..."
              value={evaluation.improvements}
              onChange={(e) =>
                setEvaluation(prev => ({ ...prev, improvements: e.target.value }))
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Commentaires généraux</Label>
            <Textarea
              id="comments"
              placeholder="Commentaires additionnels..."
              value={evaluation.comments}
              onChange={(e) =>
                setEvaluation(prev => ({ ...prev, comments: e.target.value }))
              }
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommandation</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={evaluation.recommendation}
            onValueChange={(value) =>
              setEvaluation(prev => ({ ...prev, recommendation: value }))
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="continue" id="continue" />
              <Label htmlFor="continue">Continuer le stage</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="extend" id="extend" />
              <Label htmlFor="extend">Proposer une prolongation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hire" id="hire" />
              <Label htmlFor="hire">Recommander pour un poste</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="concerns" id="concerns" />
              <Label htmlFor="concerns">Amélioration nécessaire</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Enregistrer comme brouillon
        </Button>
        <Button type="submit">
          Soumettre l'évaluation
        </Button>
      </div>
    </form>
  )
}
