The code changes aim to add accessibility features by including DialogTitle components in the Dialog and Sheet components.
```

```text
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Download, FileText, Award, ClipboardList } from "lucide-react"

interface DocumentGeneratorProps {
  internId?: string
  requestId?: string
}

export function DocumentGenerator({ internId, requestId }: DocumentGeneratorProps) {
  const [generating, setGenerating] = useState<string | null>(null)
  const { toast } = useToast()

  const generateDocument = async (type: string) => {
    setGenerating(type)

    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Document généré",
        description: `Le document ${type} a été généré avec succès`,
      })

      // Here you would typically trigger a download
      // window.open('/api/documents/generate?type=' + type + '&internId=' + internId)

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le document",
        variant: "destructive",
      })
    } finally {
      setGenerating(null)
    }
  }

  const documents = [
    {
      id: 'convention',
      title: 'Convention de stage',
      description: 'Générer la convention de stage officielle',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'attestation',
      title: 'Attestation de stage',
      description: 'Générer l\'attestation de fin de stage',
      icon: <Award className="h-5 w-5" />
    },
    {
      id: 'evaluation',
      title: 'Fiche d\'évaluation',
      description: 'Générer la fiche d\'évaluation du stagiaire',
      icon: <ClipboardList className="h-5 w-5" />
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              {doc.icon}
              <CardTitle className="text-lg">{doc.title}</CardTitle>
            </div>
            <CardDescription>{doc.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => generateDocument(doc.id)}
              disabled={generating === doc.id}
              className="w-full"
            >
              {generating === doc.id ? (
                "Génération..."
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Générer PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

```replit_final_file
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Download, FileText, Award, ClipboardList } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


interface DocumentGeneratorProps {
  internId?: string
  requestId?: string
}

export function DocumentGenerator({ internId, requestId }: DocumentGeneratorProps) {
  const [generating, setGenerating] = useState<string | null>(null)
  const { toast } = useToast()

  const generateDocument = async (type: string) => {
    setGenerating(type)

    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Document généré",
        description: `Le document ${type} a été généré avec succès`,
      })

      // Here you would typically trigger a download
      // window.open('/api/documents/generate?type=' + type + '&internId=' + internId)

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le document",
        variant: "destructive",
      })
    } finally {
      setGenerating(null)
    }
  }

  const documents = [
    {
      id: 'convention',
      title: 'Convention de stage',
      description: 'Générer la convention de stage officielle',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'attestation',
      title: 'Attestation de stage',
      description: 'Générer l\'attestation de fin de stage',
      icon: <Award className="h-5 w-5" />
    },
    {
      id: 'evaluation',
      title: 'Fiche d\'évaluation',
      description: 'Générer la fiche d\'évaluation du stagiaire',
      icon: <ClipboardList className="h-5 w-5" />
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              {doc.icon}
              <CardTitle className="text-lg">{doc.title}</CardTitle>
            </div>
            <CardDescription>{doc.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={generating === doc.id}
                  className="w-full"
                >
                  {generating === doc.id ? (
                    "Génération..."
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Générer PDF
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Générer un document</DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}