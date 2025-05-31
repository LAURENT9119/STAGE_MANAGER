"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRequests } from "@/hooks/use-requests"
import { useAuthStore } from "@/store/auth-store"
import { useInterns } from "@/hooks/use-interns"
import { Plus, Upload } from "lucide-react"

interface CreateRequestDialogProps {
  children?: React.ReactNode
}

export function CreateRequestDialog({ children }: CreateRequestDialogProps) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const { createRequest } = useRequests()
  const { user } = useAuthStore()
  const { interns } = useInterns()

  // Find the intern record for the current user
  const currentIntern = interns.find(intern => intern.user_id === user?.id)

  const resetForm = () => {
    setType("")
    setTitle("")
    setDescription("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentIntern) {
      toast({
        title: "Erreur",
        description: "Impossible de trouver votre profil de stagiaire",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await createRequest({
        intern_id: currentIntern.id,
        type: type as any,
        title,
        description,
      })

      if (error) {
        throw new Error(error)
      }

      toast({
        title: "Demande créée",
        description: "Votre demande a été soumise avec succès",
      })

      resetForm()
      setOpen(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTypeLabel = (value: string) => {
    const types = {
      convention: "Convention de stage",
      prolongation: "Prolongation de stage",
      conge: "Demande de congé",
      gratification: "Demande de gratification",
      evaluation: "Demande d'évaluation"
    }
    return types[value as keyof typeof types] || value
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
            <DialogTitle>Créer une nouvelle demande</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire pour soumettre une nouvelle demande
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type de demande</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de demande" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="convention">Convention de stage</SelectItem>
                <SelectItem value="prolongation">Prolongation de stage</SelectItem>
                <SelectItem value="conge">Demande de congé</SelectItem>
                <SelectItem value="gratification">Demande de gratification</SelectItem>
                <SelectItem value="evaluation">Demande d'évaluation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de votre demande"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre demande en détail..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Pièces jointes (optionnel)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Glissez-déposez vos fichiers ici ou cliquez pour parcourir
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, Images jusqu'à 10MB
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer la demande"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}